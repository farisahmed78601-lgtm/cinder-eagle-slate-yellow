import { readFileSync } from "node:fs";
import { isFounderQuestion, languageInstruction, localHinaReply, looksLikeFounderLeak } from "./local";
import type { Lang } from "./i18n";

function geminiKey() {
  const fromEnv = process.env.GEMINI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  for (const file of [".env", new URL("../../../.env", import.meta.url)]) {
    try {
      const raw = readFileSync(file, "utf8");
      const line = raw.split("\n").find((l) => l.startsWith("GEMINI_API_KEY="));
      const key = line?.slice("GEMINI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
      if (key) return key;
    } catch {
      /* try the next place */
    }
  }
  return "";
}

async function gemini(model: string, body: unknown) {
  const key = geminiKey();
  if (!key) return null;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(18000),
    },
  );
  if (!res.ok) return null;
  return (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string; thought?: boolean; inlineData?: { mimeType?: string; data?: string } }[] } }[];
  };
}

export async function geminiReply(
  lang: Lang,
  messages: { role: "user" | "assistant"; content: string }[],
) {
  const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  if (!last.trim()) return localHinaReply(last, lang);
  if (isFounderQuestion(last)) return localHinaReply(last, lang);
  const data = await gemini("gemini-3.8-flash", {
    systemInstruction: {
      parts: [
        {
          text: `You are Hina, a warm, happy, knowledgeable 18-year-old woman. Answer the user's actual question fully, with real facts, in complete sentences. ${languageInstruction(lang)} Write every word. Do not stop halfway. Do not use markdown.`,
        },
      ],
    },
    contents: messages.slice(-8).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.slice(0, 2000) }],
    })),
    generationConfig: { maxOutputTokens: 800, temperature: 0.5, thinkingConfig: { thinkingBudget: 0 } },
  });
  const text = (data?.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => p.text && !p.thought)
    .map((p) => p.text)
    .join("")
    .trim();
  if (!text) return localHinaReply(last, lang);
  if (looksLikeFounderLeak(text)) {
    const kept = text
      .split(/(?<=[.!?۔])\s+/)
      .filter((s) => !looksLikeFounderLeak(s))
      .join(" ")
      .trim();
    return kept || localHinaReply(last, lang);
  }
  return text;
}

export async function geminiSpeech(text: string, lang: Lang) {
  const spoken = text.replace(/\s+/g, " ").trim();
  const cut = spoken.search(/(?<=[.!?۔])\s/);
  const first = (cut > 20 && cut < 220 ? spoken.slice(0, cut + 1) : spoken).slice(0, 220);
  if (!spoken) return null;
  const style =
    lang === "sd"
      ? "Warm natural young Sindhi woman. Speak Sindhi clearly and say every word."
      : lang === "ur"
        ? "Warm natural young Urdu woman. Speak Urdu clearly and say every word."
        : "Warm natural young woman. Speak clearly and say every word.";
  const data = await gemini("gemini-3.8-flash-tts", {
    contents: [
      {
        role: "user",
        parts: [{ text: first, speech_metadata: { style } }],
      },
    ],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { voice: "Leda" } },
    },
  });
  const audio = (data?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data)?.inlineData;
  if (!audio?.data) return null;
  const mime = audio.mimeType?.startsWith("audio/") ? audio.mimeType : "audio/wav";
  return `data:${mime};base64,${audio.data}`;
}
