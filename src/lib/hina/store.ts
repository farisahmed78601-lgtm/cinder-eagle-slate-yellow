import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, Conversation } from "./types";
import type { Lang } from "./i18n";
import { t } from "./i18n";

function uid() {
  return crypto.randomUUID();
}

function titleFrom(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
}

type Theme = "dark" | "light";

type ChatState = {
  conversations: Conversation[];
  activeId: string | null;
  theme: Theme;
  sending: boolean;
  voiceOn: boolean;
  lang: Lang;
  newChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  addUserMessage: (content: string) => { conversationId: string; messages: ChatMessage[] };
  addAssistantMessage: (conversationId: string, content: string, attachments?: ChatMessage["attachments"]) => void;
  setSending: (v: boolean) => void;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  toggleVoice: () => void;
  setVoiceOn: (v: boolean) => void;
  setLang: (lang: Lang) => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,
      theme: "dark",
      sending: false,
      voiceOn: true,
      lang: "en",

      newChat: () => {
        const lang = get().lang;
        const convo: Conversation = {
          id: uid(),
          title: t[lang].newChat,
          updatedAt: Date.now(),
          messages: [],
        };
        set((s) => ({
          conversations: [convo, ...s.conversations],
          activeId: convo.id,
        }));
      },

      selectChat: (id) => set({ activeId: id }),

      deleteChat: (id) =>
        set((s) => {
          const next = s.conversations.filter((c) => c.id !== id);
          const activeId = s.activeId === id ? (next[0]?.id ?? null) : s.activeId;
          return { conversations: next, activeId };
        }),

      addUserMessage: (content) => {
        let { conversations, activeId } = get();
        if (!activeId || !conversations.some((c) => c.id === activeId)) {
          const convo: Conversation = {
            id: uid(),
            title: titleFrom(content),
            updatedAt: Date.now(),
            messages: [],
          };
          conversations = [convo, ...conversations];
          activeId = convo.id;
        }
        const msg: ChatMessage = {
          id: uid(),
          role: "user",
          content,
          createdAt: Date.now(),
        };
        const next = conversations.map((c) =>
          c.id === activeId
            ? {
                ...c,
                title: c.messages.length === 0 ? titleFrom(content) : c.title,
                updatedAt: Date.now(),
                messages: [...c.messages, msg],
              }
            : c,
        );
        set({ conversations: next, activeId });
        const convo = next.find((c) => c.id === activeId)!;
        return { conversationId: convo.id, messages: convo.messages };
      },

      addAssistantMessage: (conversationId, content, attachments) => {
        const msg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content,
          createdAt: Date.now(),
          attachments,
        };
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, updatedAt: Date.now(), messages: [...c.messages, msg] }
              : c,
          ),
        }));
      },

      setSending: (v) => set({ sending: v }),
      toggleTheme: () =>
        set((s) => {
          const theme = s.theme === "dark" ? "light" : "dark";
          document.documentElement.dataset.theme = theme;
          return { theme };
        }),
      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.dataset.theme = theme;
        }
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
      },
    }),
    {
      name: "hina-chats",
      skipHydration: true,
      partialize: (s) => ({
        conversations: s.conversations,
        activeId: s.activeId,
        theme: s.theme,
        voiceOn: s.voiceOn,
        lang: s.lang,
      }),
    },
  ),
);
