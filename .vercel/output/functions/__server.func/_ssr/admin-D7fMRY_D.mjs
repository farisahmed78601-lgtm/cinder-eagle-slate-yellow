import { i as __toESM } from "../_runtime.mjs";
import { i as saveLive, n as applyLive, r as loadLive, t as DEFAULT_LIVE } from "./live-CJbiZNWC.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D7fMRY_D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PIN = "hameed";
function Admin() {
	const [authed, setAuthed] = (0, import_react.useState)(false);
	const [pin, setPin] = (0, import_react.useState)("");
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_LIVE);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [draftFact, setDraftFact] = (0, import_react.useState)({
		id: "",
		keys: "",
		en: "",
		ur: "",
		sd: ""
	});
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem("hina-admin") === "1") setAuthed(true);
		const live = loadLive();
		setCfg(live);
		applyLive(live);
	}, []);
	function login(e) {
		e.preventDefault();
		if (pin.trim().toLowerCase() === PIN) {
			sessionStorage.setItem("hina-admin", "1");
			setAuthed(true);
		}
	}
	function patch(next) {
		setCfg(next);
		saveLive(next);
		setSaved(true);
		window.setTimeout(() => setSaved(false), 1200);
	}
	if (!authed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg px-4 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: login,
			className: "w-full max-w-sm rounded-xl border border-border bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Hina admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Enter PIN to edit the live front."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-4 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm outline-none",
					type: "password",
					value: pin,
					onChange: (e) => setPin(e.target.value),
					placeholder: "PIN",
					autoFocus: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "mt-3 h-11 w-full rounded-lg bg-accent text-sm font-medium text-accent-fg",
					children: "Enter"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 block text-center text-xs text-subtle hover:text-fg",
					children: "Back to chat"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg px-4 py-8 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl",
						children: "Live front"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-sm text-muted hover:text-fg",
						children: "Open chat"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Edits go live on the chat screen as you type — no refresh."
				}),
				[
					"en",
					"ur",
					"sd"
				].map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "space-y-2 rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "px-1 text-xs uppercase tracking-wide text-subtle",
							children: lang
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs text-muted",
							children: "Greeting"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm",
							value: cfg.greeting[lang],
							onChange: (e) => patch({
								...cfg,
								greeting: {
									...cfg.greeting,
									[lang]: e.target.value
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block pt-2 text-xs text-muted",
							children: "Tagline"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "min-h-20 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm",
							value: cfg.tagline[lang],
							onChange: (e) => patch({
								...cfg,
								tagline: {
									...cfg.tagline,
									[lang]: e.target.value
								}
							})
						})
					]
				}, lang)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted",
						children: "Accent color"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: cfg.accent,
								onChange: (e) => patch({
									...cfg,
									accent: e.target.value
								}),
								className: "h-11 w-16 cursor-pointer rounded border border-border bg-transparent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: cfg.voiceOn,
									onChange: (e) => patch({
										...cfg,
										voiceOn: e.target.checked
									})
								}), "Speak answers"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: cfg.photos,
									onChange: (e) => patch({
										...cfg,
										photos: e.target.checked
									})
								}), "Photos"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: cfg.video,
									onChange: (e) => patch({
										...cfg,
										video: e.target.checked
									})
								}), "Video"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Knowledge you add"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Keywords, then the answer in English, Urdu, and Sindhi. Hina uses these immediately."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm",
							placeholder: "Keywords, comma separated",
							value: draftFact.keys,
							onChange: (e) => setDraftFact({
								...draftFact,
								keys: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm",
							placeholder: "English answer",
							value: draftFact.en,
							onChange: (e) => setDraftFact({
								...draftFact,
								en: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm",
							placeholder: "اردو جواب",
							dir: "rtl",
							value: draftFact.ur,
							onChange: (e) => setDraftFact({
								...draftFact,
								ur: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm",
							placeholder: "سنڌي جواب",
							dir: "rtl",
							value: draftFact.sd,
							onChange: (e) => setDraftFact({
								...draftFact,
								sd: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 w-full rounded-lg border border-border text-sm",
							onClick: () => {
								if (!draftFact.keys.trim() || !draftFact.en.trim()) return;
								const next = {
									...cfg,
									facts: [...cfg.facts, {
										...draftFact,
										id: crypto.randomUUID()
									}]
								};
								setDraftFact({
									id: "",
									keys: "",
									en: "",
									ur: "",
									sd: ""
								});
								patch(next);
							},
							children: "Add knowledge"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: cfg.facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border px-3 py-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-subtle",
										children: fact.keys
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1",
										children: fact.en
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mt-2 text-xs text-danger",
										onClick: () => patch({
											...cfg,
											facts: cfg.facts.filter((f) => f.id !== fact.id)
										}),
										children: "Remove"
									})
								]
							}, fact.id))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch(cfg),
					className: "h-11 w-full rounded-lg bg-accent text-sm font-medium text-accent-fg",
					children: saved ? "Live now" : "Saved live"
				})
			]
		})
	});
}
//#endregion
export { Admin as component };
