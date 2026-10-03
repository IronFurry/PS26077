import React from 'react';
import WeatherMap from './WeatherMap';
import NextHoursForecast from './NextHoursForecast';
import YourAreaCard from './YourAreaCard';
import BottomBanner from './BottomBanner';
import RightAlertPanel from './RightAlertPanel';

export default function CitizenDashboard({ 
  activeLocation, 
  onOpenAlertDetails, 
  onOpenXai, 
  onOpenSafetyGuide 
}) {
  return (
    <div className="citizen-dashboard-layout">
      {/* Center Column: Greeting + Map + Next 3 Hours + Your Area + Safety Banner */}
      <div className="citizen-main-content">
        <div className="greeting-header">
          <h1 className="greeting-title">
            Good evening, Aryan <span className="wave-hand">👋</span>
          </h1>
          <p className="greeting-subtitle">
            Here's what's happening in your area.
          </p>
        </div>

        {/* Map card */}
        <WeatherMap activeLocation={activeLocation} />

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
