import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as pickHinaStill, n as localHinaReply } from "./gallery-2fRNAKVa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-HX6mC4Ca.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var VIDEO_DURATION = 6;
var sendHinaMessage_createServerFn_handler = createServerRpc({
	id: "8226333074bf7fc2932bbff9d05772ce6dfd87c83b22a6f4d981907edbf0b0f9",
	name: "sendHinaMessage",
	filename: "src/lib/hina/api.ts"
}, (opts) => sendHinaMessage.__executeServer(opts));
var sendHinaMessage = createServerFn({ method: "POST" }).validator((input) => input).handler(sendHinaMessage_createServerFn_handler, async ({ data }) => {
	const lastUser = [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";
	return {
		ok: true,
		text: localHinaReply(lastUser, data.lang),
		free: true
	};
});
async function kenBurnsClip(file) {
	const { spawn } = await import("node:child_process");
	const { mkdtemp, readFile, rm } = await import("node:fs/promises");
	const { join } = await import("node:path");
	const { tmpdir } = await import("node:os");
	const dir = await mkdtemp(join(tmpdir(), "hina-vid-"));
	const src = join(process.cwd(), "public", "gallery", file);
	const out = join(dir, "clip.mp4");
	const vf = "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.0014,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=144:s=720x1280:fps=24";
	await new Promise((resolve, reject) => {
		const child = spawn("ffmpeg", [
			"-y",
			"-loop",
			"1",
			"-i",
			src,
			"-vf",
			vf,
			"-t",
			String(VIDEO_DURATION),
			"-an",
			"-c:v",
			"libx264",
			"-pix_fmt",
			"yuv420p",
			"-movflags",
			"+faststart",
			out
		], { stdio: "pipe" });
		child.on("error", reject);
		child.on("close", (code) => code === 0 ? resolve() : reject(/* @__PURE__ */ new Error(`ffmpeg ${code}`)));
	});
	const buf = await readFile(out);
	await rm(dir, {
		recursive: true,
		force: true
	});
	return `data:video/mp4;base64,${buf.toString("base64")}`;
}
var generateHinaImage_createServerFn_handler = createServerRpc({
	id: "bfbb2594cb213124cac98a374962e3ed0662311449468295192009c47b9d62fe",
	name: "generateHinaImage",
	filename: "src/lib/hina/api.ts"
}, (opts) => generateHinaImage.__executeServer(opts));
var generateHinaImage = createServerFn({ method: "POST" }).validator((input) => input).handler(generateHinaImage_createServerFn_handler, async ({ data }) => {
	return {
		ok: true,
		url: pickHinaStill(data.prompt).publicUrl,
		prompt: data.prompt.trim()
	};
});
var generateHinaVideo_createServerFn_handler = createServerRpc({
	id: "f25f393e5b15e4acfab812287ba3c9be740829ccba3c596a4a0b8309a694948d",
	name: "generateHinaVideo",
	filename: "src/lib/hina/api.ts"
}, (opts) => generateHinaVideo.__executeServer(opts));
var generateHinaVideo = createServerFn({ method: "POST" }).validator((input) => input).handler(generateHinaVideo_createServerFn_handler, async ({ data }) => {
	const prompt = data.prompt.trim().slice(0, 500);
	if (!prompt) return {
		ok: false,
		error: "empty"
	};
	const still = pickHinaStill(prompt);
	try {
		return {
			ok: true,
			url: await kenBurnsClip(still.file),
			prompt,
			source: "local"
		};
	} catch {
		return {
			ok: false,
			error: "fail"
		};
	}
});
//#endregion
export { generateHinaImage_createServerFn_handler, generateHinaVideo_createServerFn_handler, sendHinaMessage_createServerFn_handler };
