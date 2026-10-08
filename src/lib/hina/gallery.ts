import type { Lang } from "./i18n";
import type { ChatAttachment } from "./types";

export type GalleryItem = {
  id: string;
  kind: "image" | "video";
  url: string;
  tags: string[];
  caption: Record<Lang, string>;
};

export const STILL_FILES = [
  { key: "garden", file: "garden.jpg" },
  { key: "cafe", file: "cafe.jpg" },
  { key: "library", file: "library.jpg" },
  { key: "city", file: "city.jpg" },
  { key: "beach", file: "beach.jpg" },
  { key: "home", file: "home.jpg" },
  { key: "hills", file: "hills.jpg" },
  { key: "office", file: "office.jpg" },
  { key: "portrait", file: "portrait.jpg" },
] as const;

export function pickHinaStill(prompt: string): { file: string; publicUrl: string } {
  const q = prompt.toLowerCase();
  const hit =
    STILL_FILES.find((s) => q.includes(s.key)) ??
    STILL_FILES.find((s) => s.file === "portrait.jpg")!;
  return { file: hit.file, publicUrl: `/gallery/${hit.file}` };
}

export const GALLERY: GalleryItem[] = [
  {
    id: "portrait",
    kind: "image",
    url: "/gallery/portrait.jpg",
    tags: ["portrait", "face", "photo", "تصویر"],
    caption: { en: "Portrait", ur: "پورٹریٹ", sd: "پورٽريٽ" },
  },
  {
    id: "garden",
    kind: "image",
    url: "/gallery/garden.jpg",
    tags: ["garden", "shalwar", "kameez", "باغ"],
    caption: { en: "Garden · shalwar kameez", ur: "باغ · شلوار قمیض", sd: "باغ · شلوار قميض" },
  },
  {
    id: "cafe",
    kind: "image",
    url: "/gallery/cafe.jpg",
    tags: ["cafe", "blazer", "کافی"],
    caption: { en: "Cafe · blazer", ur: "کیفے · بلیزر", sd: "ڪيفي · بليزر" },
  },
  {
    id: "library",
    kind: "image",
    url: "/gallery/library.jpg",
    tags: ["library", "kurta", "کتب"],
    caption: { en: "Library · kurta", ur: "لائبریری · کرتا", sd: "لائبريري · ڪرتا" },
  },
  {
    id: "city",
    kind: "image",
    url: "/gallery/city.jpg",
    tags: ["city", "coat", "evening", "شہر"],
    caption: { en: "Evening city · coat", ur: "شام کا شہر · کوٹ", sd: "شام جو شهر · ڪوٽ" },
  },
  {
    id: "beach",
    kind: "image",
    url: "/gallery/beach.jpg",
    tags: ["beach", "sea", "ساحل"],
    caption: { en: "Beach at golden hour", ur: "ساحل، سنہری روشنی", sd: "ساحل، سونهري روشني" },
  },
  {
    id: "home",
    kind: "image",
    url: "/gallery/home.jpg",
    tags: ["home", "window", "tea", "گھر"],
    caption: { en: "Home window · tea", ur: "گھر کی کھڑکی · چائے", sd: "گهر جي دري · چانهه" },
  },
  {
    id: "hills",
    kind: "image",
    url: "/gallery/hills.jpg",
    tags: ["hills", "mountain", "پہاڑ"],
    caption: { en: "Hills · sweater", ur: "پہاڑ · سویٹر", sd: "جبل · سويٽر" },
  },
  {
    id: "office",
    kind: "image",
    url: "/gallery/office.jpg",
    tags: ["office", "work", "دفتر"],
    caption: { en: "Office", ur: "دفتر", sd: "آفيس" },
  },
  {
    id: "garden-v",
    kind: "video",
    url: "/gallery/garden.mp4",
    tags: ["video", "garden", "ویڈیو", "وڊيو"],
    caption: { en: "Garden clip", ur: "باغ کی ویڈیو", sd: "باغ جي وڊيو" },
  },
  {
    id: "cafe-v",
    kind: "video",
    url: "/gallery/cafe.mp4",
    tags: ["video", "cafe", "ویڈیو"],
    caption: { en: "Cafe clip", ur: "کیفے کی ویڈیو", sd: "ڪيفي جي وڊيو" },
  },
  {
    id: "city-v",
    kind: "video",
    url: "/gallery/city.mp4",
    tags: ["video", "city", "ویڈیو"],
    caption: { en: "City evening clip", ur: "شہر کی شام", sd: "شهر جي شام" },
  },
];

export function isGalleryRequest(text: string) {
  const q = text.toLowerCase();
  return /show (me )?(your )?(photo|picture|pics|image|video|gallery|yourself)\b|pictures of you|videos of you|your photos|اپنی تصاویر|اپنی ویڈیو|پنهنجيون تصويرون|پنهنجي وڊيو/.test(
    q,
  );
}

export function pickGallery(text: string, lang: Lang): { caption: string; attachments: ChatAttachment[] } {
  const q = text.toLowerCase();
  const wantVideo = /video|clip|ویڈیو|وڊيو/.test(q);
  let items = GALLERY.filter((g) => (wantVideo ? g.kind === "video" : true));

  const place = GALLERY.find((g) => g.tags.some((t) => t.length > 3 && q.includes(t.toLowerCase())));
  if (place) {
    items = GALLERY.filter((g) => g.id === place.id || g.id === `${place.id}-v` || g.id.startsWith(place.id));
  } else if (!wantVideo) {
    items = GALLERY.filter((g) => g.kind === "image").slice(0, 6);
  }

  const attachments: ChatAttachment[] = items.map((g) => ({
    kind: g.kind,
    url: g.url,
    alt: g.caption[lang],
  }));

  const caption =
    lang === "ur"
      ? "یہ میری کچھ تصاویر اور کلپس ہیں۔ لباس اور جگہ بدل سکتی ہے — چہرہ وہی رہتا ہے۔"
      : lang === "sd"
        ? "هي منهنجون ڪجهه تصويرون ۽ ڪلپس آهن. ڪپڙا ۽ جاءِ مٽجي سگهن ٿا — چهرو ساڳيو."
        : "Here are some photos and clips of me — different clothes and places, same Hina.";

  return { caption, attachments };
}
