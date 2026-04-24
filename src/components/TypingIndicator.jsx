// ============================================================
//  TypingIndicator.jsx  —  "typing…" bubble
// ============================================================

import React from 'react'
import styles from './TypingIndicator.module.css'

export default function TypingIndicator() {
  return (
    <div className={styles.wrap}>
      <div className={styles.bubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.tail} />
      </div>
    </div>
  )
}
