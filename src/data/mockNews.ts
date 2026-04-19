export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  imageGradient: string;
  featured: boolean;
  views: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
}

export const categories = [
  { name: "Semua", color: "bg-accent text-white" },
  { name: "Teknologi", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { name: "Bisnis", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { name: "Olahraga", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  { name: "Hiburan", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
  { name: "Sains", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  { name: "Politik", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
];

export const breakingNews = [
  "🔴 BREAKING: Peluncuran satelit komunikasi terbaru Indonesia berhasil dilakukan dari Biak",
  "⚡ UPDATE: Indeks saham global melonjak setelah kebijakan baru bank sentral",
  "🏆 FINAL: Timnas Indonesia lolos ke babak semifinal Piala Asia 2026",
  "🌍 TERKINI: Konferensi iklim PBB hasilkan kesepakatan bersejarah",
];

const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff9a9e 100%)",
  "linear-gradient(135deg, #667eea 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "revolusi-ai-generatif-2026",
    title: "Revolusi AI Generatif 2026: Bagaimana Kecerdasan Buatan Mengubah Dunia Kerja",
    excerpt: "Para ahli memproyeksikan bahwa 40% pekerjaan akan bertransformasi dalam 5 tahun ke depan dengan adopsi AI generatif yang makin masif.",
    content: `<p>Dunia kerja sedang mengalami transformasi besar-besaran. Kecerdasan buatan generatif, yang dimulai dari kemunculan ChatGPT pada 2022, kini telah berkembang menjadi ekosistem yang jauh lebih canggih dan terintegrasi.</p>
    <p>Menurut laporan terbaru dari World Economic Forum, sekitar 40% pekerjaan global akan mengalami transformasi signifikan dalam lima tahun ke depan. Bukan berarti pekerjaan tersebut hilang, melainkan berevolusi menjadi bentuk baru yang membutuhkan kolaborasi manusia-AI.</p>
    <p>"Yang paling menarik adalah bagaimana AI tidak hanya mengotomasi tugas repetitif, tetapi juga memperkuat kreativitas manusia," kata Dr. Sarah Chen, peneliti AI di Stanford University.</p>
    <p>Perusahaan-perusahaan teknologi besar seperti Google, Microsoft, dan OpenAI terus berlomba mengembangkan model-model baru yang lebih efisien dan mampu memahami konteks lebih baik. Ini membuka peluang baru di bidang prompt engineering, AI ethics, dan human-AI interaction design.</p>`,
    category: "Teknologi",
    author: "Ahmad Rizky",
    authorAvatar: "AR",
    date: "2026-04-18",
    readTime: "8 min",
    imageGradient: gradients[0],
    featured: true,
    views: 15420,
  },
  {
    id: "2",
    slug: "startup-indonesia-unicorn-baru",
    title: "Startup Indonesia Cetak Unicorn Baru di Sektor Healthtech",
    excerpt: "MedikAI menjadi unicorn ke-15 Indonesia setelah mendapatkan pendanaan Seri C sebesar $150 juta dari investor global.",
    content: `<p>Ekosistem startup Indonesia kembali mencatatkan pencapaian membanggakan. MedikAI, platform healthtech berbasis kecerdasan buatan, resmi menyandang status unicorn setelah meraih pendanaan Seri C senilai $150 juta.</p>
    <p>Putaran pendanaan ini dipimpin oleh Sequoia Capital India dan diikuti oleh beberapa investor strategis termasuk Temasek Holdings dan GIC.</p>`,
    category: "Bisnis",
    author: "Siti Nurhaliza",
    authorAvatar: "SN",
    date: "2026-04-17",
    readTime: "5 min",
    imageGradient: gradients[1],
    featured: false,
    views: 8730,
  },
  {
    id: "3",
    slug: "timnas-indonesia-semifinal",
    title: "Timnas Indonesia Melaju ke Semifinal Piala Asia 2026 dengan Kemenangan Dramatis",
    excerpt: "Gol di injury time membawa Garuda ke babak empat besar, mengalahkan Korea Selatan 2-1 di Stadium Nasional.",
    content: `<p>Dalam pertandingan yang penuh drama, Timnas Indonesia berhasil melaju ke babak semifinal Piala Asia 2026 setelah mengalahkan Korea Selatan dengan skor 2-1.</p>
    <p>Gol penentu datang dari kaki emas Marselino Ferdinan di menit 90+3, membuat seluruh penonton di Stadium Nasional meledak dalam euforia.</p>`,
    category: "Olahraga",
    author: "Budi Santoso",
    authorAvatar: "BS",
    date: "2026-04-16",
    readTime: "4 min",
    imageGradient: gradients[2],
    featured: false,
    views: 24150,
  },
  {
    id: "4",
    slug: "konser-virtual-metaverse",
    title: "Konser Virtual di Metaverse Pecahkan Rekor: 50 Juta Penonton Serentak",
    excerpt: "Kolaborasi musisi dunia dalam konser metaverse terbesar sepanjang sejarah menarik perhatian global.",
    content: `<p>Dunia hiburan digital mencatatkan sejarah baru. Konser virtual bertajuk "Unity Beyond Reality" yang digelar di platform metaverse menghadirkan lebih dari 50 juta penonton serentak dari seluruh dunia.</p>`,
    category: "Hiburan",
    author: "Diana Putri",
    authorAvatar: "DP",
    date: "2026-04-15",
    readTime: "6 min",
    imageGradient: gradients[3],
    featured: false,
    views: 18900,
  },
  {
    id: "5",
    slug: "penemuan-planet-baru",
    title: "Teleskop James Webb Temukan Planet Mirip Bumi dengan Atmosfer Beroksigen",
    excerpt: "Penemuan bersejarah ini membuka kemungkinan baru dalam pencarian kehidupan di luar tata surya.",
    content: `<p>NASA mengumumkan penemuan yang bisa mengubah pemahaman kita tentang alam semesta. Teleskop James Webb berhasil mendeteksi sebuah planet di zona layak huni bintang TRAPPIST-1 yang memiliki atmosfer dengan kandungan oksigen signifikan.</p>`,
    category: "Sains",
    author: "Prof. Handoko",
    authorAvatar: "PH",
    date: "2026-04-14",
    readTime: "7 min",
    imageGradient: gradients[4],
    featured: false,
    views: 21300,
  },
  {
    id: "6",
    slug: "kebijakan-ekonomi-hijau",
    title: "Pemerintah Luncurkan Kebijakan Ekonomi Hijau: Target Net Zero 2045",
    excerpt: "Paket kebijakan baru mencakup insentif pajak untuk industri ramah lingkungan dan pengetatan regulasi emisi karbon.",
    content: `<p>Pemerintah Indonesia resmi meluncurkan paket kebijakan ekonomi hijau yang ambisius, menargetkan pencapaian net zero emission pada tahun 2045. Kebijakan ini mencakup berbagai insentif fiskal dan non-fiskal untuk mendorong transisi energi bersih.</p>`,
    category: "Politik",
    author: "Ratna Dewi",
    authorAvatar: "RD",
    date: "2026-04-13",
    readTime: "6 min",
    imageGradient: gradients[5],
    featured: false,
    views: 9500,
  },
  {
    id: "7",
    slug: "quantum-computing-terobosan",
    title: "Terobosan Quantum Computing: Google Capai 1000 Qubit Stabil",
    excerpt: "Milestone ini membuka era baru komputasi kuantum untuk aplikasi praktis di industri farmasi dan keuangan.",
    content: `<p>Google Quantum AI mengumumkan pencapaian bersejarah: prosesor kuantum pertama dengan 1000 qubit stabil yang mampu menjalankan algoritma koreksi error secara real-time.</p>`,
    category: "Teknologi",
    author: "Ahmad Rizky",
    authorAvatar: "AR",
    date: "2026-04-12",
    readTime: "9 min",
    imageGradient: gradients[6],
    featured: false,
    views: 12800,
  },
  {
    id: "8",
    slug: "ekonomi-digital-indonesia",
    title: "Ekonomi Digital Indonesia Tembus $200 Miliar, Tertinggi di Asia Tenggara",
    excerpt: "Pertumbuhan didorong oleh adopsi fintech, e-commerce, dan layanan digital yang makin merata hingga pelosok.",
    content: `<p>Indonesia kembali mempertegas posisinya sebagai pemimpin ekonomi digital di Asia Tenggara. Laporan e-Conomy SEA 2026 dari Google, Temasek, dan Bain & Company menunjukkan nilai ekonomi digital Indonesia menembus angka $200 miliar.</p>`,
    category: "Bisnis",
    author: "Siti Nurhaliza",
    authorAvatar: "SN",
    date: "2026-04-11",
    readTime: "5 min",
    imageGradient: gradients[7],
    featured: false,
    views: 7200,
  },
  {
    id: "9",
    slug: "olimpiade-esports-resmi",
    title: "IOC Resmi Masukkan Esports sebagai Cabang Olimpiade 2028",
    excerpt: "Lima game kompetitif akan dipertandingkan untuk pertama kalinya di ajang Olimpiade Los Angeles.",
    content: `<p>International Olympic Committee (IOC) secara resmi mengumumkan bahwa esports akan menjadi cabang olahraga resmi di Olimpiade Los Angeles 2028. Lima game kompetitif telah dipilih untuk edisi pertama ini.</p>`,
    category: "Olahraga",
    author: "Budi Santoso",
    authorAvatar: "BS",
    date: "2026-04-10",
    readTime: "4 min",
    imageGradient: gradients[8],
    featured: false,
    views: 16400,
  },
  {
    id: "10",
    slug: "film-indonesia-cannes",
    title: "Film Indonesia Raih Penghargaan Tertinggi di Festival Film Cannes 2026",
    excerpt: "Karya sutradara muda asal Yogyakarta mendapat standing ovation 12 menit dan membawa pulang Palme d'Or.",
    content: `<p>Sejarah baru terukir untuk perfilman Indonesia. Film "Rasa Tanah" karya sutradara Aditya Nugraha berhasil meraih Palme d'Or di Festival Film Cannes 2026, menjadikannya film Asia Tenggara pertama yang memenangkan penghargaan tertinggi festival tersebut.</p>`,
    category: "Hiburan",
    author: "Diana Putri",
    authorAvatar: "DP",
    date: "2026-04-09",
    readTime: "5 min",
    imageGradient: gradients[9],
    featured: false,
    views: 31200,
  },
  {
    id: "11",
    slug: "fusi-nuklir-komersial",
    title: "Fusi Nuklir Komersial Selangkah Lagi: Reaktor Pertama Siap 2030",
    excerpt: "Proyek ITER akhirnya menunjukkan hasil positif, membuka jalan bagi energi bersih tak terbatas.",
    content: `<p>Proyek International Thermonuclear Experimental Reactor (ITER) di Perancis mengumumkan pencapaian milestone kritis: plasma hidrogen berhasil dipertahankan selama 300 detik pada suhu 150 juta derajat Celsius.</p>`,
    category: "Sains",
    author: "Prof. Handoko",
    authorAvatar: "PH",
    date: "2026-04-08",
    readTime: "8 min",
    imageGradient: gradients[10],
    featured: false,
    views: 19700,
  },
  {
    id: "12",
    slug: "reformasi-pendidikan-digital",
    title: "Reformasi Pendidikan Digital: Kurikulum AI Wajib untuk Seluruh Sekolah",
    excerpt: "Mulai tahun ajaran 2027, literasi AI dan computational thinking menjadi mata pelajaran wajib di seluruh jenjang pendidikan.",
    content: `<p>Kementerian Pendidikan mengumumkan reformasi kurikulum terbesar dalam satu dekade. Mulai tahun ajaran 2027, literasi kecerdasan buatan dan computational thinking akan menjadi mata pelajaran wajib untuk seluruh jenjang pendidikan di Indonesia.</p>`,
    category: "Politik",
    author: "Ratna Dewi",
    authorAvatar: "RD",
    date: "2026-04-07",
    readTime: "6 min",
    imageGradient: gradients[11],
    featured: false,
    views: 5800,
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    author: "Andi Prasetyo",
    avatar: "AP",
    date: "2026-04-18",
    content: "Artikel yang sangat informatif! Saya setuju bahwa AI akan mengubah cara kita bekerja, tapi kita perlu memastikan transisinya adil untuk semua.",
  },
  {
    id: "c2",
    author: "Maya Sari",
    avatar: "MS",
    date: "2026-04-17",
    content: "Sebagai developer, saya sudah merasakan dampak positif AI dalam pekerjaan sehari-hari. Coding assistant sangat membantu produktivitas.",
  },
  {
    id: "c3",
    author: "Raka Firmansyah",
    avatar: "RF",
    date: "2026-04-17",
    content: "Yang menarik adalah bagaimana sektor pendidikan harus beradaptasi. Anak-anak kita perlu dibekali skill yang tepat untuk era AI.",
  },
];

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, category: string, count = 3): NewsArticle[] {
  return newsArticles
    .filter((a) => a.slug !== currentSlug && a.category === category)
    .slice(0, count);
}

export function getArticlesByCategory(category: string): NewsArticle[] {
  if (category === "Semua") return newsArticles;
  return newsArticles.filter((a) => a.category === category);
}

export function getPopularArticles(count = 5): NewsArticle[] {
  return [...newsArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, count);
}

export function getLatestArticles(count = 6): NewsArticle[] {
  return [...newsArticles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
  return views.toString();
}
