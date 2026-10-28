// app/data/likes.ts (或你專案中對應的資料檔)

// 1. 定義分類型別與資料規格 (Schema)
export type LikeCategoryKey =
  | "books"
  | "singers"
  | "creators"
  | "movies"
  | "spots"
  | "anime"
  | "vtuber";

// 新版標準型別
export interface LikeItem {
  id: string;
  category: LikeCategoryKey;
  title: string; // 書名 / 歌手 / 創作者 / 電影 / 展覽景點 / 動畫
  subtitle?: string; // 作者 / 推薦歌曲 / 介紹 / 導演 / 地點
  coverImage: string; // 封面照路徑
  rating?: number; // 星級 (1-5)
  tags: string[];
  summary: string; // 一句話心得
  hasDetail: boolean; // true 代表有長文 MDX，點擊進入內頁
  slug?: string; // 對應 content/likes/[category]/[slug].mdx
  externalUrl?: string; // 外部連結
}

// 舊版相容介面 (修正 layout 型別擴充)
export interface Like {
  id?: string;
  category?: string;
  title: string;
  sub?: string;
  cover?: string;
  coverImage?: string;
  href?: string;
  channelId?: string;
  tags?: string[];
  personRating?: number;
  note?: string;
  hasDetail?: boolean;
  slug?: string;
  summary?: string;
  subtitle?: string;
}

export interface LikeCategory {
  key: string;
  label: string;
  en: string;
  layout: "circle" | "square" | "portrait" | "landscape"; // 👈 支援 'circle' 圓形
  items: Like[];
}

// 將新版 LikeItem 轉譯為舊版 Like 介面的相容轉換函式
const normalizeLike = (item: LikeItem): Like => ({
  ...item,
  category: item.category,
  cover: item.coverImage,
  coverImage: item.coverImage,
  sub: item.subtitle,
  href: item.externalUrl,
  channelId: undefined,
  note: item.summary,
  personRating: item.rating,
  tags: item.tags,
  summary: item.summary,
  subtitle: item.subtitle,
  slug: item.slug,
  hasDetail: item.hasDetail,
});

// 2. 導出實際資料陣列 (所有資料統一新增在這裡)
export const LIKES: LikeItem[] = [
  {
    id: "book-1",
    category: "books",
    title: "原子習慣",
    subtitle: "James Clear",
    coverImage: "/assets/likes/books/atomic-habits.webp",
    rating: 5,
    tags: ["自我提升", "習慣養成"],
    summary: "細微改變帶來巨大成就，極度實用的習慣塑造指南。",
    hasDetail: true,
    slug: "atomic-habits",
  },
  {
    id: "movie-1",
    category: "movies",
    title: "幸福綠皮書",
    subtitle: "Peter Farrelly",
    coverImage: "/assets/likes/movies/green-book.webp",
    rating: 5,
    tags: ["電影", "劇情", "真事改編"],
    summary: "跨越種族與偏見的真摯友誼，兼具幽默與深刻思考的經典好片。",
    hasDetail: true,
    slug: "green-book",
  },
  {
    id: "movie-2",
    category: "movies",
    title: "綠里奇蹟",
    subtitle: "Frank Darabont",
    coverImage: "/assets/likes/movies/the-green-mile.webp",
    rating: 5,
    tags: ["電影", "劇情", "奇幻經典"],
    summary: "改編自史蒂芬·金同名小說，深刻探討人性善惡、生死奇蹟與監獄死囚區中人性光輝的震撼經典之作。",
    hasDetail: false,
    externalUrl: "https://www.catchplay.com/tw/video/c70e25b0-876e-403f-b123-2c057c5b81a4",
  },
  {
    id: "movie-3",
    category: "movies",
    title: "進擊的巨人 THE LAST ATTACK",
    subtitle: "林祐一郎 / MAPPA",
    coverImage: "/assets/likes/movies/shingeki-the-last-attack.webp",
    rating: 5,
    tags: ["電影", "動畫", "史詩終章"],
    summary: "將電視動畫完結篇重新重製升級的震撼劇場版，為艾連·葉卡與調查兵團的命運抉擇劃下最壯烈的句點。",
    hasDetail: false,
    externalUrl: "https://www.youtube.com/playlist?list=PL12UaAf_xzfpr7SoZ60tGNPpJvFxWs7I2",
  },
  // 音樂
  {
    id: "singer-1",
    category: "singers",
    title: "ヨルシカ (Yorushika)",
    subtitle: "n-buna / suis",
    coverImage: "/assets/likes/singers/yorushika.webp",
    rating: 5,
    tags: ["J-Pop", "Rock"],
    summary: "充滿文學感與夏日哀愁感的樂團，歌詞極具感染力。",
    hasDetail: false,
    externalUrl: "https://youtu.be/F64yFFnZfkI",
  },
  {
    id: "singer-2",
    category: "singers",
    title: "La La Land",
    subtitle: "Justin Hurwitz",
    coverImage: "/assets/likes/singers/lalaland.webp",
    rating: 5,
    tags: ["Jazz", "Soundtrack"],
    summary: "充滿復古爵士風格與浪漫夢想色彩的電影配樂，旋律細膩且極具情感感染力。",
    hasDetail: false,
    externalUrl: "https://youtu.be/7CVfTd-_qbc",
  },
  {
    id: "singer-3",
    category: "singers",
    title: "小さな恋のうた",
    subtitle: "MONGOL800",
    coverImage: "/assets/likes/singers/chiisana-koi-no-uta.webp",
    rating: 5,
    tags: ["J-Rock", "Punk Rock"],
    summary: "日本龐克搖滾樂團 MONGOL800 的經典代表作，以直白熱烈的旋律與歌詞傳遞純粹而真摯的青春思念。",
    hasDetail: false,
    externalUrl: "https://youtu.be/u8EkSB9zqnE",
  },
  {
    id: "singer-4",
    category: "singers",
    title: "周旋",
    subtitle: "王以太 Yitai Wang",
    coverImage: "/assets/likes/singers/yitai-wang-circulate.webp",
    rating: 5,
    tags: ["Hip-Hop", "Melodic Rap"],
    summary: "王以太的經典旋律饒舌作品，以細膩流暢的韻律與歌詞呈現人在現實與情感環境中的折衝與周旋。",
    hasDetail: false,
    externalUrl: "https://www.youtube.com/watch?v=6WPWpadfJfI",
  },
  // 🔥 新增：Creator 創作者分類範例資料
  {
    id: "creator-1",
    category: "creators",
    title: "志祺七七",
    subtitle: "社會議題與時事評論 YouTuber",
    coverImage: "/assets/likes/creators/shasha77.webp",
    rating: 5,
    tags: ["時事評論", "社會議題", "知識型創作者"],
    summary: "透過清晰的邏輯與深入淺出的剖析，探討台灣與國際社會大小事、公共議題及趨勢發展的優質知識型頻道。",
    hasDetail: false,
    externalUrl: "https://www.youtube.com/@shasha77",
  },
  // 展覽
  {
    id: "spot-1",
    category: "spots",
    title: "TFT 2026 有感節",
    subtitle: "Teach For Taiwan",
    coverImage: "/assets/likes/spots/tft-2026.webp",
    rating: 5,
    tags: ["展覽", "教育", "公益"],
    summary: "探討台灣教育不平等與社會創新的年度有感展覽。",
    hasDetail: true,
    slug: "tft-2026",
  },
  {
    id: "spot-4",
    category: "spots",
    title: "COMPUTEX TAIPEI",
    subtitle: "台北國際電腦展",
    coverImage: "/assets/likes/spots/computex.webp",
    rating: 5,
    tags: ["AI PC", "半導體", "科技展覽"],
    summary: "見證全球頂尖科技趨勢、AI 應用與硬體創新發展的重要年度盛會。",
    hasDetail: false,
    externalUrl: "https://www.computex.biz/",
  },
  {
    id: "spot-5",
    category: "spots",
    title: "北市 2026 高中職升學進路博覽會",
    subtitle: "多元升學&生涯博覽會",
    coverImage: "/assets/likes/spots/taipei-edu-expo.webp",
    rating: 5,
    tags: ["升學進路", "生涯規劃", "教育展覽"],
    summary: "匯集台北市各高中職特色與升學資訊，提供國中生與家長探索未來學習路徑的重要平台。",
    hasDetail: false,
    externalUrl: "https://sites.google.com/ymsh.tp.edu.tw/2026expo",
  },
  {
    id: "spot-6",
    category: "spots",
    title: "北市全球教育博覽會",
    subtitle: "國際教育與海外升學交流",
    coverImage: "/assets/experience/global-edu-expo.png",
    rating: 5,
    tags: ["國際教育", "海外升學", "多元視野"],
    summary: "聚焦全球教育趨勢、海外學校資源與多元學習管道，拓寬學生對國際升學與發展的視野。",
    hasDetail: false,
    externalUrl: "https://www.doe.gov.taipei/News_Content.aspx?n=B3DDF0458F0FFC11&sms=72544237BBE4C5F6&s=31445BC8256B4D30",
  },
  {
    id: "spot-7",
    category: "spots",
    title: "2026 AI EXPO Taiwan",
    subtitle: "人工智慧與前瞻科技展覽",
    coverImage: "/assets/likes/spots/ai expo.webp",
    rating: 5,
    tags: ["AI 應用", "人工智慧", "科技展覽"],
    summary: "探索最新 AI 技術落地應用、前瞻科技趨勢與產官學研創新成果的年度科技盛會。",
    hasDetail: false,
    externalUrl: "https://ai-expo.tw/about_2026.html",
  },
  {
    id: "spot-8",
    category: "spots",
    title: "舊愛新歡 20周年演唱會",
    subtitle: "經典音樂與現場演出",
    coverImage: "/assets/likes/spots/old-love-new-joy-concert.webp",
    rating: 5,
    tags: ["演唱會", "現場音樂", "音樂賞析"],
    summary: "參與 20周年經典音樂盛會，感受現場演出的震撼與音樂情感的共鳴。",
    hasDetail: false,
    externalUrl: "https://www.hgapms.com/",
  },
  {
    id: "spot-9",
    category: "spots",
    title: "2027 台北國際烘焙暨設備展",
    subtitle: "烘焙工藝與餐飲設備展覽",
    coverImage: "/assets/likes/spots/taipei-bakery-show.webp",
    rating: 5,
    tags: ["烘焙設備", "餐飲展覽", "國際貿易"],
    summary: "探索最新烘焙技術、專業餐飲設備與食品加工趨勢的年度烘焙盛會。",
    hasDetail: false,
    externalUrl: "https://www.tibs.org.tw/",
  },
  {
    id: "spot-10",
    category: "spots",
    title: "2026 SITCON 學生計算機年會",
    subtitle: "以學生為主體的資訊科技年會",
    coverImage: "/assets/likes/spots/2026-sitcon.webp",
    rating: 5,
    tags: ["SITCON", "開源社群", "學生年會", "資訊科技"],
    summary: "參與學生計算機年會，與全台對資訊技術、開源專案與軟體開發充滿熱情的高中及大專學生交流激盪。",
    hasDetail: false,
    externalUrl: "https://sitcon.org/2026/",
  },
  {
    id: "spot-11.5",
    category: "spots",
    title: "2026 g0v Summit 零時政府雙年會",
    subtitle: "公民科技與開源社群盛會",
    coverImage: "/assets/likes/spots/2026-g0v-summit.webp",
    rating: 5,
    tags: ["g0v", "公民科技", "開源社群", "開放政府"],
    summary: "參與 g0v Summit 雙年會，與跨界開發者、公民社群交流開放政府、數位公民權與社群協作的創新實踐。",
    hasDetail: false,
    externalUrl: "https://summit.g0v.tw/2026/",
  },
  {
    id: "spot-12",
    category: "spots",
    title: "2026 台北城市書展",
    subtitle: "閱讀生活與獨立出版盛會",
    coverImage: "/assets/likes/spots/taipei-book-fair.webp",
    rating: 5,
    tags: ["閱讀", "藝文展覽"],
    summary: "走訪台北城市書展，沉浸於書香世界、探索各類人文思想與獨立出版品，享受充實的閱讀與心靈交流時光。",
    hasDetail: false,
    externalUrl: "https://citybooks.kje-event.com.tw/",
  },
  {
    id: "spot-13",
    category: "spots",
    title: "一粒萬倍 公演",
    subtitle: "日本綜合藝術舞台劇・台灣公演",
    coverImage: "/assets/likes/spots/ichiryu-manbai.webp",
    rating: 5,
    tags: ["舞台劇", "傳統藝能", "表演藝術"],
    summary: "欣賞結合日本古事記神話、傳統國樂與當代舞台設計的綜合藝術公演，體驗傳統與創新交織的視覺與聽覺饗宴。",
    hasDetail: false,
    externalUrl: "https://www.opentix.life/event/2039175336378621953?srsltid=AU7gw4XvYRXKHpDcX1gfHJGHWa5zEkD9KAUGC1S_dqO7s1WVmracoGwQ",
  },
  {
    id: "spot-14",
    category: "spots",
    title: "iPlayground 2026",
    subtitle: "台灣 iOS 與 Apple 平台開發者年會",
    coverImage: "/assets/likes/spots/iplayground-2026.webp",
    rating: 5,
    tags: ["iOS", "Swift", "軟體開發", "開發者年會"],
    summary: "參與台灣年度 iOS 開發者盛會 iPlayground，與眾多 Apple 平台開發者交流 Swift、SwiftUI 與軟體架構實踐經驗。",
    hasDetail: false,
    externalUrl: "https://iplayground.io/2026/",
  },
  {
    id: "spot-15",
    category: "spots",
    title: "COSCUP 2026",
    subtitle: "亞洲最大開源人年會",
    coverImage: "/assets/likes/spots/coscup-2026.webp",
    rating: 5,
    tags: ["COSCUP", "開源社群", "開源年會", "技術交流"],
    summary: "參與一年一度的開源盛會 COSCUP，見證國內外開源社群、軟體工程與自由軟體文化的蓬勃發展與技術碰撞。",
    hasDetail: false,
    externalUrl: "https://coscup.org/2026/",
  },
  {
    id: "spot-16",
    category: "spots",
    title: "首爾插畫展",
    subtitle: "韓國最大插畫與視覺藝術盛會",
    coverImage: "/assets/likes/spots/seoul-illustration-fair.webp",
    rating: 5,
    tags: ["插畫藝術", "視覺設計", "繪本創作", "國際展覽"],
    summary: "參訪韓國首爾插畫展（The Seoul Illustration Fair），探索來自全球創作者的優秀插畫、角色設計與周邊藝術作品。",
    hasDetail: false,
    externalUrl: "https://sifintaipei.com.tw/",
  },
];
// 同步導出 LIKES_DATA（別名相容）
export const LIKES_DATA = LIKES;

// 3. 導出分類地圖（順序：books -> movies -> singers -> creators(圓形) -> spots）
export const LIKE_CATEGORIES: LikeCategory[] = [
  {
    key: "books",
    label: "書籍與閱讀",
    en: "BOOKS",
    layout: "portrait",
    items: LIKES.filter((item) => item.category === "books").map(normalizeLike),
  },
  {
    key: "movies",
    label: "電影與影集",
    en: "MOVIES",
    layout: "portrait",
    items: LIKES.filter((item) => item.category === "movies").map(normalizeLike),
  },
  {
    key: "singers",
    label: "歌手與音樂",
    en: "SINGERS",
    layout: "square",
    items: LIKES.filter((item) => item.category === "singers").map(normalizeLike),
  },
  {
    key: "creators",
    label: "創作者",
    en: "CREATORS",
    layout: "circle", // 👈 設定為圓形封面
    items: LIKES.filter((item) => item.category === "creators").map(normalizeLike),
  },
  {
    key: "spots",
    label: "展覽與景點",
    en: "SPOTS",
    layout: "portrait",
    items: LIKES.filter((item) => item.category === "spots").map(normalizeLike),
  },
];