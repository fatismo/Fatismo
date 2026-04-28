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

// ── 🖼️  BACKGROUND SLIDESHOW IMAGES ──────────────────────────
// Add or remove image paths here to control the slideshow.
// Images must be placed in public/assets/
export const BG_IMAGES = [
  "/assets/bg1.jpg",
  "/assets/bg2.jpg.jpeg",
  "/assets/bg3.jpg.jpeg",
  "/assets/bg4.jpg.jpeg",
  "/assets/bg5.jpg.jpeg",
  "/assets/bg6.jpg.jpeg",
  "/assets/bg7.jpg.jpeg",
  "/assets/bg8.jpg.jpeg",
  "/assets/bg9.jpg.jpeg",
  "/assets/bg10.jpg.jpeg",
];


// ── 👤  CONTACT INFO ──────────────────────────────────────────
export const CONTACT_NAME   = "Enait's Fatima";
export const CONTACT_STATUS = "online";
