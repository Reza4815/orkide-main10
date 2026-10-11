import type {
  Banner,
  BlogPost,
  Brand,
  Category,
  Coupon,
  Feature,
  HomeSection,
  MenuItem,
  Order,
  Product,
  StoreSettings,
} from "./store-data";

export const categories: Category[] = [
  { id: "c1", slug: "sootin", name: "سوتین", image: null, description: "انواع سوتین‌های توری، نخی و بدون درز با تن‌خور بی‌نقص و راحتی تمام‌روز." },
  { id: "c2", slug: "short", name: "شورت", image: null, description: "شورت‌های نخی، توری و بدون درز در طرح‌ها و رنگ‌های متنوع." },
  { id: "c3", slug: "set", name: "ست سوتین و شورت", image: null, description: "ست‌های هماهنگ سوتین و شورت با دوخت ظریف و پارچه‌های درجه یک." },
  { id: "c4", slug: "sleepwear", name: "لباس خواب", image: null, description: "لباس‌های خواب ساتن و نخی برای خوابی راحت و شیک." },
  { id: "c5", slug: "robe", name: "روپوش و حوله‌ای", image: null, description: "روپوش‌های ساتن و مخمل با جزئیات توری برای لحظه‌های خاص." },
  { id: "c6", slug: "shapewear", name: "گن و لاغری", image: null, description: "گن‌ها و لاغری‌های بدون درز با فرم‌دهی طبیعی زیر انواع لباس." },
  { id: "c7", slug: "hosiery", name: "جوراب و ساق", image: null, description: "جوراب‌های شلواری، ساق‌دار و نخی با کیفیت ماندگار." },
  { id: "c8", slug: "sport", name: "ورزشی", image: null, description: "سوتین‌ها و ست‌های ورزشی با پشتیبانی مناسب برای تمرین." },
];

export const brands: Brand[] = [
  { id: "b1", name: "ارکیده", latinName: "ORKIDEH" },
  { id: "b2", name: "لورین", latinName: "LUREEN" },
  { id: "b3", name: "نیلوفر", latinName: "NILOUFAR" },
  { id: "b4", name: "آنمون", latinName: "ANEMONE" },
  { id: "b5", name: "ستاره", latinName: "SETAREH" },
  { id: "b6", name: "پاریزین", latinName: "PARISIEN" },
];

const lace = { name: "صورتی پودری", hex: "#e8b4b8" };
const ivory = { name: "سفید عاجی", hex: "#f3ede4" };
const black = { name: "مشکی", hex: "#2b2426" };
const mauve = { name: "یاسی", hex: "#b8a1b4" };
const skin = { name: "کرم پوست", hex: "#e3c6ac" };
const wine = { name: "زرشکی", hex: "#7d3145" };

export const products: Product[] = [
  {
    id: "p1", slug: "lace-bralette-rose", name: "سوتین توری رز مدل ماهور", brandId: "b1", categoryId: "c1",
    price: 685_000, compareAt: 820_000, colors: [lace, ivory, black], sizes: ["۷۵", "۸۰", "۸۵", "۹۰"],
    images: [],
    description: "سوتین توری ماهور با ترکیب پارچه تور فرانسوی و آستر نخی، بدون آزار پوست و با تن‌خور نرم طراحی شده است. بندهای قابل تنظیم و قزن‌های فلزی ضدحساسیت، تجربه‌ای لوکس و راحت را برای استفاده روزمره رقم می‌زنند. الگوی سه‌بعدی کاپ‌ها فرم طبیعی را حفظ می‌کند و زیر لباس‌های نازک اصلاً مشخص نمی‌شود.",
    specs: [
      { label: "جنس", value: "تور فرانسوی و نخ پنبه" },
      { label: "جکدار", value: "خیر" },
      { label: "فنردار", value: "بله، فنر دستی" },
      { label: "بند", value: "قابل تنظیم" },
      { label: "کشور سازنده", value: "ایران" },
    ],
    isNew: true, rating: 4.8, numReviews: 126, sold: 480, stock: 24,
  },
  {
    id: "p2", slug: "ivory-lace-set", name: "ست سوتین و شورت توری عروسکی", brandId: "b1", categoryId: "c3",
    price: 1_240_000, compareAt: 1_590_000, colors: [ivory, lace], sizes: ["S", "M", "L", "XL"],
    images: [],
    description: "ست کامل سوتین و شورت با تور گل‌دار ظریف و یراق نقره‌ای، انتخابی خاص برای روزهای مهم. پارچه ضدحساسیت و دوخت تخت، راحتی مطلق را تضمین می‌کند و جزئیات دست‌دوز آن حس لباس سفارشی را منتقل می‌کند.",
    specs: [
      { label: "جنس", value: "تور گل‌دار و لایکرا" },
      { label: "تعداد اقلام", value: "۲ عدد" },
      { label: "قزن", value: "نقره‌ای ضدحساسیت" },
      { label: "شست‌وشو", value: "دستی با آب سرد" },
    ],
    isNew: true, rating: 4.9, numReviews: 89, sold: 320, stock: 15,
  },
  {
    id: "p3", slug: "satin-slip-champagne", name: "لباس خواب ساتن شامپاینی مدل شبنم", brandId: "b3", categoryId: "c4",
    price: 1_450_000, compareAt: null, colors: [ivory, mauve, wine], sizes: ["S", "M", "L"],
    images: [],
    description: "لباس خواب ساتن شبنم با ایستایی بی‌نظیر روی بدن و یقه توری ظریف، برای خوابی لوکس طراحی شده است. ساتن ابریشمی‌حس با خاصیت خنک‌کنندگی، در تمام فصل‌ها لذت‌بخش است و بندهای قابل تنظیم آن تن‌خور دلخواه شما را می‌سازد.",
    specs: [
      { label: "جنس", value: "ساتن ابریشمی" },
      { label: "قد", value: "روی زانو" },
      { label: "بند", value: "قابل تنظیم" },
      { label: "یقه", value: "تور فرانسوی" },
    ],
    isNew: false, rating: 4.7, numReviews: 214, sold: 712, stock: 18,
  },
  {
    id: "p4", slug: "seamless-shapewear", name: "گن بدون درز بلند مدل فرم", brandId: "b2", categoryId: "c6",
    price: 980_000, compareAt: 1_180_000, colors: [skin, black], sizes: ["M", "L", "XL", "2XL"],
    images: [],
    description: "گن بلند بدون درز با بافت فشرده هدفمند در ناحیه شکم و کمر، فرمی طبیعی زیر انواع لباس می‌سازد. الیاف تنفس‌پذیر و لبه‌های بدون لیز، مانع تاول و جا افتادن می‌شوند و برای استفاده طولانی‌مدت روزانه ایده‌آل است.",
    specs: [
      { label: "جنس", value: "نایلون و الاستان" },
      { label: "درجه فشردگی", value: "متوسط" },
      { label: "درز", value: "بدون درز" },
      { label: "قابلیت تنفس", value: "بالا" },
    ],
    isNew: false, rating: 4.5, numReviews: 167, sold: 960, stock: 42,
  },
  {
    id: "p5", slug: "satin-robe-blush", name: "روپوش ساتن صورتی مدل ارغوان", brandId: "b1", categoryId: "c5",
    price: 1_680_000, compareAt: 1_980_000, colors: [lace, ivory, wine], sizes: ["Free"],
    images: [],
    description: "روپوش ساتن ارغوان با آستین‌های توردار و کمربند جداگانه، ترکیبی از ظرافت و راحتی است. جناح‌های توری روی سرآستین و پشت یقه، آن را به انتخابی شیک برای جهیزیه و هدیه تبدیل کرده است.",
    specs: [
      { label: "جنس", value: "ساتن و تور" },
      { label: "سایز", value: "فری‌سایز (۳۶ تا ۴۴)" },
      { label: "کمربند", value: "جداگانه" },
      { label: "قد", value: "زیر زانو" },
    ],
    isNew: true, rating: 4.9, numReviews: 64, sold: 145, stock: 9,
  },
  {
    id: "p6", slug: "hose-ivory-trio", name: "ست سه‌تایی جوراب نخی لوکس", brandId: "b4", categoryId: "c7",
    price: 320_000, compareAt: 420_000, colors: [ivory, lace, skin], sizes: ["Free"],
    images: [],
    description: "ست سه‌عددی جوراب نخی با بافت ریز و مچ نرم، مناسب استفاده روزمره. نخ پنبه الیاف بلند، ضدبو و بسیار بادوام است و حالت‌پذیری بالایی پس از شست‌وشو دارد.",
    specs: [
      { label: "جنس", value: "نخ پنبه و الاستان" },
      { label: "تعداد", value: "۳ جفت" },
      { label: "ضدبو", value: "بله" },
    ],
    isNew: false, rating: 4.4, numReviews: 302, sold: 1840, stock: 120,
  },
  {
    id: "p7", slug: "cotton-brief-basic", name: "شورت نخی اسلیپ مدل روزانه", brandId: "b3", categoryId: "c2",
    price: 195_000, compareAt: null, colors: [ivory, skin, black, mauve], sizes: ["M", "L", "XL"],
    images: [],
    description: "شورت اسلیپ نخی با کمر کش پهن و نرم، مناسب استفاده تمام‌روز. پارچه ۱۰۰٪ نخ پنبه رنگرزی شده و فرم خود را پس از شست‌وشو حفظ می‌کند.",
    specs: [
      { label: "جنس", value: "نخ پنبه ۱۰۰٪" },
      { label: "کمر", value: "کش پهن" },
      { label: "شست‌وشو", value: "ماشینی" },
    ],
    isNew: false, rating: 4.6, numReviews: 428, sold: 2630, stock: 210,
  },
  {
    id: "p8", slug: "gift-box-mauve", name: "ست هدیه جعبه‌دار یاسی مدل جشن", brandId: "b2", categoryId: "c3",
    price: 2_150_000, compareAt: 2_690_000, colors: [mauve, ivory], sizes: ["S", "M", "L"],
    images: [],
    description: "ست کامل هدیه در جعبه ابریشمی ارکیده شامل سوتین و شورت توری، کاغذ ابریشم و روبان ساتن. انتخابی ماندگار برای هدیه به عزیزترین‌ها با امکان درج کارت تبریک دست‌نویس.",
    specs: [
      { label: "محتویات", value: "سوتین، شورت و جعبه هدیه" },
      { label: "جنس", value: "تور و لایکرا" },
      { label: "بسته‌بندی", value: "جعبه سخت ابریشمی" },
    ],
    isNew: true, rating: 5, numReviews: 41, sold: 96, stock: 12,
  },
  {
    id: "p9", slug: "sport-bra-active", name: "سوتین ورزشی مدل اکتیو", brandId: "b5", categoryId: "c8",
    price: 745_000, compareAt: 890_000, colors: [black, mauve], sizes: ["S", "M", "L", "XL"],
    images: [],
    description: "سوتین ورزشی اکتیو با پشتیبانی متوسط تا بالا برای تمرین‌های هوازی و سالنی. پارچه خشک‌شونده سریع و بندهای پهن، فشار را یکنواخت می‌کند و مانع آسیب می‌شود.",
    specs: [
      { label: "جنس", value: "پلی‌استر و الاستان" },
      { label: "سطح پشتیبانی", value: "بالا" },
      { label: "خشک‌شدن", value: "سریع" },
    ],
    isNew: false, rating: 4.7, numReviews: 118, sold: 540, stock: 33,
  },
  {
    id: "p10", slug: "sleepwear-set-rose", name: "ست لباس خواب دوتکه صورتی", brandId: "b6", categoryId: "c4",
    price: 1_120_000, compareAt: null, colors: [lace, ivory], sizes: ["S", "M", "L", "XL"],
    images: [],
    description: "ست دوتکه لباس خواب شامل تاپ بنددار و شورتک ساتن با لبه‌های توری. سبک، خنک و لطیف؛ برای شب‌های تابستان و سفر.",
    specs: [
      { label: "جنس", value: "ساتن خنک" },
      { label: "تعداد اقلام", value: "۲ عدد" },
      { label: "لبه", value: "تور ظریف" },
    ],
    isNew: true, rating: 4.8, numReviews: 77, sold: 230, stock: 21,
  },
  {
    id: "p11", slug: "tshirt-bra-nude", name: "سوتین بدون درز تی‌شرتی کرم", brandId: "b4", categoryId: "c1",
    price: 560_000, compareAt: 640_000, colors: [skin, ivory, black], sizes: ["۷۵", "۸۰", "۸۵"],
    images: [],
    description: "سوتین یک‌تکه بدون درز با کاپ فوم نازک، زیر تی‌شرت و لباس‌های چسبان کاملاً مخفی می‌ماند. انتخاب اول برای استفاده روزمره با حداکثر راحتی.",
    specs: [
      { label: "جنس", value: "میکرومدال" },
      { label: "درز", value: "بدون درز" },
      { label: "کاپ", value: "فوم نازک" },
    ],
    isNew: false, rating: 4.6, numReviews: 356, sold: 1490, stock: 67,
  },
  {
    id: "p12", slug: "bridal-ivory-set", name: "ست عروس سفید مرواریدی", brandId: "b2", categoryId: "c3",
    price: 2_890_000, compareAt: 3_450_000, colors: [ivory], sizes: ["S", "M", "L"],
    images: [],
    description: "ست ویژه عروس با تور مرواریددوزی‌شده و آستین بلند شفاف. هر قطعه با دست تزئین شده و در جعبه خاص ارکیده عرضه می‌شود.",
    specs: [
      { label: "جنس", value: "تور مرواریدی" },
      { label: "تزئین", value: "مروارید دست‌دوز" },
      { label: "بسته‌بندی", value: "جعبه ویژه" },
    ],
    isNew: true, rating: 4.9, numReviews: 28, sold: 54, stock: 6,
  },
  {
    id: "p13", slug: "shapewear-bodysuit", name: "بادی لاغری سرهمی مدل سلکت", brandId: "b5", categoryId: "c6",
    price: 1_350_000, compareAt: 1_620_000, colors: [skin, black], sizes: ["M", "L", "XL"],
    images: [],
    description: "بادی سرهمی لاغری با فشردگی لایه‌لایه که شکم، پهلو و کمر را هم‌زمان فرم می‌دهد. قزن پایین‌تنه برای استفاده راحت در طول روز طراحی شده است.",
    specs: [
      { label: "جنس", value: "نایلون فشرده" },
      { label: "درجه فشردگی", value: "بالا" },
      { label: "قزن", value: "کشاله" },
    ],
    isNew: false, rating: 4.4, numReviews: 143, sold: 670, stock: 28,
  },
  {
    id: "p14", slug: "knit-robe-long", name: "روپوش بلند مخمل مدل زمستانه", brandId: "b6", categoryId: "c5",
    price: 1_890_000, compareAt: null, colors: [wine, mauve, black], sizes: ["S", "M", "L", "XL"],
    images: [],
    description: "روپوش بلند مخمل نرم با آستر خز لبه‌ها، گرم و سبک برای روزهای سرد. جیب‌های پنهان و کمربند پهن آن را کاربردی می‌کند.",
    specs: [
      { label: "جنس", value: "مخمل کرشه" },
      { label: "قد", value: "تا مچ" },
      { label: "جیب", value: "۲ عدد پنهان" },
    ],
    isNew: true, rating: 4.8, numReviews: 52, sold: 118, stock: 14,
  },
];

export const banners: Banner[] = [
  {
    id: "bn1", title: "مجموعه تازه‌ی بهار ارکیده رسید",
    subtitle: "طرح‌های توری ظریف با پارچه‌های ضدحساسیت؛ تجربه‌ای نرم و لوکس که شایسته‌ی شماست. تا ۷ روز ضمانت تعویض.",
    image: null, ctaLabel: "مشاهده محصولات", ctaHref: "/shop", badge: "مجموعه جدید ارکیده",
  },
  {
    id: "bn2", title: "ست‌های عروسکی؛ برای ماندگارترین روزها",
    subtitle: "ست‌های کامل سوتین و شورت با دوخت دستی و بسته‌بندی هدیه، با ارسال رایگان در سراسر کشور.",
    image: null, ctaLabel: "دیدن ست‌ها", ctaHref: "/category/set", badge: "پیشنهاد ویژه",
  },
  {
    id: "bn3", title: "هدیه بدهید، مثل همیشه درست انتخاب کنید",
    subtitle: "ست‌های جعبه‌دار ارکیده با کارت تبریک دست‌نویس؛ آماده‌ی ارسال همان‌روز در تهران.",
    image: null, ctaLabel: "خرید ست هدیه", ctaHref: "/product/gift-box-mauve", badge: "هدیه‌های خاص",
  },
];

export const features: Feature[] = [
  { id: "f1", icon: "truck", title: "ارسال سریع", description: "تحویل ۱ تا ۳ روز کاری" },
  { id: "f2", icon: "shield", title: "پرداخت امن", description: "درگاه رسمی بانکی" },
  { id: "f3", icon: "badge", title: "ضمانت اصالت", description: "کالای اورجینال" },
  { id: "f4", icon: "headset", title: "پشتیبانی ۹ تا ۲۰", description: "هر روز هفته" },
  { id: "f5", icon: "rotate", title: "تعویض آسان", description: "تا ۷ روز بدون قید" },
  { id: "f6", icon: "sparkles", title: "بسته‌بندی شیک", description: "بدون ذکر محتوا" },
];

export const homeSections: HomeSection[] = [
  { id: "s1", type: "products", title: "پرفروش‌ترین‌ها", subtitle: "انتخاب اول مشتریان ارکیده", config: { source: "bestseller", limit: 8, layout: "grid" }, active: true },
  { id: "s2", type: "promo", title: "خرید بر اساس دسته‌بندی", active: true },
  { id: "s3", type: "products", title: "جدیدترین‌ها", subtitle: "تازه رسیده به فروشگاه", config: { source: "new", limit: 8, layout: "slider" }, active: true },
  { id: "s4", type: "features", active: true },
  { id: "s5", type: "brands", title: "برندهای محبوب", active: true },
  { id: "s6", type: "blog", title: "از وبلاگ ارکیده", active: true },
  { id: "s7", type: "newsletter", active: true },
];

export const blogPosts: BlogPost[] = [
  {
    id: "bp1", slug: "bra-size-guide", title: "راهنمای کامل انتخاب سایز سوتین؛ عدد و حرف کاپ یعنی چه؟",
    excerpt: "۸۰٪ خانم‌ها سایز اشتباه سوتین می‌پوشند. در این راهنما یاد می‌گیرید چطور در خانه سایز دقیق خود را پیدا کنید.",
    cover: null, date: "2025-12-18", author: "تحریریه ارکیده", tags: ["راهنمای خرید", "سایز"], readMinutes: 6,
    content: [
      "شاید برای شما هم پیش آمده که سوتینی با ظاهر زیبا بخرید اما بعد از چند ساعت استفاده، فنر یا بند آن اذیت‌تان کند. دلیل اصلی این مشکل، انتخاب سایز اشتباه است؛ بر اساس پژوهش‌ها، اکثریت خانم‌ها سایز واقعی خود را نمی‌شناسند.",
      "سایز سوتین از دو بخش تشکیل می‌شود: عدد دور سینه (مثل ۷۵ یا ۸۰) که دور قفسه سینه درست زیر سینه است و حرف کاپ (مثل B یا C) که از اختلاف دور سینه و دور قفسه سینه به دست می‌آید. بهترین زمان اندازه‌گیری، وسط روز و بدون لباس ضخیم است.",
      "برای اندازه‌گیری در خانه، یک متر خیاطی بردارید. دور قفسه سینه را نه خیلی سفت و نه شل بگیرید و عدد را یادداشت کنید. سپس دور برجسته‌ترین نقطه سینه را اندازه بزنید. اختلاف این دو عدد، کاپ شما را مشخص می‌کند: حدود ۱۲ سانتی‌متر A، حدود ۱۴ سانتی‌متر B و به همین ترتیب.",
      "اگر بین دو سایز قرار گرفتید، قاعده کلی این است: کاپ بزرگ‌تر با عدد کوچک‌تر معمولاً تن‌خور بهتری دارد. و در نهایت، حتماً سوتین را از شل‌ترین قزن شروع کنید تا با گذر زمان و شل شدن کش، همچنان قابل استفاده بماند.",
      "در ارکیده، تمام سوتین‌ها جدول سایز دقیق دارند و تیم پشتیبانی ما، هر روز از ۹ تا ۲۰ برای مشاوره سایز در کنار شماست.",
    ],
  },
  {
    id: "bp2", slug: "lace-care-tips", title: "چطور از لباس‌های توری و ساتن مراقبت کنیم؟",
    excerpt: "با چند نکته ساده شست‌وشو و نگهداری، عمر لباس‌های ظریف خود را دو برابر کنید.",
    cover: null, date: "2025-11-30", author: "نگار محمدی", tags: ["مراقبت", "نگهداری"], readMinutes: 4,
    content: [
      "لباس‌های توری و ساتن به دلیل بافت ظریف‌شان نیاز به مراقبت بیشتری دارند، اما خبر خوب این است که رعایت چند نکته ساده، عمر آن‌ها را چند برابر می‌کند.",
      "قانون اول: شست‌وشوی دستی با آب سرد یا ولرم. ماشین لباسشویی حتی در برنامه‌های ظریف هم به تور آسیب می‌زند. از شوینده‌های ملایم مخصوص لباس ظریف استفاده کنید و هرگز سفیدکننده به کار نبرید.",
      "بعد از شست‌وشو، لباس را نپیچید. آن را بین دو حوله نرم قرار دهید و با فشار ملایم آب اضافی را بگیرید، سپس روی سطح صاف و به دور از نور مستقیم خورشید خشک کنید. اتوی مستقیم ممنوع؛ در صورت نیاز از بخار اتو با فاصله استفاده کنید.",
      "برای نگهداری در کشو، سوتین‌ها را تا نکنید و کاپ‌ها را داخل هم نچینید؛ این کار فرم فنر و فوم را خراب می‌کند. استفاده از جداکننده‌های کشویی، نظم را حفظ کرده و از گره خوردن بندها جلوگیری می‌کند.",
    ],
  },
  {
    id: "bp3", slug: "sleepwear-trends", title: "ترندهای لباس خواب امسال؛ از ساتن مینیمال تا ست‌های دوتکه",
    excerpt: "نگاهی به محبوب‌ترین مدل‌های لباس خواب سال که در ویترین ارکیده هم پیدا می‌شوند.",
    cover: null, date: "2025-10-12", author: "تحریریه ارکیده", tags: ["استایل", "ترند"], readMinutes: 5,
    content: [
      "لباس خواب دیگر فقط برای خواب نیست؛ بخشی از استایل خانگی و حتی سفر است. امسال چهار ترند اصلی را در کالکشن‌های جهانی می‌بینیم که هر چهار را در فروشگاه ارکیده هم گرد آورده‌ایم.",
      "ترند اول، ساتن مینیمال با یقه توری است؛ دقیقاً همان ترکیبی که در مدل شبنم می‌بینید. رنگ‌های شامپاینی، یاسی و زرشکی امسال جای صورتی‌های شاداب گذشته را گرفته‌اند.",
      "ترند دوم، ست‌های دوتکه تاپ و شورتک است که هم خنک‌اند و هم برای مهمانی‌های خانوادگی و سفر مناسب‌اند. ست لباس خواب دوتکه ارکیده یکی از پرفروش‌ترین‌های همین دسته است.",
      "ترند سوم، روپوش‌های بلند با جزئیات مخمل برای فصل سرد است و ترند چهارم، بسته‌بندی هدیه‌محور؛ چون بیشتر از هر زمان دیگری، لباس خواب به‌عنوان هدیه خریده می‌شود.",
      "پیشنهاد ما: یک ست ساتن روزانه، یک روپوش گرم زمستانه و یک ست هدیه‌ای جعبه‌دار، کمد لباس خواب کاملی برای کل سال می‌سازد.",
    ],
  },
];

export const settings: StoreSettings = {
  storeName: "لباس زیر ارکیده",
  tagline: "زیبایی از لایه اول شروع می‌شود",
  phone: "۰۲۱-۹۱۰۰۸۸۰۰",
  email: "hello@orkideh.shop",
  address: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۱۲۴، فروشگاه ارکیده",
  hours: "شنبه تا پنجشنبه ۹ تا ۲۰",
  footerText: "ارکیده از سال ۱۳۹۴ با هدف ارائه لباس زیر باکیفیت، خوش‌دوخت و منصفانه قیمت‌گذاری‌شده فعالیت می‌کند. ما معتقدیم راحتی و زیبایی حق همه زنان است.",
  freeShippingThreshold: 900_000,
  shippingCost: 60_000,
  instagram: "https://instagram.com/orkideh.shop",
  telegram: "https://t.me/orkideh_shop",
};

export const menuItems: MenuItem[] = [
  { label: "صفحه اصلی", href: "/" },
  { label: "فروشگاه", href: "/shop" },
  { label: "وبلاگ", href: "/blog" },
  { label: "تماس با ما", href: "/contact" },
];

export const coupons: Coupon[] = [
  { code: "ORKIDEH10", percent: 10 },
  { code: "NEW15", percent: 15 },
];

export const orders: Order[] = [
  { id: "o1", code: "ORK-10248", customer: "سارا احمدی", phone: "۰۹۱۲۴۵۶۷۸۹۰", date: "2026-01-09", status: "delivered", total: 1_925_000, items: [{ name: "ست سوتین و شورت توری عروسکی", qty: 1, price: 1_240_000 }, { name: "سوتین توری رز مدل ماهور", qty: 1, price: 685_000 }] },
  { id: "o2", code: "ORK-10247", customer: "مریم رضایی", phone: "۰۹۳۵۱۲۳۴۵۶۷", date: "2026-01-09", status: "shipped", total: 980_000, items: [{ name: "گن بدون درز بلند مدل فرم", qty: 1, price: 980_000 }] },
  { id: "o3", code: "ORK-10246", customer: "نگار کریمی", phone: "۰۹۱۲۹۸۷۶۵۴۳", date: "2026-01-08", status: "paid", total: 2_150_000, items: [{ name: "ست هدیه جعبه‌دار یاسی مدل جشن", qty: 1, price: 2_150_000 }] },
  { id: "o4", code: "ORK-10245", customer: "الهه موسوی", phone: "۰۹۹۰۱۱۲۲۳۳۴", date: "2026-01-08", status: "pending", total: 1_645_000, items: [{ name: "روپوش ساتن صورتی مدل ارغوان", qty: 1, price: 1_680_000 }] },
  { id: "o5", code: "ORK-10244", customer: "شیرین صادقی", phone: "۰۹۲۱۶۵۴۳۲۱۰", date: "2026-01-07", status: "delivered", total: 2_010_000, items: [{ name: "سوتین توری رز مدل ماهور", qty: 2, price: 685_000 }, { name: "ست سه‌تایی جوراب نخی لوکس", qty: 2, price: 320_000 }] },
  { id: "o6", code: "ORK-10243", customer: "آیدا فرهادی", phone: "۰۹۳۰۴۵۶۷۸۹۱", date: "2026-01-07", status: "canceled", total: 745_000, items: [{ name: "سوتین ورزشی مدل اکتیو", qty: 1, price: 745_000 }] },
  { id: "o7", code: "ORK-10242", customer: "ترانه جلالی", phone: "۰۹۱۲۵۵۵۴۴۳۳", date: "2026-01-06", status: "delivered", total: 1_450_000, items: [{ name: "لباس خواب ساتن شامپاینی مدل شبنم", qty: 1, price: 1_450_000 }] },
  { id: "o8", code: "ORK-10241", customer: "بهاره نادری", phone: "۰۹۵۸۷۶۵۴۳۲۱", date: "2026-01-06", status: "shipped", total: 3_570_000, items: [{ name: "ست عروس سفید مرواریدی", qty: 1, price: 2_890_000 }, { name: "روپوش بلند مخمل مدل زمستانه", qty: 1, price: 1_890_000 }] },
];
