// ============================================================
//  fixedReplies.js — Hardcoded Replies (Layer 1 / Highest Priority)
//
//  📌 HOW TO ADD NEW TRIGGERS:
//    - Add a new object inside the fixedReplies array.
//    - "triggers" = list of words/phrases that activate this reply.
//    - "responses" = list of possible replies. One is picked at random.
//
//  📌 HOW MATCHING WORKS:
//    - The user's message is lowercased and trimmed.
//    - Then we check if ANY trigger word is INCLUDED (substring match)
//      in that message.
//    - Example: trigger "assalam" will match:
//        ✅ "Assalamualaikum"
//        ✅ "assalam bhai"
//        ✅ "assalam o alaikum"
//        ❌ "salam" (does not contain "assalam")
//
//  📌 HOW TO ADD MULTIPLE RESPONSES:
//    - Just add more strings to the "responses" array.
//    - System will randomly pick one every time that trigger fires.
//
//  📌 PRIORITY:
//    - Entries at the TOP of the array have NO special priority.
//    - ALL entries are checked. First match wins.
//    - So put MORE SPECIFIC triggers BEFORE general ones.
//    - Example: put "i love you too" BEFORE "i love you"
//      if you want different replies for each.
//
//  📌 ADDING A NEW ENTRY — FORMAT:
//    {
//      triggers: ["trigger1", "trigger2"],   // All lowercase
//      responses: ["Reply one", "Reply two", "Reply three"]
//    },
// ============================================================

export const fixedReplies = [

  // ── Islamic Greetings ──────────────────────────────────────
  {
    triggers: ["assalamualaikum", "assalam", "assalamu alaikum", "a.o.a", "aoa"],
    responses: ["Walaikumassalam"]
  },
  {
    triggers: ["alhamdulillah", "alham", "alhumdulillah"],
    responses: ["Alhamdulillah"]
  },
  {
    triggers: ["allah hafiz", "allahafiz", "allah hafis"],
    responses: ["Allah Hafiz 🤍"]
  },
  {
    triggers: ["subhanallah"],
    responses: ["Subhanallah 🤍"]
  },
  {
  triggers: [
    "sex", "sexy", "kiss me", "nudes", "nude", "send pic", "send pics",
    "horny", "hot", "turn me on", "bed", "sleep together",
    "make out", "touch you", "body", "boobs", "ass",
    "come over", "private", "alone with you",
    "dirty talk", "s*x", "s3x"
  ],
  responses: [
    "Phir wahi sac sux wali baatein",
    "Bsdk teri hawas dikh rahi h",
    "Gaon ki koi ladki dhundle mjhse nahi ho payega ye sb",
    "Hawas control nahi horhi tere se bc",
    "Are you just physically attracted to me?"
  ]
},
  {
    triggers: ["mashallah", "masha allah", "mashaAllah"],
    responses: ["Mashallah 🤍"]
  },

  // ── Feelings / How are you ────────────────────────────────
  {
    // ⚠️ "kaisi ho" BEFORE "kaise ho" — more specific first
    triggers: ["kaisi ho", "kaisi hain", "kaisi h"],
    responses: [
      "Mujhe kya hua h?",
      "Alhamdulillah tm?",
      "hein mujhe kya hua h be"
    ]
  },
  {
    triggers: ["kaise ho", "kaise hain", "kaise h", "how are you", "how r u"],
    responses: [
      "thk h",
      "Kya hua h mujhe?",
      "Alhamdulillah"
    ]
  },

  // ── Love / Flirty ─────────────────────────────────────────
  {
    // More specific → put FIRST before "love you"
    triggers: ["i love you too", "love you too", "love u too"],
    responses: [
      "🙂",
      "chupp",
      "hm okay"
    ]
  },
  {
    triggers: ["i love you", "love you", "love u", "luv u", "luv you"],
    responses: [
      "Fuck you",
      "Fuck you Bada aaya",
      "Sb pta h what you do"
    ]
  },
  {
    triggers: ["miss you", "miss u", "miss kr rha"],
    responses: [
      "chal bc sb pata h",
      "jhoot mat bol",
      "Fuck off"
    ]
  },

  // ── Goodnight / Goodmorning ───────────────────────────────
  {
    triggers: ["good night", "goodnight", "gn", "g night"],
    responses: [
      "gn 🤍",
      "so ja ab",
      "hm gn"
    ]
  },
  {
    triggers: ["good morning", "goodmorning", "gm", "subah bakhair"],
    responses: [
      "gm 🙂",
      "subah bakhair",
      "uth gye?"
    ]
  },

  // ── Anger / Ignoring ──────────────────────────────────────
  {
    triggers: ["chupp", "shut up", "chup kr", "stop it"],
    responses: [
      "tm chupp",
      "🙂",
      "okay bhai okay"
    ]
  },

  // ── Salam / Bye ───────────────────────────────────────────
  {
    triggers: ["bye", "bye bye", "bbye", "alvida"],
    responses: [
      "bye 🙂",
      "thk h bye",
      "ja"
    ]
  },
  {
  triggers: ["sorry", "i am sorry"],
  responses: [
    "hm thk h",
    "har baar same cheez",
    "bolne se kya hota h?"
  ]
},
{
  triggers: ["good night", "gn"],
  responses: [
    "hm",
    "thk h soja",
    "good night… zyada soch mt"
  ]
},
{
  triggers: ["talk to me", "baat karo"],
  responses: [
    "ab yaad aayi?",
    "hm bol",
    "jab mann hota h tab aata h"
  ]
},

{
  triggers: ["call karu"],
  responses: [
    "idhar hi bol",
    "call kyu?",
    "zarurat nhi"
  ]
},

{
  triggers: ["sun na"],
  responses: [
    "bolo",
    "hm sun rhi",
    "jaldi bol"
  ]
},

{
  triggers: ["kya karu"],
  responses: [
    "mujhse puch rha h?",
    "jo krna h kr",
    "soch le khud"
  ]
}

  // ── Add more entries below this line ──────────────────────
  // {
  //   triggers: ["your trigger here"],
  //   responses: ["Reply 1", "Reply 2"]
  // },

]
