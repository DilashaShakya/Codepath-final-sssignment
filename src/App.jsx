import { Routes, Route, Link } from 'react-router-dom'
import { usePosts } from './usePosts'
import HomePage from './pages/HomePage'
import CreatePostPage from './pages/CreatePostPage'
import PostPage from './pages/PostPage'
import EditPostPage from './pages/EditPostPage'
import './App.css'

function App() {
  const postsApi = usePosts()

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">🌹 Rose Board</Link>
        <Link to="/create" className="btn btn-primary">+ New Post</Link>
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage {...postsApi} />} />
          <Route path="/create" element={<CreatePostPage {...postsApi} />} />
          <Route path="/post/:id" element={<PostPage {...postsApi} />} />
          <Route path="/post/:id/edit" element={<EditPostPage {...postsApi} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
