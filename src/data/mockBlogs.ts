export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  date: string;
  readTime: string;
  coverImage: string;
  category: string;
  tags: string[];
  views: number;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "masa-depan-jurnalisme-digital",
    title: "Masa Depan Jurnalisme Digital: Antara Kecepatan dan Kebenaran",
    excerpt: "Di era informasi instan, tantangan terbesar jurnalis adalah mempertahankan akurasi tanpa mengorbankan aktualitas.",
    content: `<p>Dunia jurnalisme telah berubah selamanya sejak internet masuk ke setiap saku manusia. Kecepatan kini menjadi mata uang utama, seringkali mengalahkan kedalaman dan akurasi yang dulu menjadi pilar utama berita.</p>
    <p>Namun, di balik hiruk-pikuk clickbait dan trending topics, ada kerinduan yang mendalam akan jurnalisme yang berkualitas. Pembaca mulai menyadari bahwa informasi gratis seringkali dibayar dengan kualitas yang rendah atau bias yang tersembunyi.</p>
    <p>Masa depan jurnalisme digital tidak terletak pada siapa yang paling cepat memicu notifikasi, melainkan siapa yang paling dipercaya saat debu informasi mulai mereda. Kepercayaan (trust) adalah komoditas paling langka di abad ke-21.</p>`,
    author: "Fajar Pratama",
    authorAvatar: "FP",
    authorRole: "Editor-in-Chief",
    date: "2026-04-20",
    readTime: "12 min",
    coverImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "Media",
    tags: ["Journalism", "Digital Era", "Ethics"],
    views: 3420,
    featured: true,
  },
  {
    id: "blog-2",
    slug: "membangun-budaya-remote-work",
    title: "Membangun Budaya Remote Work yang Sehat untuk Tim Kreatif",
    excerpt: "Bekerja dari jauh bukan hanya soal alat, tapi soal kepercayaan, komunikasi, dan batasan personal yang jelas.",
    content: `<p>Remote work bukan lagi sekadar tren, melainkan standar baru bagi banyak industri kreatif. Namun, transisi dari kantor fisik ke ruang digital tidak selalu mulus.</p>
    <p>Banyak tim terjebak dalam 'zoom fatigue' atau 'always-on culture' yang berujung pada burnout. Masalahnya bukan pada jarak geografis, melainkan pada kurangnya protokol komunikasi yang menghargai waktu fokus.</p>
    <p>Di TIMVERSE, kami percaya bahwa budaya kerja adalah apa yang terjadi saat tidak ada yang melihat. Membangun kepercayaan adalah fondasi utama untuk tim yang produktif dari mana saja.</p>`,
    author: "Siska Amelia",
    authorAvatar: "SA",
    authorRole: "Creative Director",
    date: "2026-04-19",
    readTime: "10 min",
    coverImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    category: "Career",
    tags: ["Remote Work", "Culture", "Creativity"],
    views: 2150,
  },
  {
    id: "blog-3",
    slug: "psikologi-konsumsi-berita",
    title: "Memahami Psikologi di Balik Cara Kita Mengonsumsi Berita",
    excerpt: "Kenapa kita lebih tertarik pada berita buruk? Memahami bias konfirmasi dan algoritma media sosial.",
    content: `<p>Pernahkah Anda bertanya-tanya kenapa berita negatif cenderung menyebar lebih cepat daripada berita positif? Otak manusia secara evolusioner memang dirancang untuk lebih peka terhadap ancaman.</p>
    <p>Di era algoritma, kecenderungan alami ini dieksploitasi untuk menciptakan keterikatan (engagement). Bias konfirmasi membuat kita hanya mencari informasi yang mendukung apa yang sudah kita percayai sebelumnya.</p>
    <p>Menjadi pembaca yang cerdas berarti sadar akan filter bubble kita masing-masing. Di blog ini, kita akan bedah bagaimana tetap tenang di tengah badai informasi.</p>`,
    author: "Dr. Lukman Hakim",
    authorAvatar: "LH",
    authorRole: "Media Psychologist",
    date: "2026-04-15",
    readTime: "15 min",
    coverImage: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    category: "Psychology",
    tags: ["Media", "Psychology", "Mindfulness"],
    views: 5600,
  },
  {
    id: "blog-4",
    slug: "belakang-layar-timverse",
    title: "Di Balik Layar: Bagaimana Kami Mengelola Konten di TIMVERSE",
    excerpt: "Sebuah intipan ke dalam proses editorial dan teknologi yang kami gunakan untuk menyajikan berita tercepat.",
    content: `<p>Banyak yang bertanya, bagaimana TIMVERSE bisa menyajikan berita begitu cepat namun tetap akurat? Rahasianya ada pada integrasi antara teknologi AI dan intuisi editorial manusia.</p>
    <p>Kami menggunakan pipeline otomatis untuk memantau ribuan sumber data, namun setiap kata yang terbit tetap melewati kurasi editor manusia yang berpengalaman.</p>
    <p>Artikel ini adalah awal dari seri 'Behind the Scenes' kami, di mana kami akan terbuka tentang proses internal kami demi transparansi kepada pembaca setia.</p>`,
    author: "Tim Redaksi",
    authorAvatar: "TR",
    authorRole: "Editorial Team",
    date: "2026-04-10",
    readTime: "8 min",
    coverImage: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    category: "Inside TIMVERSE",
    tags: ["Workflows", "Technology", "Transparency"],
    views: 8900,
  },
  {
    id: "blog-5",
    slug: "revolusi-ai-dalam-penulisan",
    title: "Revolusi AI: Apakah Penulis Manusia Akan Digantikan?",
    excerpt: "Bagaimana tim konten beradaptasi dengan kehadiran LLM dan tetap mempertahankan sentuhan manusia.",
    content: `<p>Kecerdasan Buatan (AI) telah mengguncang dunia kepenulisan. Dari pembuatan konten SEO hingga naskah kreatif, kemampuan AI semakin mendekati kemampuan manusia.</p>
    <p>Namun, di TIMVERSE, kami melihat AI bukan sebagai pengganti, melainkan sebagai asisten yang kuat. AI bisa mengolah data mentah, namun hanya manusia yang bisa memberikan konteks, emosi, dan penilaian moral.</p>
    <p>Masa depan kreatifitas adalah tentang kolaborasi antara kecerdasan sintetis dan naluri manusiawi.</p>`,
    author: "Elena Putri",
    authorAvatar: "EP",
    authorRole: "Tech Columnist",
    date: "2026-04-05",
    readTime: "11 min",
    coverImage: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
    category: "Media",
    tags: ["AI", "Writing", "Future"],
    views: 7200,
  },
  {
    id: "blog-6",
    slug: "minimalisme-digital",
    title: "Minimalisme Digital: Cara Menemukan Ketenangan di Tengah Notifikasi",
    excerpt: "Strategi praktis untuk mengklaim kembali perhatian Anda di dunia yang dirancang untuk mengalihkan fokus.",
    content: `<p>Setiap hari kita dikepung oleh ratusan notifikasi yang berebut perhatian. Hasilnya? Perhatian kita menjadi dangkal dan mudah terpecah.</p>
    <p>Minimalisme digital bukan berarti membuang semua gadget, melainkan menggunakannya dengan sengaja. Ini tentang memilih alat yang memberikan nilai nyata dan mengabaikan sisanya.</p>
    <p>Dalam artikel ini, kita jelajahi bagaimana detoks digital bisa meningkatkan produktivitas dan keseimbangan mental Anda.</p>`,
    author: "Reza Surya",
    authorAvatar: "RS",
    authorRole: "Lifestyle Editor",
    date: "2026-04-01",
    readTime: "9 min",
    coverImage: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    category: "Psychology",
    tags: ["Lifestyle", "Focus", "Mindfulness"],
    views: 4500,
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getLatestBlogPosts(count = 4): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getRelatedBlogPosts(currentSlug: string, category: string, count = 2): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, count);
}
