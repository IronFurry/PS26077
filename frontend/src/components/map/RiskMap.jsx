import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Map, { NavigationControl, Marker, Source, Layer } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Play, Pause, Navigation, Clock } from 'lucide-react';
import { LOCATIONS } from '../../data/weatherData';
import { getNowcastFrame, RISK_ZONE_POLYGONS, FORECAST_STEPS } from '../../data/mockNowcast';

// Configure MapLibre Web Worker URL for Vite
if (typeof window !== 'undefined' && maplibregl.setWorkerUrl) {
  maplibregl.setWorkerUrl(maplibreWorkerUrl);
}

// Basemap Definitions: Dark (CARTO Dark Matter), Light (CARTO Voyager), Satellite (Esri World Imagery)
const BASEMAPS = {
  dark: {
    id: 'dark',
    label: 'Dark',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  },
  light: {
    id: 'light',
    label: 'Light',
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    style: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        },
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
};

/**
 * Maps risk string to color tokens from App.css
 */
function getRiskColor(risk) {
  if (!risk) return '#3b82f6';
  const r = String(risk).toLowerCase();
  if (r.includes('extreme') || r.includes('severe') || r === 'critical') return '#ef4444';
  if (r.includes('heavy') || r.includes('high')) return '#f97316';
  if (r.includes('moderate') || r.includes('medium')) return '#eab308';
  if (r.includes('low')) return '#10b981';
  return '#3b82f6';
}

/**
 * Reusable RiskMap Component for SkyWatch
 * @param {'citizen' | 'officials'} mode - Dashboard display mode
 * @param {Object | string} activeLocation - Current location object or location ID
 * @param {Array} locations - List of locations (defaults to LOCATIONS)
 * @param {Function} onSelectLocation - Callback when a location is selected
 * @param {Function} onOpenXai - Callback to open XAI panel for region
 */
export default function RiskMap({
  mode = 'citizen',
  activeLocation,
  locations = LOCATIONS,
  onSelectLocation,
  onOpenXai,
  className = '',
  style = {},
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [cursor, setCursor] = useState('grab');

  // Basemap Switcher (Default: Dark)
  const [basemap, setBasemap] = useState('dark');

  // Citizen Overlay State (Default: 'radar' with rain storm cell visible on load)
  const [activeLayer, setActiveLayer] = useState('radar');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeStep, setTimeStep] = useState(0);

  // Terrain & 3D Mode State (default OFF for 3D)
  const [showTerrain, setShowTerrain] = useState(false);
  const [is3D, setIs3D] = useState(false);

  // Handle 3D mode toggle (terrain mesh + pitch 55° / reset to 0°)
  useEffect(() => {
    const map = mapRef.current?.getMap ? mapRef.current.getMap() : mapRef.current;
    if (!map) return;

    const update3D = () => {
      try {
        if (is3D) {
          if (map.getSource && map.getSource('terrain-dem')) {
            map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 });
          }
          map.easeTo({ pitch: 55, duration: 1000 });
        } else {
          map.setTerrain?.(null);
          map.easeTo({ pitch: 0, duration: 1000 });
        }
      } catch (err) {
        console.warn('3D Terrain toggle error:', err);
      }
    };

    if (map.isStyleLoaded && map.isStyleLoaded()) {
      update3D();
    } else if (map.once) {
      map.once('style.load', update3D);
    }
  }, [is3D, basemap]);

  // Resolve current active location object from prop
  const currentActive = useMemo(() => {
    if (!activeLocation) return locations[0];
    if (typeof activeLocation === 'string') {
      const match = locations.find((l) => l.id.toLowerCase() === activeLocation.toLowerCase());
      return match || locations[0];
    }
    if (activeLocation.lat != null && activeLocation.lon != null) {
      return activeLocation;
    }
    if (activeLocation.id) {
      const match = locations.find((l) => l.id.toLowerCase() === activeLocation.id.toLowerCase());
      return match || locations[0];
    }
    return locations[0];
  }, [activeLocation, locations]);

  // Initial view coordinates at zoom 11.5
  const [initialViewState] = useState(() => ({
    longitude: currentActive?.lon ?? 72.8093,
    latitude: currentActive?.lat ?? 19.3639,
    zoom: 11.5,
  }));

  // Fly to active location, accounting for pitch so pin is visually centered
  const flyToActive = useCallback(() => {
    const map = mapRef.current?.getMap ? mapRef.current.getMap() : mapRef.current;
    if (!map || !currentActive) return;
    const { lat, lon } = currentActive;
    if (lat != null && lon != null) {
      const currentPitch = is3D ? 55 : (map.getPitch ? map.getPitch() : 0);
      // In 3D perspective pitch, visual ground center is lower.
      // Offset of [0, 42] brings the target pin into the visual optical center.
      const pitchOffset = currentPitch > 20 ? 42 : 0;

      map.flyTo({
        center: [lon, lat],
        zoom: 11.5,
        offset: [0, pitchOffset],
        pitch: is3D ? 55 : currentPitch,
        duration: 1100,
        essential: true,
      });
    }
  }, [currentActive, is3D]);

  // Fly to location on load and when activeLocation or 3D changes
  useEffect(() => {
    const timer = setTimeout(() => {
      flyToActive();
    }, 150);
    return () => clearTimeout(timer);
  }, [flyToActive]);

  // Keep map resized when container dimensions or mode change
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    observer.observe(containerRef.current);
    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 150);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [mode]);

  // Compute active nowcast rain frame across 13 steps
  const currentRainFrame = useMemo(() => getNowcastFrame(timeStep), [timeStep]);

  // Handle timeline auto-play across 13 steps (0 to 6h, 30-min intervals)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeStep((prev) => (prev + 1) % 13);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // GeoJSON data for the 5 LOCATIONS
  const geojsonData = useMemo(() => ({
    type: 'FeatureCollection',
    features: locations.map((loc) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [loc.lon, loc.lat],
      },
      properties: {
        id: loc.id,
        name: loc.name,
        risk: loc.risk,
        color: getRiskColor(loc.risk),
        district: loc.district || '',
      },
    })),
  }), [locations]);

  // Location selection handler
  const handleLocationClick = useCallback((loc) => {
    if (onSelectLocation) {
      onSelectLocation(loc);
    }
    if (onOpenXai) {
      onOpenXai(loc);
    }
  }, [onSelectLocation, onOpenXai]);

  // Map canvas click for GeoJSON circle features
  const handleMapClick = useCallback((e) => {
    const features = e.features;
    if (features && features.length > 0) {
      const featureId = features[0].properties?.id;
      const targetLoc = locations.find((l) => l.id === featureId);
      if (targetLoc) {
        handleLocationClick(targetLoc);
      }
    }
  }, [locations, handleLocationClick]);

  const timeLabels = ['Now', '+1h', '+2h', '+3h'];

  return (
    <div
      ref={containerRef}
      className={`risk-map-container ${mode === 'officials' ? 'officials-risk-map' : 'citizen-risk-map'} ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: mode === 'officials' ? '380px' : '420px',
        overflow: 'hidden',
        background: '#0a0e17',
        borderRadius: '12px',
        ...style,
      }}
    >
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={initialViewState}
        mapStyle={BASEMAPS[basemap]?.style || BASEMAPS.dark.style}
        style={{ width: '100%', height: '100%' }}
        cursor={cursor}
        interactiveLayerIds={['locations-circle-halo', 'locations-circle-core']}
        onClick={handleMapClick}
        onMouseEnter={() => setCursor('pointer')}
        onMouseLeave={() => setCursor('grab')}
        attributionControl={false}
        maxPitch={85}
        onLoad={flyToActive}
      >
        {/* Native Zoom & Compass Controls */}
        <NavigationControl position="bottom-right" showCompass={true} showZoom={true} />

        {/* 1. AWS Terrarium Raster-DEM Source for Hillshade & 3D Terrain */}
        <Source
          id="terrain-dem"
          type="raster-dem"
          tiles={['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png']}
          encoding="terrarium"
          tileSize={256}
          maxzoom={15}
        >
          {showTerrain && (
            <Layer
              id="hillshade-layer"
              type="hillshade"
              paint={{
                'hillshade-exaggeration': 0.25, // reduced to ~0.25 for subtle relief
                'hillshade-shadow-color': 'rgba(15, 23, 42, 0.45)', // softened shadow so labels stay readable
                'hillshade-highlight-color': 'rgba(148, 163, 184, 0.35)',
                'hillshade-accent-color': 'rgba(30, 41, 59, 0.25)',
                'hillshade-illumination-direction': 315,
              }}
            />
          )}
        </Source>

        {/* 2. Risk-Colored Zone Polygons (Vasai, Nalasopara, Virar) with Soft Glow Outline */}
        <Source id="risk-zones" type="geojson" data={RISK_ZONE_POLYGONS}>
          <Layer
            id="zone-fill"
            type="fill"
            paint={{
              'fill-color': ['get', 'color'],
              'fill-opacity': 0.12,
            }}
          />
          <Layer
            id="zone-glow"
            type="line"
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 6,
              'line-blur': 4,
              'line-opacity': 0.45,
            }}
          />
          <Layer
            id="zone-border"
            type="line"
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 1.8,
              'line-dasharray': [3, 2],
              'line-opacity': 0.85,
            }}
          />
        </Source>

        {/* 3. Radar Nowcast Storm Cell (Gaussian grid ~1 km, colored by Legend Classes, Opacity ~0.65) */}
        {activeLayer === 'radar' && (
          <Source id="nowcast-rain" type="geojson" data={currentRainFrame}>
            <Layer
              id="rain-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.65, // ~0.65 opacity so roads show through
              }}
            />
            <Layer
              id="rain-outline"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 1.5,
                'line-opacity': 0.85,
              }}
            />
          </Source>
        )}

        {/* 4. GeoJSON Source & Circle Layers for all 5 LOCATIONS */}
        <Source id="risk-locations" type="geojson" data={geojsonData}>
          <Layer
            id="locations-circle-halo"
            type="circle"
            paint={{
              'circle-radius': 14,
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.25,
              'circle-blur': 0.5,
            }}
          />
          <Layer
            id="locations-circle-core"
            type="circle"
            paint={{
              'circle-radius': 6.5,
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
              'circle-opacity': 0.95,
            }}
          />
        </Source>

        {/* Interactive Markers with pulsing animation for active location */}
        {locations.map((loc) => {
          const isActive = currentActive?.id === loc.id;
          const color = getRiskColor(loc.risk);

          return (
            <Marker
              key={loc.id}
              longitude={loc.lon}
              latitude={loc.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent?.stopPropagation();
                handleLocationClick(loc);
              }}
            >
              <div
                className={`risk-map-marker ${isActive ? 'is-active' : ''}`}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                title={`${loc.name} • ${loc.risk} Risk`}
              >
                {/* Pulsing rings for active location */}
                {isActive && (
                  <>
                    <div
                      className="risk-marker-pulsing-ring"
                      style={{
                        backgroundColor: color,
                        opacity: 0.35,
                      }}
                    />
                    <div
                      className="risk-marker-pulsing-ring delayed"
                      style={{
                        borderColor: color,
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        opacity: 0.25,
                      }}
                    />
                  </>
                )}

                {/* Marker Center Core */}
                <div
                  style={{
                    width: isActive ? '16px' : '12px',
                    height: isActive ? '16px' : '12px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: '2px solid #ffffff',
                    boxShadow: `0 0 ${isActive ? '14px' : '6px'} ${color}, 0 2px 5px rgba(0,0,0,0.8)`,
                    transition: 'all 0.2s ease',
                    zIndex: isActive ? 5 : 2,
                  }}
                />

                {/* Marker Text Label */}
                <div
                  style={{
                    marginTop: '4px',
                    padding: isActive ? '2px 8px' : '1px 6px',
                    background: isActive ? 'rgba(9, 13, 21, 0.95)' : 'rgba(9, 13, 21, 0.8)',
                    border: `1px solid ${isActive ? color : 'rgba(255, 255, 255, 0.16)'}`,
                    borderRadius: '4px',
                    fontSize: isActive ? '11px' : '10.5px',
                    fontWeight: isActive ? 700 : 500,
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: isActive ? 6 : 3,
                  }}
                >
                  <span>{loc.name}</span>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: color,
                      textTransform: 'uppercase',
                    }}
                  >
                    • {loc.risk}
                  </span>
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Distinct "You are here" pin marker */}
        {currentActive && (
          <Marker
            longitude={currentActive.lon}
            latitude={currentActive.lat}
            anchor="bottom"
            style={{ zIndex: 45 }}
          >
            <div className="you-are-here-marker-wrap">
              <div className="you-are-here-pulse-ring" />
              <div className="you-are-here-badge">
                <Navigation size={10} className="you-are-here-icon" />
                <span>YOU ARE HERE</span>
              </div>
              <div className="you-are-here-pin-needle" />
              <div className="you-are-here-ground-dot" />
            </div>
          </Marker>
        )}
      </Map>

      {/* =========================================================
          CITIZEN OVERLAY UI: Layer Pills, Basemap Switcher, Legend
          ========================================================= */}
      {mode === 'citizen' && (
        <>
          {/* Top Bar with Layer Controls & Basemap Switcher */}
          <div className="map-top-bar">
            {/* Weather Layers + Terrain & 3D */}
            <div className="map-layer-pills">
              {[
                { id: 'radar', label: 'Radar' },
                { id: 'clouds', label: 'Clouds' },
                { id: 'wind', label: 'Wind Flow' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  className={`map-pill ${activeLayer === pill.id ? 'active' : ''}`}
                  onClick={() => setActiveLayer((prev) => (prev === pill.id ? 'none' : pill.id))}
                >
                  {pill.label}
                </button>
              ))}

              <div
                style={{
                  width: '1px',
                  height: '16px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  margin: '0 4px',
                  alignSelf: 'center',
                }}
              />

              <button
                className={`map-pill ${showTerrain ? 'active' : ''}`}
                onClick={() => setShowTerrain((prev) => !prev)}
                title="Toggle Hillshade Terrain Shading"
              >
                Terrain
              </button>

              <button
                className={`map-pill ${is3D ? 'active' : ''}`}
                onClick={() => setIs3D((prev) => !prev)}
                title="Toggle 3D Elevation Mesh"
              >
                3D
              </button>
            </div>

            {/* Basemap Switcher: Dark, Light, Satellite */}
            <div className="map-layer-pills basemap-switcher" style={{ pointerEvents: 'auto' }}>
              {['dark', 'light', 'satellite'].map((key) => (
                <button
                  key={key}
                  className={`map-pill ${basemap === key ? 'active' : ''}`}
                  onClick={() => setBasemap(key)}
                  title={`Switch to ${BASEMAPS[key].label} Basemap`}
                >
                  {BASEMAPS[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Legend Overlay */}
          <div className="map-legend-overlay">
            <div className="legend-section">
              <div className="legend-row">
                <span className="color-dot dot-light"></span>
                <span className="legend-text">Light Rain</span>
              </div>
              <div className="legend-row">
                <span className="color-dot dot-moderate"></span>
                <span className="legend-text">Moderate</span>
              </div>
              <div className="legend-row">
                <span className="color-dot dot-heavy"></span>
                <span className="legend-text">Heavy</span>
              </div>
              <div className="legend-row">
                <span className="color-dot dot-vheavy"></span>
                <span className="legend-text">Very Heavy</span>
              </div>
              <div className="legend-row">
                <span className="color-dot dot-extreme"></span>
                <span className="legend-text">Extreme</span>
              </div>
            </div>

            <div className="legend-divider"></div>

            <div className="legend-section">
              <div className="legend-row">
                <span className="risk-indicator risk-severe-icon">▲</span>
                <span className="legend-text">Severe Risk</span>
              </div>
              <div className="legend-row">
                <span className="risk-indicator risk-moderate-icon">▲</span>
                <span className="legend-text">Moderate Risk</span>
              </div>
              <div className="legend-row">
                <span className="risk-indicator risk-low-icon">▲</span>
                <span className="legend-text">Low Risk</span>
              </div>
            </div>
          </div>

        </>
      )}

      {/* =========================================================
          OFFICIALS OVERLAY UI: Layer Controls, Basemap & Indicators
          ========================================================= */}
      {mode === 'officials' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '14px',
              display: 'flex',
              gap: '8px',
              zIndex: 10,
            }}
          >
            {/* Radar, Terrain & 3D Toggles */}
            <div className="map-layer-pills" style={{ background: 'rgba(9, 13, 21, 0.92)' }}>
              <button
                className={`map-pill ${activeLayer === 'radar' ? 'active' : ''}`}
                onClick={() => setActiveLayer((prev) => (prev === 'radar' ? 'none' : 'radar'))}
                title="Toggle AI Radar Nowcast Precipitation"
              >
                Radar
              </button>
              <button
                className={`map-pill ${showTerrain ? 'active' : ''}`}
                onClick={() => setShowTerrain((prev) => !prev)}
                title="Toggle Hillshade Terrain Shading"
              >
                Terrain
              </button>
              <button
                className={`map-pill ${is3D ? 'active' : ''}`}
                onClick={() => setIs3D((prev) => !prev)}
                title="Toggle 3D Elevation Mesh"
              >
                3D
              </button>
            </div>

            {/* Basemap Switcher */}
            <div className="map-layer-pills" style={{ background: 'rgba(9, 13, 21, 0.92)' }}>
              {['dark', 'light', 'satellite'].map((key) => (
                <button
                  key={key}
                  className={`map-pill ${basemap === key ? 'active' : ''}`}
                  onClick={() => setBasemap(key)}
                  title={`Switch to ${BASEMAPS[key].label} Basemap`}
                >
                  {BASEMAPS[key].label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '14px',
              background: 'rgba(9, 13, 21, 0.92)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '11px',
              color: '#94a3b8',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span>Severe</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }}></span>
              <span>Heavy</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }}></span>
              <span>Moderate</span>
            </div>
          </div>
        </>
      )}

      {/* =========================================================
          TIMELINE PLAYER: Extended 0 to 6h (13 steps), Play/Pause & Scrubbing
          ========================================================= */}
      <div className="map-timeline-player">
        <button
          className="play-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause forecast' : 'Play nowcast forecast (Now to +6h)'}
          aria-label={isPlaying ? 'Pause forecast' : 'Play forecast'}
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>

        <div className="scrubber-slider-container" style={{ width: '250px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <div className="forecast-time-badge">
              <Clock size={11} style={{ color: '#00d2ff' }} />
              <span>
                Forecast: <strong style={{ color: '#ffffff' }}>{FORECAST_STEPS[timeStep]}</strong>
              </span>
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
              {timeStep === 0 ? 'Current' : `+${(timeStep * 0.5).toFixed(1)}h`}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={timeStep}
            onChange={(e) => {
              setTimeStep(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="timeline-slider"
            aria-label="Forecast timeline slider"
          />

          <div className="slider-labels">
            {[
              { step: 0, label: 'Now' },
              { step: 2, label: '+1h' },
              { step: 4, label: '+2h' },
              { step: 6, label: '+3h' },
              { step: 8, label: '+4h' },
              { step: 10, label: '+5h' },
              { step: 12, label: '+6h' },
            ].map(({ step, label }) => (
              <span
                key={label}
                className={`slider-label-mark ${timeStep === step ? 'active' : ''}`}
                onClick={() => {
                  setTimeStep(step);
                  setIsPlaying(false);
                }}
                title={`Jump to ${FORECAST_STEPS[step]}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
