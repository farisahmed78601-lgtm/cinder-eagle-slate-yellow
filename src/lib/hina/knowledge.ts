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
  {
    test: /hyderabad|حیدرآباد|حيدرآباد/,
    en: "Hyderabad is a historic city in Sindh, on the Indus. It was a capital of Sindh before Karachi grew. The old fort and the wind-catchers are part of the city.",
    ur: "حیدرآباد سندھ کا تاریخی شہر ہے، دریائے سندھ کے کنارے۔ کراچی بڑھنے سے پہلے یہ سندھ کا دارالحکومت رہا۔ پرانا قلعہ اور ہوا گیر شہر کی پہچان ہیں۔",
    sd: "حيدرآباد سنڌ جو تاريخي شهر آهي، سنڌو ڪناري. ڪراچي وڌڻ کان اڳ هي سنڌ جي گادي رهيو. پراڻو قلعو ۽ هوائگير شهر جي سڃاڻپ آهن.",
  },
  {
    test: /islamabad|اسلام آباد|اسلاماباد/,
    en: "Islamabad is the capital of Pakistan, in the north, next to the Margalla Hills. It became the capital in the 1960s. Government offices and the parliament are here.",
    ur: "اسلام آباد پاکستان کا دارالحکومت ہے، شمال میں مارگلہ پہاڑیوں کے پاس۔ یہ 1960 کی دہائی میں دارالحکومت بنا۔ حکومتی دفاتر اور پارلیمان یہاں ہیں۔",
    sd: "اسلام آباد پاڪستان جي گادي آهي، اتر ۾ مارگلا ٽڪرين ڀرسان. 1960 واري ڏهاڪي ۾ گادي بڻيو. سرڪاري دفتر ۽ پارليامينٽ هتي آهن.",
  },
  {
    test: /lahore|لاہور|لاهور/,
    en: "Lahore is the capital of Punjab and one of the oldest cities in the region. The Badshahi Mosque, Lahore Fort, and the old walled city are well known.",
    ur: "لاہور پنجاب کا دارالحکومت اور خطے کے قدیم شہروں میں سے ہے۔ بادشاہی مسجد، قلعہ لاہور اور پرانا شہر مشہور ہیں۔",
    sd: "لاهور پنجاب جي گادي ۽ پراڻن شهرن مان هڪ آهي. بادشاهي مسجد، قلعو ۽ پراڻو شهر مشهور آهن.",
  },
  {
    test: /mohenjo|موئن جو|موهن جو|harappa|ہڑپہ/,
    en: "Mohenjo-daro is an ancient city in Sindh, part of the Indus Valley civilisation, about 4,500 years old. Its streets were planned, and it had wells and a great bath.",
    ur: "موئن جو دڑو سندھ کا قدیم شہر ہے، وادیٔ سندھ کی تہذیب کا حصہ، تقریباً ساڑھے چار ہزار سال پرانا۔ سڑکیں منصوبے سے بنی تھیں، کنویں اور ایک بڑا غسل خانہ تھا۔",
    sd: "موهن جو دڙو سنڌ جو قديم شهر آهي، سنڌو تهذيب جو حصو، لڳ ڀڳ ساڍا چار هزار سال پراڻو. رستا رٿيل هئا، کوهه ۽ وڏو وهنجڻ جو هنڌ هو.",
  },
  {
    test: /latif|لطیف|لطيف|شاهه عبد/,
    en: "Shah Abdul Latif Bhittai was a Sindhi poet and mystic. His poetry is collected in the Shah Jo Risalo. People still sing his verses at his shrine in Bhit Shah.",
    ur: "شاہ عبداللطیف بھٹائی سندھی شاعر اور صوفی تھے۔ ان کی شاعری شاہ جو رسالو میں ہے۔ بھٹ شاہ کی درگاہ پر آج بھی ان کے بیت گائے جاتے ہیں۔",
    sd: "شاهه عبداللطيف ڀٽائي سنڌي شاعر ۽ صوفي هو. سندس شاعري شاهه جو رسالو ۾ آهي. ڀٽ شاهه تي اڄ به بيت ڳايا وڃن ٿا.",
  },
  {
    test: /cricket|کرکٹ|ڪرڪيٽ/,
    en: "Cricket is Pakistan’s most followed sport. A match has two teams, bats, a ball, and wickets. One side bats while the other bowls and fields. A Test can last five days; a T20 is much shorter.",
    ur: "کرکٹ پاکستان کا سب سے مقبول کھیل ہے۔ دو ٹیمیں، بلے، گیند اور وکٹیں۔ ایک طرف بیٹنگ کرتی ہے، دوسری گیند بازی اور فیلڈنگ۔ ٹیسٹ پانچ دن چل سکتا ہے، ٹی ٹوئنٹی چھوٹا ہوتا ہے۔",
    sd: "ڪرڪيٽ پاڪستان جو سڀ کان وڌيڪ ڏٺل راند آهي. ٻه ٽيمون، ڪاٺيون، بال ۽ وڪيٽون. هڪ پاسي بيٽنگ، ٻيو بالنگ. ٽيسٽ پنج ڏينهن، ٽي 20 ننڍو.",
  },
  {
    test: /tea|chai|چائے|چانهه|چانھ/,
    en: "A simple cup of tea: boil water, add tea leaves, a little milk if you like, and sugar to taste. Let it simmer a minute, then strain it.",
    ur: "سادہ چائے: پانی ابالیں، چائے کی پتی ڈالیں، چاہیں تو تھوڑا دودھ، اور حسبِ ذائقہ چینی۔ ایک منٹ پکنے دیں، پھر چھان لیں۔",
    sd: "سادي چانهه: پاڻي اٻاريو، چانهه وجهو، چاهيو ته ٿورو کير، ۽ کنڊ ذائقي مطابق. هڪ منٽ پچڻ ڏيو، پوءِ ڇاڻيو.",
  },
  {
    test: /fever|بخار|بخار/,
    en: "A fever means the body is warmer than usual, often while fighting an infection. Rest, drink water, and if it stays high, is with a rash, or the person is very weak, see a doctor. I am not a doctor.",
    ur: "بخار کا مطلب جسم معمول سے گرم ہے، اکثر انفیکشن سے لڑتے ہوئے۔ آرام کریں، پانی پیئیں، اور اگر بخار تیز رہے، دانے ہوں، یا کمزوری بہت ہو تو ڈاکٹر کو دکھائیں۔ میں ڈاکٹر نہیں ہوں۔",
    sd: "بخار جو مطلب جسم معمول کان وڌيڪ گرم آهي، اڪثر انفيڪشن سان. آرام ڪريو، پاڻي پيو، ۽ جي بخار تيز رهي يا ڪمزوري گهڻي هجي ته ڊاڪٽر وٽ وڃو. مان ڊاڪٽر نه آهيان.",
  },
  {
    test: /school|اسکول|سکول|اسڪول/,
    en: "School is where children learn reading, writing, numbers, and how to work with other people. A good day there is: listen, ask when you don’t understand, and finish one small piece of homework before play.",
    ur: "سکول وہ جگہ ہے جہاں بچے پڑھنا، لکھنا، اعداد اور مل جل کر کام کرنا سیکھتے ہیں۔ اچھا دن: غور سے سنیں، نہ سمجھ آئے تو پوچھیں، اور کھیل سے پہلے ایک چھوٹا کام ختم کر لیں۔",
    sd: "اسڪول اهو هنڌ آهي جتي ٻار پڙهڻ، لکڻ، انگ ۽ گڏجي ڪم ڪرڻ سکن ٿا. سٺو ڏينهن: ڌيان سان ٻڌو، نه سمجهه پوي ته پڇو، ۽ راند کان اڳ هڪ ننڍو ڪم پورو ڪريو.",
  },
  {
    test: /oxygen|آکسیجن|آڪسيجن/,
    en: "Oxygen is the gas in air that we need to breathe. It is about one fifth of the air. Plants release oxygen when they make food in sunlight.",
    ur: "آکسیجن وہ گیس ہے جو سانس کے لیے چاہیے۔ ہوا کا تقریباً پانچواں حصہ آکسیجن ہے۔ پودے دھوپ میں خوراک بناتے وقت آکسیجن چھوڑتے ہیں۔",
    sd: "آڪسيجن اها گئس آهي جيڪا ساهه لاءِ گهرجي. هوا جو لڳ ڀڳ پنجون حصو آڪسيجن آهي. ٻوٽا سج ۾ کاڌو ٺاهيندي آڪسيجن ڇڏين ٿا.",
  },
  {
    test: /moon|چاند|چنڊ/,
    en: "The Moon is Earth’s companion in space. It does not make its own light; we see sunlight bouncing off it. It takes about a month to go around Earth, which is why its shape in the sky changes.",
    ur: "چاند زمین کا ساتھی ہے۔ اس کی اپنی روشنی نہیں؛ ہم سورج کی روشنی دیکھتے ہیں جو اس سے ٹکرا کر آتی ہے۔ زمین کا چکر تقریباً ایک مہینے میں پورا ہوتا ہے، اس لیے اس کی شکل بدلتی رہتی ہے۔",
    sd: "چنڊ زمين جو ساٿي آهي. ان جي پنهنجي روشني نه آهي. اسان سج جي روشني ڏسون ٿا جيڪا ان تان اچي ٿي. زمين جو چڪر لڳ ڀڳ هڪ مهيني ۾، ان ڪري شڪل بدلجي ٿي.",
  },
  {
    test: /democracy|جمہوریت|جمہوريت|جمهوريت/,
    en: "Democracy means people choose their leaders by voting. Leaders are meant to follow laws, and people can disagree in public without being punished for the opinion itself.",
    ur: "جمہوریت کا مطلب ہے لوگ ووٹ سے اپنے لیڈر چنتے ہیں۔ لیڈر قانون کے پابند ہوتے ہیں، اور لوگ اپنی رائے کھل کر رکھ سکتے ہیں۔",
    sd: "جمهوريت جو مطلب آهي ماڻهو ووٽ سان اڳواڻ چونڊين. اڳواڻ قانون جا پابند هجن، ۽ ماڻهو پنهنجي راءِ کليل رکن.",
  },
  {
    test: /earthquake|زلزلہ|زلزلو|زلزل/,
    en: "An earthquake is a sudden shake of the ground when rock underground breaks and moves. If you feel one: drop, cover your head under a table, and hold on. Stay away from windows.",
    ur: "زلزلہ زمین کا اچانک ہلنا ہے جب نیچے چٹان ٹوٹ کر سرکتی ہے۔ محسوس ہو تو: جھکیں، میز کے نیچے سر ڈھانپیں، اور پکڑے رہیں۔ کھڑکیوں سے دور رہیں۔",
    sd: "زلزلو زمين جو اوچتو هلڻ آهي جڏهن هيٺ پٿر ٽٽي چري. محسوس ٿئي ته: جهڪو، ميز هيٺان مٿو ڍڪيو، ۽ پڪڙيو رهو. درين کان پري رهو.",
  },
  {
    test: /rupee|روپیہ|روپيو|money|پیسے|پيسا/,
    en: "The rupee is Pakistan’s money. Prices are what people agree to pay. Saving a little regularly is safer than spending every rupee the day it arrives.",
    ur: "روپیہ پاکستان کی کرنسی ہے۔ قیمت وہ ہے جو لوگ دینے پر راضی ہوں۔ تھوڑی بچت باقاعدگی سے، ہر روپیہ اسی دن خرچ کرنے سے زیادہ محفوظ ہے۔",
    sd: "روپيو پاڪستان جي سڪو آهي. قيمت اها آهي جيڪا ماڻهو ڏيڻ تي راضي هجن. ٿوري بچت باقاعده، هر روپيو ساڳئي ڏينهن خرچ ڪرڻ کان وڌيڪ محفوظ آهي.",
  },
  {
    test: /javascript|جاوا اسکرپٹ|جاوا اسڪرپٽ|css|سی ایس ایس/,
    en: "CSS sets how a page looks: color, size, and space. JavaScript makes the page react, for example showing a message when a button is pressed. HTML is the words and structure; CSS is the look; JavaScript is the behavior.",
    ur: "سی ایس ایس صفحے کی شکل بتاتا ہے: رنگ، سائز اور جگہ۔ جاوا اسکرپٹ صفحے کو ردِعمل دیتی ہے، جیسے بٹن دبانے پر پیغام۔ ایچ ٹی ایم ایل الفاظ اور ڈھانچہ ہے، سی ایس ایس شکل، جاوا اسکرپٹ کام۔",
    sd: "سي ايس ايس صفحي جي شڪل ٻڌائي ٿو: رنگ، ماپ ۽ جاءِ. جاوا اسڪرپٽ صفحي کي ردِعمل ڏئي ٿي، جيئن بٽڻ تي پيغام. ايڇ ٽي ايم ايل لفظ ۽ ڍانچو، سي ايس ايس شڪل، جاوا اسڪرپٽ ڪم.",
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
    return tr(lang, `That’s ${math}.`, `جواب ${math} ہے۔`, `جواب ${math} آهي.`);
  }

  const extra = customFact(q, lang);
  if (extra) return extra;

  const known = builtIn(q, userText, lang);
  if (known) return known;

  if (/^(hi|hello|hey|yo|salam|salaam|سلام|السلام)/.test(q) || q.includes("how are you")) {
    return tr(
      lang,
      "Hi, I’m Hina. I’m glad you’re here. What would you like to talk about?",
      "السلام علیکم، میں ہنا ہوں۔ خوشی ہوئی۔ کس بات پر بات کریں؟",
      "سلام، مان هناءَ آهيان. خوشي ٿي. ڪهڙي ڳالهه ڪريون؟",
    );
  }

  if (/\b(who are you|what are you|your name)\b/.test(q) || /تم کون ہو|تون ڪير آهين|آپ کون ہیں/.test(userText)) {
    return tr(
      lang,
      "I’m Hina. I like helping, and I’ll answer in a warm, clear way — questions, writing, plans, pictures, or clips.",
      "میں ہنا ہوں۔ مدد کرنا اچھا لگتا ہے، اور نرم صاف جواب دیتی ہوں — سوال، لکھائی، منصوبہ، تصویر یا کلپ۔",
      "مان هناءَ آهيان. مدد ڪرڻ پسند اٿم، ۽ نرم صاف جواب ڏيان ٿي.",
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
    `I’d love to help with “${userText.slice(0, 140)}”. Tell me a little more — what you want, and I’ll answer properly.`,
    `“${userText.slice(0, 140)}” پر خوشی سے مدد کروں گی۔ تھوڑا اور بتائیں، میں صاف جواب دوں گی۔`,
    `“${userText.slice(0, 140)}” تي خوشيءَ سان مدد ڪندس. ٿورو وڌيڪ ٻڌايو، مان صاف جواب ڏيندس.`,
  );
}
