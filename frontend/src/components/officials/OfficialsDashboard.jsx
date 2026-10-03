import React, { useState } from 'react';
import LiveMap from '../map/LiveMap';
import { 
  Activity, 
  ShieldAlert, 
  Send, 
  Radio, 
  Database, 
  Cpu, 
  Zap, 
  CloudLightning, 
  Waves, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  MapPin, 
  Sliders, 
  Flame, 
  Wind,
  Download,
  Share2,
  RefreshCw,
  Eye,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { 
  OFFICIALS_PRECURSORS, 
  MTL_HEADS_DATA, 
  WARDS_STATUS, 
  XAI_FEATURE_CONTRIBUTION 
} from '../../data/weatherData';

export default function OfficialsDashboard({ onOpenDispatchModal, onOpenXaiModal }) {
  // Navigation tabs matching the user's wireframe
  const [activeNav, setActiveNav] = useState('OVERVIEW'); // 'OVERVIEW' | 'MAP' | 'HAZARDS' | 'SATELLITE' | 'DATA' | 'NODES' | 'XAI'
  
  // Region Selection (Defaults to 'Vasai Zone' as specified in wireframe)
  const [selectedRegionId, setSelectedRegionId] = useState('vasai');
  const [activeHazardFilter, setActiveHazardFilter] = useState('cloudburst');
  const [isSimulating, setIsSimulating] = useState(false);

  // Region database
  const REGIONS = {
    vasai: {
      name: 'Vasai Zone',
      riskProb: '87%',
      confidence: '91%',
      impact: 'HIGH',
      eta: '45 min',
      coords: { x: 390, y: 195 },
      reasons: [
        { title: 'Rainfall intensity increasing', detail: 'QPE satellite radar estimate climbing past 68 mm/hr with convective core formation.' },
        { title: 'Strong moisture buildup', detail: 'Rapid accumulation of Integrated Water Vapor (+14.2 g/kg/hr) over the coastline.' },
        { title: 'Storm development detected', detail: 'Cloud Top Temperature drop rate of -19.4°C/15m confirms violent explosive updrafts.' }
      ],
      timeline: [
        { time: 'NOW', val: 35, level: 'low', text: '12 mm/h' },
        { time: '+30m', val: 68, level: 'mod', text: '42 mm/h' },
        { time: '+1h', val: 92, level: 'high', text: '86 mm/h' },
        { time: '+2h', val: 96, level: 'crit', text: '104 mm/h' },
        { time: '+3h', val: 54, level: 'mod', text: '38 mm/h' },
      ],
      precursors: {
        iwv: '62.8 mm ↑',
        cape: '3,240 J/kg ↑',
        cin: '-12 J/kg ↓',
        convergence: '7.4 × 10⁻⁵ s⁻¹ ↑',
        ctt: '-19.4°C / 15m ↓',
        qpe: '88.5 mm/hr ↑'
      },
      interpretation: 'Conditions are becoming favorable for rapid thunderstorm development and intense rainfall.'
    },
    nalasopara: {
      name: 'Nalasopara Corridor',
      riskProb: '93%',
      confidence: '94%',
      impact: 'CRITICAL',
      eta: '30 min',
      coords: { x: 430, y: 140 },
      reasons: [
        { title: 'Severe Cloudburst Core Centered', detail: 'Reflectivity over 58 dBZ indicating torrential localized cloudburst cell.' },
        { title: 'Low-Lying Depression Ponding', detail: 'CartoDEM slope analysis projects extreme subway and roadway inundation.' },
        { title: 'Wind Convergence Trigger', detail: 'Persistent low-level wind convergence accelerating vertical ascent.' }
      ],
      timeline: [
        { time: 'NOW', val: 55, level: 'mod', text: '28 mm/h' },
        { time: '+30m', val: 94, level: 'crit', text: '95 mm/h' },
        { time: '+1h', val: 98, level: 'crit', text: '115 mm/h' },
        { time: '+2h', val: 82, level: 'high', text: '68 mm/h' },
        { time: '+3h', val: 40, level: 'low', text: '22 mm/h' },
      ],
      precursors: {
        iwv: '64.2 mm ↑',
        cape: '3,410 J/kg ↑',
        cin: '-8 J/kg ↓',
        convergence: '8.2 × 10⁻⁵ s⁻¹ ↑',
        ctt: '-21.8°C / 15m ↓',
        qpe: '96.0 mm/hr ↑'
      },
      interpretation: 'Extreme convective cloudburst and subway submergence imminent within 30 minutes.'
    },
    virar: {
      name: 'Virar Foothills',
      riskProb: '76%',
      confidence: '86%',
      impact: 'MODERATE',
      eta: '1h 15 min',
      coords: { x: 470, y: 90 },
      reasons: [
        { title: 'Orographic Enhancement along Ridge', detail: 'Moist westerly airflow lifting across CartoDEM elevation contours.' },
        { title: 'Elevated CAPE Profile', detail: 'Instability supports moderate to heavy squall development.' },
        { title: 'Secondary Cell Propagation', detail: 'Outflow boundary from southern cell triggering secondary thunderstorm cells.' }
      ],
      timeline: [
        { time: 'NOW', val: 20, level: 'low', text: '6 mm/h' },
        { time: '+30m', val: 42, level: 'low', text: '18 mm/h' },
        { time: '+1h', val: 78, level: 'high', text: '54 mm/h' },
        { time: '+2h', val: 84, level: 'high', text: '72 mm/h' },
        { time: '+3h', val: 60, level: 'mod', text: '40 mm/h' },
      ],
      precursors: {
        iwv: '58.4 mm ↑',
        cape: '2,920 J/kg ↑',
        cin: '-18 J/kg ↓',
        convergence: '6.1 × 10⁻⁵ s⁻¹ ↑',
        ctt: '-16.2°C / 15m ↓',
        qpe: '52.0 mm/hr ↑'
      },
      interpretation: 'Convective cell propagation heading northward with moderate flash flood potential.'
    }
  };

  const selectedRegion = REGIONS[selectedRegionId] || REGIONS.vasai;

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <div className="ops-center-container">
      {/* =========================================================================
          TOP COMMAND HEADER (skywatch | OPERATIONS CENTER ● SYSTEM OPERATIONAL)
          ========================================================================= */}
      <div className="ops-wireframe-header">
        <div className="ops-wireframe-title-group">
          <div className="ops-brand-badge">
            <span className="ops-logo-text">skywatch</span>
            <span className="ops-divider-pipe">|</span>
            <span className="ops-suite-text">OPERATIONS CENTER</span>
          </div>
          <div className="system-operational-pill">
            <span className="sys-status-dot">●</span>
            <span className="sys-status-label">SYSTEM OPERATIONAL</span>
          </div>
        </div>

        <div className="ops-wireframe-actions">
          <button 
            className="ops-action-btn simulate-btn-wire" 
            onClick={handleSimulate}
            title="Refresh MTL Deep Learning Inference"
          >
            <RefreshCw size={13} className={isSimulating ? 'spin' : ''} />
            <span>{isSimulating ? 'INFERRING...' : 'RUN INFERENCE'}</span>
          </button>
          
          <button 
            className="ops-action-btn cap-dispatch-btn-wire" 
            onClick={onOpenDispatchModal}
            title="Broadcast Common Alerting Protocol to Citizens and NDRF"
          >
            <Send size={13} />
            <span>DISPATCH CAP ALERT</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN 3-COLUMN OPS GRID:
          [Left Nav] | [Center Live Risk Map] | [Right Active Hazards]
          ========================================================================= */}
      <div className="ops-wireframe-middle-grid">
        {/* Left Sub-Navigation Menu */}
        <div className="ops-subnav-panel">
          <div className="subnav-header">NAVIGATION</div>
          {[
            { id: 'OVERVIEW', label: 'OVERVIEW' },
            { id: 'MAP', label: 'MAP' },
            { id: 'HAZARDS', label: 'HAZARDS' },
            { id: 'SATELLITE', label: 'SATELLITE' },
            { id: 'DATA', label: 'DATA' },
            { id: 'NODES', label: 'NODES' },
            { id: 'XAI', label: 'XAI' },
          ].map(item => (
            <button
              key={item.id}
              className={`ops-subnav-btn ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.id);
                if (item.id === 'XAI') onOpenXaiModal();
              }}
            >
              <span className="subnav-indicator"></span>
              <span className="subnav-text">{item.label}</span>
            </button>
          ))}

          {/* Quick Stats at bottom of subnav */}
          <div className="subnav-bottom-telemetry">
            <div className="telemetry-row">
              <span>LATENCY:</span>
              <strong className="text-emerald">0.8s (AI)</strong>
            </div>
            <div className="telemetry-row">
              <span>LEAD TIME:</span>
              <strong className="text-cyan">2-6 HOURS</strong>
            </div>
            <div className="telemetry-row">
              <span>RESOLUTION:</span>
              <strong>1 km²</strong>
            </div>
          </div>
        </div>

        {/* Center: LIVE RISK MAP [Hazard zones / node borders] */}
        <div className="ops-live-risk-map-panel">
          <div className="live-map-header">
            <div className="map-title-tag">
              <span className="map-live-dot">●</span>
              <span className="map-title-text">LIVE RISK MAP</span>
              <span className="map-subtitle-text">[hazard zones / node borders]</span>
            </div>

            <div className="map-zone-toggles">
              <button 
                className={`zone-pill ${selectedRegionId === 'vasai' ? 'active' : ''}`}
                onClick={() => setSelectedRegionId('vasai')}
              >
                Vasai Zone
              </button>
              <button 
                className={`zone-pill ${selectedRegionId === 'nalasopara' ? 'active' : ''}`}
                onClick={() => setSelectedRegionId('nalasopara')}
              >
                Nalasopara Zone
              </button>
              <button 
                className={`zone-pill ${selectedRegionId === 'virar' ? 'active' : ''}`}
                onClick={() => setSelectedRegionId('virar')}
              >
                Virar Zone
              </button>
            </div>
          </div>

          {/* Interactive Leaflet Map — replaces the SVG vector canvas */}
          <div className="ops-map-canvas-container" style={{ height: '100%', minHeight: '360px' }}>
            <LiveMap
              activeLocation={selectedRegionId}
              portalMode="officials"
              onSelectZone={(zone) => setSelectedRegionId(zone.id)}
            />
          </div>

        </div>


        {/* Right: ACTIVE HAZARDS Panel */}
        <div className="ops-active-hazards-panel">
          <div className="hazards-panel-title">
            <ShieldAlert size={14} className="text-red" />
            <span>ACTIVE HAZARDS</span>
          </div>

          <div className="hazards-cards-list">
            {/* 1. CLOUD BURST Card */}
            <div 
              className={`hazard-wire-card card-cloudburst ${selectedRegionId === 'vasai' ? 'selected' : ''}`}
              onClick={() => setSelectedRegionId('vasai')}
            >
              <div className="hazard-wire-header">
                <span className="hazard-symbol red-symbol">🔴</span>
                <strong className="hazard-name text-red">CLOUD BURST</strong>
              </div>
              <div className="hazard-location">Maharashtra (Vasai-Virar)</div>
              
              <div className="hazard-telemetry-grid">
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Risk:</span>
                  <strong className="h-stat-val text-red">87%</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">ETA:</span>
                  <strong className="h-stat-val">45 min</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Confidence:</span>
                  <strong className="h-stat-val text-cyan">91%</strong>
                </div>
              </div>
            </div>

            {/* 2. HEAVY RAIN Card */}
            <div 
              className={`hazard-wire-card card-heavyrain ${selectedRegionId === 'virar' ? 'selected' : ''}`}
              onClick={() => setSelectedRegionId('virar')}
            >
              <div className="hazard-wire-header">
                <span className="hazard-symbol orange-symbol">🟠</span>
                <strong className="hazard-name text-orange">HEAVY RAIN</strong>
              </div>
              <div className="hazard-location">North Palghar Corridor</div>

              <div className="hazard-telemetry-grid">
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Risk:</span>
                  <strong className="h-stat-val text-orange">64%</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">ETA:</span>
                  <strong className="h-stat-val">1h 15m</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Confidence:</span>
                  <strong className="h-stat-val text-cyan">86%</strong>
                </div>
              </div>
            </div>

            {/* 3. FLASH FLOOD Card */}
            <div 
              className={`hazard-wire-card card-flood ${selectedRegionId === 'nalasopara' ? 'selected' : ''}`}
              onClick={() => setSelectedRegionId('nalasopara')}
            >
              <div className="hazard-wire-header">
                <span className="hazard-symbol blue-symbol">🌊</span>
                <strong className="hazard-name text-blue">FLASH FLOOD</strong>
              </div>
              <div className="hazard-location">Nalasopara Subway Basin</div>

              <div className="hazard-telemetry-grid">
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Risk:</span>
                  <strong className="h-stat-val text-blue">93%</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">ETA:</span>
                  <strong className="h-stat-val">30 min</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Confidence:</span>
                  <strong className="h-stat-val text-cyan">94%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SELECTED REGION KPI BANNER:
          SELECTED REGION: Vasai Zone
          [Risk Probability: 87%] [Confidence: 91%] [Expected Impact: HIGH] [ETA: 45 min]
          ========================================================================= */}
      <div className="ops-selected-region-strip">
        <div className="selected-region-label-box">
          <MapPin size={16} className="text-cyan" />
          <span className="sel-tag">SELECTED REGION:</span>
          <strong className="sel-val">{selectedRegion.name}</strong>
        </div>

        <div className="selected-region-kpi-row">
          <div className="region-kpi-box">
            <span className="r-kpi-label">Risk Probability</span>
            <strong className="r-kpi-value text-red">{selectedRegion.riskProb}</strong>
          </div>

          <div className="region-kpi-box">
            <span className="r-kpi-label">Confidence</span>
            <strong className="r-kpi-value text-cyan">{selectedRegion.confidence}</strong>
          </div>

          <div className="region-kpi-box">
            <span className="r-kpi-label">Expected Impact</span>
            <strong className={`r-kpi-value ${selectedRegion.impact === 'CRITICAL' ? 'text-red' : 'text-orange'}`}>
              {selectedRegion.impact}
            </strong>
          </div>

          <div className="region-kpi-box">
            <span className="r-kpi-label">ETA</span>
            <strong className="r-kpi-value text-amber">{selectedRegion.eta}</strong>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SPLIT SECTION:
          [WHY THIS ALERT?] vs [FORECAST TIMELINE (NOW → +30m → +1h → +2h → +3h)]
          ========================================================================= */}
      <div className="ops-split-explanation-grid">
        {/* Left: WHY THIS ALERT? */}
        <div className="ops-why-alert-box">
          <div className="ops-box-header">
            <Info size={15} className="text-cyan" />
            <span className="ops-box-title">WHY THIS ALERT?</span>
          </div>

          <ul className="why-alert-bullets-list">
            {selectedRegion.reasons.map((item, idx) => (
              <li key={idx} className="why-bullet-item">
                <span className="bullet-dot">•</span>
                <div className="bullet-content">
                  <strong className="bullet-title">{item.title}</strong>
                  <span className="bullet-desc">{item.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: FORECAST TIMELINE */}
        <div className="ops-timeline-box">
          <div className="ops-box-header">
            <Clock size={15} className="text-amber" />
            <span className="ops-box-title">FORECAST TIMELINE</span>
            <span className="timeline-formula-sub">NOW → +30m → +1h → +2h → +3h</span>
          </div>

          <div className="timeline-bars-sequence">
            {selectedRegion.timeline.map((slot, idx) => (
              <div key={idx} className="timeline-col-block">
                <div className="timeline-time-label">{slot.time}</div>
                
                {/* Visual Block Bar matching ████ ASCII art representation */}
                <div className="ascii-block-column">
                  <div className="bar-track-outer">
                    <div 
                      className={`bar-fill-block block-${slot.level}`}
                      style={{ height: `${slot.val}%` }}
                    ></div>
                  </div>
                  {/* Digital text readout */}
                  <span className="block-val-readout">{slot.val}%</span>
                </div>

                <div className="timeline-rain-rate">{slot.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM SECTION:
          METEOROLOGICAL EVIDENCE
          [IWV ↑] [CAPE ↑] [CIN ↓] [Convergence ↑] [CTT ↓] [QPE ↑]
          MODEL INTERPRETATION: Conditions are becoming favorable for rapid thunderstorm development...
          ========================================================================= */}
      <div className="ops-meteorological-evidence-panel">
        <div className="evidence-panel-header">
          <Activity size={16} className="text-emerald" />
          <span className="evidence-title">METEOROLOGICAL EVIDENCE</span>
          <span className="evidence-sensors-tag">FUSED SATELLITE + IMDAA PREDICTIVE MATRIX</span>
        </div>

        {/* 6 Core Meteorological Indicators */}
        <div className="evidence-badges-row">
          <div className="evidence-badge-chip chip-cyan">
            <div className="badge-chip-top">
              <span className="chip-symbol">IWV ↑</span>
              <span className="chip-sub">MOISTURE FUEL</span>
            </div>
            <strong className="chip-metric">{selectedRegion.precursors.iwv}</strong>
            <span className="chip-source">INSAT-3D WV (+14.2 g/kg/h)</span>
          </div>

          <div className="evidence-badge-chip chip-amber">
            <div className="badge-chip-top">
              <span className="chip-symbol">CAPE ↑</span>
              <span className="chip-sub">BUOYANCY ENERGY</span>
            </div>
            <strong className="chip-metric">{selectedRegion.precursors.cape}</strong>
            <span className="chip-source">IMDAA Thermodynamic</span>
          </div>

          <div className="evidence-badge-chip chip-emerald">
            <div className="badge-chip-top">
              <span className="chip-symbol">CIN ↓</span>
              <span className="chip-sub">CAP EROSION</span>
            </div>
            <strong className="chip-metric">{selectedRegion.precursors.cin}</strong>
            <span className="chip-source">Inversion Breached</span>
          </div>

          <div className="evidence-badge-chip chip-purple">
            <div className="badge-chip-top">
              <span className="chip-symbol">Convergence ↑</span>
              <span className="chip-sub">VERTICAL LIFT</span>
            </div>
            <strong className="chip-metric">{selectedRegion.precursors.convergence}</strong>
            <span className="chip-source">Coastline Wind Collisions</span>
          </div>

          <div className="evidence-badge-chip chip-red">
            <div className="badge-chip-top">
              <span className="chip-symbol">CTT ↓</span>
              <span className="chip-sub">EXPLOSIVE UPDRAFT</span>
            </div>
            <strong className="chip-metric">{selectedRegion.precursors.ctt}</strong>
            <span className="chip-source">INSAT-3DR TIR Cooling</span>
          </div>

          <div className="evidence-badge-chip chip-blue">
            <div className="badge-chip-top">
              <span className="chip-symbol">QPE ↑</span>
              <span className="chip-sub">PRECIP ESTIMATION</span>
            </div>
            <strong className="chip-metric">{selectedRegion.precursors.qpe}</strong>
            <span className="chip-source">Doppler Radar Satellite QPE</span>
          </div>
        </div>

        {/* Model Interpretation Banner */}
        <div className="model-interpretation-footer-banner">
          <div className="model-interp-label">MODEL INTERPRETATION:</div>
          <div className="model-interp-text">
            {selectedRegion.interpretation}
          </div>
          <button className="xai-inspect-btn" onClick={onOpenXaiModal}>
            <span>View Attention Weights</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
