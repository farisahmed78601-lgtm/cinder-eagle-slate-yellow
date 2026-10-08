import type { Lang } from "./i18n";

const MALE =
  /\bmale\b|\bman\b|david|mark|daniel|fred|george|james|thomas|ravi|richard|ryan|brian|\bguy\b|tony|nathan/i;

const CONS: Record<string, string> = {
  ب: "ब",
  پ: "प",
  ت: "त",
  ٹ: "ट",
  ث: "स",
  ج: "ज",
  چ: "च",
  ح: "ह",
  خ: "ख",
  د: "द",
  ڈ: "ड",
  ذ: "ज़",
  ر: "र",
  ڑ: "ड़",
  ز: "ज़",
  ژ: "झ",
  س: "स",
  ش: "श",
  ص: "स",
  ض: "ज़",
  ط: "त",
  ظ: "ज़",
  ع: "",
  غ: "ग़",
  ف: "फ़",
  ق: "क़",
  ک: "क",
  ك: "क",
  گ: "ग",
  ل: "ल",
  م: "म",
  ن: "न",
  ہ: "ह",
  ه: "ह",
  ھ: "ह",
  ٻ: "ब",
  ڀ: "भ",
  ٺ: "ठ",
  ٿ: "थ",
  ٽ: "ट",
  ڦ: "फ",
  ڄ: "ज",
  ڃ: "ञ",
  ڇ: "छ",
  ڊ: "ड",
  ڌ: "ध",
  ڏ: "द",
  ڙ: "ड़",
  ڪ: "क",
  ڳ: "ग",
  ڱ: "ङ",
  ڻ: "ण",
};

function isVowel(ch: string) {
  return "اآوویےئےںؤي".includes(ch);
}

function matra(ch: string) {
  if (ch === "آ" || ch === "ا") return "ा";
  if (ch === "ی" || ch === "ي" || ch === "ئ") return "ी";
  if (ch === "ے") return "े";
  if (ch === "و" || ch === "ؤ") return "ो";
  if (ch === "ں") return "ं";
  return "";
}

function fullVowel(ch: string) {
  if (ch === "آ") return "आ";
  if (ch === "ا") return "अ";
  if (ch === "و" || ch === "ؤ") return "ओ";
  if (ch === "ی" || ch === "ي" || ch === "ئ") return "ई";
  if (ch === "ے") return "ए";
  if (ch === "ں") return "ं";
  return "";
}

/** Urdu/Sindhi script → Hindi letters so a Hindi voice can say the whole sentence. */
export function toHindiSpeech(text: string) {
  const chars = [...text.normalize("NFC")];
  let out = "";
  let hang = false;
  for (const ch of chars) {
    if (ch === " " || ch === "\n") {
      hang = false;
      out += " ";
      continue;
    }
    if (/[۔،؛?!.,]/.test(ch)) {
      hang = false;
      out += " । ";
      continue;
    }
    if (/[\u064B-\u065F\u0670\u06D6-\u06ED]/.test(ch)) continue;
    if (isVowel(ch)) {
      out += hang ? matra(ch) : fullVowel(ch);
      hang = false;
      continue;
    }
    const cons = CONS[ch];
    if (!cons) continue;
    if (hang) out += "्";
    out += cons;
    hang = true;
  }
  return out.replace(/\s+/g, " ").trim();
}

function blob(v: SpeechSynthesisVoice) {
  return `${v.name} ${v.lang}`.toLowerCase();
}

function femaleOk(v: SpeechSynthesisVoice) {
  return !MALE.test(blob(v));
}

function pick(voices: SpeechSynthesisVoice[], test: RegExp) {
  const hits = voices.filter((v) => test.test(`${v.lang} ${v.name}`));
  return hits.find(femaleOk) ?? hits[0] ?? null;
}

function speakNow(text: string, lang: Lang) {
  window.speechSynthesis.cancel();
  const voices = window.speechSynthesis.getVoices();
  let spoken = text;
  let voice: SpeechSynthesisVoice | null = null;
  let ulang = "en-GB";

  if (lang === "en") {
    voice = pick(voices, /^en/i);
    ulang = voice?.lang || "en-GB";
  } else if (lang === "sd") {
    voice = pick(voices, /sindhi|^sd-/i) ?? pick(voices, /urdu|^ur-/i);
    if (voice) ulang = voice.lang;
    else {
      spoken = toHindiSpeech(text);
      voice = pick(voices, /^hi/i);
      ulang = voice?.lang || "hi-IN";
    }
  } else {
    voice = pick(voices, /urdu|^ur-/i);
    if (voice) ulang = voice.lang;
    else {
      spoken = toHindiSpeech(text);
      voice = pick(voices, /^hi/i);
      ulang = voice?.lang || "hi-IN";
    }
  }

  if (!spoken) return;
  const u = new SpeechSynthesisUtterance(spoken.slice(0, 1200));
  u.lang = ulang;
  u.rate = 0.9;
  u.pitch = lang === "en" ? 1.12 : 1.02;
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

export function speakLocal(text: string, lang: Lang = "en") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const clean = text.replace(/```[\s\S]*?```/g, " ").replace(/[#*_`]/g, "").trim();
  if (!clean) return;
  const run = () => speakNow(clean, lang);
  if (window.speechSynthesis.getVoices().length > 0) {
    run();
    return;
  }
  window.speechSynthesis.addEventListener("voiceschanged", run, { once: true });
  window.setTimeout(run, 400);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function warmVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
}
