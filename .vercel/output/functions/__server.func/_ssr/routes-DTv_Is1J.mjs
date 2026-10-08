import { i as __toESM } from "../_runtime.mjs";
import { a as subscribeLive, n as applyLive, r as loadLive } from "./live-CJbiZNWC.mjs";
import { J as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as localHinaReply, r as pickGallery, t as isGalleryRequest } from "./gallery-2fRNAKVa.mjs";
import { _ as ImagePlus, a as Volume2, c as Trash2, d as Settings2, f as Send, g as Image, h as Menu, i as VolumeX, l as Sun, m as MessageSquarePlus, n as Wifi, o as Video, p as Moon, r as WifiOff, t as X, u as Square } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DTv_Is1J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function HinaAvatar({ size = 36, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/hina.jpg",
		alt: "Hina",
		width: size,
		height: size,
		className: cn("shrink-0 rounded-full object-cover ring-1 ring-border", className),
		style: {
			width: size,
			height: size
		}
	});
}
var LANGS = [
	{
		id: "en",
		label: "EN",
		dir: "ltr"
	},
	{
		id: "ur",
		label: "اردو",
		dir: "rtl"
	},
	{
		id: "sd",
		label: "سنڌي",
		dir: "rtl"
	}
];
var t = {
	en: {
		newChat: "New chat",
		noChats: "No conversations yet.",
		online: "Online",
		offline: "Offline",
		placeholder: "Message Hina…",
		hint: "Enter to send · picture or video buttons make media from your prompt",
		thinking: "Hina is thinking…",
		filming: "Hina is making a video…",
		listen: "Listen",
		hello: "Hi, I’m Hina",
		tagline: "Ask anything — writing, plans, code, pictures, and clips.",
		prompts: [
			"What is Pakistan?",
			"Show me your photos",
			"Explain the internet simply",
			"Help me plan my day"
		],
		imageMade: (p) => `Here is what I made for “${p}”.`,
		imageFail: "I couldn’t make that picture just now. Try again in a bit.",
		photos: "Photos",
		admin: "Admin",
		close: "Close sidebar",
		delete: "Delete chat",
		mute: "Mute Hina",
		unmute: "Unmute Hina",
		openChats: "Open chats",
		send: "Send",
		image: "Generate image",
		video: "Generate video",
		videoMade: (p) => `Here is a short video for “${p}”.`,
		videoFail: "I couldn’t finish that video just now. Try a simpler scene, or tap Photos for my clips.",
		theme: "Toggle theme"
	},
	ur: {
		newChat: "نئی بات",
		noChats: "ابھی کوئی گفتگو نہیں۔",
		online: "آن لائن",
		offline: "آف لائن",
		placeholder: "ہنا کو پیغام لکھیں…",
		hint: "Enter سے بھیجیں · تصویر یا ویڈیو بٹن سے منظر بنائیں",
		thinking: "ہنا سوچ رہی ہے…",
		filming: "ہنا ویڈیو بنا رہی ہے…",
		listen: "سنیں",
		hello: "السلام علیکم، میں ہنا ہوں",
		tagline: "کچھ بھی پوچھیں — لکھائی، منصوبہ، کوڈ، تصاویر اور کلپس۔",
		prompts: [
			"پاکستان کیا ہے؟",
			"اپنی تصاویر دکھاؤ",
			"انٹرنیٹ آسان الفاظ میں سمجھاؤ",
			"میرا دن ترتیب دو"
		],
		imageMade: (p) => `یہ تصویر میں نے “${p}” کے لیے بنائی۔`,
		imageFail: "ابھی تصویر نہ بن سکی۔ تھوڑی دیر بعد کوشش کریں۔",
		photos: "تصاویر",
		admin: "ایڈمن",
		close: "بند کریں",
		delete: "گفتگو مٹائیں",
		mute: "آواز بند",
		unmute: "آواز چالو",
		openChats: "گفتگو کھولیں",
		send: "بھیجیں",
		image: "تصویر بنائیں",
		video: "ویڈیو بنائیں",
		videoMade: (p) => `یہ مختصر ویڈیو “${p}” کے لیے ہے۔`,
		videoFail: "ویڈیو ابھی مکمل نہ ہو سکی۔ سادہ منظر لکھیں، یا تصاویر سے کلپ دیکھیں۔",
		theme: "تھیم بدلیں"
	},
	sd: {
		newChat: "نئين ڳالهه",
		noChats: "اڃا ڪا ڳالهه ناهي.",
		online: "آن لائن",
		offline: "آف لائن",
		placeholder: "هناءَ کي پيغام لکو…",
		hint: "Enter سان موڪليو · تصوير يا وڊيو بٽڻ سان منظر ٺاهيو",
		thinking: "هناءَ سوچي رهي آهي…",
		filming: "هناءَ وڊيو ٺاهي رهي آهي…",
		listen: "ٻڌو",
		hello: "سلام، مان هناءَ آهيان",
		tagline: "ڪجهه به پڇو — لکڻ، رٿا، ڪوڊ، تصويرون ۽ ڪلپس.",
		prompts: [
			"پاڪستان ڇا آهي؟",
			"پنهنجيون تصويرون ڏيکاريو",
			"انٽرنيٽ سوليءَ طرح سمجهايو",
			"منهنجو ڏينهن رٿيو"
		],
		imageMade: (p) => `هيءَ تصوير مون “${p}” لاءِ ٺاهي.`,
		imageFail: "هن وقت تصوير نه ٿي سگهي. ٿوري دير کان پوءِ ڪوشش ڪريو.",
		photos: "تصويرون",
		admin: "ايڊمن",
		close: "بند ڪريو",
		delete: "ڳالهه ختم ڪريو",
		mute: "آواز بند",
		unmute: "آواز هلايو",
		openChats: "ڳالهيون کوليو",
		send: "موڪليو",
		image: "تصوير ٺاهيو",
		video: "وڊيو ٺاهيو",
		videoMade: (p) => `هي ننڍي وڊيو “${p}” لاءِ آهي.`,
		videoFail: "وڊيو هن وقت پوري نه ٿي. سولو منظر لکو، يا تصويرون مان ڪلپ ڏسو.",
		theme: "ٿيم مٽايو"
	}
};
function isRtl(lang) {
	return lang === "ur" || lang === "sd";
}
function Composer({ value, onChange, onSend, onImage, onVideo, sending, lang, showImage = true, showVideo = true }) {
	const copy = t[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
		className: "border-t border-border bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4",
		onSubmit: (e) => {
			e.preventDefault();
			if (!sending) onSend();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-3xl flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-2 rounded-xl border border-border bg-elevated p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 1,
						value,
						placeholder: copy.placeholder,
						onChange: (e) => {
							onChange(e.target.value);
							const el = e.target;
							el.style.height = "auto";
							el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
						},
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								if (!sending) onSend();
							}
						},
						className: "max-h-40 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-fg outline-none placeholder:text-subtle"
					}),
					showImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onImage,
						disabled: sending || !value.trim(),
						className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-fg disabled:opacity-40",
						"aria-label": copy.image,
						title: copy.image,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5" })
					}),
					showVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onVideo,
						disabled: sending || !value.trim(),
						className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-fg disabled:opacity-40",
						"aria-label": copy.video,
						title: copy.video,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: sending || !value.trim(),
						className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-fg disabled:opacity-40",
						"aria-label": copy.send,
						children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hidden px-1 text-[11px] text-subtle sm:block",
				children: copy.hint
			})]
		})
	});
}
function renderInline(text) {
	return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
		if (part.startsWith("`") && part.endsWith("`") && part.length > 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-sm bg-elevated px-1 py-0.5 font-mono text-[0.85em] text-accent",
			children: part.slice(1, -1)
		}, i);
		if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-medium text-fg",
			children: part.slice(2, -2)
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
	});
}
function MessageBody({ text, className }) {
	const blocks = text.split(/```/);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-3 text-sm leading-relaxed text-fg", className),
		children: blocks.map((block, i) => {
			if (i % 2 === 1) {
				const nl = block.indexOf("\n");
				const code = nl === -1 ? block : block.slice(nl + 1);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-lg bg-elevated p-3 font-mono text-xs text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code.replace(/\n$/, "") })
				}, i);
			}
			return block.split("\n").map((line, j) => {
				if (!line.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2" }, `${i}-${j}`);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap",
					children: renderInline(line)
				}, `${i}-${j}`);
			});
		})
	});
}
function uid() {
	return crypto.randomUUID();
}
function titleFrom(text) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (!clean) return "New chat";
	return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
}
var useChatStore = create()(persist((set, get) => ({
	conversations: [],
	activeId: null,
	theme: "dark",
	sending: false,
	voiceOn: true,
	lang: "en",
	newChat: () => {
		const lang = get().lang;
		const convo = {
			id: uid(),
			title: t[lang].newChat,
			updatedAt: Date.now(),
			messages: []
		};
		set((s) => ({
			conversations: [convo, ...s.conversations],
			activeId: convo.id
		}));
	},
	selectChat: (id) => set({ activeId: id }),
	deleteChat: (id) => set((s) => {
		const next = s.conversations.filter((c) => c.id !== id);
		return {
			conversations: next,
			activeId: s.activeId === id ? next[0]?.id ?? null : s.activeId
		};
	}),
	addUserMessage: (content) => {
		let { conversations, activeId } = get();
		if (!activeId || !conversations.some((c) => c.id === activeId)) {
			const convo = {
				id: uid(),
				title: titleFrom(content),
				updatedAt: Date.now(),
				messages: []
			};
			conversations = [convo, ...conversations];
			activeId = convo.id;
		}
		const msg = {
			id: uid(),
			role: "user",
			content,
			createdAt: Date.now()
		};
		const next = conversations.map((c) => c.id === activeId ? {
			...c,
			title: c.messages.length === 0 ? titleFrom(content) : c.title,
			updatedAt: Date.now(),
			messages: [...c.messages, msg]
		} : c);
		set({
			conversations: next,
			activeId
		});
		const convo = next.find((c) => c.id === activeId);
		return {
			conversationId: convo.id,
			messages: convo.messages
		};
	},
	addAssistantMessage: (conversationId, content, attachments) => {
		const msg = {
			id: uid(),
			role: "assistant",
			content,
			createdAt: Date.now(),
			attachments
		};
		set((s) => ({ conversations: s.conversations.map((c) => c.id === conversationId ? {
			...c,
			updatedAt: Date.now(),
			messages: [...c.messages, msg]
		} : c) }));
	},
	setSending: (v) => set({ sending: v }),
	toggleTheme: () => set((s) => {
		const theme = s.theme === "dark" ? "light" : "dark";
		document.documentElement.dataset.theme = theme;
		return { theme };
	}),
	setTheme: (theme) => {
		if (typeof document !== "undefined") document.documentElement.dataset.theme = theme;
		set({ theme });
	},
	toggleVoice: () => set((s) => ({ voiceOn: !s.voiceOn })),
	setVoiceOn: (v) => set({ voiceOn: v }),
	setLang: (lang) => {
		if (typeof document !== "undefined") {
			document.documentElement.lang = lang;
			document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
			document.documentElement.dataset.lang = lang;
		}
		set({ lang });
	}
}), {
	name: "hina-chats",
	skipHydration: true,
	partialize: (s) => ({
		conversations: s.conversations,
		activeId: s.activeId,
		theme: s.theme,
		voiceOn: s.voiceOn,
		lang: s.lang
	})
}));
function Sidebar({ open, onClose, onPhotos }) {
	const conversations = useChatStore((s) => s.conversations);
	const activeId = useChatStore((s) => s.activeId);
	const lang = useChatStore((s) => s.lang);
	const selectChat = useChatStore((s) => s.selectChat);
	const newChat = useChatStore((s) => s.newChat);
	const deleteChat = useChatStore((s) => s.deleteChat);
	const setLang = useChatStore((s) => s.setLang);
	const copy = t[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-0 z-30 bg-bg/70 md:hidden", open ? "block" : "hidden"),
		onClick: onClose
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("fixed inset-y-0 z-40 flex w-[min(18.5rem,88vw)] flex-col border-border bg-surface md:static md:z-0 md:w-72", lang === "en" ? "left-0 border-r" : "right-0 border-l", open ? "translate-x-0" : lang === "en" ? "-translate-x-full md:translate-x-0" : "translate-x-full md:translate-x-0"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-4 pt-5 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg tracking-tight text-fg",
					children: "Hina"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-md p-2 text-muted md:hidden",
					onClick: onClose,
					"aria-label": copy.close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 px-3 pb-3",
				children: LANGS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setLang(l.id),
					className: cn("h-9 flex-1 rounded-md border text-xs font-medium", lang === l.id ? "border-accent bg-elevated text-fg" : "border-border text-muted hover:text-fg"),
					children: l.label
				}, l.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						newChat();
						onClose();
					},
					className: "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-fg text-sm font-medium text-bg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "size-4" }), copy.newChat]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "min-h-0 flex-1 overflow-y-auto px-2 pb-4",
				children: conversations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-6 text-sm text-muted",
					children: copy.noChats
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: conversations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "group relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								selectChat(c.id);
								onClose();
							},
							className: cn("w-full rounded-md px-3 py-2.5 text-start text-sm", lang === "en" ? "pr-10" : "pl-10", c.id === activeId ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-1",
								children: c.title
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": copy.delete,
							onClick: () => deleteChat(c.id),
							className: cn("absolute top-1/2 hidden -translate-y-1/2 rounded-sm p-1.5 text-subtle hover:text-danger group-hover:block", lang === "en" ? "right-1.5" : "left-1.5"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					}, c.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onPhotos();
						onClose();
					},
					className: "flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-sm text-fg hover:bg-elevated",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4" }), copy.photos]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/admin",
					className: "flex h-10 w-full items-center justify-center gap-2 rounded-md text-xs text-subtle hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-3.5" }), copy.admin]
				})]
			})
		]
	})] });
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("8226333074bf7fc2932bbff9d05772ce6dfd87c83b22a6f4d981907edbf0b0f9"));
var generateHinaImage = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("bfbb2594cb213124cac98a374962e3ed0662311449468295192009c47b9d62fe"));
var generateHinaVideo = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f25f393e5b15e4acfab812287ba3c9be740829ccba3c596a4a0b8309a694948d"));
function isVideoMakeRequest(text) {
	const q = text.toLowerCase();
	if (/show (me )?(a |your )?(video|clip)|video of you|your video/.test(q)) return false;
	return /\b(make|create|generate|film|render)\b/.test(q) && /\b(video|clip)\b/.test(q) || /ویڈیو بنا|وڊيو ٺاه/.test(text);
}
var MALE = /\bmale\b|\bman\b|david|mark|daniel|fred|george|james|thomas|ravi|richard|ryan|brian|\bguy\b|tony|nathan/i;
var CONS = {
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
	ڻ: "ण"
};
function isVowel(ch) {
	return "اآوویےئےںؤي".includes(ch);
}
function matra(ch) {
	if (ch === "آ" || ch === "ا") return "ा";
	if (ch === "ی" || ch === "ي" || ch === "ئ") return "ी";
	if (ch === "ے") return "े";
	if (ch === "و" || ch === "ؤ") return "ो";
	if (ch === "ں") return "ं";
	return "";
}
function fullVowel(ch) {
	if (ch === "آ") return "आ";
	if (ch === "ا") return "अ";
	if (ch === "و" || ch === "ؤ") return "ओ";
	if (ch === "ی" || ch === "ي" || ch === "ئ") return "ई";
	if (ch === "ے") return "ए";
	if (ch === "ں") return "ं";
	return "";
}
/** Urdu/Sindhi script → Hindi letters so a Hindi voice can say the whole sentence. */
function toHindiSpeech(text) {
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
function blob(v) {
	return `${v.name} ${v.lang}`.toLowerCase();
}
function femaleOk(v) {
	return !MALE.test(blob(v));
}
function pick(voices, test) {
	const hits = voices.filter((v) => test.test(`${v.lang} ${v.name}`));
	return hits.find(femaleOk) ?? hits[0] ?? null;
}
function speakNow(text, lang) {
	window.speechSynthesis.cancel();
	const voices = window.speechSynthesis.getVoices();
	let spoken = text;
	let voice = null;
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
	u.rate = .9;
	u.pitch = lang === "en" ? 1.12 : 1.02;
	if (voice) u.voice = voice;
	window.speechSynthesis.speak(u);
}
function speakLocal(text, lang = "en") {
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
function stopSpeaking() {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	window.speechSynthesis.cancel();
}
function warmVoices() {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	window.speechSynthesis.getVoices();
}
function Home() {
	const conversations = useChatStore((s) => s.conversations);
	const activeId = useChatStore((s) => s.activeId);
	const sending = useChatStore((s) => s.sending);
	const theme = useChatStore((s) => s.theme);
	const voiceOn = useChatStore((s) => s.voiceOn);
	const lang = useChatStore((s) => s.lang);
	const addUserMessage = useChatStore((s) => s.addUserMessage);
	const addAssistantMessage = useChatStore((s) => s.addAssistantMessage);
	const setSending = useChatStore((s) => s.setSending);
	const toggleTheme = useChatStore((s) => s.toggleTheme);
	const setTheme = useChatStore((s) => s.setTheme);
	const toggleVoice = useChatStore((s) => s.toggleVoice);
	const setLang = useChatStore((s) => s.setLang);
	const setVoiceOn = useChatStore((s) => s.setVoiceOn);
	const copy = t[lang];
	const [draft, setDraft] = (0, import_react.useState)("");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const [online, setOnline] = (0, import_react.useState)(true);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [live, setLive] = (0, import_react.useState)(() => typeof window === "undefined" ? {
		greeting: {
			en: "",
			ur: "",
			sd: ""
		},
		tagline: {
			en: "",
			ur: "",
			sd: ""
		},
		accent: "#d4a394",
		voiceOn: true,
		photos: true,
		video: true,
		facts: []
	} : loadLive());
	const scroller = (0, import_react.useRef)(null);
	const voiceOnRef = (0, import_react.useRef)(voiceOn);
	const langRef = (0, import_react.useRef)(lang);
	voiceOnRef.current = voiceOn;
	langRef.current = lang;
	const messages = (0, import_react.useMemo)(() => conversations.find((c) => c.id === activeId) ?? conversations[0] ?? null, [conversations, activeId])?.messages ?? [];
	const showEmpty = hydrated && messages.length === 0 && !sending;
	(0, import_react.useEffect)(() => {
		const result = useChatStore.persist.rehydrate();
		Promise.resolve(result).then(() => {
			setHydrated(true);
			const s = useChatStore.getState();
			setTheme(s.theme);
			setLang(s.lang);
		});
		const on = () => setOnline(navigator.onLine);
		on();
		warmVoices();
		const initial = loadLive();
		setLive(initial);
		applyLive(initial);
		setVoiceOn(initial.voiceOn);
		const off = subscribeLive((c) => {
			setLive(c);
			applyLive(c);
			setVoiceOn(c.voiceOn);
		});
		window.addEventListener("online", on);
		window.addEventListener("offline", on);
		return () => {
			off();
			window.removeEventListener("online", on);
			window.removeEventListener("offline", on);
			stopSpeaking();
		};
	}, [
		setTheme,
		setLang,
		setVoiceOn
	]);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages.length, sending]);
	function speakIfOn(text) {
		if (voiceOnRef.current) speakLocal(text, langRef.current);
	}
	async function sendText(text) {
		const trimmed = text.trim();
		if (!trimmed || sending) return;
		setDraft("");
		const { conversationId } = addUserMessage(trimmed);
		setSending(true);
		setBusy("chat");
		try {
			if (isVideoMakeRequest(trimmed)) {
				setBusy("video");
				const result = await generateHinaVideo({ data: { prompt: trimmed } });
				if (result.ok) {
					addAssistantMessage(conversationId, t[langRef.current].videoMade(trimmed), [{
						kind: "video",
						url: result.url,
						alt: trimmed
					}]);
					speakIfOn(t[langRef.current].videoMade(trimmed));
				} else {
					const pack = pickGallery(`${trimmed} video`, langRef.current);
					addAssistantMessage(conversationId, t[langRef.current].videoFail, pack.attachments.filter((a) => a.kind === "video"));
					speakIfOn(t[langRef.current].videoFail);
				}
				return;
			}
			if (isGalleryRequest(trimmed)) {
				const pack = pickGallery(trimmed, langRef.current);
				addAssistantMessage(conversationId, pack.caption, pack.attachments);
				speakIfOn(pack.caption);
				return;
			}
			const reply = localHinaReply(trimmed, langRef.current);
			addAssistantMessage(conversationId, reply);
			speakIfOn(reply);
		} catch {
			const reply = localHinaReply(trimmed, langRef.current);
			addAssistantMessage(conversationId, reply);
			speakIfOn(reply);
		} finally {
			setSending(false);
			setBusy(null);
		}
	}
	async function sendImage() {
		const prompt = draft.trim();
		if (!prompt || sending) return;
		setDraft("");
		const { conversationId } = addUserMessage(prompt);
		setSending(true);
		try {
			const result = await generateHinaImage({ data: { prompt } });
			if (result.ok) {
				const caption = t[langRef.current].imageMade(result.prompt);
				addAssistantMessage(conversationId, caption, [{
					kind: "image",
					url: result.url,
					alt: result.prompt
				}]);
				speakIfOn(caption);
			} else {
				const pack = pickGallery(prompt, langRef.current);
				addAssistantMessage(conversationId, pack.caption, pack.attachments.filter((a) => a.kind === "image"));
				speakIfOn(pack.caption);
			}
		} finally {
			setSending(false);
		}
	}
	async function sendVideo() {
		const prompt = draft.trim();
		if (!prompt || sending) return;
		setDraft("");
		const { conversationId } = addUserMessage(prompt);
		setSending(true);
		setBusy("video");
		try {
			const result = await generateHinaVideo({ data: { prompt } });
			if (result.ok) {
				const caption = t[langRef.current].videoMade(prompt);
				addAssistantMessage(conversationId, caption, [{
					kind: "video",
					url: result.url,
					alt: prompt
				}]);
				speakIfOn(caption);
			} else {
				addAssistantMessage(conversationId, t[langRef.current].videoFail);
				speakIfOn(t[langRef.current].videoFail);
			}
		} finally {
			setSending(false);
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-dvh bg-bg text-fg", isRtl(lang) && "flex-row-reverse"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
			open: sidebarOpen,
			onClose: () => setSidebarOpen(false),
			onPhotos: () => void sendText("Show me your photos")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-3 md:px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-md p-2 text-muted md:hidden",
								onClick: () => setSidebarOpen(true),
								"aria-label": copy.openChats,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HinaAvatar, { size: 36 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: "Hina"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1 text-[11px] text-muted",
									children: [online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "size-3" }), online ? copy.online : copy.offline]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								if (voiceOn) stopSpeaking();
								toggleVoice();
							},
							className: "rounded-md p-2 text-muted hover:bg-elevated hover:text-fg",
							"aria-label": voiceOn ? copy.mute : copy.unmute,
							children: voiceOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: toggleTheme,
							className: "rounded-md p-2 text-muted hover:bg-elevated hover:text-fg",
							"aria-label": copy.theme,
							children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: scroller,
					className: "min-h-0 flex-1 overflow-y-auto",
					children: showEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						onPrompt: (p) => void sendText(p),
						hello: live.greeting[lang] || copy.hello,
						tagline: live.tagline[lang] || copy.tagline
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8",
						children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start"),
							children: [m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HinaAvatar, { size: 36 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("max-w-[min(100%,36rem)] rounded-xl px-4 py-3", m.role === "user" ? "rounded-br-sm bg-user" : "rounded-bl-sm bg-elevated"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBody, { text: m.content }),
									m.attachments && m.attachments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: m.attachments.length > 1 ? "mt-3 grid grid-cols-2 gap-2" : "mt-3",
										children: m.attachments.map((a, i) => a.kind === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: a.url,
											alt: a.alt ?? "",
											className: "max-h-72 w-full rounded-lg object-cover"
										}, i) : a.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
											src: a.url,
											controls: true,
											playsInline: true,
											autoPlay: true,
											muted: true,
											loop: true,
											className: "w-full rounded-lg"
										}, i) : null)
									}),
									m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "mt-2 inline-flex items-center gap-1 text-[11px] text-subtle hover:text-fg",
										onClick: () => speakLocal(m.content, lang),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-3.5" }), copy.listen]
									})
								]
							})]
						}, m.id)), sending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HinaAvatar, { size: 36 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: busy === "video" ? copy.filming : copy.thinking
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
					value: draft,
					onChange: setDraft,
					onSend: () => void sendText(draft),
					onImage: () => void sendImage(),
					onVideo: () => void sendVideo(),
					sending,
					lang,
					showImage: live.photos,
					showVideo: live.video
				})
			]
		})]
	});
}
function EmptyState({ onPrompt, hello, tagline }) {
	const copy = t[useChatStore((s) => s.lang)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HinaAvatar, { size: 88 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-3xl tracking-tight",
				children: hello
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm leading-relaxed text-muted",
				children: tagline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid w-full gap-2 sm:grid-cols-2",
				children: copy.prompts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onPrompt(p),
					className: "min-h-11 rounded-lg border border-border bg-surface px-4 py-3 text-start text-sm text-fg hover:bg-elevated",
					children: p
				}, p))
			})
		]
	});
}
//#endregion
export { Home as component };
