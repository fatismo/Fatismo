// ============================================================
//  Fatimagram.jsx — Instagram-style vertical photo feed
//  UPDATED: proper post header, actions row, caption structure
// ============================================================

import React, { useState } from 'react'
import { posts } from '../data/fatimagramData.js'
import { useTheme } from '../context/ThemeContext.jsx'
import styles from './Fatimagram.module.css'

// ── Icons ────────────────────────────────────────────────────

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="26" height="26"
       fill={filled ? '#ed4956' : 'none'}
       stroke={filled ? '#ed4956' : 'currentColor'} strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const SaveIcon = ({ saved }) => (
  <svg viewBox="0 0 24 24" width="26" height="26"
       fill={saved ? 'currentColor' : 'none'}
       stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
)

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <circle cx="5"  cy="12" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="19" cy="12" r="1.5"/>
  </svg>
)

// ── Profile pic — reuses your fatimagpt.jpg if present ───────
const PROFILE_SRC = '/images/FATIMA.jpg'
const PROFILE_FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="20" fill="#25d366"/>
    <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle"
          font-size="16" fill="white" font-family="sans-serif">F</text>
  </svg>`
)}`

// ── Image with fallback ───────────────────────────────────────
function PostImage({ src, alt, className }) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div className={className} style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 52 }}>📸</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  )
}

// ── Main component ────────────────────────────────────────────
export default function Fatimagram({ onBack }) {
  const { isDark, toggle } = useTheme()
  const [liked, setLiked] = useState({})
  const [saved, setSaved] = useState({})

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleSave = (id) => setSaved(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className={styles.page}>

      {/* ── App header ──────────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <span className={styles.title}>Fatimagram</span>
        <button className={styles.themeBtn} onClick={toggle} aria-label="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* ── Feed ────────────────────────────────────────── */}
      <div className={styles.feed}>

        {posts.length === 0 && (
          <div className={styles.empty}>
            <span>📸</span>
            <p>Abhi koi photo nahi hai</p>
            <p>Add images to /public/images/</p>
          </div>
        )}

        {posts.map(post => (
          <article key={post.id} className={styles.post}>

            {/* ── Post header ─────────────────────────── */}
            <div className={styles.postHeader}>
              <img
                src={PROFILE_SRC}
                alt="Fatima"
                className={styles.profilePic}
                onError={e => { e.target.src = PROFILE_FALLBACK }}
              />
              <div className={styles.profileInfo}>
                <span className={styles.username}>Enait's Fatima</span>
                {post.timestamp && (
                  <span className={styles.postTime}>{post.timestamp}</span>
                )}
              </div>
              <button className={styles.dotsBtn} aria-label="More options">
                <DotsIcon />
              </button>
            </div>

            {/* ── Post image / video ───────────────────── */}
            {post.type === 'video' ? (
              <video
                src={post.src}
                className={styles.postImage}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <PostImage
                src={post.src}
                alt={post.caption}
                className={styles.postImage}
              />
            )}

            {/* ── Actions row ─────────────────────────── */}
            <div className={styles.actions}>
              <div className={styles.actionsLeft}>
                <button
                  className={styles.actionBtn}
                  onClick={() => toggleLike(post.id)}
                  aria-label={liked[post.id] ? 'Unlike' : 'Like'}
                >
                  <HeartIcon filled={!!liked[post.id]} />
                </button>
                <button className={styles.actionBtn} aria-label="Comment">
                  <CommentIcon />
                </button>
                <button className={styles.actionBtn} aria-label="Share">
                  <ShareIcon />
                </button>
              </div>
              <button
                className={styles.actionBtn}
                onClick={() => toggleSave(post.id)}
                aria-label={saved[post.id] ? 'Unsave' : 'Save'}
              >
                <SaveIcon saved={!!saved[post.id]} />
              </button>
            </div>

            {/* ── Caption ─────────────────────────────── */}
            {post.caption && (
              <div className={styles.captionBlock}>
                <span className={styles.captionUsername}>Enait's Fatima</span>
                <span className={styles.captionText}> {post.caption}</span>
              </div>
            )}

          </article>
        ))}

        <div style={{ height: 20 }} />
      </div>

    </div>
  )
}
