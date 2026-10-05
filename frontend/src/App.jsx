import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CitizenDashboard from './components/citizen/CitizenDashboard';
import OfficialsDashboard from './components/officials/OfficialsDashboard';
import AuthoritiesLogin from './components/officials/AuthoritiesLogin';
import AlertDetailsModal from './components/modals/AlertDetailsModal';
import SafetyGuideModal from './components/modals/SafetyGuideModal';
import DispatchModal from './components/modals/DispatchModal';
import ExplainableAiModal from './components/modals/ExplainableAiModal';
import { LOCATIONS } from './data/weatherData';
import { requestUserGeolocation, getCachedLocation } from './utils/geolocation';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('storms_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('storms_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const [activePortal, setActivePortal] = useState('citizen'); // 'citizen' (Public) | 'officials' (MoES-NCMRWF)
  const [activeLocation, setActiveLocation] = useState(() => {
    return getCachedLocation() || LOCATIONS[0];
  });
  const [currentTab, setCurrentTab] = useState('home');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsNotification, setGpsNotification] = useState(null);

  // Automatic GPS Geolocation on startup
  const handleDetectGps = async (showNotification = true) => {
    setIsLocatingGps(true);
    try {
      const loc = await requestUserGeolocation();
      setActiveLocation(loc);
      if (showNotification) {
        setGpsNotification({
          type: 'success',
          text: `📍 GPS Located: ${loc.name} (${loc.district})`,
        });
        setTimeout(() => setGpsNotification(null), 5000);
      }
      return loc;
    } catch (err) {
      console.warn('[App] Geolocation error:', err.message);
      if (showNotification) {
        setGpsNotification({
          type: 'error',
          text: err.message || 'Location access denied or unavailable.',
        });
        setTimeout(() => setGpsNotification(null), 6000);
      }
      throw err;
    } finally {
      setIsLocatingGps(false);
    }
  };

  useEffect(() => {
    // Attempt silent automatic browser geolocation on initial load
    if (typeof window !== 'undefined' && navigator && navigator.geolocation) {
      handleDetectGps(false).catch((e) => {
        console.log('[App] Auto-geolocation fallback to default station:', e.message);
      });
    }
  }, []);

  // Authorities authentication state
  const [isAuthoritiesAuth, setIsAuthoritiesAuth] = useState(() => {
    return localStorage.getItem('storms_officials_auth') === 'true';
  });
  const [authOfficer, setAuthOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem('storms_officer_info');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (officerData) => {
    setIsAuthoritiesAuth(true);
    setAuthOfficer(officerData);
    localStorage.setItem('storms_officials_auth', 'true');
    localStorage.setItem('storms_officer_info', JSON.stringify(officerData));
  };

  const handleLogout = () => {
    setIsAuthoritiesAuth(false);
    setAuthOfficer(null);
    localStorage.removeItem('storms_officials_auth');
    localStorage.removeItem('storms_officer_info');
    setActivePortal('citizen');
  };

  // Modal visibility states
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showXaiModal, setShowXaiModal] = useState(false);
  const [xaiRegion, setXaiRegion] = useState(LOCATIONS[0]);

  const handleOpenXai = (region) => {
    if (region) {
      setXaiRegion(region);
    } else {
      setXaiRegion(activeLocation);
    }
    setShowXaiModal(true);
  };

  return (
    <div className="app-container">
      {/* Top Fixed Navbar */}
      <Navbar 
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        activeLocation={activeLocation}
        setActiveLocation={setActiveLocation}
        locations={LOCATIONS}
        onOpenAlerts={() => setShowAlertModal(true)}
        notificationsCount={3}
        isAuthoritiesAuth={isAuthoritiesAuth}
        authOfficer={authOfficer}
        onLogout={handleLogout}
        onDetectGps={handleDetectGps}
        isLocatingGps={isLocatingGps}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Floating GPS Notification Toast */}
      {gpsNotification && (
        <div className={`gps-toast-banner ${gpsNotification.type}`}>
          <span>{gpsNotification.text}</span>
          <button 
            type="button" 
            className="gps-toast-close"
            onClick={() => setGpsNotification(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Body with Sidebar + Active View */}
      <div className="app-body-layout">
        {/* Only show sidebar if in citizen portal or if authenticated in officials portal */}
        {(activePortal === 'citizen' || isAuthoritiesAuth) && (
          <Sidebar 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            activeLocation={activeLocation}
            onLocationClick={() => setShowAlertModal(true)}
            onOpenAlerts={() => setShowAlertModal(true)}
            onOpenSafetyGuide={() => setShowSafetyModal(true)}
            activePortal={activePortal}
            onDetectGps={handleDetectGps}
            isLocatingGps={isLocatingGps}
          />
        )}

        <main className={`app-main-viewport ${activePortal === 'officials' && !isAuthoritiesAuth ? 'full-viewport-auth' : ''}`}>
          {activePortal === 'citizen' ? (
            <CitizenDashboard 
              activeLocation={activeLocation}
              setActiveLocation={setActiveLocation}
              onOpenAlertDetails={() => setShowAlertModal(true)}
              onOpenXai={handleOpenXai}
              onOpenSafetyGuide={() => setShowSafetyModal(true)}
              onDetectGps={handleDetectGps}
              isLocatingGps={isLocatingGps}
            />
          ) : !isAuthoritiesAuth ? (
            <AuthoritiesLogin 
              onLoginSuccess={handleLoginSuccess}
              onBackToCitizen={() => setActivePortal('citizen')}
            />
          ) : (
            <OfficialsDashboard 
              onOpenDispatchModal={() => setShowDispatchModal(true)}
              onOpenXaiModal={handleOpenXai}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              authOfficer={authOfficer}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AlertDetailsModal 
        isOpen={showAlertModal}
        activePortal={activePortal}
        onClose={() => setShowAlertModal(false)}
        activeLocation={activeLocation}
        onOpenXai={(reg) => {
          setShowAlertModal(false);
          handleOpenXai(reg || activeLocation);
        }}
        onViewOnMap={() => {
          setShowAlertModal(false);
          if (activePortal !== 'citizen') {
            setActivePortal('citizen');
          }
          const mapEl = document.querySelector('.weather-map-container, .map-viewport-wrapper, .citizen-main-content');
          if (mapEl) {
            mapEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <SafetyGuideModal 
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />

      <DispatchModal 
        isOpen={showDispatchModal}
        onClose={() => setShowDispatchModal(false)}
      />

      <ExplainableAiModal 
        isOpen={showXaiModal}
        onClose={() => setShowXaiModal(false)}
        region={xaiRegion || activeLocation}
        onSelectRegion={(reg) => setXaiRegion(reg)}
      />
    </div>
  );
}

export default App;
