// ╔══════════════════════════════════════════════════════════╗
// ║  config.js  —  All configurable values in ONE place      ║
// ╚══════════════════════════════════════════════════════════╝

// ── 🔑  GEMINI API KEY ────────────────────────────────────────
// Get a free key at: https://aistudio.google.com/app/apikey
// Paste it below between the quotes
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// ── 🤖  GEMINI MODEL ──────────────────────────────────────────
export const GEMINI_MODEL = "gemini-2.5-flash-lite";

// ── 🖼️  IMAGE PATHS ───────────────────────────────────────────
// Drop  bot.png  and  bg.jpg  into the  public/assets/  folder
// then these paths will work automatically.
export const BOT_AVATAR = "/assets/bot.png";
export const BG_IMAGE   = "/assets/bg.jpg";

// ── 👤  CONTACT INFO ──────────────────────────────────────────
export const CONTACT_NAME   = "Enait's Fatima";
export const CONTACT_STATUS = "online";
