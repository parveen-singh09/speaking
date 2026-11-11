import { Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Friends } from './pages/Friends'
import { Chat } from './pages/Chat'
import { FriendProfile } from './pages/FriendProfile'
import { CallHistory } from './pages/CallHistory'
import { Onboarding } from './pages/Onboarding'
import { NotFound } from './pages/NotFound'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CallProvider } from './components/CallProvider'

export function App() {
  return (
    <CallProvider>
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
      <Route
        path="/user/:userId"
        element={
          <ProtectedRoute>
            <FriendProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calls"
        element={
          <ProtectedRoute>
            <CallHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CallProvider>
  )
}
