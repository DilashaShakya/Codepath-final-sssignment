import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function EditPostPage({ getPost, updatePost }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const post = getPost(id)

  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? '')

  if (!post) {
    return (
      <div>
        <p>Post not found.</p>
        <Link to="/">Back to feed</Link>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    await updatePost(id, {
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim(),
    })
    navigate(`/post/${id}`)
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h1>Edit Post</h1>

      <label htmlFor="title">Title *</label>
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label htmlFor="content">Content</label>
      <textarea id="content" rows={6} value={content} onChange={(e) => setContent(e.target.value)} />

      <label htmlFor="imageUrl">Image URL</label>
      <input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <div className="post-actions">
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <Link to={`/post/${id}`} className="btn">Cancel</Link>
      </div>
    </form>
  )
}
