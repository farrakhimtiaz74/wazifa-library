// Wave 2 — Prayer Hub guides (items 16-18).
// Content follows widely-published fiqh summaries; kept non-sectarian.
// Every guide page shows the scholarNote disclaimer from i18n.

export const WUDU_STEPS = [
  {
    title: { en: 'Intention & Bismillah', ur: 'نیت اور بسم اللہ', roman: 'Niyyat aur Bismillah' },
    body: {
      en: 'Make the intention to perform wudu for prayer, and begin with Bismillah.',
      ur: 'نماز کے لیے وضو کی نیت کریں اور بسم اللہ سے آغاز کریں۔',
      roman: 'Namaz ke liye wudu ki niyyat karein aur Bismillah se aaghaz karein.'
    },
    arabic: 'بِسْمِ اللَّهِ'
  },
  {
    title: { en: 'Wash the hands ×3', ur: 'ہاتھ دھوئیں ×3', roman: 'Haath dhoyein ×3' },
    body: {
      en: 'Wash both hands up to the wrists three times, running fingers through each other.',
      ur: 'دونوں ہاتھ کلائیوں تک تین بار دھوئیں، انگلیوں میں خلال کریں۔',
      roman: 'Dono haath kalaiyon tak teen baar dhoyein, ungliyon mein khilal karein.'
    }
  },
  {
    title: { en: 'Rinse the mouth ×3', ur: 'کلی کریں ×3', roman: 'Kulli karein ×3' },
    body: {
      en: 'Take water in the right hand and rinse the mouth three times.',
      ur: 'دائیں ہاتھ میں پانی لے کر تین بار کلی کریں۔',
      roman: 'Dayein haath mein pani le kar teen baar kulli karein.'
    }
  },
  {
    title: { en: 'Clean the nose ×3', ur: 'ناک صاف کریں ×3', roman: 'Naak saaf karein ×3' },
    body: {
      en: 'Sniff water into the nose and blow it out three times (with the left hand).',
      ur: 'ناک میں پانی ڈال کر تین بار صاف کریں (بائیں ہاتھ سے)۔',
      roman: 'Naak mein pani daal kar teen baar saaf karein (bayein haath se).'
    }
  },
  {
    title: { en: 'Wash the face ×3', ur: 'چہرہ دھوئیں ×3', roman: 'Chehra dhoyein ×3' },
    body: {
      en: 'Wash the whole face three times — from the hairline to the chin and ear to ear.',
      ur: 'پورا چہرہ تین بار دھوئیں — بالوں کی جڑ سے ٹھوڑی تک اور ایک کان سے دوسرے کان تک۔',
      roman: 'Poora chehra teen baar dhoyein — baalon ki jarr se thuddi tak aur aik kaan se doosre kaan tak.'
    }
  },
  {
    title: { en: 'Wash the arms ×3', ur: 'بازو دھوئیں ×3', roman: 'Baazu dhoyein ×3' },
    body: {
      en: 'Wash the right arm then the left arm, up to and including the elbows, three times each.',
      ur: 'پہلے دایاں پھر بایاں بازو کہنیوں سمیت تین تین بار دھوئیں۔',
      roman: 'Pehle dayein phir bayein baazu kuhniyon samait teen teen baar dhoyein.'
    }
  },
  {
    title: { en: 'Wipe the head (Masah)', ur: 'سر کا مسح', roman: 'Sar ka masah' },
    body: {
      en: 'With wet hands, wipe over the head once, from front to back and back to front.',
      ur: 'گیلے ہاتھوں سے ایک بار سر کا مسح کریں، آگے سے پیچھے اور پیچھے سے آگے۔',
      roman: 'Geele haathon se aik baar sar ka masah karein, aage se peeche aur peeche se aage.'
    }
  },
  {
    title: { en: 'Wipe the ears', ur: 'کانوں کا مسح', roman: 'Kaanon ka masah' },
    body: {
      en: 'Wipe the inside of the ears with the index fingers and the outside with the thumbs, once.',
      ur: 'شہادت کی انگلیوں سے کانوں کے اندر اور انگوٹھوں سے باہر ایک بار مسح کریں۔',
      roman: 'Shahadat ki ungliyon se kaanon ke andar aur angothon se bahir aik baar masah karein.'
    }
  },
  {
    title: { en: 'Wash the feet ×3', ur: 'پاؤں دھوئیں ×3', roman: 'Paaon dhoyein ×3' },
    body: {
      en: 'Wash the right foot then the left foot, up to and including the ankles, three times each, cleaning between the toes.',
      ur: 'پہلے دایاں پھر بایاں پاؤں ٹخنوں سمیت تین تین بار دھوئیں، انگلیوں میں خلال کریں۔',
      roman: 'Pehle dayein phir bayein paaon takhnon samait teen teen baar dhoyein, ungliyon mein khilal karein.'
    }
  },
  {
    title: { en: 'Dua after wudu', ur: 'وضو کے بعد کی دعا', roman: 'Wudu ke baad ki dua' },
    body: {
      en: 'It is reported that whoever says this dua after wudu, the eight gates of Paradise are opened for him (Sahih Muslim).',
      ur: 'روایت ہے کہ جو وضو کے بعد یہ دعا پڑھے اس کے لیے جنت کے آٹھوں دروازے کھول دیے جاتے ہیں (صحیح مسلم)۔',
      roman: 'Riwayat hai ke jo wudu ke baad ye dua parhe us ke liye Jannat ke aathon darwaze khol diye jate hain (Sahih Muslim).'
    },
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ'
  }
]

export const SALAH_STEPS = [
  {
    title: { en: 'Stand & intend (Qiyam)', ur: 'کھڑے ہوں اور نیت کریں (قیام)', roman: 'Khare hon aur niyyat karein (Qiyam)' },
    body: {
      en: 'Stand facing the Qibla with calmness. Make the intention for the prayer you are praying.',
      ur: 'سکون کے ساتھ قبلہ رخ کھڑے ہوں۔ جو نماز پڑھ رہے ہیں اس کی نیت کریں۔',
      roman: 'Sukoon ke saath qibla rukh khare hon. Jo namaz parh rahe hain us ki niyyat karein.'
    }
  },
  {
    title: { en: 'Takbir — Allahu Akbar', ur: 'تکبیر — اللہ اکبر', roman: 'Takbeer — Allahu Akbar' },
    body: {
      en: 'Raise both hands to the ears (or shoulders) and say Allahu Akbar, then fold the hands below the navel or on the chest.',
      ur: 'دونوں ہاتھ کانوں (یا کندھوں) تک اٹھا کر اللہ اکبر کہیں، پھر ہاتھ ناف کے نیچے یا سینے پر باندھ لیں۔',
      roman: 'Dono haath kaanon (ya kandhon) tak utha kar Allahu Akbar kahein, phir haath naaf ke neeche ya seene par bandh lein.'
    },
    arabic: 'اللَّهُ أَكْبَرُ'
  },
  {
    title: { en: 'Sana (opening praise)', ur: 'ثنا', roman: 'Sana' },
    body: {
      en: 'Recite the opening praise quietly.',
      ur: 'آہستہ آواز میں ثنا پڑھیں۔',
      roman: 'Aahista awaaz mein sana parhein.'
    },
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ'
  },
  {
    title: { en: 'Surah Al-Fatihah & a surah', ur: 'سورۃ الفاتحہ اور سورت', roman: 'Surah Al-Fatihah aur surah' },
    body: {
      en: 'Say A\'udhu billah and Bismillah, recite Surah Al-Fatihah, say Ameen, then recite another surah or some verses (in the first two rak\'ahs).',
      ur: 'اعوذ باللہ اور بسم اللہ کہہ کر سورۃ الفاتحہ پڑھیں، آمین کہیں، پھر کوئی سورت یا آیات پڑھیں (پہلی دو رکعتوں میں)۔',
      roman: 'A\'udhu billah aur Bismillah keh kar Surah Al-Fatihah parhein, Ameen kahein, phir koi surah ya ayaat parhein (pehli do rakaton mein).'
    }
  },
  {
    title: { en: 'Ruku (bowing)', ur: 'رکوع', roman: 'Ruku' },
    body: {
      en: 'Say Allahu Akbar and bow, hands on the knees, back level. Say three times:',
      ur: 'اللہ اکبر کہہ کر جھکیں، ہاتھ گھٹنوں پر، کمر برابر۔ تین بار کہیں:',
      roman: 'Allahu Akbar keh kar jhukein, haath ghutnon par, kamar barabar. Teen baar kahein:'
    },
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ'
  },
  {
    title: { en: 'Stand from ruku', ur: 'رکوع سے کھڑے ہوں', roman: 'Ruku se khare hon' },
    body: {
      en: 'Rise fully upright saying Sami\' Allahu liman hamidah, then Rabbana lakal hamd. Pause standing.',
      ur: 'سمع اللہ لمن حمدہ کہتے ہوئے مکمل کھڑے ہوں، پھر ربنا لک الحمد کہیں۔ کھڑے ہو کر ٹھہریں۔',
      roman: 'Sami\' Allahu liman hamidah kehte hue mukammal khare hon, phir Rabbana lakal hamd kahein. Khare ho kar thehrein.'
    },
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا لَكَ الْحَمْدُ'
  },
  {
    title: { en: 'Sujud (prostration) ×2', ur: 'سجدے ×2', roman: 'Sajde ×2' },
    body: {
      en: 'Say Allahu Akbar and prostrate — forehead, nose, both hands, knees and toes on the ground. Say three times: Subhana Rabbiyal A\'la. Sit briefly, then prostrate a second time the same way.',
      ur: 'اللہ اکبر کہہ کر سجدہ کریں — پیشانی، ناک، دونوں ہاتھ، گھٹنے اور پاؤں زمین پر۔ تین بار کہیں: سبحان ربی الاعلیٰ۔ تھوڑا بیٹھ کر دوسرا سجدہ اسی طرح کریں۔',
      roman: 'Allahu Akbar keh kar sajda karein — peshani, naak, dono haath, ghutne aur paaon zameen par. Teen baar kahein: Subhana Rabbiyal A\'la. Thora baith kar doosra sajda isi tarah karein.'
    },
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى'
  },
  {
    title: { en: 'Second rak\'ah', ur: 'دوسری رکعت', roman: 'Doosri rak\'ah' },
    body: {
      en: 'Stand up for the second rak\'ah and repeat: Al-Fatihah, a surah, ruku, standing, and two sujud.',
      ur: 'دوسری رکعت کے لیے کھڑے ہوں اور دہرائیں: الفاتحہ، سورت، رکوع، قیام اور دو سجدے۔',
      roman: 'Doosri rak\'ah ke liye khare hon aur duhrayein: Al-Fatihah, surah, ruku, qiyam aur do sajde.'
    }
  },
  {
    title: { en: 'Tashahhud (sitting)', ur: 'تشہد (بیٹھنا)', roman: 'Tashahhud (baithna)' },
    body: {
      en: 'After the second rak\'ah, sit and recite the Tashahhud. In 3- or 4-rak\'ah prayers, stand up after this for the remaining rak\'ahs (Al-Fatihah only in the last rak\'ahs of fard), then sit again at the end.',
      ur: 'دوسری رکعت کے بعد بیٹھ کر تشہد پڑھیں۔ تین یا چار رکعت والی نماز میں اس کے بعد باقی رکعتوں کے لیے کھڑے ہوں (فرض کی آخری رکعتوں میں صرف الفاتحہ)، پھر آخر میں دوبارہ بیٹھیں۔',
      roman: 'Doosri rak\'ah ke baad baith kar tashahhud parhein. Teen ya chaar rak\'ah wali namaz mein is ke baad baqi rakaton ke liye khare hon (farz ki aakhri rakaton mein sirf Al-Fatihah), phir aakhir mein dobara baithein.'
    },
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ'
  },
  {
    title: { en: 'Durood & dua', ur: 'درود اور دعا', roman: 'Durood aur dua' },
    body: {
      en: 'In the final sitting, recite Durood-e-Ibrahimi, then a dua such as Rabbana atina.',
      ur: 'آخری بیٹھک میں درودِ ابراہیمی پڑھیں، پھر کوئی دعا جیسے ربنا آتنا پڑھیں۔',
      roman: 'Aakhri baithak mein Durood-e-Ibrahimi parhein, phir koi dua jaise Rabbana atina parhein.'
    },
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ\nرَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ'
  },
  {
    title: { en: 'Salam — finish', ur: 'سلام — اختتام', roman: 'Salam — ikhtitam' },
    body: {
      en: 'Turn the face to the right saying Assalamu Alaikum wa Rahmatullah, then to the left the same way. The prayer is complete.',
      ur: 'چہرہ دائیں طرف پھیر کر السلام علیکم ورحمۃ اللہ کہیں، پھر بائیں طرف اسی طرح۔ نماز مکمل ہو گئی۔',
      roman: 'Chehra dayein taraf pher kar Assalamu Alaikum wa Rahmatullah kahein, phir bayein taraf isi tarah. Namaz mukammal ho gayi.'
    },
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ'
  }
]

// Rak'ah counts as commonly taught (Hanafi presentation, widely used in
// Pakistan). Fard counts are agreed; sunnah arrangements can vary by school —
// the scholarNote disclaimer is shown under the table.
export const RAKAH_TABLE = [
  { prayer: 'Fajr', before: 2, fard: 2, after: 0, witr: 0 },
  { prayer: 'Dhuhr', before: 4, fard: 4, after: 2, witr: 0 },
  { prayer: 'Asr', before: 4, fard: 4, after: 0, witr: 0 },
  { prayer: 'Maghrib', before: 0, fard: 3, after: 2, witr: 0 },
  { prayer: 'Isha', before: 4, fard: 4, after: 2, witr: 3 }
]

export const OCCASION_GUIDES = {
  janaza: {
    steps: [
      {
        title: { en: 'Four takbirs, standing only', ur: 'چار تکبیریں، صرف قیام', roman: 'Chaar takbeerein, sirf qiyam' },
        body: {
          en: 'The janaza prayer is prayed standing — there is no ruku or sujud. The imam stands by the head (for a man) or the middle (for a woman) of the deceased, and the rows stand behind.',
          ur: 'نمازِ جنازہ کھڑے ہو کر پڑھی جاتی ہے — اس میں رکوع و سجود نہیں۔ امام میت کے سر (مرد کے لیے) یا درمیان (عورت کے لیے) کے برابر کھڑا ہوتا ہے اور صفیں پیچھے ہوتی ہیں۔',
          roman: 'Namaz-e-janaza khare ho kar parhi jati hai — is mein ruku o sujud nahi. Imam mayyat ke sar (mard ke liye) ya darmiyan (aurat ke liye) ke barabar khara hota hai aur safein peeche hoti hain.'
        }
      },
      {
        title: { en: '1st takbir — Sana', ur: 'پہلی تکبیر — ثنا', roman: 'Pehli takbeer — Sana' },
        body: {
          en: 'Raise the hands, say Allahu Akbar, fold the hands and recite Sana quietly.',
          ur: 'ہاتھ اٹھا کر اللہ اکبر کہیں، ہاتھ باندھ کر آہستہ ثنا پڑھیں۔',
          roman: 'Haath utha kar Allahu Akbar kahein, haath bandh kar aahista sana parhein.'
        },
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَجَلَّ ثَنَاؤُكَ وَلَا إِلَهَ غَيْرُكَ'
      },
      {
        title: { en: '2nd takbir — Durood', ur: 'دوسری تکبیر — درود', roman: 'Doosri takbeer — Durood' },
        body: {
          en: 'Say Allahu Akbar (without raising the hands) and recite Durood-e-Ibrahimi.',
          ur: 'اللہ اکبر کہیں (ہاتھ اٹھائے بغیر) اور درودِ ابراہیمی پڑھیں۔',
          roman: 'Allahu Akbar kahein (haath uthaye baghair) aur Durood-e-Ibrahimi parhein.'
        }
      },
      {
        title: { en: '3rd takbir — Dua for the deceased', ur: 'تیسری تکبیر — میت کے لیے دعا', roman: 'Teesri takbeer — mayyat ke liye dua' },
        body: {
          en: 'Say Allahu Akbar and make dua for the deceased — the well-known janaza dua:',
          ur: 'اللہ اکبر کہیں اور میت کے لیے دعا کریں — مشہور دعائے جنازہ:',
          roman: 'Allahu Akbar kahein aur mayyat ke liye dua karein — mashhoor dua-e-janaza:'
        },
        arabic: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا، اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ'
      },
      {
        title: { en: '4th takbir — Salam', ur: 'چوتھی تکبیر — سلام', roman: 'Chauthi takbeer — Salam' },
        body: {
          en: 'Say Allahu Akbar, pause briefly (a short dua may be made), then say Salam to the right and to the left.',
          ur: 'اللہ اکبر کہیں، تھوڑا ٹھہریں (مختصر دعا کی جا سکتی ہے)، پھر دائیں اور بائیں سلام پھیریں۔',
          roman: 'Allahu Akbar kahein, thora thehrein (mukhtasar dua ki ja sakti hai), phir dayein aur bayein salam pherein.'
        }
      }
    ]
  },
  eid: {
    steps: [
      {
        title: { en: 'Two rak\'ahs with extra takbirs', ur: 'دو رکعتیں اضافی تکبیروں کے ساتھ', roman: 'Do rak\'atein izafi takbeeron ke saath' },
        body: {
          en: 'Eid prayer is two rak\'ahs prayed in congregation behind an imam, with extra takbirs, followed by the khutbah (the khutbah comes after the prayer, unlike Jumu\'ah). There is no adhan or iqamah for Eid.',
          ur: 'نمازِ عید دو رکعت ہے جو امام کے پیچھے جماعت سے پڑھی جاتی ہے، اضافی تکبیروں کے ساتھ، اس کے بعد خطبہ ہوتا ہے (خطبہ نماز کے بعد ہے، جمعہ کے برعکس)۔ عید کے لیے اذان و اقامت نہیں۔',
          roman: 'Namaz-e-Eid do rak\'ah hai jo imam ke peeche jamaat se parhi jati hai, izafi takbeeron ke saath, is ke baad khutbah hota hai (khutbah namaz ke baad hai, Jumu\'ah ke baraks). Eid ke liye adhan o iqamat nahi.'
        }
      },
      {
        title: { en: 'First rak\'ah — extra takbirs', ur: 'پہلی رکعت — اضافی تکبیریں', roman: 'Pehli rak\'ah — izafi takbeerein' },
        body: {
          en: 'After the opening takbir and Sana, the imam says three extra takbirs, raising the hands each time and letting them rest at the sides (folding the hands after the third). Then Al-Fatihah and a surah, and the rak\'ah is completed as normal.',
          ur: 'تکبیرِ تحریمہ اور ثنا کے بعد امام تین اضافی تکبیریں کہتا ہے، ہر بار ہاتھ اٹھا کر چھوڑ دیتا ہے (تیسری کے بعد ہاتھ باندھ لیتا ہے)۔ پھر الفاتحہ اور سورت، اور رکعت معمول کے مطابق مکمل ہوتی ہے۔',
          roman: 'Takbeer-e-tehreema aur sana ke baad imam teen izafi takbeerein kehta hai, har baar haath utha kar chhor deta hai (teesri ke baad haath bandh leta hai). Phir Al-Fatihah aur surah, aur rak\'ah mamool ke mutabiq mukammal hoti hai.'
        }
      },
      {
        title: { en: 'Second rak\'ah — extra takbirs', ur: 'دوسری رکعت — اضافی تکبیریں', roman: 'Doosri rak\'ah — izafi takbeerein' },
        body: {
          en: 'After Al-Fatihah and a surah, three extra takbirs are said (hands raised each time), then a fourth takbir takes you into ruku, and the prayer finishes as normal with tashahhud and salam.',
          ur: 'الفاتحہ اور سورت کے بعد تین اضافی تکبیریں کہی جاتی ہیں (ہر بار ہاتھ اٹھا کر)، پھر چوتھی تکبیر سے رکوع میں جاتے ہیں، اور نماز تشہد و سلام کے ساتھ مکمل ہوتی ہے۔',
          roman: 'Al-Fatihah aur surah ke baad teen izafi takbeerein kahi jati hain (har baar haath utha kar), phir chauthi takbeer se ruku mein jate hain, aur namaz tashahhud o salam ke saath mukammal hoti hai.'
        }
      },
      {
        title: { en: 'Takbeerat of Eid', ur: 'تکبیراتِ عید', roman: 'Takbeerat-e-Eid' },
        body: {
          en: 'The takbeerat recited on the days of Eid:',
          ur: 'ایامِ عید میں پڑھی جانے والی تکبیرات:',
          roman: 'Ayyam-e-Eid mein parhi jane wali takbeerat:'
        },
        arabic: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ'
      }
    ]
  },
  taraweeh: {
    steps: [
      {
        title: { en: '20 rak\'ahs in Ramadan nights', ur: 'رمضان کی راتوں میں 20 رکعتیں', roman: 'Ramadan ki raaton mein 20 rak\'atein' },
        body: {
          en: 'Taraweeh is prayed after Isha in Ramadan: 20 rak\'ahs in sets of two, usually in congregation, with a short rest after every four rak\'ahs. Witr is prayed after it, in congregation during Ramadan.',
          ur: 'تراویح رمضان میں عشاء کے بعد پڑھی جاتی ہے: 20 رکعتیں دو دو کر کے، عموماً جماعت سے، اور ہر چار رکعت کے بعد مختصر وقفہ ہوتا ہے۔ وتر اس کے بعد رمضان میں جماعت سے پڑھے جاتے ہیں۔',
          roman: 'Taraweeh Ramadan mein Isha ke baad parhi jati hai: 20 rak\'atein do do kar ke, umooman jamaat se, aur har chaar rak\'ah ke baad mukhtasar waqfa hota hai. Witr is ke baad Ramadan mein jamaat se parhe jate hain.'
        }
      },
      {
        title: { en: 'Dua after every four (Tasbih Taraweeh)', ur: 'ہر چار رکعت کے بعد کی دعا (تسبیحِ تراویح)', roman: 'Har chaar rak\'ah ke baad ki dua (Tasbih Taraweeh)' },
        body: {
          en: 'During the rest after every four rak\'ahs, this tasbih is commonly recited:',
          ur: 'ہر چار رکعت کے بعد وقفے میں یہ تسبیح عام طور پر پڑھی جاتی ہے:',
          roman: 'Har chaar rak\'ah ke baad waqfe mein ye tasbih aam tor par parhi jati hai:'
        },
        arabic: 'سُبْحَانَ ذِي الْمُلْكِ وَالْمَلَكُوتِ، سُبْحَانَ ذِي الْعِزَّةِ وَالْعَظَمَةِ وَالْقُدْرَةِ وَالْكِبْرِيَاءِ وَالْجَبَرُوتِ، سُبْحَانَ الْمَلِكِ الْحَيِّ الَّذِي لَا يَمُوتُ، سُبُّوحٌ قُدُّوسٌ رَبُّنَا وَرَبُّ الْمَلَائِكَةِ وَالرُّوحِ، اللَّهُمَّ أَجِرْنَا مِنَ النَّارِ يَا مُجِيرُ يَا مُجِيرُ يَا مُجِيرُ'
      }
    ]
  }
}
