import React, { useState, useRef, useEffect } from 'react';
import { 
  CloudRain, 
  Search, 
  Bell, 
  ShieldAlert, 
  User, 
  ChevronDown, 
  Radio, 
  ExternalLink,
  MapPin,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Navbar({ 
  activePortal, 
  setActivePortal, 
  activeLocation, 
  setActiveLocation, 
  locations,
  onOpenAlerts,
  notificationsCount = 3 
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchWrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Filter locations by query
  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset highlight when filter changes
  useEffect(() => {
    setHighlightedIdx(0);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (showProfileMenu && !e.target.closest('.user-profile-menu-container')) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const selectLocation = (loc) => {
    setActiveLocation(loc);
    setSearchQuery('');
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIdx(i => Math.min(i + 1, filteredLocations.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIdx(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredLocations[highlightedIdx]) {
          selectLocation(filteredLocations[highlightedIdx]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const riskColor = {
    'Severe': '#ef4444',
    'High': '#f97316',
    'Heavy': '#f59e0b',
    'Moderate': '#eab308',
    'Low': '#10b981',
  };

  return (
    <header className="navbar-container">
      {/* Brand Logo */}
      <div className="navbar-left">
        <div className="brand-logo" onClick={() => setActivePortal('citizen')}>
          <div className="logo-icon-wrap">
            <svg className="cloud-lightning-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.5 14.5C24.8 9.8 20.8 6.2 16 6.2C12.1 6.2 8.7 8.5 7.1 11.8C3.1 12.3 0 15.8 0 20C0 24.4 3.6 28 8 28H25C28.9 28 32 24.9 32 21C32 17.4 29.3 14.8 25.5 14.5Z" fill="#2563EB" opacity="0.35"/>
              <path d="M23.5 15C22.9 11.2 19.6 8.2 15.6 8.2C12.4 8.2 9.7 10.1 8.3 12.8C5 13.2 2.5 16 2.5 19.5C2.5 23.1 5.4 26 9 26H23C26.3 26 29 23.3 29 20C29 16.9 26.7 14.8 23.5 15Z" fill="#3B82F6"/>
              <path d="M14.5 14L10 21.5H15L13.5 26.5L19.5 18.5H15L16.5 14H14.5Z" fill="#00D2FF"/>
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-title">SkyWatch</span>
            <span className="brand-sub">Hyper-Local Nowcasting</span>
          </div>
        </div>

        {/* ---- Functional Location Search Bar ---- */}
        <div className="search-wrapper" ref={searchWrapperRef}>
          <Search size={15} className="search-icon" />

          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={`📍 ${activeLocation?.name ?? 'Search location…'}`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search monitoring location"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          />

          {/* Clear button — shows when there's a query */}
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}

          {/* Dropdown results */}
          {showDropdown && (
            <div className="search-dropdown" role="listbox">
              <div className="dropdown-header">
                Nowcast Monitoring Zones — 2 to 6h Lead Time
              </div>

              {filteredLocations.length === 0 ? (
                <div className="search-no-results">
                  <Search size={16} style={{ opacity: 0.4 }} />
                  <span>No locations found for "<strong>{searchQuery}</strong>"</span>
                </div>
              ) : (
                filteredLocations.map((loc, idx) => (
                  <div
                    key={loc.id}
                    role="option"
                    aria-selected={activeLocation?.id === loc.id}
                    className={`search-dropdown-item 
                      ${activeLocation?.id === loc.id ? 'active' : ''} 
                      ${highlightedIdx === idx ? 'highlighted' : ''}`}
                    onMouseEnter={() => setHighlightedIdx(idx)}
                    onClick={() => selectLocation(loc)}
                  >
                    <div className="loc-info">
                      <MapPin size={13} className="pin-icon" />
                      <span className="loc-name">{loc.name}</span>
                      <span className="loc-district">{loc.district}</span>
                    </div>
                    <div className="loc-right">
                      <span
                        className="risk-pill"
                        style={{
                          background: `${riskColor[loc.risk] ?? '#6b7280'}22`,
                          color: riskColor[loc.risk] ?? '#6b7280',
                          border: `1px solid ${riskColor[loc.risk] ?? '#6b7280'}55`,
                        }}
                      >
                        {loc.risk}
                      </span>
                      {activeLocation?.id === loc.id && (
                        <CheckCircle2 size={13} style={{ color: '#00d2ff', flexShrink: 0 }} />
                      )}
                    </div>
                  </div>
                ))
              )}

              <div className="dropdown-footer">
                {filteredLocations.length} zone{filteredLocations.length !== 1 ? 's' : ''} • ↑↓ navigate • Enter to select • Esc to close
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portal Switcher & Action Tools */}
      <div className="navbar-right">
        <div className="portal-switcher-pill">
          <button 
            className={`portal-tab ${activePortal === 'citizen' ? 'active' : ''}`}
            onClick={() => setActivePortal('citizen')}
            title="Citizen & Public Weather Forecast view"
          >
            <span className="dot citizen-dot"></span>
            <span>Citizen Portal</span>
          </button>
          
          <button 
            className={`portal-tab ${activePortal === 'officials' ? 'active' : ''}`}
            onClick={() => setActivePortal('officials')}
            title="MoES & NCMRWF Disaster Management Authorities view"
          >
            <ShieldAlert size={14} className="officials-icon" />
            <span>Authorities / MoES</span>
            <span className="live-tag">LIVE OPS</span>
          </button>
        </div>

        {/* Notification Bell */}
        <button className="nav-icon-btn notification-btn" onClick={onOpenAlerts} title="Active Alerts">
          <Bell size={18} />
          {notificationsCount > 0 && (
            <span className="notification-badge">{notificationsCount}</span>
          )}
        </button>

        {/* User Profile */}
        <div className="user-profile-menu-container">
          <button 
            className="user-profile-btn" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                alt="Aryan Kate" 
                className="avatar-img"
              />
              <span className="online-indicator"></span>
            </div>
            <span className="user-name">Aryan Kate</span>
            <ChevronDown size={14} className="chevron" />
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-card">
              <div className="profile-header">
                <strong>Aryan Kate</strong>
                <span>📍 {activeLocation?.name} ({activeLocation?.district})</span>
              </div>
              <div className="profile-divider"></div>
              <button 
                className="profile-item"
                onClick={() => {
                  setActivePortal(activePortal === 'citizen' ? 'officials' : 'citizen');
                  setShowProfileMenu(false);
                }}
              >
                <ShieldAlert size={15} />
                Switch to {activePortal === 'citizen' ? 'MoES Officials Ops' : 'Citizen Public View'}
              </button>
              <button className="profile-item" onClick={() => setShowProfileMenu(false)}>
                <MapPin size={15} />
                Zone: {activeLocation?.name}
              </button>
              <div className="profile-divider"></div>
              <div className="profile-footer-tag">
                MoES • NCMRWF Hackathon 2026
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
