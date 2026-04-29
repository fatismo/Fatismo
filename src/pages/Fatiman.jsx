// ============================================================
//  Fatiman.jsx — X/Twitter-style dark emotional feed
//  Redesign: profile card, tabs, tweet cards, compose FAB
// ============================================================

import React, { useState } from 'react'
import { letters } from '../data/lettersData.js'
import { useTheme } from '../context/ThemeContext.jsx'
import styles from './Fatiman.module.css'

// ── Icons ─────────────────────────────────────────────────────

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
)

const ReplyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)

const RepostIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <polyline points="17,1 21,5 17,9"/>
    <path d="M3 11V9a4 4 0 014-4h14"/>
    <polyline points="7,23 3,19 7,15"/>
    <path d="M21 13v2a4 4 0 01-4 4H3"/>
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="18" height="18"
       fill={filled ? '#f43f5e' : 'none'}
       stroke={filled ? '#f43f5e' : 'currentColor'} strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

const ViewsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const PenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>
)

// ── Profile avatar ─────────────────────────────────────────────

const PROFILE_SRC = '/images/fatiman.jpg'
const PROFILE_FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="20" fill="#7c3aed"/>
    <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle"
          font-size="16" fill="white" font-family="sans-serif">F</text>
  </svg>`
)}`

function Avatar({ className, size = 40 }) {
  const [err, setErr] = useState(false)
  return err
    ? <div className={className} style={{ width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
        display:'flex',alignItems:'center',justifyContent:'center',
        color:'white',fontSize:size*0.4,fontWeight:700,flexShrink:0 }}>F</div>
    : <img src={PROFILE_SRC} alt="Fatiman" className={className}
           onError={() => setErr(true)}
           style={{ width: size, height: size, objectFit: 'cover', objectPosition: 'center top' }} />
}

// ── Helpers ────────────────────────────────────────────────────

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  } catch { return dateStr }
}

function relativeTime(dateStr) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return '1d'
    if (days < 30) return `${days}d`
    const months = Math.floor(days / 30)
    return `${months}mo`
  } catch { return '2d' }
}

// ── Tweet Card ─────────────────────────────────────────────────

function TweetCard({ letter, index, isLiked, onLike }) {
  const [reposted, setReposted] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const preview = letter.preview || letter.content?.split('\n')[0] || ''
  const hasMore = letter.content && letter.content.length > 120

  return (
    <article className={styles.tweet} style={{ animationDelay: `${index * 0.07}s` }}>

      {/* Left col: avatar + thread line */}
      <div className={styles.tweetLeft}>
        <Avatar className={styles.tweetAvatar} size={42} />
        <div className={styles.threadLine} />
      </div>

      {/* Right col: content */}
      <div className={styles.tweetRight}>

        {/* Name row */}
        <div className={styles.tweetHeader}>
          <span className={styles.tweetName}>Fatiman ✉️</span>
          <span className={styles.tweetHandle}>@fatiman_unsaid</span>
          <span className={styles.tweetDot}>·</span>
          <span className={styles.tweetTime}>{relativeTime(letter.date)}</span>
        </div>

        {/* Title as tweet intro */}
        {letter.title && (
          <p className={styles.tweetTitle}>{letter.title}</p>
        )}

        {/* Body preview */}
        <p className={styles.tweetBody}>
          {expanded ? letter.content : preview}
        </p>

        {/* Full content toggle */}
        {hasMore && (
          <button
            className={styles.tweetReadMore}
            onClick={() => setExpanded(p => !p)}
            aria-expanded={expanded}
          >
            {expanded ? 'Collapse ↑' : 'Read letter →'}
          </button>
        )}

        {/* Engagement row */}
        <div className={styles.engagements}>
          <button className={`${styles.engBtn} ${styles.engReply}`} aria-label="Reply">
            <ReplyIcon />
            <span>{Math.floor(Math.random() * 8) + 1}</span>
          </button>
          <button
            className={`${styles.engBtn} ${styles.engRepost} ${reposted ? styles.engReposted : ''}`}
            onClick={() => setReposted(p => !p)}
            aria-label="Repost"
          >
            <RepostIcon />
            <span>{Math.floor(Math.random() * 20) + 3}</span>
          </button>
          <button
            className={`${styles.engBtn} ${styles.engLike} ${isLiked ? styles.engLiked : ''}`}
            onClick={onLike}
            aria-label="Like"
          >
            <HeartIcon filled={isLiked} />
            <span>{Math.floor(Math.random() * 60) + 10 + (isLiked ? 1 : 0)}</span>
          </button>
          <button className={`${styles.engBtn} ${styles.engViews}`} aria-label="Views">
            <ViewsIcon />
            <span>{Math.floor(Math.random() * 900) + 100}</span>
          </button>
        </div>

      </div>
    </article>
  )
}

// ── Main ───────────────────────────────────────────────────────

export default function Fatiman({ onBack }) {
  const { isDark, toggle } = useTheme()
  const [activeTab, setActiveTab] = useState('foryou')
  const [liked, setLiked] = useState({})

  const toggleLike = (id) =>
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className={styles.page}>

      {/* ── Background glow ────────────────────────── */}
      <div className={styles.bgGlow} aria-hidden="true">
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.glow3} />
      </div>

      {/* ── Header ─────────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <div className={styles.headerCenter}>
          <span className={styles.title}>Fatiman</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               width="14" height="14" style={{ opacity: 0.6, marginLeft: 4 }}>
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} onClick={toggle} aria-label="Toggle theme">
            <SparkleIcon />
          </button>
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────── */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'foryou' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('foryou')}
        >
          For you
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'following' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>

      {/* ── Scrollable content ─────────────────────── */}
      <div className={styles.scroll}>

        {/* Profile card */}
        <div className={styles.profileCard}>
          {/* Cover gradient */}
          <div className={styles.profileCover} />

          {/* Avatar */}
          <div className={styles.profileAvatarWrap}>
            <Avatar className={styles.profileAvatar} size={72} />
          </div>

          {/* Info */}
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>Fatiman ✉️</h2>
            <p className={styles.profileHandle}>@fatiman_unsaid</p>
            <p className={styles.profileBio}>Unsent letters. Unspoken words.</p>
            <div className={styles.profileMeta}>
              <CalendarIcon />
              <span>Joined January 2024</span>
            </div>
            <div className={styles.profileStats}>
              <span className={styles.statNum}>{letters.length}</span>
              <span className={styles.statLabel}>Thoughts</span>
              <span className={styles.statNum} style={{ marginLeft: 16 }}>1</span>
              <span className={styles.statLabel}>Following</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.cardDivider} />

        {/* Feed */}
        {letters.length === 0 && (
          <div className={styles.empty}>
            <span>✉️</span>
            <p>Koi khat nahi abhi</p>
            <p style={{ fontSize: '0.78rem', opacity: 0.55 }}>Add letters to lettersData.js</p>
          </div>
        )}

        {activeTab === 'foryou'
          ? letters.map((letter, i) => (
              <TweetCard
                key={letter.id}
                letter={letter}
                index={i}
                isLiked={!!liked[letter.id]}
                onLike={() => toggleLike(letter.id)}
              />
            ))
          : (
            <div className={styles.empty}>
              <span style={{ fontSize: '2rem' }}>💜</span>
              <p>Only for the ones who stayed.</p>
            </div>
          )
        }

        <div style={{ height: 80 }} />
      </div>

      {/* ── Floating compose button ─────────────────── */}
      <button className={styles.fab} aria-label="Compose">
        <PenIcon />
      </button>

    </div>
  )
}
