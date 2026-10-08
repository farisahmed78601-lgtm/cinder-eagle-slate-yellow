import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { applyLive, DEFAULT_LIVE, loadLive, saveLive, type HinaFact, type LiveConfig } from "@/lib/hina/live";

export const Route = createFileRoute("/admin")({ component: Admin });

const PIN = "hameed";

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [cfg, setCfg] = useState<LiveConfig>(DEFAULT_LIVE);
  const [saved, setSaved] = useState(false);
  const [draftFact, setDraftFact] = useState<HinaFact>({ id: "", keys: "", en: "", ur: "", sd: "" });

  useEffect(() => {
    if (sessionStorage.getItem("hina-admin") === "1") setAuthed(true);
    const live = loadLive();
    setCfg(live);
    applyLive(live);
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

  return (
    <div className="min-h-dvh bg-bg px-4 py-8 text-fg">
      <div className="mx-auto max-w-xl space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl">Live front</h1>
          <Link to="/" className="text-sm text-muted hover:text-fg">
            Open chat
          </Link>
        </div>
        <p className="text-sm text-muted">Edits go live on the chat screen as you type — no refresh.</p>

        {(["en", "ur", "sd"] as const).map((lang) => (
          <fieldset key={lang} className="space-y-2 rounded-xl border border-border bg-surface p-4">
            <legend className="px-1 text-xs uppercase tracking-wide text-subtle">{lang}</legend>
            <label className="block text-xs text-muted">Greeting</label>
            <input
              className="h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm"
              value={cfg.greeting[lang]}
              onChange={(e) =>
                patch({ ...cfg, greeting: { ...cfg.greeting, [lang]: e.target.value } })
              }
            />
            <label className="block pt-2 text-xs text-muted">Tagline</label>
            <textarea
              className="min-h-20 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm"
              value={cfg.tagline[lang]}
              onChange={(e) =>
                patch({ ...cfg, tagline: { ...cfg.tagline, [lang]: e.target.value } })
              }
            />
          </fieldset>
        ))}

        <div className="rounded-xl border border-border bg-surface p-4">
          <label className="text-xs text-muted">Accent color</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="color"
              value={cfg.accent}
              onChange={(e) => patch({ ...cfg, accent: e.target.value })}
              className="h-11 w-16 cursor-pointer rounded border border-border bg-transparent"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cfg.voiceOn}
                onChange={(e) => patch({ ...cfg, voiceOn: e.target.checked })}
              />
              Speak answers
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cfg.photos}
                onChange={(e) => patch({ ...cfg, photos: e.target.checked })}
              />
              Photos
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cfg.video}
                onChange={(e) => patch({ ...cfg, video: e.target.checked })}
              />
              Video
            </label>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-medium">Knowledge you add</h2>
          <p className="text-xs text-muted">Keywords, then the answer in English, Urdu, and Sindhi. Hina uses these immediately.</p>
          <input
            className="h-11 w-full rounded-lg border border-border bg-elevated px-3 text-sm"
            placeholder="Keywords, comma separated"
            value={draftFact.keys}
            onChange={(e) => setDraftFact({ ...draftFact, keys: e.target.value })}
          />
          <textarea
            className="min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm"
            placeholder="English answer"
            value={draftFact.en}
            onChange={(e) => setDraftFact({ ...draftFact, en: e.target.value })}
          />
          <textarea
            className="min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm"
            placeholder="اردو جواب"
            dir="rtl"
            value={draftFact.ur}
            onChange={(e) => setDraftFact({ ...draftFact, ur: e.target.value })}
          />
          <textarea
            className="min-h-16 w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm"
            placeholder="سنڌي جواب"
            dir="rtl"
            value={draftFact.sd}
            onChange={(e) => setDraftFact({ ...draftFact, sd: e.target.value })}
          />
          <button
            type="button"
            className="h-11 w-full rounded-lg border border-border text-sm"
            onClick={() => {
              if (!draftFact.keys.trim() || !draftFact.en.trim()) return;
              const next = {
                ...cfg,
                facts: [...cfg.facts, { ...draftFact, id: crypto.randomUUID() }],
              };
              setDraftFact({ id: "", keys: "", en: "", ur: "", sd: "" });
              patch(next);
            }}
          >
            Add knowledge
          </button>
          <ul className="space-y-2">
            {cfg.facts.map((fact) => (
              <li key={fact.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                <p className="text-xs text-subtle">{fact.keys}</p>
                <p className="mt-1">{fact.en}</p>
                <button
                  type="button"
                  className="mt-2 text-xs text-danger"
                  onClick={() => patch({ ...cfg, facts: cfg.facts.filter((f) => f.id !== fact.id) })}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => patch(cfg)}
          className="h-11 w-full rounded-lg bg-accent text-sm font-medium text-accent-fg"
        >
          {saved ? "Live now" : "Saved live"}
        </button>
      </div>
    </div>
  );
}
