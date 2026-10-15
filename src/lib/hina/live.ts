import type { Lang } from "./i18n";

export type HinaFact = {
  id: string;
  keys: string;
  en: string;
  ur: string;
  sd: string;
};

export type LiveConfig = {
  greeting: Record<Lang, string>;
  tagline: Record<Lang, string>;
  accent: string;
  voiceOn: boolean;
  photos: boolean;
  video: boolean;
  speaker: "clear" | "female" | "male";
  rate: "slow" | "normal" | "fast";
  facts: HinaFact[];
};

export const LIVE_KEY = "hina-live-config-v3";
export const LIVE_CHANNEL = "hina-live";

export const DEFAULT_LIVE: LiveConfig = {
  greeting: {
    en: "Hi, I’m Hina",
    ur: "السلام علیکم، میں ہنا ہوں",
    sd: "سلام، مان هناءَ آهيان",
  },
  tagline: {
    en: "Ask anything — writing, plans, code, pictures, and clips.",
    ur: "کچھ بھی پوچھیں — لکھائی، منصوبہ، کوڈ، تصاویر اور کلپس۔",
    sd: "ڪجهه به پڇو — لکڻ، رٿا، ڪوڊ، تصويرون ۽ ڪلپس.",
  },
  accent: "#d4a394",
  voiceOn: true,
  photos: true,
  video: true,
  speaker: "clear",
  rate: "normal",
  facts: [],
};

export function loadLive(): LiveConfig {
  if (typeof localStorage === "undefined") return DEFAULT_LIVE;
  try {
    const raw = localStorage.getItem(LIVE_KEY) ?? localStorage.getItem("hina-live-config-v2");
    if (!raw) return DEFAULT_LIVE;
    const parsed = JSON.parse(raw) as Partial<LiveConfig>;
    return {
      ...DEFAULT_LIVE,
      ...parsed,
      greeting: { ...DEFAULT_LIVE.greeting, ...parsed.greeting },
      tagline: { ...DEFAULT_LIVE.tagline, ...parsed.tagline },
      photos: parsed.photos !== false,
      video: parsed.video !== false,
      speaker: parsed.speaker === "male" || parsed.speaker === "female" || parsed.speaker === "clear" ? parsed.speaker : "clear",
      rate: parsed.rate === "slow" || parsed.rate === "fast" ? parsed.rate : "normal",
      facts: Array.isArray(parsed.facts) ? parsed.facts : [],
    };
  } catch {
    return DEFAULT_LIVE;
  }
}

export function applyLive(cfg: LiveConfig) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--color-accent", cfg.accent);
}

export function saveLive(cfg: LiveConfig) {
  localStorage.setItem(LIVE_KEY, JSON.stringify(cfg));
  applyLive(cfg);
  try {
    new BroadcastChannel(LIVE_CHANNEL).postMessage(cfg);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("hina-live"));
}

export function subscribeLive(cb: (cfg: LiveConfig) => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === LIVE_KEY || e.key === "hina-live-config-v2") cb(loadLive());
  };
  const onCustom = () => cb(loadLive());
  window.addEventListener("storage", onStorage);
  window.addEventListener("hina-live", onCustom);
  let ch: BroadcastChannel | null = null;
  try {
    ch = new BroadcastChannel(LIVE_CHANNEL);
    ch.onmessage = (e) => cb(e.data as LiveConfig);
  } catch {
    ch = null;
  }
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("hina-live", onCustom);
    ch?.close();
  };
}
