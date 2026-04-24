// ============================================================
//  ThemeContext.jsx — Global dark/light theme for entire app
//  • Reads system preference on first load
//  • Persists to localStorage
//  • Applies [data-theme] to <html> so all CSS vars work
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

function getInitialTheme() {
  // 1. Saved preference wins
  const saved = localStorage.getItem('fatima-theme')
  if (saved === 'dark' || saved === 'light') return saved
  // 2. System preference
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply to <html> so CSS vars cascade everywhere
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('fatima-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
