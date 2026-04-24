// ============================================================
//  InputBar.jsx  —  WhatsApp-style sticky input bar
// ============================================================

import React, { useRef, useEffect } from 'react'
import styles from './InputBar.module.css'

export default function InputBar({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null)

  // Auto-resize textarea as user types
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [value])

  // ── Key handler: Enter = send, Shift+Enter = newline ──────
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()   // prevent newline
      onSend()             // trigger send
    }
    // Shift+Enter: browser default inserts newline — do nothing
  }

  return (
    <div className={styles.bar}>
      {/* Emoji button (decorative) */}
      <button className={styles.sideBtn} aria-label="Emoji" tabIndex={-1}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M8 13.5s1.5 2 4 2 4-2 4-2" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="9" cy="10" r="1" fill="currentColor"/>
          <circle cx="15" cy="10" r="1" fill="currentColor"/>
        </svg>
      </button>

      {/* Text input */}
      <textarea
        ref={textareaRef}
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message"
        rows={1}
        disabled={disabled}
        aria-label="Type a message"
      />

      {/* Attachment (decorative) */}
      <button className={styles.sideBtn} aria-label="Attach" tabIndex={-1}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── SEND BUTTON ─────────────────────────────────────── */}
      <button
        className={`${styles.sendBtn} ${value.trim() ? styles.sendActive : ''}`}
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        {value.trim() ? (
          /* Paper plane (send) */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        ) : (
          /* Mic (idle state) */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
          </svg>
        )}
      </button>
    </div>
  )
}
