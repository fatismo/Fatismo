// ============================================================
//  datasetMatcher.js — Dataset Matching Logic (Layer 2)
//
//  This function tries to find the BEST reply from your dataset.json
//  before falling back to the AI.
//
//  📌 HOW YOUR DATASET.JSON SHOULD BE STRUCTURED:
//    A JSON array of objects, each with "user" and "bot" fields:
//    [
//      { "user": "kya kr rhi ho", "bot": "kuch nhi bas baith ke hm" },
//      { "user": "baat krni h", "bot": "bol na" },
//      ...
//    ]
//
//  📌 HOW MATCHING WORKS (2 levels, in order):
//
//    1. EXACT MATCH  (strongest)
//       User types: "kya kr rhi ho"
//       Dataset has: "kya kr rhi ho"
//       → Matched! Returns that bot reply instantly.
//
//    2. HIGH-OVERLAP MATCH  (smart)
//       Splits both messages into words.
//       Counts how many words OVERLAP.
//       If overlap ≥ 70% of user's words → it's a match.
//       Example:
//         User: "kya kr rhi ho aajkal"     (5 words)
//         Dataset: "kya kr rhi ho"          (4 words)
//         Overlap: 4 words → 4/5 = 80% → MATCH ✅
//
//         User: "kya haal h"               (3 words)
//         Dataset: "kya kr rhi ho"          (4 words)
//         Overlap: 1 word → 1/3 = 33% → NO MATCH ❌ → AI handles it
//
//  📌 HOW TO ADD MORE DATASET ENTRIES:
//    Open /src/data/dataset.json and add objects like:
//    { "user": "what the user might say", "bot": "what Fatima replies" }
//
//  📌 TIPS FOR BETTER MATCHING ACCURACY:
//    ✅ Use common shorthand: "h" not "hai", "tm" not "tum"
//    ✅ Add multiple entries for the same topic with slight variations
//    ✅ Keep "bot" replies short (under 80 chars) — they feel more natural
//    ✅ Don't use punctuation in "user" field — people rarely type it
//    ❌ Avoid entries that are too generic (like just "hm" or "okay")
//       because they'll match almost everything
//
//  📌 HOW TO TEST IF MATCHING WORKS:
//    Add this temporarily in your component or browser console:
//
//    import { getDatasetReply } from './datasetMatcher'
//    import dataset from './dataset.json'
//    console.log(getDatasetReply("kya kr rhi ho", dataset))
//
//    If it returns a reply → matching worked.
//    If it returns null → no match found, AI will handle it.
//
//  📌 COMMON MISTAKES TO AVOID:
//    ❌ Using "hai" in dataset when people type "h" — won't match
//    ❌ Making "bot" replies too long — defeats the personality
//    ❌ Adding duplicate "user" entries — wastes dataset space
//    ❌ Forgetting to save dataset.json after editing
// ============================================================


/**
 * Normalize a message for comparison:
 * - Lowercase
 * - Trim whitespace
 * - Collapse multiple spaces
 */
function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ')
}


/**
 * Split a message into a Set of unique words.
 * Useful for overlap calculation.
 */
function wordSet(text) {
  return new Set(normalize(text).split(' ').filter(w => w.length > 1))
}


/**
 * Calculate overlap ratio between two word sets.
 * Returns a number between 0 and 1.
 * 1.0 = perfect word overlap, 0 = no overlap
 */
function overlapRatio(userWords, datasetWords) {
  if (userWords.size === 0) return 0
  let matchCount = 0
  userWords.forEach(word => {
    if (datasetWords.has(word)) matchCount++
  })
  return matchCount / userWords.size
}


/**
 * Pick one reply at random from an array.
 * Works whether the "bot" field is a string OR an array of strings.
 *
 * This lets you future-proof your dataset like this:
 *   { "user": "kaisi ho", "bot": ["thk h", "bas yhi", "hm thk"] }
 * OR keep it simple:
 *   { "user": "kaisi ho", "bot": "thk h" }
 */
function pickReply(botField) {
  if (Array.isArray(botField)) {
    return botField[Math.floor(Math.random() * botField.length)]
  }
  return botField
}


/**
 * Main export: getDatasetReply
 *
 * @param {string} userMessage  — what the user typed
 * @param {Array}  dataset      — your dataset.json array
 * @returns {string|null}       — matched reply, or null if no match
 */
export function getDatasetReply(userMessage, dataset) {
  if (!dataset || dataset.length === 0) return null
  if (!userMessage || !userMessage.trim()) return null

  const normalizedInput = normalize(userMessage)
  const userWords = wordSet(userMessage)

  let bestMatch = null
  let bestScore = 0

  for (const entry of dataset) {
    if (!entry.user || !entry.bot) continue

    const normalizedEntry = normalize(entry.user)

    // ── Level 1: Exact match ───────────────────────────────
    if (normalizedInput === normalizedEntry) {
      console.log('[Dataset] Exact match:', normalizedEntry)
      return pickReply(entry.bot)
    }

    // ── Level 2: High word overlap (70% threshold) ─────────
    const entryWords = wordSet(entry.user)
    const overlap = overlapRatio(userWords, entryWords)

    // 70% or more word overlap = strong match → use dataset reply
    // Below 70% → no match → AI (Gemini) will handle it
    if (overlap >= 0.7 && overlap > bestScore) {
      bestScore = overlap
      bestMatch = entry
    }
  }

  if (bestMatch) {
    console.log(`[Dataset] Match found (score: ${bestScore.toFixed(2)}):`, bestMatch.user)
    return pickReply(bestMatch.bot)
  }

  // No match found — let AI handle it
  return null
}