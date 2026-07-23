import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function PostPage({ getPost, upvotePost, deletePost, addComment }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const post = getPost(id)
  const [commentText, setCommentText] = useState('')

  if (!post) {
    return (
      <div>
        <p>Post not found.</p>
        <Link to="/">Back to feed</Link>
      </div>
    )
  }

  async function handleDelete() {
    if (confirm('Delete this post? This cannot be undone.')) {
      await deletePost(id)
      navigate('/')
    }
  }

  async function handleComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    await addComment(id, commentText.trim())
    setCommentText('')
  }

  return (
    <div className="post-page">
      <Link to="/" className="back-link">← Back to feed</Link>

      <h1>{post.title}</h1>
      <p className="post-meta">{new Date(post.createdAt).toLocaleString()}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="post-image" />
      )}

      {post.content && <p className="post-content">{post.content}</p>}

      <div className="post-actions">
        <button className="btn" onClick={() => upvotePost(id)}>▲ Upvote ({post.upvotes})</button>
        <Link to={`/post/${id}/edit`} className="btn">Edit</Link>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>

      <section className="comments">
        <h2>Comments ({post.comments.length})</h2>
        <form onSubmit={handleComment} className="comment-form">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit" className="btn btn-primary">Post</button>
        </form>
        <ul className="comment-list">
          {post.comments.map((c) => (
            <li key={c.id} className="comment">
              <p>{c.text}</p>
              <span className="comment-time">{new Date(c.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
