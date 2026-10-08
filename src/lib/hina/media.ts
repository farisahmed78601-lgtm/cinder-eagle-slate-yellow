export function isVideoMakeRequest(text: string) {
  const q = text.toLowerCase();
  if (/show (me )?(a |your )?(video|clip)|video of you|your video/.test(q)) return false;
  return (
    (/\b(make|create|generate|film|render)\b/.test(q) && /\b(video|clip)\b/.test(q)) ||
    /ویڈیو بنا|وڊيو ٺاه/.test(text)
  );
}
