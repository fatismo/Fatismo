// ============================================================
//  ChatBubble.jsx  —  WhatsApp-style bubble  (timestamp FIXED)
//  • position: absolute on .meta eliminates overlap
//  • padding-bottom on .bubble creates space for timestamp
// ============================================================

import React from 'react'
import styles from './ChatBubble.module.css'

export default function ChatBubble({ message }) {
  const { role, text, time } = message
  const isUser = role === 'user'

  // Format as HH:MM
  const displayTime = time || new Date().toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className={`${styles.wrap} ${isUser ? styles.out : styles.in}`}>
      <div className={`${styles.bubble} ${isUser ? styles.outBubble : styles.inBubble}`}>

        {/* Text — no padding-right needed; bubble padding handles it */}
        <p className={styles.text}>{text}</p>

        {/* Time + ticks — absolute, always bottom-right, never overlaps */}
        <div className={styles.meta}>
          <span className={styles.time}>{displayTime}</span>
          {isUser && (
            <span className={styles.ticks} aria-label="Read">
              <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
                <path d="M1 5l3 3 6-6" stroke="currentColor" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 5l3 3 6-6" stroke="currentColor" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </div>

        {/* Tail */}
        <span className={`${styles.tail} ${isUser ? styles.tailOut : styles.tailIn}`} />
      </div>
    </div>
  )
}
