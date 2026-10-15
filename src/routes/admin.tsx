import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchWikiFact, WIKI_TOPIC_COUNT } from "@/lib/hina/api";
import { applyLive, DEFAULT_LIVE, loadLive, saveLive, type HinaFact, type LiveConfig } from "@/lib/hina/live";
import { speakLocal, stopSpeaking } from "@/lib/hina/voice";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/admin")({ component: Admin });

const PIN = "hameed";
type Panel = "voice" | "knowledge" | "look" | "embed";

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [cfg, setCfg] = useState<LiveConfig>(DEFAULT_LIVE);
  const [origin, setOrigin] = useState("");
  const [saved, setSaved] = useState(false);
  const [panel, setPanel] = useState<Panel>("voice");
  const [draftFact, setDraftFact] = useState<HinaFact>({ id: "", keys: "", en: "", ur: "", sd: "" });
  const [progress, setProgress] = useState(0);
  const [growing, setGrowing] = useState(false);
  const [growNote, setGrowNote] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("hina-admin") === "1") setAuthed(true);
    const live = loadLive();
    setCfg(live);
    applyLive(live);
    setOrigin(window.location.origin);
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim().toLowerCase() === PIN) {
      sessionStorage.setItem("hina-admin", "1");
      setAuthed(true);
    }
  }

  function patch(next: LiveConfig) {
    setCfg(next);
    saveLive(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }

  async function growKnowledge() {
    if (growing) return;
    setGrowing(true);
    setProgress(0);
    setGrowNote("Reading from Wikipedia…");
    const total = WIKI_TOPIC_COUNT;
    let facts = [...loadLive().facts];
    let added = 0;
    for (let i = 0; i < total; i++) {
      setProgress(Math.round((i / total) * 100));
      try {
        const got = await fetchWikiFact({ data: { index: i } });
        if (got.ok) {
          facts = [...facts.filter((f) => f.id !== got.fact.id), got.fact];
          added += 1;
        }
      } catch {
        /* keep going so the bar still finishes */
      }
    }
    patch({ ...loadLive(), facts });
    setProgress(100);
    setGrowNote(added ? `Added ${added} topics in English, Urdu, and Sindhi.` : "Could not reach Wikipedia just now.");
    setGrowing(false);
  }

  function downloadKnowledge() {
    const blob = new Blob([JSON.stringify({ facts: cfg.facts }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hina-knowledge.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function uploadKnowledge(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { facts?: HinaFact[] } | HinaFact[];
        const list = Array.isArray(parsed) ? parsed : parsed.facts;
        if (!Array.isArray(list)) return;
        const facts = list
          .filter((f) => f && typeof f.en === "string" && typeof f.keys === "string")
          .map((f) => ({
            id: f.id || crypto.randomUUID(),
            keys: f.keys,
            en: f.en,
            ur: f.ur || f.en,
            sd: f.sd || f.ur || f.en,
          }));
        patch({ ...loadLive(), facts: [...loadLive().facts, ...facts] });
        setGrowNote(`Uploaded ${facts.length} notes.`);
        setProgress(100);
      } catch {
        setGrowNote("That file is not Hina knowledge JSON.");
      }
    };
    reader.readAsText(file);
  }

  if (!authed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg px-4 text-fg">
        <form onSubmit={login} className="w-full max-w-sm rounded-xl border border-border bg-surface p-6">
          <h1 className="font-display text-2xl">Hina admin</h1>
          <p className="mt-1 text-sm text-muted">Enter PIN to edit the live front.</p>
          <input
            className="mt-4 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm outline-none"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            autoFocus
          />
          <button type="submit" className="mt-3 h-11 w-full rounded-lg bg-accent text-sm font-medium text-accent-fg">
            Enter
          </button>
          <Link to="/" className="mt-4 block text-center text-xs text-subtle hover:text-fg">
            Back to chat
          </Link>
        </form>
      </div>
    );
  }

  const nav: { id: Panel; label: string }[] = [
    { id: "voice", label: "Voice" },
    { id: "knowledge", label: "Knowledge" },
    { id: "look", label: "Look" },
    { id: "embed", label: "Embed" },
  ];

  return (
    <div className="flex min-h-dvh bg-bg text-fg">
      <aside className="flex w-40 shrink-0 flex-col border-r border-border bg-surface p-3 sm:w-56 sm:p-4">
        <p className="font-display text-lg sm:text-xl">Hina</p>
        <p className="text-[11px] text-subtle">Admin</p>
        <nav className="mt-5 flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPanel(item.id)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-left text-sm",
                panel === item.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-elevated hover:text-fg",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <p className="mb-3 text-[11px] text-subtle">{cfg.facts.length} notes saved</p>
        <Link to="/" className="text-xs text-subtle hover:text-fg">
          Open chat
        </Link>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl capitalize">{panel}</h1>
            <span className="text-xs text-subtle">{saved ? "Live now" : "Saves as you change"}</span>
          </div>

          {panel === "voice" && (
            <section className="space-y-4 rounded-xl border border-border bg-surface p-4">
              <label className="block text-xs text-muted">
                Speaker
                <select
                  className="mt-1 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm text-fg"
                  value={cfg.speaker}
                  onChange={(e) => {
                    const speaker = e.target.value === "male" || e.target.value === "female" ? e.target.value : "clear";
                    patch({ ...cfg, speaker });
                  }}
                >
                  <option value="clear">Hina — natural</option>
                  <option value="female">Lighter</option>
                  <option value="male">Deeper</option>
                </select>
              </label>
              <label className="block text-xs text-muted">
                Speed
                <select
                  className="mt-1 h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm text-fg"
                  value={cfg.rate}
                  onChange={(e) =>
                    patch({
                      ...cfg,
                      rate: e.target.value === "slow" || e.target.value === "fast" ? e.target.value : "normal",
                    })
                  }
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cfg.voiceOn}
                  onChange={(e) => patch({ ...cfg, voiceOn: e.target.checked })}
                />
                Speak answers in chat
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="h-10 rounded-lg border border-border px-3 text-xs" onClick={() => void speakLocal("Hi, I’m Hina. This is my English voice.", "en")}>
                  Hear English
                </button>
                <button type="button" className="h-10 rounded-lg border border-border px-3 text-xs" onClick={() => void speakLocal("السلام علیکم، میں ہنا ہوں۔ میں اردو میں بات کر رہی ہوں۔", "ur")}>
                  Hear Urdu
                </button>
                <button type="button" className="h-10 rounded-lg border border-border px-3 text-xs" onClick={() => void speakLocal("سلام، مان هناءَ آهيان. مان سنڌي ۾ ڳالهائي رهي آهيان.", "sd")}>
                  Hear Sindhi
                </button>
                <button type="button" className="h-10 rounded-lg px-3 text-xs text-muted" onClick={() => stopSpeaking()}>
                  Stop
                </button>
              </div>
              <p className="text-xs text-muted">
                Hina uses a natural woman’s voice, without a pitch shift. Lighter is a little higher, Deeper a little lower. Speed only changes how fast she talks.
              </p>
            </section>
          )}

          {panel === "knowledge" && (
            <section className="space-y-4">
              <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
                <h2 className="text-sm font-medium">Increase Urdu and Sindhi knowledge</h2>
                <p className="text-xs text-muted">
                  Downloads short notes from English, Urdu, and Sindhi Wikipedia onto this browser. Free.
                </p>
                <button
                  type="button"
                  disabled={growing}
                  onClick={() => void growKnowledge()}
                  className="h-11 w-full rounded-lg bg-accent text-sm font-medium text-accent-fg disabled:opacity-50"
                >
                  {growing ? `Increasing… ${progress}%` : "Increase knowledge"}
                </button>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted">
                    <span>0%</span>
                    <span className="font-medium text-fg">{progress}%</span>
                    <span>100%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-elevated">
                    <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <p className="text-xs text-muted">{growNote}</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="h-10 rounded-lg border border-border px-3 text-xs" onClick={downloadKnowledge}>
                    Download knowledge
                  </button>
                  <label className="flex h-10 cursor-pointer items-center rounded-lg border border-border px-3 text-xs">
                    Upload knowledge
                    <input
                      type="file"
                      accept="application/json,.json"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadKnowledge(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
                <h2 className="text-sm font-medium">Add one note</h2>
                <input
                  className="h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm"
                  placeholder="Keywords, comma separated"
                  value={draftFact.keys}
                  onChange={(e) => setDraftFact({ ...draftFact, keys: e.target.value })}
                />
                <textarea className="min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm" placeholder="English answer" value={draftFact.en} onChange={(e) => setDraftFact({ ...draftFact, en: e.target.value })} />
                <textarea className="min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm" placeholder="اردو جواب" dir="rtl" value={draftFact.ur} onChange={(e) => setDraftFact({ ...draftFact, ur: e.target.value })} />
                <textarea className="min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm" placeholder="سنڌي جواب" dir="rtl" value={draftFact.sd} onChange={(e) => setDraftFact({ ...draftFact, sd: e.target.value })} />
                <button
                  type="button"
                  className="h-11 w-full rounded-lg border border-border text-sm"
                  onClick={() => {
                    if (!draftFact.keys.trim() || !draftFact.en.trim()) return;
                    patch({ ...loadLive(), facts: [...loadLive().facts, { ...draftFact, id: crypto.randomUUID() }] });
                    setDraftFact({ id: "", keys: "", en: "", ur: "", sd: "" });
                  }}
                >
                  Add knowledge
                </button>
                <ul className="max-h-80 space-y-2 overflow-y-auto">
                  {cfg.facts.map((fact) => (
                    <li key={fact.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                      <p className="text-xs text-subtle">{fact.keys}</p>
                      <p className="mt-1 line-clamp-3">{fact.en}</p>
                      <button
                        type="button"
                        className="mt-2 text-xs text-danger"
                        onClick={() => patch({ ...loadLive(), facts: loadLive().facts.filter((f) => f.id !== fact.id) })}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {panel === "look" && (
            <section className="space-y-4">
              <div className="rounded-xl border border-border bg-surface p-4">
                <label className="text-xs text-muted">Accent color</label>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <input type="color" value={cfg.accent} onChange={(e) => patch({ ...cfg, accent: e.target.value })} className="h-11 w-16 cursor-pointer rounded border border-border bg-transparent" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={cfg.photos} onChange={(e) => patch({ ...cfg, photos: e.target.checked })} />
                    Photos
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={cfg.video} onChange={(e) => patch({ ...cfg, video: e.target.checked })} />
                    Video
                  </label>
                </div>
              </div>
              {(["en", "ur", "sd"] as const).map((lang) => (
                <fieldset key={lang} className="space-y-2 rounded-xl border border-border bg-surface p-4">
                  <legend className="px-1 text-xs uppercase tracking-wide text-subtle">{lang}</legend>
                  <label className="block text-xs text-muted">Greeting</label>
                  <input className="h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm" value={cfg.greeting[lang]} onChange={(e) => patch({ ...cfg, greeting: { ...cfg.greeting, [lang]: e.target.value } })} />
                  <label className="block pt-2 text-xs text-muted">Tagline</label>
                  <textarea className="min-h-20 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm" value={cfg.tagline[lang]} onChange={(e) => patch({ ...cfg, tagline: { ...cfg.tagline, [lang]: e.target.value } })} />
                </fieldset>
              ))}
            </section>
          )}

          {panel === "embed" && (
            <section className="space-y-3 rounded-xl border border-border bg-surface p-4">
              <h2 className="text-sm font-medium">Put Hina on a site or app</h2>
              <p className="text-xs text-muted">Paste this on any website. A Hina button appears and she answers there. Chat is free.</p>
              <textarea readOnly className="min-h-20 w-full rounded-lg border border-border bg-elevated px-3 py-2 font-mono text-xs" value={origin ? `<script src="${origin}/hina-widget.js" async></script>` : ""} />
              <p className="text-xs text-muted">Or an iframe inside an app:</p>
              <textarea
                readOnly
                className="min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 font-mono text-xs"
                value={origin ? `<iframe src="${origin}/embed" title="Hina" style="width:100%;height:640px;border:0"></iframe>` : ""}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
