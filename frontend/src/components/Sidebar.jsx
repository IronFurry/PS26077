import React from 'react';
import { 
  Home, 
  Map, 
  AlertTriangle, 
  BookOpen, 
  Settings, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Activity,
  Crosshair
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  activeLocation, 
  onLocationClick,
  onOpenAlerts,
  onOpenSafetyGuide,
  activePortal,
  onDetectGps,
  isLocatingGps = false
}) {
  const citizenNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Live Weather Map', icon: Map },
    { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle, badge: 3 },
    { id: 'safety', label: 'Safety Guidelines', icon: BookOpen },
  ];

  const officialsNavItems = [
    { id: 'home', label: 'Command Center', icon: Activity },
    { id: 'mtl-maps', label: 'MTL Risk Grids', icon: Map },
    { id: 'alerts', label: 'Alert Dispatch', icon: AlertTriangle, badge: 'LIVE' },
    { id: 'xai', label: 'Explainable AI', icon: ShieldCheck },
    { id: 'settings', label: 'Sensors / IMDAA', icon: Settings },
  ];

  const navItems = activePortal === 'officials' ? officialsNavItems : citizenNavItems;

  const handleNavClick = (id) => {
    if (id === 'alerts') {
      onOpenAlerts();
    } else if (id === 'safety') {
      onOpenSafetyGuide();
    } else if (id === 'map') {
      setCurrentTab('map');
      const mapEl = document.querySelector('#live-weather-map-section, .weather-map-card, .weather-map-container, .risk-map-container');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (id === 'home') {
      setCurrentTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentTab(id);
    }
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <div className="nav-btn-content">
                <Icon size={19} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`sidebar-badge ${typeof item.badge === 'number' ? 'sidebar-badge-count' : 'sidebar-badge-live'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="sidebar-bottom-section">
        {/* Location selector card */}
        <div 
          className={`sidebar-location-card ${activeLocation?.isGps ? 'gps-active-card' : ''}`} 
          onClick={async () => {
            if (onDetectGps) {
              try {
                await onDetectGps(true);
                return;
              } catch {}
            }
            if (onLocationClick) onLocationClick();
          }}
          title="Click to detect device GPS location or view alert details"
        >
          <div className="location-pin-icon">
            {isLocatingGps ? (
              <Crosshair size={16} className="spin-fast text-cyan" />
            ) : activeLocation?.isGps ? (
              <Crosshair size={16} className="text-cyan" />
            ) : (
              <MapPin size={16} />
            )}
          </div>
          <div className="location-info">
            <span className="location-sub">
              {activeLocation?.isGps ? 'GPS Location' : 'Your location'}
            </span>
            <span className="location-title">{activeLocation?.name || 'Vasai Gaon'}</span>
          </div>
          <ChevronRight size={15} className="location-chevron" />
        </div>

        {/* Tagline */}
        <div className="sidebar-tagline-block">
          <p className="tagline-line1">Smarter forecasts.</p>
          <p className="tagline-line2">Safer communities.</p>
        </div>

        {/* Mountain Contour SVG background art */}
        <div className="sidebar-contour-graphic" aria-hidden="true">
          <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 65L30 45L70 58L120 30L160 50L200 35V80H0V65Z" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" fill="none"/>
            <path d="M0 72L45 52L90 62L140 42L180 58L200 50V80H0V72Z" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none"/>
          </svg>
        </div>
      </div>
    </aside>
  );
}
