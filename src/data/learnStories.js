// Learn stories: Seerah timeline, Prophets' stories (Quranic outline), Sahaba bios.
// Plain factual / mainstream outline only. Every text field is { en, ur, roman }.

export const seerahEvents = [
  {
    id: 'birth',
    year: '570 CE',
    title: { en: 'Birth in Makkah', ur: 'مکہ میں ولادت', roman: 'Makkah mein Wiladat' },
    desc: {
      en: 'Prophet Muhammad (ﷺ) was born in Makkah in the Year of the Elephant, the year Abraha marched on the Kaaba. His father Abdullah had passed away before his birth.',
      ur: 'نبی کریم ﷺ مکہ میں عام الفیل میں پیدا ہوئے، جس سال ابرہہ کعبہ کی طرف آیا تھا۔ آپ ﷺ کے والد عبداللہ آپ کی ولادت سے پہلے وفات پا چکے تھے۔',
      roman: 'Nabi Kareem ﷺ Makkah mein Aam-ul-Feel mein paida hue, jis saal Abraha Kaaba ki taraf aaya tha. Aap ﷺ ke walid Abdullah aap ki wiladat se pehle wafat pa chuke thay.',
    },
  },
  {
    id: 'halimah',
    year: '570–576 CE',
    title: { en: 'Childhood & Halimah (RA)', ur: 'بچپن اور حضرت حلیمہ رضی اللہ عنہا', roman: 'Bachpan aur Hazrat Halimah (RA)' },
    desc: {
      en: 'As was the custom, the infant was cared for in the desert by his foster mother Halimah as-Sa’diyah (RA). His mother Aminah passed away when he was about six, and his grandfather Abdul Muttalib then cared for him.',
      ur: 'رواج کے مطابق بچپن میں آپ ﷺ کی پرورش صحرا میں رضاعی والدہ حضرت حلیمہ سعدیہ رضی اللہ عنہا نے کی۔ تقریباً چھ سال کی عمر میں والدہ آمنہ کا انتقال ہوا، پھر دادا عبدالمطلب نے پرورش کی۔',
      roman: 'Riwaj ke mutabiq bachpan mein aap ﷺ ki parwarish sehra mein razai walida Hazrat Halimah Sa’diyah (RA) ne ki. Taqreeban chhay saal ki umr mein walida Aminah ka inteqal hua, phir dada Abdul Muttalib ne parwarish ki.',
    },
  },
  {
    id: 'syria-journey',
    year: '~582 CE',
    title: { en: 'Journey to Syria with Abu Talib', ur: 'ابو طالب کے ساتھ شام کا سفر', roman: 'Abu Talib ke saath Sham ka Safar' },
    desc: {
      en: 'At about twelve years old, he travelled with his uncle Abu Talib on a trading journey towards Syria. Abu Talib later raised him after the death of his grandfather.',
      ur: 'تقریباً بارہ سال کی عمر میں آپ ﷺ نے چچا ابو طالب کے ساتھ شام کی طرف تجارتی سفر کیا۔ دادا کے انتقال کے بعد ابو طالب ہی نے آپ ﷺ کی کفالت کی۔',
      roman: 'Taqreeban barah saal ki umr mein aap ﷺ ne chacha Abu Talib ke saath Sham ki taraf tijarati safar kiya. Dada ke inteqal ke baad Abu Talib hi ne aap ﷺ ki kifalat ki.',
    },
  },
  {
    id: 'marriage-khadijah',
    year: '~595 CE',
    title: { en: 'Marriage to Khadijah (RA)', ur: 'حضرت خدیجہ رضی اللہ عنہا سے نکاح', roman: 'Hazrat Khadijah (RA) se Nikah' },
    desc: {
      en: 'Known for his honesty, he was called Al-Amin (the Trustworthy). At the age of 25 he married Khadijah bint Khuwaylid (RA), a respected merchant of Makkah.',
      ur: 'دیانت داری کی وجہ سے آپ ﷺ کو الامین کہا جاتا تھا۔ 25 سال کی عمر میں آپ ﷺ کا نکاح مکہ کی معزز تاجر حضرت خدیجہ بنت خویلد رضی اللہ عنہا سے ہوا۔',
      roman: 'Diyanat dari ki wajah se aap ﷺ ko Al-Amin kaha jata tha. 25 saal ki umr mein aap ﷺ ka nikah Makkah ki muazzaz tajir Hazrat Khadijah bint Khuwaylid (RA) se hua.',
    },
  },
  {
    id: 'kaaba-rebuild',
    year: '~605 CE',
    title: { en: 'Rebuilding of the Kaaba', ur: 'کعبہ کی تعمیرِ نو', roman: 'Kaaba ki Tameer-e-Nau' },
    desc: {
      en: 'When the Quraysh rebuilt the Kaaba, the tribes disputed who would place the Black Stone. Muhammad (ﷺ) resolved it peacefully by placing the stone on a cloth that all the chiefs lifted together.',
      ur: 'جب قریش نے کعبہ کی تعمیرِ نو کی تو حجرِ اسود رکھنے پر قبائل میں اختلاف ہوا۔ آپ ﷺ نے حجرِ اسود کو چادر پر رکھ کر سب سرداروں سے مل کر اٹھوایا اور اختلاف ختم کر دیا۔',
      roman: 'Jab Quraysh ne Kaaba ki tameer-e-nau ki to Hajar-e-Aswad rakhne par qabail mein ikhtilaf hua. Aap ﷺ ne Hajar-e-Aswad ko chadar par rakh kar sab sardaron se mil kar uthwaya aur ikhtilaf khatm kar diya.',
    },
  },
  {
    id: 'first-revelation',
    year: '610 CE',
    title: { en: 'First Revelation in Cave Hira', ur: 'غارِ حرا میں پہلی وحی', roman: 'Ghar-e-Hira mein Pehli Wahi' },
    desc: {
      en: 'At the age of 40, while reflecting in Cave Hira, the first revelation came through Angel Jibreel (AS), beginning with the word “Iqra” (Read). Khadijah (RA) comforted him and was the first believer.',
      ur: '40 سال کی عمر میں غارِ حرا میں غور و فکر کے دوران حضرت جبرائیل علیہ السلام کے ذریعے پہلی وحی نازل ہوئی، جس کا آغاز لفظ ”اقرأ“ سے ہوا۔ حضرت خدیجہ رضی اللہ عنہا نے تسلی دی اور سب سے پہلے ایمان لائیں۔',
      roman: '40 saal ki umr mein Ghar-e-Hira mein ghaur-o-fikr ke dauran Hazrat Jibreel (AS) ke zariye pehli wahi nazil hui, jis ka aaghaz lafz “Iqra” se hua. Hazrat Khadijah (RA) ne tasalli di aur sab se pehle iman laayen.',
    },
  },
  {
    id: 'secret-preaching',
    year: '610–613 CE',
    title: { en: 'Secret Preaching & Early Believers', ur: 'خفیہ دعوت اور ابتدائی ایمان لانے والے', roman: 'Khufiya Dawat aur Ibtidai Iman Laane Wale' },
    desc: {
      en: 'For about three years the call to Islam was made quietly. Khadijah (RA), Abu Bakr (RA), Ali (RA) and Zayd (RA) were among the very first to believe.',
      ur: 'تقریباً تین سال اسلام کی دعوت خفیہ طور پر دی گئی۔ حضرت خدیجہ، حضرت ابوبکر، حضرت علی اور حضرت زید رضی اللہ عنہم سب سے پہلے ایمان لانے والوں میں شامل تھے۔',
      roman: 'Taqreeban teen saal Islam ki dawat khufiya taur par di gayi. Hazrat Khadijah, Hazrat Abu Bakr, Hazrat Ali aur Hazrat Zayd (RA) sab se pehle iman laane walon mein shamil thay.',
    },
  },
  {
    id: 'public-preaching',
    year: '613 CE onwards',
    title: { en: 'Public Preaching & Persecution', ur: 'اعلانیہ دعوت اور مکہ میں ظلم', roman: 'Ailaniya Dawat aur Makkah mein Zulm' },
    desc: {
      en: 'The Prophet (ﷺ) then preached openly, calling people to worship Allah alone. The Quraysh opposed the message and persecuted the early Muslims, especially the weak among them.',
      ur: 'پھر آپ ﷺ نے اعلانیہ دعوت دی اور لوگوں کو صرف اللہ کی عبادت کی طرف بلایا۔ قریش نے مخالفت کی اور ابتدائی مسلمانوں، خاص طور پر کمزوروں، پر ظلم کیا۔',
      roman: 'Phir aap ﷺ ne ailaniya dawat di aur logon ko sirf Allah ki ibadat ki taraf bulaya. Quraysh ne mukhalifat ki aur ibtidai Musalmanon, khaas taur par kamzoron, par zulm kiya.',
    },
  },
  {
    id: 'abyssinia-migration',
    year: '~615 CE',
    title: { en: 'Migration to Abyssinia', ur: 'حبشہ کی طرف ہجرت', roman: 'Habsha ki Taraf Hijrat' },
    desc: {
      en: 'To escape persecution, a group of companions migrated to Abyssinia (Ethiopia), where the just king, the Negus, gave them protection and refused to hand them over.',
      ur: 'ظلم سے بچنے کے لیے صحابہ کی ایک جماعت نے حبشہ کی طرف ہجرت کی، جہاں کے انصاف پسند بادشاہ نجاشی نے انہیں پناہ دی اور انہیں واپس کرنے سے انکار کر دیا۔',
      roman: 'Zulm se bachne ke liye Sahaba ki ek jamaat ne Habsha ki taraf hijrat ki, jahan ke insaf pasand badshah Najashi ne unhein panah di aur unhein wapas karne se inkar kar diya.',
    },
  },
  {
    id: 'year-of-sorrow',
    year: '~619 CE',
    title: { en: 'Year of Sorrow', ur: 'عام الحزن (غم کا سال)', roman: 'Aam-ul-Huzn (Gham ka Saal)' },
    desc: {
      en: 'In this year Khadijah (RA) and Abu Talib both passed away, after a harsh boycott of the Muslims had ended. It is known as the Year of Sorrow because of these great losses.',
      ur: 'اس سال حضرت خدیجہ رضی اللہ عنہا اور ابو طالب دونوں کا انتقال ہوا، مسلمانوں کے سخت بائیکاٹ کے خاتمے کے بعد۔ ان بڑے نقصانات کی وجہ سے اسے عام الحزن کہا جاتا ہے۔',
      roman: 'Is saal Hazrat Khadijah (RA) aur Abu Talib dono ka inteqal hua, Musalmanon ke sakht boycott ke khatme ke baad. In bare nuqsanat ki wajah se ise Aam-ul-Huzn kaha jata hai.',
    },
  },
  {
    id: 'isra-miraj',
    year: '~621 CE',
    title: { en: "Isra & Mi'raj", ur: 'اسراء اور معراج', roman: "Isra aur Mi'raj" },
    desc: {
      en: 'The Prophet (ﷺ) was taken on the night journey from Makkah to Jerusalem (Isra) and then ascended to the heavens (Mi’raj), as described in the Quran. The five daily prayers were prescribed during this journey.',
      ur: 'آپ ﷺ کو رات کے سفر میں مکہ سے بیت المقدس (اسراء) اور پھر آسمانوں کی طرف (معراج) لے جایا گیا، جیسا کہ قرآن میں بیان ہے۔ اسی سفر میں پانچ وقت کی نماز فرض ہوئی۔',
      roman: 'Aap ﷺ ko raat ke safar mein Makkah se Bait-ul-Muqaddas (Isra) aur phir aasmanon ki taraf (Mi’raj) le jaya gaya, jaisa ke Quran mein bayan hai. Isi safar mein paanch waqt ki namaz farz hui.',
    },
  },
  {
    id: 'aqabah-pledges',
    year: '~621–622 CE',
    title: { en: 'Pledges of Aqabah', ur: 'بیعتِ عقبہ', roman: 'Bai’at-e-Aqabah' },
    desc: {
      en: 'People from Yathrib (Madinah) met the Prophet (ﷺ) at Aqabah and pledged to believe in Allah and support Islam. These pledges prepared the way for the Hijrah.',
      ur: 'یثرب (مدینہ) کے لوگوں نے عقبہ کے مقام پر آپ ﷺ سے ملاقات کر کے اللہ پر ایمان اور اسلام کی حمایت کی بیعت کی۔ ان بیعتوں نے ہجرت کی راہ ہموار کی۔',
      roman: 'Yathrib (Madinah) ke logon ne Aqabah ke maqam par aap ﷺ se mulaqat kar ke Allah par iman aur Islam ki himayat ki bai’at ki. In bai’aton ne Hijrat ki raah hamwar ki.',
    },
  },
  {
    id: 'hijrah',
    year: '622 CE / 1 AH',
    title: { en: 'The Hijrah to Madinah', ur: 'مدینہ کی طرف ہجرت', roman: 'Madinah ki Taraf Hijrat' },
    desc: {
      en: 'The Prophet (ﷺ) migrated from Makkah to Madinah with Abu Bakr (RA), resting in the Cave of Thawr on the way. This migration marks the start of the Islamic (Hijri) calendar.',
      ur: 'آپ ﷺ نے حضرت ابوبکر رضی اللہ عنہ کے ساتھ مکہ سے مدینہ ہجرت کی اور راستے میں غارِ ثور میں قیام کیا۔ اسی ہجرت سے اسلامی (ہجری) تقویم کا آغاز ہوتا ہے۔',
      roman: 'Aap ﷺ ne Hazrat Abu Bakr (RA) ke saath Makkah se Madinah hijrat ki aur raaste mein Ghar-e-Thawr mein qayam kiya. Isi hijrat se Islami (Hijri) calendar ka aaghaz hota hai.',
    },
  },
  {
    id: 'masjid-nabawi',
    year: '1 AH',
    title: { en: 'Masjid an-Nabawi & Brotherhood', ur: 'مسجدِ نبوی اور مؤاخات', roman: 'Masjid-e-Nabawi aur Muwakhat' },
    desc: {
      en: 'In Madinah the Prophet’s Mosque was built, and the Muhajirun (emigrants) were paired in brotherhood with the Ansar (helpers) of Madinah, who shared their homes and wealth.',
      ur: 'مدینہ میں مسجدِ نبوی تعمیر ہوئی اور مہاجرین کو مدینہ کے انصار کے ساتھ بھائی چارے میں جوڑا گیا، جنہوں نے اپنے گھر اور مال میں انہیں شریک کیا۔',
      roman: 'Madinah mein Masjid-e-Nabawi tameer hui aur Muhajireen ko Madinah ke Ansar ke saath bhai chaare mein jora gaya, jinhon ne apne ghar aur maal mein unhein shareek kiya.',
    },
  },
  {
    id: 'badr',
    year: '2 AH',
    title: { en: 'Battle of Badr', ur: 'غزوۂ بدر', roman: 'Ghazwa-e-Badr' },
    desc: {
      en: 'At Badr, a small Muslim force faced a larger Quraysh army and, by Allah’s help, was victorious. The Quran mentions Allah’s help to the believers at Badr.',
      ur: 'بدر میں مسلمانوں کی چھوٹی جماعت کا مقابلہ قریش کی بڑی فوج سے ہوا اور اللہ کی مدد سے مسلمان کامیاب ہوئے۔ قرآن میں بدر میں مومنوں کی اللہ کی مدد کا ذکر ہے۔',
      roman: 'Badr mein Musalmanon ki chhoti jamaat ka muqabla Quraysh ki bari fauj se hua aur Allah ki madad se Musalman kamyab hue. Quran mein Badr mein mominon ki Allah ki madad ka zikr hai.',
    },
  },
  {
    id: 'uhud',
    year: '3 AH',
    title: { en: 'Battle of Uhud', ur: 'غزوۂ احد', roman: 'Ghazwa-e-Uhud' },
    desc: {
      en: 'At Uhud the Muslims faced the Quraysh again and suffered heavy losses, including Hamza (RA). The Quran teaches lessons from Uhud about obedience, patience and steadfastness.',
      ur: 'احد میں مسلمانوں کا دوبارہ قریش سے مقابلہ ہوا اور انہیں بھاری نقصان اٹھانا پڑا، جن میں حضرت حمزہ رضی اللہ عنہ بھی شامل تھے۔ قرآن احد سے اطاعت، صبر اور ثابت قدمی کے اسباق دیتا ہے۔',
      roman: 'Uhud mein Musalmanon ka dobara Quraysh se muqabla hua aur unhein bhari nuqsan uthana para, jin mein Hazrat Hamza (RA) bhi shamil thay. Quran Uhud se ita’at, sabr aur sabit qadmi ke asbaq deta hai.',
    },
  },
  {
    id: 'trench',
    year: '5 AH',
    title: { en: 'Battle of the Trench', ur: 'غزوۂ خندق', roman: 'Ghazwa-e-Khandaq' },
    desc: {
      en: 'When allied tribes marched on Madinah, a trench was dug around the city on the suggestion of Salman Al-Farsi (RA). The allies withdrew after a long siege, as mentioned in Surah Al-Ahzab.',
      ur: 'جب اتحادی قبائل نے مدینہ پر چڑھائی کی تو حضرت سلمان فارسی رضی اللہ عنہ کے مشورے سے شہر کے گرد خندق کھودی گئی۔ طویل محاصرے کے بعد اتحادی واپس چلے گئے، جیسا کہ سورۂ احزاب میں ذکر ہے۔',
      roman: 'Jab ittihadi qabail ne Madinah par charhai ki to Hazrat Salman Al-Farsi (RA) ke mashware se sheher ke gird khandaq khodi gayi. Taweel muhasure ke baad ittihadi wapas chale gaye, jaisa ke Surah Al-Ahzab mein zikr hai.',
    },
  },
  {
    id: 'hudaybiyyah',
    year: '6 AH',
    title: { en: 'Treaty of Hudaybiyyah', ur: 'صلح حدیبیہ', roman: 'Sulh-e-Hudaybiyyah' },
    desc: {
      en: 'The Muslims travelled for Umrah but were stopped at Hudaybiyyah, where a peace treaty was agreed with the Quraysh. The Quran calls this treaty a clear victory (Surah Al-Fath).',
      ur: 'مسلمان عمرے کے لیے گئے لیکن حدیبیہ پر روک دیے گئے، جہاں قریش کے ساتھ امن معاہدہ ہوا۔ قرآن نے اس معاہدے کو فتحِ مبین کہا ہے (سورۂ فتح)۔',
      roman: 'Musalman Umrah ke liye gaye lekin Hudaybiyyah par rok diye gaye, jahan Quraysh ke saath aman muahida hua. Quran ne is muahide ko Fath-e-Mubeen kaha hai (Surah Al-Fath).',
    },
  },
  {
    id: 'letters-to-rulers',
    year: '6–7 AH',
    title: { en: 'Letters to Rulers', ur: 'بادشاہوں کے نام خطوط', roman: 'Badshahon ke Naam Khutoot' },
    desc: {
      en: 'After Hudaybiyyah, the Prophet (ﷺ) sent letters inviting rulers of surrounding lands, including the Byzantine and Persian emperors, to Islam.',
      ur: 'حدیبیہ کے بعد آپ ﷺ نے گرد و نواح کے حکمرانوں، جن میں روم اور فارس کے بادشاہ بھی شامل تھے، کو اسلام کی دعوت کے خطوط بھیجے۔',
      roman: 'Hudaybiyyah ke baad aap ﷺ ne gird-o-nawah ke hukmaranon, jin mein Rome aur Faras ke badshah bhi shamil thay, ko Islam ki dawat ke khutoot bheje.',
    },
  },
  {
    id: 'conquest-makkah',
    year: '8 AH',
    title: { en: 'Conquest of Makkah', ur: 'فتحِ مکہ', roman: 'Fath-e-Makkah' },
    desc: {
      en: 'After the treaty was broken by the Quraysh’s allies, the Prophet (ﷺ) entered Makkah peacefully with a large force. He declared a general amnesty and forgave his former persecutors.',
      ur: 'قریش کے اتحادیوں کی طرف سے معاہدہ توڑے جانے کے بعد آپ ﷺ بڑی فوج کے ساتھ پرامن طور پر مکہ میں داخل ہوئے۔ آپ ﷺ نے عام معافی کا اعلان کیا اور سابق مخالفین کو معاف کر دیا۔',
      roman: 'Quraysh ke ittihadiyon ki taraf se muahida tore jaane ke baad aap ﷺ bari fauj ke saath pur-aman taur par Makkah mein dakhil hue. Aap ﷺ ne aam muafi ka ailan kiya aur sabiq mukhalifeen ko muaf kar diya.',
    },
  },
  {
    id: 'farewell-pilgrimage',
    year: '10 AH',
    title: { en: 'Farewell Pilgrimage & Sermon', ur: 'حجۃ الوداع اور خطبہ', roman: 'Hajjat-ul-Wida aur Khutba' },
    desc: {
      en: 'The Prophet (ﷺ) performed his only Hajj and delivered the Farewell Sermon, emphasising the sanctity of life and property, the rights of women, and holding firmly to the Quran.',
      ur: 'آپ ﷺ نے اپنا واحد حج ادا کیا اور خطبۂ حجۃ الوداع دیا، جس میں جان و مال کی حرمت، عورتوں کے حقوق اور قرآن کو مضبوطی سے تھامنے پر زور دیا۔',
      roman: 'Aap ﷺ ne apna wahid Hajj ada kiya aur Khutba-e-Hajjat-ul-Wida diya, jis mein jaan-o-maal ki hurmat, aurton ke huqooq aur Quran ko mazbooti se thaamne par zor diya.',
    },
  },
  {
    id: 'passing-away',
    year: '11 AH',
    title: { en: 'Passing Away in Madinah', ur: 'مدینہ میں وفات', roman: 'Madinah mein Wafat' },
    desc: {
      en: 'Prophet Muhammad (ﷺ) passed away in Madinah in 11 AH (632 CE) and was buried in the chamber of Aisha (RA), beside Masjid an-Nabawi. Abu Bakr (RA) then became the first caliph.',
      ur: 'نبی کریم ﷺ کی وفات 11 ہجری (632 عیسوی) میں مدینہ میں ہوئی اور آپ ﷺ حضرت عائشہ رضی اللہ عنہا کے حجرے میں، مسجدِ نبوی کے پہلو میں مدفون ہوئے۔ پھر حضرت ابوبکر رضی اللہ عنہ پہلے خلیفہ بنے۔',
      roman: 'Nabi Kareem ﷺ ki wafat 11 Hijri (632 CE) mein Madinah mein hui aur aap ﷺ Hazrat Aisha (RA) ke hujre mein, Masjid-e-Nabawi ke pehlu mein madfoon hue. Phir Hazrat Abu Bakr (RA) pehle khalifa bane.',
    },
  },
];

export const prophetStories = [
  {
    id: 'adam',
    title: { en: 'Prophet Adam (AS)', ur: 'حضرت آدم علیہ السلام', roman: 'Hazrat Adam (AS)' },
    beats: {
      en: [
        'Allah created Adam (AS) and taught him the names of things.',
        'The angels prostrated to him by Allah’s command; Iblis refused out of pride.',
        'Adam (AS) and Hawwa lived in Paradise and were warned not to approach one tree.',
        'They ate from the tree after being deceived, then sincerely repented.',
        'Allah forgave them and sent them to live on earth.',
      ],
      ur: [
        'اللہ نے حضرت آدم علیہ السلام کو پیدا کیا اور انہیں چیزوں کے نام سکھائے۔',
        'اللہ کے حکم سے فرشتوں نے انہیں سجدہ کیا؛ ابلیس نے تکبر سے انکار کر دیا۔',
        'حضرت آدم علیہ السلام اور حضرت حوا جنت میں رہے اور انہیں ایک درخت کے قریب جانے سے منع کیا گیا۔',
        'دھوکے میں آ کر انہوں نے اس درخت سے کھا لیا، پھر خلوص سے توبہ کی۔',
        'اللہ نے انہیں معاف کر دیا اور زمین پر رہنے کے لیے بھیجا۔',
      ],
      roman: [
        'Allah ne Hazrat Adam (AS) ko paida kiya aur unhein cheezon ke naam sikhaye.',
        'Allah ke hukm se farishton ne unhein sajda kiya; Iblis ne takabbur se inkar kar diya.',
        'Hazrat Adam (AS) aur Hazrat Hawwa Jannat mein rahe aur unhein ek darakht ke qareeb jaane se mana kiya gaya.',
        'Dhoke mein aa kar unhon ne us darakht se kha liya, phir khuloos se tauba ki.',
        'Allah ne unhein muaf kar diya aur zameen par rehne ke liye bheja.',
      ],
    },
  },
  {
    id: 'nuh',
    title: { en: 'Prophet Nuh (AS)', ur: 'حضرت نوح علیہ السلام', roman: 'Hazrat Nuh (AS)' },
    beats: {
      en: [
        'Nuh (AS) called his people to worship Allah alone for many years.',
        'Most people rejected him and mocked him.',
        'Allah commanded him to build an ark and take pairs of animals and the believers aboard.',
        'A great flood came; the disbelievers were drowned and the believers were saved.',
        'The ark rested on Mount Judi, and Nuh (AS) is honoured as a grateful servant of Allah.',
      ],
      ur: [
        'حضرت نوح علیہ السلام نے کئی سال اپنی قوم کو صرف اللہ کی عبادت کی دعوت دی۔',
        'اکثر لوگوں نے انہیں جھٹلایا اور مذاق اڑایا۔',
        'اللہ نے انہیں کشتی بنانے اور ایمان والوں اور جانوروں کے جوڑے سوار کرنے کا حکم دیا۔',
        'بڑا طوفان آیا؛ انکار کرنے والے ڈوب گئے اور ایمان والے بچ گئے۔',
        'کشتی جودی پہاڑ پر ٹھہری، اور حضرت نوح علیہ السلام کو اللہ کا شکر گزار بندہ کہا گیا۔',
      ],
      roman: [
        'Hazrat Nuh (AS) ne kai saal apni qaum ko sirf Allah ki ibadat ki dawat di.',
        'Aksar logon ne unhein jhutlaya aur mazaaq uraya.',
        'Allah ne unhein kashti banane aur iman walon aur janwaron ke jore sawar karne ka hukm diya.',
        'Bara toofan aaya; inkar karne wale doob gaye aur iman wale bach gaye.',
        'Kashti Judi pahaar par thehri, aur Hazrat Nuh (AS) ko Allah ka shukr guzar banda kaha gaya.',
      ],
    },
  },
  {
    id: 'ibrahim',
    title: { en: 'Prophet Ibrahim (AS)', ur: 'حضرت ابراہیم علیہ السلام', roman: 'Hazrat Ibrahim (AS)' },
    beats: {
      en: [
        'Ibrahim (AS) searched for the truth and rejected idol worship, declaring Allah is One.',
        'He was thrown into a fire by his people, and Allah made the fire cool and safe.',
        'He left his family in the valley of Makkah by Allah’s command, where Zamzam later flowed.',
        'He was ready to sacrifice his son in obedience to Allah, and Allah ransomed the son with a ram.',
        'Together with Ismail (AS), he raised the foundations of the Kaaba and prayed for Makkah.',
      ],
      ur: [
        'حضرت ابراہیم علیہ السلام نے حق کی تلاش کی اور بت پرستی کو رد کر کے اللہ کے ایک ہونے کا اعلان کیا۔',
        'ان کی قوم نے انہیں آگ میں ڈالا، اور اللہ نے آگ کو ٹھنڈی اور سلامتی والی بنا دیا۔',
        'انہوں نے اللہ کے حکم سے اپنے اہل کو مکہ کی وادی میں چھوڑا، جہاں بعد میں زمزم جاری ہوا۔',
        'وہ اللہ کی اطاعت میں اپنے بیٹے کی قربانی کے لیے تیار ہوئے، اور اللہ نے بیٹے کے بدلے مینڈھا بھیجا۔',
        'انہوں نے حضرت اسماعیل علیہ السلام کے ساتھ مل کر کعبہ کی بنیادیں اٹھائیں اور مکہ کے لیے دعا کی۔',
      ],
      roman: [
        'Hazrat Ibrahim (AS) ne haq ki talash ki aur but parasti ko radd kar ke Allah ke ek hone ka ailan kiya.',
        'Un ki qaum ne unhein aag mein dala, aur Allah ne aag ko thandi aur salamti wali bana diya.',
        'Unhon ne Allah ke hukm se apne ahl ko Makkah ki wadi mein chhora, jahan baad mein Zamzam jaari hua.',
        'Woh Allah ki ita’at mein apne bete ki qurbani ke liye tayyar hue, aur Allah ne bete ke badle mendha bheja.',
        'Unhon ne Hazrat Ismail (AS) ke saath mil kar Kaaba ki bunyadein uthayen aur Makkah ke liye dua ki.',
      ],
    },
  },
  {
    id: 'yusuf',
    title: { en: 'Prophet Yusuf (AS)', ur: 'حضرت یوسف علیہ السلام', roman: 'Hazrat Yusuf (AS)' },
    beats: {
      en: [
        'Yusuf (AS) saw a dream of eleven stars, the sun and the moon prostrating to him.',
        'His brothers, out of jealousy, threw him into a well; he was taken to Egypt.',
        'He resisted temptation, was falsely accused and imprisoned, yet remained patient and pure.',
        'He interpreted the king’s dream and was placed in charge of Egypt’s storehouses.',
        'He forgave his brothers, and his family reunited in Egypt as his childhood dream came true.',
      ],
      ur: [
        'حضرت یوسف علیہ السلام نے خواب میں گیارہ ستارے، سورج اور چاند کو اپنے سامنے سجدہ کرتے دیکھا۔',
        'بھائیوں نے حسد میں انہیں کنویں میں ڈال دیا؛ وہ مصر لے جائے گئے۔',
        'انہوں نے گناہ کی دعوت کو رد کیا، جھوٹا الزام لگا اور قید ہوئے، مگر صابر اور پاک دامن رہے۔',
        'انہوں نے بادشاہ کے خواب کی تعبیر بتائی اور مصر کے خزانوں کے نگران بنائے گئے۔',
        'انہوں نے بھائیوں کو معاف کر دیا، اور خاندان مصر میں دوبارہ ملا اور بچپن کا خواب پورا ہوا۔',
      ],
      roman: [
        'Hazrat Yusuf (AS) ne khwab mein gyarah sitare, suraj aur chaand ko apne samne sajda karte dekha.',
        'Bhaiyon ne hasad mein unhein kunwein mein daal diya; woh Misr le jaye gaye.',
        'Unhon ne gunah ki dawat ko radd kiya, jhoota ilzaam laga aur qaid hue, magar sabir aur paak daman rahe.',
        'Unhon ne badshah ke khwab ki tabeer batayi aur Misr ke khazanon ke nigran banaye gaye.',
        'Unhon ne bhaiyon ko muaf kar diya, aur khandan Misr mein dobara mila aur bachpan ka khwab poora hua.',
      ],
    },
  },
  {
    id: 'musa',
    title: { en: 'Prophet Musa (AS)', ur: 'حضرت موسیٰ علیہ السلام', roman: 'Hazrat Musa (AS)' },
    beats: {
      en: [
        'Musa (AS) was born in Egypt when Pharaoh was oppressing the Children of Israel.',
        'As a baby he was placed in a chest on the river and was raised in Pharaoh’s own house.',
        'Allah spoke to him at Mount Tur and gave him signs, including his staff and shining hand.',
        'He called Pharaoh to Allah and led the Children of Israel out of Egypt.',
        'Allah parted the sea for them, Pharaoh drowned, and Musa (AS) received the Torah.',
      ],
      ur: [
        'حضرت موسیٰ علیہ السلام مصر میں اس وقت پیدا ہوئے جب فرعون بنی اسرائیل پر ظلم کر رہا تھا۔',
        'بچپن میں انہیں صندوق میں دریا میں رکھا گیا اور وہ فرعون کے گھر میں پروان چڑھے۔',
        'اللہ نے کوہِ طور پر ان سے کلام کیا اور انہیں نشانیاں دیں، جن میں عصا اور روشن ہاتھ شامل ہیں۔',
        'انہوں نے فرعون کو اللہ کی طرف بلایا اور بنی اسرائیل کو مصر سے نکالا۔',
        'اللہ نے ان کے لیے دریا پھاڑ دیا، فرعون ڈوب گیا، اور حضرت موسیٰ علیہ السلام کو تورات دی گئی۔',
      ],
      roman: [
        'Hazrat Musa (AS) Misr mein us waqt paida hue jab Firaun Bani Israel par zulm kar raha tha.',
        'Bachpan mein unhein sandooq mein darya mein rakha gaya aur woh Firaun ke ghar mein parwan charhe.',
        'Allah ne Koh-e-Tur par un se kalam kiya aur unhein nishaniyan dein, jin mein asa aur roshan haath shamil hain.',
        'Unhon ne Firaun ko Allah ki taraf bulaya aur Bani Israel ko Misr se nikala.',
        'Allah ne un ke liye darya phaar diya, Firaun doob gaya, aur Hazrat Musa (AS) ko Taurat di gayi.',
      ],
    },
  },
  {
    id: 'dawud',
    title: { en: 'Prophet Dawud (AS)', ur: 'حضرت داؤد علیہ السلام', roman: 'Hazrat Dawud (AS)' },
    beats: {
      en: [
        'Dawud (AS) was a prophet and king of the Children of Israel, known for justice.',
        'As a young man he defeated Jalut (Goliath) by Allah’s permission.',
        'Allah gave him the Zabur (Psalms) and a beautiful voice for recitation.',
        'The mountains and birds joined him in glorifying Allah.',
        'Allah taught him the making of coats of mail and softened iron for him.',
      ],
      ur: [
        'حضرت داؤد علیہ السلام بنی اسرائیل کے نبی اور بادشاہ تھے، جو انصاف کے لیے مشہور تھے۔',
        'جوانی میں انہوں نے اللہ کے اذن سے جالوت کو شکست دی۔',
        'اللہ نے انہیں زبور عطا کی اور تلاوت کے لیے خوبصورت آواز دی۔',
        'پہاڑ اور پرندے ان کے ساتھ اللہ کی تسبیح میں شریک ہوتے تھے۔',
        'اللہ نے انہیں زرہ بنانا سکھایا اور ان کے لیے لوہا نرم کر دیا۔',
      ],
      roman: [
        'Hazrat Dawud (AS) Bani Israel ke nabi aur badshah thay, jo insaf ke liye mashhoor thay.',
        'Jawani mein unhon ne Allah ke izn se Jalut ko shikast di.',
        'Allah ne unhein Zabur ata ki aur tilawat ke liye khoobsurat awaaz di.',
        'Pahaar aur parinde un ke saath Allah ki tasbeeh mein shareek hote thay.',
        'Allah ne unhein zirah banana sikhaya aur un ke liye loha naram kar diya.',
      ],
    },
  },
  {
    id: 'sulaiman',
    title: { en: 'Prophet Sulaiman (AS)', ur: 'حضرت سلیمان علیہ السلام', roman: 'Hazrat Sulaiman (AS)' },
    beats: {
      en: [
        'Sulaiman (AS), son of Dawud (AS), was a prophet and king given great wisdom.',
        'Allah taught him the speech of birds and subjected the wind to him.',
        'He heard an ant warn its colony and smiled at its words, thanking Allah.',
        'The Queen of Sheba (Bilqis) visited him and later submitted to Allah, Lord of the worlds.',
        'He prayed for a kingdom not given to anyone after him, and always turned to Allah in gratitude.',
      ],
      ur: [
        'حضرت سلیمان علیہ السلام، حضرت داؤد علیہ السلام کے بیٹے، نبی اور بادشاہ تھے جنہیں بڑی حکمت عطا ہوئی۔',
        'اللہ نے انہیں پرندوں کی بولی سکھائی اور ہوا کو ان کے تابع کر دیا۔',
        'انہوں نے ایک چیونٹی کو اپنی قوم کو خبردار کرتے سنا اور اس کی بات پر مسکرا کر اللہ کا شکر ادا کیا۔',
        'ملکۂ سبا (بلقیس) ان کے پاس آئیں اور بعد میں اللہ رب العالمین کے سامنے جھک گئیں۔',
        'انہوں نے ایسی بادشاہت کی دعا کی جو ان کے بعد کسی کو نہ ملے، اور ہمیشہ شکر کے ساتھ اللہ کی طرف رجوع کیا۔',
      ],
      roman: [
        'Hazrat Sulaiman (AS), Hazrat Dawud (AS) ke bete, nabi aur badshah thay jinhein bari hikmat ata hui.',
        'Allah ne unhein parindon ki boli sikhayi aur hawa ko un ke taabe kar diya.',
        'Unhon ne ek cheenti ko apni qaum ko khabardar karte suna aur us ki baat par muskura kar Allah ka shukr ada kiya.',
        'Malika-e-Saba (Bilqis) un ke paas aayen aur baad mein Allah Rabb-ul-Aalameen ke samne jhuk gayen.',
        'Unhon ne aisi badshahat ki dua ki jo un ke baad kisi ko na mile, aur hamesha shukr ke saath Allah ki taraf rujoo kiya.',
      ],
    },
  },
  {
    id: 'yunus',
    title: { en: 'Prophet Yunus (AS)', ur: 'حضرت یونس علیہ السلام', roman: 'Hazrat Yunus (AS)' },
    beats: {
      en: [
        'Yunus (AS) was sent to the people of Nineveh to call them to Allah.',
        'He left his people in anger before Allah’s permission and boarded a ship.',
        'He was cast into the sea and swallowed by a great fish.',
        'In the darkness he called out: “There is no god but You; glory be to You; I was among the wrongdoers.”',
        'Allah answered him, saved him, and his people then believed and were spared.',
      ],
      ur: [
        'حضرت یونس علیہ السلام کو نینویٰ کے لوگوں کی طرف اللہ کی دعوت کے لیے بھیجا گیا۔',
        'وہ اللہ کی اجازت سے پہلے ناراض ہو کر اپنی قوم کو چھوڑ کر کشتی میں سوار ہو گئے۔',
        'انہیں سمندر میں ڈالا گیا اور ایک بڑی مچھلی نے انہیں نگل لیا۔',
        'اندھیروں میں انہوں نے پکارا: ”تیرے سوا کوئی معبود نہیں؛ تو پاک ہے؛ میں ہی ظالموں میں سے تھا۔“',
        'اللہ نے ان کی دعا قبول کی، انہیں نجات دی، اور ان کی قوم نے ایمان لا کر عذاب سے بچاؤ پایا۔',
      ],
      roman: [
        'Hazrat Yunus (AS) ko Nineveh ke logon ki taraf Allah ki dawat ke liye bheja gaya.',
        'Woh Allah ki ijazat se pehle naraz ho kar apni qaum ko chhor kar kashti mein sawar ho gaye.',
        'Unhein samandar mein dala gaya aur ek bari machhli ne unhein nigal liya.',
        'Andheron mein unhon ne pukara: “Tere siwa koi mabood nahi; Tu paak hai; main hi zalimon mein se tha.”',
        'Allah ne un ki dua qubool ki, unhein nijaat di, aur un ki qaum ne iman la kar azaab se bachao paya.',
      ],
    },
  },
  {
    id: 'isa',
    title: { en: 'Prophet Isa (AS)', ur: 'حضرت عیسیٰ علیہ السلام', roman: 'Hazrat Isa (AS)' },
    beats: {
      en: [
        'Isa (AS) was born to Maryam (AS) by Allah’s command, without a father.',
        'He spoke in the cradle, defending his mother and declaring himself Allah’s servant and prophet.',
        'By Allah’s permission he healed the blind and the leper and gave life to the dead.',
        'He called the Children of Israel to worship Allah and confirmed the Torah, giving glad tidings of a messenger to come after him.',
        'Allah raised him up to Himself; in Islamic belief he was not crucified.',
      ],
      ur: [
        'حضرت عیسیٰ علیہ السلام اللہ کے حکم سے حضرت مریم علیہا السلام کے ہاں بغیر باپ کے پیدا ہوئے۔',
        'انہوں نے جھولے میں کلام کیا، اپنی والدہ کی صفائی دی اور خود کو اللہ کا بندہ اور نبی بتایا۔',
        'اللہ کے اذن سے انہوں نے اندھے اور کوڑھی کو شفا دی اور مردوں کو زندہ کیا۔',
        'انہوں نے بنی اسرائیل کو اللہ کی عبادت کی دعوت دی، تورات کی تصدیق کی اور اپنے بعد آنے والے رسول کی خوشخبری دی۔',
        'اللہ نے انہیں اپنی طرف اٹھا لیا؛ اسلامی عقیدے کے مطابق وہ سولی پر نہیں چڑھائے گئے۔',
      ],
      roman: [
        'Hazrat Isa (AS) Allah ke hukm se Hazrat Maryam (AS) ke haan baghair baap ke paida hue.',
        'Unhon ne jhoole mein kalam kiya, apni walida ki safai di aur khud ko Allah ka banda aur nabi bataya.',
        'Allah ke izn se unhon ne andhe aur korhi ko shifa di aur murdon ko zinda kiya.',
        'Unhon ne Bani Israel ko Allah ki ibadat ki dawat di, Taurat ki tasdeeq ki aur apne baad aane wale rasool ki khushkhabri di.',
        'Allah ne unhein apni taraf utha liya; Islami aqeede ke mutabiq woh sooli par nahi charhaye gaye.',
      ],
    },
  },
  {
    id: 'muhammad',
    title: { en: 'Prophet Muhammad (ﷺ)', ur: 'حضرت محمد ﷺ', roman: 'Hazrat Muhammad (ﷺ)' },
    beats: {
      en: [
        'His full life story is told step by step in the Seerah timeline above — open it to read from his birth to his passing.',
        'Muhammad (ﷺ) is the final Prophet and Messenger of Allah, sent as a mercy to the worlds (Quran 21:107).',
        'He received the Quran through Angel Jibreel (AS) over about 23 years.',
        'He called people to worship Allah alone, and taught mercy, honesty, justice and good character.',
      ],
      ur: [
        'ان کی مکمل زندگی کی کہانی اوپر سیرت کی ترتیب وار فہرست میں قدم بہ قدم بیان ہے — ولادت سے وفات تک پڑھنے کے لیے اسے کھولیں۔',
        'حضرت محمد ﷺ اللہ کے آخری نبی اور رسول ہیں، جنہیں تمام جہانوں کے لیے رحمت بنا کر بھیجا گیا (قرآن 21:107)۔',
        'ان پر حضرت جبرائیل علیہ السلام کے ذریعے تقریباً 23 سال میں قرآن نازل ہوا۔',
        'انہوں نے لوگوں کو صرف اللہ کی عبادت کی دعوت دی اور رحمت، سچائی، انصاف اور اچھے اخلاق کی تعلیم دی۔',
      ],
      roman: [
        'Un ki mukammal zindagi ki kahani upar Seerah ki tartib waar fehrist mein qadam ba qadam bayan hai — wiladat se wafat tak parhne ke liye use kholein.',
        'Hazrat Muhammad ﷺ Allah ke aakhri Nabi aur Rasool hain, jinhein tamam jahanon ke liye rehmat bana kar bheja gaya (Quran 21:107).',
        'Un par Hazrat Jibreel (AS) ke zariye taqreeban 23 saal mein Quran nazil hua.',
        'Unhon ne logon ko sirf Allah ki ibadat ki dawat di aur rehmat, sachai, insaf aur achhe akhlaq ki taleem di.',
      ],
    },
  },
];

export const sahabaStories = [
  {
    id: 'abu-bakr',
    group: 'companions',
    title: { en: 'Abu Bakr As-Siddiq (RA)', ur: 'حضرت ابوبکر صدیق رضی اللہ عنہ', roman: 'Hazrat Abu Bakr As-Siddiq (RA)' },
    bio: {
      en: [
        'The closest friend of the Prophet (ﷺ) and the first adult man to believe in Islam.',
        'He freed enslaved Muslims, including Bilal (RA), spending his wealth for Allah’s sake.',
        'He accompanied the Prophet (ﷺ) on the Hijrah and stayed with him in the Cave of Thawr.',
        'He became the first caliph and had the Quran compiled into a single book.',
      ],
      ur: [
        'نبی کریم ﷺ کے قریب ترین دوست اور بالغ مردوں میں سب سے پہلے اسلام قبول کرنے والے۔',
        'انہوں نے اللہ کی راہ میں مال خرچ کر کے حضرت بلال رضی اللہ عنہ سمیت کئی غلام مسلمانوں کو آزاد کرایا۔',
        'وہ ہجرت میں آپ ﷺ کے ساتھ رہے اور غارِ ثور میں آپ ﷺ کے ہمراہ تھے۔',
        'وہ پہلے خلیفہ بنے اور ان کے دور میں قرآن کو ایک کتاب کی صورت میں جمع کیا گیا۔',
      ],
      roman: [
        'Nabi Kareem ﷺ ke qareeb tareen dost aur baligh mardon mein sab se pehle Islam qubool karne wale.',
        'Unhon ne Allah ki raah mein maal kharch kar ke Hazrat Bilal (RA) samait kai ghulam Musalmanon ko azaad karaya.',
        'Woh Hijrat mein aap ﷺ ke saath rahe aur Ghar-e-Thawr mein aap ﷺ ke hamrah thay.',
        'Woh pehle khalifa bane aur un ke daur mein Quran ko ek kitab ki soorat mein jama kiya gaya.',
      ],
    },
  },
  {
    id: 'umar',
    group: 'companions',
    title: { en: 'Umar ibn Al-Khattab (RA)', ur: 'حضرت عمر بن خطاب رضی اللہ عنہ', roman: 'Hazrat Umar ibn Al-Khattab (RA)' },
    bio: {
      en: [
        'A strong and respected man of Makkah whose acceptance of Islam strengthened the Muslims.',
        'Known as Al-Farooq — the one who distinguishes truth from falsehood.',
        'He became the second caliph and was famous for justice and accountability.',
        'Under his caliphate the Muslim community expanded greatly and public administration was organised.',
      ],
      ur: [
        'مکہ کے مضبوط اور معزز شخص، جن کے اسلام قبول کرنے سے مسلمانوں کو تقویت ملی۔',
        'الفاروق کے لقب سے مشہور — حق اور باطل میں فرق کرنے والے۔',
        'وہ دوسرے خلیفہ بنے اور انصاف اور احتساب کے لیے مشہور تھے۔',
        'ان کی خلافت میں مسلم معاشرہ بہت وسیع ہوا اور عوامی انتظام منظم کیا گیا۔',
      ],
      roman: [
        'Makkah ke mazboot aur muazzaz shakhs, jin ke Islam qubool karne se Musalmanon ko taqwiyat mili.',
        'Al-Farooq ke laqab se mashhoor — haq aur baatil mein farq karne wale.',
        'Woh doosre khalifa bane aur insaf aur ehtisab ke liye mashhoor thay.',
        'Un ki khilafat mein Muslim muashra bohat wasee hua aur awami intizam munazzam kiya gaya.',
      ],
    },
  },
  {
    id: 'uthman',
    group: 'companions',
    title: { en: 'Uthman ibn Affan (RA)', ur: 'حضرت عثمان بن عفان رضی اللہ عنہ', roman: 'Hazrat Uthman ibn Affan (RA)' },
    bio: {
      en: [
        'A wealthy and generous companion, known for his modesty and kindness.',
        'He spent generously for the community, including equipping an army and buying a well for the people of Madinah.',
        'He became the third caliph.',
        'Under him the Quran was prepared in one standard written copy and sent to the major cities.',
      ],
      ur: [
        'ایک مالدار اور سخی صحابی، جو حیا اور نرمی کے لیے مشہور تھے۔',
        'انہوں نے امت کے لیے دل کھول کر خرچ کیا، جن میں ایک لشکر کی تیاری اور مدینہ کے لوگوں کے لیے کنواں خریدنا شامل ہے۔',
        'وہ تیسرے خلیفہ بنے۔',
        'ان کے دور میں قرآن کو ایک معیاری تحریری نسخے میں تیار کر کے بڑے شہروں میں بھیجا گیا۔',
      ],
      roman: [
        'Ek maal daar aur sakhi Sahabi, jo haya aur narmi ke liye mashhoor thay.',
        'Unhon ne ummat ke liye dil khol kar kharch kiya, jin mein ek lashkar ki tayyari aur Madinah ke logon ke liye kunwan khareedna shamil hai.',
        'Woh teesre khalifa bane.',
        'Un ke daur mein Quran ko ek mayari tehreeri nuskhe mein tayyar kar ke bare shehron mein bheja gaya.',
      ],
    },
  },
  {
    id: 'ali',
    group: 'companions',
    title: { en: 'Ali ibn Abi Talib (RA)', ur: 'حضرت علی بن ابی طالب رضی اللہ عنہ', roman: 'Hazrat Ali ibn Abi Talib (RA)' },
    bio: {
      en: [
        'The cousin of the Prophet (ﷺ), raised in his household, and among the first to believe as a young boy.',
        'He slept in the Prophet’s (ﷺ) bed on the night of the Hijrah so the Prophet could leave Makkah safely.',
        'Known for his courage, knowledge and eloquence; he married Fatimah (RA), the Prophet’s daughter.',
        'He became the fourth caliph.',
      ],
      ur: [
        'نبی کریم ﷺ کے چچا زاد، آپ ﷺ کے گھر میں پرورش پانے والے، اور بچپن میں سب سے پہلے ایمان لانے والوں میں شامل۔',
        'ہجرت کی رات وہ آپ ﷺ کے بستر پر سوئے تاکہ آپ ﷺ مکہ سے سلامتی سے نکل سکیں۔',
        'بہادری، علم اور فصاحت کے لیے مشہور؛ ان کا نکاح آپ ﷺ کی بیٹی حضرت فاطمہ رضی اللہ عنہا سے ہوا۔',
        'وہ چوتھے خلیفہ بنے۔',
      ],
      roman: [
        'Nabi Kareem ﷺ ke chacha zaad, aap ﷺ ke ghar mein parwarish paane wale, aur bachpan mein sab se pehle iman laane walon mein shamil.',
        'Hijrat ki raat woh aap ﷺ ke bistar par soye taake aap ﷺ Makkah se salamti se nikal sakein.',
        'Bahaduri, ilm aur fasahat ke liye mashhoor; un ka nikah aap ﷺ ki beti Hazrat Fatimah (RA) se hua.',
        'Woh chauthe khalifa bane.',
      ],
    },
  },
  {
    id: 'bilal',
    group: 'companions',
    title: { en: 'Bilal ibn Rabah (RA)', ur: 'حضرت بلال بن رباح رضی اللہ عنہ', roman: 'Hazrat Bilal ibn Rabah (RA)' },
    bio: {
      en: [
        'An Abyssinian companion who was enslaved and tortured in Makkah for accepting Islam, yet remained firm saying “Ahad, Ahad” (Allah is One).',
        'Abu Bakr (RA) freed him by purchasing his freedom.',
        'He became the first mu’adhdhin of Islam, calling the adhan in Masjid an-Nabawi.',
        'He is remembered for patience, steadfast faith and devotion.',
      ],
      ur: [
        'ایک حبشی صحابی جنہیں اسلام قبول کرنے پر مکہ میں غلام بنا کر اذیت دی گئی، مگر وہ ”احد، احد“ کہتے ہوئے ثابت قدم رہے۔',
        'حضرت ابوبکر رضی اللہ عنہ نے انہیں خرید کر آزاد کر دیا۔',
        'وہ اسلام کے پہلے مؤذن بنے اور مسجدِ نبوی میں اذان دیتے تھے۔',
        'انہیں صبر، ثابت قدم ایمان اور لگن کے لیے یاد کیا جاتا ہے۔',
      ],
      roman: [
        'Ek Habshi Sahabi jinhein Islam qubool karne par Makkah mein ghulam bana kar aziyat di gayi, magar woh “Ahad, Ahad” kehte hue sabit qadam rahe.',
        'Hazrat Abu Bakr (RA) ne unhein khareed kar azaad kar diya.',
        'Woh Islam ke pehle mu’adhdhin bane aur Masjid-e-Nabawi mein adhan dete thay.',
        'Unhein sabr, sabit qadam iman aur lagan ke liye yaad kiya jata hai.',
      ],
    },
  },
  {
    id: 'hamza',
    group: 'companions',
    title: { en: 'Hamza ibn Abdul Muttalib (RA)', ur: 'حضرت حمزہ بن عبدالمطلب رضی اللہ عنہ', roman: 'Hazrat Hamza ibn Abdul Muttalib (RA)' },
    bio: {
      en: [
        'The uncle of the Prophet (ﷺ) and a brave, respected man of Makkah.',
        'He accepted Islam and became a strong defender of the Muslims.',
        'He fought bravely at Badr.',
        'He was martyred at Uhud and is honoured with the title Sayyid ash-Shuhada (Chief of the Martyrs).',
      ],
      ur: [
        'نبی کریم ﷺ کے چچا اور مکہ کے بہادر اور معزز شخص۔',
        'انہوں نے اسلام قبول کیا اور مسلمانوں کے مضبوط محافظ بنے۔',
        'انہوں نے بدر میں بہادری سے حصہ لیا۔',
        'وہ احد میں شہید ہوئے اور انہیں سید الشہداء (شہیدوں کے سردار) کے لقب سے یاد کیا جاتا ہے۔',
      ],
      roman: [
        'Nabi Kareem ﷺ ke chacha aur Makkah ke bahadur aur muazzaz shakhs.',
        'Unhon ne Islam qubool kiya aur Musalmanon ke mazboot muhafiz bane.',
        'Unhon ne Badr mein bahaduri se hissa liya.',
        'Woh Uhud mein shaheed hue aur unhein Sayyid ash-Shuhada (shaheedon ke sardar) ke laqab se yaad kiya jata hai.',
      ],
    },
  },
  {
    id: 'salman',
    group: 'companions',
    title: { en: 'Salman Al-Farsi (RA)', ur: 'حضرت سلمان فارسی رضی اللہ عنہ', roman: 'Hazrat Salman Al-Farsi (RA)' },
    bio: {
      en: [
        'A Persian companion who travelled far in search of the truth before reaching Madinah.',
        'He accepted Islam and was freed from slavery with the help of the Prophet (ﷺ) and the Muslims.',
        'He suggested digging the trench that protected Madinah at the Battle of the Trench.',
        'The Prophet (ﷺ) counted him as one of his household (Ahl al-Bayt) in affection.',
      ],
      ur: [
        'ایک فارسی صحابی جنہوں نے حق کی تلاش میں طویل سفر کیا اور مدینہ پہنچے۔',
        'انہوں نے اسلام قبول کیا اور نبی کریم ﷺ اور مسلمانوں کی مدد سے غلامی سے آزاد ہوئے۔',
        'انہوں نے غزوۂ خندق میں مدینہ کی حفاظت کے لیے خندق کھودنے کا مشورہ دیا۔',
        'نبی کریم ﷺ نے محبت میں انہیں اپنے اہلِ بیت میں سے شمار کیا۔',
      ],
      roman: [
        'Ek Farsi Sahabi jinhon ne haq ki talash mein taweel safar kiya aur Madinah pahunche.',
        'Unhon ne Islam qubool kiya aur Nabi Kareem ﷺ aur Musalmanon ki madad se ghulami se azaad hue.',
        'Unhon ne Ghazwa-e-Khandaq mein Madinah ki hifazat ke liye khandaq khodne ka mashwara diya.',
        'Nabi Kareem ﷺ ne muhabbat mein unhein apne Ahl-e-Bait mein se shumaar kiya.',
      ],
    },
  },
  {
    id: 'khadijah',
    group: 'women',
    title: { en: 'Khadijah bint Khuwaylid (RA)', ur: 'حضرت خدیجہ بنت خویلد رضی اللہ عنہا', roman: 'Hazrat Khadijah bint Khuwaylid (RA)' },
    bio: {
      en: [
        'A respected merchant of Makkah and the wife of the Prophet (ﷺ).',
        'She was the very first person to believe in him when revelation began, and she comforted and supported him.',
        'She stood by him and spent her wealth for Islam during the hardest years in Makkah.',
        'She passed away in the Year of Sorrow, and the Prophet (ﷺ) always remembered her with love and loyalty.',
      ],
      ur: [
        'مکہ کی معزز تاجر اور نبی کریم ﷺ کی اہلیہ۔',
        'وحی کے آغاز پر وہ سب سے پہلے آپ ﷺ پر ایمان لائیں اور آپ ﷺ کو تسلی اور سہارا دیا۔',
        'انہوں نے مکہ کے مشکل ترین سالوں میں آپ ﷺ کا ساتھ دیا اور اپنا مال اسلام کے لیے خرچ کیا۔',
        'ان کا انتقال عام الحزن میں ہوا، اور آپ ﷺ ہمیشہ انہیں محبت اور وفاداری سے یاد کرتے تھے۔',
      ],
      roman: [
        'Makkah ki muazzaz tajir aur Nabi Kareem ﷺ ki ahliya.',
        'Wahi ke aaghaz par woh sab se pehle aap ﷺ par iman laayen aur aap ﷺ ko tasalli aur sahara diya.',
        'Unhon ne Makkah ke mushkil tareen saalon mein aap ﷺ ka saath diya aur apna maal Islam ke liye kharch kiya.',
        'Un ka inteqal Aam-ul-Huzn mein hua, aur aap ﷺ hamesha unhein muhabbat aur wafadari se yaad karte thay.',
      ],
    },
  },
  {
    id: 'aisha',
    group: 'women',
    title: { en: 'Aisha bint Abi Bakr (RA)', ur: 'حضرت عائشہ بنت ابی بکر رضی اللہ عنہا', roman: 'Hazrat Aisha bint Abi Bakr (RA)' },
    bio: {
      en: [
        'The wife of the Prophet (ﷺ) and daughter of Abu Bakr (RA).',
        'She was known for her sharp memory, deep knowledge and understanding of Islam.',
        'Many companions learned hadith and religious rulings from her after the Prophet’s (ﷺ) passing.',
        'The Prophet (ﷺ) passed away in her chamber in Madinah and was buried there.',
      ],
      ur: [
        'نبی کریم ﷺ کی اہلیہ اور حضرت ابوبکر رضی اللہ عنہ کی بیٹی۔',
        'وہ تیز حافظے، گہرے علم اور اسلام کی سمجھ کے لیے مشہور تھیں۔',
        'آپ ﷺ کی وفات کے بعد بہت سے صحابہ نے ان سے حدیث اور دینی مسائل سیکھے۔',
        'آپ ﷺ کی وفات ان کے حجرے میں مدینہ میں ہوئی اور آپ ﷺ وہیں مدفون ہوئے۔',
      ],
      roman: [
        'Nabi Kareem ﷺ ki ahliya aur Hazrat Abu Bakr (RA) ki beti.',
        'Woh tez hafze, gehre ilm aur Islam ki samajh ke liye mashhoor theen.',
        'Aap ﷺ ki wafat ke baad bohat se Sahaba ne un se hadith aur deeni masail seekhe.',
        'Aap ﷺ ki wafat un ke hujre mein Madinah mein hui aur aap ﷺ waheen madfoon hue.',
      ],
    },
  },
];
