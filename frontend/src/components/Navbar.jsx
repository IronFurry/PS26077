import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Globe,
  Loader2,
  CheckCircle2,
  X,
  Compass,
  Crosshair,
  Sun,
  Moon
} from 'lucide-react';
import { searchLocationsOnline, directGeocode } from '../utils/geocoding';

export default function Navbar({ 
  activePortal, 
  setActivePortal, 
  activeLocation, 
  setActiveLocation, 
  locations = [],
  onOpenAlerts,
  notificationsCount = 3,
  isAuthoritiesAuth = false,
  authOfficer = null,
  onLogout,
  onDetectGps,
  isLocatingGps = false,
  theme = 'dark',
  onToggleTheme
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [onlineResults, setOnlineResults] = useState([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  const searchWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Local preset matches (instant, 0 latency)
  const localMatches = (locations || []).filter(loc =>
    !searchQuery ||
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.district && loc.district.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Combine local matches and online OSM results
  const allResults = [
    ...localMatches.map(loc => ({ ...loc, _source: 'local' })),
    ...onlineResults.map(loc => ({ ...loc, _source: 'online' }))
  ];

  // Debounced online search as user types
  useEffect(() => {
    const q = searchQuery.trim();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!q || q.length < 2) {
      setOnlineResults([]);
      setIsSearchingOnline(false);
      return;
    }

    setIsSearchingOnline(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchLocationsOnline(q);
        // Exclude any results that match already visible local zones
        const filteredOnline = results.filter(
          onl => !localMatches.some(loc => loc.name.toLowerCase() === onl.name.toLowerCase())
        );
        setOnlineResults(filteredOnline);
      } catch (err) {
        console.error('Online geocoding error:', err);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  // Reset highlight index when results change
  useEffect(() => {
    setHighlightedIdx(0);
  }, [searchQuery, onlineResults.length]);

  // Close dropdown on click outside
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

  // Select a location and notify map & dashboards
  const selectLocation = useCallback((loc) => {
    if (!loc) return;
    setActiveLocation(loc);
    setSearchQuery('');
    setOnlineResults([]);
    setShowDropdown(false);
    inputRef.current?.blur();
  }, [setActiveLocation]);

  // Handle direct Enter key submission: if user typed any place and pressed Enter
  const handleDirectSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    // 1. If currently highlighted item in dropdown exists, use it
    if (allResults[highlightedIdx]) {
      selectLocation(allResults[highlightedIdx]);
      return;
    }

    // 2. Direct online geocoding for the query
    setIsSearchingOnline(true);
    try {
      const match = await directGeocode(q);
      if (match) {
        selectLocation(match);
      }
    } catch (e) {
      console.error('Direct geocode error:', e);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setShowDropdown(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIdx(i => Math.min(i + 1, Math.max(0, allResults.length - 1)));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIdx(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        handleDirectSearch();
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
            <span className="brand-title">STORMS</span>
            <span className="brand-sub">Hyper-Local Nowcasting</span>
          </div>
        </div>

        {/* ---- Global Location Search Bar (Any City / Region / Address) ---- */}
        <div className="search-wrapper" ref={searchWrapperRef}>
          <Search size={15} className="search-icon" />

          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={activeLocation?.name ? `📍 ${activeLocation.name} (Search any location…)` : 'Search any city, district or location…'}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search any location worldwide"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          />

          {/* Activity indicator: Spinner if searching online, or Clear button */}
          <div className="search-input-actions">
            {isSearchingOnline ? (
              <Loader2 size={14} className="search-loading-spinner" />
            ) : searchQuery ? (
              <button
                className="search-clear-btn"
                onClick={() => { setSearchQuery(''); setOnlineResults([]); inputRef.current?.focus(); }}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            ) : null}

            {onDetectGps && (
              <button
                type="button"
                className={`search-gps-btn ${isLocatingGps ? 'locating' : ''} ${activeLocation?.isGps ? 'active-gps' : ''}`}
                onClick={async () => {
                  try {
                    await onDetectGps(true);
                  } catch (e) {
                    console.log('GPS error:', e);
                  }
                }}
                title="Detect my current location via GPS"
                aria-label="Detect my current location via GPS"
              >
                {isLocatingGps ? (
                  <Loader2 size={14} className="spin-fast text-cyan" />
                ) : (
                  <Crosshair size={14} />
                )}
              </button>
            )}
          </div>

          {/* Dropdown Results */}
          {showDropdown && (
            <div className="search-dropdown" role="listbox">
              
              {/* Quick GPS Geolocation Option */}
              {onDetectGps && (
                <div 
                  className={`search-dropdown-item gps-detect-item ${activeLocation?.isGps ? 'active' : ''}`}
                  onClick={async () => {
                    setShowDropdown(false);
                    try {
                      await onDetectGps(true);
                    } catch (e) {
                      console.log('GPS error:', e);
                    }
                  }}
                >
                  <div className="loc-info">
                    <div className="gps-icon-circle">
                      {isLocatingGps ? (
                        <Loader2 size={14} className="spin-fast text-cyan" />
                      ) : (
                        <Crosshair size={14} className="text-cyan" />
                      )}
                    </div>
                    <div className="loc-text-col">
                      <span className="loc-name">
                        {isLocatingGps ? 'Locating device via GPS satellites…' : 'Use Current Device Location'}
                      </span>
                      <span className="loc-district">
                        {activeLocation?.isGps 
                          ? `Currently set to: ${activeLocation.name} (±${activeLocation.accuracy || 25}m)`
                          : 'Detect exact coordinates & match nearest radar'}
                      </span>
                    </div>
                  </div>
                  <div className="loc-right">
                    <span className="gps-live-tag">
                      <span className="gps-pulse-dot"></span>
                      <span>{activeLocation?.isGps ? 'GPS ACTIVE' : 'GPS AUTO'}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* If no query, show quick suggestion header */}
              {!searchQuery && (
                <div className="dropdown-header">
                  Active Hazard Monitoring Zones
                </div>
              )}

              {/* Local Monitoring Zones */}
              {localMatches.length > 0 && (
                <div className="search-group">
                  {searchQuery && (
                    <div className="dropdown-sub-header">
                      <Radio size={12} className="text-red pulse-fast" />
                      <span>Nowcast Radar Zones</span>
                    </div>
                  )}
                  {localMatches.map((loc, idx) => {
                    const isSelected = activeLocation?.id === loc.id;
                    const isHighlighted = highlightedIdx === idx;
                    return (
                      <div
                        key={loc.id}
                        role="option"
                        aria-selected={isSelected}
                        className={`search-dropdown-item ${isSelected ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                        onMouseEnter={() => setHighlightedIdx(idx)}
                        onClick={() => selectLocation(loc)}
                      >
                        <div className="loc-info">
                          <MapPin size={14} className="pin-icon" />
                          <div className="loc-text-col">
                            <span className="loc-name">{loc.name}</span>
                            <span className="loc-district">{loc.district}</span>
                          </div>
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
                          {isSelected && (
                            <CheckCircle2 size={13} style={{ color: '#00d2ff', flexShrink: 0 }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Online OSM Geocoded Results (Any location worldwide) */}
              {onlineResults.length > 0 && (
                <div className="search-group">
                  <div className="dropdown-sub-header">
                    <Globe size={12} style={{ color: '#00d2ff' }} />
                    <span>OpenStreetMap Worldwide Places</span>
                  </div>
                  {onlineResults.map((loc, idx) => {
                    const combinedIdx = localMatches.length + idx;
                    const isSelected = activeLocation?.name === loc.name;
                    const isHighlighted = highlightedIdx === combinedIdx;
                    return (
                      <div
                        key={loc.id}
                        role="option"
                        aria-selected={isSelected}
                        className={`search-dropdown-item ${isSelected ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                        onMouseEnter={() => setHighlightedIdx(combinedIdx)}
                        onClick={() => selectLocation(loc)}
                      >
                        <div className="loc-info">
                          <Compass size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
                          <div className="loc-text-col">
                            <span className="loc-name">{loc.name}</span>
                            <span className="loc-district">{loc.district}</span>
                          </div>
                        </div>
                        <div className="loc-right">
                          <span className="search-badge-osm">Fly to Area</span>
                          {isSelected && (
                            <CheckCircle2 size={13} style={{ color: '#00d2ff', flexShrink: 0 }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No results empty state */}
              {allResults.length === 0 && !isSearchingOnline && (
                <div className="search-no-results" onClick={handleDirectSearch}>
                  <Compass size={16} style={{ opacity: 0.5, color: '#00d2ff' }} />
                  <div>
                    <span>Press <strong>Enter</strong> to search <strong>"{searchQuery}"</strong> globally</span>
                  </div>
                </div>
              )}

              {/* Bottom footer hint */}
              <div className="dropdown-footer">
                <span>{allResults.length} locations available</span>
                <span className="footer-keys">↑↓ Navigate • Enter to Fly • Esc to Close</span>
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
            {isAuthoritiesAuth ? (
              <span className="live-tag">LIVE OPS</span>
            ) : (
              <span className="live-tag lock-tag">🔒 LOGIN</span>
            )}
          </button>
        </div>

        {/* Notification Bell */}
        <button className="nav-icon-btn notification-btn" onClick={onOpenAlerts} title="Active Alerts">
          <Bell size={18} />
          {notificationsCount > 0 && (
            <span className="notification-badge">{notificationsCount}</span>
          )}
        </button>

        {/* Theme Mode Switcher (Dark / Light Theme Toggle) */}
        {onToggleTheme && (
          <button 
            className="nav-icon-btn theme-toggle-btn" 
            onClick={onToggleTheme} 
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle light or dark mode theme"
          >
            {theme === 'light' ? (
              <Moon size={18} style={{ color: '#0284c7' }} />
            ) : (
              <Sun size={18} style={{ color: '#fbbf24' }} />
            )}
          </button>
        )}

        {/* User Profile */}
        <div className="user-profile-menu-container">
          <button 
            className="user-profile-btn" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                alt="User" 
                className="avatar-img"
              />
              <span className="online-indicator"></span>
            </div>
            <span className="user-name">{isAuthoritiesAuth && authOfficer ? authOfficer.name : 'User'}</span>
            <ChevronDown size={14} className="chevron" />
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-card">
              <div className="profile-header">
                <strong>{isAuthoritiesAuth && authOfficer ? authOfficer.name : 'User'}</strong>
                <span>📍 {activeLocation?.name} ({activeLocation?.district || 'India'})</span>
                {isAuthoritiesAuth && authOfficer && (
                  <span style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', display: 'block' }}>
                    ● {authOfficer.clearance}
                  </span>
                )}
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
              {isAuthoritiesAuth && onLogout && (
                <button 
                  className="profile-item logout-item"
                  style={{ color: '#f87171' }}
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                >
                  <ShieldAlert size={15} />
                  <span>Log Out of MoES Authorities</span>
                </button>
              )}
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
