// Wave 3 — items 31, 32, 34, 37, 38, 40 data.
// All wazifa ids below were verified against src/data/wazifaData.js.
// Special-page Arabic texts are standard Quran / published masnoon wordings.

export const situations = [
  { key: 'job', labelKey: 'sitJob', ids: ['rabbi-inni-lima-anzalta', 'allahummaghfir-li-warhamni-warzuqni', 'rizq-dua-ilman', 'astaghfirullah-rizq'] },
  { key: 'exams', labelKey: 'sitExams', ids: ['rabbi-zidni-ilma', 'rabbish-rahli-sadri', 'allahumma-la-sahla', 'hasbunallah'] },
  { key: 'debt', labelKey: 'sitDebt', ids: ['allahummak-fini-bihalalika', 'audhu-bika-minal-maatham-wal-maghram', 'dua-qarz-malikal-mulk', 'dua-hamm-wal-hazan'] },
  { key: 'travel', labelKey: 'sitTravel', ids: ['dua-safar-travel', 'dua-return-from-travel', 'dua-boarding-vehicle', 'dua-leaving-home'] },
  { key: 'illness', labelKey: 'sitIllness', ids: ['shifa-dua', 'surah-al-fatihah', 'dua-for-pain', 'asalullahal-azim-shifa', 'ruqyah-jibreel'] },
  { key: 'rizq', labelKey: 'sitRizq', ids: ['astaghfirullah-rizq', 'rizq-dua-ilman', 'rabbi-inni-lima-anzalta', 'allahummak-fini-bihalalika'] },
  { key: 'anxiety', labelKey: 'sitAnxiety', ids: ['dua-yunus', 'hasbunallah', 'ya-hayyu-ya-qayyum', 'dua-hamm-wal-hazan'] },
  { key: 'marriage', labelKey: 'sitMarriage', ids: ['rabbi-la-tadharni-farda', 'dua-for-parents'] }
]

// Item 32 — Hisnul Muslim mini-collection. `adhkar` chapters link to the
// existing guided sets; `ids` chapters list seed wazaif from the library.
export const hisnulChapters = [
  { key: 'morning', labelKey: 'hisnulMorning', adhkar: 'morning' },
  { key: 'evening', labelKey: 'hisnulEvening', adhkar: 'evening' },
  { key: 'waking', labelKey: 'hisnulWaking', ids: ['dua-waking-up'] },
  { key: 'sleeping', labelKey: 'hisnulSleeping', ids: ['dua-before-sleep', 'ayat-ul-kursi', 'tasbih-fatimah', 'surah-al-mulk'] },
  { key: 'leavingHome', labelKey: 'hisnulLeavingHome', ids: ['dua-leaving-home'] },
  { key: 'enteringHome', labelKey: 'hisnulEnteringHome', ids: ['dua-entering-home'] },
  { key: 'enteringMosque', labelKey: 'hisnulEnteringMosque', ids: ['dua-entering-masjid'] },
  { key: 'leavingMosque', labelKey: 'hisnulLeavingMosque', ids: ['dua-leaving-masjid'] },
  { key: 'afterPrayer', labelKey: 'hisnulAfterPrayer', ids: ['tasbih-fatimah', 'ayat-ul-kursi', 'third-kalima'] },
  { key: 'anxiety', labelKey: 'hisnulAnxiety', ids: ['dua-hamm-wal-hazan', 'dua-yunus', 'ya-hayyu-ya-qayyum'] },
  { key: 'debt', labelKey: 'hisnulDebt', ids: ['allahummak-fini-bihalalika', 'audhu-bika-minal-maatham-wal-maghram', 'dua-qarz-malikal-mulk'] }
]

// Item 40 — Mood → dua matcher. All ids verified in wazifaData.js.
export const moodMap = [
  { key: 'anxious', labelKey: 'moodAnxious', ids: ['dua-yunus', 'hasbunallah', 'ya-hayyu-ya-qayyum'] },
  { key: 'sad', labelKey: 'moodSad', ids: ['dua-hamm-wal-hazan', 'la-hawla', 'subhanallahi-wa-bihamdihi'] },
  { key: 'grateful', labelKey: 'moodGrateful', ids: ['third-kalima', 'kalima-tayyiba', 'tasbih-fatimah'] },
  { key: 'angry', labelKey: 'moodAngry', ids: ['dua-when-angry', 'la-hawla'] },
  { key: 'money', labelKey: 'moodMoney', ids: ['allahummak-fini-bihalalika', 'rabbi-inni-lima-anzalta', 'astaghfirullah-rizq'] },
  { key: 'ill', labelKey: 'moodIll', ids: ['shifa-dua', 'surah-al-fatihah', 'asalullahal-azim-shifa'] },
  { key: 'sleep', labelKey: 'moodSleep', ids: ['dua-before-sleep', 'ayat-ul-kursi', 'tasbih-fatimah'] },
  { key: 'courage', labelKey: 'moodCourage', ids: ['hasbunallah', 'rabbish-rahli-sadri', 'allahumma-inna-najaluka'] }
]

// Item 34 — dua for the deceased (Sahih Muslim 963), with a {name}
// placeholder the page fills in for the transliteration and translation.
export const deceasedDua = {
  arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ وَأَدْخِلْهُ الْجَنَّةَ وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَمِنْ عَذَابِ النَّارِ',
  transliteration: "Allahummaghfir lahu warhamhu wa 'afihi wa'fu 'anhu, wa akrim nuzulahu wa wassi' mudkhalahu, waghsilhu bil-ma'i wath-thalji wal-barad, wa naqqihi minal-khataya kama naqqaytath-thawbal-abyada minad-danas, wa abdilhu daran khayran min darihi wa ahlan khayran min ahlihi wa zawjan khayran min zawjihi, wa adkhilhul-jannata wa a'idhhu min 'adhabil-qabri wa min 'adhabin-nar.",
  english: 'O Allah, forgive him and have mercy on him, grant him health and pardon him, honour his resting place and widen his entrance, wash him with water, snow and hail, and cleanse him of sins as a white garment is cleansed of dirt. Replace his home with a better home, his family with a better family, and his spouse with a better spouse. Admit him into Paradise and protect him from the punishment of the grave and the punishment of the Fire.',
  urdu: 'اے اللہ! اسے بخش دے اور اس پر رحم فرما، اسے عافیت دے اور اس سے درگزر فرما، اس کی مہمان نوازی باعزت فرما اور اس کی قبر کشادہ فرما، اسے پانی، برف اور اولوں سے دھو دے، اور اسے گناہوں سے اس طرح پاک فرما جیسے سفید کپڑا میل سے پاک کیا جاتا ہے۔ اسے اس کے گھر سے بہتر گھر، اس کے اہل سے بہتر اہل اور اس کے جوڑے سے بہتر جوڑا عطا فرما، اسے جنت میں داخل فرما اور اسے قبر اور آگ کے عذاب سے بچا۔',
  reference: 'Sahih Muslim 963 — the dua of the Prophet ﷺ at a funeral'
}

// Item 37 — the dua of Hannah (AS), mother of Maryam (AS), Quran 3:35.
export const hannahDua = {
  arabic: 'رَبِّ إِنِّي نَذَرْتُ لَكَ مَا فِي بَطْنِي مُحَرَّرًا فَتَقَبَّلْ مِنِّي ۖ إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
  transliteration: "Rabbi inni nadhartu laka ma fi batni muharraran fataqabbal minni, innaka Antas-Sami'ul-'Alim.",
  english: 'My Lord, I have pledged to You what is in my womb, devoted (to Your service), so accept it from me. Indeed, You are the All-Hearing, the All-Knowing.',
  urdu: 'اے میرے رب! میں نے تیرے لیے اس کی نذر مانی ہے جو میرے پیٹ میں ہے، (دنیا سے) آزاد کر کے، پس تو مجھ سے قبول فرما۔ بے شک تو ہی سننے والا، جاننے والا ہے۔',
  reference: 'Quran 3:35 — the dua of Hannah (AS), mother of Maryam (AS)'
}

// Item 37 — protection dua for children, as the Prophet ﷺ used for
// Hasan and Husain (RA) (Sahih al-Bukhari 3371, plural form).
export const childrenProtectionDua = {
  arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
  transliteration: "U'idhukuma bikalimatillahit-tammati min kulli shaytanin wa hammah, wa min kulli 'aynin lammah.",
  english: 'I seek protection for you both in the perfect words of Allah, from every devil and every poisonous creature, and from every harmful eye.',
  urdu: 'میں تم دونوں کے لیے اللہ کے کامل کلمات کی پناہ مانگتا ہوں، ہر شیطان اور ہر زہریلے جانور سے، اور ہر نقصان پہنچانے والی نظر سے۔',
  reference: 'Sahih al-Bukhari 3371 — the Prophet ﷺ sought protection for Hasan and Husain (RA) with these words'
}

// Item 38 — dua for harmony between hearts / spouses (Abu Dawud 969) and
// the wedding congratulation taught by the Prophet ﷺ (Abu Dawud 2130).
export const spouseHarmonyDua = {
  arabic: 'اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا وَأَصْلِحْ ذَاتَ بَيْنِنَا وَاهْدِنَا سُبُلَ السَّلَامِ',
  transliteration: "Allahumma allif bayna qulubina, wa aslih dhata baynina, wahdina subulas-salam.",
  english: 'O Allah, join our hearts together, set right our mutual relations, and guide us to the paths of peace.',
  urdu: 'اے اللہ! ہمارے دلوں میں الفت پیدا فرما، ہمارے آپس کے تعلقات درست فرما، اور ہمیں سلامتی کے راستوں کی ہدایت عطا فرما۔',
  reference: 'Abu Dawud 969 — a dua the Prophet ﷺ taught for unity and reconciliation'
}

export const weddingDua = {
  arabic: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
  transliteration: "Barakallahu laka, wa baraka 'alayka, wa jama'a baynakuma fi khayr.",
  english: 'May Allah bless you, shower His blessings upon you, and join you both together in goodness.',
  urdu: 'اللہ تمہیں برکت دے، تم پر برکت نازل فرمائے، اور تم دونوں کو بھلائی پر جمع فرمائے۔',
  reference: 'Abu Dawud 2130, At-Tirmidhi 1091 — the congratulation the Prophet ﷺ gave to a newly married man'
}
