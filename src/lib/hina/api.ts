import { createServerFn } from "@tanstack/react-start";
import { localHinaReply } from "./local";
import { pickHinaStill } from "./gallery";
import type { Lang } from "./i18n";

const VIDEO_DURATION = 6;

export const sendHinaMessage = createServerFn({ method: "POST" })
  .validator((input: { lang: Lang; messages: { role: "user" | "assistant"; content: string }[] }) => input)
  .handler(async ({ data }) => {
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    return { ok: true as const, text: localHinaReply(lastUser, data.lang), free: true as const };
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
