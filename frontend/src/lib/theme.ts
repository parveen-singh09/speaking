import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

function current(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

const listeners = new Set<() => void>()

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem('theme', theme)
  } catch {
  }
  listeners.forEach((cb) => cb())
}

export function toggleTheme() {
  setTheme(current() === 'dark' ? 'light' : 'dark')
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, current, () => 'light')
}
