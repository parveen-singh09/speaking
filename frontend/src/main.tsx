import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import { App } from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

if (navigator.storage?.persist) {
  void navigator.storage.persist()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
