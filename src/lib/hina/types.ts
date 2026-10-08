export type ChatRole = "user" | "assistant";

export type ChatAttachment = {
  kind: "image" | "audio" | "video";
  url: string;
  alt?: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  attachments?: ChatAttachment[];
};

export type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};
