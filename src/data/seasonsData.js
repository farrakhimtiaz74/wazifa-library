// Wave 4 (items 51-60): static content for Ramadan & Seasons pages.
// Text blocks are { en, ur, roman }. Dates are NOT stored here — they are
// computed from the Intl islamic calendar in lib/hijri.js and are estimates
// (moon sighting can shift them), which the UI states wherever shown.

// Item 53: the well-known Laylatul Qadr dua (At-Tirmidhi 3513).
export const qadrDua = {
  arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
  trans: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni.",
  en: 'O Allah, You are Pardoning and You love to pardon, so pardon me.',
  ur: 'اے اللہ! بے شک تو معاف کرنے والا ہے اور معافی کو پسند کرتا ہے، پس مجھے معاف فرما دے۔',
  roman: 'Ae Allah! Beshak Tu maaf karne wala hai aur maafi ko pasand karta hai, pas mujhe maaf farma de.',
  reference: 'At-Tirmidhi 3513'
}

// Item 57: Takbeerat of Eid (the widely recited form).
export const takbeerat = {
  arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ',
  trans: "Allahu akbar, Allahu akbar, Allahu akbar. La ilaha illallah. Wallahu akbar, Allahu akbar, wa lillahil-hamd.",
  en: 'Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. There is no god but Allah. Allah is the Greatest, Allah is the Greatest, and to Allah belongs all praise.',
  ur: 'اللہ سب سے بڑا ہے، اللہ سب سے بڑا ہے، اللہ سب سے بڑا ہے۔ اللہ کے سوا کوئی معبود نہیں۔ اللہ سب سے بڑا ہے، اللہ سب سے بڑا ہے، اور تمام تعریفیں اللہ ہی کے لیے ہیں۔',
  roman: 'Allah sab se bara hai, Allah sab se bara hai, Allah sab se bara hai. Allah ke siwa koi mabood nahi. Allah sab se bara hai, Allah sab se bara hai, aur tamam tareefein Allah hi ke liye hain.'
}

export const eidGreetingDua = {
  arabic: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
  trans: 'Taqabbalallahu minna wa minkum.',
  en: 'May Allah accept (the worship) from us and from you — the traditional Eid greeting.',
  ur: 'اللہ ہم سے اور آپ سے (عبادت) قبول فرمائے — یہ عید کی روایتی مبارکباد ہے۔',
  roman: 'Allah hum se aur aap se (ibadat) qabool farmaye — ye Eid ki riwayati mubarakbad hai.'
}

// Item 58: the dua of the Day of Arafah (At-Tirmidhi 3585).
export const arafahDua = {
  arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
  trans: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir.",
  en: 'There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He has power over all things. The Prophet ﷺ said the best dua is the dua of the Day of Arafah, and this is the best of what he and the prophets before him said (At-Tirmidhi 3585).',
  ur: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں۔ اسی کی بادشاہت ہے اور اسی کے لیے تعریف ہے، اور وہ ہر چیز پر قادر ہے۔ نبی ﷺ نے فرمایا: سب سے بہتر دعا یومِ عرفہ کی دعا ہے، اور یہ کلمات میرے اور مجھ سے پہلے انبیاء کے کہے ہوئے بہترین کلمات ہیں (ترمذی 3585)۔',
  roman: 'Allah ke siwa koi mabood nahi, wo akela hai, us ka koi shareek nahi. Usi ki badshahat hai aur usi ke liye tareef hai, aur wo har cheez par qadir hai. Nabi ﷺ ne farmaya: sab se behtar dua Yawm-e-Arafah ki dua hai (Tirmizi 3585).',
  reference: 'At-Tirmidhi 3585'
}

// Item 60: short note per Hijri month { en, ur, roman }.
export const monthNotes = [
  { en: 'A sacred month. The 9th and 10th (Ashura) are recommended fasts.', ur: 'حرمت والا مہینہ۔ 9 اور 10 محرم (عاشورہ) کے روزے مستحب ہیں۔', roman: 'Hurmat wala mahina. 9 aur 10 Muharram (Ashura) ke roze mustahab hain.' },
  { en: 'The month of the Prophet\u2019s ﷺ migration journey period; no special rituals are prescribed for it.', ur: 'اس مہینے کے لیے کوئی خاص عبادت مقرر نہیں۔', roman: 'Is mahine ke liye koi khaas ibadat muqarrar nahi.' },
  { en: 'The month in which the Prophet Muhammad ﷺ was born (12th, widely held).', ur: 'یہ وہ مہینہ ہے جس میں نبی محمد ﷺ کی ولادت ہوئی (12 تاریخ، مشہور قول)۔', roman: 'Ye wo mahina hai jis mein Nabi Muhammad ﷺ ki wiladat hui (12 tareekh, mashhoor qaul).' },
  { en: 'A quiet month with no special prescribed rituals.', ur: 'اس مہینے کے لیے کوئی خاص عبادت مقرر نہیں۔', roman: 'Is mahine ke liye koi khaas ibadat muqarrar nahi.' },
  { en: 'A quiet month with no special prescribed rituals.', ur: 'اس مہینے کے لیے کوئی خاص عبادت مقرر نہیں۔', roman: 'Is mahine ke liye koi khaas ibadat muqarrar nahi.' },
  { en: 'A quiet month with no special prescribed rituals.', ur: 'اس مہینے کے لیے کوئی خاص عبادت مقرر نہیں۔', roman: 'Is mahine ke liye koi khaas ibadat muqarrar nahi.' },
  { en: 'A sacred month. The Isra and Mi\u2019raj are widely commemorated on the 27th.', ur: 'حرمت والا مہینہ۔ 27 رجب کو اسراء و معراج کی یاد عام طور پر منائی جاتی ہے۔', roman: 'Hurmat wala mahina. 27 Rajab ko Isra wal Miraj ki yaad aam tor par manayi jati hai.' },
  { en: 'The month before Ramadan — the Prophet ﷺ fasted much of it (Muslim). The 15th night is observed by many.', ur: 'رمضان سے پہلے کا مہینہ — نبی ﷺ اس میں کثرت سے روزے رکھتے تھے (مسلم)۔ 15ویں شب بہت سے لوگ مناتے ہیں۔', roman: 'Ramadan se pehle ka mahina — Nabi ﷺ is mein kasrat se roze rakhte the (Muslim). 15win shab bohat se log manate hain.' },
  { en: 'The month of fasting, the Quran\u2019s revelation and Laylatul Qadr.', ur: 'روزوں کا مہینہ، نزولِ قرآن اور لیلۃ القدر کا مہینہ۔', roman: 'Rozon ka mahina, nuzool-e-Quran aur Laylatul Qadr ka mahina.' },
  { en: 'Begins with Eid-ul-Fitr. The six fasts of Shawwal are a well-known Sunnah (Muslim).', ur: 'عید الفطر سے شروع ہوتا ہے۔ شوال کے چھ روزے مشہور سنت ہیں (مسلم)۔', roman: 'Eid-ul-Fitr se shuru hota hai. Shawwal ke chhe roze mashhoor sunnat hain (Muslim).' },
  { en: 'A sacred month and one of the months of Hajj.', ur: 'حرمت والا مہینہ اور حج کے مہینوں میں سے ایک۔', roman: 'Hurmat wala mahina aur Hajj ke mahinon mein se ek.' },
  { en: 'The month of Hajj, the first ten days, the Day of Arafah (9th) and Eid-ul-Adha (10th).', ur: 'حج کا مہینہ، پہلے دس دن، یومِ عرفہ (9) اور عید الاضحیٰ (10)۔', roman: 'Hajj ka mahina, pehle das din, Yawm-e-Arafah (9) aur Eid-ul-Adha (10).' }
]

// Item 60: detail text for each event key used in lib/hijri.js HIJRI_YEAR_EVENTS.
export const eventDetails = {
  evNewYear: { en: 'The first day of the Islamic (Hijri) year, counted from the Hijrah of the Prophet ﷺ to Madinah.', ur: 'اسلامی (ہجری) سال کا پہلا دن، جو نبی ﷺ کی مدینہ ہجرت سے شمار ہوتا ہے۔', roman: 'Islami (Hijri) saal ka pehla din, jo Nabi ﷺ ki Madinah hijrat se shumar hota hai.' },
  evAshuraFast: { en: 'Fasting the 9th with the 10th was the Prophet\u2019s ﷺ stated wish, to differ from the People of the Book (Muslim).', ur: 'نبی ﷺ نے اہلِ کتاب سے مشابہت نہ کرنے کے لیے 10 کے ساتھ 9 محرم کا روزہ رکھنے کی خواہش ظاہر فرمائی (مسلم)۔', roman: 'Nabi ﷺ ne Ahl-e-Kitab se mushabahat na karne ke liye 10 ke saath 9 Muharram ka roza rakhne ki khwahish zahir farmayi (Muslim).' },
  evAshura: { en: 'The Day of Ashura. Fasting it expiates the sins of the past year (Muslim). It is also the day Musa (AS) and his people were saved from Pharaoh, and the day of the martyrdom of Imam Husayn (RA) at Karbala.', ur: 'یومِ عاشورہ۔ اس دن کا روزہ پچھلے سال کے گناہوں کا کفارہ ہے (مسلم)۔ اسی دن حضرت موسیٰ علیہ السلام اور ان کی قوم کو فرعون سے نجات ملی، اور اسی دن کربلا میں امام حسین رضی اللہ عنہ کی شہادت ہوئی۔', roman: 'Yawm-e-Ashura. Is din ka roza pichle saal ke gunahon ka kaffara hai (Muslim). Isi din Hazrat Musa (AS) aur un ki qaum ko Firaun se nijat mili, aur isi din Karbala mein Imam Husayn (RA) ki shahadat hui.' },
  evMawlid: { en: 'The birth of the Prophet Muhammad ﷺ (the date most widely held). Observed by many Muslims with gatherings of praise and Seerah; scholars differ on how it should be marked.', ur: 'نبی محمد ﷺ کی ولادت (مشہور ترین تاریخ)۔ بہت سے مسلمان اسے نعت و سیرت کی محافل سے مناتے ہیں؛ اس کے طریقے پر علماء میں اختلاف ہے۔', roman: 'Nabi Muhammad ﷺ ki wiladat (mashhoor tareen tareekh). Bohat se Musalman ise naat o seerat ki mehfilon se manate hain; is ke tareeqe par ulama mein ikhtilaf hai.' },
  evIsra: { en: 'The Night Journey (Isra) from Makkah to Jerusalem and the Ascension (Mi\u2019raj), when the five daily prayers were given. The exact date is not firmly established; the 27th of Rajab is widely commemorated.', ur: 'اسراء (مکہ سے بیت المقدس کا سفر) اور معراج (آسمانوں کی سیر)، جب پانچ نمازیں فرض ہوئیں۔ اس کی پکی تاریخ ثابت نہیں؛ 27 رجب عام طور پر منائی جاتی ہے۔', roman: 'Isra (Makkah se Bait-ul-Maqdis ka safar) aur Miraj (aasmaanon ki sair), jab paanch namazein farz huin. Is ki pakki tareekh sabit nahi; 27 Rajab aam tor par manayi jati hai.' },
  evBaraah: { en: 'The middle night of Sha\u2019ban (Laylatul Bara\u2019ah), observed by many with extra prayer and fasting the next day. Reports about its special virtue are debated among scholars.', ur: 'نصف شعبان کی رات (لیلۃ البراءۃ)، جسے بہت سے لوگ اضافی عبادت اور اگلے دن کے روزے سے مناتے ہیں۔ اس کی خاص فضیلت کی روایات پر علماء میں بحث ہے۔', roman: 'Nisf Shaban ki raat (Laylatul Baraah), jise bohat se log izafi ibadat aur agle din ke roze se manate hain. Is ki khaas fazeelat ki riwayat par ulama mein behes hai.' },
  evRamadanStart: { en: 'The first day of Ramadan — the month of fasting, prayer and the Quran.', ur: 'رمضان کا پہلا دن — روزوں، عبادت اور قرآن کا مہینہ۔', roman: 'Ramadan ka pehla din — rozon, ibadat aur Quran ka mahina.' },
  evQadrPossible: { en: 'Laylatul Qadr is sought in the odd nights of the last ten nights of Ramadan; the 27th night is the most widely observed possibility. The exact night is not known for certain.', ur: 'لیلۃ القدر رمضان کے آخری عشرے کی طاق راتوں میں تلاش کی جاتی ہے؛ 27ویں رات سب سے زیادہ مشہور امکان ہے۔ اصل رات یقین سے معلوم نہیں۔', roman: 'Laylatul Qadr Ramadan ke aakhri ashray ki taaq raaton mein talash ki jati hai; 27win raat sab se zyada mashhoor imkan hai. Asal raat yaqeen se maloom nahi.' },
  evEidFitr: { en: 'Eid-ul-Fitr — the festival ending Ramadan. Zakat-ul-Fitr is given before the Eid prayer.', ur: 'عید الفطر — رمضان کے اختتام کا تہوار۔ صدقۂ فطر عید کی نماز سے پہلے دیا جاتا ہے۔', roman: 'Eid-ul-Fitr — Ramadan ke ikhtitam ka tehwar. Sadqa-e-Fitr Eid ki namaz se pehle diya jata hai.' },
  evArafah: { en: 'The Day of Arafah — the main day of Hajj. Fasting it (for non-pilgrims) expiates the sins of the past and coming year (Muslim).', ur: 'یومِ عرفہ — حج کا سب سے بڑا دن۔ (غیر حاجیوں کے لیے) اس کا روزہ پچھلے اور اگلے سال کے گناہوں کا کفارہ ہے (مسلم)۔', roman: 'Yawm-e-Arafah — Hajj ka sab se bara din. (Ghair hajiyon ke liye) is ka roza pichle aur agle saal ke gunahon ka kaffara hai (Muslim).' },
  evEidAdha: { en: 'Eid-ul-Adha — the festival of sacrifice, remembering Ibrahim\u2019s (AS) willingness to sacrifice for Allah.', ur: 'عید الاضحیٰ — قربانی کا تہوار، حضرت ابراہیم علیہ السلام کی اللہ کے لیے قربانی کی یاد۔', roman: 'Eid-ul-Adha — qurbani ka tehwar, Hazrat Ibrahim (AS) ki Allah ke liye qurbani ki yaad.' }
}

// Item 54: a curated 30-day Ramadan dua plan. Every entry is an existing
// library wazifa id (verified against src/data/wazifaData.js). This is an
// editorial plan for personal use — NOT a sequence prescribed in hadith,
// and the UI labels it that way.
export const ramadanDuaPlan = [
  'surah-al-fatihah', 'ayat-ul-kursi', 'sayyid-ul-istighfar', 'rabbighfir-li-wa-tub-alayya',
  'dua-yunus', 'allahummaghfir-li-warhamni-warzuqni', 'audhu-bika-minal-maatham-wal-maghram',
  'dua-for-parents', 'rabbi-hab-li-hukma', 'rabbi-la-tadharni-farda',
  'allahummak-fini-bihalalika', 'dua-qarz-malikal-mulk', 'rabbi-inni-lima-anzalta',
  'rizq-dua-ilman', 'rabbi-zidni-ilma', 'rabbish-rahli-sadri',
  'shifa-dua', 'asalullahal-azim-shifa', 'dua-for-pain', 'dua-hamm-wal-hazan',
  'hasbunallah', 'hasbiyallahu-la-ilaha-illa-huwa', 'bismillahillazi-la-yadurru',
  'audhu-bikalimatillahit-tammah', 'surah-al-falaq', 'surah-an-nas',
  'dua-iftar', 'dua-masura-zalamtu-nafsi', 'astaghfirullah-rizq', 'durood-e-ibrahimi'
]
