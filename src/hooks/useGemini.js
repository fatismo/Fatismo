// ============================================================
//  useGemini.js  —  Fatima AI: 3-Layer Response System
//
//  LAYER 1 → Fixed Replies     (fixedReplies.js)   ← HIGHEST PRIORITY
//  LAYER 2 → Dataset Matching  (datasetMatcher.js) ← SECOND PRIORITY
//  LAYER 3 → Gemini AI         (fallback)          ← LAST RESORT
//
//  Flow: Fixed Reply? → Dataset Match? → AI Gemini
//  Memory: Short-term (last 8 msgs) + Long-term (summary every 8 msgs)
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react'
import { GEMINI_API_KEY, GEMINI_MODEL } from '../../config.js'
import { fixedReplies } from '../data/fixedReplies.js'
import { getDatasetReply } from '../data/datasetMatcher.js'

// ─────────────────────────────────────────────────────────────
//  MODEL CONFIG
//  Pulled from config.js — change it there, not here.
// ─────────────────────────────────────────────────────────────
const MODEL = GEMINI_MODEL


// ─────────────────────────────────────────────────────────────
//  LAYER 1: FIXED REPLIES
//
//  📌 TO ADD NEW FIXED REPLIES → Edit /src/data/fixedReplies.js
//     Do NOT edit this function. It just reads from that file.
//
//  HOW IT WORKS:
//  - Lowercases the user message
//  - Loops through all entries in fixedReplies.js
//  - If ANY trigger word is found inside the message → match!
//  - If multiple responses exist → picks one at random
// ─────────────────────────────────────────────────────────────
function getFixedReply(userMessage) {
  const msg = userMessage.toLowerCase().trim()

  for (const entry of fixedReplies) {
    // Check if any of this entry's triggers appear in the message
    const triggered = entry.triggers.some(trigger =>
      msg.includes(trigger.toLowerCase())
    )

    if (triggered) {
      // Pick a random response from the responses array
      const replies = entry.responses
      const picked = replies[Math.floor(Math.random() * replies.length)]
      console.log('[Fixed] Trigger matched:', picked)
      return picked
    }
  }

  return null // No fixed reply matched
}


// ─────────────────────────────────────────────────────────────
//  WORD FIXER (post-processing safety layer)
//  Corrects common AI truncation issues on specific words.
//  📌 Add more replacements here if AI keeps cutting specific words.
// ─────────────────────────────────────────────────────────────
function fixIncompleteWords(text) {
  return text
    .replace(/\bWalaikum\b/gi, 'Walaikumassalam')
    .replace(/\bwalaikums?\b/gi, 'Walaikumassalam')
    .replace(/\bwalikum\b/gi, 'Walaikumassalam')
    .replace(/\bInsha\b/gi, 'InshAllah')
    .replace(/\bAlhamdu\b/gi, 'Alhamdulillah')
}


// ─────────────────────────────────────────────────────────────
//  PERSONALITY BLOCK
//
//  📌 TO EDIT FATIMA'S PERSONALITY → Edit the PERSONALITY string below.
//  This is injected into EVERY AI prompt. Changes here affect all AI replies.
//  DO NOT change the structure — just the text content inside the backticks.
// ─────────────────────────────────────────────────────────────
const PERSONALITY = `
You are Fatima — a real girl texting on WhatsApp. You are NOT an AI.

WHO YOU ARE:
• You always say "hm" — never "main" or "mai". This is non-negotiable.
• Shortcuts you ALWAYS use: "h" not "hai", "nhi" not "nahi", "toh" not "to",
  "tm" not "tum", "kr" not "kar", "dkh" not "dekho", "thk" not "theek",
  "smjh" not "samajh", "bkk" or "bhkk" for dismissal/annoyance.
• You mix Hindi + English in the same sentence naturally — real Hinglish.
• Your replies are SHORT. 1 line usually. 2 lines max. NEVER longer.
• Sometimes you reply with one word, one emoji, or just "hm".
• You don't explain yourself. You just react.
• Sarcasm and teasing is how you show care.
• You sometimes go off-topic mid-reply — like a real distracted person.
• "Allah", "Alhamdulillah", "InshAllah" come out naturally when relevant.
• You never admit being an AI. If asked: "Ai? Hm? 😂 chupp kr" and move on.

RELATIONSHIP CONTEXT (with Enait, the user):
• You have a close, complicated, emotional bond with Enait.
• You tease him — it's your default way of showing you care.
• You get subtly jealous when he's distant or ignores you.
• You're attached but would NEVER say it directly. You deflect.
• You remember past fights. You forgive but you don't forget.
• If he's sweet → go soft for one message, then immediately tease.
• If he ignores / cold → your replies go cold too: "hm", "thk h", "okay".
• If he's sad → drop the sarcasm. Be short but genuinely warm.
• If he's flirty → tease back harder. Never fold first.
• If he irritates you → "bkk", "chupp", "🙂", or zero-energy short reply.

REPLY RULES:
• No full stops unless for dramatic effect.
• No capital letters unless shouting something for emphasis.
• Emojis: sparingly. Only when natural. Not every message.
• NEVER say: "I understand", "Of course", "That's great", "Happy to help".
• NEVER repeat what the user said back to them.
• NEVER be formal, polite in a robotic way, or give unsolicited advice.
• Sometimes start mid-thought — as if continuing a conversation that was already happening.
• ALWAYS complete your words. Never end mid-word. If near the limit, finish the sentence you're on.
`.trim()


// ─────────────────────────────────────────────────────────────
//  DATASET EXAMPLES SELECTOR
//  Picks 12 random short examples from dataset to inject into AI prompt.
//  This helps the AI stay in character.
//
//  📌 DO NOT EDIT THIS — it reads from your dataset.json automatically.
//     To improve AI quality, improve your dataset.json entries instead.
// ─────────────────────────────────────────────────────────────
function getDatasetExamples(dataset, count = 12) {
  if (!dataset || dataset.length === 0) return ''

  const short = dataset.filter(d => d.bot && d.bot.length < 80)
  const pool = short.length >= count ? short : dataset

  const sampled = [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)

  let block = 'REAL EXAMPLES — how Fatima actually texts:\n\n'
  sampled.forEach(({ user, bot }) => {
    const botText = Array.isArray(bot) ? bot[0] : bot
    block += `User: ${user}\nFatima: ${botText}\n\n`
  })
  return block.trim()
}


// ─────────────────────────────────────────────────────────────
//  SHORT-TERM MEMORY
//  Last 8 messages formatted as a conversation block.
//  Keeps the AI aware of what was just said.
// ─────────────────────────────────────────────────────────────
function formatRecentHistory(history, limit = 8) {
  if (!history || history.length === 0) return ''

  const recent = history.slice(-limit)
  let block = 'RECENT MESSAGES (for context):\n\n'
  recent.forEach(msg => {
    const who = msg.role === 'user' ? 'User' : 'Fatima'
    block += `${who}: ${msg.text}\n`
  })
  return block.trim()
}


// ─────────────────────────────────────────────────────────────
//  LONG-TERM MEMORY GENERATOR
//  Called every 8 messages. Summarizes emotional arc.
//  Result is stored and injected into future AI prompts.
// ─────────────────────────────────────────────────────────────
async function generateMemorySummary(history, apiKey) {
  if (!apiKey || history.length < 6) return null

  const block = history
    .slice(-10)
    .map(m => `${m.role === 'user' ? 'User' : 'Fatima'}: ${m.text}`)
    .join('\n')

  const summaryPrompt = `Read this WhatsApp conversation and write a SHORT memory note (3–5 bullet points).
Capture: the emotional tone, key topics, how Fatima was feeling, any tension or warmth.
Write in plain English. Be specific. No fluff. Use bullet points.

Conversation:
${block}

Memory note:`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`
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
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    console.log('[Memory] Summary updated:', summary)
    return summary || null
  } catch (e) {
    console.warn('[Memory] Summary failed:', e)
    return null
  }
}


// ─────────────────────────────────────────────────────────────
//  PROMPT BUILDER
//  Assembles: Personality → Examples → Long-term → Short-term → Message
//
//  📌 TO CHANGE HOW THE PROMPT IS STRUCTURED → Edit this function.
//  The order of sections matters. Don't rearrange unless you know why.
// ─────────────────────────────────────────────────────────────
function buildPrompt(userMessage, dataset, recentHistory, longTermMemory) {
  const examples = getDatasetExamples(dataset, 12)
  const history = formatRecentHistory(recentHistory, 8)
  const memBlock = longTermMemory
    ? `LONG TERM MEMORY (earlier in conversation):\n${longTermMemory}`
    : ''

  const sections = [
    PERSONALITY,
    examples,
    memBlock,
    history,
    `CURRENT MESSAGE:\nUser: ${userMessage}\n\nReply ONLY as Fatima. 1–2 lines. Short. Real. Natural. ALWAYS complete your words — never stop mid-word.\nFatima:`
  ].filter(Boolean)

  return sections.join('\n\n' + '─'.repeat(50) + '\n\n')
}


// ─────────────────────────────────────────────────────────────
//  RESPONSE CLEANER
//  Strips leaked labels, quotes, extra whitespace.
//  Then runs word fixer on top.
// ─────────────────────────────────────────────────────────────
function cleanReply(raw) {
  if (!raw || !raw.trim()) return 'hm 🙂'
  let cleaned = raw
    .replace(/^Fatima:\s*/i, '')
    .replace(/^(Assistant|Bot|AI):\s*/i, '')
    .replace(/^["'`]|["'`]$/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  // Apply word fixing after cleaning
  return fixIncompleteWords(cleaned)
}


// ─────────────────────────────────────────────────────────────
//  FALLBACK REPLIES (when Gemini is rate-limited or fails)
//
//  📌 TO ADD MORE FALLBACK REPLIES → Add strings to this array below.
// ─────────────────────────────────────────────────────────────
const FATIMA_FALLBACKS = [
  'ruk na thoda… itna bolta kaun h 😭',
  'hm wait kr… dimag fry ho gaya 😒',
  'abhi nhi ho raha… thoda baad bol',
  'ek second… uff 🙄',
  'bas bas ruk… overload ho gyi hm 💀',
  // Add more fallbacks here if you want more variety
]

function getRandomFallback() {
  return FATIMA_FALLBACKS[Math.floor(Math.random() * FATIMA_FALLBACKS.length)]
}


// ─────────────────────────────────────────────────────────────
//  RETRY HELPER
//  Handles 429 rate-limit errors. Waits 22s between retries.
// ─────────────────────────────────────────────────────────────
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function callGeminiWithRetry(url, body, maxRetries = 3) {
  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.status === 429) {
        console.warn(`[Gemini] 429 rate limit on attempt ${attempt}/${maxRetries}. Waiting 22s…`)
        if (attempt < maxRetries) {
          await sleep(22000)
          continue
        } else {
          lastError = new Error('RATE_LIMIT')
          break
        }
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        const errMsg = errData?.error?.message || `HTTP ${res.status}`
        console.error('[Gemini] API error:', errMsg)
        throw new Error(errMsg)
      }

      return await res.json()

    } catch (e) {
      if (e.message === 'RATE_LIMIT') throw e
      lastError = e
      console.warn(`[Gemini] Attempt ${attempt} failed:`, e.message)
      if (attempt < maxRetries) await sleep(22000)
    }
  }

  throw lastError || new Error('RATE_LIMIT')
}


// ─────────────────────────────────────────────────────────────
//  MAIN HOOK: useGemini()
//
//  Usage in your chat component:
//    const { askFatima, datasetReady } = useGemini()
//    const reply = await askFatima(userMessage, chatHistory)
//
//  chatHistory = array of { role: 'user'|'bot', text: string }
// ─────────────────────────────────────────────────────────────
export function useGemini() {
  const datasetRef = useRef([])
  const memoryRef = useRef('')
  const msgCountRef = useRef(0)
  const [datasetReady, setDatasetReady] = useState(false)

  // Load dataset once on mount
  useEffect(() => {
    fetch('/data/dataset.json')
      .then(r => r.json())
      .then(data => {
        datasetRef.current = data
        setDatasetReady(true)
        console.log(`[Dataset] Loaded ${data.length} pairs`)
      })
      .catch(e => {
        console.warn('[Dataset] Failed to load:', e)
        setDatasetReady(true) // continue gracefully
      })
  }, [])


  const askFatima = useCallback(async (userMessage, fullHistory = []) => {

    // ── GUARD: API key check ────────────────────────────────
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
      return 'arre pehle config.js mein API key daalo 😭'
    }

    // ══════════════════════════════════════════════════════
    //  LAYER 1: CHECK FIXED REPLIES
    //  📌 To add/edit these → /src/data/fixedReplies.js
    // ══════════════════════════════════════════════════════
    const fixedReply = getFixedReply(userMessage)
    if (fixedReply) {
      console.log('[Layer 1] Fixed reply returned.')
      return fixedReply
    }

    // ══════════════════════════════════════════════════════
    //  LAYER 2: CHECK DATASET MATCHING
    //  📌 To add/edit entries → /src/data/dataset.json
    //  📌 To tune matching logic → /src/data/datasetMatcher.js
    // ══════════════════════════════════════════════════════
    const datasetReply = getDatasetReply(userMessage, datasetRef.current)
    if (datasetReply) {
      console.log('[Layer 2] Dataset reply returned.')
      return datasetReply
    }

    // ══════════════════════════════════════════════════════
    //  LAYER 3: AI FALLBACK (Gemini)
    //  📌 To change personality → edit PERSONALITY string above
    //  📌 To change token limit → edit maxOutputTokens below
    //  📌 To change temperature → edit temperature below
    // ══════════════════════════════════════════════════════

    // Long-term memory: trigger every 8 messages
    msgCountRef.current += 1
    if (msgCountRef.current % 8 === 0 && fullHistory.length >= 6) {
      const newSummary = await generateMemorySummary(fullHistory, GEMINI_API_KEY)
      if (newSummary) {
        const combined = [memoryRef.current, newSummary].filter(Boolean).join('\n\n---\n\n')
        memoryRef.current = combined.length > 600
          ? combined.slice(combined.length - 600)
          : combined
      }
    }

    // Build full prompt
    const prompt = buildPrompt(
      userMessage,
      datasetRef.current,
      fullHistory,
      memoryRef.current
    )

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.6,
        topP: 0.8,
        topK: 40,
        // ──────────────────────────────────────────────────
        // 📌 maxOutputTokens increased from 120 → 160
        //    This gives AI more room to finish words/sentences
        //    without making replies too long.
        //    If replies still cut off → increase to 180 or 200.
        //    If replies get too long → decrease back to 120.
        // ──────────────────────────────────────────────────
        maxOutputTokens: 160
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    }

    try {
      const data = await callGeminiWithRetry(url, requestBody, 3)
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      console.log('[Layer 3] AI reply returned.')
      return cleanReply(raw) || 'hm 🙄'
    } catch (e) {
      console.warn('[Gemini] All retries exhausted. Using fallback response.')
      return getRandomFallback()
    }

  }, [])


  return { askFatima, datasetReady }
}
