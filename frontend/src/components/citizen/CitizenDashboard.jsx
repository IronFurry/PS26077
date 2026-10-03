import React from 'react';
import { Sun, Sunset, Moon, CloudSun } from 'lucide-react';
import WeatherMap from './WeatherMap';
import NextHoursForecast from './NextHoursForecast';
import YourAreaCard from './YourAreaCard';
import BottomBanner from './BottomBanner';
import RightAlertPanel from './RightAlertPanel';

function getTimeContext() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', icon: <Sun size={24} className="text-amber" /> };
  }
  if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', icon: <CloudSun size={24} className="text-amber" /> };
  }
  if (hour >= 17 && hour < 22) {
    return { text: 'Good evening', icon: <Sunset size={24} className="text-orange" /> };
  }
  return { text: 'Good night', icon: <Moon size={24} className="text-cyan" /> };
}

export default function CitizenDashboard({ 
  activeLocation, 
  setActiveLocation,
  onOpenAlertDetails, 
  onOpenXai, 
  onOpenSafetyGuide 
}) {
  const { text: greetingText, icon: greetingIcon } = getTimeContext();

  return (
    <div className="citizen-dashboard-layout">
      {/* Center Column: Greeting + Map + Next 3 Hours + Your Area + Safety Banner */}
      <div className="citizen-main-content">
        <div className="greeting-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {greetingIcon}
            <h1 className="greeting-title" style={{ margin: 0 }}>
              {greetingText}
            </h1>
          </div>
          <p className="greeting-subtitle">
            Here's what's happening in {activeLocation?.name || 'your area'}.
          </p>
        </div>

        {/* Map card */}
        <WeatherMap
          activeLocation={activeLocation}
          onSelectLocation={setActiveLocation}
          onOpenXai={onOpenXai}
        />

        {/* Grid with Next 3 Hours & Your Area */}
        <div className="forecast-and-area-grid">
          <NextHoursForecast activeLocation={activeLocation} />
          <YourAreaCard 
            activeLocation={activeLocation} 
            onOpenAlertDetails={onOpenAlertDetails} 
          />
        </div>

        {/* Bottom Banner */}
        <BottomBanner />
      </div>

      {/* Right Column: Conditions, Severe Alert, XAI, Checklist, Areas to Avoid */}
      <RightAlertPanel 
        activeLocation={activeLocation}
        onOpenAlertDetails={onOpenAlertDetails}
        onOpenXai={onOpenXai}
        onOpenSafetyGuide={onOpenSafetyGuide}
      />
    </div>
  );
}
