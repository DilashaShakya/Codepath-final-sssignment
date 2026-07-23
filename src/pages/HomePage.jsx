import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function HomePage({ posts }) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const visiblePosts = useMemo(() => {
    let list = posts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()),
    )
    list = [...list].sort((a, b) =>
      sortBy === 'upvotes' ? b.upvotes - a.upvotes : b.createdAt - a.createdAt,
    )
    return list
  }, [posts, query, sortBy])

  return (
    <div className="home-page">
      <div className="controls">
        <input
          type="search"
          placeholder="Search posts by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="newest">Newest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
      </div>

      {visiblePosts.length === 0 && (
        <p className="empty-state">No posts yet. Be the first to create one!</p>
      )}

      <ul className="post-list">
        {visiblePosts.map((post) => (
          <li key={post.id} className="post-card">
            <Link to={`/post/${post.id}`} className="post-card-link">
              <span className="post-time">{timeAgo(post.createdAt)}</span>
              <h2 className="post-title">{post.title}</h2>
              <span className="post-upvotes">▲ {post.upvotes}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
