import type { Lang } from "./i18n";
import { loadLive } from "./live";

function tr(lang: Lang, en: string, ur: string, sd: string) {
  if (lang === "ur") return ur;
  if (lang === "sd") return sd;
  return en;
}

function safeMath(raw: string): string | null {
  const cleaned = raw
    .toLowerCase()
    .replace(/what is|calculate|equals|compute|کا حاصل|حساب|ڪل/g, "")
    .replace(/[^0-9+\-*/().%\s]/g, "")
    .trim();
  if (!cleaned || !/[0-9]/.test(cleaned) || !/[+\-*/%]/.test(cleaned)) return null;
  if (!/^[\d+\-*/().%\s]+$/.test(cleaned)) return null;
  try {
    const val = Function(`"use strict"; return (${cleaned})`)();
    if (typeof val !== "number" || !Number.isFinite(val)) return null;
    return String(val);
  } catch {
    return null;
  }
}

const BUILT_IN: { test: RegExp; en: string; ur: string; sd: string }[] = [
  {
    test: /heart|دل|دلڙو/,
    en: "The heart is a muscle that pumps blood through the body. A resting adult heart beats about 60–100 times a minute. It has four chambers: two atria and two ventricles.",
    ur: "دل ایک پٹھا ہے جو خون پورے جسم میں پمپ کرتا ہے۔ آرام کے وقت بڑی عمر میں دھڑکن تقریباً ساٹھ سے سو بار فی منٹ ہوتی ہے۔ دل کے چار خانے ہوتے ہیں۔",
    sd: "دل هڪ عضوي آهي جيڪو رت سڄي جسم ۾ موڪلي ٿو. آرام وقت ڌڙڪن لڳ ڀڳ سٺ کان سو ڀيرا منٽ ۾. دل جا چار خانا آهن.",
  },
  {
    test: /photosynthesis|فوٹو|روشني ٺاه|روشنی/,
    en: "Photosynthesis is how green plants make food. They use sunlight, water, and carbon dioxide, and they release oxygen. The green pigment chlorophyll catches the light.",
    ur: "ضیائی تالیف وہ عمل ہے جس میں سبز پودے خوراک بناتے ہیں۔ وہ سورج کی روشنی، پانی اور کاربن ڈائی آکسائیڈ استعمال کرتے ہیں اور آکسیجن چھوڑتے ہیں۔",
    sd: "ٻوٽا سج جي روشني، پاڻي ۽ ڪاربان ڊاءِ آڪسائيڊ سان کاڌو ٺاهين ٿا ۽ آڪسيجن ڇڏين ٿا. هي عمل فوتوسنٿيسس آهي.",
  },
  {
    test: /planet|solar system|سیار|گرہ|نظام شمسی/,
    en: "The solar system has the Sun and eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the third planet and the one we live on.",
    ur: "نظامِ شمسی میں سورج اور آٹھ سیارے ہیں: عطارد، زہرہ، زمین، مریخ، مشتری، زحل، یورینس اور نیپچون۔ زمین تیسرا سیارہ ہے اور ہم اسی پر رہتے ہیں۔",
    sd: "نظام شمسي ۾ سج ۽ اٺ گرھ آهن: عطارد، زهره، زمين، مريخ، مشتري، زحل، يورينس ۽ نيپچون. زمين ٽيون گرھ آهي.",
  },
  {
    test: /electric|بجلی|بجلي/,
    en: "Electricity is the flow of electric charge, usually electrons, through a wire. A circuit needs a source (battery or mains), a path, and a load such as a bulb. Never touch bare live wires.",
    ur: "بجلی برقی چارج کا بہاؤ ہے، عام طور پر تار میں الیکٹران۔ سرکٹ میں ذریعہ، راستہ اور بوجھ چاہیے، جیسے بلب۔ کھلی تار ہاتھ نہ لگائیں۔",
    sd: "بجلي چارج جو وهڪرو آهي، اڪثر تار ۾ اليڪٽران. سرڪٽ ۾ ذريعو، رستو ۽ لوڊ گهرجي. کليل تار هٿ نه لڳايو.",
  },
  {
    test: /karachi|کراچی|ڪراچي/,
    en: "Karachi is the largest city of Pakistan and the capital of Sindh. It is a major port on the Arabian Sea.",
    ur: "کراچی پاکستان کا سب سے بڑا شہر اور سندھ کا دارالحکومت ہے۔ یہ بحیرہ عرب پر ایک بڑی بندرگاہ ہے۔",
    sd: "ڪراچي پاڪستان جو سڀ کان وڏو شهر ۽ سنڌ جي گادي آهي. هي عربي سمنڊ تي وڏي بندرگاهه آهي.",
  },
  {
    test: /indus|سندھ دریا|سنڌو|دریائے سندھ/,
    en: "The Indus River is the main river of Pakistan. It starts in the mountains and flows through Punjab and Sindh to the Arabian Sea. Ancient Indus Valley cities grew along it.",
    ur: "دریائے سندھ پاکستان کا بڑا دریا ہے۔ یہ پہاڑوں سے نکل کر پنجاب اور سندھ سے ہوتا ہوا بحیرہ عرب میں گرتا ہے۔ پرانی وادیٔ سندھ کی بستیاں اسی کنارے آباد ہوئیں۔",
    sd: "سنڌو درياءُ پاڪستان جو مکيه درياءُ آهي. جبلن کان پنجاب ۽ سنڌ مان وهندو عربي سمنڊ ۾ پوي ٿو.",
  },
  {
    test: /study|exam|پڑھائی|امتحان|پڙهائي|امتحان/,
    en: "A study plan that works: 25 minutes focused work, 5 minutes break. One subject at a time. Rewrite notes in your own words. Sleep before the exam — memory sticks better after rest.",
    ur: "پڑھائی کا طریقہ: پچیس منٹ پوری توجہ، پانچ منٹ وقفہ۔ ایک مضمون ایک وقت میں۔ نوٹس اپنے الفاظ میں لکھیں۔ امتحان سے پہلے نیند لیں، یادداشت بہتر رہتی ہے۔",
    sd: "پڙهڻ جو طريقو: پنجويهه منٽ ڌيان، پنج منٽ آرام. هڪ مضمون هڪ وقت. نوٽس پنهنجن لفظن ۾ لکو. امتحان کان اڳ ننڊ ڪريو.",
  },
  {
    test: /sleep|نیند|ننڊ/,
    en: "Most adults need about 7–9 hours of sleep. A regular bedtime, a dark room, and no bright screen in the last hour help. Poor sleep hurts memory, mood, and health.",
    ur: "زیادہ بڑوں کو تقریباً سات سے نو گھنٹے نیند چاہیے۔ مقرر وقت، اندھیرا کمرہ، اور آخری گھنٹے میں تیز اسکرین نہ ہو۔ کم نیند یادداشت اور صحت دونوں کو نقصان دیتی ہے۔",
    sd: "گهڻن وڏن کي ست کان نو ڪلاڪ ننڊ گهرجي. مقرر وقت، اونداهو ڪمرو، ۽ آخري ڪلاڪ ۾ اسڪرين نه. گهٽ ننڊ يادگيري ۽ صحت کي نقصان ڏئي ٿي.",
  },
  {
    test: /password|پاس ورڈ|پاسورڊ/,
    en: "A strong password is long, unique, and not your name or birthday. Use a different password for email and banking. Do not share it, and turn on two-step login when you can.",
    ur: "مضبوط پاس ورڈ لمبا ہو، الگ ہو، اور نام یا سالگرہ نہ ہو۔ ای میل اور بینک کے لیے الگ پاس ورڈ رکھیں۔ اسے کسی کو نہ بتائیں، اور دو مرحلہ لاگ اِن چالو کریں۔",
    sd: "مضبوط پاسورڊ ڊگهو ۽ الڳ هجي، نالو يا سالگره نه. ايميل ۽ بئنڪ لاءِ الڳ پاسورڊ. ڪنهن کي نه ٻڌايو.",
  },
  {
    test: /html|ایچ ٹی ایم ایل/,
    en: "HTML is the language of a web page. A tiny page is: <!DOCTYPE html><html><body><h1>Hello</h1><p>This is a paragraph.</p></body></html>. CSS changes the look. JavaScript adds behavior.",
    ur: "ایچ ٹی ایم ایل ویب صفحے کی زبان ہے۔ ایک چھوٹا صفحہ: عنوان h1 اور پیراگراف p کے ٹیگ سے بنتا ہے۔ سی ایس ایس شکل بدلتا ہے اور جاوا اسکرپٹ کام شامل کرتی ہے۔",
    sd: "ايڇ ٽي ايم ايل ويب صفحي جي ٻولي آهي. h1 عنوان ۽ p پيراگراف. سي ايس ايس شڪل بدلائي ٿو ۽ جاوا اسڪرپٽ ڪم وجهي ٿي.",
  },
  {
    test: /python|پائتھن|پائيٿن/,
    en: "Python is a programming language that reads almost like English. A first program: print(\"Hello\"). Indentation matters. Use it for scripts, data, and simple web tools.",
    ur: "پائتھن ایسی زبان ہے جو انگریزی جیسی پڑھی جاتی ہے۔ پہلا پروگرام: print(\"Hello\")۔ انڈینٹ ضروری ہے۔ اسکرپٹ، ڈیٹا اور چھوٹے ٹولز کے لیے استعمال ہوتی ہے۔",
    sd: "پائيٿن اهڙي ٻولي آهي جيڪا انگريزيءَ جيان پڙهجي. پهريون پروگرام print(\"Hello\"). انڊينٽ ضروري آهي.",
  },
  {
    test: /water cycle|پانی کا چکر|پاڻي جو چڪر|بارش کیسے/,
    en: "The water cycle: the sun evaporates water, vapor cools into clouds, then rain or snow falls, and rivers carry it back to the sea. Then it starts again.",
    ur: "پانی کا چکر: دھوپ پانی کو بھاپ بناتی ہے، بھاپ ٹھنڈی ہو کر بادل بنتی ہے، پھر بارش یا برف گرتی ہے، اور دریا پانی سمندر تک لے جاتے ہیں۔ پھر یہی سلسلہ دوبارہ چلتا ہے۔",
    sd: "پاڻي جو چڪر: سج پاڻي کي ڀاڦ بڻائي ٿو، ڀاڦ ڪڪر ٿئي ٿي، پوءِ مينهن يا برف پوي ٿي، ۽ درياهه پاڻي سمنڊ ڏانهن وٺي وڃن ٿا.",
  },
  {
    test: /gravity|کشش|ڪشش/,
    en: "Gravity is the pull between masses. Earth’s gravity keeps us on the ground and holds the Moon in orbit. Heavier planets pull more strongly.",
    ur: "کشش ثقل کمیتوں کے درمیان کھینچاؤ ہے۔ زمین کی کشش ہمیں زمین پر رکھتی ہے اور چاند کو مدار میں۔ بھاری سیارے زیادہ زور سے کھینچتے ہیں۔",
    sd: "ڪشش ماس جي وچ ۾ ڇڪ آهي. زمين جي ڪشش اسان کي زمين تي رکي ٿي ۽ چنڊ کي مدار ۾.",
  },
  {
    test: /urdu language|اردو زبان|اردو کیا|اردو ڇا/,
    en: "Urdu is a national language of Pakistan. It is written right to left in the Nastaliq style of the Arabic script, and it shares a lot of everyday vocabulary with Hindi.",
    ur: "اردو پاکستان کی قومی زبان ہے۔ یہ دائیں سے بائیں نستعلیق رسم الخط میں لکھی جاتی ہے، اور روزمرہ کے بہت سے الفاظ ہندی سے ملتے ہیں۔",
    sd: "اردو پاڪستان جي قومي ٻولي آهي. ساڄي کان کاٻي نستعليق ۾ لکجي ٿي.",
  },
  {
    test: /sindhi language|سندھی زبان|سنڌي ٻولي|سنڌي ڇا/,
    en: "Sindhi is the language of Sindh. It is written in a Perso-Arabic script with extra letters for Sindhi sounds, and also sometimes in Devanagari.",
    ur: "سندھی سندھ کی زبان ہے۔ یہ عربی فارسی رسم الخط میں لکھی جاتی ہے، اور سندھی آوازوں کے لیے اضافی حروف ہیں۔",
    sd: "سنڌي سنڌ جي ٻولي آهي. عربي فارسي رسم الخط ۾ لکجي ٿي، ۽ سنڌي آوازن لاءِ وڌيڪ اکر آهن.",
  },
];

function customFact(q: string, lang: Lang): string | null {
  const facts = loadLive().facts ?? [];
  for (const fact of facts) {
    const keys = fact.keys
      .split(/[,،]/)
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 1);
    if (!keys.some((k) => q.includes(k))) continue;
    if (lang === "ur") return fact.ur || fact.en;
    if (lang === "sd") return fact.sd || fact.en;
    return fact.en;
  }
  return null;
}

function builtIn(q: string, raw: string, lang: Lang): string | null {
  const blob = `${q} ${raw}`;
  const hit = BUILT_IN.find((item) => item.test.test(blob));
  if (!hit) return null;
  return tr(lang, hit.en, hit.ur, hit.sd);
}
export function knowledgeReply(userText: string, lang: Lang): string {
  const q = userText.toLowerCase().replace(/\s+/g, " ").trim();

  const math = safeMath(userText);
  if (math !== null) {
    return tr(lang, `That’s ${math}.`, `جواب: ${math}`, `جواب: ${math}`);
  }

  const extra = customFact(q, lang);
  if (extra) return extra;

  const known = builtIn(q, userText, lang);
  if (known) return known;

  if (/^(hi|hello|hey|yo|salam|salaam|سلام|السلام)/.test(q) || q.includes("how are you")) {
    return tr(
      lang,
      "Hi! I’m Hina. What would you like help with?",
      "السلام علیکم! میں ہنا ہوں۔ کس بات میں مدد کروں؟",
      "سلام! مان هناءَ آهيان. ڪهڙي مدد گهرجي؟",
    );
  }

  if (/\b(who are you|what are you|your name)\b/.test(q) || /تم کون ہو|تون ڪير آهين|آپ کون ہیں/.test(userText)) {
    return tr(
      lang,
      "I’m Hina, a cheerful assistant. I answer questions, write, plan, explain, and help with pictures or clips.",
      "میں ہنا ہوں — خوش مزاج معاون۔ سوال، لکھائی، منصوبہ، وضاحت اور تصاویر میں مدد کرتی ہوں۔",
      "مان هناءَ آهيان — خوش معاون. سوال، لکڻ، رٿا ۽ تصويرن ۾ مدد ڪريان ٿي.",
    );
  }

  if (/\b(time|date|today)\b/.test(q) && q.length < 48) {
    const stamp = new Date().toLocaleString(lang === "en" ? "en-GB" : "ur-PK", { dateStyle: "full", timeStyle: "short" });
    return tr(lang, `Right now it’s ${stamp}.`, `ابھی: ${stamp}`, `هن وقت: ${stamp}`);
  }

  if (/\b(pakistan|pakistani|پاکستان|پاڪستان)\b/.test(q)) {
    return tr(
      lang,
      "Pakistan is in South Asia. Capital: Islamabad. Largest city: Karachi. Independence: 14 August 1947. Official language: Urdu; English is widely used. Provinces include Punjab, Sindh, Khyber Pakhtunkhwa, and Balochistan.",
      "پاکستان جنوبی ایشیا میں ہے۔ دارالحکومت اسلام آباد، سب سے بڑا شہر کراچی۔ آزادی 14 اگست 1947۔ قومی زبان اردو۔ صوبے: پنجاب، سندھ، خیبر پختونخوا، بلوچستان۔",
      "پاڪستان ڏکڻ ايشيا ۾ آهي. گادي اسلام آباد، وڏو شهر ڪراچي. آزادي 14 آگسٽ 1947. صوبا: پنجاب، سنڌ، خيبر پختونخوا، بلوچستان.",
    );
  }

  if (/\b(sindh|sindhi|سندھ|سنڌ)\b/.test(q)) {
    return tr(
      lang,
      "Sindh is a province of Pakistan. Capital: Karachi. Historic cities include Hyderabad and Thatta. Sindhi is the regional language. The Indus River runs through it.",
      "سندھ پاکستان کا صوبہ ہے۔ دارالحکومت کراچی۔ حیدرآباد اور ٹھٹہ تاریخی شہر ہیں۔ سندھی علاقائی زبان ہے۔ دریائے سندھ اس سے گزرتا ہے۔",
      "سنڌ پاڪستان جو صوبو آهي. گادي ڪراچي. حيدرآباد ۽ ٺٽو تاريخي شهر آهن. سنڌي ٻولي. درياءُ سنڌ مان وهندو آهي.",
    );
  }

  if (/\b(islam|muslim|قرآن|نماز|ramadan|نماز)\b/.test(q)) {
    return tr(
      lang,
      "Islam is a monotheistic faith. Core practices include five daily prayers, fasting in Ramadan, zakat, and hajj for those who are able. The Qur’an is the holy book.",
      "اسلام توحید کا دین ہے۔ پانچ نمازیں، رمضان کے روزے، زکوٰۃ، اور استطاعت ہو تو حج۔ قرآن مقدس کتاب ہے۔",
      "اسلام توحيد جو دين آهي. پنج نمازون، رمضان جا روزا، زڪوات، ۽ حج. قرآن پاڪ ڪتاب آهي.",
    );
  }

  if (/\b(computer|internet|ai|artificial intelligence|کمپیوٹر|انٹرنیٹ)\b/.test(q)) {
    return tr(
      lang,
      "A computer follows programs to store and process data. The internet connects computers so they can share information. AI is software that finds patterns and can write, translate, or explain from examples.",
      "کمپیوٹر پروگرام سے ڈیٹا سنبھالتا ہے۔ انٹرنیٹ کمپیوٹرز کو جوڑتا ہے۔ مصنوعی ذہانت ایسا سافٹ ویئر ہے جو مثالوں سے پیٹرن دیکھ کر لکھ، ترجمہ یا وضاحت کر سکتا ہے۔",
      "ڪمپيوٽر پروگرام سان ڊيٽا سنڀاليندو آهي. انٽرنيٽ ڪمپيوٽرن کي جوڙيندو آهي. مصنوعي ذهانت نمونن مان لکي ۽ سمجهائي سگهي ٿي.",
    );
  }

  if (/plan (my |the )?day|دن ترتیب|ڏينهن رٿ/.test(q)) {
    return tr(
      lang,
      "A simple day: 1) one must-do, 2) two important tasks, 3) one kind thing for yourself, 4) a stop time. Tell me your list and I’ll order it.",
      "سادہ دن: 1) ایک لازمی کام 2) دو اہم کام 3) اپنے لیے ایک نرمی 4) بند وقت۔ کام بتائیں، میں ترتیب دے دوں گی۔",
      "سولو ڏينهن: 1) لازمي ڪم 2) ٻه اهم ڪم 3) پاڻ لاءِ نرمي 4) بند وقت.",
    );
  }

  if (/write |email|letter|پیغام لکھ|پيغام لکو/.test(q)) {
    return tr(
      lang,
      `Draft you can send:\n\nHello — I hope you’re well. I’m writing about this: ${userText.slice(0, 90)}. Happy to talk more when it suits you.`,
      `یہ مسودہ بھیج سکتے ہیں:\n\nالسلام علیکم — امید ہے آپ خیریت سے ہوں گے۔ بات یہ ہے: ${userText.slice(0, 90)}۔ جب مناسب ہو، مزید بات کر لیں گے۔`,
      `هي مسودو موڪلي سگهو ٿا:\n\nسلام — اميد ته خير آهي. ڳالهه: ${userText.slice(0, 90)}.`,
    );
  }

  if (/explain|what is|define|کیوں|ڇو|سمجھا|سمجها|کیا ہے|ڇا آهي/.test(q)) {
    const topic = userText.replace(/explain|what is|define|simply|کیوں|ڇو|سمجھاؤ|سمجهايو|کیا ہے|ڇا آهي/gi, "").trim() || userText;
    return tr(
      lang,
      `${topic}: say what it is in one line, why people use it, and one small example. If you name the exact word, I’ll go deeper.`,
      `${topic}: ایک لائن میں یہ کیا ہے، لوگ اسے کیوں استعمال کرتے ہیں، اور ایک چھوٹی مثال۔ عین لفظ بتائیں تو میں مزید کھولوں گی۔`,
      `${topic}: هڪ سٽ ۾ ڇا آهي، ماڻهو ڇو استعمال ڪن ٿا، ۽ هڪ ننڍي مثال.`,
    );
  }

  return tr(
    lang,
    `On “${userText.slice(0, 160)}”: name the goal, what you already know, and the next step. Add a few details and I’ll answer more tightly.`,
    `“${userText.slice(0, 160)}” پر: ہدف بتائیں، جو پہلے سے معلوم ہے، اور اگلا قدم۔ تھوڑی تفصیل دیں تو جواب مزید سیدھا ہو گا۔`,
    `“${userText.slice(0, 160)}” تي: مقصد ٻڌايو، جيڪو اڳ ۾ ڄاڻو ٿا، ۽ ايندڙ قدم.`,
  );
}
