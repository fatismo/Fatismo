// ============================================================
//  ChatHeader.jsx
//  CHANGES for Dual Mode:
//    • Accepts mode + onModeChange props
//    • .info area is clickable → opens ModeModal
//    • Title + status update dynamically per mode
//    • Self Mode 🌙 badge shown when mode === 'fatima'
//  Original call/theme logic: 100% untouched.
// ============================================================

import React, { useState, useCallback } from 'react'
import { BOT_AVATAR, CONTACT_STATUS } from '../../config.js'
import { useTheme } from '../context/ThemeContext.jsx'
import styles from './ChatHeader.module.css'

// Fallback avatar (unchanged)
const FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="30" fill="#25d366"/>
    <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle"
          font-size="26" fill="white" font-family="sans-serif">F</text>
  </svg>`
)}`

// Random sassy popup messages (unchanged)
const CALL_MSGS = [
  'Idhar hi jo bolna h bol 😒',
  'Video call kyu kar rha? 🙄',
  'Phone call kyu kar rha? 😤',
  'Pagal h kya bc? 😂',
  'Call karna band kar warna muh tod denge 🙃',
  'Text kar na, call mat kr 🙃'
]
function getRandomMsg() {
  return CALL_MSGS[Math.floor(Math.random() * CALL_MSGS.length)]
}

// ── Mode config ───────────────────────────────────────────────
// Single source of truth for what each mode shows in the header.
const MODE_CONFIG = {
  others: {
    name:   "Enait's Fatima",
    status: 'online',
    label:  null,               // no badge in Others mode
  },
  fatima: {
    name:   'Kaneez Fatima',
    status: 'Self Mode 🌙',
    label:  'Self Mode 🌙',     // badge shown below header
  }
}

// ── ModeModal ─────────────────────────────────────────────────
// WhatsApp-style bottom sheet / popover with two options.
// Rendered inside the header so it inherits the z-index stack.
function ModeModal({ currentMode, onSelect, onClose }) {
  return (
    <>
      {/* Dimmed backdrop — clicking it closes the modal */}
      <div
        className={styles.modalOverlay}
        onClick={onClose}
        aria-label="Close mode selector"
      />

      {/* The actual modal card */}
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Select chat mode">
        <p className={styles.modalTitle}>Switch Mode</p>

        {/* Others option */}
        <button
          className={`${styles.modalOption} ${currentMode === 'others' ? styles.modalActive : ''}`}
          onClick={() => { onSelect('others'); onClose() }}
        >
          <span className={styles.optionIcon}>💬</span>
          <span className={styles.optionText}>
            <strong>Enait's Fatima</strong>
            <small> My little one </small>
          </span>
          {currentMode === 'others' && (
            <span className={styles.optionCheck} aria-label="Active">✓</span>
          )}
        </button>

        {/* Fatima / Self-reflection option */}
        <button
          className={`${styles.modalOption} ${currentMode === 'fatima' ? styles.modalActive : ''}`}
          onClick={() => { onSelect('fatima'); onClose() }}
        >
          <span className={styles.optionIcon}>🌙</span>
          <span className={styles.optionText}>
            <strong>Kaneez Fatima</strong>
            <small>Fatima, this one is just for you</small>
          </span>
          {currentMode === 'fatima' && (
            <span className={styles.optionCheck} aria-label="Active">✓</span>
          )}
        </button>
      </div>
    </>
  )
}

// ── ChatHeader ────────────────────────────────────────────────
export default function ChatHeader({ onBack, mode = 'others', onModeChange }) {
  const { isDark, toggle } = useTheme()
  const [popup,      setPopup]      = useState(null)
  const [popupTimer, setPopupTimer] = useState(null)
  const [showModal,  setShowModal]  = useState(false)   // NEW

  const config = MODE_CONFIG[mode] || MODE_CONFIG.others

  const showPopup = useCallback((type) => {
    if (popupTimer) clearTimeout(popupTimer)
    setPopup(getRandomMsg())
    const t = setTimeout(() => setPopup(null), 2800)
    setPopupTimer(t)
  }, [popupTimer])

  return (
    <header className={styles.header}>

      {/* Back button (unchanged) */}
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

      {/* Avatar (unchanged) */}
      <img
        src={BOT_AVATAR}
        alt={config.name}
        className={styles.avatar}
        onError={e => { e.target.src = FALLBACK }}
      />

      {/* ── CHANGE: .info is now clickable → opens modal ────── */}
      <div
        className={styles.info}
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        aria-label="Switch chat mode"
        onKeyDown={e => e.key === 'Enter' && setShowModal(true)}
      >
        <span className={styles.name}>
          {config.name}
        </span>
        <span className={styles.status}>
          {config.status}
        </span>
      </div>

      {/* Right actions (unchanged) */}
      <div className={styles.actions}>

        <button className={styles.iconBtn} onClick={toggle} aria-label="Toggle dark mode">
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

        <button className={styles.iconBtn} aria-label="Video call" onClick={() => showPopup('video')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
          </svg>
        </button>

        <button className={styles.iconBtn} aria-label="Call" onClick={() => showPopup('phone')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.613 21 3 13.387 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z"/>
          </svg>
        </button>

      </div>

      {/* Call popup toast (unchanged) */}
      {popup && (
        <div className={styles.popup} role="alert" aria-live="assertive">
          {popup}
        </div>
      )}

      {/* ── NEW: Mode selection modal ─────────────────────── */}
      {showModal && (
        <ModeModal
          currentMode={mode}
          onSelect={onModeChange}
          onClose={() => setShowModal(false)}
        />
      )}

    </header>
  )
}
