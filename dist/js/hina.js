const T = {
  en: {
    founded: "Founded by Hameed",
    newChat: "New chat",
    hello: "Hi, I’m Hina",
    tag: "A girl companion. Chat is always free and works offline. Founded by Hameed.",
    ph: "Message Hina…",
    photos: "Photos",
    videos: "Videos",
    listen: "Listen",
    prompts: ["Who created you?", "Show me your photos", "Show a video of you", "Help me plan my day"],
    founder: "Hameed IT Assistant made me. Hameed is my founder!",
    media: "Here are my photos and clips — different clothes and places. I’m a girl, and this chat is free.",
  },
  ur: {
    founded: "بانی: حمید",
    newChat: "نئی بات",
    hello: "السلام علیکم، میں ہنا ہوں",
    tag: "لڑکی ساتھی۔ بات ہمیشہ مفت، آف لائن بھی۔ بانی حمید ہیں۔",
    ph: "ہنا کو پیغام لکھیں…",
    photos: "تصاویر",
    videos: "ویڈیو",
    listen: "سنیں",
    prompts: ["تمہیں کس نے بنایا؟", "اپنی تصاویر دکھاؤ", "اپنی ویڈیو دکھاؤ", "میرا دن ترتیب دو"],
    founder: "حمید آئی ٹی اسسٹنٹ نے مجھے بنایا۔ حمید میرے بانی ہیں!",
    media: "یہ میری تصاویر اور کلپس ہیں۔ میں لڑکی ہوں، بات مفت ہے۔",
  },
  sd: {
    founded: "باني: حميد",
    newChat: "نئين ڳالهه",
    hello: "سلام، مان هناءَ آهيان",
    tag: "ڇوڪري ساٿي. ڳالهه هميشه مفت، آف لائن به. باني حميد آهي.",
    ph: "هناءَ کي پيغام لکو…",
    photos: "تصويرون",
    videos: "وڊيو",
    listen: "ٻڌو",
    prompts: ["توکي ڪنهن جوڙيو؟", "پنهنجيون تصويرون ڏيکاريو", "پنهنجي وڊيو ڏيکاريو", "منهنجو ڏينهن رٿيو"],
    founder: "حميد آئي ٽي اسسٽنٽ مون کي ٺاهيو. حميد منهنجو باني آهي!",
    media: "هي منهنجون تصويرون ۽ ڪلپس آهن. مان ڇوڪري آهيان، ڳالهه مفت آهي.",
  },
};

const GALLERY = [
  { kind: "image", url: "gallery/portrait.jpg", tags: "portrait photo تصویر" },
  { kind: "image", url: "gallery/garden.jpg", tags: "garden shalwar باغ" },
  { kind: "image", url: "gallery/cafe.jpg", tags: "cafe blazer کافی" },
  { kind: "image", url: "gallery/library.jpg", tags: "library kurta" },
  { kind: "image", url: "gallery/city.jpg", tags: "city evening coat شہر" },
  { kind: "image", url: "gallery/beach.jpg", tags: "beach sea ساحل" },
  { kind: "image", url: "gallery/home.jpg", tags: "home window tea گھر" },
  { kind: "image", url: "gallery/hills.jpg", tags: "hills mountain" },
  { kind: "image", url: "gallery/office.jpg", tags: "office work دفتر" },
  { kind: "video", url: "gallery/garden.mp4", tags: "video garden ویڈیو" },
  { kind: "video", url: "gallery/cafe.mp4", tags: "video cafe" },
  { kind: "video", url: "gallery/city.mp4", tags: "video city" },
];

const MALE =
  /male|\bman\b|david|mark|daniel|fred|george|james|thomas|ravi|richard|ryan|brian|\bguy\b|tony|hemant|rishi|google us english|english united states|microsoft david|microsoft mark|microsoft ravi|microsoft guy/i;
const FEMALE =
  /female|woman|zira|samantha|victoria|karen|moira|tessa|hazel|susan|heera|swara|kalpana|veena|nishi|meera|uk english female|microsoft zira|microsoft heera|google हिन्दी|google हिंदी|hindi female/i;

let lang = localStorage.getItem("hina-lang") || "en";
let messages = [];
let voiceOn = true;

function blob(v) {
  return v.name + " " + v.voiceURI + " " + v.lang;
}
function isFemaleVoice(v) {
  return FEMALE.test(blob(v));
}
function isMaleVoice(v) {
  const b = blob(v);
  if (FEMALE.test(b)) return false;
  return MALE.test(b);
}
function langScore(v) {
  const n = blob(v).toLowerCase();
  const l = v.lang || "";
  if (lang === "en") {
    if (/uk english female|zira|samantha|hazel/.test(n)) return 40;
    if (/^en/i.test(l) && isFemaleVoice(v)) return 20;
    return 0;
  }
  if (/urdu|^ur/i.test(n + l)) return 100;
  if (/sindhi|^sd/i.test(n + l)) return lang === "sd" ? 110 : 50;
  if (/heera|swara|kalpana|veena|हिन्दी|हिंदी|hindi/.test(n) || /^hi/i.test(l)) return 85;
  if (/^pa/i.test(l)) return 40;
  return 0;
}
function pickVoice() {
  const all = speechSynthesis.getVoices().filter((v) => !isMaleVoice(v));
  const ranked = all
    .map((v) => ({ v, s: (isFemaleVoice(v) ? 200 : 0) + langScore(v) }))
    .sort((a, b) => b.s - a.s);
  return (ranked.find((x) => x.s > 0) || ranked[0] || {}).v || null;
}
function speakNow(text) {
  const v = pickVoice();
  if (!v) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).slice(0, 900));
  u.voice = v;
  u.pitch = 1.38;
  u.rate = lang === "en" ? 1 : 0.86;
  u.lang = lang === "en" ? ( /^en/i.test(v.lang) ? v.lang : "en-GB") : /^(ur|hi|sd)/i.test(v.lang) ? v.lang : lang === "ur" ? "ur-PK" : "hi-IN";
  speechSynthesis.speak(u);
  return true;
}
function speak(text) {
  if (!voiceOn || !window.speechSynthesis) return;
  if (speakNow(text)) return;
  speechSynthesis.addEventListener("voiceschanged", function once() {
    speechSynthesis.removeEventListener("voiceschanged", once);
    speakNow(text);
  });
  setTimeout(function () { speakNow(text); }, 500);
  setTimeout(function () { speakNow(text); }, 1400);
}

function reply(text) {
  const L = T[lang];
  const q = text.toLowerCase();
  if (/who created|founder|کس نے بنایا|ڪنهن جوڙيو|باني/.test(q) || /کس نے بنایا|ڪنهن جوڙيو/.test(text))
    return L.founder;
  if (/^hi|^hello|^hey|سلام|السلام/.test(q))
    return lang === "en"
      ? "Hi! I’m Hina — a girl, cheerful, and this chat is always free. " + L.founder
      : L.hello + " " + L.founder;
  if (/who are you|your name|تم کون|تون ڪير/.test(q) || /تم کون/.test(text))
    return lang === "en"
      ? "I’m Hina, a girl and your cheerful companion. Chat is free. " + L.founder
      : lang === "ur"
        ? "میں ہنا ہوں، لڑکی اور خوش مزاج ساتھی۔ بات مفت ہے۔ " + L.founder
        : "مان هناءَ آهيان، ڇوڪري ۽ خوش ساٿي. ڳالهه مفت آهي. " + L.founder;
  if (/plan|دن ترتیب|ڏينهن/.test(q))
    return lang === "en"
      ? "Keep today light:\n1. One must-do\n2. Two should-dos\n3. One kind thing for you\n4. A stop time"
      : lang === "ur"
        ? "آسان دن:\n1. ایک لازمی کام\n2. دو اہم کام\n3. اپنے لیے نرمی\n4. ختم کرنے کا وقت"
        : "سولو ڏينهن:\n1. هڪ لازمي ڪم\n2. ٻه اهم ڪم\n3. پاڻ لاءِ نرمي\n4. بند وقت";
  if (lang === "ur")
    return "میں نے سن لیا: “" + text.slice(0, 100) + "”\n\nمیں ہنا ہوں — لڑکی، خوش، بات ہمیشہ مفت۔ " + L.founder;
  if (lang === "sd")
    return "مون ٻڌو: “" + text.slice(0, 100) + "”\n\nمان هناءَ آهيان — ڇوڪري، خوش، ڳالهه هميشه مفت. " + L.founder;
  return "I heard you: “" + text.slice(0, 120) + "”\n\nI’m Hina — a girl, cheerful, and this chat is always free. " + L.founder;
}

function isMedia(text) {
  return /photo|picture|image|video|gallery|yourself|تصویر|تصوير|ویڈیو|وڊيو|اپنی تصویر/.test(text.toLowerCase() + text);
}
function pickMedia(text) {
  const q = text.toLowerCase();
  const wantV = /video|clip|ویڈیو|وڊيو/.test(q);
  let items = GALLERY.filter((g) => (wantV ? g.kind === "video" : g.kind === "image"));
  const hit = GALLERY.find((g) => g.tags.split(" ").some((t) => t.length > 3 && q.includes(t)));
  if (hit) items = GALLERY.filter((g) => g.url.indexOf(hit.url.replace(/\.\w+$/, "")) !== -1);
  if (!wantV) items = items.filter((g) => g.kind === "image").slice(0, 6);
  return items;
}

function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.firstElementChild;
}

function render() {
  const L = T[lang];
  document.body.classList.toggle("rtl", lang !== "en");
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
  localStorage.setItem("hina-lang", lang);
  founded.textContent = L.founded;
  newchat.textContent = L.newChat;
  input.placeholder = L.ph;
  photobtn.textContent = L.photos;
  videobtn.textContent = L.videos;
  if (!messages.length) {
    log.innerHTML = "";
    const box = el('<div class="empty"><img src="img/hina.jpg" alt="Hina"/><h2></h2><p class="sub"></p><div class="chips"></div></div>');
    box.querySelector("h2").textContent = L.hello;
    box.querySelector(".sub").textContent = L.tag;
    L.prompts.forEach((p) => {
      const b = document.createElement("button");
      b.textContent = p;
      b.onclick = function () { send(p); };
      box.querySelector(".chips").appendChild(b);
    });
    log.appendChild(box);
    return;
  }
  log.innerHTML = "";
  messages.forEach((m) => {
    const row = el('<div class="bubble"><div class="t"></div></div>');
    row.classList.add(m.role);
    if (m.role === "assistant") {
      const img = document.createElement("img");
      img.src = "img/hina.jpg";
      img.className = "av";
      img.alt = "Hina";
      row.prepend(img);
    }
    row.querySelector(".t").textContent = m.text;
    if (m.media && m.media.length) {
      const g = el('<div class="grid"></div>');
      m.media.forEach((a) => {
        if (a.kind === "image") {
          const i = document.createElement("img");
          i.src = a.url;
          i.alt = "Hina";
          g.appendChild(i);
        } else {
          const v = document.createElement("video");
          v.src = a.url;
          v.controls = true;
          v.playsInline = true;
          g.appendChild(v);
        }
      });
      row.querySelector(".t").appendChild(g);
    }
    if (m.role === "assistant") {
      const b = el('<button class="listen" type="button"></button>');
      b.textContent = L.listen;
      b.onclick = function () { speak(m.text); };
      row.querySelector(".t").appendChild(b);
    }
    log.appendChild(row);
  });
  log.scrollTop = log.scrollHeight;
}

function send(text) {
  const v = (text || input.value || "").trim();
  if (!v) return;
  input.value = "";
  messages.push({ role: "user", text: v });
  let media = [];
  let r;
  if (isMedia(v)) {
    media = pickMedia(v);
    r = T[lang].media;
  } else r = reply(v);
  messages.push({ role: "assistant", text: r, media: media });
  render();
  speak(r);
}

document.querySelectorAll(".langs button").forEach((b) => {
  b.onclick = function () {
    lang = b.getAttribute("data-lang");
    render();
  };
});
newchat.onclick = function () {
  messages = [];
  render();
};
photobtn.onclick = function () { send("Show me your photos"); };
videobtn.onclick = function () { send("Show a video of you"); };
imgbtn.onclick = function () { send(input.value.trim() || "Show me your photos"); };
clipbtn.onclick = function () { send(input.value.trim() || "Show a video of you"); };
sendbtn.onclick = function () { send(); };
mutebtn.onclick = function () {
  voiceOn = !voiceOn;
  if (!voiceOn) speechSynthesis.cancel();
  mutebtn.textContent = voiceOn ? "Voice" : "Muted";
};
input.onkeydown = function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
};
if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = function () { speechSynthesis.getVoices(); };
}
render();
