import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      {/* 公开页面，使用带侧边栏的布局 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="posts/:slug" element={<PostPage />} />
      </Route>

      {/* 管理后台路由，不使用 Layout 布局 */}
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App