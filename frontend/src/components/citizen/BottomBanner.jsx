import React, { useState } from 'react';
import { SunMedium, Bell, Check, BellRing } from 'lucide-react';

export default function BottomBanner() {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    setEnabled(!enabled);
  };

  return (
    <div className="bottom-safety-banner">
      <div className="banner-left-info">
        <div className="banner-sun-icon-box">
          <SunMedium size={24} className="sun-icon" />
        </div>
        <div className="banner-text-content">
          <h4 className="banner-headline">Stay informed. Stay safe.</h4>
          <p className="banner-subtext">
            Real-time weather updates and location-based alerts for your safety.
          </p>
        </div>
      </div>

      <button 
        className={`banner-cta-btn ${enabled ? 'enabled' : ''}`}
        onClick={handleToggle}
      >
        {enabled ? (
          <>
            <Check size={16} />
            <span>Notifications Active</span>
          </>
        ) : (
          <>
            <BellRing size={16} />
            <span>Enable Notifications</span>
          </>
        )}
      </button>
    </div>
  );
}
