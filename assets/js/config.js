/* ============================================================
   SITE CONFIG — Sanman Yojana | Shahid Bhagat Singh Pratishthan
   Edit ONLY this file to change contact details, plans & prices.
   ------------------------------------------------------------
   ⚠ ITEMS MARKED "TODO" WERE NOT IN THE CLIENT'S MATERIAL —
     confirm with the client and replace before going live.
   ============================================================ */

const SITE = {

  /* ---- Organisation ---- */
  org: {
    en: "Shahid Bhagat Singh Pratishthan, Pune",
    mr: "शहीद भगतसिंग प्रतिष्ठान, पुणे",
    hi: "शहीद भगतसिंह प्रतिष्ठान, पुणे"
  },
  orgShort: { en: "Bhagat Singh Pratishthan", mr: "भगतसिंग प्रतिष्ठान", hi: "भगतसिंह प्रतिष्ठान" },

  /* ---- Scheme (brand) ---- */
  name:      { en: "Sanman Yojana",  mr: "सन्मान योजना",  hi: "सन्मान योजना" },
  shortName: { en: "Sanman Yojana",  mr: "सन्मान योजना",  hi: "सन्मान योजना" },
  tagline:   { en: "25 years of unbroken service to society",
               mr: "२५ वर्ष अविरत जनसेवेचे",
               hi: "२५ वर्ष अविरत जनसेवा के" },
  state:     { en: "Maharashtra", mr: "महाराष्ट्र", hi: "महाराष्ट्र" },

  /* ---- Government registration numbers (from the certificate) ---- */
  regNo1: "Maharashtra 779/2004, Pune",
  regNo2: "P.F./19614, Pune",

  /* ---- Contact ---- */
  phone:  "+91 87669 45548",
  phone2: "+91 87669 45548",
  email:    "info@sanmanyojana.org",       /* TODO: confirm */
  emailAlt: "support@sanmanyojana.org",    /* TODO: confirm */

  officeAddress: {
    en: "Shahid Bhagat Singh Pratishthan, Pune, Maharashtra",          /* TODO: full street address */
    mr: "शहीद भगतसिंग प्रतिष्ठान, पुणे, महाराष्ट्र",
    hi: "शहीद भगतसिंह प्रतिष्ठान, पुणे, महाराष्ट्र"
  },

  /* ---- Service coverage ---- */
  serviceArea: {
    en: "Pune District & Pimpri-Chinchwad",
    mr: "पुणे जिल्हा व पिंपरी-चिंचवड",
    hi: "पुणे जिला व पिंपरी-चिंचवड"
  },
  freeKm: 20,

  /* ---- Google Map (TODO: replace with the exact office pin) ---- */
  mapLink: "https://maps.google.com/?q=Pune,Maharashtra",
  mapEmbed: "https://www.google.com/maps?q=Pune,Maharashtra&hl=en&z=12&output=embed",

  /* ---- Office hours ---- */
  hours: {
    en: "Office: Mon–Sat, 10 am – 7 pm  •  Emergency helpline: 24 × 7",
    mr: "कार्यालय: सोम–शनि, स. १० – सायं. ७  •  आपत्कालीन हेल्पलाइन: २४ × ७",
    hi: "कार्यालय: सोम–शनि, प्रातः १० – सायं ७  •  आपातकालीन हेल्पलाइन: २४ × ७"
  },

  /* ---- Office bearers (from the certificate) ---- */
  people: [
    { role: { en: "President",           mr: "अध्यक्ष",           hi: "अध्यक्ष"           },
      name: { en: "Vijay More",          mr: "विजय मोरे",          hi: "विजय मोरे"          } },
    { role: { en: "Secretary",           mr: "सचिव",              hi: "सचिव"              },
      name: { en: "Pradeep Verma",       mr: "प्रदीप वर्मा",        hi: "प्रदीप वर्मा"        } },
    { role: { en: "Authorised Officer",  mr: "प्राधिकृत अधिकारी",   hi: "प्राधिकृत अधिकारी"   },
      name: { en: "—",                   mr: "—",                 hi: "—"                 } }
  ],

  /* ---- Social ---- */
  social: {
    facebook:  "#",   /* TODO */
    instagram: "#",   /* TODO */
    youtube:   "#",   /* TODO */
    whatsapp:  "https://wa.me/918766945548"
  },

  logo: "assets/img/logo.svg",

  /* ---- Counters shown on the home page ---- */
  stats: { years: 25, families: 4200, volunteers: 150, hours: 24 },

  /* ============================================================
     MEMBERSHIP PLANS
     `adds` = what this tier adds on top of the previous tier.
     ============================================================ */
  plans: [
    {
      id: "basic",
      price: 11000,
      featured: false,
      poster: "assets/img/poster-plan-1.jpeg",
      title: { en: "Basic Kit", mr: "बेसिक संच", hi: "बेसिक संच" },
      blurb: {
        en: "The essentials handled — transport, paperwork and the ground arrangements.",
        mr: "अत्यावश्यक बाबी — वाहतूक, कागदपत्रे आणि प्रत्यक्ष व्यवस्था.",
        hi: "आवश्यक बातें — परिवहन, कागज़ात और ज़मीनी व्यवस्था."
      },
      adds: [
        { en: "Death certificate (natural death)", mr: "डेथ सर्टिफिकेट (नैसर्गिक मृत्यू)", hi: "डेथ सर्टिफिकेट (प्राकृतिक मृत्यु)" },
        { en: "Hearse van (within Pune & Pimpri-Chinchwad city limits)", mr: "शववाहिका (पुणे आणि पिंपरी-चिंचवड शहर मर्यादित)", hi: "शव वाहिका (पुणे और पिंपरी-चिंचवड शहर सीमित)" },
        { en: "Basic funeral materials", mr: "मूलभूत अंत्यसंस्कार साहित्य", hi: "मूलभूत अंत्यसंस्कार सामग्री" },
        { en: "Crematorium booking", mr: "स्मशानभूमी बुकिंग", hi: "श्मशान भूमि बुकिंग" }
      ]
    },
    {
      id: "sanman",
      price: 21000,
      featured: true,
      poster: "assets/img/poster-plan-2.jpeg",
      title: { en: "Basic + Sanman Kit", mr: "बेसिक + सन्मान संच", hi: "बेसिक + सन्मान संच" },
      blurb: {
        en: "Adds a priest, a 24-hour freezer box and ten days of family coordination.",
        mr: "गुरुजी, २४ तास फ्रीजर बॉक्स आणि १० दिवस कुटुंब समन्वय समाविष्ट.",
        hi: "गुरुजी, २४ घंटे फ़्रीज़र बॉक्स और १० दिन परिवार समन्वय शामिल."
      },
      adds: [
        { en: "Freezer box (24 hours)", mr: "फ्रीजर बॉक्स (२४ तास)", hi: "फ़्रीज़र बॉक्स (२४ घंटे)" },
        { en: "Guruji / Purohit for the rites", mr: "गुरुजी / पुरोहित", hi: "गुरुजी / पुरोहित" },
        { en: "Crematorium booking & liaison", mr: "स्मशानभूमी बुकिंग व समन्वय", hi: "श्मशान भूमि बुकिंग व समन्वय" },
        { en: "10 days of family coordination", mr: "१० दिवस कुटुंबीयांना समन्वय", hi: "१० दिन परिवार समन्वय" },
        { en: "Grief counselling for the family", mr: "समुपदेशन (कौन्सलिंग)", hi: "परामर्श (काउंसलिंग)" }
      ]
    },
    {
      id: "dashakriya",
      price: 51000,
      featured: false,
      poster: "assets/img/poster-plan-3.jpeg",
      title: { en: "Basic + Sanman + Dashakriya Kit", mr: "बेसिक + सन्मान + दशक्रिया संच", hi: "बेसिक + सन्मान + दशक्रिया संच" },
      blurb: {
        en: "Extends into the ten-day rites, ash immersion and a meal for the gathering.",
        mr: "दशक्रिया विधी, अस्थी विसर्जन आणि भोजन व्यवस्थेपर्यंत विस्तार.",
        hi: "दशक्रिया विधि, अस्थि विसर्जन और भोजन व्यवस्था तक विस्तार."
      },
      adds: [
        { en: "Dashakriya rites", mr: "दशक्रिया विधी", hi: "दशक्रिया विधि" },
        { en: "Puja materials", mr: "पूजासाहित्य", hi: "पूजा सामग्री" },
        { en: "Guruji's honorarium", mr: "गुरुजी मानधन", hi: "गुरुजी मानदेय" },
        { en: "Meal arrangement for up to 50 people", mr: "५० लोकांपर्यंत भोजन व्यवस्था", hi: "५० लोगों तक भोजन व्यवस्था" },
        { en: "Ash immersion + vehicle + priest + 5 relatives", mr: "अस्थी विसर्जन + वाहन + पुरोहित + ५ नातेवाईक", hi: "अस्थि विसर्जन + वाहन + पुरोहित + ५ रिश्तेदार" }
      ]
    },
    {
      id: "kutumb",
      price: 111000,
      featured: false,
      poster: "assets/img/poster-plan-4.jpeg",
      title: { en: "Basic + Sanman + Dashakriya + Family Kit", mr: "बेसिक + सन्मान + दशक्रिया + कुटुंब संच", hi: "बेसिक + सन्मान + दशक्रिया + कुटुंब संच" },
      blurb: {
        en: "Covers both spouses, the 10th/13th-day rites and a meal for up to 100 guests.",
        mr: "पती-पत्नी दोघांसाठी, १०वा/१३वा विधी आणि १०० लोकांपर्यंत भोजन.",
        hi: "पति-पत्नी दोनों के लिए, १०वाँ/१३वाँ विधि और १०० लोगों तक भोजन."
      },
      adds: [
        { en: "Coverage for husband and wife both", mr: "पती-पत्नी संरक्षण", hi: "पति-पत्नी संरक्षण" },
        { en: "10th / 13th day (Terava) rites with Guruji", mr: "१०वा / १३वा (तेरावा) विधी – गुरुजींसह", hi: "१०वाँ / १३वाँ (तेरहवीं) विधि – गुरुजी सहित" },
        { en: "Meal arrangement for up to 100 people", mr: "१०० लोकांपर्यंत भोजनाची व्यवस्था", hi: "१०० लोगों तक भोजन की व्यवस्था" }
      ]
    }
  ],

  /* ============================================================
     FUNERAL MATERIALS supplied with every kit
     ============================================================ */
  materials: [
    { en: "White shroud cloth (Kafan)", mr: "पांढरे कापड (कफन)", hi: "सफ़ेद कपड़ा (कफ़न)" },
    { en: "Flowers & garland",          mr: "फुले आणि हार",       hi: "फूल और हार" },
    { en: "Tulsi leaves",               mr: "तुळशीची पाने",       hi: "तुलसी के पत्ते" },
    { en: "Gangajal (holy water)",      mr: "गंगाजल",            hi: "गंगाजल" },
    { en: "Sandalwood & sandal powder", mr: "चंदन आणि चंदन पावडर", hi: "चंदन और चंदन पाउडर" },
    { en: "Kumkum",                     mr: "कुंकू",              hi: "कुमकुम" },
    { en: "Turmeric",                   mr: "हळद",               hi: "हल्दी" },
    { en: "Akshata (rice)",             mr: "अक्षता",             hi: "अक्षत" },
    { en: "Ghee",                       mr: "तूप",                hi: "घी" },
    { en: "Camphor",                    mr: "कापूर",              hi: "कपूर" },
    { en: "Incense sticks",             mr: "अगरबत्ती",           hi: "अगरबत्ती" },
    { en: "Coconut",                    mr: "नारळ",              hi: "नारियल" },
    { en: "Sesame seeds",               mr: "तीळ",                hi: "तिल" },
    { en: "Cotton cord (Dori)",         mr: "दोरी",               hi: "डोरी" },
    { en: "Bier (Arthi / Tirdi)",       mr: "अर्थी / तिरडी",       hi: "अर्थी / तिरडी" },
    { en: "Clay pot (Madke)",           mr: "मातीचे मडके",         hi: "मिट्टी का मटका" },
    { en: "Attar (perfume)",            mr: "अत्तर",              hi: "इत्र" }
  ]
};
