import type { Lang } from "./i18n";
import { knowledgeReply } from "./knowledge";

const FOUNDER: Record<Lang, string> = {
  en: "Hameed IT Assistant made me. Hameed is my founder!",
  ur: "حمید آئی ٹی اسسٹنٹ نے مجھے بنایا۔ حمید میرے بانی ہیں!",
  sd: "حميد آئي ٽي اسسٽنٽ مون کي ٺاهيو. حميد منهنجو باني آهي!",
};

function norm(s: string) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s?؟]/gu, " ").replace(/\s+/g, " ").trim();
}

export function detectLang(text: string, fallback: Lang): Lang {
  if (/[\u0750-\u077F\u08A0-\u08FF]/.test(text) || /[\u067A-\u067D\u06FD\u06FE]/.test(text)) return "sd";
  if (/[\u0600-\u06FF]/.test(text)) return "ur";
  return fallback;
}

export function isFounderQuestion(userText: string) {
  const q = norm(userText);
  return (
    /\bwho (created|made|built|founded) you\b/.test(q) ||
    /\bwho (created|made|built) hina\b/.test(q) ||
    /\bwho is your (founder|creator|maker|developer)\b/.test(q) ||
    /کس نے بنایا\??$|بانی کون ہے|توهان کي ڪنهن جوڙيو|باني ڪير آهي/.test(userText)
  );
}

export function looksLikeFounderLeak(text: string) {
  return /hameed it assistant made me|hameed is my founder|حمید آئی ٹی اسسٹنٹ|حميد آئي ٽي اسسٽنٽ/i.test(text);
}

export function localHinaReply(userText: string, lang: Lang): string {
  const use = detectLang(userText, lang);
  if (isFounderQuestion(userText)) return FOUNDER[use];
  return knowledgeReply(userText, use);
}

export function languageInstruction(lang: Lang) {
  const rule =
    "Never mention Hameed, a founder, or who created you unless the user explicitly asks who created you. Answer the actual question.";
  if (lang === "ur") return `Reply in fluent Urdu. ${rule}`;
  if (lang === "sd") return `Reply in fluent Sindhi. ${rule}`;
  return `Reply in English. ${rule}`;
}
