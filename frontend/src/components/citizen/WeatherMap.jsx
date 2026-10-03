import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Plus, 
  Minus, 
  Navigation, 
  Layers, 
  Eye,
  Crosshair,
  Wind
} from 'lucide-react';

export default function WeatherMap({ activeLocation }) {
  const [activeLayer, setActiveLayer] = useState('weatherRisk'); // 'weatherRisk' | 'rainfall' | 'satellite'
  const [timeStep, setTimeStep] = useState(0); // 0 = Now, 1 = +1h, 2 = +2h, 3 = +3h
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const timerRef = useRef(null);

  const timeLabels = ['Now', '+1h', '+2h', '+3h'];

  // Handle play/pause animation for the 2-6 hour nowcast loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeStep((prev) => (prev + 1) % 4);
      }, 1600);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  // Cloud position shifts slightly as timeStep advances to simulate storm front moving onshore
  const stormOffsetX = timeStep * 32;
  const stormOffsetY = timeStep * -12;
  const stormScale = 1 + timeStep * 0.12;

  return (
    <div className="weather-map-card">
      {/* Top Header controls inside map */}
      <div className="map-top-bar">
        {/* Layer tabs */}
        <div className="map-layer-pills">
          <button 
            className={`map-pill ${activeLayer === 'weatherRisk' ? 'active' : ''}`}
            onClick={() => setActiveLayer('weatherRisk')}
          >
            Weather Risk
          </button>
          <button 
            className={`map-pill ${activeLayer === 'rainfall' ? 'active' : ''}`}
            onClick={() => setActiveLayer('rainfall')}
          >
            Rainfall
          </button>
          <button 
            className={`map-pill ${activeLayer === 'satellite' ? 'active' : ''}`}
            onClick={() => setActiveLayer('satellite')}
          >
            Satellite
          </button>
        </div>

        {/* Compass / Location Re-center */}
        <button 
          className="map-icon-btn compass-btn" 
          title="Re-center to Vasai Gaon"
          onClick={() => {
            setZoomLevel(1);
            setTimeStep(0);
          }}
        >
          <Navigation size={17} style={{ transform: 'rotate(-45deg)' }} />
        </button>
      </div>

      {/* Main Interactive Map Viewport */}
      <div className="map-canvas-viewport">
        {/* Coastal Map Surface Graphic */}
        <div 
          className="map-surface-layer" 
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}
        >
          {/* Base SVG Map */}
          <svg className="map-vector-base" viewBox="0 0 800 500" preserveAspectRatio="none">
            <defs>
              {/* Ocean gradient */}
              <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0b1728" />
                <stop offset="50%" stopColor="#0e1f36" />
                <stop offset="100%" stopColor="#081424" />
              </linearGradient>

              {/* Land terrain gradient */}
              <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#142327" />
                <stop offset="40%" stopColor="#192a2f" />
                <stop offset="100%" stopColor="#122024" />
              </linearGradient>

              {/* Radar Doppler Multilevel Gradient */}
              <radialGradient id="radarRedCore" cx="45%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#f97316" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#eab308" stopOpacity="0.75" />
                <stop offset="80%" stopColor="#10b981" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="radarYellowOuter" cx="48%" cy="52%" r="55%">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#22c55e" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="radarGreenOuter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.7" />
                <stop offset="65%" stopColor="#0284c7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </radialGradient>

              {/* Radar sweep beam */}
              <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
                <stop offset="85%" stopColor="rgba(56, 189, 248, 0.15)" />
                <stop offset="100%" stopColor="rgba(56, 189, 248, 0.45)" />
              </linearGradient>

              {/* Filter for glowing weather radar */}
              <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ocean Base */}
            <rect width="800" height="500" fill="url(#oceanGrad)" />

            {/* Land Coastline (Mumbai, Vasai, Virar coastline shape) */}
            <path 
              d="M360 0 C380 60, 390 110, 420 150 C440 180, 410 220, 430 260 C450 300, 430 360, 470 410 C500 450, 480 480, 520 500 L800 500 L800 0 Z" 
              fill="url(#landGrad)" 
              stroke="#2c444e"
              strokeWidth="2"
            />

            {/* Inlets, Creeks (Vasai Creek, Ulhas River inlet) */}
            <path 
              d="M420 230 Q470 240, 550 235 Q620 230, 680 250" 
              stroke="#0b1728" 
              strokeWidth="11" 
              fill="none" 
            />
            <path 
              d="M440 330 Q490 350, 560 340 Q620 335, 710 370" 
              stroke="#0b1728" 
              strokeWidth="9" 
              fill="none" 
            />

            {/* Subtle Grid Lines */}
            <g stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3">
              <line x1="200" y1="0" x2="200" y2="500" />
              <line x1="400" y1="0" x2="400" y2="500" />
              <line x1="600" y1="0" x2="600" y2="500" />
              <line x1="0" y1="125" x2="800" y2="125" />
              <line x1="0" y1="250" x2="800" y2="250" />
              <line x1="0" y1="375" x2="800" y2="375" />
            </g>

            {/* Arabian Sea Label */}
            <text x="140" y="270" fill="rgba(255,255,255,0.3)" fontSize="13" fontStyle="italic" letterSpacing="2">
              Arabian Sea
            </text>

            {/* City / Ward Labels */}
            <g fill="#cbd5e1" fontSize="12" fontWeight="600" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.8))">
              <text x="480" y="80">Virar</text>
              <text x="440" y="160">Vasai</text>
              <text x="455" y="210">Nalasopara</text>
              <text x="475" y="440">Mumbai</text>
            </g>

            {/* Animated Dynamic Severe Storm / Cloudburst Radar Heat Blobs */}
            <g 
              style={{
                transform: `translate(${stormOffsetX}px, ${stormOffsetY}px) scale(${stormScale})`,
                transformOrigin: '280px 280px',
                transition: 'transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              filter="url(#radarGlow)"
            >
              {/* Outer light rain envelope */}
              <path 
                d="M 120 180 C 180 80, 310 110, 370 170 C 430 230, 420 340, 340 390 C 270 430, 150 410, 110 320 C 70 240, 90 220, 120 180 Z"
                fill="url(#radarGreenOuter)"
                opacity="0.85"
              />

              {/* Moderate & Heavy Core */}
              <path 
                d="M 170 200 C 220 130, 310 150, 345 210 C 380 270, 360 330, 300 365 C 240 395, 175 365, 150 300 C 135 250, 140 230, 170 200 Z"
                fill="url(#radarYellowOuter)"
                opacity="0.9"
              />

              {/* High Intensity / Cloudburst Extreme Core */}
              <path 
                d="M 210 235 C 245 190, 290 200, 315 240 C 335 280, 320 320, 280 340 C 240 355, 205 330, 195 290 C 190 260, 190 250, 210 235 Z"
                fill="url(#radarRedCore)"
                opacity="0.95"
              />

              {/* Secondary developing convective cell */}
              <circle cx="280" cy="140" r="45" fill="url(#radarYellowOuter)" opacity="0.75" />
              <circle cx="280" cy="140" r="24" fill="url(#radarRedCore)" opacity="0.85" />
            </g>

            {/* Moving Radar Sweep Beam */}
            <g className="radar-sweep-effect">
              <line 
                x1="400" 
                y1="250" 
                x2="780" 
                y2="250" 
                stroke="url(#radarSweepGrad)" 
                strokeWidth="2" 
                className="radar-beam"
              />
            </g>

            {/* Active User Location Pin (Vasai Gaon) with pulsing wave */}
            <g transform="translate(445, 230)">
              {/* Outer pulsing ring */}
              <circle cx="0" cy="0" r="18" fill="none" stroke="#00d2ff" strokeWidth="2" opacity="0.7" className="map-loc-pulse" />
              <circle cx="0" cy="0" r="28" fill="none" stroke="#00d2ff" strokeWidth="1" opacity="0.3" className="map-loc-pulse-delayed" />
              {/* Center point */}
              <circle cx="0" cy="0" r="7" fill="#00d2ff" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
            </g>
          </svg>
        </div>

        {/* Legend Box (Matching Screenshot Overlay) */}
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

        {/* Timeline Scrubber (Now -> +1h -> +2h -> +3h) */}
        <div className="map-timeline-player">
          <button 
            className="play-btn" 
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause forecast' : 'Play 2-3h nowcasting forecast'}
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>

          <div className="scrubber-slider-container">
            <input 
              type="range" 
              min="0" 
              max="3" 
              step="1" 
              value={timeStep} 
              onChange={(e) => {
                setTimeStep(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="timeline-slider"
            />
            <div className="slider-labels">
              {timeLabels.map((lbl, idx) => (
                <span 
                  key={lbl} 
                  className={`slider-label-mark ${timeStep === idx ? 'active' : ''}`}
                  onClick={() => {
                    setTimeStep(idx);
                    setIsPlaying(false);
                  }}
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Zoom Controls (+ / -) */}
        <div className="map-zoom-controls">
          <button 
            className="zoom-btn" 
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
            title="Zoom in"
          >
            <Plus size={16} />
          </button>
          <div className="zoom-divider"></div>
          <button 
            className="zoom-btn" 
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.85))}
            title="Zoom out"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
