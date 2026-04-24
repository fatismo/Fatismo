// ============================================================
//  HomePage.jsx — Kaneez-e-Fatima main screen
//  WhatsApp-style navigation with 3 rows
// ============================================================

import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import styles from './HomePage.module.css'

// Row icons as inline SVGs (no extra deps)
const Icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <polyline points="9,18 15,12 9,6"/>
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" width="20" height="20">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
}

const AVATARS = {
  fatimagram: '/images/fatimagram.jpg',
  fatimagpt:  '/images/fatimagpt.png',
  fatiman:    '/images/fatiman.jpg'
}

const NAV_ROWS = [
  {
    id: 'fatimagram',
    label: 'Fatimagram',
    subtitle: 'Fatima from the lens of Enait.',
    avatar: AVATARS.fatimagram,
    icon: Icons.instagram
  },
  {
    id: 'fatimagpt',
    label: 'FatimaGPT',
    subtitle: 'If you wanna know how she talks to me, go ahead.',
    avatar: AVATARS.fatimagpt,
    icon: Icons.chat
  },
  {
    id: 'fatiman',
    label: 'Fatiman',
    subtitle: 'Unsent letters. Unspoken words.',
    avatar: AVATARS.fatiman,
    icon: Icons.mail
  }
]

export default function HomePage({ onNavigate }) {
  const { isDark, toggle } = useTheme()

  return (
    <div className={styles.page}>

      {/* ── Header ────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerTitle}>Kaneez-e-Fatima</span>
          <span className={styles.headerSub}>Ya Habibi, Ya Rahati, Ya Roohi.</span>
        </div>
        <button
          className={styles.themeBtn}
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {isDark ? Icons.sun : Icons.moon}
        </button>
      </header>

      {/* ── Section label ─────────────────────────────────── */}
      <div className={styles.sectionLabel}>Sections</div>

      {/* ── Nav rows ─────────────────────────────────────── */}
      <div className={styles.rowList}>
        {NAV_ROWS.map((row, i) => (
          <button
            key={row.id}
            className={styles.row}
            onClick={() => onNavigate(row.id)}
            aria-label={`Go to ${row.label}`}
          >
            {/* Avatar */}
            <img
              src={row.avatar}
              alt={row.label}
              className={styles.rowAvatar}
            />

            {/* Text */}
            <div className={styles.rowText}>
              <span className={styles.rowTitle}>{row.label}</span>
              <span className={styles.rowSub}>{row.subtitle}</span>
            </div>

            {/* Arrow */}
            <span className={styles.rowArrow}>{Icons.arrow}</span>

            {/* Divider (not on last) */}
            {i < NAV_ROWS.length - 1 && (
              <span className={styles.rowDivider} />
            )}
          </button>
        ))}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className={styles.footer}>
        <span>&copy;2026 Made by Md Enaitul Hoque, for my little one 🤍</span>
      </div>

    </div>
  )
}
