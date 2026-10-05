// Multilingual Dictionary & Alert Data Generator for STORMS
// Supports: English (en), Hindi (hi), Marathi (mr)
// Citizen-focused emergency messaging in compliance with NDMA & MoES PS 26077

export const ALERT_LANGUAGES = [
  { code: 'en', label: 'EN', fullLabel: 'English' },
  { code: 'hi', label: 'हिंदी', fullLabel: 'Hindi' },
  { code: 'mr', label: 'मराठी', fullLabel: 'Marathi' },
];

export const UI_TRANSLATIONS = {
  en: {
    systemName: 'STORMS',
    issuedBy: 'Issued by NCMRWF AI Nowcasting Engine',
    timeAgo: '12 min ago',
    alertScope: 'Alert Scope',
    scopeHyperlocal: 'Hyper-local',
    scopeRegional: 'Regional Warning',
    
    // Severity
    severityLevels: {
      low: 'LOW RISK',
      moderate: 'MODERATE',
      high: 'HIGH RISK',
      severe: 'SEVERE WARNING',
    },

    // Hazard Titles
    hazardNames: {
      severe_rain: 'Severe Rainfall Warning',
      thunderstorm: 'Thunderstorm & Lightning Warning',
      cloudburst: 'Torrential Cloudburst Warning',
      flash_flood: 'Flash Flood & Inundation Risk',
    },

    // Hierarchy Headings
    headings: {
      amIAffected: 'Am I Affected?',
      whatToDo: 'What You Should Do',
      higherRiskAreas: 'Higher-Risk Areas Nearby',
      whyAlert: 'Why are we warning you?',
      technicalDetails: 'Atmospheric Precursor Telemetry',
      helplines: 'Emergency Helplines',
    },

    // Affected Statuses
    affectedStatus: {
      affected_now: {
        badge: 'You are in the affected area',
        sub: 'High likelihood of heavy rainfall and street waterlogging at your current location.',
        tag: 'IMMEDIATE ACTION',
      },
      nearby: {
        badge: '{distance} from the affected area',
        sub: 'A strong storm cell is moving in your direction. Anticipate heavy downpour shortly.',
        tag: 'APPROACHING',
      },
      regional: {
        badge: 'You are within the {region} warning region',
        sub: 'Regional severe weather advisory in effect. Prepare for waterlogging and travel delays.',
        tag: 'REGIONAL ADVISORY',
      },
    },

    // Explainability
    explanation: 'STORMS detected rapid cloud development, high atmospheric moisture, and strong rainfall potential in your area.',
    viewTechBtn: 'View technical details',
    hideTechBtn: 'Hide technical details',

    // Buttons
    buttons: {
      close: 'Close',
      readAloud: 'Read Aloud',
      reading: 'Reading...',
      stop: 'Stop',
      viewOnMap: 'View on Map',
      setReminder: 'Set Reminder',
      reminderActive: 'Reminder Active',
      officialGuide: 'View Safety Guide',
    },

    metrics: {
      leadTime: 'Likely within',
      intensity: 'Expected Intensity',
      distance: 'Distance',
      radius: 'Affected Radius',
    },
  },

  hi: {
    systemName: 'STORMS',
    issuedBy: 'NCMRWF AI नाउकास्टिंग सिस्टम द्वारा जारी',
    timeAgo: '12 मिनट पहले',
    alertScope: 'चेतावनी का दायरा',
    scopeHyperlocal: 'अति-स्थानीय (वार्ड)',
    scopeRegional: 'क्षेत्रीय चेतावनी',

    // Severity
    severityLevels: {
      low: 'कम जोखिम',
      moderate: 'मध्यम चेतावनी',
      high: 'गंभीर जोखिम',
      severe: 'अत्यधिक गंभीर चेतावनी',
    },

    // Hazard Titles
    hazardNames: {
      severe_rain: 'भारी बारिश की चेतावनी',
      thunderstorm: 'भीषण आंधी और आकाशीय बिजली की चेतावनी',
      cloudburst: 'बादल फटने की आपातकालीन चेतावनी',
      flash_flood: 'अचानक बाढ़ और जलभराव का ख़तरा',
    },

    // Hierarchy Headings
    headings: {
      amIAffected: 'क्या मेरा क्षेत्र प्रभावित है?',
      whatToDo: 'आपको क्या करना चाहिए?',
      higherRiskAreas: 'आस-पास के अधिक जोखिम वाले क्षेत्र',
      whyAlert: 'हम आपको चेतावनी क्यों दे रहे हैं?',
      technicalDetails: 'तकनीकी वायुमंडलीय आंकड़े (Precursor Data)',
      helplines: 'आपत्कालीन हेल्पलाइन नंबर',
    },

    // Affected Statuses
    affectedStatus: {
      affected_now: {
        badge: 'आप प्रभावित क्षेत्र में हैं',
        sub: 'आपके वर्तमान स्थान पर भारी बारिश और जलभराव की पूरी संभावना है। तुरंत सावधानी बरतें।',
        tag: 'तत्काल सावधानी',
      },
      nearby: {
        badge: 'प्रभावित क्षेत्र से {distance} दूर',
        sub: 'तेज़ तूफानी बादल आपके क्षेत्र की ओर बढ़ रहे हैं। थोड़ी देर में भारी बारिश हो सकती है।',
        tag: 'समीप आ रहा है',
      },
      regional: {
        badge: 'आप {region} चेतावनी क्षेत्र के दायरे में हैं',
        sub: 'पूरे जिले के लिए सतर्कता परामर्श जारी है। यात्रा में रुकावट और जलभराव संभव है।',
        tag: 'क्षेत्रीय सतर्कता',
      },
    },

    // Explainability
    explanation: 'STORMS सिस्टम ने आपके क्षेत्र में बादलों का तेजी से बनना, हवा में अत्यधिक नमी और भारी बारिश की संभावना का पता लगाया है।',
    viewTechBtn: 'तकनीकी विवरण देखें',
    hideTechBtn: 'तकनीकी विवरण छिपाएं',

    // Buttons
    buttons: {
      close: 'बंद करें',
      readAloud: 'बोलकर सुनाएं',
      reading: 'सुनाया जा रहा है...',
      stop: 'रोकें',
      viewOnMap: 'नक्शे पर देखें',
      setReminder: 'रिमाइंडर सेट करें',
      reminderActive: 'रिमाइंडर सक्रिय',
      officialGuide: 'सुरक्षा मार्गदर्शिका',
    },

    metrics: {
      leadTime: 'अनुमानित समय:',
      intensity: 'अनुमानित तीव्रता',
      distance: 'दूरी',
      radius: 'प्रभावित दायरा',
    },
  },

  mr: {
    systemName: 'STORMS',
    issuedBy: 'NCMRWF AI नाउकास्टिंग प्रणालीद्वारे जारी',
    timeAgo: '12 मिनिटांपूर्वी',
    alertScope: 'इशारा स्वरूप',
    scopeHyperlocal: 'अति-स्थानिक (वॉर्ड)',
    scopeRegional: 'विभागीय इशारा',

    // Severity
    severityLevels: {
      low: 'कमी धोका',
      moderate: 'मध्यम इशारा',
      high: 'मोठा धोका',
      severe: 'अतिदक्षता इशारा',
    },

    // Hazard Titles
    hazardNames: {
      severe_rain: 'मुसळधार पावसाचा इशारा',
      thunderstorm: 'विजांसह वादळी पावसाचा इशारा',
      cloudburst: 'ढगफुटीसदृश पावसाचा इशारा',
      flash_flood: 'अचानक पूर आणि जलमय परिस्थितीचा धोका',
    },

    // Hierarchy Headings
    headings: {
      amIAffected: 'मी बाधित क्षेत्रात आहे का?',
      whatToDo: 'आपण काय काळजी घ्यावी?',
      higherRiskAreas: 'जवळपासची अधिक धोक्याची ठिकाणे',
      whyAlert: 'आम्ही आपल्याला सतर्क का करत आहोत?',
      technicalDetails: 'तांत्रिक हवामान मोजमापे (Precursor Data)',
      helplines: 'आपत्कालीन संपर्क क्रमांक',
    },

    // Affected Statuses
    affectedStatus: {
      affected_now: {
        badge: 'आपण बाधित क्षेत्रात आहात',
        sub: 'आपल्या भागात मुसळधार पाऊस आणि पाणी साचण्याचा मोठा धोका आहे. त्वरित दक्षता बाळगा.',
        tag: 'त्वरित दक्षता',
      },
      nearby: {
        badge: 'बाधित क्षेत्रापासून {distance} अंतरावर',
        sub: 'पावसाचे ढग आपल्या दिशेने सरकत आहेत. लवकरच जोरदार पाऊस सुरू होण्याची शक्यता आहे.',
        tag: 'नजीक सरकत आहे',
      },
      regional: {
        badge: 'आपण {region} सतर्कता क्षेत्राच्या कक्षेत आहात',
        sub: 'संपूर्ण विभागासाठी इशारा लागू आहे. वाहतूक कोंडी किंवा सखल भागात पाणी साचू शकते.',
        tag: 'विभागीय इशारा',
      },
    },

    // Explainability
    explanation: 'STORMS प्रणालीने आपल्या परिसरात ढगांची जलद निर्मिती, हवेतील प्रचंड बाष्प आणि मुसळधार पावसाची दाट शक्यता नोंदवली आहे.',
    viewTechBtn: 'तांत्रिक माहिती पहा',
    hideTechBtn: 'तांत्रिक माहिती लपवा',

    // Buttons
    buttons: {
      close: 'बंद करा',
      readAloud: 'ऐका (ऑडिओ)',
      reading: 'वाचत आहे...',
      stop: 'थांबवा',
      viewOnMap: 'नकाशावर पहा',
      setReminder: 'स्मरणपत्र ठेवा',
      reminderActive: 'स्मरणपत्र सक्रिय',
      officialGuide: 'सुरक्षा मार्गदर्शिका',
    },

    metrics: {
      leadTime: 'अंदाजे वेळ:',
      intensity: 'पावसाची तीव्रता',
      distance: 'अंतर',
      radius: 'बाधित क्षेत्र मर्यादा',
    },
  },
};

// Hazard-adaptive recommended actions
export const RECOMMENDED_ACTIONS = {
  severe_rain: {
    en: [
      { id: 1, text: 'Avoid low-lying roads and waterlogged underpasses', icon: 'Car' },
      { id: 2, text: 'Do not cross flowing water or submerged bridges', icon: 'AlertTriangle' },
      { id: 3, text: 'Stay indoors during peak downpour if possible', icon: 'Home' },
      { id: 4, text: 'Keep your mobile phone charged and check updates', icon: 'BatteryCharging' },
    ],
    hi: [
      { id: 1, text: 'निचले रास्तों और जलभराव वाले अंडरपास से बचें', icon: 'Car' },
      { id: 2, text: 'बहते पानी या डूबे हुए पुलों को पार न करें', icon: 'AlertTriangle' },
      { id: 3, text: 'भारी बारिश के दौरान संभव हो तो घर के अंदर ही रहें', icon: 'Home' },
      { id: 4, text: 'मोबाइल फोन चार्ज रखें और जरूरी अपडेट देखते रहें', icon: 'BatteryCharging' },
    ],
    mr: [
      { id: 1, text: 'सखल रस्ते आणि पाणी साचलेल्या भुयारी मार्गांवर जाणे टाळा', icon: 'Car' },
      { id: 2, text: 'वाहत्या पाण्यातून किंवा पाण्याखाली गेलेल्या पुलांवरून जाऊ नका', icon: 'AlertTriangle' },
      { id: 3, text: 'मुसळधार पाऊस सुरू असताना शक्यतो घरातच थांबा', icon: 'Home' },
      { id: 4, text: 'मोबाईल फोन चार्ज ठेवा आणि हवामान सूचनांवर लक्ष ठेवा', icon: 'BatteryCharging' },
    ],
  },
  thunderstorm: {
    en: [
      { id: 1, text: 'Stay indoors and stay away from windows and glass doors', icon: 'Home' },
      { id: 2, text: 'Avoid open grounds, tall trees, and metal structures', icon: 'Zap' },
      { id: 3, text: 'Unplug sensitive electronics and avoid corded phones', icon: 'Power' },
      { id: 4, text: 'Do not touch fallen wires or standing water puddles', icon: 'AlertTriangle' },
    ],
    hi: [
      { id: 1, text: 'घर के अंदर रहें और खिड़कियों व दरवाजों से दूर रहें', icon: 'Home' },
      { id: 2, text: 'खुले मैदानों, अकेले पेड़ों और लोहे के खंभों के पास न जाएं', icon: 'Zap' },
      { id: 3, text: 'बिजली के संवेदनशील उपकरणों का प्लग निकाल दें', icon: 'Power' },
      { id: 4, text: 'बिजली के खंभों या लटकते तारों को बिल्कुल न छुएं', icon: 'AlertTriangle' },
    ],
    mr: [
      { id: 1, text: 'घरातच सुरक्षित रहा आणि खिडक्या-काचेच्या दारांपासून लांब रहा', icon: 'Home' },
      { id: 2, text: 'मोकळे मैदान, उंच झाडे आणि लोखंडी खांबांजवळ थांबू नका', icon: 'Zap' },
      { id: 3, text: 'घरातील संवेदनशील विजेची उपकरणे बंद करून प्लग काढा', icon: 'Power' },
      { id: 4, text: 'विजेचे खांब किंवा तुटलेल्या तारांना अजिबात हात लावू नका', icon: 'AlertTriangle' },
    ],
  },
  cloudburst: {
    en: [
      { id: 1, text: 'Move immediately to higher ground or upper floor rooms', icon: 'TrendingUp' },
      { id: 2, text: 'Stay clear of natural stormwater drains, nullahs, and streams', icon: 'AlertTriangle' },
      { id: 3, text: 'Do not attempt to drive through rapidly rising water', icon: 'Car' },
      { id: 4, text: 'Keep a flashlight and emergency essentials within reach', icon: 'Flashlight' },
    ],
    hi: [
      { id: 1, text: 'तुरंत ऊंचे स्थानों या इमारत की ऊपरी मंजिलों पर जाएं', icon: 'TrendingUp' },
      { id: 2, text: 'प्राकृतिक नालों, जल निकासी मार्गों और नदियों से दूर रहें', icon: 'AlertTriangle' },
      { id: 3, text: 'पानी से भरे रास्तों पर गाड़ी चलाने की कोशिश न करें', icon: 'Car' },
      { id: 4, text: 'टॉर्च, जरूरी दवाइयां और पीने का पानी पास में रखें', icon: 'Flashlight' },
    ],
    mr: [
      { id: 1, text: 'त्वरित सुरक्षित किंवा इमारतीच्या वरच्या मजल्यावर जा', icon: 'TrendingUp' },
      { id: 2, text: 'नैसर्गिक नाले, ओढे आणि पाणी वाहून नेणाऱ्या मार्गांपासून लांब रहा', icon: 'AlertTriangle' },
      { id: 3, text: 'पाणी साचलेल्या रस्त्यांवर वाहने चालवू नका', icon: 'Car' },
      { id: 4, text: 'टॉर्च, आपत्कालीन किट आणि पिण्याचे पाणी जवळ ठेवा', icon: 'Flashlight' },
    ],
  },
  flash_flood: {
    en: [
      { id: 1, text: 'Evacuate basement areas and low ground immediately', icon: 'AlertTriangle' },
      { id: 2, text: 'Never walk or drive into moving flood water', icon: 'Car' },
      { id: 3, text: 'Turn off the main electrical breaker if water enters premises', icon: 'Power' },
      { id: 4, text: 'Contact Disaster Helpline 1077 for emergency assistance', icon: 'Phone' },
    ],
    hi: [
      { id: 1, text: 'निचले बेसमेंट और ग्राउंड फ्लोर से तुरंत सुरक्षित स्थान पर जाएं', icon: 'AlertTriangle' },
      { id: 2, text: 'बाढ़ के बहते पानी में कभी भी पैदल या वाहन से न उतरें', icon: 'Car' },
      { id: 3, text: 'घर में पानी घुसने पर मुख्य बिजली का स्विच तुरंत बंद करें', icon: 'Power' },
      { id: 4, text: 'मदद के लिए आपदा नियंत्रण कक्ष हेल्पलाइन 1077 पर कॉल करें', icon: 'Phone' },
    ],
    mr: [
      { id: 1, text: 'तळघर आणि सखल भागातून ताबडतोब सुरक्षित स्थळी हलवा', icon: 'AlertTriangle' },
      { id: 2, text: 'पुराच्या वाहत्या पाण्यात चालण्याचा किंवा गाडी नेण्याचा धोका पत्करू नका', icon: 'Car' },
      { id: 3, text: 'घरात पाणी शिरल्यास मुख्य वीज पुरवठा त्वरित बंद करा', icon: 'Power' },
      { id: 4, text: 'मदतीसाठी आपत्ती व्यवस्थापन हेल्पलाइन 1077 वर संपर्क करा', icon: 'Phone' },
    ],
  },
};

// Hyper-local Hotspots translated simply without jargon
export const RISK_AREAS_DATA = {
  en: [
    {
      name: 'Vasai Creek Road',
      reason: 'Flooding possible due to heavy runoff & tidal backwater',
      distance: '1.8 km away',
      riskLevel: 'High Risk',
    },
    {
      name: 'Low-lying section near Nalasopara',
      reason: 'Water accumulation possible; subway road submerged',
      distance: '3.4 km away',
      riskLevel: 'High Risk',
    },
    {
      name: 'Gaon Junction',
      reason: 'Road flooding and slow traffic expected',
      distance: '1.2 km away',
      riskLevel: 'Moderate Risk',
    },
  ],
  hi: [
    {
      name: 'वसई क्रीक रोड (खाड़ी मार्ग)',
      reason: 'भारी जलभराव और खाड़ी के पानी का बैकफ्लो संभव',
      distance: '1.8 किमी दूर',
      riskLevel: 'उच्च जोखिम',
    },
    {
      name: 'नालासोपारा निचला इलाका व सबवे',
      reason: 'पानी भरने से अंडरपास और रास्ते बंद होने की आशंका',
      distance: '3.4 किमी दूर',
      riskLevel: 'उच्च जोखिम',
    },
    {
      name: 'गांव जंक्शन व मुख्य चौक',
      reason: 'सड़क पर पानी जमा होने से यातायात बेहद धीमा रहने की संभावना',
      distance: '1.2 किमी दूर',
      riskLevel: 'मध्यम जोखिम',
    },
  ],
  mr: [
    {
      name: 'वसई खाडी रस्ता',
      reason: 'पाण्याचा निचरा न झाल्याने आणि खाडीच्या भरतीमुळे पूरस्थिती शक्य',
      distance: '1.8 किमी अंतरावर',
      riskLevel: 'जास्त धोका',
    },
    {
      name: 'नालासोपारा सखल सबवे परिसर',
      reason: 'पाणी साचून भुयारी मार्ग पाण्याखाली जाण्याची शक्यता',
      distance: '3.4 किमी अंतरावर',
      riskLevel: 'जास्त धोका',
    },
    {
      name: 'गाव जंक्शन व मुख्य चौक',
      reason: 'रस्त्यावर पाणी साचल्याने वाहतूक संथ राहण्याची शक्यता',
      distance: '1.2 किमी अंतरावर',
      riskLevel: 'मध्यम धोका',
    },
  ],
};

// Technical Atmospheric Precursors
export const TECHNICAL_DATA = [
  {
    key: 'iwv',
    label: 'Water Vapor (IWV)',
    value: '+14.2 mm/hr',
    description: 'Rapid column moisture buildup fuel (INSAT-3DR)',
    status: 'Critical Surge',
    color: '#00d2ff',
  },
  {
    key: 'ctt',
    label: 'Cloud Top Temperature',
    value: '-18.5°C in 15m',
    description: 'Explosive convective updraft core cooling rate',
    status: 'Deep Updraft',
    color: '#f87171',
  },
  {
    key: 'cape',
    label: 'Thermal CAPE / CIN',
    value: '3,240 J/kg (-12 CIN)',
    description: 'Severe thermodynamic instability triggering storm cells',
    status: 'Explosive Buoyancy',
    color: '#fbbf24',
  },
  {
    key: 'dem',
    label: 'Terrain Runoff (CartoDEM)',
    value: 'Natural Low Basin',
    description: 'Topographic contour channels runoff into local depressions',
    status: 'Subway Risk',
    color: '#3b82f6',
  },
];

// Multilingual Start Notice visible in all languages at the start of SEVERE WARNING
export const MULTILINGUAL_START_NOTICES = [
  {
    code: 'en',
    badge: 'EN',
    title: 'Severe Rainfall Warning',
    msg: 'Heavy downpour expected in your area within 45 minutes. Avoid waterlogged roads and flowing water.',
  },
  {
    code: 'hi',
    badge: 'हिंदी',
    title: 'भारी बारिश की चेतावनी',
    msg: 'अगले 45 मिनट में आपके क्षेत्र में तेज़ बारिश की संभावना। जलभराव वाले रास्तों से बचें।',
  },
  {
    code: 'mr',
    badge: 'मराठी',
    title: 'मुसळधार पावसाचा इशारा',
    msg: 'पुढील 45 मिनिटांत आपल्या भागात मुसळधार पाऊस संभवतो. सखल रस्त्यांवर जाणे टाळा.',
  },
];

// Helper to generate the 10-15s emergency read-aloud text
export function generateReadAloudScript(lang = 'en', alertInfo = {}) {
  const location = alertInfo.targetLocation || 'Vasai Gaon';
  const region = alertInfo.region || 'Vasai–Nalasopara';
  const eta = alertInfo.eta || '45 minutes';

  if (lang === 'mr') {
    if (alertInfo.alertType === 'regional') {
      return `पुढील 45 मिनिटांत ${region} विभागात अतिवृष्टीचा इशारा आहे. सखल भाग आणि वाहत्या पाण्यापासून दूर रहा. घरातच सुरक्षित रहा.`;
    }
    return `पुढील 45 मिनिटांत ${location} मध्ये मुसळधार पावसाची शक्यता आहे. सखल रस्ते आणि वाहत्या पाण्यापासून दूर रहा. घरातच सुरक्षित रहा.`;
  }

  if (lang === 'hi') {
    if (alertInfo.alertType === 'regional') {
      return `अगले 45 मिनट में ${region} क्षेत्र में भारी बारिश की चेतावनी है। निचले इलाकों और बहते पानी से दूर रहें। सुरक्षित स्थान पर रहें।`;
    }
    return `अगले 45 मिनट में ${location} में तेज़ बारिश की संभावना है। निचले इलाकों और बहते पानी से दूर रहें। घर के अंदर सुरक्षित रहें।`;
  }

  // English default
  if (alertInfo.alertType === 'regional') {
    return `Severe rainfall warning is active for ${region} region within ${eta}. Avoid low-lying roads and flowing water. Stay indoors if possible.`;
  }
  return `Heavy rain is expected in ${location} within ${eta}. Avoid low-lying roads and flowing water. Stay indoors if possible.`;
}

// Global references for audio playback and speech synthesis
let currentAudioInstance = null;
let activeUtterance = null;

// Helper to reliably load browser voices
export async function getBrowserVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const existing = window.speechSynthesis.getVoices();
  if (existing && existing.length > 0) return existing;

  return new Promise((resolve) => {
    let resolved = false;
    const onVoicesChanged = () => {
      if (!resolved) {
        resolved = true;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(window.speechSynthesis.getVoices() || []);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged, { once: true });
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(window.speechSynthesis.getVoices() || []);
      }
    }, 350);
  });
}

// Stop any ongoing audio broadcast (both HTML5 Audio and Web Speech API)
export function stopAlertSpeech() {
  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
      currentAudioInstance.src = '';
    } catch {
      // ignore
    }
    currentAudioInstance = null;
  }

  activeUtterance = null;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

// Phonetic Romanized fallbacks for systems lacking Devanagari TTS engine
const ROMANIZED_FALLBACKS = {
  hi: 'Savdhan: Agle 45 minute me tez barish ki chetavani hai. Kripya nichle ilakon aur behte paani se door rahein. Ghar ke andar surakshit rahein.',
  mr: 'Savdhan: Pudhil 45 minitant musaldhar pausachi shakyata aahe. Krupaya sakhal raste aani vahitya paanyapasun door raha. Gharatach surakshit raha.',
};

/**
 * Robust Browser & Natural Audio Speech Synthesis Engine.
 * Supports Hindi, Marathi, and English.
 * 
 * Strategy:
 * 1. For Hindi and Marathi:
 *    - First attempts high-fidelity online natural audio stream (Google Neural TTS audio).
 *      This produces crystal clear, authentic native Hindi and Marathi speech even on Windows PCs
 *      that have only English voices (David/Zira) installed.
 *    - If online audio is unreachable, searches Web Speech API for any installed Indian voice (hi-IN, mr-IN).
 *    - If offline and only English SAPI voices exist, uses phonetic Romanized transliteration
 *      (e.g., "Savdhan: Agle 45 minute me tez barish...") so it speaks Hindi/Marathi words rather than English!
 * 2. For English:
 *    - Uses standard Web Speech API with the best available voice (en-IN or en-US/UK).
 */
export async function speakAlertSummary(text, lang = 'en', callbacks = {}) {
  const { onStart, onEnd, onError, onVoiceInfo } = callbacks;

  // Always reset ongoing speech first
  stopAlertSpeech();

  // 1. HINDI & MARATHI AUDIO PIPELINE
  if (lang === 'hi' || lang === 'mr') {
    // Attempt High-Fidelity Natural Audio Stream First via local proxy
    try {
      const cleanQuery = text.replace(/[\n\r]+/g, ' ').trim().slice(0, 190);
      const audioUrl = `/api/tts?tl=${lang}&q=${encodeURIComponent(cleanQuery)}`;
      
      const audio = new Audio();
      currentAudioInstance = audio;

      let fallbackHandled = false;
      const triggerFallback = (reason) => {
        if (fallbackHandled) return;
        fallbackHandled = true;
        currentAudioInstance = null;
        console.warn('Audio streaming unavailable (' + reason + '), switching to Web Speech fallback');
        playWebSpeechFallback(text, lang, callbacks);
      };

      audio.onplay = () => {
        if (onStart) {
          onStart({ 
            voice: lang === 'hi' ? 'Natural Hindi Voice' : 'Natural Marathi Voice', 
            lang, 
            text 
          });
        }
        if (onVoiceInfo) {
          onVoiceInfo(lang === 'hi' ? '🔊 प्रामाणिक हिंदी ऑडिओ प्रसारित होत आहे' : '🔊 प्रामाणिक मराठी ऑडिओ प्रसारित होत आहे');
        }
      };

      audio.onended = () => {
        currentAudioInstance = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        triggerFallback('audio element error');
      };

      // Set source and play
      audio.src = audioUrl;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          triggerFallback(err?.message || 'playback rejection');
        });
      }
      return audio;
    } catch (streamErr) {
      currentAudioInstance = null;
      return playWebSpeechFallback(text, lang, callbacks);
    }
  }

  // 2. ENGLISH SPEECH PIPELINE
  return playWebSpeechEnglish(text, callbacks);
}

// Fallback when playing Hindi/Marathi through Web Speech API
async function playWebSpeechFallback(text, lang, callbacks) {
  const { onStart, onEnd, onError, onVoiceInfo } = callbacks;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError(new Error('Speech synthesis not supported.'));
    if (onEnd) onEnd();
    return null;
  }

  try {
    window.speechSynthesis.resume();
    const voices = await getBrowserVoices();

    // Look for native Indian voice
    let indianVoice = null;
    if (lang === 'hi') {
      indianVoice = voices.find((v) => v.lang === 'hi-IN' || v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
    } else if (lang === 'mr') {
      indianVoice = voices.find((v) => v.lang === 'mr-IN' || v.lang.toLowerCase().startsWith('mr') || v.name.toLowerCase().includes('marathi')) ||
                    voices.find((v) => v.lang === 'hi-IN' || v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
    }

    let utteranceText = text;
    let voiceLang = lang === 'mr' ? 'mr-IN' : 'hi-IN';

    if (indianVoice) {
      voiceLang = indianVoice.lang;
    } else {
      // If ONLY English voices exist on Windows (e.g. David / Zira), do NOT speak English sentences!
      // Speak Romanized Hindi or Marathi words so the user actually hears their chosen language!
      utteranceText = ROMANIZED_FALLBACKS[lang] || text;
      voiceLang = 'en-US';
      if (onVoiceInfo) {
        onVoiceInfo(lang === 'hi' ? 'ध्वन्यात्मक हिंदी उच्चार वापरत आहे' : 'ध्वन्यात्मक मराठी उच्चार वापरत आहे');
      }
    }

    const utterance = new SpeechSynthesisUtterance(utteranceText);
    activeUtterance = utterance;

    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    utterance.lang = voiceLang;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart({ voice: indianVoice?.name || 'Phonetic Synthesizer', lang, text });
    };

    utterance.onend = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        if (onError) onError(e);
      }
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    if (onError) onError(err);
    if (onEnd) onEnd();
    return null;
  }
}

// English speech synthesis
async function playWebSpeechEnglish(text, callbacks) {
  const { onStart, onEnd, onError } = callbacks;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError(new Error('Speech synthesis not supported.'));
    if (onEnd) onEnd();
    return null;
  }

  try {
    window.speechSynthesis.resume();
    const voices = await getBrowserVoices();

    const chosenVoice = voices.find((v) => v.lang === 'en-IN') ||
                        voices.find((v) => v.name.toLowerCase().includes('india')) ||
                        voices.find((v) => v.lang.startsWith('en')) ||
                        voices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
    utterance.lang = chosenVoice?.lang || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart({ voice: chosenVoice?.name, lang: 'en', text });
    };

    utterance.onend = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        if (onError) onError(e);
      }
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    if (onError) onError(err);
    if (onEnd) onEnd();
    return null;
  }
}

