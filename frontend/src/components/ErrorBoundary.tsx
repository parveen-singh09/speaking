import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }
    return (
      <main className="errorpage">
        <div className="errorpage-inner">
          <span className="errorpage-glyph" aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </span>
          <h1>Something went wrong</h1>
          <p>The app hit an unexpected error. Reloading usually fixes it.</p>
          <div className="errorpage-actions">
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
            <button
              className="btn btn-soft btn-lg"
              type="button"
              onClick={() => {
                window.location.href = '/'
              }}
            >
              Go to start
            </button>
          </div>
        </div>
      </main>
    )
  }
}
