import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreatePostPage({ createPost }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    const id = await createPost({
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim(),
    })
    if (id) navigate(`/post/${id}`)
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h1>Create a Post</h1>

      <label htmlFor="title">Title *</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="content">Content (optional)</label>
      <textarea
        id="content"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label htmlFor="imageUrl">Image URL (optional)</label>
      <input
        id="imageUrl"
        type="url"
        placeholder="https://example.com/image.jpg"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button type="submit" className="btn btn-primary">Publish</button>
    </form>
  )
}
