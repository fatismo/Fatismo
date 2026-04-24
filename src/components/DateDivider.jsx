// DateDivider.jsx — WhatsApp-style date chip (e.g. "Today")

import React from 'react'
import styles from './DateDivider.module.css'

export default function DateDivider({ label }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.chip}>{label}</span>
    </div>
  )
}
