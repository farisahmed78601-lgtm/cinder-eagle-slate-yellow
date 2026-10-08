//#region node_modules/.nitro/vite/services/ssr/assets/live-CJbiZNWC.js
var LIVE_KEY = "hina-live-config-v3";
var LIVE_CHANNEL = "hina-live";
var DEFAULT_LIVE = {
	greeting: {
		en: "Hi, I’m Hina",
		ur: "السلام علیکم، میں ہنا ہوں",
		sd: "سلام، مان هناءَ آهيان"
	},
	tagline: {
		en: "Ask anything — writing, plans, code, pictures, and clips.",
		ur: "کچھ بھی پوچھیں — لکھائی، منصوبہ، کوڈ، تصاویر اور کلپس۔",
		sd: "ڪجهه به پڇو — لکڻ، رٿا، ڪوڊ، تصويرون ۽ ڪلپس."
	},
	accent: "#d4a394",
	voiceOn: true,
	photos: true,
	video: true,
	facts: []
};
function loadLive() {
	if (typeof localStorage === "undefined") return DEFAULT_LIVE;
	try {
		const raw = localStorage.getItem("hina-live-config-v3") ?? localStorage.getItem("hina-live-config-v2");
		if (!raw) return DEFAULT_LIVE;
		const parsed = JSON.parse(raw);
		return {
			...DEFAULT_LIVE,
			...parsed,
			greeting: {
				...DEFAULT_LIVE.greeting,
				...parsed.greeting
			},
			tagline: {
				...DEFAULT_LIVE.tagline,
				...parsed.tagline
			},
			photos: parsed.photos !== false,
			video: parsed.video !== false,
			facts: Array.isArray(parsed.facts) ? parsed.facts : []
		};
	} catch {
		return DEFAULT_LIVE;
	}
}
function applyLive(cfg) {
	if (typeof document === "undefined") return;
	document.documentElement.style.setProperty("--color-accent", cfg.accent);
}
function saveLive(cfg) {
	localStorage.setItem(LIVE_KEY, JSON.stringify(cfg));
	applyLive(cfg);
	try {
		new BroadcastChannel(LIVE_CHANNEL).postMessage(cfg);
	} catch {}
	window.dispatchEvent(new Event("hina-live"));
}
function subscribeLive(cb) {
	const onStorage = (e) => {
		if (e.key === "hina-live-config-v3" || e.key === "hina-live-config-v2") cb(loadLive());
	};
	const onCustom = () => cb(loadLive());
	window.addEventListener("storage", onStorage);
	window.addEventListener("hina-live", onCustom);
	let ch = null;
	try {
		ch = new BroadcastChannel(LIVE_CHANNEL);
		ch.onmessage = (e) => cb(e.data);
	} catch {
		ch = null;
	}
	return () => {
		window.removeEventListener("storage", onStorage);
		window.removeEventListener("hina-live", onCustom);
		ch?.close();
	};
}
//#endregion
export { subscribeLive as a, saveLive as i, applyLive as n, loadLive as r, DEFAULT_LIVE as t };
