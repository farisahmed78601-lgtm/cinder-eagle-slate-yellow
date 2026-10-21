import type { Lang } from "./i18n";
import { loadLive } from "./live";
import { speakHinaAudio } from "./api";

const MALE =
  /\bmale\b|\bman\b|david|mark|daniel|fred|george|james|thomas|ravi|richard|ryan|brian|\bguy\b|tony|nathan/i;

/** Common words spoken the way people actually say them. */
const WORD: Record<string, string> = {
  "میں": "mein",
  "ہوں": "hoon",
  "ہے": "hai",
  "ہیں": "hain",
  "ہو": "ho",
  "کا": "ka",
  "کی": "ki",
  "کے": "kay",
  "کو": "ko",
  "سے": "say",
  "پر": "par",
  "اور": "aur",
  "یہ": "yeh",
  "وہ": "woh",
  "ایک": "aik",
  "نہیں": "nahin",
  "نہ": "na",
  "بھی": "bhi",
  "تو": "to",
  "کہ": "keh",
  "جو": "jo",
  "اس": "is",
  "ان": "in",
  "ہم": "hum",
  "آپ": "aap",
  "سلام": "salaam",
  "علیکم": "alaikum",
  "السلام": "assalaam",
  "ہنا": "Hina",
  "هناءَ": "Hina",
  "هناء": "Hina",
  "پاکستان": "Pakistan",
  "پاڪستان": "Pakistan",
  "کراچی": "Karachi",
  "ڪراچي": "Karachi",
  "سندھ": "Sindh",
  "سنڌ": "Sindh",
  "سندھی": "Sindhi",
  "سنڌي": "Sindhi",
  "اردو": "Urdu",
  "اسلام": "Islam",
  "آباد": "abad",
  "دل": "dil",
  "خون": "khoon",
  "رت": "rat",
  "جسم": "jism",
  "پانی": "paani",
  "پاڻي": "paani",
  "سورج": "sooraj",
  "سج": "suj",
  "زمین": "zameen",
  "زمين": "zameen",
  "چاند": "chaand",
  "چنڊ": "chand",
  "زبان": "zubaan",
  "ٻولي": "boli",
  "بجلی": "bijli",
  "بجلي": "bijli",
  "نیند": "neend",
  "ننڊ": "nind",
  "پڑھائی": "parhai",
  "امتحان": "imtehan",
  "آکسیجن": "oxygen",
  "نماز": "namaz",
  "رمضان": "Ramzan",
  "قرآن": "Quran",
  "ساٹھ": "saath",
  "سو": "sau",
  "سات": "saat",
  "ست": "sat",
  "نو": "nau",
  "پانچ": "paanch",
  "پنج": "panj",
  "چار": "chaar",
  "دو": "do",
  "تین": "teen",
  "آٹھ": "aath",
  "اٺ": "ath",
  "دس": "das",
  "منٹ": "minute",
  "گھنٹے": "ghantay",
  "ڪلاڪ": "kalaak",
  "شہر": "sheher",
  "شهر": "sheher",
  "دریا": "darya",
  "درياءُ": "darya",
  "دريا": "darya",
  "سمندر": "samundar",
  "سمنڊ": "samund",
  "پہاڑ": "pahaar",
  "جبل": "jabal",
  "جبلن": "jabalan",
  "پودے": "poday",
  "ٻوٽا": "boota",
  "خوراک": "khorak",
  "کاڌو": "khado",
  "روشنی": "roshni",
  "روشني": "roshni",
  "بادل": "baadal",
  "ڪڪر": "kakar",
  "بارش": "baarish",
  "مينهن": "meenhan",
  "برف": "barf",
  "قومی": "qaumi",
  "آهي": "aahe",
  "آهيان": "aahiyan",
  "آهين": "aaheen",
  "مان": "maan",
  "ٿو": "tho",
  "ٿي": "thee",
  "۾": "mein",
  "۽": "ain",
  "جي": "jee",
  "کي": "khe",
  "لاءِ": "laai",
  "لاء": "laai",
  "نه": "na",
  "هي": "hee",
  "اهو": "uho",
  "اها": "uha",
  "گهرجي": "ghurje",
  "مدد": "madad",
  "سوال": "sawaal",
  "جواب": "jawaab",
};

type Unit = { p: string; v: boolean };

const UNITS: [string, string, boolean][] = [
  ["چھ", "ch", false],
  ["ش", "sh", false],
  ["خ", "kh", false],
  ["غ", "gh", false],
  ["ژ", "zh", false],
  ["آ", "aa", true],
  ["ا", "a", true],
  ["ب", "b", false],
  ["پ", "p", false],
  ["ت", "t", false],
  ["ٹ", "t", false],
  ["ث", "s", false],
  ["ج", "j", false],
  ["چ", "ch", false],
  ["ح", "h", false],
  ["د", "d", false],
  ["ڈ", "d", false],
  ["ذ", "z", false],
  ["ر", "r", false],
  ["ڑ", "r", false],
  ["ز", "z", false],
  ["س", "s", false],
  ["ص", "s", false],
  ["ض", "z", false],
  ["ط", "t", false],
  ["ظ", "z", false],
  ["ع", "a", true],
  ["ف", "f", false],
  ["ق", "q", false],
  ["ک", "k", false],
  ["ك", "k", false],
  ["گ", "g", false],
  ["ل", "l", false],
  ["م", "m", false],
  ["ن", "n", false],
  ["ں", "n", false],
  ["و", "o", true],
  ["ہ", "h", false],
  ["ه", "h", false],
  ["ھ", "h", false],
  ["ی", "ee", true],
  ["ي", "ee", true],
  ["ے", "ay", true],
  ["ئ", "y", false],
  ["ء", "", true],
  ["ٻ", "b", false],
  ["ڀ", "bh", false],
  ["ٺ", "th", false],
  ["ٿ", "th", false],
  ["ٽ", "t", false],
  ["ڦ", "ph", false],
  ["ڄ", "j", false],
  ["ڃ", "ny", false],
  ["ڇ", "chh", false],
  ["ڊ", "d", false],
  ["ڌ", "dh", false],
  ["ڏ", "dd", false],
  ["ڙ", "r", false],
  ["ڪ", "k", false],
  ["ڳ", "g", false],
  ["ڱ", "ng", false],
  ["ڻ", "n", false],
];

function normWord(word: string) {
  return word.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/[ى]/g, "ی");
}

const SAID: Record<string, string> = {};
for (const [k, v] of Object.entries(WORD)) {
  SAID[k] = v;
  SAID[normWord(k)] = v;
}

function romanizeWord(raw: string) {
  const word = normWord(raw);
  if (!word) return "";
  if (SAID[raw]) return SAID[raw];
  if (SAID[word]) return SAID[word];
  if (/^[0-9]+$/.test(word) || /^[A-Za-z0-9]+$/.test(word)) return word;
  const chars = [...word];
  const parts: Unit[] = [];
  for (let i = 0; i < chars.length; i++) {
    const two = chars[i] + (chars[i + 1] ?? "");
    const hit =
      UNITS.find((u) => u[0].length === 2 && u[0] === two) ?? UNITS.find((u) => u[0] === chars[i]);
    if (!hit) {
      if (/[A-Za-z0-9]/.test(chars[i] ?? "")) parts.push({ p: chars[i] ?? "", v: true });
      continue;
    }
    if (!hit[1]) continue;
    if (hit[0].length === 2) i += 1;
    parts.push({ p: hit[1], v: hit[2] });
  }
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    out += parts[i].p;
    const nxt = parts[i + 1];
    if (!parts[i].v && nxt && !nxt.v) out += "a";
  }
  return out;
}

/** Full-word pronunciation an English voice can say clearly. */
export function toClearSpeech(text: string) {
  return text
    .replace(/[۔]/g, ". ")
    .replace(/[،؛]/g, ", ")
    .split(/(\s+)/)
    .map((part) => {
      if (/^\s+$/.test(part)) return " ";
      const bits = part.split(/([.!?])/);
      return bits
        .map((bit) => {
          if (/^[.!?]$/.test(bit)) return bit;
          const word = bit.replace(/^[«"'(\[]+|[»"')\],:]+$/g, "");
          if (!word) return bit;
          const said = romanizeWord(word);
          return said || bit;
        })
        .join("");
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function blob(v: SpeechSynthesisVoice) {
  return `${v.name} ${v.lang}`.toLowerCase();
}

function pick(voices: SpeechSynthesisVoice[], test: RegExp) {
  const hits = voices.filter((v) => test.test(`${v.lang} ${v.name}`));
  return hits.find((v) => !MALE.test(blob(v))) ?? hits[0] ?? null;
}

function queue(parts: string[], voice: SpeechSynthesisVoice | null, ulang: string, rate: number, pitch: number) {
  return new Promise<void>((resolve) => {
    const chunks = parts.map((p) => p.trim()).filter(Boolean);
    if (!chunks.length) {
      resolve();
      return;
    }
    let i = 0;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearInterval(kick);
      resolve();
    };
    const kick = window.setInterval(() => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending && i >= chunks.length) finish();
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 4000);
    const next = () => {
      if (i >= chunks.length) {
        finish();
        return;
      }
      const u = new SpeechSynthesisUtterance(chunks[i] ?? "");
      i += 1;
      u.lang = ulang;
      u.rate = rate;
      u.pitch = pitch;
      if (voice) u.voice = voice;
      u.onend = () => window.setTimeout(next, 40);
      u.onerror = () => window.setTimeout(next, 40);
      window.speechSynthesis.speak(u);
    };
    window.speechSynthesis.cancel();
    window.setTimeout(next, 80);
  });
}

function sentences(text: string) {
  const bits = text
    .split(/(?<=[.!?۔])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return bits.length ? bits : [text];
}

function rateValue() {
  const speed = loadLive().rate;
  if (speed === "slow") return 0.92;
  if (speed === "fast") return 1.05;
  return 1;
}

let clip: HTMLAudioElement | null = null;

let playGen = 0;

function playClip(src: string, rate: number) {
  return new Promise<boolean>((resolve) => {
    const audio = new Audio(src);
    clip = audio;
    audio.playbackRate = rate;
    let started = false;
    audio.onplaying = () => {
      started = true;
    };
    audio.onended = () => resolve(started);
    audio.onerror = () => resolve(false);
    void audio.play().then(
      () => {
        started = true;
      },
      () => resolve(false),
    );
  });
}

async function playClips(srcs: string[], rate: number) {
  const gen = ++playGen;
  let any = false;
  for (const src of srcs) {
    if (gen !== playGen) return any;
    const ok = await playClip(src, rate);
    if (!ok) return any;
    any = true;
  }
  return any;
}

function naturalEnglish(voices: SpeechSynthesisVoice[]) {
  const prefer =
    /aria|jenny|sonia|libby|natasha|samantha|serena|fiona|google uk english female|uk english female/i;
  return (
    voices.find((v) => /^en/i.test(v.lang) && prefer.test(v.name) && !MALE.test(blob(v))) ?? null
  );
}

function speakNow(text: string, lang: Lang) {
  const voices = window.speechSynthesis.getVoices();
  const male = loadLive().speaker === "male";
  const rate = rateValue();
  if (lang === "en") {
    const voice =
      naturalEnglish(voices) ??
      voices.find((v) => /^en/i.test(v.lang) && (male ? MALE.test(blob(v)) : !MALE.test(blob(v)))) ??
      pick(voices, /^en/i);
    return queue(sentences(text), voice, voice?.lang || "en-GB", rate, 1);
  }
  const native =
    lang === "sd"
      ? pick(voices, /sindhi|^sd-/i) ?? pick(voices, /urdu|^ur-/i)
      : pick(voices, /urdu|^ur-/i);
  if (!native) return Promise.resolve();
  return queue(sentences(text), native, native.lang || "ur-PK", rate, 1);
}

export function speakLocal(text: string, lang: Lang = "en") {
  if (typeof window === "undefined") return Promise.resolve(false);
  const clean = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_`]/g, "")
    .replace(/[“”]/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return Promise.resolve(false);
  const spoken = clean.slice(0, 420);

  const run = async () => {
    const spokenVoice = spoken
      .replace(/\.\.\./g, ", ")
      .replace(/\s*\n+\s*/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
    try {
      const clipAudio = await speakHinaAudio({ data: { text: spokenVoice, lang } });
      if (clipAudio.ok && clipAudio.clips.length) {
        const played = await playClips(clipAudio.clips, rateValue());
        if (played) return true;
      }
    } catch {
      /* fall through to the phone voice */
    }
    if (!window.speechSynthesis) return false;
    const say = () => speakNow(spoken, lang);
    if (window.speechSynthesis.getVoices().length > 0) {
      await say();
      return true;
    }
    await new Promise<void>((resolve) => {
      window.speechSynthesis.addEventListener("voiceschanged", () => resolve(), { once: true });
      window.setTimeout(resolve, 400);
    });
    await say();
    return true;
  };
  return run();
}

export function stopSpeaking() {
  playGen += 1;
  clip?.pause();
  clip = null;
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

type Rec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  abort: () => void;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }> }) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
};

export function canListen() {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

/** Hear one spoken sentence. Stays open until you call the returned stop. */
export function listenOnce(lang: Lang, onText: (text: string) => void, onDone: (error?: string) => void) {
  const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) {
    onDone("unsupported");
    return () => {};
  }
  const rec = new Ctor();
  rec.lang = lang === "en" ? "en-US" : "ur-PK";
  rec.interimResults = true;
  rec.continuous = false;
  let stopped = false;
  let sent = false;
  let latest = "";
  const send = (text: string) => {
    const said = text.trim();
    if (stopped || sent || !said) return;
    sent = true;
    onText(said);
  };
  rec.onresult = (ev) => {
    const list = ev.results;
    const last = list[list.length - 1];
    latest = last?.[0]?.transcript?.trim() ?? latest;
    if (last?.isFinal) send(latest);
  };
  rec.onerror = (ev) => {
    if (stopped || sent) return;
    if (ev.error === "no-speech" || ev.error === "aborted") {
      onDone();
      return;
    }
    stopped = true;
    onDone(ev.error);
  };
  rec.onend = () => {
    if (stopped || sent) return;
    if (latest) send(latest);
    else onDone();
  };
  const start = () => {
    try {
      rec.start();
    } catch {
      onDone("unsupported");
    }
  };
  if (navigator.mediaDevices?.getUserMedia) {
    void navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        if (!stopped) start();
      })
      .catch(() => onDone("denied"));
  } else {
    start();
  }
  return () => {
    stopped = true;
    try {
      rec.abort();
    } catch {
      /* already stopped */
    }
  };
}

export function warmVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
}
