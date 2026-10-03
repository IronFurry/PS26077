import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CitizenDashboard from './components/citizen/CitizenDashboard';
import OfficialsDashboard from './components/officials/OfficialsDashboard';
import AlertDetailsModal from './components/modals/AlertDetailsModal';
import SafetyGuideModal from './components/modals/SafetyGuideModal';
import DispatchModal from './components/modals/DispatchModal';
import ExplainableAiModal from './components/modals/ExplainableAiModal';
import { LOCATIONS } from './data/weatherData';
import './App.css';

function App() {
  const [activePortal, setActivePortal] = useState('citizen'); // 'citizen' (Public) | 'officials' (MoES-NCMRWF)
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]); // Default Vasai Gaon
  const [currentTab, setCurrentTab] = useState('home');

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
      />

      {/* Main Body with Sidebar + Active View */}
      <div className="app-body-layout">
        <Sidebar 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeLocation={activeLocation}
          onLocationClick={() => setShowAlertModal(true)}
          onOpenAlerts={() => setShowAlertModal(true)}
          onOpenSafetyGuide={() => setShowSafetyModal(true)}
          activePortal={activePortal}
        />

        <main className="app-main-viewport">
          {activePortal === 'citizen' ? (
            <CitizenDashboard 
              activeLocation={activeLocation}
              setActiveLocation={setActiveLocation}
              onOpenAlertDetails={() => setShowAlertModal(true)}
              onOpenXai={handleOpenXai}
              onOpenSafetyGuide={() => setShowSafetyModal(true)}
            />
          ) : (
            <OfficialsDashboard 
              onOpenDispatchModal={() => setShowDispatchModal(true)}
              onOpenXaiModal={handleOpenXai}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AlertDetailsModal 
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        activeLocation={activeLocation}
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
