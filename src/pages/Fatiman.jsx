// ============================================================
//  Fatiman.jsx — Letters/notes section
//  WhatsApp chat-list style → tap to expand full letter
// ============================================================

import React, { useState } from 'react'
import { letters } from '../data/lettersData.js'
import { useTheme } from '../context/ThemeContext.jsx'
import styles from './Fatiman.module.css'

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const ChevronDown = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="18" height="18"
       style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease' }}>
    <polyline points="6,9 12,15 18,9"/>
  </svg>
)

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

export default function Fatiman({ onBack }) {
  const { isDark, toggle } = useTheme()
  const [openId, setOpenId] = useState(null)

  function toggle_letter(id) {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <div className={styles.headerInfo}>
          <span className={styles.title}>Fatiman</span>
          <span className={styles.subtitle}>{letters.length} Letters</span>
        </div>
        <button className={styles.themeBtn} onClick={toggle} aria-label="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* ── Letters list ────────────────────────────────── */}
      <div className={styles.list}>
        {letters.length === 0 && (
          <div className={styles.empty}>
            <span>💌</span>
            <p>Abhi koi khat nahi</p>
            <p>Add letters to lettersData.js</p>
          </div>
        )}

        {letters.map((letter, i) => {
          const isOpen = openId === letter.id
          return (
            <div key={letter.id} className={styles.item}>

              {/* ── Row (always visible) ──────────────── */}
              <button
                className={`${styles.row} ${isOpen ? styles.rowOpen : ''}`}
                onClick={() => toggle_letter(letter.id)}
                aria-expanded={isOpen}
              >
                {/* Left: icon */}
                <div className={styles.iconWrap}>
                  <span className={styles.letterIcon}>💌</span>
                </div>

                {/* Center: title + preview */}
                <div className={styles.rowText}>
                  <span className={styles.rowTitle}>{letter.title}</span>
                  <span className={styles.rowPreview}>
                    {isOpen ? formatDate(letter.date) : letter.preview}
                  </span>
                </div>

                {/* Right: date or chevron */}
                <div className={styles.rowRight}>
                  {!isOpen && (
                    <span className={styles.rowDate}>
                      {formatDate(letter.date)}
                    </span>
                  )}
                  <span className={styles.chevron}>
                    <ChevronDown open={isOpen} />
                  </span>
                </div>
              </button>

              {/* ── Expanded letter body ──────────────── */}
              {isOpen && (
                <div className={styles.letterBody}>
                  <div className={styles.letterContent}>
                    {letter.content.split('\n').map((line, j) => (
                      line.trim()
                        ? <p key={j} className={styles.para}>{line}</p>
                        : <div key={j} className={styles.spacer} />
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {i < letters.length - 1 && (
                <div className={styles.divider} />
              )}
            </div>
          )
        })}

        <div style={{ height: 32 }} />
      </div>

    </div>
  )
}
