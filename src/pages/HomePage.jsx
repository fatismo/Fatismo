// ============================================================
//  HomePage.jsx — Kaneez-e-Fatima
//  Design: Premium glassmorphism + bokeh background
//  Based on Figma export — adapted for CSS Modules + useTheme
// ============================================================

import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import styles from './HomePage.module.css'

// ── Inline SVG icons ──────────────────────────────────────────
const Icons = {
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <polyline points="9,18 15,12 9,6"/>
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" width="18" height="18">
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
         strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
}

// ── Card data ─────────────────────────────────────────────────
const CARDS = [
  {
    id:       'fatimagram',
    title:    'Fatimagram 📸',
    subtitle: 'Fatima from the lens of Enait.',
    image:    '/images/fatimagram.jpg',
    imagePos: 'left',
    variant:  'pink',
  },
  {
    id:       'fatimagpt',
    title:    'FatimaGPT 🤖',
    subtitle: 'If you wanna know how she talks to me, go ahead.',
    image:    '/images/fatimagpt.png',
    imagePos: 'right',
    variant:  'purple',
  },
  {
    id:       'fatiman',
    title:    'Fatiman ✉️',
    subtitle: 'Unsent letters.\nUnspoken words.',
    image:    '/images/fatiman.jpg',
    imagePos: 'left',
    variant:  'amber',
  },
]

// ── Card component ────────────────────────────────────────────
function Card({ card, onClick, index }) {
  const imageEl = (
    <div className={styles.cardImgWrap}>
      <img src={card.image} alt={card.title} className={styles.cardImg} />
    </div>
  )

  const textEl = (
    <div className={styles.cardText}>
      <h2 className={styles.cardTitle}>{card.title}</h2>
      <p className={styles.cardSub}>{card.subtitle}</p>
    </div>
  )

  return (
    <button
      className={`${styles.card} ${styles[card.variant]}`}
      onClick={onClick}
      aria-label={`Open ${card.title}`}
      style={{ animationDelay: `${index * 0.13}s` }}
    >
      {/* Layered glass background */}
      <div className={styles.cardGlass} />
      <div className={styles.cardSheen} />
      <div className={styles.cardGlow} />

      {/* Content row */}
      <div className={styles.cardInner}>
        {card.imagePos === 'left'  && imageEl}
        {textEl}
        {card.imagePos === 'right' && imageEl}
        <span className={styles.cardArrow}>{Icons.arrow}</span>
      </div>
    </button>
  )
}

// ── HomePage ──────────────────────────────────────────────────
export default function HomePage({ onNavigate }) {
  const { isDark, toggle } = useTheme()

  return (
    <div className={styles.page}>

      {/* ── Bokeh background (pure CSS, no image needed) ──── */}
      <div className={styles.bokehWrap} aria-hidden="true">
        <div className={`${styles.bokeh} ${styles.bokeh1}`} />
        <div className={`${styles.bokeh} ${styles.bokeh2}`} />
        <div className={`${styles.bokeh} ${styles.bokeh3}`} />
        <div className={`${styles.bokeh} ${styles.bokeh4}`} />
        <div className={`${styles.bokeh} ${styles.bokeh5}`} />
      </div>

      {/* ── Scrollable content ────────────────────────────── */}
      <div className={styles.scroll}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Kaneez-e-Fatima</h1>
            <p className={styles.subtitle}>Ya Habibi, Ya Rahati, Ya Roohi.</p>
          </div>

          <button
            className={styles.themeBtn}
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {isDark ? Icons.sun : Icons.moon}
          </button>
        </header>

        {/* Cards */}
        <div className={styles.cards}>
          {CARDS.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              index={i}
              onClick={() => onNavigate(card.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>&copy;2026 Made by Md Enaitul Hoque, for my little one 🤍</p>
        </footer>

      </div>
    </div>
  )
}
