// Wave 3 — item 21: Tasbih preset library, and item 23: Durood hub data.
// Preset keys are the dhikrLog keys used for per-dhikr totals (item 27).
// Virtues lines only state what is reported in well-known hadith, worded
// carefully. Durood source notes are honest: only Durood-e-Ibrahimi is a
// hadith text; the others are famous traditional salawat composed by
// scholars — sending salawat itself is commanded in Quran 33:56.

export const dhikrPresets = [
  { key: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', english: 'Glory be to Allah', urdu: 'اللہ پاک ہے', target: 33, virtues: 'Part of the words most beloved to Allah (Sahih Muslim 2137).' },
  { key: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', english: 'All praise is for Allah', urdu: 'سب تعریف اللہ کے لیے ہے', target: 33, virtues: 'It fills the scale (Sahih Muslim 223).' },
  { key: 'allahu-akbar', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', english: 'Allah is the Greatest', urdu: 'اللہ سب سے بڑا ہے', target: 33, virtues: 'Part of the words most beloved to Allah (Sahih Muslim 2137).' },
  { key: 'la-ilaha-illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', english: 'There is no god except Allah', urdu: 'اللہ کے سوا کوئی معبود نہیں', target: 100, virtues: 'The best of dhikr (At-Tirmidhi 3383).' },
  { key: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', english: 'I seek Allah\'s forgiveness', urdu: 'میں اللہ سے بخشش مانگتا ہوں', target: 100, virtues: 'Whoever seeks forgiveness often, Allah grants him a way out of every hardship and provision from where he does not expect (Abu Dawud 1518).' },
  { key: 'la-hawla', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'La hawla wa la quwwata illa billah', english: 'There is no power or strength except with Allah', urdu: 'اللہ کے سوا نہ کوئی طاقت ہے اور نہ قوت', target: 100, virtues: 'A treasure from the treasures of Paradise (Sahih al-Bukhari 6384).' },
  { key: 'subhanallah-bihamdihi', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', transliteration: 'SubhanAllahi wa bihamdihi', english: 'Glory be to Allah and praise Him', urdu: 'اللہ پاک ہے اور اسی کی تعریف ہے', target: 100, virtues: 'Said 100 times a day, sins are forgiven even if like the foam of the sea (Sahih al-Bukhari 6405).' },
  { key: 'subhanallahil-azeem', arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ', transliteration: 'SubhanAllahil Azeem', english: 'Glory be to Allah, the Most Great', urdu: 'اللہ پاک ہے جو سب سے عظیم ہے', target: 100, virtues: 'Two words light on the tongue, heavy on the scale, beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil Azeem (Sahih al-Bukhari 6682).' },
  { key: 'durood', arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', transliteration: 'Allahumma salli \'ala Muhammad', english: 'O Allah, send blessings upon Muhammad', urdu: 'اے اللہ! محمد ﷺ پر رحمت نازل فرما', target: 100, virtues: 'Whoever sends one blessing upon the Prophet ﷺ, Allah sends ten upon him (Sahih Muslim 408).' },
  { key: 'hasbunallah', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', transliteration: 'Hasbunallah wa ni\'mal Wakeel', english: 'Allah is sufficient for us, and He is the best Disposer of affairs', urdu: 'ہمارے لیے اللہ کافی ہے اور وہ بہترین کارساز ہے', target: 100, virtues: 'The words of the companions when threatened (Quran 3:173).' },
  { key: 'ya-hayyu-ya-qayyum', arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', transliteration: 'Ya Hayyu Ya Qayyum, birahmatika astaghith', english: 'O Ever-Living, O Sustainer of all, by Your mercy I seek help', urdu: 'اے زندہ، اے قائم رکھنے والے! تیری رحمت سے فریاد کرتا ہوں', target: 100, virtues: 'Advised by the Prophet ﷺ to Fatima (RA) for morning and evening (At-Tirmidhi 3524).' },
  { key: 'la-ilaha-illa-anta', arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', transliteration: 'La ilaha illa Anta, Subhanaka, inni kuntu minaz-zalimin', english: 'There is no god except You; glory be to You. Indeed I have been of the wrongdoers', urdu: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا', target: 100, virtues: 'The dua of Yunus (AS); no Muslim asks with it except that Allah answers him (At-Tirmidhi 3505).' }
]

export function presetByKey(key) {
  return dhikrPresets.find((p) => p.key === key) || null
}

// A preset becomes a wazifa-shaped object so the existing TasbihCounter and
// routines table can run it unchanged (routine id: `preset-<key>`).
export function presetWazifa(preset) {
  return {
    id: `preset-${preset.key}`,
    title: preset.transliteration,
    category: 'Daily Adhkar',
    arabic: preset.arabic,
    transliteration: preset.transliteration,
    english_translation: preset.english,
    urdu_translation: preset.urdu,
    target_count: preset.target,
    recommended_time: 'Any Time',
    reference: preset.virtues,
    instructions: '',
    keywords: []
  }
}

// Item 23 — Durood hub. Texts are the widely published versions; Taj and
// Akbar are very long litanies, so their commonly published opening
// sections are shown and labelled as such.
export const duroodList = [
  {
    id: 'ibrahimi',
    name: 'Durood-e-Ibrahimi',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ ۝ اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidum-Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidum-Majid.",
    english: 'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim; indeed You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; indeed You are Praiseworthy and Glorious.',
    urdu: 'اے اللہ! محمد ﷺ اور آلِ محمد ﷺ پر رحمت نازل فرما جیسے تو نے ابراہیم علیہ السلام اور آلِ ابراہیم پر رحمت نازل فرمائی، بے شک تو تعریف کے لائق، بزرگی والا ہے۔ اے اللہ! محمد ﷺ اور آلِ محمد ﷺ پر برکت نازل فرما جیسے تو نے ابراہیم علیہ السلام اور آلِ ابراہیم پر برکت نازل فرمائی، بے شک تو تعریف کے لائق، بزرگی والا ہے۔',
    source: 'The salawat taught by the Prophet ﷺ himself and recited in every prayer — reported in Sahih al-Bukhari 3370 and Sahih Muslim.',
    target: 100
  },
  {
    id: 'sallallahu-ala-muhammad',
    name: 'Sallallahu Ala Muhammad (short)',
    arabic: 'صَلَّى اللَّهُ عَلَىٰ مُحَمَّدٍ',
    transliteration: 'Sallallahu \'ala Muhammad',
    english: 'May Allah send blessings upon Muhammad',
    urdu: 'اللہ تعالیٰ محمد ﷺ پر رحمت نازل فرمائے',
    source: 'The shortest form of salawat. Sending blessings on the Prophet ﷺ is commanded in Quran 33:56, and one blessing is reported to bring ten from Allah (Sahih Muslim 408).',
    target: 100
  },
  {
    id: 'tunajjina',
    name: 'Durood-e-Tunajjina',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ ۝ وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ ۝ وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ ۝ وَتَرْفَعُنَا بِهَا عِنْدَكَ أَعْلَى الدَّرَجَاتِ ۝ وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ مِنْ جَمِيعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ',
    transliteration: "Allahumma salli 'ala sayyidina Muhammadin salatan tunjina biha min jami'il-ahwali wal-afat, wa taqdi lana biha jami'al-hajat, wa tutahhiruna biha min jami'is-sayyi'at, wa tarfa'una biha 'indaka a'lad-darajat, wa tuballighuna biha aqsal-ghayati min jami'il-khayrati fil-hayati wa ba'dal-mamat.",
    english: 'O Allah, send blessings upon our master Muhammad — a blessing by which You deliver us from all terrors and calamities, fulfil for us all our needs, purify us from all sins, raise us to the highest ranks in Your presence, and bring us to the furthest goals of all good, in life and after death.',
    urdu: 'اے اللہ! ہمارے سردار محمد ﷺ پر ایسی رحمت نازل فرما جس کے ذریعے تو ہمیں تمام خوف اور آفتوں سے نجات دے، ہماری تمام حاجتیں پوری فرما دے، ہمیں تمام گناہوں سے پاک کر دے، ہمیں اپنے ہاں بلند ترین درجات عطا فرما دے، اور زندگی میں اور موت کے بعد تمام بھلائیوں کی انتہا تک پہنچا دے۔',
    source: 'A famous traditional salawat (also called Salat al-Munjiyya), transmitted in later scholarly works and commonly attributed to Shaykh Musa al-Darir. It is not a hadith text itself — its wording is a composed prayer for blessings, and sending salawat is commanded in Quran 33:56.',
    target: 100
  },
  {
    id: 'fath',
    name: 'Durood-e-Fath (Salat al-Fatih)',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَىٰ صِرَاطِكَ الْمُسْتَقِيمِ وَعَلَىٰ آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ',
    transliteration: "Allahumma salli wa sallim wa barik 'ala sayyidina Muhammadinil-fatihi lima ughliqa wal-khatimi lima sabaqa, nasiril-haqqi bil-haqqi wal-hadi ila siratikal-mustaqim, wa 'ala alihi haqqa qadrihi wa miqdarihil-'azeem.",
    english: 'O Allah, send prayers, peace and blessings upon our master Muhammad — the opener of what was closed, the seal of what came before, the helper of truth by the truth, and the guide to Your straight path — and upon his family, according to his immense worth and rank.',
    urdu: 'اے اللہ! ہمارے سردار محمد ﷺ پر رحمت، سلامتی اور برکت نازل فرما — جو بند (راہوں) کو کھولنے والے، گزشتہ (نبوت) کو ختم کرنے والے، حق کی حق کے ساتھ مدد کرنے والے اور تیرے سیدھے راستے کی طرف ہدایت دینے والے ہیں — اور ان کی آل پر، ان کی عظیم قدر و منزلت کے مطابق۔',
    source: 'A well-known traditional salawat (Salat al-Fatih), widely published in salawat collections. It is a composed prayer, not a hadith text; sending salawat is commanded in Quran 33:56.',
    target: 100
  },
  {
    id: 'taj',
    name: 'Durood-e-Taj (opening)',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ صَاحِبِ التَّاجِ وَالْمِعْرَاجِ وَالْبُرَاقِ وَالْعَلَمِ ۝ دَافِعِ الْبَلَاءِ وَالْوَبَاءِ وَالْقَحْطِ وَالْمَرَضِ وَالْأَلَمِ ۝ اِسْمُهُ مَكْتُوبٌ مَرْفُوعٌ مَشْفُوعٌ مَنْقُوشٌ فِي اللَّوْحِ وَالْقَلَمِ ۝ سَيِّدِ الْعَرَبِ وَالْعَجَمِ ۝ جِسْمُهُ مُقَدَّسٌ مُعَطَّرٌ مُطَهَّرٌ مُنَوَّرٌ فِي الْبَيْتِ وَالْحَرَمِ',
    transliteration: "Allahumma salli 'ala sayyidina wa mawlana Muhammadin sahibit-taji wal-mi'raji wal-buraqi wal-'alam. Dafi'il-bala'i wal-waba'i wal-qahti wal-maradi wal-alam. Ismuhu maktubun marfu'un mashfu'un manqushun fil-lawhi wal-qalam. Sayyidil-'arabi wal-'ajam. Jismuhu muqaddasun mu'attarun mutahharun munawwarun fil-bayti wal-haram.",
    english: 'O Allah, send blessings upon our master and patron Muhammad, the bearer of the Crown, the Mi\'raj, the Buraq and the Standard; the repeller of affliction, epidemics, drought, illness and pain. His name is written, exalted, joined (with Allah\'s name) and engraved on the Tablet and the Pen. The master of the Arabs and non-Arabs; his body is sacred, perfumed, purified and radiant in the House and the Sanctuary.',
    urdu: 'اے اللہ! ہمارے سردار اور آقا محمد ﷺ پر رحمت نازل فرما، جو تاج، معراج، براق اور علم والے ہیں؛ بلا، وبا، قحط، بیماری اور درد کو دور کرنے والے ہیں۔ ان کا نام لکھا ہوا، بلند کیا ہوا، (اللہ کے نام کے ساتھ) ملا ہوا اور لوح و قلم میں نقش ہے۔ عرب و عجم کے سردار ہیں۔ ان کا جسم مقدس، معطر، پاکیزہ اور بیت اللہ و حرم میں منور ہے۔',
    source: 'The opening section of the famous Durood-e-Taj, a long traditional salawat attributed to Shaykh Abu Bakr Salim. It is a composed prayer, not a hadith text; the full durood continues at length in published collections.',
    target: 33
  },
  {
    id: 'akbar',
    name: 'Durood-e-Akbar (opening)',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ سَيِّدِ الْمُرْسَلِينَ ۝ اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ سَيِّدِ النَّبِيِّينَ ۝ اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ سَيِّدِ الْأَوْلِيَاءِ ۝ اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ سَيِّدِ الْمُؤْمِنِينَ',
    transliteration: "Allahumma salli 'ala Muhammadin sayyidil-mursalin. Allahumma salli 'ala Muhammadin sayyidin-nabiyyin. Allahumma salli 'ala Muhammadin sayyidil-awliya. Allahumma salli 'ala Muhammadin sayyidil-mu'minin.",
    english: 'O Allah, send blessings upon Muhammad, the master of the Messengers. O Allah, send blessings upon Muhammad, the master of the Prophets. O Allah, send blessings upon Muhammad, the master of the friends of Allah. O Allah, send blessings upon Muhammad, the master of the believers.',
    urdu: 'اے اللہ! محمد ﷺ پر رحمت نازل فرما جو رسولوں کے سردار ہیں۔ اے اللہ! محمد ﷺ پر رحمت نازل فرما جو نبیوں کے سردار ہیں۔ اے اللہ! محمد ﷺ پر رحمت نازل فرما جو اولیاء کے سردار ہیں۔ اے اللہ! محمد ﷺ پر رحمت نازل فرما جو مومنوں کے سردار ہیں۔',
    source: 'The opening lines of Durood-e-Akbar, a very long traditional litany of salawat published in salawat collections, in which blessings are sent upon the Prophet ﷺ title by title. Shown here in short form; it is a composed prayer, not a hadith text.',
    target: 33
  }
]

export function duroodWazifa(d) {
  return {
    id: `durood-${d.id}`,
    title: d.name,
    category: 'Daily Adhkar',
    arabic: d.arabic,
    transliteration: d.transliteration,
    english_translation: d.english,
    urdu_translation: d.urdu,
    target_count: d.target,
    recommended_time: 'Any Time, Especially Friday',
    reference: d.source,
    instructions: '',
    keywords: []
  }
}
