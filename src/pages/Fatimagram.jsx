// ============================================================
//  Fatimagram.jsx — Instagram-style premium dark feed
//  Redesign: dark dreamy purple, stories, glow interactions
// ============================================================

import React, { useState } from 'react'
import { posts } from '../data/fatimagramData.js'
import { useTheme } from '../context/ThemeContext.jsx'
import styles from './Fatimagram.module.css'

// ── Icons ─────────────────────────────────────────────────────

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="24" height="24"
       fill={filled ? '#ff4d6d' : 'none'}
       stroke={filled ? '#ff4d6d' : 'currentColor'} strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const SaveIcon = ({ saved }) => (
  <svg viewBox="0 0 24 24" width="24" height="24"
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

const HeartOutlineIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
  </svg>
)

// ── Data ───────────────────────────────────────────────────────

const PROFILE_SRC = '/images/FATIMA.jpg'
const PROFILE_FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="20" fill="#9d4edd"/>
    <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle"
          font-size="18" fill="white" font-family="sans-serif">F</text>
  </svg>`
)}`

const STORIES = [
  { id: 'your', label: 'Your story', src: PROFILE_SRC, isYours: true },
  { id: 'smiles',  label: 'Smiles',  src: '/images/fatimagram.jpg' },
  { id: 'candid',  label: 'Candid',  src: '/images/fatiman.jpg' },
  { id: 'places',  label: 'Places',  src: '/images/fatimagpt.png' },
  { id: 'random',  label: 'Random',  src: '/images/FATIMA.jpg' },
]

// ── Helpers ────────────────────────────────────────────────────

function PostImage({ src, alt, className }) {
  const [errored, setErrored] = useState(false)
  if (errored) {
    return (
      <div className={`${className} ${styles.imgFallback}`}>
        <span>📸</span>
      </div>
    )
  }
  return (
    <img src={src} alt={alt} className={className}
         onError={() => setErrored(true)} loading="lazy" />
  )
}

function StoryAvatar({ story }) {
  const [err, setErr] = useState(false)
  return (
    <button className={styles.storyItem} aria-label={story.label}>
      <div className={`${styles.storyRing} ${story.isYours ? styles.storyRingViewed : ''}`}>
        {err
          ? <div className={styles.storyAvatarFallback}><span>F</span></div>
          : <img src={story.src} alt={story.label} className={styles.storyAvatar}
                 onError={() => setErr(true)} />
        }
        {story.isYours && <div className={styles.storyAddBtn}>+</div>}
      </div>
      <span className={styles.storyLabel}>{story.label}</span>
    </button>
  )
}

// ── Main ───────────────────────────────────────────────────────

export default function Fatimagram({ onBack }) {
  const { isDark, toggle } = useTheme()
  const [liked,  setLiked]  = useState({})
  const [saved,  setSaved]  = useState({})
  const [likeAnim, setLikeAnim] = useState({})

  const toggleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))
    if (!liked[id]) {
      setLikeAnim(prev => ({ ...prev, [id]: true }))
      setTimeout(() => setLikeAnim(prev => ({ ...prev, [id]: false })), 600)
    }
  }
  const toggleSave = (id) => setSaved(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className={styles.page}>

      {/* ── Background glow ──────────────────────────── */}
      <div className={styles.bgGlow} aria-hidden="true">
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>

      {/* ── Header ───────────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>

        <div className={styles.headerCenter}>
          <span className={styles.title}>Fatimagram</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               width="14" height="14" style={{ opacity: 0.7, marginLeft: 4 }}>
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.iconBtn} aria-label="Likes">
            <HeartOutlineIcon />
          </button>
          <button className={styles.iconBtn} aria-label="Messages" style={{ position: 'relative' }}>
            <MessageIcon />
            <span className={styles.badge}>3</span>
          </button>
        </div>
      </header>

      {/* ── Scrollable feed ──────────────────────────── */}
      <div className={styles.feed}>

        {/* Stories */}
        <div className={styles.storiesWrap}>
          <div className={styles.stories}>
            {STORIES.map(s => <StoryAvatar key={s.id} story={s} />)}
          </div>
        </div>

        <div className={styles.storiesDivider} />

        {/* Posts */}
        {posts.length === 0 && (
          <div className={styles.empty}>
            <span>📸</span>
            <p>Abhi koi photo nahi hai</p>
            <p style={{ fontSize: '0.78rem', opacity: 0.6 }}>Add images to fatimagramData.js</p>
          </div>
        )}

        {posts.map((post, idx) => (
          <article key={post.id} className={styles.post}
                   style={{ animationDelay: `${idx * 0.08}s` }}>

            {/* Post header */}
            <div className={styles.postHeader}>
              <div className={styles.postProfileRing}>
                <img src={PROFILE_SRC} alt="Fatima" className={styles.postProfilePic}
                     onError={e => { e.target.src = PROFILE_FALLBACK }} />
              </div>
              <div className={styles.postInfo}>
                <span className={styles.postUsername}>Enait's Fatima</span>
                {post.location && (
                  <span className={styles.postLocation}>{post.location}</span>
                )}
              </div>
              <button className={styles.dotsBtn} aria-label="More">
                <DotsIcon />
              </button>
            </div>

            {/* Image */}
            <div className={styles.postImageWrap}>
              {post.type === 'video'
                ? <video src={post.src} className={styles.postImage}
                         controls playsInline preload="metadata" />
                : <PostImage src={post.src} alt={post.caption || 'Post'}
                             className={styles.postImage} />
              }
              {/* Image counter */}
              <div className={styles.imageCounter}>1/5</div>
              {/* Double-tap heart burst */}
              {likeAnim[post.id] && (
                <div className={styles.heartBurst}>❤️</div>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <div className={styles.actionsLeft}>
                <button
                  className={`${styles.actionBtn} ${liked[post.id] ? styles.actionLiked : ''}`}
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
                className={`${styles.actionBtn} ${saved[post.id] ? styles.actionSaved : ''}`}
                onClick={() => toggleSave(post.id)}
                aria-label={saved[post.id] ? 'Unsave' : 'Save'}
              >
                <SaveIcon saved={!!saved[post.id]} />
              </button>
            </div>

            {/* Likes */}
            <div className={styles.likesRow}>
              <span className={styles.likesCount}>
                {(post.likes || 0) + (liked[post.id] ? 1 : 0)} likes
              </span>
            </div>

            {/* Caption */}
            {post.caption && (
              <div className={styles.captionBlock}>
                <span className={styles.captionUser}>enaitsfatima</span>
                <span className={styles.captionText}> {post.caption}</span>
              </div>
            )}

            {/* Comments + time */}
            <div className={styles.postMeta}>
              <button className={styles.viewComments}>View all comments</button>
              <span className={styles.postTime}>{post.timestamp || '2 days ago'}</span>
            </div>

          </article>
        ))}

        <div style={{ height: 28 }} />
      </div>
    </div>
  )
}
