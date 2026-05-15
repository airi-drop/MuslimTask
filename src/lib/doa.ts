export type DoaCategory = "Harian" | "Makan" | "Tidur" | "Perjalanan" | "Ibadah" | "Lainnya";

export const DOA_CATEGORIES: DoaCategory[] = [
  "Harian",
  "Makan",
  "Tidur",
  "Perjalanan",
  "Ibadah",
  "Lainnya",
];

export type DoaItem = {
  id: string;
  category: DoaCategory;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
};

export const DOA_LIST: DoaItem[] = [
  // === Harian ===
  {
    id: "keluar-rumah",
    category: "Harian",
    title: "Doa Keluar Rumah",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin: "Bismillahi tawakkaltu 'alallah, la haula wa la quwwata illa billah.",
    translation: "Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.",
    source: "HR. Abu Dawud & Tirmidzi",
  },
  {
    id: "masuk-rumah",
    category: "Harian",
    title: "Doa Masuk Rumah",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    latin: "Bismillahi walajna, wa bismillahi kharajna, wa 'alallahi rabbina tawakkalna.",
    translation: "Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Allah Tuhan kami, kami bertawakkal.",
    source: "HR. Abu Dawud",
  },
  {
    id: "bercermin",
    category: "Harian",
    title: "Doa Bercermin",
    arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
    latin: "Allahumma anta hassanta khalqi fa hassin khuluqi.",
    translation: "Ya Allah, Engkau telah membaguskan ciptaanku, maka baguskanlah pula akhlakku.",
    source: "HR. Ahmad",
  },
  {
    id: "masuk-kamar-mandi",
    category: "Harian",
    title: "Doa Masuk Kamar Mandi",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    latin: "Allahumma inni a'udzu bika minal khubutsi wal khaba'its.",
    translation: "Ya Allah, aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan.",
    source: "HR. Bukhari & Muslim",
  },

  // === Makan ===
  {
    id: "sebelum-makan",
    category: "Makan",
    title: "Doa Sebelum Makan",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ بِسْمِ اللَّهِ",
    latin: "Allahumma bariklana fima razaqtana waqina 'adzaban-nar, bismillah.",
    translation: "Ya Allah, berkahilah kami dalam rezeki yang Engkau berikan dan jagalah kami dari siksa api neraka. Dengan nama Allah.",
    source: "HR. Ibnu Sunni",
  },
  {
    id: "sesudah-makan",
    category: "Makan",
    title: "Doa Sesudah Makan",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    latin: "Alhamdulillahil-ladzi ath'amana wa saqana wa ja'alana muslimin.",
    translation: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami sebagai muslim.",
    source: "HR. Abu Dawud & Tirmidzi",
  },
  {
    id: "lupa-berdoa-makan",
    category: "Makan",
    title: "Doa Lupa Membaca Bismillah",
    arabic: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
    latin: "Bismillahi awwalahu wa akhirahu.",
    translation: "Dengan nama Allah pada awalnya dan akhirnya.",
    source: "HR. Abu Dawud & Tirmidzi",
  },
  {
    id: "minum-susu",
    category: "Makan",
    title: "Doa Setelah Minum Susu",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ",
    latin: "Allahumma barik lana fihi wa zidna minhu.",
    translation: "Ya Allah, berkahilah kami padanya dan tambahkanlah untuk kami.",
    source: "HR. Tirmidzi",
  },

  // === Tidur ===
  {
    id: "sebelum-tidur",
    category: "Tidur",
    title: "Doa Sebelum Tidur",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismika Allahumma amutu wa ahya.",
    translation: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
    source: "HR. Bukhari",
  },
  {
    id: "bangun-tidur",
    category: "Tidur",
    title: "Doa Bangun Tidur",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahil-ladzi ahyana ba'da ma amatana wa ilaihin-nusyur.",
    translation: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami akan dibangkitkan.",
    source: "HR. Bukhari",
  },
  {
    id: "susah-tidur",
    category: "Tidur",
    title: "Doa Sulit Tidur",
    arabic: "اللَّهُمَّ غَارَتِ النُّجُومُ وَهَدَأَتِ الْعُيُونُ وَأَنْتَ حَيٌّ قَيُّومٌ",
    latin: "Allahumma gharatin-nujum wa hada'atil-'uyun wa anta hayyun qayyum.",
    translation: "Ya Allah, bintang-bintang telah tenggelam, mata-mata telah tenang, dan Engkau Maha Hidup lagi Maha Berdiri Sendiri.",
    source: "HR. Ibnu Sunni",
  },
  {
    id: "mimpi-buruk",
    category: "Tidur",
    title: "Doa Setelah Mimpi Buruk",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ",
    latin: "A'udzu bikalimatillahit-tammati min ghadhabihi wa 'iqabihi wa syarri 'ibadihi.",
    translation: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kemurkaan-Nya, hukuman-Nya, dan kejahatan hamba-hamba-Nya.",
    source: "HR. Abu Dawud",
  },

  // === Perjalanan ===
  {
    id: "naik-kendaraan",
    category: "Perjalanan",
    title: "Doa Naik Kendaraan",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ",
    latin: "Subhanalladzi sakhkhara lana hadza wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun.",
    translation: "Maha Suci Dzat yang telah menundukkan ini untuk kami, padahal kami tidak mampu menguasainya. Dan sesungguhnya kami akan kembali kepada Tuhan kami.",
    source: "QS. Az-Zukhruf: 13-14",
  },
  {
    id: "bepergian",
    category: "Perjalanan",
    title: "Doa Bepergian",
    arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ وَمِنَ الْعَمَلِ مَا تَرْضَىٰ",
    latin: "Allahumma inna nas'aluka fi safarina hadza al-birra wat-taqwa wa minal 'amali ma tardha.",
    translation: "Ya Allah, kami memohon kepada-Mu dalam perjalanan ini kebaikan, takwa, dan amal yang Engkau ridhai.",
    source: "HR. Muslim",
  },
  {
    id: "sampai-tujuan",
    category: "Perjalanan",
    title: "Doa Sampai di Tujuan",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    latin: "A'udzu bikalimatillahit-tammati min syarri ma khalaq.",
    translation: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk-Nya.",
    source: "HR. Muslim",
  },
  {
    id: "pulang-perjalanan",
    category: "Perjalanan",
    title: "Doa Pulang dari Perjalanan",
    arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
    latin: "Ayibuna ta'ibuna 'abiduna lirabbina hamidun.",
    translation: "Kami kembali, bertaubat, beribadah, dan memuji Tuhan kami.",
    source: "HR. Muslim",
  },

  // === Ibadah ===
  {
    id: "masuk-masjid",
    category: "Ibadah",
    title: "Doa Masuk Masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allahummaf-tah li abwaba rahmatik.",
    translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
    source: "HR. Muslim",
  },
  {
    id: "keluar-masjid",
    category: "Ibadah",
    title: "Doa Keluar Masjid",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    latin: "Allahumma inni as'aluka min fadhlika.",
    translation: "Ya Allah, aku memohon kepada-Mu sebagian dari karunia-Mu.",
    source: "HR. Muslim",
  },
  {
    id: "setelah-adzan",
    category: "Ibadah",
    title: "Doa Setelah Adzan",
    arabic: "اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ",
    latin: "Allahumma rabba hadzihi-d-da'watit-tammah, was-shalatil-qa'imah, ati Muhammadanil-wasilata wal-fadhilah.",
    translation: "Ya Allah, Tuhan pemilik seruan yang sempurna ini dan salat yang akan didirikan, berikanlah kepada Muhammad wasilah dan keutamaan.",
    source: "HR. Bukhari",
  },
  {
    id: "setelah-wudhu",
    category: "Ibadah",
    title: "Doa Setelah Wudhu",
    arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    latin: "Asyhadu an la ilaha illallahu wahdahu la syarika lah, wa asyhadu anna Muhammadan 'abduhu wa rasuluh.",
    translation: "Aku bersaksi bahwa tiada Tuhan selain Allah semata, tiada sekutu bagi-Nya. Dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
    source: "HR. Muslim",
  },

  // === Lainnya ===
  {
    id: "bersin",
    category: "Lainnya",
    title: "Doa Setelah Bersin",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillah.",
    translation: "Segala puji bagi Allah.",
    source: "HR. Bukhari",
  },
  {
    id: "menjenguk-orang-sakit",
    category: "Lainnya",
    title: "Doa Menjenguk Orang Sakit",
    arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
    latin: "As'alullaha al-'azhim, rabbal 'arsyil 'azhim, an yasyfiyak.",
    translation: "Aku memohon kepada Allah Yang Maha Agung, Tuhan Arsy yang agung, agar menyembuhkanmu.",
    source: "HR. Abu Dawud & Tirmidzi",
  },
  {
    id: "ketika-hujan",
    category: "Lainnya",
    title: "Doa Ketika Hujan",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    latin: "Allahumma shayyiban nafi'an.",
    translation: "Ya Allah, turunkanlah hujan yang bermanfaat.",
    source: "HR. Bukhari",
  },
  {
    id: "ketika-marah",
    category: "Lainnya",
    title: "Doa Ketika Marah",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    latin: "A'udzu billahi minasy-syaithanir-rajim.",
    translation: "Aku berlindung kepada Allah dari setan yang terkutuk.",
    source: "HR. Bukhari & Muslim",
  },
];
