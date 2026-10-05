import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Clock,
  CloudRain,
  Volume2,
  Square,
  ChevronDown,
  ChevronUp,
  Map,
  Bell,
  BellRing,
  PhoneCall,
  CheckCircle2,
  Zap,
  Car,
  Home,
  BatteryCharging,
  Power,
  Flashlight,
  TrendingUp,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
  Brain,
  Cpu,
  Sparkles,
  Layers,
  Droplets,
  Waves,
  Wind,
  CloudLightning,
  Activity,
  ArrowRight
} from 'lucide-react';
import {
  ALERT_LANGUAGES,
  UI_TRANSLATIONS,
  RECOMMENDED_ACTIONS,
  RISK_AREAS_DATA,
  TECHNICAL_DATA,
  MULTILINGUAL_START_NOTICES,
  generateReadAloudScript,
  speakAlertSummary,
  stopAlertSpeech,
} from '../../data/alertTranslations';
import { SEVERE_ALERT, REGIONS_DATA } from '../../data/weatherData';

// Map icon strings to Lucide components
function ActionIcon({ iconName, size = 16, className = '' }) {
  switch (iconName) {
    case 'Car':
      return <Car size={size} className={className} />;
    case 'Home':
      return <Home size={size} className={className} />;
    case 'BatteryCharging':
      return <BatteryCharging size={size} className={className} />;
    case 'Zap':
      return <Zap size={size} className={className} />;
    case 'Power':
      return <Power size={size} className={className} />;
    case 'Flashlight':
      return <Flashlight size={size} className={className} />;
    case 'TrendingUp':
      return <TrendingUp size={size} className={className} />;
    default:
      return <AlertTriangle size={size} className={className} />;
  }
}

export default function AlertDetailsModal({
  isOpen,
  onClose,
  activeLocation,
  alertData,
  onViewOnMap,
  onOpenXai,
  activePortal
}) {
  const [lang, setLang] = useState('en'); // 'en' | 'hi' | 'mr'
  const [alertScope, setAlertScope] = useState(alertData?.alertType || 'hyperlocal'); // 'hyperlocal' | 'regional'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState('');
  const [speechNotice, setSpeechNotice] = useState('');
  
  // Authorities see technical details expanded by default
  const [showTechDetails, setShowTechDetails] = useState(activePortal === 'officials');
  const [reminderSet, setReminderSet] = useState(false);
  const [reminderToast, setReminderToast] = useState(false);

  // Stop speech if modal closes or unmounts
  useEffect(() => {
    return () => {
      stopAlertSpeech();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopAlertSpeech();
      setIsSpeaking(false);
      setActiveSpeechText('');
      setSpeechNotice('');
      setShowTechDetails(activePortal === 'officials');
    } else {
      setShowTechDetails(activePortal === 'officials');
    }
  }, [isOpen, activePortal]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const currentHazard = alertData?.hazardType || 'severe_rain'; // 'severe_rain' | 'thunderstorm' | 'cloudburst' | 'flash_flood'
  const severity = (alertData?.severity || 'Severe').toLowerCase(); // 'low' | 'moderate' | 'high' | 'severe'

  const isOfficial = activePortal === 'officials';

  // Location display resolution
  const locationName = activeLocation?.name || alertData?.location || 'Vasai Gaon';
  const regionName = alertData?.region || 'Vasai–Nalasopara';

  // Localized location and region strings
  let localizedLocation = locationName;
  let localizedRegion = regionName;
  if (lang === 'hi') {
    if (locationName.includes('Vasai')) localizedLocation = 'वसई गांव';
    else if (locationName.includes('Nalasopara')) localizedLocation = 'नालासोपारा पश्चिम';
    else if (locationName.includes('Virar')) localizedLocation = 'विरार दक्षिण';
    else if (locationName.includes('Mumbai')) localizedLocation = 'मुंबई उपनगर';
    else if (locationName.includes('Thane')) localizedLocation = 'ठाणे उत्तर';
    localizedRegion = 'वसई–नालासोपारा क्षेत्र';
  } else if (lang === 'mr') {
    if (locationName.includes('Vasai')) localizedLocation = 'वसई गाव';
    else if (locationName.includes('Nalasopara')) localizedLocation = 'नालासोपारा पश्चिम';
    else if (locationName.includes('Virar')) localizedLocation = 'विरार दक्षिण';
    else if (locationName.includes('Mumbai')) localizedLocation = 'मुंबई उपनगरे';
    else if (locationName.includes('Thane')) localizedLocation = 'ठाणे उत्तर';
    localizedRegion = 'वसई–नालासोपारा विभाग';
  }

  // Localized headline based on scope
  let mainHeadline = '';
  let affectedZoneLabel = '';
  let etaText = '45 min';

  if (alertScope === 'regional') {
    if (lang === 'hi') {
      mainHeadline = `${localizedRegion} के लिए भारी बारिश की चेतावनी`;
      affectedZoneLabel = `${localizedRegion} व पालघर तटीय बेल्ट`;
    } else if (lang === 'mr') {
      mainHeadline = `${localizedRegion}साठी अतिवृष्टीचा इशारा`;
      affectedZoneLabel = `${localizedRegion} व पालघर किनारपट्टी पट्टा`;
    } else {
      mainHeadline = `Severe rainfall warning for ${regionName} region`;
      affectedZoneLabel = `${regionName} & Palghar Coastal Belt`;
    }
  } else {
    if (lang === 'hi') {
      mainHeadline = `${localizedLocation} में भारी बारिश की संभावना है`;
      affectedZoneLabel = `${localizedLocation} व आसपास का दायरा`;
    } else if (lang === 'mr') {
      mainHeadline = `${localizedLocation} मध्ये मुसळधार पावसाची शक्यता आहे`;
      affectedZoneLabel = `${localizedLocation} व लगतचा परिसर`;
    } else {
      mainHeadline = `Heavy rain is expected in ${locationName}`;
      affectedZoneLabel = `${locationName} & nearby areas`;
    }
  }

  // "Am I Affected?" resolution
  // If user is directly in location -> affected_now. If regional -> regional. Else nearby.
  const distanceVal = alertData?.distanceFromUser || '3.2 km';
  const affectedType = alertScope === 'regional' ? 'regional' : (alertData?.affectedStatus || 'affected_now');
  const affectedStatusInfo = t.affectedStatus[affectedType] || t.affectedStatus.affected_now;
  const affectedTitle = affectedStatusInfo.badge
    .replace('{distance}', distanceVal)
    .replace('{region}', localizedRegion);

  // Recommended actions adapted to hazard type
  const actionsList = (RECOMMENDED_ACTIONS[currentHazard] && RECOMMENDED_ACTIONS[currentHazard][lang]) ||
                      RECOMMENDED_ACTIONS.severe_rain[lang] ||
                      RECOMMENDED_ACTIONS.severe_rain.en;

  // Hyper-local risk areas
  const riskAreas = RISK_AREAS_DATA[lang] || RISK_AREAS_DATA.en;

  // Resolve dynamic region precursor data for Explainable AI
  const regionKey = (activeLocation?.id || 'vasai').toLowerCase();
  const currentRegionData = REGIONS_DATA[regionKey] || REGIONS_DATA.vasai;

  const precursorTelemetryList = [
    {
      key: 'iwv',
      icon: Droplets,
      iconColor: '#00d2ff',
      label: lang === 'hi' ? 'जल वाष्प संचय (IWV)' : lang === 'mr' ? 'पाण्याची वाफ संचय (IWV)' : 'Water Vapor Surge (IWV)',
      sublabel: 'INSAT-3DR Sounder · Rapid-Scan',
      value: currentRegionData.precursors?.iwvRate || '+16.8 mm/hr',
      metric: currentRegionData.precursors?.iwv || '64.2 mm col',
      status: lang === 'hi' ? 'तीव्र संचय' : lang === 'mr' ? 'गंभीर वाढ' : 'Critical Surge',
      statusType: 'critical',
      weight: 34,
      description: lang === 'hi'
        ? 'वायुमंडलीय जल वाष्प में अचानक वृद्धि, मूसलाधार बारिश का मुख्य ईंधन।'
        : lang === 'mr'
        ? 'वातावरणात अचानक वाढलेली वाफ ढगफुटीसदृश पावसाला कारणीभूत ठरते.'
        : 'Rapid column moisture buildup fueling localized cloudburst potential.',
    },
    {
      key: 'ctt',
      icon: CloudLightning,
      iconColor: '#f87171',
      label: lang === 'hi' ? 'क्लाउड टॉप तापमान (CTT)' : lang === 'mr' ? 'क्लाउड टॉप तापमान (CTT)' : 'Cloud Top Temp (CTT)',
      sublabel: 'Convective Updraft Core',
      value: currentRegionData.precursors?.ctt || '-21.8°C / 15m',
      metric: 'Overshooting Top',
      status: lang === 'hi' ? 'तीव्र उर्ध्व प्रवाह' : lang === 'mr' ? 'शीघ्र शीतलन' : 'Deep Updraft',
      statusType: 'danger',
      weight: 28,
      description: lang === 'hi'
        ? 'बादलों के शीर्ष में त्वरित शीतलन, गंभीर तूफ़ान का स्पष्ट संकेत।'
        : lang === 'mr'
        ? 'ढगांच्या वरील भागातील तीव्र शीतलन वादळाचा जोरदार प्रसार दर्शवते.'
        : 'Severe vertical updraft core cooling rate penetrating the tropopause.',
    },
    {
      key: 'cape',
      icon: Zap,
      iconColor: '#fbbf24',
      label: lang === 'hi' ? 'CAPE / CIN संवहनी ऊर्जा' : lang === 'mr' ? 'CAPE / CIN संवहनी ऊर्जा' : 'CAPE / CIN Buoyancy',
      sublabel: 'Thermodynamic Instability',
      value: currentRegionData.precursors?.cape || '3,410 J/kg',
      metric: `CIN: ${currentRegionData.precursors?.cin || '-8 J/kg'}`,
      status: lang === 'hi' ? 'विस्फोटक ऊर्जा' : lang === 'mr' ? 'स्फोटक ऊर्जा' : 'Explosive Energy',
      statusType: 'warning',
      weight: 22,
      description: lang === 'hi'
        ? 'उच्च संवहनी उपलब्ध ऊर्जा बादलों में आंधी और बिजली पैदा करती है।'
        : lang === 'mr'
        ? 'अतिउच्च संवहनी ऊर्जा वादळी वारे व विजांच्या कडकडाटास अनुकूल.'
        : 'Explosive thermodynamic buoyancy triggering violent thunderstorm cells.',
    },
    {
      key: 'convergence',
      icon: Wind,
      iconColor: '#c084fc',
      label: lang === 'hi' ? 'पवन अभिसरण (लिफ्ट)' : lang === 'mr' ? 'तळ वारे अभिसरण' : 'Wind Convergence (Lift)',
      sublabel: 'Doppler Dual-Pol Radar (DWR)',
      value: currentRegionData.precursors?.convergence || '8.2 × 10⁻⁵ s⁻¹',
      metric: 'Kinematic Updraft',
      status: lang === 'hi' ? 'उर्ध्व लिफ्ट' : lang === 'mr' ? 'उर्ध्व लिफ्ट' : 'Strong Updraft Trigger',
      statusType: 'purple',
      weight: 10,
      description: lang === 'hi'
        ? 'निचले स्तर की हवाएं नमी को ऊपर धकेल कर आंधी के बादल बनाती हैं।'
        : lang === 'mr'
        ? 'तळातील वारे एकत्र येऊन बाष्प वेगाने वर ढकलतात.'
        : 'Low-level coastal wind collision forcing rapid vertical convective updraft.',
    },
    {
      key: 'dem',
      icon: Waves,
      iconColor: '#38bdf8',
      label: lang === 'hi' ? 'टोपोग्राफिक रनऑफ (CartoDEM)' : lang === 'mr' ? 'भूरचना प्रवाह (CartoDEM)' : 'CartoDEM Topo Runoff',
      sublabel: 'Catchment Basin Depression',
      value: currentRegionData.precursors?.runoff || '560 m³/s',
      metric: 'Natural Low Basin',
      status: lang === 'hi' ? 'जलभराव जोखिम' : lang === 'mr' ? 'जलमय धोका' : 'Subway Ponding Risk',
      statusType: 'info',
      weight: 6,
      description: lang === 'hi'
        ? 'प्राकृतिक ढलान और कंक्रीट सड़कें पानी को सबवे और मुख्य सड़कों पर रोकती हैं।'
        : lang === 'mr'
        ? 'सखल भाग व काँक्रीट रस्त्यांमुळे पाणी सबवे व मुख्य मार्गांवर साचते.'
        : 'Topographic contour channels runoff into local depressions and underpasses.',
    },
  ];

  // Read-aloud emergency text script for current language, scope, and location
  const readAloudScript = generateReadAloudScript(lang, {
    alertType: alertScope,
    targetLocation: localizedLocation,
    region: localizedRegion,
    eta: lang === 'mr' ? '45 मिनिटांत' : (lang === 'hi' ? '45 मिनट में' : '45 minutes'),
  });

  // Handle Text-to-Speech with robust Hindi & Marathi support
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopAlertSpeech();
      setIsSpeaking(false);
      setActiveSpeechText('');
      setSpeechNotice('');
      return;
    }

    setIsSpeaking(true);
    setActiveSpeechText(readAloudScript);

    speakAlertSummary(readAloudScript, lang, {
      onStart: (info) => {
        setIsSpeaking(true);
        if (info?.text) setActiveSpeechText(info.text);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setActiveSpeechText('');
      },
      onError: (err) => {
        console.warn('TTS error or cancelled:', err);
        setIsSpeaking(false);
        setActiveSpeechText('');
      },
      onVoiceInfo: (msg) => {
        setSpeechNotice(msg);
        setTimeout(() => setSpeechNotice(''), 4500);
      },
    });
  };

  // Handle Set Reminder
  const handleToggleReminder = () => {
    setReminderSet(!reminderSet);
    setReminderToast(true);
    setTimeout(() => setReminderToast(false), 2600);
  };

  // Severity badge icon and color
  const renderSeverityBadge = () => {
    switch (severity) {
      case 'low':
        return (
          <span className="severity-pill pill-low">
            <ShieldCheck size={13} />
            <span>{t.severityLevels.low}</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="severity-pill pill-moderate">
            <AlertCircle size={13} />
            <span>{t.severityLevels.moderate}</span>
          </span>
        );
      case 'high':
        return (
          <span className="severity-pill pill-high">
            <AlertTriangle size={13} />
            <span>{t.severityLevels.high}</span>
          </span>
        );
      case 'severe':
      default:
        return (
          <span className="severity-pill pill-severe">
            <ShieldAlert size={13} />
            <span>{t.severityLevels.severe}</span>
          </span>
        );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container citizen-alert-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
      >
        {/* Top Header with Compact Language Selector & Scope Pills */}
        <div className="alert-modal-header">
          <div className="header-meta-left">
            <div className="pulse-indicator">
              <span className="pulse-ring"></span>
              <span className="pulse-dot"></span>
            </div>
            <div>
              <div className="system-tag-row">
                <span className="system-pill">{isOfficial ? 'STORMS COMMAND CENTER' : t.systemName}</span>
                <span className="alert-meta-dot">•</span>
                <span className="header-subtext">{isOfficial ? 'NDMA CAP INTERFACE' : t.issuedBy}</span>
              </div>
              <span className="header-time-pill">{t.timeAgo}</span>
            </div>
          </div>

          <div className="header-controls-right">
            {/* Language Selector: EN | हिंदी | मराठी */}
            <div className="lang-selector-pill" role="radiogroup" aria-label="Language selector">
              {ALERT_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  className={`lang-btn ${lang === item.code ? 'active' : ''}`}
                  onClick={() => {
                    if (isSpeaking) stopAlertSpeech();
                    setIsSpeaking(false);
                    setLang(item.code);
                  }}
                  title={item.fullLabel}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button 
              className="modal-close-btn" 
              onClick={() => {
                stopAlertSpeech();
                onClose();
              }}
              aria-label="Close modal"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body-scrollable alert-modal-content">
          
          {/* Scope Selector Tabs: Hyper-local vs Regional Warning */}
          <div className="alert-scope-bar">
            <span className="scope-label">{t.alertScope}:</span>
            <div className="scope-tabs">
              <button
                className={`scope-tab ${alertScope === 'hyperlocal' ? 'active' : ''}`}
                onClick={() => setAlertScope('hyperlocal')}
              >
                <MapPin size={13} />
                <span>{t.scopeHyperlocal}: {localizedLocation}</span>
              </button>
              <button
                className={`scope-tab ${alertScope === 'regional' ? 'active' : ''}`}
                onClick={() => setAlertScope('regional')}
              >
                <Radio size={13} />
                <span>{t.scopeRegional}: {localizedRegion}</span>
              </button>
            </div>
          </div>

          {/* 1. WHAT IS HAPPENING? (Emergency Headline & Broadcast Text) */}
          <div className={`alert-hero-card ${alertScope === 'regional' ? 'regional-theme' : 'hyperlocal-theme'} ${isSpeaking ? 'active-reading-card' : ''}`}>
            
            {/* Top Badges Row: Severity Badge + Live Audio Indicator + High-Contrast ETA Capsule */}
            <div className="hero-badges-row">
              <div className="hero-severity-wrap">
                {renderSeverityBadge()}
                {isSpeaking && (
                  <span className="hero-live-audio-pill">
                    <span className="live-dot-pulse"></span>
                    <span>{lang === 'hi' ? 'ऑडियो जारी है' : lang === 'mr' ? 'ऑडिओ चालू आहे' : 'PLAYING VOICE'}</span>
                  </span>
                )}
              </div>

              <div className="hero-top-meta">
                <span className="hero-leadtime-pill">
                  <Clock size={14} className="hero-leadtime-icon" />
                  <span className="hero-leadtime-text">
                    <strong className="leadtime-prefix">{lang === 'hi' ? 'समय:' : lang === 'mr' ? 'वेळ:' : 'ETA:'}</strong>{' '}
                    <span>{lang === 'hi' ? '45 मिनट में' : lang === 'mr' ? '45 मिनिटांत' : 'Within 45 min'}</span>
                  </span>
                </span>
              </div>
            </div>

            {/* Main Hazard Headline & Target Zone */}
            <div className="hero-title-row">
              <h2 className="hero-hazard-title">
                {t.hazardNames[currentHazard] || t.hazardNames.severe_rain}
              </h2>
              <div className="hero-location-badge">
                <MapPin size={13} className="text-cyan" />
                <span>{localizedLocation} · {localizedRegion}</span>
              </div>
            </div>

            {/* Display the short text which is being read aloud with clean, robust styling */}
            <div className={`hero-readaloud-banner ${isSpeaking ? 'active-reading' : ''}`}>
              <div className="readaloud-banner-header">
                <div className="readaloud-tag">
                  <Volume2 size={13} className={isSpeaking ? 'text-red pulse-fast' : 'text-cyan'} />
                  <span>
                    {lang === 'hi'
                      ? 'आपातकालीन वॉइस सारांश (ऑडियो विवरण)'
                      : lang === 'mr'
                      ? 'तातडीचा व्हॉइस सारांश (ऑडिओ मजकूर)'
                      : 'EMERGENCY VOICE BROADCAST SUMMARY'}
                  </span>
                </div>
                {isSpeaking && (
                  <div className="hero-audio-bars">
                    <span></span><span></span><span></span><span></span>
                  </div>
                )}
              </div>

              <p className="hero-broadcast-text">
                "{readAloudScript}"
              </p>
            </div>

            {speechNotice && (
              <div className="speech-notice-toast">
                <Info size={13} />
                <span>{speechNotice}</span>
              </div>
            )}
          </div>

          {/* 2. "AM I AFFECTED?" SECTION */}
          <div className={`affected-status-card status-${affectedType}`}>
            <div className="status-icon-wrap">
              {affectedType === 'affected_now' ? (
                <ShieldAlert size={20} className="status-icon pulse-alert" />
              ) : affectedType === 'nearby' ? (
                <MapPin size={20} className="status-icon text-cyan" />
              ) : (
                <Radio size={20} className="status-icon text-orange" />
              )}
            </div>

            <div className="status-text-block">
              <div className="status-headline-row">
                <h3 className="status-title">{isOfficial ? (lang === 'hi' ? 'कैचमेंट प्रभाव व जोखिम' : lang === 'mr' ? 'धोकादायक क्षेत्र प्रभाव' : 'CATCHMENT IMPACT & VULNERABILITY') : affectedTitle}</h3>
                <span className="status-tag">{isOfficial ? (lang === 'hi' ? 'गंभीर' : lang === 'mr' ? 'अतिधोकादायक' : 'CRITICAL') : affectedStatusInfo.tag}</span>
              </div>
              <p className="status-desc">{isOfficial ? (lang === 'hi' ? 'बाढ़ और जलभराव का उच्च जोखिम। तत्काल एनडीआरएफ प्रतिक्रिया की सिफारिश की जाती है।' : lang === 'mr' ? 'पूर आणि पाणी साचण्याचा उच्च धोका. तातडीने एनडीआरएफ तैनाती आवश्यक.' : 'High inundation risk across designated polygons. Immediate NDRF dispatch recommended.') : affectedStatusInfo.sub}</p>
            </div>
          </div>

          {/* 3. QUICK ACTION BAR: READ ALOUD & VIEW ON MAP */}
          <div className="quick-action-strip">
            {isOfficial ? (
              <>
                <button
                  className="action-btn-pill map-hero-btn"
                  onClick={() => {
                    onClose();
                    const mapElement = document.querySelector('.weather-map-container, .map-viewport-wrapper');
                    if (mapElement) {
                      mapElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Map size={15} />
                  <span>{lang === 'hi' ? 'जोखिम ग्रिड देखें' : lang === 'mr' ? 'धोका नकाशा पहा' : 'View on Risk Grid'}</span>
                </button>
                <button
                  className="action-btn-pill reminder-hero-btn"
                  onClick={() => {
                    const dispatchBtn = document.querySelector('.dispatch-btn, .sidebar-nav-btn[aria-label="Alert Dispatch"], .sidebar-nav-btn:nth-child(3)');
                    if (dispatchBtn) {
                      onClose();
                      dispatchBtn.click();
                    }
                  }}
                  style={{ flex: 1, justifyContent: 'center', background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
                >
                  <Radio size={15} className="pulse-fast text-red" />
                  <span>{lang === 'hi' ? 'CAP अलर्ट भेजें' : lang === 'mr' ? 'CAP अलर्ट पाठवा' : 'Dispatch CAP Alert'}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className={`action-btn-pill tts-hero-btn ${isSpeaking ? 'speaking-active' : ''}`}
                  onClick={handleToggleSpeech}
                  title={isSpeaking ? t.buttons.stop : t.buttons.readAloud}
                >
                  {isSpeaking ? (
                    <>
                      <div className="audio-wave-anim">
                        <span></span><span></span><span></span><span></span>
                      </div>
                      <Square size={13} className="stop-icon" />
                      <span>{t.buttons.stop}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} />
                      <span>{t.buttons.readAloud}</span>
                      <span className="tts-duration-hint">12s</span>
                    </>
                  )}
                </button>

                <button
                  className="action-btn-pill map-hero-btn"
                  onClick={() => {
                    if (onViewOnMap) {
                      onViewOnMap();
                    } else {
                      onClose();
                      const mapElement = document.querySelector('.weather-map-container, .map-viewport-wrapper, .citizen-main-content');
                      if (mapElement) {
                        mapElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  <Map size={15} />
                  <span>{t.buttons.viewOnMap}</span>
                </button>

                <button
                  className={`action-btn-pill reminder-hero-btn ${reminderSet ? 'active' : ''}`}
                  onClick={handleToggleReminder}
                >
                  {reminderSet ? (
                    <>
                      <BellRing size={15} className="text-emerald" />
                      <span>{t.buttons.reminderActive}</span>
                    </>
                  ) : (
                    <>
                      <Bell size={15} />
                      <span>{t.buttons.setReminder}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Toast feedback when reminder is toggled */}
          {reminderToast && (
            <div className="reminder-toast-banner">
              <CheckCircle2 size={15} />
              <span>
                {reminderSet
                  ? (lang === 'hi' ? 'एसएमएस/पुश सूचना रिमाइंडर चालू किया गया' : lang === 'mr' ? 'स्मरणपत्र सूचना सक्रिय केली गेली' : 'Push notifications & reminder active for this alert')
                  : (lang === 'hi' ? 'रिमाइंडर बंद किया गया' : lang === 'mr' ? 'स्मरणपत्र निष्क्रिय केले' : 'Alert reminder deactivated')}
              </span>
            </div>
          )}

          {!isOfficial && (
            <div className="alert-section-card">
              <div className="section-card-header">
                <div className="section-icon-badge badge-green">
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <h3 className="section-card-title">{t.headings.whatToDo}</h3>
                  <span className="section-card-subtitle">
                    {lang === 'hi' ? 'अपनी और अपने परिवार की सुरक्षा के लिए आवश्यक कदम' : 
                     lang === 'mr' ? 'स्वतःच्या व कुटुंबीयांच्या सुरक्षिततेसाठी खबरदारी' : 
                     'Essential precautions to protect yourself and family'}
                  </span>
                </div>
              </div>

              <div className="citizen-actions-grid">
                {actionsList.map((action, idx) => (
                  <div key={action.id || idx} className="citizen-action-item">
                    <div className="action-item-icon-box">
                      <ActionIcon iconName={action.icon} size={15} className="text-emerald" />
                    </div>
                    <span className="action-item-text">{action.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isOfficial && (
            <div className="alert-section-card authorities-mobilization-card">
              <div className="section-card-header">
                <div className="section-icon-badge badge-red">
                  <ShieldAlert size={17} />
                </div>
                <div>
                  <h3 className="section-card-title">{lang === 'hi' ? 'एसओपी मोबिलाइजेशन प्रोटोकॉल' : lang === 'mr' ? 'एसओपी डिप्लॉयमेंट प्रोटोकॉल' : 'SOP MOBILIZATION PROTOCOLS'}</h3>
                  <span className="section-card-subtitle">
                    {lang === 'hi' ? 'सिफारिश की गई प्रतिक्रिया और डिप्लॉयमेंट' : 
                     lang === 'mr' ? 'शिफारस केलेले प्रतिसाद व तैनाती' : 
                     'Recommended automated staging and dispatch vectors'}
                  </span>
                </div>
              </div>
              <div className="citizen-actions-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="citizen-action-item" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <div className="action-item-icon-box"><Radio size={15} className="text-amber" /></div>
                  <span className="action-item-text">{lang === 'hi' ? 'WEA और SMS के माध्यम से CAP अलर्ट जारी करें' : lang === 'mr' ? 'WEA आणि SMS द्वारे CAP अलर्ट जारी करा' : 'Broadcast Level 4 CAP Alert via WEA and Telecom SMS Geo-push'}</span>
                </div>
                <div className="citizen-action-item" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <div className="action-item-icon-box"><Users size={15} className="text-red" /></div>
                  <span className="action-item-text">{lang === 'hi' ? 'NDRF 5वीं बटालियन और SDRF नावों को तैयार करें' : lang === 'mr' ? 'NDRF ५वी बटालियन आणि SDRF बोटी सज्ज करा' : 'Stage NDRF 5th Bn and SDRF zodiac boats at Vasai Creek'}</span>
                </div>
                <div className="citizen-action-item" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <div className="action-item-icon-box"><AlertTriangle size={15} className="text-blue" /></div>
                  <span className="action-item-text">{lang === 'hi' ? ' निचले इलाकों के सबवे (मिलन/मलाड) को बैरिकेड करें' : lang === 'mr' ? 'सखल भागातील सबवे (मिलन/मालाड) बॅरिकेड करा' : 'Barricade low-lying subways and activate high-capacity dewatering pumps'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. HIGHER-RISK AREAS (Hotspots without technical jargon) */}
          <div className="alert-section-card">
            <div className="section-card-header">
              <div className="section-icon-badge badge-red">
                <AlertTriangle size={17} />
              </div>
              <div>
                <h3 className="section-card-title">{t.headings.higherRiskAreas}</h3>
                <span className="section-card-subtitle">
                  {lang === 'hi' ? 'इन स्थानों पर जलभराव और यातायात में बाधा हो सकती है' : 
                   lang === 'mr' ? 'या ठिकाणी पाणी साचण्याची व रस्ते बंद होण्याची शक्यता' : 
                   'Locations with elevated flooding and traffic inundation risks'}
                </span>
              </div>
            </div>

            <div className="citizen-risk-areas-list">
              {riskAreas.map((area, idx) => (
                <div key={idx} className="risk-area-card">
                  <div className="risk-area-left">
                    <span className="risk-pin-dot">📍</span>
                    <div>
                      <h4 className="risk-area-name">{area.name}</h4>
                      <p className="risk-area-reason">{area.reason}</p>
                    </div>
                  </div>
                  <div className="risk-area-right">
                    <span className="risk-dist-badge">{area.distance}</span>
                    <span className="risk-level-tag">{area.riskLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. WHY ARE WE WARNING YOU? (Citizen explainability + expandable technical telemetry) */}
          <div className="alert-section-card why-warning-card">
            <div className="section-card-header">
              <div className="section-icon-badge badge-purple">
                <Brain size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="why-header-top">
                  <h3 className="section-card-title">{t.headings.whyAlert}</h3>
                  <span className="xai-tag-pill">
                    <Sparkles size={11} className="xai-tag-icon" />
                    <span>Explainable AI (XAI)</span>
                  </span>
                </div>
                <p className="why-citizen-text">{t.explanation}</p>
              </div>
            </div>

            {/* Expandable Technical Details Button */}
            <div className="tech-expand-container">
              <button 
                type="button"
                className={`tech-accordion-btn ${showTechDetails ? 'expanded' : ''}`}
                onClick={() => setShowTechDetails(!showTechDetails)}
                aria-expanded={showTechDetails}
              >
                <div className="tech-accordion-left">
                  <div className="tech-accordion-icon-box">
                    <Cpu size={16} />
                  </div>
                  <div className="tech-accordion-text-group">
                    <span className="tech-accordion-title">
                      {showTechDetails ? t.hideTechBtn : t.viewTechBtn}
                    </span>
                    <span className="tech-accordion-sub">
                      INSAT-3DR Rapid-Scan · Doppler Dual-Pol · CartoDEM · SHAP
                    </span>
                  </div>
                </div>

                <div className="tech-accordion-right">
                  <span className="tech-precursor-counter-badge">
                    <span className="counter-pulse-dot"></span>
                    <span>{precursorTelemetryList.length} Live Precursors</span>
                  </span>
                  <div className={`tech-accordion-chevron ${showTechDetails ? 'rotated' : ''}`}>
                    <ChevronDown size={17} />
                  </div>
                </div>
              </button>

              {/* Collapsible Technical Precursor Values */}
              {showTechDetails && (
                <div className="tech-details-drawer">
                  <div className="tech-drawer-header">
                    <div className="tech-drawer-title-group">
                      <div className="drawer-title-with-pulse">
                        <span className="status-pulse-live"></span>
                        <span className="tech-drawer-label">{t.headings.technicalDetails}</span>
                      </div>
                      <span className="tech-drawer-sublabel">
                        Spatiotemporal physics & SHAP attributions driving the 2–6h nowcast model
                      </span>
                    </div>
                    <span className="tech-moes-badge">MoES / IMD / NCMRWF Telemetry</span>
                  </div>
                  
                  <div className="precursor-metrics-grid">
                    {precursorTelemetryList.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div key={item.key} className={`precursor-metric-card border-${item.statusType}`}>
                          <div className="precursor-card-top">
                            <div className="precursor-label-with-icon">
                              <span className="precursor-icon-badge" style={{ color: item.iconColor }}>
                                <IconComp size={15} />
                              </span>
                              <div>
                                <span className="precursor-label">{item.label}</span>
                                <span className="precursor-sublabel">{item.sublabel}</span>
                              </div>
                            </div>
                            <span className={`precursor-status-pill pill-${item.statusType}`}>
                              {item.status}
                            </span>
                          </div>

                          <div className="precursor-val-row">
                            <span className="precursor-value" style={{ color: item.iconColor }}>
                              {item.value}
                            </span>
                            {item.metric && (
                              <span className="precursor-extra-metric">{item.metric}</span>
                            )}
                          </div>

                          <p className="precursor-desc">{item.description}</p>

                          {/* SHAP Feature Contribution Bar */}
                          <div className="precursor-shap-bar-container">
                            <div className="shap-bar-header">
                              <span className="shap-bar-label">Attribution Weight (SHAP)</span>
                              <strong className="shap-bar-pct" style={{ color: item.iconColor }}>
                                {item.weight}%
                              </strong>
                            </div>
                            <div className="shap-bar-track">
                              <div 
                                className={`shap-bar-fill fill-${item.statusType}`} 
                                style={{ width: `${item.weight}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Deep-dive XAI CTA strip */}
                  <div className="xai-drawer-cta-strip">
                    <div className="xai-cta-info">
                      <Layers size={18} className="text-purple" />
                      <div>
                        <strong className="xai-cta-title">
                          {lang === 'hi' ? 'स्थानिक-कालिक मल्टी-टास्क अटेंशन लेयर्स' : lang === 'mr' ? 'मल्टी-टास्क अटेंशन लेयर्स' : 'Spatiotemporal Multi-Task Attention Layers'}
                        </strong>
                        <p className="xai-cta-desc">
                          {lang === 'hi'
                            ? 'ConvLSTM अटेंशन हेड्स, वर्षा मैट्रिक्स और 2-6 घंटे के लीड समय का गहन विश्लेषण करें।'
                            : lang === 'mr'
                            ? 'ConvLSTM अटेंशन हेड्स, पर्जन्य मॅट्रिक्स आणि २-६ तासांचे वेळेचे सखोल विश्लेषण पहा.'
                            : 'Inspect ConvLSTM cross-channel attention heads, precipitation matrices, and lead times.'}
                        </p>
                      </div>
                    </div>
                    {onOpenXai && (
                      <button 
                        type="button"
                        className="open-xai-modal-link-btn"
                        onClick={() => onOpenXai(activeLocation)}
                      >
                        <span>{lang === 'hi' ? 'XAI स्टूडियो में खोलें' : lang === 'mr' ? 'XAI स्टुडिओ उघडा' : 'Open XAI Studio'}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isOfficial && (
            <div className="helpline-footer-strip">
              <div className="helpline-col">
                <PhoneCall size={14} className="text-cyan" />
                <span>{lang === 'hi' ? 'आपदा नियंत्रण कक्ष:' : lang === 'mr' ? 'आपत्ती नियंत्रण कक्ष:' : 'Disaster Helpline:'} <strong>1077</strong></span>
              </div>
              <div className="helpline-col">
                <PhoneCall size={14} className="text-cyan" />
                <span>{lang === 'hi' ? 'एनडीआरएफ मुख्यालय:' : lang === 'mr' ? 'एनडीआरएफ मुख्यालय:' : 'NDRF Operations:'} <strong>1070</strong></span>
              </div>
              <div className="helpline-col">
                <PhoneCall size={14} className="text-cyan" />
                <span>{lang === 'hi' ? 'स्थानीय आपदा कक्ष:' : lang === 'mr' ? 'स्थानिक आपत्ती कक्ष:' : 'Vasai Disaster Cell:'} <strong>0250-2525100</strong></span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer citizen-alert-footer">
          <div className="footer-left-actions">
            <button
              className={`footer-tts-btn ${isSpeaking ? 'active' : ''}`}
              onClick={handleToggleSpeech}
            >
              {isSpeaking ? (
                <>
                  <Square size={14} />
                  <span>{t.buttons.stop}</span>
                </>
              ) : (
                <>
                  <Volume2 size={15} />
                  <span>{t.buttons.readAloud}</span>
                </>
              )}
            </button>
          </div>

          <div className="footer-right-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                stopAlertSpeech();
                onClose();
              }}
            >
              {t.buttons.close}
            </button>

            <button
              className="btn-primary map-view-submit-btn"
              onClick={() => {
                stopAlertSpeech();
                if (onViewOnMap) {
                  onViewOnMap();
                } else {
                  onClose();
                  const mapElement = document.querySelector('.weather-map-container, .map-viewport-wrapper, .citizen-main-content');
                  if (mapElement) {
                    mapElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              <Map size={15} />
              <span>{t.buttons.viewOnMap}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
