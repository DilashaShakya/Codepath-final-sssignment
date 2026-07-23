import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function mapPost(row, comments = []) {
    return {
        id: row.id,
        title: row.title,
        content: row.content,
        imageUrl: row.image_url,
        upvotes: row.upvotes,
        createdAt: new Date(row.created_at).getTime(),
        comments: comments.map((c) => ({
            id: c.id,
            text: c.text,
            createdAt: new Date(c.created_at).getTime(),
        })),
    }
    }

export function usePosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const refresh = useCallback(async () => {
    const { data: postRows, error: postsErr } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        if (postsErr) {
            console.error(postsErr)
        return
        }

    const { data: commentRows, error: commentsErr } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: true })
    if (commentsErr) console.error(commentsErr)

    const commentsByPost = {}
    for (const c of commentRows ?? []) {
        ;(commentsByPost[c.post_id] ??= []).push(c)
    }

    setPosts(postRows.map((row) => mapPost(row, commentsByPost[row.id])))
    setLoading(false)
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
        refresh()
    }, [refresh])

    const createPost = useCallback(async ({ title, content, imageUrl }) => {
    const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, image_url: imageUrl })
    .select()
    .single()
    if (error) {
        console.error(error)
        return null
    }
    await refresh()
    return data.id
}, [refresh])

    const updatePost = useCallback(async (id, { title, content, imageUrl }) => {
    const { error } = await supabase
    .from('posts')
    .update({ title, content, image_url: imageUrl })
    .eq('id', id)
    if (error) console.error(error)
    await refresh()
}, [refresh])

    const deletePost = useCallback(async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
        if (error) console.error(error)
        await refresh()
    }, [refresh])

    const upvotePost = useCallback(async (id) => {
    const post = posts.find((p) => p.id === id)
    if (!post) return
    const { error } = await supabase
    .from('posts')
    .update({ upvotes: post.upvotes + 1 })
    .eq('id', id)
    if (error) console.error(error)
    await refresh()
}, [posts, refresh])

    const addComment = useCallback(async (id, text) => {
    const { error } = await supabase
    .from('comments')
    .insert({ post_id: id, text })
    if (error) console.error(error)
    await refresh()
}, [refresh])

    const getPost = useCallback((id) => posts.find((p) => p.id === id), [posts])

    return { posts, loading, createPost, updatePost, deletePost, upvotePost, addComment, getPost }
}
