import { Image as ImageIcon, MessageSquarePlus, Settings2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { LANGS, t } from "@/lib/hina/i18n";
import { useChatStore } from "@/lib/hina/store";

export function Sidebar({
  open,
  onClose,
  onPhotos,
}: {
  open: boolean;
  onClose: () => void;
  onPhotos: () => void;
}) {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const lang = useChatStore((s) => s.lang);
  const selectChat = useChatStore((s) => s.selectChat);
  const newChat = useChatStore((s) => s.newChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const setLang = useChatStore((s) => s.setLang);
  const copy = t[lang];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-bg/70 md:hidden",
          open ? "block" : "hidden",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 z-40 flex w-[min(18.5rem,88vw)] flex-col border-border bg-surface md:static md:z-0 md:w-72",
          lang === "en" ? "left-0 border-r" : "right-0 border-l",
          open ? "translate-x-0" : lang === "en" ? "-translate-x-full md:translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-4 pt-5 pb-3">
          <p className="font-display text-lg tracking-tight text-fg">Hina</p>
          <button
            type="button"
            className="rounded-md p-2 text-muted md:hidden"
            onClick={onClose}
            aria-label={copy.close}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex gap-1 px-3 pb-3">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLang(l.id)}
              className={cn(
                "h-9 flex-1 rounded-md border text-xs font-medium",
                lang === l.id
                  ? "border-accent bg-elevated text-fg"
                  : "border-border text-muted hover:text-fg",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={() => {
              newChat();
              onClose();
            }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-fg text-sm font-medium text-bg"
          >
            <MessageSquarePlus className="size-4" />
            {copy.newChat}
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          {conversations.length === 0 ? (
            <p className="px-3 py-6 text-sm text-muted">{copy.noChats}</p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((c) => (
                <li key={c.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      selectChat(c.id);
                      onClose();
                    }}
                    className={cn(
                      "w-full rounded-md px-3 py-2.5 text-start text-sm",
                      lang === "en" ? "pr-10" : "pl-10",
                      c.id === activeId
                        ? "bg-elevated text-fg"
                        : "text-muted hover:bg-elevated/60 hover:text-fg",
                    )}
                  >
                    <span className="line-clamp-1">{c.title}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={copy.delete}
                    onClick={() => deleteChat(c.id)}
                    className={cn(
                      "absolute top-1/2 hidden -translate-y-1/2 rounded-sm p-1.5 text-subtle hover:text-danger group-hover:block",
                      lang === "en" ? "right-1.5" : "left-1.5",
                    )}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <button
            type="button"
            onClick={() => {
              onPhotos();
              onClose();
            }}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-sm text-fg hover:bg-elevated"
          >
            <ImageIcon className="size-4" />
            {copy.photos}
          </button>
          <a
            href="/admin"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md text-xs text-subtle hover:text-fg"
          >
            <Settings2 className="size-3.5" />
            {copy.admin}
          </a>
        </div>
      </aside>
    </>
  );
}
