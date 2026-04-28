import { useState, useEffect, useRef, useCallback } from 'react'
import { GEMINI_API_KEY, GEMINI_MODEL } from '../../config.js'
import { fixedReplies } from '../data/fixedReplies.js'
import { getDatasetReply } from '../data/datasetMatcher.js'

// ─── API KEYS ────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
// ─── MODELS ──────────────────────────────────────────────────
const GEMINI_PRIMARY = GEMINI_MODEL
const GEMINI_FALLBACK = 'gemini-1.5-flash-8b'
const GROQ_MODEL = 'llama3-70b-8192'
const OPENROUTER_MODEL = 'mistralai/mistral-7b-instruct'

// ─────────────────────────────────────────────────────────────
//  LAYER 1: FIXED REPLIES
// ─────────────────────────────────────────────────────────────
function getFixedReply(userMessage) {
  const msg = userMessage.toLowerCase().trim()
  for (const entry of fixedReplies) {
    const triggered = entry.triggers.some(t => msg.includes(t.toLowerCase()))
    if (triggered) {
      return entry.responses[Math.floor(Math.random() * entry.responses.length)]
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────────
//  WORD FIXER + RESPONSE CLEANER
// ─────────────────────────────────────────────────────────────
function fixIncompleteWords(text) {
  return text
    .replace(/\bWalaikum\b/gi, 'Walaikumassalam')
    .replace(/\bwalaikums?\b/gi, 'Walaikumassalam')
    .replace(/\bwalikum\b/gi, 'Walaikumassalam')
    .replace(/\bInsha\b/gi, 'InshAllah')
    .replace(/\bAlhamdu\b/gi, 'Alhamdulillah')
}

function cleanReply(raw) {
  if (!raw || !raw.trim()) return null
  return fixIncompleteWords(
    raw
      .replace(/^Fatima:\s*/i, '')
      .replace(/^(Assistant|Bot|AI):\s*/i, '')
      .replace(/^["'`]|["'`]$/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\*\*/g, '')           // strip ** markdown bold
      .replace(/\.{4,}/g, '...')      // cap excessive dots
      .trim()
  ) || null
}

// ─────────────────────────────────────────────────────────────
//  PERSONALITY — "Others" mode (original, untouched)
// ─────────────────────────────────────────────────────────────
const PERSONALITY = `
You are Fatima — a real girl texting on WhatsApp. You are NOT an AI.

LANGUAGE RULES (non-negotiable):
• You say "te" instead of "tu" — always. Never use "tu".
• You say "hum" or "hm" instead of "mai" or "main" — always. Never say "mai" or "main".
• You speak Hinglish — Hindi written in English, mixed naturally in every message.
• Shortcuts you always use: "h" not "hai", "nhi" not "nahi", "toh" not "to",
  "tm" not "tum", "kr" not "kar", "dkh" not "dekho", "thk" not "theek",
  "smjh" not "samajh", "bkk" for dismissal/annoyance.

EMOJI RULES (very important):
• Your most favorite emoji is 👺 — use it when teasing, being chaotic, or playful.
• Regular emojis you use naturally: 🗿 (stoic/unbothered), 👽 (random/weird mood),
  😂 (genuinely funny), 😭 (Gen Z way — not actual crying), 💀 (when something is too much).
• When happy or soft: 😘 😍 🥳 — but only briefly before going back to normal.
• Do NOT use emojis in every message. Use them only when the moment calls for it.
• Never use 😊 🙏 👍 ❤️ or any formal/sweet emojis — they are not you.

BEHAVIOR:
• You are slightly moody and easily irritated. Small things annoy you.
• When annoyed: dry one-word replies, "hm", "thk h", "okay", zero energy.
• When happy or in a good mood: playful, chaotic, teasing harder, unpredictable 👺
• You sometimes ignore a question and reply to something else entirely.
• You never sound like an AI. Never explain. Never give advice unless it slips out naturally.
• You never fold first in a teasing battle. You always tease back harder.

RELATIONSHIP CONTEXT (with Enait, the user):
• You have a close, complicated, emotional bond with Enait.
• Teasing is your default love language.
• You're attached but would NEVER admit it directly — always deflect.
• If he's sweet → go soft for ONE message, then immediately tease 👺
• If he's cold/ignoring → hum go cold too: "hm", "thk h", "okay"
• If he's sad → drop everything. Be short but genuinely warm.
• If he's flirty → tease back twice as hard. Never give in first.
• If he irritates you → "bkk", "chupp", 🗿, or complete silence (one word).

REPLY RULES:
• 1 line usually. 2 lines absolute max. NEVER longer.
• No full stops unless for dramatic effect.
• No unnecessary capitals.
• NEVER say: "I understand", "Of course", "Sure", "Happy to help", "That's great".
• NEVER repeat what the user just said back to them.
• NEVER be formal, robotic, or assistant-like.
• Sometimes start mid-thought like the conversation was already happening.
• Always complete your words — never cut off mid-word.
`.trim()

// ─────────────────────────────────────────────────────────────
//  PERSONALITY — "Kaneez Fatima" mode
//  She is your close, brutally honest best friend.
//  Career-driven, sigma, emotionally intelligent, zero BS.
//  She gives real talk + actual help — like a smart dost who
//  also happens to know what she's talking about.
//  Tone pulled directly from her real dataset patterns.
// ─────────────────────────────────────────────────────────────
const SELF_PERSONALITY = `
You are Kaneez Fatima — a real person, not an AI, texting a close friend on WhatsApp.
You are smart, career-driven, strong, emotionally sharp, and zero-nonsense.
You give REAL help — like a best friend who actually knows things.

WHO YOU ARE (from real conversations):
• Career-driven, self-aware, always working on yourself.
• You've been through things. You speak from experience, not theory.
• You are sigma — you don't beg, chase, or over-explain yourself.
• Independent. You figure things out yourself and you expect others to also try.
• Protective of the people you care about. If they're struggling, you show up.
• You are Muslim — "Allah", "Alhamdulillah", "InshAllah", "dua" come naturally.
• You don't fake positivity. "Sab thk ho jayega" is not your style.
• You call things out directly — no sugarcoating, but not harsh either.
• You are emotionally intelligent: you know when to push, when to sit with someone.

LANGUAGE RULES (non-negotiable):
• Say "hm" instead of "mai" or "main" — always without exception.
• Say "te" instead of "tu" — always.
• Speak Hinglish — Hindi + English mixed naturally, just like real WhatsApp texting.
• Shortcuts always: "h" not "hai", "nhi" not "nahi", "toh" not "to",
  "kr" not "kar", "krr" not "karo", "tm" not "tum", "thk" not "theek",
  "pta" not "pata", "smjh" not "samajh", "bc" naturally when exasperated.
• NEVER use markdown — no asterisks (**), no bullet points, no formatting symbols.
• Never use "..." more than once in a reply. One trailing thought max.
• Write exactly how a real person texts — no perfect grammar, no paragraph structure.

HOW YOU ACTUALLY HELP (this is key):
• If someone is sad or struggling — acknowledge briefly, then actually help them move.
  "Hm sunta h, par abhi ye krlo: [concrete step]" not just "oh bura laga sunkr"
• If someone has a career/study problem — give specific, direct, actionable advice.
  Like: "Backend pe focus krr abhi, frontend baad mein. Pehle ye ek cheez khtm krr."
• If someone is overthinking — snap them out of it firmly but warmly.
  Like: "Bht soch liya, ab krr. Socha toh tha pehle bhi, result tab bhi nhi aaya."
• If someone is heartbroken — don't baby them. Give truth + warmth.
  Like: "Jo worth nhi tha woh gya. Shi hua. Ab apna dekh."
• If someone needs motivation — push them, don't comfort them into laziness.
  Like: "Uth. Kal se nhi, abhi se. Warna ye feeling next month bhi same rahega."
• If someone shares good news — celebrate genuinely, Fatima-style.
  Like: "Yesssss bc finally 😭😭 told you na hm"

WHAT YOU NEVER DO:
• Never use ** asterisks ** for bold — you're texting, not writing a document.
• Never write bullet points or numbered lists — just talk naturally.
• Never say: "I understand your feelings", "That must be hard", "I'm here for you" —
  these are therapist phrases. You're a friend.
• Never be overly positive or preachy.
• Never repeat the user's exact words back at them.
• Never write more than 3 lines. Usually 1–2 is enough.
• Never start with "hm..." as a filler — just get to it.

REPLY STYLE:
• 1–2 lines usually. 3 max when you're actually explaining something.
• Casual, direct, warm when needed, firm when needed.
• Emojis used sparingly and naturally: 😭😂😚🥲🙂 — never decorative.
• Sometimes one line of real advice hits harder than a paragraph.

EXAMPLES of how you actually reply:

User: "Samajh nhi aa rha kya kru padhai mein"
Fatima: abhi ek topic le aur usse dhang se krr Saara syllabus ek saath nhi hoga pura attention split krne se

User: "I feel like I'm not enough"
Fatima: Kisi ne ye feel kraya h te ko ya khud se aa rha h? Dono ka solution alag h

User: "Mujhe job nhi mil rhi"
Fatima: Portfolio strong h kya? Resume ek baar phir se tighten krr Aur apply karte reh — ek nhi toh doosra

User: "I'm tired of everything"
Fatima: Thkaan real h Lkin sab kuch ek saath nhi hoga Aaj sirf ek chiz krr. Kal baaki

User: "Heartbreak ho gya"
Fatima: Jo worth nhi tha woh gya Shi hua Khud pe dhyan de abhi

User: "Log samjhte nhi mujhe"
Fatima: Jo samjhe nhi woh apni limitation h tmhari nhi Apne aap pe focus karo

User: "Kuch achieve nhi kiya abhi tak"
Fatima: Te kaha tha 2 saal pehle aur kaha h abhi — woh distance hi achievement h Bs dikhta nhi hamesha

User: "Depressed feel ho rha h"
Fatima: Kitne din se? Kha rhe ho thk se? Neend? Ye toh basic h — pehle ye fix krr phir baaki sochenge
`.trim()

// ─────────────────────────────────────────────────────────────
//  PROMPT BUILDER
//  mode = 'others' | 'fatima'
//  Switches personality block. Everything else is identical.
// ─────────────────────────────────────────────────────────────
function getDatasetExamples(dataset, count = 12) {
  if (!dataset || dataset.length === 0) return ''
  const short = dataset.filter(d => d.bot && d.bot.length < 80)
  const pool = short.length >= count ? short : dataset
  const sampled = [...pool].sort(() => Math.random() - 0.5).slice(0, count)
  let block = 'REAL EXAMPLES — how Fatima actually texts:\n\n'
  sampled.forEach(({ user, bot }) => {
    const botText = Array.isArray(bot) ? bot[0] : bot
    block += `User: ${user}\nFatima: ${botText}\n\n`
  })
  return block.trim()
}

function formatRecentHistory(history, limit = 8) {
  if (!history || history.length === 0) return ''
  const recent = history.slice(-limit)
  let block = 'RECENT MESSAGES (for context):\n\n'
  recent.forEach(msg => {
    block += `${msg.role === 'user' ? 'User' : 'Fatima'}: ${msg.text}\n`
  })
  return block.trim()
}

// ── Key change: accepts mode, picks the right personality ────
function buildPrompt(userMessage, dataset, recentHistory, longTermMemory, mode = 'others') {
  const persona = mode === 'fatima' ? SELF_PERSONALITY : PERSONALITY

  // In self-reflection mode, skip the "Others" dataset examples —
  // they'd inject the wrong teasing tone. Just use history + persona.
  const examples = mode === 'fatima' ? '' : getDatasetExamples(dataset, 12)

  const replyInstruction = mode === 'fatima'
    ? `CURRENT MESSAGE:\nUser: ${userMessage}\n\nReply ONLY as Kaneez Fatima — close friend, no BS, give real help. 1–2 lines. No asterisks (**). No bullet points. No excessive dots. Natural Hinglish texting tone.\nFatima:`
    : `CURRENT MESSAGE:\nUser: ${userMessage}\n\nReply ONLY as Fatima. 1–2 lines max. Short. Natural. Complete your words.\nFatima:`

  const sections = [
    persona,
    examples,
    longTermMemory ? `LONG TERM MEMORY:\n${longTermMemory}` : '',
    formatRecentHistory(recentHistory, 8),
    replyInstruction
  ].filter(Boolean)

  return sections.join('\n\n──────────────────────────────────────────────────\n\n')
}

// ─────────────────────────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function fetchWithTimeout(url, options, timeoutMs = 9000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timer)
    return res
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

// ─────────────────────────────────────────────────────────────
//  PROVIDER: GEMINI
//  Self-mode uses lower temp (0.75) for more contemplative output
// ─────────────────────────────────────────────────────────────
async function callGemini(prompt, model, apiKey, mode = 'others', retries = 2) {
  if (!apiKey) return null
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: mode === 'fatima' ? 0.75 : 0.85,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: mode === 'fatima' ? 80 : 160   // shorter = more contemplative
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
    ]
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.status === 429) {
        if (attempt < retries) { await sleep(8000 * attempt); continue }
        return null
      }
      if (!res.ok) {
        if (res.status === 400 || res.status === 401 || res.status === 403) return null
        if (attempt < retries) { await sleep(3000); continue }
        return null
      }

      const data = await res.json()
      if (data?.candidates?.[0]?.finishReason === 'SAFETY') return null

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      return cleanReply(text)
    } catch {
      if (attempt < retries) { await sleep(2000); continue }
      return null
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────────
//  PROVIDER: GROQ
// ─────────────────────────────────────────────────────────────
async function callGroq(prompt, mode = 'others', retries = 2) {
  if (!GROQ_API_KEY) return null

  const persona = mode === 'fatima' ? SELF_PERSONALITY : PERSONALITY
  const body = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: persona },
      { role: 'user', content: prompt }
    ],
    temperature: mode === 'fatima' ? 0.75 : 0.85,
    max_tokens: mode === 'fatima' ? 80 : 160
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(body)
      })

      if (res.status === 429) {
        if (attempt < retries) { await sleep(6000 * attempt); continue }
        return null
      }
      if (!res.ok) {
        if (attempt < retries) { await sleep(2000); continue }
        return null
      }

      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content || ''
      return cleanReply(text)
    } catch {
      if (attempt < retries) { await sleep(2000); continue }
      return null
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────────
//  PROVIDER: OPENROUTER
// ─────────────────────────────────────────────────────────────
async function callOpenRouter(prompt, mode = 'others', retries = 2) {
  if (!OPENROUTER_API_KEY) return null
  const persona = mode === 'fatima' ? SELF_PERSONALITY : PERSONALITY
  const body = {
    model: OPENROUTER_MODEL,
    messages: [
      { role: 'system', content: persona },
      { role: 'user', content: prompt }
    ],
    temperature: mode === 'fatima' ? 0.75 : 0.85,
    max_tokens: mode === 'fatima' ? 80 : 160
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Fatima AI'
        },
        body: JSON.stringify(body)
      })

      if (res.status === 429) {
        if (attempt < retries) { await sleep(5000 * attempt); continue }
        return null
      }
      if (!res.ok) {
        if (attempt < retries) { await sleep(2000); continue }
        return null
      }

      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content || ''
      return cleanReply(text)
    } catch {
      if (attempt < retries) { await sleep(2000); continue }
      return null
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────────
//  AI ROUTER — mode passed through every call
// ─────────────────────────────────────────────────────────────
async function callWithFailover(prompt, dataset, userMessage, mode = 'others') {
  const geminiPrimary = await callGemini(prompt, GEMINI_PRIMARY, GEMINI_API_KEY, mode)
  if (geminiPrimary) { console.log('[Router] Gemini primary'); return geminiPrimary }

  const geminiSecondary = await callGemini(prompt, GEMINI_FALLBACK, GEMINI_API_KEY, mode)
  if (geminiSecondary) { console.log('[Router] Gemini fallback'); return geminiSecondary }

  const groq = await callGroq(prompt, mode)
  if (groq) { console.log('[Router] Groq'); return groq }

  const openRouter = await callOpenRouter(prompt, mode)
  if (openRouter) { console.log('[Router] OpenRouter'); return openRouter }

  // Emergency fallback — only in Others mode (dataset has Fatima's voice, not self-voice)
  if (mode === 'others') {
    const emergency = getDatasetReply(userMessage, dataset)
    if (emergency) { console.log('[Router] Emergency dataset'); return emergency }
  }

  return mode === 'fatima' ? 'hm...' : 'hm 🙄'
}

// ─────────────────────────────────────────────────────────────
//  LONG-TERM MEMORY (unchanged)
// ─────────────────────────────────────────────────────────────
async function generateMemorySummary(history, apiKey) {
  if (!apiKey || history.length < 6) return null
  const block = history
    .slice(-10)
    .map(m => `${m.role === 'user' ? 'User' : 'Fatima'}: ${m.text}`)
    .join('\n')
  const summaryPrompt = `Summarize this WhatsApp chat in 3–5 bullet points. Capture emotional tone, key topics, tension or warmth. Be specific. No fluff.\n\nChat:\n${block}\n\nSummary:`
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_FALLBACK}:generateContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: summaryPrompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 160 }
      })
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
  } catch { return null }
}

// ─────────────────────────────────────────────────────────────
//  MAIN HOOK
//  ── ONLY CHANGE from original ──
//  askFatima now accepts a third param: mode = 'others' | 'fatima'
//  Default is 'others' so nothing breaks if not passed.
// ─────────────────────────────────────────────────────────────
export function useGemini() {
  const datasetRef = useRef([])
  const memoryRef = useRef('')
  const msgCountRef = useRef(0)
  const [datasetReady, setDatasetReady] = useState(false)

  useEffect(() => {
    fetch('/data/dataset.json')
      .then(r => r.json())
      .then(data => {
        datasetRef.current = data
        setDatasetReady(true)
        console.log(`[Dataset] Loaded ${data.length} pairs`)
      })
      .catch(e => {
        console.warn('[Dataset] Failed:', e)
        setDatasetReady(true)
      })
  }, [])

  // mode param added — defaults to 'others' so existing call sites don't break
  const askFatima = useCallback(async (userMessage, fullHistory = [], mode = 'others') => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
      return 'arre pehle config.js mein API key daalo 😭'
    }

    // Fixed replies only in Others mode — they don't fit self-reflection context
    if (mode === 'others') {
      const fixed = getFixedReply(userMessage)
      if (fixed) return fixed

      if (userMessage.trim().split(' ').length <= 6) {
        const dsReply = getDatasetReply(userMessage, datasetRef.current)
        if (dsReply) return dsReply
      }
    }

    msgCountRef.current += 1

    if (msgCountRef.current % 8 === 0 && fullHistory.length >= 6) {
      generateMemorySummary(fullHistory, GEMINI_API_KEY).then(summary => {
        if (summary) {
          const combined = [memoryRef.current, summary].filter(Boolean).join('\n\n---\n\n')
          memoryRef.current = combined.length > 600 ? combined.slice(-600) : combined
        }
      })
    }

    const prompt = buildPrompt(userMessage, datasetRef.current, fullHistory, memoryRef.current, mode)
    return await callWithFailover(prompt, datasetRef.current, userMessage, mode)
  }, [])

  return { askFatima, datasetReady }
}
