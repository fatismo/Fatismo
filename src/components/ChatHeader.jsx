// ============================================================
//  ChatHeader.jsx  —  WhatsApp-style chat header
//  UPDATED: call popup, onBack prop, useTheme hook
// ============================================================

import React, { useState, useCallback } from 'react'
import { BOT_AVATAR, CONTACT_NAME, CONTACT_STATUS } from '../../config.js'
import { useTheme } from '../context/ThemeContext.jsx'
import styles from './ChatHeader.module.css'

// Fallback avatar
const FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="30" fill="#25d366"/>
    <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle"
          font-size="26" fill="white" font-family="sans-serif">F</text>
  </svg>`
)}`

// Random sassy popup messages
const CALL_MSGS = [
  'Idhar hi jo bolna h bol 😒',
  'Video call kyu kar rha? 🙄',
  'Phone call kyu kar rha? 😤',
  'Pagal h kya bc? 😂',
  'Call karna band kar yaar 🥲',
  'Text kar na, call mat kr 🙃'
]

function getRandomMsg() {
  return CALL_MSGS[Math.floor(Math.random() * CALL_MSGS.length)]
}

export default function ChatHeader({ onBack }) {
  const { isDark, toggle } = useTheme()
  const [popup, setPopup] = useState(null)
  const [popupTimer, setPopupTimer] = useState(null)

  const showPopup = useCallback((type) => {
    // Clear any existing timer
    if (popupTimer) clearTimeout(popupTimer)

    setPopup(getRandomMsg())
    const t = setTimeout(() => setPopup(null), 2800)
    setPopupTimer(t)
  }, [popupTimer])

  return (
    <header className={styles.header}>

      {/* Back button → goes to HomePage */}
      <button
        className={styles.backBtn}
        onClick={onBack}
        aria-label="Back"
      >
        <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
          <path d="M9.5 1.5L1.5 9.5L9.5 17.5"
                stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={styles.backCount}>1</span>
      </button>

      {/* Avatar */}
      <img
        src={BOT_AVATAR}
        alt={CONTACT_NAME}
        className={styles.avatar}
        onError={e => { e.target.src = FALLBACK }}
      />

      {/* Name + status */}
      <div className={styles.info}>
        <span className={styles.name}>{CONTACT_NAME}</span>
        <span className={styles.status}>
          {CONTACT_STATUS === 'online' ? 'online' : 'last seen recently'}
        </span>
      </div>

      {/* Right actions */}
      <div className={styles.actions}>

        {/* Theme toggle */}
        <button
          className={styles.iconBtn}
          onClick={toggle}
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Video call — shows popup */}
        <button
          className={styles.iconBtn}
          aria-label="Video call"
          onClick={() => showPopup('video')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
          </svg>
        </button>

        {/* Phone call — shows popup */}
        <button
          className={styles.iconBtn}
          aria-label="Call"
          onClick={() => showPopup('phone')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.613 21 3 13.387 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z"/>
          </svg>
        </button>

      </div>

      {/* ── Call popup toast ─────────────────────────────── */}
      {popup && (
        <div className={styles.popup} role="alert" aria-live="assertive">
          {popup}
        </div>
      )}

    </header>
  )
}
