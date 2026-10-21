import { createServerFn } from "@tanstack/react-start";
import { localHinaReply } from "./local";
import { pickHinaStill } from "./gallery";
import type { Lang } from "./i18n";

const VIDEO_DURATION = 6;

export const sendHinaMessage = createServerFn({ method: "POST" })
  .validator((input: { lang: Lang; messages: { role: "user" | "assistant"; content: string }[] }) => input)
  .handler(async ({ data }) => {
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const { geminiReply } = await import("./gemini.server");
    const text = await geminiReply(data.lang, data.messages);
    return { ok: true as const, text: text || localHinaReply(lastUser, data.lang), free: true as const };
  });

async function kenBurnsClip(file: string) {
  const { spawn } = await import("node:child_process");
  const { mkdtemp, readFile, rm } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const dir = await mkdtemp(join(tmpdir(), "hina-vid-"));
  const src = join(process.cwd(), "public", "gallery", file);
  const out = join(dir, "clip.mp4");
  const vf =
    "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.0014,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=144:s=720x1280:fps=24";
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      "ffmpeg",
      ["-y", "-loop", "1", "-i", src, "-vf", vf, "-t", String(VIDEO_DURATION), "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
      { stdio: "pipe" },
    );
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`))));
  });
  const buf = await readFile(out);
  await rm(dir, { recursive: true, force: true });
  return `data:video/mp4;base64,${buf.toString("base64")}`;
}

export const generateHinaImage = createServerFn({ method: "POST" })
  .validator((input: { prompt: string }) => input)
  .handler(async ({ data }) => {
    const still = pickHinaStill(data.prompt);
    return { ok: true as const, url: still.publicUrl, prompt: data.prompt.trim() };
  });

export const generateHinaVideo = createServerFn({ method: "POST" })
  .validator((input: { prompt: string }) => input)
  .handler(async ({ data }) => {
    const prompt = data.prompt.trim().slice(0, 500);
    if (!prompt) return { ok: false as const, error: "empty" };
    const still = pickHinaStill(prompt);
    try {
      const url = await kenBurnsClip(still.file);
      return { ok: true as const, url, prompt, source: "local" as const };
    } catch {
      return { ok: false as const, error: "fail" };
    }
  });

const SINDHI_WORDS: [string, string][] = [
  ["ڳالهايان", "گالھایاں"],
  ["ڳالهائي", "گالھائی"],
  ["ڳالهايو", "گالھایو"],
  ["ڳالهائڻ", "گالھائڻ"],
  ["ڳالهه", "گالھ"],
  ["آهيان", "آہیاں"],
  ["آهيون", "آہیوں"],
  ["آهيو", "آہیو"],
  ["آهن", "آہن"],
  ["آهي", "آہے"],
  ["ڪريان", "کریاں"],
  ["ڪريون", "کریوں"],
  ["ڪريو", "کریو"],
  ["ڪري", "کرے"],
  ["هناءَ", "ہنا"],
  ["هناء", "ہنا"],
  ["سنڌي", "سندھی"],
  ["سنڌ", "سندھ"],
  ["پاڪستان", "پاکستان"],
  ["ڪراچي", "کراچی"],
  ["حيدرآباد", "حیدرآباد"],
  ["ٿيون", "تھیوں"],
  ["ٿي", "تھی"],
  ["ٿو", "تھو"],
  ["ٿا", "تھا"],
  ["پڇو", "پچھو"],
  ["ڪجهه", "کچھ"],
  ["سگهو", "سگھو"],
  ["سگهي", "سگھے"],
  ["ناهين", "ناہیں"],
  ["ناهي", "ناہے"],
  ["منهنجو", "منہنجو"],
  ["منهنجي", "منہنجی"],
  ["توهان", "توہاں"],
  ["اوهان", "اوہاں"],
  ["ڏينهن", "دینھن"],
  ["تصويرون", "تصویرون"],
  ["تصوير", "تصویر"],
  ["وڊيو", "ویڈیو"],
  ["انٽرنيٽ", "انٹرنیٹ"],
  ["ڪمپيوٽر", "کمپیوٹر"],
  ["خوشي", "خوشی"],
  ["رهي", "رہی"],
  ["رهيا", "رہیا"],
  ["۾", "میں"],
  ["۽", "این"],
];

const SINDHI_LETTERS: [string, string][] = [
  ["ٻ", "ب"],
  ["ڀ", "بھ"],
  ["ٺ", "ٹھ"],
  ["ٿ", "تھ"],
  ["ٽ", "ٹ"],
  ["ڦ", "پھ"],
  ["ڄ", "ج"],
  ["ڃ", "ن"],
  ["ڇ", "چھ"],
  ["ڊ", "ڈ"],
  ["ڌ", "دھ"],
  ["ڏ", "د"],
  ["ڙ", "ڑ"],
  ["ڪ", "ک"],
  ["ڳ", "گ"],
  ["ڱ", "نگ"],
  ["ڻ", "ن"],
  ["ھ", "ہ"],
];

/** Sindhi written so an Urdu speaker says the Sindhi words, not skipped letters. */
function forSindhiVoice(text: string) {
  let out = text;
  for (const [from, to] of SINDHI_WORDS) out = out.split(from).join(to);
  for (const [from, to] of SINDHI_LETTERS) out = out.split(from).join(to);
  return out.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/\s+/g, " ").trim();
}

function forUrduVoice(text: string) {
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/\s+/g, " ").trim();
}

function speechChunks(text: string, lang: Lang) {
  const limit = lang === "sd" ? 90 : 200;
  const max = lang === "sd" ? 4 : 2;
  const clean = text.replace(/\s+/g, " ").trim().slice(0, 500);
  const sentences = clean.split(/(?<=[۔.!?،,])\s*/).map((s) => s.trim()).filter(Boolean);
  const out: string[] = [];
  let buf = "";
  for (const sentence of sentences.length ? sentences : [clean]) {
    const next = (buf + " " + sentence).trim();
    if (next.length <= limit) {
      buf = next;
      continue;
    }
    if (buf) out.push(buf);
    buf = sentence.slice(0, limit);
  }
  if (buf) out.push(buf);
  return out.slice(0, max);
}

async function fetchVoiceMp3(piece: string, tl: string) {
  const q = encodeURIComponent(piece);
  const urls = [
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${tl}&q=${q}`,
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${tl}&q=${q}`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
      });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 200 || buf[0] === 0x3c) continue;
      return buf;
    } catch {
      /* try the next host */
    }
  }
  return null;
}

export const speakHinaAudio = createServerFn({ method: "POST" })
  .validator((input: { text: string; lang: Lang }) => input)
  .handler(async ({ data }) => {
    const { geminiSpeech } = await import("./gemini.server");
    const clip = await geminiSpeech(data.text, data.lang);
    if (clip) return { ok: true as const, clips: [clip] };
    const spoken = data.lang === "sd" ? forSindhiVoice(data.text) : data.lang === "ur" ? forUrduVoice(data.text) : data.text;
    const tl = data.lang === "en" ? "en-GB" : "ur";
    const parts: Buffer[] = [];
    for (const piece of speechChunks(spoken, data.lang)) {
      const buf = await fetchVoiceMp3(piece, tl);
      if (!buf) return { ok: false as const };
      parts.push(buf);
    }
    if (!parts.length) return { ok: false as const };
    return {
      ok: true as const,
      clips: parts.map((buf) => `data:audio/mpeg;base64,${buf.toString("base64")}`),
    };
  });

const WIKI_PACK: { keys: string; en: string; ur: string; sd: string }[] = [
  { keys: "pakistan, پاکستان, پاڪستان", en: "Pakistan", ur: "پاکستان", sd: "پاڪستان" },
  { keys: "sindh, سندھ, سنڌ", en: "Sindh", ur: "سندھ", sd: "سنڌ" },
  { keys: "karachi, کراچی, ڪراچي", en: "Karachi", ur: "کراچی", sd: "ڪراچي" },
  { keys: "indus, سندھو, سنڌو", en: "Indus_River", ur: "دریائے_سندھ", sd: "سنڌو_درياءُ" },
  { keys: "islamabad, اسلام آباد", en: "Islamabad", ur: "اسلام_آباد", sd: "اسلام_آباد" },
  { keys: "lahore, لاہور, لاهور", en: "Lahore", ur: "لاہور", sd: "لاهور" },
  { keys: "mohenjo, موئن, موهن", en: "Mohenjo-daro", ur: "موئن_جو_دڑو", sd: "موهن_جو_دڙو" },
  { keys: "latif, لطیف, لطيف", en: "Shah_Abdul_Latif_Bhittai", ur: "شاہ_عبداللطیف_بھٹائی", sd: "شاهه_عبداللطيف_ڀٽائي" },
  { keys: "cricket, کرکٹ, ڪرڪيٽ", en: "Cricket", ur: "کرکٹ", sd: "ڪرڪيٽ" },
  { keys: "urdu, اردو", en: "Urdu", ur: "اردو", sd: "اردو_ٻولي" },
  { keys: "sindhi, سنڌي, سندھی", en: "Sindhi_language", ur: "سندھی_زبان", sd: "سنڌي_ٻولي" },
  { keys: "heart, دل, قلب", en: "Heart", ur: "قلب", sd: "دل" },
  { keys: "hyderabad, حیدرآباد, حيدرآباد", en: "Hyderabad,_Sindh", ur: "حیدرآباد،_سندھ", sd: "حيدرآباد" },
  { keys: "thatta, ٹھٹہ, ٺٽو", en: "Thatta", ur: "ٹھٹہ", sd: "ٺٽو" },
  { keys: "sukkur, سکھر, سکر", en: "Sukkur", ur: "سکھر", sd: "سکر" },
  { keys: "moon, چاند, چنڊ", en: "Moon", ur: "چاند", sd: "چنڊ" },
  { keys: "sun, سورج, سج", en: "Sun", ur: "سورج", sd: "سج" },
  { keys: "water, پانی, پاڻي", en: "Water", ur: "پانی", sd: "پاڻي" },
  { keys: "school, سکول, اسڪول", en: "School", ur: "مدرسہ", sd: "اسڪول" },
  { keys: "computer, کمپیوٹر, ڪمپيوٽر", en: "Computer", ur: "کمپیوٹر", sd: "ڪمپيوٽر" },
  { keys: "internet, انٹرنیٹ, انٽرنيٽ", en: "Internet", ur: "انٹرنیٹ", sd: "انٽرنيٽ" },
  { keys: "quran, قرآن", en: "Quran", ur: "قرآن", sd: "قرآن" },
  { keys: "ramadan, رمضان", en: "Ramadan", ur: "رمضان", sd: "رمضان" },
];

export const WIKI_TOPIC_COUNT = WIKI_PACK.length;

async function wikiExtract(host: string, title: string) {
  const url = `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "HinaBot/1.0 (knowledge; educational)", Accept: "application/json" },
    });
    if (!res.ok) return "";
    const data = (await res.json()) as { extract?: string };
    return String(data.extract ?? "").replace(/\s+/g, " ").trim().slice(0, 420);
  } catch {
    return "";
  }
}

export const fetchWikiFact = createServerFn({ method: "POST" })
  .validator((input: { index: number }) => input)
  .handler(async ({ data }) => {
    const topic = WIKI_PACK[data.index];
    if (!topic) return { ok: false as const, total: WIKI_PACK.length };
    const [en, ur, sd] = await Promise.all([
      wikiExtract("en.wikipedia.org", topic.en),
      wikiExtract("ur.wikipedia.org", topic.ur),
      wikiExtract("sd.wikipedia.org", topic.sd),
    ]);
    if (!en && !ur && !sd) return { ok: false as const, total: WIKI_PACK.length };
    return {
      ok: true as const,
      total: WIKI_PACK.length,
      fact: {
        id: `wiki-${topic.en}`,
        keys: topic.keys,
        en: en || ur || sd,
        ur: ur || en,
        sd: sd || ur || en,
      },
    };
  });
