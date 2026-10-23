import { ImagePlus, Mic, Send, Square, Video } from "lucide-react";
import { t, type Lang } from "@/lib/hina/i18n";
import { cn } from "@/lib/cn";

export function Composer({
  value,
  onChange,
  onSend,
  onImage,
  onVideo,
  sending,
  lang,
  showImage = true,
  showVideo = true,
  listening = false,
  onTalk,
  micNote = "",
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onImage: () => void;
  onVideo: () => void;
  sending: boolean;
  lang: Lang;
  showImage?: boolean;
  showVideo?: boolean;
  listening?: boolean;
  onTalk: () => void;
  micNote?: string;
}) {
  const copy = t[lang];
  return (
    <form
      className="border-t border-border bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!sending) onSend();
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <button
          type="button"
          onClick={onTalk}
          className={cn(
            "flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium",
            listening ? "bg-accent text-accent-fg" : "bg-fg text-bg",
          )}
          aria-label={listening ? copy.listening : copy.voiceChat}
        >
          <Mic className="size-5" />
          <span>{listening ? copy.listening : copy.voiceChat}</span>
        </button>
        <div className="flex items-end gap-2 rounded-xl border border-border bg-elevated p-2">
          <textarea
            rows={1}
            value={value}
            placeholder={copy.placeholder}
            onChange={(e) => {
              onChange(e.target.value);
              const el = e.target;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!sending) onSend();
              }
            }}
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-fg outline-none placeholder:text-subtle"
          />
          {showImage && (
            <button
              type="button"
              onClick={onImage}
              disabled={sending || !value.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-fg disabled:opacity-40"
              aria-label={copy.image}
              title={copy.image}
            >
              <ImagePlus className="size-5" />
            </button>
          )}
          {showVideo && (
            <button
              type="button"
              onClick={onVideo}
              disabled={sending || !value.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-fg disabled:opacity-40"
              aria-label={copy.video}
              title={copy.video}
            >
              <Video className="size-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={sending || !value.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-fg disabled:opacity-40"
            aria-label={copy.send}
          >
            {sending ? <Square className="size-4" /> : <Send className="size-4" />}
          </button>
        </div>
        {micNote ? (
          <p className="line-clamp-2 px-1 text-[11px] leading-snug text-muted">{micNote}</p>
        ) : (
          <p className="hidden px-1 text-[11px] text-subtle sm:block">{copy.hint}</p>
        )}
      </div>
    </form>
  );
}
