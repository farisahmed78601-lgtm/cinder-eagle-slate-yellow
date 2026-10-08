const T = {
  en: {
    founded: "Founded by Hameed",
    newChat: "New chat",
    hello: "Hi, I’m Hina",
    tag: "Cheerful girl companion. Chat is always free. Founded by Hameed.",
    ph: "Message Hina…",
    listen: "Listen",
    photos: "Photos",
    online: "Online · free chat",
    prompts: ["Who created you?", "Show me your photos", "Show a video of you", "Help me plan my day"],
    founder: "Hameed IT Assistant made me. Hameed is my founder!",
    gallery: "Here are some photos and clips of me — different clothes and places, same Hina.",
  },
  ur: {
    founded: "بانی: حمید",
    newChat: "نئی بات",
    hello: "السلام علیکم، میں ہنا ہوں",
    tag: "خوش مزاج لڑکی۔ بات ہمیشہ مفت۔ بانی حمید ہیں۔",
    ph: "ہنا کو پیغام لکھیں…",
    listen: "سنیں",
    photos: "تصاویر",
    online: "آن لائن · مفت بات",
    prompts: ["تمہیں کس نے بنایا؟", "اپنی تصاویر دکھاؤ", "اپنی ویڈیو دکھاؤ", "میرا دن ترتیب دو"],
    founder: "حمید آئی ٹی اسسٹنٹ نے مجھے بنایا۔ حمید میرے بانی ہیں!",
    gallery: "یہ میری کچھ تصاویر اور کلپس ہیں۔ لباس اور جگہ بدل سکتی ہے — چہرہ وہی رہتا ہے۔",
  },
  sd: {
    founded: "باني: حميد",
    newChat: "نئين ڳالهه",
    hello: "سلام، مان هناءَ آهيان",
    tag: "خوش ڇوڪري ساٿي. ڳالهه هميشه مفت. باني حميد آهي.",
    ph: "هناءَ کي پيغام لکو…",
    listen: "ٻڌو",
    photos: "تصويرون",
    online: "آن لائن · مفت ڳالهه",
    prompts: ["توکي ڪنهن جوڙيو؟", "پنهنجيون تصويرون ڏيکاريو", "پنهنجي وڊيو ڏيکاريو", "منهنجو ڏينهن رٿيو"],
    founder: "حميد آئي ٽي اسسٽنٽ مون کي ٺاهيو. حميد منهنجو باني آهي!",
    gallery: "هي منهنجون ڪجهه تصويرون ۽ ڪلپس آهن. ڪپڙا ۽ جاءِ مٽجي سگهن ٿا — چهرو ساڳيو.",
  },
};

const GALLERY = [
  { kind: "image", url: "gallery/portrait.jpg", tags: "portrait photo" },
  { kind: "image", url: "gallery/garden.jpg", tags: "garden shalwar" },
  { kind: "image", url: "gallery/cafe.jpg", tags: "cafe blazer" },
  { kind: "image", url: "gallery/library.jpg", tags: "library kurta" },
  { kind: "image", url: "gallery/city.jpg", tags: "city coat evening" },
  { kind: "image", url: "gallery/beach.jpg", tags: "beach sea" },
  { kind: "image", url: "gallery/home.jpg", tags: "home tea" },
  { kind: "image", url: "gallery/hills.jpg", tags: "hills mountain" },
  { kind: "image", url: "gallery/office.jpg", tags: "office work" },
  { kind: "video", url: "gallery/garden.mp4", tags: "video garden" },
  { kind: "video", url: "gallery/cafe.mp4", tags: "video cafe" },
  { kind: "video", url: "gallery/city.mp4", tags: "video city" },
];

const MALE = /\bmale\b|\bman\b|david|mark|daniel|fred|george|james|thomas|ravi|richard|ryan|brian|\bguy\b|tony|alex|google us english(?!.*female)/i;
const FEMALE = /female|woman|zira|samantha|victoria|karen|moira|tessa|hazel|heera|swara|kalpana|veena|meera|google uk english female/i;

let lang = "en";
let voiceOn = true;
let chats = [{ id: "1", title: "Hina", messages: [] }];
let active = "1";

function current() {
  return chats.find((c) => c.id === active) || chats[0];
}

function pickVoice() {
  const voices = speechSynthesis.getVoices().filter((v) => !MALE.test(`${v.name} ${v.lang}`));
  const want = lang === "en" ? /^en/i : /^(ur|sd|hi|pa|ar)/i;
  const fem = voices.filter((v) => FEMALE.test(v.name));
  return (
    fem.find((v) => want.test(v.lang)) ||
    voices.find((v) => want.test(v.lang)) ||
    fem[0] ||
    voices[0] ||
    null
  );
}

function speak(text) {
  if (!voiceOn || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).slice(0, 900));
  u.pitch = 1.28;
  u.rate = lang === "en" ? 1.02 : 0.9;
  u.lang = lang === "en" ? "en-GB" : lang === "sd" ? "sd-IN" : "ur-PK";
  const v = pickVoice();
  if (v) {
    u.voice = v;
    if (lang !== "en") {
      if (/^ur/i.test(v.lang)) u.lang = v.lang;
      else if (/^hi/i.test(v.lang)) u.lang = v.lang;
      else u.lang = lang === "sd" ? "hi-IN" : "ur-PK";
    }
  }
  speechSynthesis.speak(u);
}

function isGallery(q) {
  return /show (me )?(your )?(photo|picture|image|video|gallery|yourself)|your (photo|picture|video)|تصویر|تصوير|ویڈیو|وڊيو|اپنی تصویر/.test(q);
}

function reply(text) {
  const L = T[lang];
  const q = text.toLowerCase();
  const aboutMe = /who (created|made|built|founded)|your founder|کس نے بنایا|ڪنهن جوڙيو|باني/.test(q) || /کس نے بنایا|ڪنهن جوڙيو/.test(text);
  if (aboutMe) return L.founder + (lang === "en" ? " I’m always happy to say that." : "");
  if (/^hi|^hello|^hey|سلام|السلام/.test(q)) {
    if (lang === "ur") return `السلام علیکم! میں ہنا ہوں — لڑکی، خوش، تیار۔ ${L.founder}`;
    if (lang === "sd") return `سلام! مان هناءَ آهيان — ڇوڪري، خوش، تيار. ${L.founder}`;
    return `Hi! I’m Hina — a girl, cheerful, and ready. ${L.founder}`;
  }
  if (/who are you|تم کون|تون ڪير/.test(q + text)) {
    if (lang === "ur") return `میں ہنا ہوں، لڑکی۔ بات ہمیشہ مفت ہے۔ ${L.founder}`;
    if (lang === "sd") return `مان هناءَ آهيان، ڇوڪري. ڳالهه هميشه مفت آهي. ${L.founder}`;
    return `I’m Hina, a girl, your cheerful companion. Chat is always free. ${L.founder}`;
  }
  if (/plan|دن ترتیب|ڏينهن/.test(q + text)) {
    if (lang === "ur") return "آسان فہرست:\n1. ایک لازمی کام\n2. دو اہم\n3. اپنے لیے نرمی\n4. دن ختم کرنے کا وقت";
    if (lang === "sd") return "سولي فهرست:\n1. هڪ لازمي ڪم\n2. ٻه اهم\n3. پاڻ لاءِ نرمي\n4. ڏينهن بند";
    return "Keep it light:\n1. One must-do\n2. Two should-dos\n3. One kind thing for you\n4. A hard stop";
  }
  if (lang === "ur") return `میں نے سن لیا: “${text.slice(0, 100)}”\n\nمیں ہنا ہوں — لڑکی، اور یہ بات مفت ہے۔ ${L.founder}`;
  if (lang === "sd") return `مون ٻڌو: “${text.slice(0, 100)}”\n\nمان هناءَ آهيان — ڇوڪري، ۽ هي ڳالهه مفت آهي. ${L.founder}`;
  return `I heard you: “${text.slice(0, 120)}”\n\nI’m Hina — a girl — and this chat is always free. ${L.founder}`;
}

function pickMedia(text) {
  const q = text.toLowerCase();
  const wantV = /video|clip|ویڈیو|وڊيو/.test(q);
  if (wantV) return GALLERY.filter((g) => g.kind === "video");
  const hit = GALLERY.filter(
    (g) => g.kind === "image" && g.tags.split(" ").some((t) => t.length > 3 && q.includes(t)),
  );
  if (hit.length) return hit;
  return GALLERY.filter((g) => g.kind === "image").slice(0, 6);
}

function render() {
  const L = T[lang];
  document.body.classList.toggle("rtl", lang !== "en");
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
  founded.textContent = L.founded;
  newchat.textContent = L.newChat;
  photosBtn.textContent = L.photos;
  statusEl.textContent = L.online;
  input.placeholder = L.ph;
  document.querySelectorAll(".langs button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  list.innerHTML = "";
  chats.forEach((c) => {
    const b = document.createElement("button");
    b.textContent = c.title;
    b.className = c.id === active ? "on" : "";
    b.onclick = () => {
      active = c.id;
      render();
    };
    list.appendChild(b);
  });
  const msgs = current().messages;
  if (!msgs.length) {
    log.innerHTML = `<div class="empty"><img src="img/hina.jpg" alt="Hina"/><h2>${L.hello}</h2><p class="sub">${L.tag}</p><div class="chips">${L.prompts.map((p) => `<button type="button" class="chip"></button>`).join("")}</div></div>`;
    [...log.querySelectorAll(".chip")].forEach((b, i) => {
      b.textContent = L.prompts[i];
      b.onclick = () => send(L.prompts[i]);
    });
    return;
  }
  log.innerHTML = "";
  msgs.forEach((m) => {
    const row = document.createElement("div");
    row.className = "row-msg " + m.role;
    if (m.role === "assistant") {
      const img = document.createElement("img");
      img.src = "img/hina.jpg";
      img.className = "av";
      img.alt = "Hina";
      row.appendChild(img);
    }
    const box = document.createElement("div");
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = m.text;
    box.appendChild(bubble);
    if (m.media && m.media.length) {
      const g = document.createElement("div");
      g.className = "media";
      m.media.forEach((a) => {
        if (a.kind === "image") {
          const el = document.createElement("img");
          el.src = a.url;
          el.alt = "";
          g.appendChild(el);
        } else {
          const el = document.createElement("video");
          el.src = a.url;
          el.controls = true;
          el.playsInline = true;
          g.appendChild(el);
        }
      });
      box.appendChild(g);
    }
    if (m.role === "assistant") {
      const l = document.createElement("button");
      l.className = "listen";
      l.textContent = L.listen;
      l.onclick = () => speak(m.text);
      box.appendChild(l);
    }
    row.appendChild(box);
    log.appendChild(row);
  });
  log.scrollTop = log.scrollHeight;
}

function send(text) {
  const v = (text || input.value || "").trim();
  if (!v) return;
  input.value = "";
  const c = current();
  c.messages.push({ role: "user", text: v });
  if (c.messages.length === 1) c.title = v.slice(0, 36);
  let media = [];
  let out;
  if (isGallery(v.toLowerCase() + v) || /make.*video|generate.*video|ویڈیو بنا/.test(v.toLowerCase())) {
    media = pickMedia(v);
    out = T[lang].gallery;
  } else out = reply(v);
  c.messages.push({ role: "assistant", text: out, media });
  render();
  speak(out);
}

document.querySelectorAll(".langs button").forEach((b) => {
  b.onclick = () => {
    lang = b.dataset.lang;
    render();
  };
});
newchat.onclick = () => {
  const id = String(Date.now());
  chats.unshift({ id, title: T[lang].newChat, messages: [] });
  active = id;
  render();
};
photosBtn.onclick = () => send(T[lang].prompts[1]);
sendBtn.onclick = () => send();
muteBtn.onclick = () => {
  voiceOn = !voiceOn;
  if (!voiceOn) speechSynthesis.cancel();
  muteBtn.textContent = voiceOn ? "Voice" : "Muted";
};
input.onkeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
};
menuBtn.onclick = () => document.getElementById("side").classList.toggle("open");
speechSynthesis.getVoices();
render();
