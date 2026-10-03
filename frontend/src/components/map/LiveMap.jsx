import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
  Tooltip,
  ZoomControl,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's broken default marker icon paths in Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ============================================================
// Custom SVG icons
// ============================================================
const createPulseIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="position:relative; width:24px; height:24px;">
    <div style="
      position:absolute; top:0; left:0;
      width:24px; height:24px;
      border-radius:50%; background:${color};
      opacity:0.35;
      animation: leaflet-pulse 2s infinite;
    "></div>
    <div style="
      position:absolute; top:6px; left:6px;
      width:12px; height:12px;
      background:${color};
      border:2.5px solid #ffffff;
      border-radius:50%;
      box-shadow: 0 0 10px ${color};
    "></div>
  </div>
  <style>
    @keyframes leaflet-pulse {
      0%,100% { transform:scale(0.9); opacity:0.35; }
      50% { transform:scale(1.6); opacity:0.1; }
    }
  </style>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const createColoredIcon = (color, size = 14) => L.divIcon({
  className: '',
  html: `<div style="
    width:${size}px; height:${size}px;
    background:${color};
    border: 2.5px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 14px ${color}, 0 0 4px rgba(0,0,0,0.6);
  "></div>`,
  iconSize: [size, size],
  iconAnchor: [size / 2, size / 2],
});

// Animated blue dot for user's live GPS location
const createUserIcon = () => L.divIcon({
  className: '',
  html: `<div style="position:relative; width:32px; height:32px;">
    <div style="
      position:absolute; top:0; left:0;
      width:32px; height:32px;
      border-radius:50%; background:#3b82f6;
      opacity:0.2;
      animation: user-pulse 2.5s infinite;
    "></div>
    <div style="
      position:absolute; top:4px; left:4px;
      width:24px; height:24px;
      border-radius:50%; background:#3b82f6;
      opacity:0.15;
      animation: user-pulse 2.5s 0.5s infinite;
    "></div>
    <div style="
      position:absolute; top:10px; left:10px;
      width:12px; height:12px;
      background:#3b82f6;
      border:3px solid #ffffff;
      border-radius:50%;
      box-shadow: 0 0 20px #3b82f6, 0 2px 6px rgba(0,0,0,0.6);
    "></div>
  </div>
  <style>
    @keyframes user-pulse {
      0%,100% { transform:scale(0.9); opacity:0.2; }
      50%      { transform:scale(1.5); opacity:0.05; }
    }
  </style>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// ============================================================
// Hazard Zone Data (Vasai-Virar coastal region)
// ============================================================
const HAZARD_ZONES = [
  {
    id: 'vasai',
    name: 'Vasai West (Gaon)',
    position: [19.3639, 72.8093],
    risk: 87,
    riskLevel: 'Severe',
    color: '#ef4444',
    eta: '45 min',
    confidence: '91%',
    description: 'Extreme moisture accumulation detected. Cloudburst core forming over the coastline.',
    precursors: { iwv: '62.8 mm ↑', cape: '3,240 J/kg', ctt: '-19.4°C/15m' },
    radius: 4500,
  },
  {
    id: 'nalasopara',
    name: 'Nalasopara West',
    position: [19.4167, 72.7989],
    risk: 93,
    riskLevel: 'Extreme',
    color: '#f97316',
    eta: '30 min',
    confidence: '94%',
    description: 'Severe cloudburst core centered. Low-lying subway flooding imminent.',
    precursors: { iwv: '64.2 mm ↑', cape: '3,410 J/kg', ctt: '-21.8°C/15m' },
    radius: 4000,
  },
  {
    id: 'virar',
    name: 'Virar South',
    position: [19.4700, 72.8000],
    risk: 76,
    riskLevel: 'High',
    color: '#f59e0b',
    eta: '1h 15m',
    confidence: '86%',
    description: 'Orographic enhancement along the Western Ghats foothills. Secondary cells developing.',
    precursors: { iwv: '58.4 mm ↑', cape: '2,920 J/kg', ctt: '-16.2°C/15m' },
    radius: 3500,
  },
  {
    id: 'mira-bhayandar',
    name: 'Mira-Bhayandar',
    position: [19.2977, 72.8540],
    risk: 62,
    riskLevel: 'Moderate',
    color: '#eab308',
    eta: '2h 00m',
    confidence: '78%',
    description: 'Moderate heavy rain from northwest. Creek backwater surge watch in effect.',
    precursors: { iwv: '54.1 mm ↑', cape: '2,480 J/kg', ctt: '-12.5°C/15m' },
    radius: 3000,
  },
  {
    id: 'thane',
    name: 'Thane North',
    position: [19.2183, 72.9781],
    risk: 55,
    riskLevel: 'Moderate',
    color: '#10b981',
    eta: '2h 30m',
    confidence: '72%',
    description: 'Residual shower activity from the offshore convective cluster.',
    precursors: { iwv: '50.8 mm ↑', cape: '2,140 J/kg', ctt: '-10.2°C/15m' },
    radius: 2800,
  },
];

// Drainage channels
const VASAI_CREEK_PATH = [
  [19.41, 72.80], [19.38, 72.81], [19.36, 72.82], [19.32, 72.83],
  [19.29, 72.84], [19.26, 72.85], [19.24, 72.85],
];
const ULHAS_RIVER = [
  [19.37, 72.96], [19.36, 72.92], [19.35, 72.89], [19.34, 72.86],
  [19.33, 72.84], [19.32, 72.83],
];
// Storm front boundary (moving onshore from Arabian Sea)
const STORM_FRONT = [
  [19.60, 72.65], [19.50, 72.72], [19.42, 72.76],
  [19.38, 72.79], [19.30, 72.78], [19.20, 72.77], [19.12, 72.80],
];

// ============================================================
// Default region center (Vasai-Virar area)
// ============================================================
const DEFAULT_CENTER = [19.38, 72.83];
const DEFAULT_ZOOM = 11;

// No external weather data layers — clean OSM-based map only

// ============================================================
// Sub-components
// ============================================================

/** Fly to a position smoothly when it changes */
function FlyToLocation({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom || DEFAULT_ZOOM, { duration: 1.6 });
    }
  }, [position, zoom, map]);
  return null;
}

/** Fit bounds to the whole Vasai-Virar coastal cluster on first load */
function FitBoundsOnLoad({ userLocated }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (!fitted.current && !userLocated) {
      map.fitBounds([[19.15, 72.73], [19.54, 72.97]], { padding: [20, 20] });
      fitted.current = true;
    }
  }, [map, userLocated]);
  return null;
}

/** Legend overlay — rendered as a positioned div over the map */
function RiskLegend() {
  return (
    <div className="leaflet-risk-legend">
      <div className="legend-title">HAZARD INTENSITY</div>
      {[
        { label: 'Extreme (>90%)', color: '#f97316' },
        { label: 'Severe (70-90%)', color: '#ef4444' },
        { label: 'High (55-70%)', color: '#f59e0b' },
        { label: 'Moderate (40-55%)', color: '#eab308' },
        { label: 'Low (<40%)', color: '#10b981' },
      ].map(item => (
        <div className="legend-row-item" key={item.label}>
          <span className="legend-color-dot" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Main LiveMap Component
// ============================================================
export default function LiveMap({ activeLocation, portalMode = 'citizen', onSelectZone }) {
  const [mapStyle, setMapStyle] = useState('standard');
  const [selectedZoneId, setSelectedZoneId] = useState('vasai');

  // User geolocation state
  const [userPosition, setUserPosition] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle'); // 'idle'|'loading'|'ok'|'denied'|'unavailable'
  const [flyTo, setFlyTo] = useState(null);

  const activeZone = HAZARD_ZONES.find(z => z.id === selectedZoneId) || HAZARD_ZONES[0];

  const handleZoneClick = (zone) => {
    setSelectedZoneId(zone.id);
    if (onSelectZone) onSelectZone(zone);
  };

  // ---- Geolocation ----
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('unavailable');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latLng = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(latLng);
        setGeoStatus('ok');
        setFlyTo({ pos: latLng, zoom: 14 });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setGeoStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Auto-locate on first mount
  useEffect(() => {
    locateUser();
  }, [locateUser]);

  // ---- Fly to selected location when user picks from search bar or officials click region ----
  useEffect(() => {
    if (!activeLocation) return;
    let lat = null;
    let lon = null;
    let zoneId = null;

    if (typeof activeLocation === 'string') {
      zoneId = activeLocation;
      const matchingZone = HAZARD_ZONES.find(z => z.id.toLowerCase() === zoneId.toLowerCase());
      if (matchingZone) {
        lat = matchingZone.position[0];
        lon = matchingZone.position[1];
        setSelectedZoneId(matchingZone.id);
      }
    } else if (typeof activeLocation === 'object') {
      lat = activeLocation.lat;
      lon = activeLocation.lon;
      zoneId = activeLocation.id;
      const matchingZone = HAZARD_ZONES.find(z => z.id === zoneId);
      if (matchingZone) setSelectedZoneId(matchingZone.id);
    }

    if (lat && lon) {
      setFlyTo({ pos: [lat, lon], zoom: 13 });
    }
  }, [activeLocation]);

  // ---- Base tile sources (Standard normal map, Satellite, Terrain) ----
  const tileSources = {
    standard: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri — Source: Esri, USDA, USGS, AEX, GeoEye & GIS Community',
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
    },
  };

  const activeTile = tileSources[mapStyle] || tileSources.standard;

  // Geo status label helper
  const geoLabel = {
    idle: '📍 Locate Me',
    loading: '⟳ Locating…',
    ok: '📍 Located',
    denied: '🚫 Access Denied',
    unavailable: '⚠ Unavailable',
  }[geoStatus];

  return (
    <div className={`live-map-wrapper ${portalMode === 'officials' ? 'officials-map-wrapper' : ''}`}>

      {/* ---- Toolbar ---- */}
      <div className="map-toolbar">
        {/* Base map switcher */}
        <div className="toolbar-group">
          {[
            { id: 'standard', label: 'Standard Map' },
            { id: 'satellite', label: 'Satellite' },
            { id: 'terrain', label: 'Terrain' },
          ].map(s => (
            <button
              key={s.id}
              className={`map-toolbar-btn ${mapStyle === s.id ? 'active' : ''}`}
              onClick={() => setMapStyle(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* User location button */}
        <div className="toolbar-group">
          <button
            className={`map-toolbar-btn ${geoStatus === 'ok' ? 'active' : ''}`}
            onClick={locateUser}
            disabled={geoStatus === 'loading'}
            title="Use your browser's GPS to find your location"
          >
            {geoLabel}
          </button>
        </div>

        {/* Live tag */}
        <div className="toolbar-live-tag">
          <span className="toolbar-live-dot" />
          <span>LIVE DATA</span>
        </div>
      </div>

      {/* ---- Leaflet Map ---- */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        className="leaflet-map-container"
        style={{ height: '100%', width: '100%' }}
      >
        <FitBoundsOnLoad userLocated={!!userPosition} />
        {flyTo && <FlyToLocation position={flyTo.pos} zoom={flyTo.zoom} />}
        <ZoomControl position="bottomright" />

        {/* Base tile layer */}
        <TileLayer
          url={activeTile.url}
          attribution={activeTile.attribution}
          maxZoom={19}
        />

        {/* Drainage channels */}
        <Polyline positions={VASAI_CREEK_PATH} pathOptions={{ color: '#38bdf8', weight: 3, opacity: 0.7, dashArray: '6 3' }}>
          <Tooltip sticky>🏞 Vasai Creek — Flash Flood Drainage Channel</Tooltip>
        </Polyline>
        <Polyline positions={ULHAS_RIVER} pathOptions={{ color: '#60a5fa', weight: 2.5, opacity: 0.65, dashArray: '5 3' }}>
          <Tooltip sticky>🌊 Ulhas River — Tidal Backwater Risk</Tooltip>
        </Polyline>

        {/* Active storm front */}
        <Polyline
          positions={STORM_FRONT}
          pathOptions={{ color: '#ef4444', weight: 3, opacity: 0.75, dashArray: '10 6' }}
        >
          <Tooltip sticky direction="top">
            <strong style={{ color: '#ef4444' }}>⛈ Active Storm Front</strong><br />
            Moving ENE at ~22 km/h &bull; ETA Vasai: 45 min
          </Tooltip>
        </Polyline>

        {/* Hazard zones */}
        {HAZARD_ZONES.map(zone => (
          <React.Fragment key={zone.id}>
            <Circle
              center={zone.position}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: selectedZoneId === zone.id ? 0.18 : 0.08,
                weight: selectedZoneId === zone.id ? 2.5 : 1.5,
                opacity: selectedZoneId === zone.id ? 0.9 : 0.5,
                dashArray: '6 4',
              }}
              eventHandlers={{ click: () => handleZoneClick(zone) }}
            />
            <Marker
              position={zone.position}
              icon={selectedZoneId === zone.id ? createPulseIcon(zone.color) : createColoredIcon(zone.color)}
              eventHandlers={{ click: () => handleZoneClick(zone) }}
            >
              <Popup className="hazard-popup" maxWidth={300}>
                <div className="popup-header" style={{ borderLeft: `4px solid ${zone.color}` }}>
                  <strong style={{ color: zone.color }}>{zone.name}</strong>
                  <span className="popup-risk-badge" style={{ background: zone.color }}>{zone.risk}% Risk</span>
                </div>
                <div className="popup-body">
                  <div className="popup-stat-row"><span>Risk Level:</span><strong style={{ color: zone.color }}>{zone.riskLevel}</strong></div>
                  <div className="popup-stat-row"><span>ETA to Impact:</span><strong>{zone.eta}</strong></div>
                  <div className="popup-stat-row"><span>AI Confidence:</span><strong>{zone.confidence}</strong></div>
                  <p className="popup-desc">{zone.description}</p>
                  <div className="popup-precursor-row">
                    <span>IWV: <strong style={{ color: '#00d2ff' }}>{zone.precursors.iwv}</strong></span>
                    <span>CAPE: <strong style={{ color: '#f59e0b' }}>{zone.precursors.cape}</strong></span>
                    <span>CTT: <strong style={{ color: '#ef4444' }}>{zone.precursors.ctt}</strong></span>
                  </div>
                </div>
              </Popup>
              <Tooltip direction="top" permanent={zone.risk >= 85 && portalMode === 'officials'}>
                <span style={{ fontWeight: 700 }}>{zone.name}</span><br />
                <span style={{ color: zone.color }}>Risk: {zone.risk}%</span> &bull; ETA: {zone.eta}
              </Tooltip>
            </Marker>
          </React.Fragment>
        ))}

        {/* User's actual GPS location */}
        {userPosition && (
          <Marker position={userPosition} icon={createUserIcon()} zIndexOffset={2000}>
            <Popup>
              <div className="popup-header" style={{ borderLeft: '4px solid #3b82f6' }}>
                <strong style={{ color: '#3b82f6' }}>📍 Your Location</strong>
              </div>
              <div className="popup-body">
                <div className="popup-stat-row">
                  <span>Latitude:</span>
                  <strong>{userPosition[0].toFixed(5)}°N</strong>
                </div>
                <div className="popup-stat-row">
                  <span>Longitude:</span>
                  <strong>{userPosition[1].toFixed(5)}°E</strong>
                </div>
                <p className="popup-desc" style={{ color: '#f59e0b' }}>
                  ⚠ You are within an active hazard monitoring zone. Stay alert for emergency broadcasts.
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Geo status toast */}
        {geoStatus === 'denied' && (
          <div className="geo-denied-toast">
            🚫 Location access denied. Enable GPS in your browser settings.
          </div>
        )}
      </MapContainer>

      {/* Legend */}
      <RiskLegend />

      {/* Selected zone info strip */}
      <div className="map-selected-zone-strip">
        <div className="selected-zone-info">
          <span className="zone-dot" style={{ background: activeZone.color }} />
          <strong>{activeZone.name}</strong>
          <span className="zone-risk-text" style={{ color: activeZone.color }}>{activeZone.risk}% Risk</span>
          <span className="zone-separator">•</span>
          <span>ETA: <strong>{activeZone.eta}</strong></span>
          <span className="zone-separator">•</span>
          <span>Radius: {(activeZone.radius / 1000).toFixed(1)} km</span>
        </div>
        <div className="zone-coord-tag">
          {userPosition
            ? `Your GPS: ${userPosition[0].toFixed(4)}°N, ${userPosition[1].toFixed(4)}°E`
            : `${activeZone.position[0].toFixed(4)}°N, ${activeZone.position[1].toFixed(4)}°E`}
        </div>
      </div>
    </div>
  );
}
