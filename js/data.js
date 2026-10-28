// File: js/data.js

const membersData = [
  {
    id: 'duta',
    name: 'Akhdiyat Duta Modjo',
    stageName: 'Duta',
    role: 'Vokalis Utama',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    bio: 'Duta adalah vokalis utama Sheila On 7 sejak pertama kali dibentuk pada tahun 1996 di Yogyakarta. Karakter suaranya yang khas, hangat, dan gaya panggungnya yang ramah serta membumi telah menjadi ciri ikonis Sheila On 7.',
    contributions: 'Vokal utama pada seluruh 9 album studio, pencipta beberapa hit sentimental, dan penggerak energi panggung.'
  },
  {
    id: 'eross',
    name: 'Eross Candra',
    stageName: 'Eross',
    role: 'Gitaris Utama & Pencipta Lagu',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    bio: 'Eross Candra adalah gitaris utama sekaligus penulis lagu utama Sheila On 7. Sentuhan riff gitar pop-rock melankolis dan lirik ciptaannya yang jujur menjadi nyawa utama dalam melodi lagu-lagu legendaris SO7.',
    contributions: 'Pencipta mayoritas hits besar seperti "Dan", "Sephia", "Melompat Lebih Tinggi", dan "Kisah Klasik".'
  },
  {
    id: 'adam',
    name: 'Adam Muhammad Subarkah',
    stageName: 'Adam',
    role: 'Bassis & Pendiri',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    bio: 'Adam Muhammad Subarkah adalah bassis dan salah satu pendiri awal Sheila On 7. Selain memegang ritme bass yang solid dan melodi, Adam juga aktif mengelola aspek manajerial internal band.',
    contributions: 'Pilar ritme bass dalam setiap penampilan live dan menjaga keberlangsungan manajemen band.'
  },
  {
    id: 'brian',
    name: 'Brian Kresna Putro',
    stageName: 'Brian',
    role: 'Mantan Drummer (2004 - 2022)',
    status: 'former',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Brian bergabung sebagai drummer Sheila On 7 pada tahun 2004 menggantikan posisi Anton. Ia turut mengisi dentuman drum dalam album Pejantan Tangguh hingga Musim Yang Baik sebelum berpisah secara baik-baik pada 2022.',
    contributions: 'Mengisi bagian drum untuk album 507, Menentukan Arah, Berlayar, dan Musim Yang Baik.'
  },
  {
    id: 'anton',
    name: 'Anton Widiastanto',
    stageName: 'Anton',
    role: 'Mantan Drummer (1996 - 2004)',
    status: 'former',
    image: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=600&q=80',
    bio: 'Anton Widiastanto adalah drummer pertama Sheila On 7 dari era awal Yogyakarta hingga era kejayaan album debut dan Kisah Klasik Untuk Masa Depan.',
    contributions: 'Drummer era emas album debut (1999), Kisah Klasik (2000), dan 07 Des (2002).'
  }
];

const albumsData = [
  {
    id: 'album-1999',
    title: 'Sheila On 7',
    year: 1999,
    decade: '1990s',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    description: 'Album debut self-titled yang mengguncang industri musik Indonesia dengan penjualan lebih dari 1 juta Kopi.',
    tracks: [
      'Kita',
      'Dan',
      'Anugerah Terindah Yang Pernah Kumiliki',
      'J.A.P (Jadikan Aku Pacarmu)',
      'Perhatikan, Rani!'
    ]
  },
  {
    id: 'album-2000',
    title: 'Kisah Klasik Untuk Masa Depan',
    year: 2000,
    decade: '2000s',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    description: 'Album studio kedua yang meraih status Multi-Platinum dengan hit fenomenal Sephia dan Sahabat Sejati.',
    tracks: [
      'Sahabat Sejati',
      'Bila Kau Mati',
      'Tunjuk Satu Bintang',
      'Kisah Klasik Untuk Masa Depan',
      'Sephia'
    ]
  },
  {
    id: 'album-2002',
    title: '07 Des',
    year: 2002,
    decade: '2000s',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    description: 'Menampilkan pendewasaan aransemen musik pop rock dengan hits Seberapa Pantas dan Pria Kesepian.',
    tracks: [
      'Tunjukkan Padaku',
      'Hingga Ujung Waktu',
      'Seberapa Pantas',
      'Pria Kesepian',
      'Saat Aku Lanjut Usia'
    ]
  },
  {
    id: 'album-2003',
    title: 'OST. 30 Hari Mencari Cinta',
    year: 2003,
    decade: '2000s',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80',
    description: 'Soundtrack film populer yang melahirkan salah satu lagu berenergi tinggi paling ikonis: Melompat Lebih Tinggi.',
    tracks: [
      'Melompat Lebih Tinggi',
      'Berhenti Berharap',
      'Menyelamatkan Mu',
      'J.A.P (Movie Version)'
    ]
  },
  {
    id: 'album-2004',
    title: 'Pejantan Tangguh',
    year: 2004,
    decade: '2000s',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80',
    description: 'Album eksploratif dengan sentuhan rock energik dan riff gitar kencang.',
    tracks: [
      'Pejantan Tangguh',
      'Itu Aku',
      'Pemuja Rahasia',
      'Tunggulah Aku Di Jakartamu',
      'Generasi Patah Hati'
    ]
  },
  {
    id: 'album-2006',
    title: '507',
    year: 2006,
    decade: '2000s',
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    description: 'Album kelima yang menandai awal masa transisi formasi baru dengan lagu hits Radio.',
    tracks: [
      'Radio',
      'Pemenang',
      'Terimakasih Bijaksana',
      'Mantan Kekasih'
    ]
  },
  {
    id: 'album-2008',
    title: 'Menentukan Arah',
    year: 2008,
    decade: '2000s',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    description: 'Album bernuansa hangat dan introspektif dengan lagu populer Betapa dan Yang Terlewatkan.',
    tracks: [
      'Betapa',
      'Yang Terlewatkan',
      'Ibu Jenny',
      'Mudah Saja',
      'Arah'
    ]
  },
  {
    id: 'album-2011',
    title: 'Berlayar',
    year: 2011,
    decade: '2010s',
    cover: 'https://images.unsplash.com/photo-1442504028989-ab58b5f29a4a?auto=format&fit=crop&w=600&q=80',
    description: 'Menghadirkan musik pop retro modern yang segar dengan single utama Hari Bersamanya.',
    tracks: [
      'Hari Bersamanya',
      'Pasti Ku Bisa',
      'Hujan Deras',
      'On the Phone',
      'Berlayar'
    ]
  },
  {
    id: 'album-2014',
    title: 'Musim Yang Baik',
    year: 2014,
    decade: '2010s',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    description: 'Album berkonsep rekaman analog live take empat personel yang memenangkan berbagai penghargaan.',
    tracks: [
      'Lapang Dada',
      'Musim Yang Baik',
      'Selamat Datang',
      'Canggung',
      'Beruntungnya Aku'
    ]
  }
];

const tracksData = [
  {
    title: 'Dan',
    album: 'Sheila On 7 (1999)',
    mood: 'Sedih',
    freq: 220,
    src: 'audio/dan.mp3',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Sephia',
    album: 'Kisah Klasik Untuk Masa Depan (2000)',
    mood: 'Nostalgia',
    freq: 247,
    src: 'audio/sephia.mp3',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Melompat Lebih Tinggi',
    album: 'OST. 30 Hari Mencari Cinta (2003)',
    mood: 'Semangat',
    freq: 330,
    src: 'audio/melompat-lebih-tinggi.mp3',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Anugerah Terindah Yang Pernah Kumiliki',
    album: 'Sheila On 7 (1999)',
    mood: 'Bahagia',
    freq: 349,
    src: 'audio/anugerah-terindah.mp3',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Lapang Dada',
    album: 'Musim Yang Baik (2014)',
    mood: 'Santai',
    freq: 311,
    src: 'audio/lapang-dada.mp3',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80'
  }
];

const galleryData = [
  {
    title: 'Atmosfer Konser Tunggal',
    category: 'concert',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Sesi Latihan Studio Vintage',
    category: 'behind',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Poster Konser Era 2000-an',
    category: 'poster',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Lautan Cahaya Penonton',
    category: 'concert',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Di Balik Layar Tur',
    category: 'behind',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Koleksi Kaset Fisik Vintage',
    category: 'poster',
    image: 'https://images.unsplash.com/photo-1539386117205-5938854c3c2f?auto=format&fit=crop&w=800&q=80'
  }
];

const articlesData = [
  {
    id: 'art-1',
    title: 'Mengenang Era Golden 2000-an: Mengapa Album "Kisah Klasik" Tetap Abadi',
    date: '14 Oktober 2026',
    summary: 'Ulasan mendalam mengenai aspek produksi dan magis penulisan lirik yang membuat album kedua Sheila On 7 menjadi milestone musik pop Indonesia.',
    content: 'Pada pergantian milenium, Sheila On 7 meluncurkan album "Kisah Klasik Untuk Masa Depan" yang tidak hanya menjadi hits di Indonesia tetapi juga merambah Asia Tenggara. Lirik ciptaan Eross Candra yang puitis namun lugas berpadu dengan ritme yang ramah di telinga, menjadikan lagu-lagu seperti Sephia dan Sahabat Sejati soundtrack abadi kehidupan generasi sekolah saat itu.'
  },
  {
    id: 'art-2',
    title: 'Filosofi Kesederhanaan di Atas Panggung: Pesona Membumi Personel SO7',
    date: '2 September 2026',
    summary: 'Bagaimana Duta dan kawan-kawan mempertahankan keramahan serta gaya hidup membumi Yogyakarta di tengah ketenaran raksasa.',
    content: 'Salah satu daya tarik terbesar Sheila On 7 yang membuatnya dicintai lintas generasi adalah kesederhanaan para personelnya. Meskipun telah menjual jutaan kopi album fisik dan manggung di ribuan tempat, karakter ramah Khas Jogja tidak pernah luntur dari cara berinteraksi mereka dengan penggemar.'
  },
  {
    id: 'art-3',
    title: 'Racikan Riff Gitar Eross Candra yang Menjadi Identitas Pop-Rock Indonesia',
    date: '18 Agustus 2026',
    summary: 'Bedah teknik melodi gitar melankolis catchy yang memberi nyawa pada setiap tembang hits Sheila On 7.',
    content: 'Riff gitar intro lagu-lagu Sheila On 7 seperti "Dan" atau "Seberapa Pantas" langsung dapat dikenali hanya dalam hitungan detik pertama. Kejelian Eross Candra memadukan pengaruh rock klasik dengan hook pop yang manis menjadikannya salah satu gitaris paling berpengaruh di tanah air.'
  }
];

const defaultMemories = [
  {
    name: 'Rian Sheila Gank',
    song: 'Sahabat Sejati',
    text: 'Lagu ini diputar waktu perpisahan SMA 2005. Tiap dengar ritmenya selalu ingat teman-teman sekelas.'
  },
  {
    name: 'Nadia',
    song: 'Anugerah Terindah',
    text: 'Ditembak pacar (sekarang suami) pakai lagu ini pas zaman kuliah. Kenangan yang tak terhapuskan.'
  }
];

const pollData = [
  { song: 'Dan', votes: 1420 },
  { song: 'Sephia', votes: 1180 },
  { song: 'Melompat Lebih Tinggi', votes: 980 },
  { song: 'Sahabat Sejati', votes: 1310 }
];

