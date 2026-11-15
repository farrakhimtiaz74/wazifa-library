// Wave 5 — Life Tools content (items 78–81). Step texts are short summaries
// in EN / UR / Roman, following the trilingual data-file pattern. The Hajj
// and Umrah guides are SUMMARIES — the UI carries a "confirm details with a
// scholar" note, and no rite is presented as a fatwa.

export const TALBIYAH = {
  arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
  transliteration: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk. Innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
  en: 'Here I am, O Allah, here I am. Here I am — You have no partner — here I am. Truly all praise, blessings and dominion belong to You. You have no partner.',
  ur: 'میں حاضر ہوں اے اللہ، میں حاضر ہوں۔ میں حاضر ہوں — تیرا کوئی شریک نہیں — میں حاضر ہوں۔ بے شک تمام تعریف، نعمتیں اور بادشاہت تیرے ہی لیے ہیں۔ تیرا کوئی شریک نہیں۔',
  roman: 'Main hazir hoon ay Allah, main hazir hoon. Main hazir hoon — Tera koi shareek nahi — main hazir hoon. Beshak tamam tareef, nematein aur badshahat Tere hi liye hain. Tera koi shareek nahi.'
}

// ---------- Item 79: Umrah steps ----------
export const UMRAH_STEPS = [
  {
    title: { en: '1. Ihram at the Miqat', ur: '۱۔ میقات پر احرام', roman: '1. Miqat par Ihram' },
    text: {
      en: 'Bathe (ghusl), wear the ihram garments, pray two rak’ah, make the intention for Umrah, and begin reciting the Talbiyah (below). From here the ihram rules apply — no perfume, no cutting hair or nails, no hunting.',
      ur: 'غسل کریں، احرام کے کپڑے پہنیں، دو رکعت نماز پڑھیں، عمرے کی نیت کریں اور تلبیہ (نیچے درج) پڑھنا شروع کر دیں۔ یہاں سے احرام کی پابندیاں لاگو ہوتی ہیں — خوشبو نہ لگائیں، بال یا ناخن نہ کاٹیں، شکار نہ کریں۔',
      roman: 'Ghusl karein, ihram ke kapre pehnein, do rakat namaz parhein, Umrah ki niyyat karein aur Talbiyah (neeche darj) parhna shuru kar dein. Yahan se ihram ki pabandiyan lago hoti hain — khushbu na lagayein, baal ya nakhun na katein, shikar na karein.'
    }
  },
  {
    title: { en: '2. Enter Makkah & the Haram', ur: '۲۔ مکہ اور حرم میں داخلہ', roman: '2. Makkah aur Haram mein dakhila' },
    text: {
      en: 'Enter Masjid al-Haram with your right foot and the dua for entering a mosque. At your first sight of the Kaaba, raise your hands and make heartfelt dua — this moment is special.',
      ur: 'مسجد الحرام میں دائیں قدم سے داخل ہوں اور مسجد میں داخل ہونے کی دعا پڑھیں۔ کعبہ پر پہلی نظر پڑتے ہی ہاتھ اٹھا کر دل سے دعا کریں — یہ لمحہ خاص ہے۔',
      roman: 'Masjid al-Haram mein daayein qadam se dakhil hon aur masjid mein dakhil hone ki dua parhein. Kaaba par pehli nazar parte hi haath utha kar dil se dua karein — ye lamha khaas hai.'
    }
  },
  {
    title: { en: '3. Tawaf — 7 rounds', ur: '۳۔ طواف — ۷ چکر', roman: '3. Tawaf — 7 chakkar' },
    text: {
      en: 'Circle the Kaaba seven times, beginning and ending at the Black Stone line, keeping the Kaaba on your left. Between Rukn Yamani and the Black Stone, recite: “Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina ‘adhaban-nar” (Quran 2:201). Fill the rest with dhikr and your own duas.',
      ur: 'حجرِ اسود کی لائن سے شروع کر کے کعبہ کے سات چکر لگائیں، کعبہ آپ کے بائیں طرف رہے۔ رکنِ یمانی اور حجرِ اسود کے درمیان یہ دعا پڑھیں: ”ربنا آتنا فی الدنیا حسنۃ و فی الآخرۃ حسنۃ و قنا عذاب النار“ (قرآن ۲:۲۰۱)۔ باقی وقت ذکر اور اپنی دعاؤں میں گزاریں۔',
      roman: 'Hajr-e-Aswad ki line se shuru kar ke Kaaba ke saat chakkar lagayein, Kaaba aap ke baayein taraf rahe. Rukn-e-Yamani aur Hajr-e-Aswad ke darmiyan ye dua parhein: “Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina azaban-nar” (Quran 2:201). Baqi waqt zikr aur apni duaon mein guzarein.'
    }
  },
  {
    title: { en: '4. Two rak’ah at Maqam Ibrahim', ur: '۴۔ مقامِ ابراہیم پر دو رکعت', roman: '4. Maqam-e-Ibrahim par do rakat' },
    text: {
      en: 'Pray two rak’ah behind Maqam Ibrahim (or anywhere in the Haram if it is crowded). It is commonly practised to recite Surah Al-Kafirun in the first rak’ah and Surah Al-Ikhlas in the second.',
      ur: 'مقامِ ابراہیم کے پیچھے دو رکعت نماز پڑھیں (رش ہو تو حرم میں کہیں بھی پڑھ سکتے ہیں)۔ عام طور پر پہلی رکعت میں سورۃ الکافرون اور دوسری میں سورۃ الاخلاص پڑھی جاتی ہے۔',
      roman: 'Maqam-e-Ibrahim ke peeche do rakat namaz parhein (rush ho to Haram mein kahin bhi parh sakte hain). Aam tor par pehli rakat mein Surah Al-Kafirun aur doosri mein Surah Al-Ikhlas parhi jati hai.'
    }
  },
  {
    title: { en: '5. Drink Zamzam', ur: '۵۔ آبِ زمزم پئیں', roman: '5. Aab-e-Zamzam piyein' },
    text: {
      en: 'Drink Zamzam water to your fill, facing the Kaaba if possible, and make dua — the Prophet ﷺ said Zamzam is for whatever it is drunk for (Ibn Majah).',
      ur: 'آبِ زمزم پیٹ بھر کر پئیں، ممکن ہو تو کعبہ کی طرف منہ کر کے، اور دعا کریں — نبی ﷺ نے فرمایا: آبِ زمزم جس نیت سے پیا جائے اسی کے لیے ہے (ابن ماجہ)۔',
      roman: 'Aab-e-Zamzam pait bhar kar piyein, mumkin ho to Kaaba ki taraf munh kar ke, aur dua karein — Nabi ﷺ ne farmaya: Aab-e-Zamzam jis niyyat se piya jaye usi ke liye hai (Ibn Majah).'
    }
  },
  {
    title: { en: '6. Sa’i — Safa & Marwah', ur: '۶۔ سعی — صفا و مروہ', roman: '6. Sa’i — Safa o Marwah' },
    text: {
      en: 'Walk seven lengths between Safa and Marwah (Safa → Marwah is one, Marwah → Safa is two, ending at Marwah). Men walk briskly between the green lights. Remember Hajar (AS), who ran here searching for water for her son Ismail (AS).',
      ur: 'صفا اور مروہ کے درمیان سات چکر لگائیں (صفا سے مروہ ایک، مروہ سے صفا دوسرا، اختتام مروہ پر)۔ مرد سبز بتیوں کے درمیان تیز چلیں۔ حضرت ہاجرہؑ کو یاد کریں جو یہاں اپنے بیٹے اسماعیلؑ کے لیے پانی تلاش کرتی دوڑیں۔',
      roman: 'Safa aur Marwah ke darmiyan saat chakkar lagayein (Safa se Marwah ek, Marwah se Safa doosra, ikhtitam Marwah par). Mard sabz battiyon ke darmiyan tez chalein. Hazrat Hajra (AS) ko yaad karein jo yahan apne bete Ismail (AS) ke liye pani talash karti daurein.'
    }
  },
  {
    title: { en: '7. Haircut — Umrah complete', ur: '۷۔ بال کٹوانا — عمرہ مکمل', roman: '7. Baal katwana — Umrah mukammal' },
    text: {
      en: 'Men shave the head (best) or trim all over; women trim about a fingertip’s length from the ends of the hair. With this, Umrah is complete and ihram ends — Alhamdulillah.',
      ur: 'مرد سر منڈوائیں (افضل) یا پورے سر کے بال برابر کٹوائیں؛ خواتین بالوں کے سروں سے تقریباً ایک پور کے برابر کاٹیں۔ اس کے ساتھ عمرہ مکمل ہو جاتا ہے اور احرام ختم ہو جاتا ہے — الحمدللہ۔',
      roman: 'Mard sar mundwayein (afzal) ya poore sar ke baal barabar katwayein; khawateen baalon ke siron se taqreeban ek por ke barabar katein. Is ke saath Umrah mukammal ho jata hai aur ihram khatam ho jata hai — Alhamdulillah.'
    }
  }
]

// ---------- Item 80: Hajj day by day ----------
export const HAJJ_DAYS = [
  {
    title: { en: '8 Dhul Hijjah — Mina (Yawm al-Tarwiyah)', ur: '۸ ذوالحجہ — منیٰ (یوم الترویہ)', roman: '8 Zulhijjah — Mina (Yawm al-Tarwiyah)' },
    text: {
      en: 'Enter ihram for Hajj from Makkah and go to Mina. Pray Dhuhr, Asr, Maghrib, Isha and (next morning) Fajr there, shortening the four-rak’ah prayers, and stay the night.',
      ur: 'مکہ سے حج کا احرام باندھ کر منیٰ جائیں۔ وہاں ظہر، عصر، مغرب، عشاء اور (اگلی صبح) فجر ادا کریں، چار رکعت والی نمازیں قصر کریں، اور رات وہیں گزاریں۔',
      roman: 'Makkah se Hajj ka ihram bandh kar Mina jayein. Wahan Zuhr, Asr, Maghrib, Isha aur (agli subah) Fajr ada karein, chaar rakat wali namazein qasr karein, aur raat wahin guzarein.'
    }
  },
  {
    title: { en: '9 Dhul Hijjah — Arafah & Muzdalifah', ur: '۹ ذوالحجہ — عرفات و مزدلفہ', roman: '9 Zulhijjah — Arafat o Muzdalifah' },
    text: {
      en: 'After Fajr in Mina, go to Arafat. The standing (wuquf) at Arafah from midday until sunset is the heart of Hajj — fill it with dua, including the great Arafah dua in the Dhul Hijjah page. After sunset, go to Muzdalifah, combine Maghrib and Isha, collect your pebbles (49 or 70), and rest under the open sky.',
      ur: 'منیٰ میں فجر کے بعد عرفات جائیں۔ زوال سے غروب تک عرفات میں قیام (وقوف) ہی حج کا رکنِ اعظم ہے — اسے دعاؤں سے بھریں، جن میں ذوالحجہ والے صفحے کی عرفہ کی بڑی دعا بھی شامل ہے۔ غروب کے بعد مزدلفہ جائیں، مغرب و عشاء اکٹھی پڑھیں، کنکریاں (۴۹ یا ۷۰) اکٹھی کریں اور کھلے آسمان تلے آرام کریں۔',
      roman: 'Mina mein Fajr ke baad Arafat jayein. Zawal se ghuroob tak Arafat mein qayam (wuquf) hi Hajj ka rukn-e-azam hai — ise duaon se bharein, jin mein Zulhijjah wale safhe ki Arafah ki bari dua bhi shamil hai. Ghuroob ke baad Muzdalifah jayein, Maghrib o Isha ikatthi parhein, kankariyan (49 ya 70) ikatthi karein aur khule aasman tale aaram karein.'
    }
  },
  {
    title: { en: '10 Dhul Hijjah — Eid day: Rami, Qurbani, Tawaf', ur: '۱۰ ذوالحجہ — عید کا دن: رمی، قربانی، طواف', roman: '10 Zulhijjah — Eid ka din: Rami, Qurbani, Tawaf' },
    text: {
      en: 'Stone the big Jamarah (Jamrat al-Aqabah) with 7 pebbles, then offer the Qurbani, then shave or trim the hair — most ihram rules now lift. Return to Makkah for Tawaf al-Ifadah and Sa’i; this tawaf is an essential pillar of Hajj.',
      ur: 'بڑے جمرے (جمرۃ العقبہ) کو ۷ کنکریاں ماریں، پھر قربانی کریں، پھر سر منڈوائیں یا بال کٹوائیں — اب احرام کی اکثر پابندیاں ختم ہو جاتی ہیں۔ پھر مکہ جا کر طوافِ افاضہ اور سعی کریں؛ یہ طواف حج کا لازمی رکن ہے۔',
      roman: 'Bare Jamre (Jamrat al-Aqabah) ko 7 kankariyan marein, phir qurbani karein, phir sar mundwayein ya baal katwayein — ab ihram ki aksar pabandiyan khatam ho jati hain. Phir Makkah ja kar Tawaf al-Ifadah aur Sa’i karein; ye tawaf Hajj ka lazmi rukn hai.'
    }
  },
  {
    title: { en: '11–13 Dhul Hijjah — Days of Tashreeq & farewell', ur: '۱۱–۱۳ ذوالحجہ — ایامِ تشریق و الوداع', roman: '11–13 Zulhijjah — Ayyam-e-Tashreeq o alwida' },
    text: {
      en: 'Stay in Mina and stone all three Jamarat each day after midday (7 pebbles each, small → middle → big). Those leaving on the 12th must depart before sunset. Before leaving Makkah at the end, perform Tawaf al-Wida (the farewell tawaf) as your last rite.',
      ur: 'منیٰ میں قیام کریں اور ہر دن زوال کے بعد تینوں جمروں کو کنکریاں ماریں (ہر ایک کو ۷، چھوٹا ← درمیانہ ← بڑا)۔ جو ۱۲ تاریخ کو نکلے اسے غروب سے پہلے نکلنا ہوگا۔ آخر میں مکہ چھوڑنے سے پہلے طوافِ وداع کریں — یہ آپ کا آخری عمل ہو۔',
      roman: 'Mina mein qayam karein aur har din zawal ke baad teeno jamron ko kankariyan marein (har ek ko 7, chhota → darmiyana → bara). Jo 12 tareekh ko nikle use ghuroob se pehle nikalna hoga. Aakhir mein Makkah chorne se pehle Tawaf al-Wida karein — ye aap ka aakhri amal ho.'
    }
  }
]

// ---------- Item 78: Janaza checklist ----------
export const JANAZA_STEPS = [
  { en: 'Inform close family, and contact your local mosque or funeral committee to arrange the ghusl, prayer and burial time.', ur: 'قریبی اہلِ خانہ کو اطلاع دیں، اور مقامی مسجد یا جنازہ کمیٹی سے غسل، نمازِ جنازہ اور تدفین کے وقت کے لیے رابطہ کریں۔', roman: 'Qareebi ahl-e-khana ko ittila dein, aur maqami masjid ya janaza committee se ghusl, namaz-e-janaza aur tadfeen ke waqt ke liye rabta karein.' },
  { en: 'Keep the deceased’s ID card and any documents your local authorities require ready.', ur: 'میت کا شناختی کارڈ اور مقامی حکام کے مطلوبہ کاغذات تیار رکھیں۔', roman: 'Mayyat ka shanakhti card aur maqami hukkam ke matlooba kaghazat tayyar rakhein.' },
  { en: 'Gently close the eyes, support the jaw, straighten the body and cover it fully with a clean sheet.', ur: 'نرمی سے آنکھیں بند کریں، جبڑے کو سہارا دیں، جسم سیدھا کریں اور صاف چادر سے پوری طرح ڈھانپ دیں۔', roman: 'Narmi se aankhein band karein, jabre ko sahara dein, jism seedha karein aur saaf chadar se poori tarah dhaanp dein.' },
  { en: 'Ghusl: the body is washed respectfully by washers of the same gender, an odd number of times, keeping it covered throughout.', ur: 'غسل: جسم کو ہم جنس غسل دینے والے عزت کے ساتھ طاق عدد مرتبہ دھوئیں، پورے عمل کے دوران پردہ قائم رکھیں۔', roman: 'Ghusl: jism ko ham-jins ghusl dene wale izzat ke saath taaq adad martaba dhoyein, poore amal ke doran parda qaim rakhein.' },
  { en: 'Kafan: wrap the body in the shroud (kafan) — simple, clean, unstitched cloth.', ur: 'کفن: میت کو سادہ، صاف، بے سلے کپڑے (کفن) میں لپیٹیں۔', roman: 'Kafan: mayyat ko sada, saaf, be-sile kapre (kafan) mein lapetein.' },
  { en: 'Janaza prayer: four takbirs, prayed standing in congregation — see the Janaza guide in the Prayer Hub for the method and dua.', ur: 'نمازِ جنازہ: چار تکبیروں کے ساتھ کھڑے ہو کر باجماعت ادا کریں — طریقہ اور دعا کے لیے نماز حب میں جنازہ گائیڈ دیکھیں۔', roman: 'Namaz-e-Janaza: chaar takbeeron ke saath khare ho kar bajamaat ada karein — tareeqa aur dua ke liye Prayer Hub mein Janaza guide dekhein.' },
  { en: 'Burial: carry the deceased to the graveyard, lower gently into the grave, and lay the body on its right side facing the Qibla.', ur: 'تدفین: میت کو قبرستان لے جائیں، نرمی سے قبر میں اتاریں، اور جسم کو دائیں پہلو پر قبلہ رخ لٹائیں۔', roman: 'Tadfeen: mayyat ko qabristan le jayein, narmi se qabr mein utarein, aur jism ko daayein pehlu par qibla rukh litayein.' },
  { en: 'After burial, stay a while and make dua for the deceased’s forgiveness and firmness — duas are collected on the Parents & Deceased page.', ur: 'تدفین کے بعد کچھ دیر رکیں اور میت کی مغفرت و ثابت قدمی کی دعا کریں — دعائیں ”والدین و مرحومین“ والے صفحے پر جمع ہیں۔', roman: 'Tadfeen ke baad kuch dair rukein aur mayyat ki maghfirat o sabit qadmi ki dua karein — duayein “Walidain o Marhoomeen” wale safhe par jama hain.' },
  { en: 'Support the family: arrange food for the bereaved household and help quietly with practical matters in the days after.', ur: 'اہلِ خانہ کا سہارا بنیں: سوگوار گھر کے لیے کھانے کا انتظام کریں اور بعد کے دنوں میں عملی کاموں میں خاموشی سے مدد کریں۔', roman: 'Ahl-e-khana ka sahara banein: sogwar ghar ke liye khane ka intizam karein aur baad ke dinon mein amli kamon mein khamoshi se madad karein.' }
]

// ---------- Item 81: Nikah checklist ----------
export const NIKAH_STEPS = [
  { en: 'Choose a righteous spouse, and pray Salat al-Istikhara before deciding.', ur: 'نیک شریکِ حیات منتخب کریں، اور فیصلے سے پہلے صلاۃ الاستخارہ پڑھیں۔', roman: 'Naik shareek-e-hayat muntakhib karein, aur faisle se pehle Salat al-Istikhara parhein.' },
  { en: 'The bride’s wali (guardian) agrees to the marriage.', ur: 'دلہن کے ولی (سرپرست) کی رضامندی حاصل ہو۔', roman: 'Dulhan ke wali (sarparast) ki razamandi hasil ho.' },
  { en: 'The mahr is decided and agreed by both sides — kept reasonable and written down.', ur: 'مہر طے ہو جائے اور دونوں فریق راضی ہوں — مناسب رکھیں اور لکھ لیں۔', roman: 'Mahr tay ho jaye aur dono fareeq raazi hon — munasib rakhein aur likh lein.' },
  { en: 'Two upright Muslim witnesses are arranged for the gathering.', ur: 'مجلس کے لیے دو نیک مسلمان گواہوں کا انتظام ہو۔', roman: 'Majlis ke liye do naik Musalman gawahon ka intizam ho.' },
  { en: 'The khutbah and the ijab-o-qabul (offer and acceptance) are prepared with the officiant.', ur: 'خطبہ اور ایجاب و قبول کی تیاری عالم/قاضی صاحب کے ساتھ کر لی جائے۔', roman: 'Khutbah aur ijab-o-qabul ki tayyari aalim/qazi sahab ke saath kar li jaye.' },
  { en: 'The walima (the Sunnah feast after nikah) is planned — simple, without extravagance.', ur: 'ولیمے (نکاح کے بعد کی سنت دعوت) کی منصوبہ بندی ہو — سادہ، اسراف کے بغیر۔', roman: 'Walima (nikah ke baad ki sunnat dawat) ki mansooba bandi ho — sada, israaf ke baghair.' },
  { en: 'Make dua for the couple — the Nikah & Spouse duas are collected on the Nikah page in the Duas hub.', ur: 'جوڑے کے لیے دعا کریں — نکاح و شریکِ حیات کی دعائیں دعا حب کے نکاح صفحے پر جمع ہیں۔', roman: 'Jore ke liye dua karein — nikah o shareek-e-hayat ki duayein Dua Hub ke Nikah safhe par jama hain.' }
]
