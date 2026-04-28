// ============================================================
//  App.jsx  —  Kaneez-e-Fatima
//  CHANGE: Dual Mode Chat System
//    • mode state: 'others' | 'fatima'
//    • handleModeChange: clears chat, resets history, sets mode
//    • mode passed to ChatHeader (for modal + title)
//    • mode passed to askFatima (for personality switching)
//  Everything else: 100% original, untouched.
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme }       from './context/ThemeContext.jsx'
import ChatHeader         from './components/ChatHeader.jsx'
import ChatBubble         from './components/ChatBubble.jsx'
import TypingIndicator    from './components/TypingIndicator.jsx'
import DateDivider        from './components/DateDivider.jsx'
import InputBar           from './components/InputBar.jsx'
import { useGemini }      from './hooks/useGemini.js'
import { BG_IMAGES }      from '../config.js'
import HomePage           from './pages/HomePage.jsx'
import Fatimagram         from './pages/Fatimagram.jsx'
import Fatiman            from './pages/Fatiman.jsx'
import styles             from './App.module.css'

// ── Helpers ──────────────────────────────────────────────────

function getTime() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: false
  })
}

// Welcome messages per mode
const WELCOME_OTHERS = { id: 'welcome', role: 'bot', text: 'bako',           time: getTime() }
const WELCOME_FATIMA = { id: 'welcome', role: 'bot', text: 'bol... kya chal rha h andar?', time: getTime() }

// ── FatimaGPT (chat screen) ───────────────────────────────────

function FatimaGPT({ onBack }) {
  // ── NEW: mode state ─────────────────────────────────────────
  // 'others' = original Fatima chatbot behaviour
  // 'fatima' = self-reflection / inner voice mode
  const [mode, setMode] = useState('others')

  // Messages — initialised with the Others welcome message
  const [messages, setMessages] = useState([WELCOME_OTHERS])

  const [input, setInput]       = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const historyRef = useRef([])
  const bottomRef  = useRef(null)
  const chatRef    = useRef(null)

  const { askFatima } = useGemini()

  const [bgImage] = useState(() => {
    const i = Math.floor(Math.random() * BG_IMAGES.length)
    return BG_IMAGES[i]
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ── NEW: mode change handler ─────────────────────────────────
  // Called when the user picks a mode in the header modal.
  // Clears chat history and starts fresh with the right welcome.
  const handleModeChange = useCallback((newMode) => {
    if (newMode === mode) return           // already in this mode — do nothing
    setMode(newMode)
    historyRef.current = []               // reset Gemini conversation memory
    const welcome = newMode === 'fatima' ? WELCOME_FATIMA : WELCOME_OTHERS
    setMessages([{ ...welcome, id: 'welcome-' + Date.now(), time: getTime() }])
    setInput('')
    setIsTyping(false)
  }, [mode])

  // ── Send message (original logic, mode passed to askFatima) ──
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isTyping) return

    const userMsg = { id: Date.now(), role: 'user', text, time: getTime() }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    historyRef.current.push({ role: 'user', text })
    setIsTyping(true)

    try {
      // ── CHANGE: pass mode as third argument ─────────────────
      const reply = await askFatima(text, historyRef.current, mode)

      setIsTyping(false)
      const botMsg = { id: Date.now() + 1, role: 'bot', text: reply, time: getTime() }
      setMessages(prev => [...prev, botMsg])
      historyRef.current.push({ role: 'model', text: reply })

    } catch (err) {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id:   Date.now() + 1,
        role: 'bot',
        text: `Kuch toh gadbad h yaar… (${err.message}) 😔`,
        time: getTime()
      }])
    }
  }, [input, isTyping, askFatima, mode])

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className={styles.phone}>

      {/* ── CHANGE: pass mode + onModeChange to ChatHeader ──── */}
      <ChatHeader
        onBack={onBack}
        mode={mode}
        onModeChange={handleModeChange}
      />

      <div
        className={styles.bgLayer}
        style={{ backgroundImage: `url('${bgImage}')` }}
        aria-hidden="true"
      />

      <div ref={chatRef} className={styles.chatArea}>
        <DateDivider label="Today" />

        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} style={{ height: 4 }} />
      </div>

      <InputBar
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={isTyping}
      />

    </div>
  )
}

// ── Root App — page router (unchanged) ───────────────────────

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        {page === 'home'       && <HomePage   onNavigate={setPage} />}
        {page === 'fatimagpt'  && <FatimaGPT  onBack={() => setPage('home')} />}
        {page === 'fatimagram' && <Fatimagram onBack={() => setPage('home')} />}
        {page === 'fatiman'    && <Fatiman    onBack={() => setPage('home')} />}
      </div>
    </div>
  )
}
