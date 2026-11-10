import { Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Friends } from './pages/Friends'
import { Chat } from './pages/Chat'
import { ProtectedRoute } from './components/ProtectedRoute'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:friendId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
