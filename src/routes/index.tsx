import { createFileRoute } from "@tanstack/react-router";
import { Menu, Mic, Moon, Sun, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { HinaAvatar } from "@/components/hina/avatar";
import { Composer } from "@/components/hina/composer";
import { MessageBody } from "@/components/hina/markdown";
import { Sidebar } from "@/components/hina/sidebar";
import { generateHinaImage, generateHinaVideo, sendHinaMessage } from "@/lib/hina/api";
import { t } from "@/lib/hina/i18n";
import { localHinaReply } from "@/lib/hina/local";
import { isGalleryRequest, pickGallery } from "@/lib/hina/gallery";
import { isVideoMakeRequest } from "@/lib/hina/media";
import { applyLive, loadLive, subscribeLive, type LiveConfig } from "@/lib/hina/live";
import { useChatStore } from "@/lib/hina/store";
import { speakLocal, stopSpeaking, warmVoices, listenOnce, canListen } from "@/lib/hina/voice";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/")({ component: () => <Home /> });

export function Home({ embed = false }: { embed?: boolean }) {
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

  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState<"chat" | "video" | null>(null);
  const [live, setLive] = useState<LiveConfig>(() =>
    typeof window === "undefined"
      ? { greeting: { en: "", ur: "", sd: "" }, tagline: { en: "", ur: "", sd: "" }, accent: "#d4a394", voiceOn: true, photos: true, video: true, speaker: "clear" as const, rate: "normal" as const, facts: [] }
      : loadLive(),
  );
  const [listening, setListening] = useState(false);
  const [voiceChat, setVoiceChat] = useState(false);
  const [talking, setTalking] = useState(false);
  const [micNote, setMicNote] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const voiceOnRef = useRef(voiceOn);
  const langRef = useRef(lang);
  const talkRef = useRef(false);
  const stopMic = useRef<(() => void) | null>(null);
  const sendingRef = useRef(sending);
  voiceOnRef.current = voiceOn;
  langRef.current = lang;
  sendingRef.current = sending;

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0] ?? null,
    [conversations, activeId],
  );
  const messages = active?.messages ?? [];
  const showEmpty = hydrated && messages.length === 0 && !sending;

  useEffect(() => {
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
      stopMic.current?.();
    };
  }, [setTheme, setLang, setVoiceOn]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, sending]);

  useEffect(() => {
    if (!hydrated) return;
    if (sessionStorage.getItem("hina-speak-now") === "4") return;
    sessionStorage.setItem("hina-speak-now", "4");
    const langNow = useChatStore.getState().lang;
    const ask = langNow === "ur" ? "اب بولیں" : langNow === "sd" ? "هاڻي ڳالهايو" : "Please speak now";
    const line =
      langNow === "ur"
        ? "السلام علیکم، میں ہنا ہوں۔ میں اب بول رہی ہوں۔"
        : langNow === "sd"
          ? "سلام، مان هناءَ آهيان. مان هاڻي ڳالهائي رهي آهيان."
          : "Hi, I’m Hina. I’m speaking now.";
    const { conversationId } = useChatStore.getState().addUserMessage(ask);
    useChatStore.getState().addAssistantMessage(conversationId, line);
    setVoiceOn(true);
    voiceOnRef.current = true;
    let cancelUnlock = () => {};
    const say = () => {
      setTalking(true);
      return speakLocal(line, langNow).finally(() => setTalking(false));
    };
    void say().then((ok) => {
      if (ok) return;
      const unlock = () => {
        void say();
      };
      window.addEventListener("pointerdown", unlock, { once: true });
      cancelUnlock = () => window.removeEventListener("pointerdown", unlock);
    });
    return () => cancelUnlock();
  }, [hydrated, setVoiceOn, 4]);

  function armListen() {
    if (!talkRef.current || !canListen()) return;
    stopMic.current?.();
    setListening(true);
    stopMic.current = listenOnce(
      langRef.current,
      (said) => {
        setListening(false);
        stopMic.current = null;
        void sendText(said);
      },
      (error) => {
        setListening(false);
        talkRef.current = false;
        setVoiceChat(false);
        if (error) setMicNote(t[langRef.current].mic);
      },
    );
  }

  function onTalk() {
    setMicNote("");
    if (talkRef.current) {
      talkRef.current = false;
      setVoiceChat(false);
      stopMic.current?.();
      stopMic.current = null;
      setListening(false);
      stopSpeaking();
      return;
    }
    talkRef.current = true;
    setVoiceChat(true);
    setVoiceOn(true);
    voiceOnRef.current = true;
    stopSpeaking();
    if (!canListen()) {
      talkRef.current = false;
      setVoiceChat(false);
      setMicNote(t[langRef.current].mic);
      return;
    }
    armListen();
  }

  async function speakIfOn(text: string) {
    if (voiceOnRef.current || talkRef.current) {
      setTalking(true);
      try {
        await speakLocal(text, langRef.current);
      } finally {
        setTalking(false);
      }
    }
    sendingRef.current = false;
    if (talkRef.current) armListen();
  }

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sendingRef.current) return;
    stopMic.current?.();
    setListening(false);
    setDraft("");
    const { conversationId } = addUserMessage(trimmed);
    sendingRef.current = true;
    setSending(true);
    setBusy("chat");
    try {
      if (isVideoMakeRequest(trimmed)) {
        setBusy("video");
        const result = await generateHinaVideo({ data: { prompt: trimmed } });
        if (result.ok) {
          addAssistantMessage(conversationId, t[langRef.current].videoMade(trimmed), [
            { kind: "video", url: result.url, alt: trimmed },
          ]);
          await speakIfOn(t[langRef.current].videoMade(trimmed));
        } else {
          const pack = pickGallery(`${trimmed} video`, langRef.current);
          addAssistantMessage(conversationId, t[langRef.current].videoFail, pack.attachments.filter((a) => a.kind === "video"));
          await speakIfOn(t[langRef.current].videoFail);
        }
        return;
      }
      if (isGalleryRequest(trimmed)) {
        const pack = pickGallery(trimmed, langRef.current);
        addAssistantMessage(conversationId, pack.caption, pack.attachments);
        await speakIfOn(pack.caption);
        return;
      }
      const history = (useChatStore.getState().conversations.find((c) => c.id === conversationId)?.messages ?? []).map(
        (m) => ({ role: m.role, content: m.content }),
      );
      const result = await sendHinaMessage({ data: { lang: langRef.current, messages: history } });
      const reply = result.text || localHinaReply(trimmed, langRef.current);
      addAssistantMessage(conversationId, reply);
      await speakIfOn(reply);
    } catch {
      const reply = localHinaReply(trimmed, langRef.current);
      addAssistantMessage(conversationId, reply);
      await speakIfOn(reply);
    } finally {
      sendingRef.current = false;
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
        addAssistantMessage(conversationId, caption, [
          { kind: "image", url: result.url, alt: result.prompt },
        ]);
        await speakIfOn(caption);
      } else {
        const pack = pickGallery(prompt, langRef.current);
        addAssistantMessage(conversationId, pack.caption, pack.attachments.filter((a) => a.kind === "image"));
        await speakIfOn(pack.caption);
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
        addAssistantMessage(conversationId, caption, [
          { kind: "video", url: result.url, alt: prompt },
        ]);
        await speakIfOn(caption);
      } else {
        addAssistantMessage(conversationId, t[langRef.current].videoFail);
        await speakIfOn(t[langRef.current].videoFail);
      }
    } finally {
      setSending(false);
      setBusy(null);
    }
  }

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-bg text-fg">
      {!embed && (
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPhotos={() => void sendText("Show me your photos")}
      />
      )}

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-3 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-md p-2 text-muted md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label={copy.openChats}
              hidden={embed}
            >
              <Menu className="size-5" />
            </button>
            <HinaAvatar size={36} talking={talking} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Hina</p>
              <p className="flex items-center gap-1 text-[11px] text-muted">
                {talking ? (
                  lang === "ur" ? "مسکراتے ہوئے بول رہی ہوں" : lang === "sd" ? "مرڪندي ڳالهائي رهي آهيان" : "Talking with a smile"
                ) : (
                  <>
                    {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
                    {online ? copy.online : copy.offline}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onTalk}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium",
                listening ? "bg-accent text-accent-fg" : "bg-fg text-bg",
              )}
              aria-label={listening ? copy.listening : copy.voiceChat}
            >
              <Mic className="size-4" />
              <span className="hidden sm:inline">{listening ? copy.listening : copy.voiceChat}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (voiceOn) stopSpeaking();
                toggleVoice();
              }}
              className="rounded-md p-2 text-muted hover:bg-elevated hover:text-fg"
              aria-label={voiceOn ? copy.mute : copy.unmute}
            >
              {voiceOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-md p-2 text-muted hover:bg-elevated hover:text-fg"
              aria-label={copy.theme}
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
          </div>
        </header>

        <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
          {showEmpty ? (
            <EmptyState
              onPrompt={(p) => void sendText(p)}
              onVoice={onTalk}
              listening={listening}
              hello={live.greeting[lang] || copy.hello}
              tagline={live.tagline[lang] || copy.tagline}
            />
          ) : (
            <ol className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8">
              {messages.map((m, i) => (
                <li
                  key={m.id}
                  className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "assistant" && <HinaAvatar size={36} talking={talking && i === messages.length - 1} />}
                  <div
                    className={cn(
                      "max-w-[min(100%,36rem)] rounded-xl px-4 py-3",
                      m.role === "user" ? "rounded-br-sm bg-user" : "rounded-bl-sm bg-elevated",
                    )}
                  >
                    <MessageBody text={m.content} />
                    {m.attachments && m.attachments.length > 0 && (
                      <div
                        className={
                          m.attachments.length > 1
                            ? "mt-3 grid grid-cols-2 gap-2"
                            : "mt-3"
                        }
                      >
                        {m.attachments.map((a, i) =>
                          a.kind === "image" ? (
                            <img
                              key={i}
                              src={a.url}
                              alt={a.alt ?? ""}
                              className="max-h-72 w-full rounded-lg object-cover"
                            />
                          ) : a.kind === "video" ? (
                            <video
                              key={i}
                              src={a.url}
                              controls
                              playsInline
                              autoPlay
                              muted
                              loop
                              className="w-full rounded-lg"
                            />
                          ) : null,
                        )}
                      </div>
                    )}
                    {m.role === "assistant" && (
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] text-subtle hover:text-fg"
                        onClick={() => {
                          setTalking(true);
                          void speakLocal(m.content, lang).finally(() => setTalking(false));
                        }}
                      >
                        <Volume2 className="size-3.5" />
                        {copy.listen}
                      </button>
                    )}
                  </div>
                </li>
              ))}
              {sending && (
                <li className="flex items-center gap-3">
                  <HinaAvatar size={36} />
                  <p className="text-sm text-muted">{busy === "video" ? copy.filming : copy.thinking}</p>
                </li>
              )}
            </ol>
          )}
        </div>

        <Composer
          value={draft}
          onChange={setDraft}
          onSend={() => void sendText(draft)}
          onImage={() => void sendImage()}
          onVideo={() => void sendVideo()}
          sending={sending}
          lang={lang}
          showImage={live.photos}
          showVideo={live.video}
          listening={listening}
          onTalk={onTalk}
          micNote={micNote}
        />
        {voiceChat && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-bg/95 px-6 text-center">
            <HinaAvatar size={120} talking={talking || listening} />
            <div>
              <p className="font-display text-2xl">Hina</p>
              <p className="mt-1 text-sm text-muted">
                {listening ? copy.listening : talking ? (lang === "ur" ? "بول رہی ہوں" : lang === "sd" ? "ڳالهائي رهي آهيان" : "Speaking") : copy.thinking}
              </p>
            </div>
            <button
              type="button"
              onClick={onTalk}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg"
            >
              <Mic className="size-4" />
              {copy.endVoice}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  onPrompt,
  onVoice,
  listening,
  hello,
  tagline,
}: {
  onPrompt: (p: string) => void;
  onVoice: () => void;
  listening: boolean;
  hello: string;
  tagline: string;
}) {
  const lang = useChatStore((s) => s.lang);
  const copy = t[lang];
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center">
      <HinaAvatar size={88} talking={listening} />
      <h1 className="mt-6 font-display text-3xl tracking-tight">{hello}</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{tagline}</p>
      <button
        type="button"
        onClick={onVoice}
        className={cn(
          "mt-6 inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium",
          listening ? "bg-accent text-accent-fg" : "bg-fg text-bg",
        )}
      >
        <Mic className="size-4" />
        {listening ? copy.listening : copy.voiceChat}
      </button>
      <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
        {copy.prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPrompt(p)}
            className="min-h-11 rounded-lg border border-border bg-surface px-4 py-3 text-start text-sm text-fg hover:bg-elevated"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
