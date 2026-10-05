import React, { useState, useEffect } from 'react';
import RiskMap from '../map/RiskMap';
import { 
  Activity, 
  ShieldAlert, 
  Send, 
  Radio, 
  Database, 
  Cpu, 
  Zap, 
  CloudLightning, 
  CloudRain,
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
  Maximize2,
  LogOut,
  UserCheck
} from 'lucide-react';
import { 
  REGIONS_DATA,
  OFFICIALS_PRECURSORS, 
  MTL_HEADS_DATA, 
  WARDS_STATUS, 
  XAI_FEATURE_CONTRIBUTION 
} from '../../data/weatherData';
import { getNowcast } from '../../services/api';

export default function OfficialsDashboard({ 
  onOpenDispatchModal, 
  onOpenXaiModal,
  currentTab,
  setCurrentTab,
  authOfficer,
  onLogout
}) {
  // Navigation tabs matching the user's wireframe
  const [activeNav, setActiveNav] = useState('OVERVIEW'); // 'OVERVIEW' | 'MAP' | 'HAZARDS' | 'SATELLITE' | 'DATA' | 'NODES' | 'XAI'
  
  // Region Selection (Defaults to 'vasai' as single source of truth)
  const [selectedRegionId, setSelectedRegionId] = useState('vasai');
  const [activeHazardFilter, setActiveHazardFilter] = useState('cloudburst');
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync external sidebar tab with activeNav
  useEffect(() => {
    if (!currentTab) return;
    if (currentTab === 'mtl-maps') setActiveNav('MAP');
    else if (currentTab === 'home') setActiveNav('OVERVIEW');
    else if (currentTab === 'alerts') {
      setActiveNav('HAZARDS');
      if (onOpenDispatchModal) onOpenDispatchModal();
    }
    else if (currentTab === 'xai') {
      setActiveNav('XAI');
      onOpenXaiModal(selectedRegionId);
    } else if (currentTab === 'settings') {
      setActiveNav('DATA');
    }
  }, [currentTab]);

  // Single Source of Truth from REGIONS_DATA
  const selectedRegion = REGIONS_DATA[selectedRegionId] || REGIONS_DATA.vasai;

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await getNowcast(selectedRegionId);
    } catch (err) {
      console.error('Failed to run inference:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="ops-center-container">
      {/* =========================================================================
          TOP COMMAND HEADER (STORMS | OPERATIONS CENTER ● SYSTEM OPERATIONAL)
          ========================================================================= */}
      <div className="ops-wireframe-header">
        <div className="ops-wireframe-title-group">
          <div className="ops-brand-badge">
            <span className="ops-logo-text">STORMS</span>
            <span className="ops-divider-pipe">|</span>
            <span className="ops-suite-text">OPERATIONS CENTER</span>
          </div>
          <div className="system-operational-pill">
            <span className="sys-status-dot">●</span>
            <span className="sys-status-label">SYSTEM OPERATIONAL</span>
          </div>
        </div>

        <div className="ops-wireframe-actions">
          {authOfficer && (
            <div className="officer-session-pill">
              <UserCheck size={13} className="text-emerald" />
              <span className="officer-name">{authOfficer.name}</span>
              <span className="officer-badge-tag">{authOfficer.badgeId}</span>
            </div>
          )}

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

          {onLogout && (
            <button 
              className="ops-action-btn logout-btn-wire"
              onClick={onLogout}
              title="End Classified Officer Session"
            >
              <LogOut size={13} />
              <span>LOGOUT</span>
            </button>
          )}
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
                if (item.id === 'XAI') onOpenXaiModal(selectedRegionId);
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

          {/* Interactive MapLibre RiskMap component */}
          <div className="ops-map-canvas-container" style={{ height: '100%', minHeight: '380px', position: 'relative' }}>
            <RiskMap
              mode="officials"
              activeLocation={selectedRegionId}
              onSelectLocation={(loc) => {
                const id = (typeof loc === 'object' ? loc?.id : loc)?.toLowerCase();
                if (['vasai', 'nalasopara', 'virar', 'mumbai', 'thane'].includes(id)) {
                  setSelectedRegionId(id);
                }
              }}
              onOpenXai={(loc) => {
                onOpenXaiModal(loc || selectedRegionId);
              }}
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
                <span className="hazard-symbol red-symbol"><AlertCircle size={15} className="text-red" /></span>
                <strong className="hazard-name text-red">CLOUD BURST</strong>
              </div>
              <div className="hazard-location">Maharashtra (Vasai-Virar)</div>
              
              <div className="hazard-telemetry-grid">
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Risk:</span>
                  <strong className="h-stat-val text-red">{REGIONS_DATA.vasai.riskProb}</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">ETA:</span>
                  <strong className="h-stat-val">{REGIONS_DATA.vasai.eta}</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Confidence:</span>
                  <strong className="h-stat-val text-cyan">{REGIONS_DATA.vasai.confidence}</strong>
                </div>
              </div>
            </div>

            {/* 2. HEAVY RAIN Card */}
            <div 
              className={`hazard-wire-card card-heavyrain ${selectedRegionId === 'virar' ? 'selected' : ''}`}
              onClick={() => setSelectedRegionId('virar')}
            >
              <div className="hazard-wire-header">
                <span className="hazard-symbol orange-symbol"><CloudRain size={15} className="text-orange" /></span>
                <strong className="hazard-name text-orange">HEAVY RAIN</strong>
              </div>
              <div className="hazard-location">North Palghar Corridor</div>

              <div className="hazard-telemetry-grid">
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Risk:</span>
                  <strong className="h-stat-val text-orange">{REGIONS_DATA.virar.riskProb}</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">ETA:</span>
                  <strong className="h-stat-val">{REGIONS_DATA.virar.eta}</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Confidence:</span>
                  <strong className="h-stat-val text-cyan">{REGIONS_DATA.virar.confidence}</strong>
                </div>
              </div>
            </div>

            {/* 3. FLASH FLOOD Card */}
            <div 
              className={`hazard-wire-card card-flood ${selectedRegionId === 'nalasopara' ? 'selected' : ''}`}
              onClick={() => setSelectedRegionId('nalasopara')}
            >
              <div className="hazard-wire-header">
                <span className="hazard-symbol blue-symbol"><Waves size={15} className="text-blue" /></span>
                <strong className="hazard-name text-blue">FLASH FLOOD</strong>
              </div>
              <div className="hazard-location">Nalasopara Subway Basin</div>

              <div className="hazard-telemetry-grid">
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Risk:</span>
                  <strong className="h-stat-val text-blue">{REGIONS_DATA.nalasopara.riskProb}</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">ETA:</span>
                  <strong className="h-stat-val">{REGIONS_DATA.nalasopara.eta}</strong>
                </div>
                <div className="hazard-stat">
                  <span className="h-stat-lbl">Confidence:</span>
                  <strong className="h-stat-val text-cyan">{REGIONS_DATA.nalasopara.confidence}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONDITIONAL SUB-VIEWS (MAP | HAZARDS | SATELLITE | DATA | NODES | OVERVIEW)
          ========================================================================= */}
      {activeNav === 'MAP' && (
        <div className="ops-view-container" style={{ padding: '16px', background: '#090d16', borderRadius: '10px', marginTop: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Maximize2 size={16} className="text-cyan" />
                <span>Expanded Hyper-Local GIS Nowcast Map</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                Full-screen radar nowcast cell extrapolation, 3D CartoDEM terrain & municipal risk zones
              </p>
            </div>
            <div className="map-zone-toggles">
              {Object.values(REGIONS_DATA).map((r) => (
                <button
                  key={r.id}
                  className={`zone-pill ${selectedRegionId === r.id ? 'active' : ''}`}
                  onClick={() => setSelectedRegionId(r.id)}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: '560px', borderRadius: '8px', overflow: 'hidden' }}>
            <RiskMap
              mode="officials"
              activeLocation={selectedRegionId}
              onSelectLocation={(loc) => {
                const id = (typeof loc === 'object' ? loc?.id : loc)?.toLowerCase();
                if (REGIONS_DATA[id]) setSelectedRegionId(id);
              }}
              onOpenXai={(loc) => onOpenXaiModal(loc || selectedRegionId)}
            />
          </div>
        </div>
      )}

      {activeNav === 'HAZARDS' && (
        <div className="ops-view-container" style={{ padding: '18px', background: '#090d16', borderRadius: '10px', marginTop: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} className="text-red" />
                <span>Regional Hazard Triage & First Responder Deployment</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                Palghar & MMR Municipal Ward Emergency Readiness Matrix
              </p>
            </div>
            <button className="ops-action-btn cap-dispatch-btn-wire" onClick={onOpenDispatchModal}>
              <Send size={13} />
              <span>Broadcast Evacuation CAP Alert</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {Object.values(REGIONS_DATA).map((r) => (
              <div key={r.id} className="hazard-wire-card" style={{ padding: '14px', border: selectedRegionId === r.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#fff', fontSize: '14px' }}>{r.name}</strong>
                  <span className={`head-badge-item ${r.risk === 'Extreme' ? 'badge-red' : r.risk === 'Severe' ? 'badge-orange' : 'badge-blue'}`}>
                    {r.risk} ({r.riskProb})
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', margin: '6px 0 10px' }}>{r.wardName} • ETA: {r.eta}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Pumps</span>
                    <strong style={{ color: '#38bdf8', fontSize: '13px' }}>{r.resources?.pumps ?? 4} units</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Boats</span>
                    <strong style={{ color: '#f59e0b', fontSize: '13px' }}>{r.resources?.boats ?? 2} units</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Shelters</span>
                    <strong style={{ color: '#10b981', fontSize: '13px' }}>{r.resources?.shelters ?? 2} open</strong>
                  </div>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Pop: {r.population}</span>
                  <button className="xai-inspect-btn" onClick={() => onOpenXaiModal(r.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <span>XAI Attributions</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeNav === 'SATELLITE' && (
        <div className="ops-view-container" style={{ padding: '18px', background: '#090d16', borderRadius: '10px', marginTop: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} className="text-cyan" />
                <span>INSAT-3D / 3DR Multi-Spectral Radiance Telemetry</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                MOSDAC geostationary payload channels fused for deep convective precursor tracking
              </p>
            </div>
            <div className="map-zone-toggles">
              {['vasai', 'nalasopara', 'virar'].map((id) => (
                <button
                  key={id}
                  className={`zone-pill ${selectedRegionId === id ? 'active' : ''}`}
                  onClick={() => setSelectedRegionId(id)}
                >
                  {REGIONS_DATA[id].name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div className="feature-card">
              <div className="fc-top">
                <span className="fc-title">1. Water Vapor Channel (6.8 µm WV)</span>
                <span className="fc-val text-cyan">{selectedRegion.precursors.iwv}</span>
              </div>
              <p className="fc-desc">
                Measures column moisture fuel pool. Rapid surge of <strong>{selectedRegion.precursors.iwvRate}</strong> provides latent heat for violent convective development.
              </p>
            </div>

            <div className="feature-card">
              <div className="fc-top">
                <span className="fc-title">2. Thermal Infrared (TIR-1 10.8 µm CTT)</span>
                <span className="fc-val text-red">{selectedRegion.precursors.ctt}</span>
              </div>
              <p className="fc-desc">
                Direct detection of cloud-top cooling penetrating the tropopause. Confirms explosive vertical updraft core formation.
              </p>
            </div>

            <div className="feature-card">
              <div className="fc-top">
                <span className="fc-title">3. High-Resolution Visible Channel (0.65 µm)</span>
                <span className="fc-val text-amber">Albedo 0.88</span>
              </div>
              <p className="fc-desc">
                Mesoscale convective cloud texture and overshooting tops resolution over Western Ghats maritime boundary.
              </p>
            </div>

            <div className="feature-card">
              <div className="fc-top">
                <span className="fc-title">4. CartoDEM 30m Topographic Slope</span>
                <span className="fc-val text-blue">Peak Runoff {selectedRegion.precursors.runoff}</span>
              </div>
              <p className="fc-desc">
                Hydrological routing and depression ponding projection along coastal railway subways and creek channels.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeNav === 'DATA' && (
        <div className="ops-view-container" style={{ padding: '18px', background: '#090d16', borderRadius: '10px', marginTop: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={16} className="text-emerald" />
                <span>Numerical Precursors Telemetry Matrix (8 Core Meteorological Channels)</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                Single source of truth metrics verified across MoES-NCMRWF geostationary satellite & Doppler radar data pipelines
              </p>
            </div>
            <button className="ops-action-btn simulate-btn-wire" onClick={handleSimulate}>
              <RefreshCw size={13} className={isSimulating ? 'spin' : ''} />
              <span>Refresh Readings</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="nwp-comp-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Risk %</th>
                  <th>IR 10.8 (CTT)</th>
                  <th>WV 6.2 (Moisture)</th>
                  <th>VIR (Optical Depth)</th>
                  <th>CAPE (Instability)</th>
                  <th>Surface Pressure</th>
                  <th>Wind Vector U (Zonal)</th>
                  <th>Wind Vector V (Meridional)</th>
                  <th>Elevation (CartoDEM)</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(REGIONS_DATA).map((r) => (
                  <tr key={r.id} style={{ background: selectedRegionId === r.id ? 'rgba(56, 189, 248, 0.08)' : 'transparent' }}>
                    <td><strong>{r.name}</strong></td>
                    <td className={r.riskScore >= 80 ? 'text-red' : 'text-amber'}><strong>{r.riskProb}</strong></td>
                    <td className="text-red"><strong>{r.precursors.ir108}</strong></td>
                    <td className="text-cyan">{r.precursors.wv62}</td>
                    <td className="text-amber">{r.precursors.vir}</td>
                    <td className="text-amber">{r.precursors.cape}</td>
                    <td className="text-emerald">{r.precursors.surfacePressure}</td>
                    <td className="text-purple">{r.precursors.windU}</td>
                    <td className="text-purple">{r.precursors.windV}</td>
                    <td className="text-blue">{r.precursors.elevation}</td>
                    <td>{r.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeNav === 'NODES' && (
        <div className="ops-view-container" style={{ padding: '18px', background: '#090d16', borderRadius: '10px', marginTop: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={16} className="text-amber" />
                <span>Ground Telemetry Nodes & Edge Sensor Array</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                Automated Weather Stations (AWS) & Doppler Radar Repeater Health
              </p>
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              <span>5 of 5 Nodes Online</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {[
              { name: 'Vasai Gaon Coastal AWS', id: 'AWS-VASAI-01', ping: '12ms', status: 'Online', uptime: '99.8%', coords: '19.3639° N, 72.8093° E' },
              { name: 'Nalasopara Sopara Tipping Rain Gauge', id: 'AWS-NALA-02', ping: '14ms', status: 'Online', uptime: '100%', coords: '19.4167° N, 72.7989° E' },
              { name: 'Virar Foothill Doppler Repeater', id: 'DOP-VIRAR-03', ping: '18ms', status: 'Online', uptime: '99.4%', coords: '19.4700° N, 72.8000° E' },
              { name: 'Thane Creek Hydrological Gauge', id: 'HYD-THANE-04', ping: '22ms', status: 'Online', uptime: '99.1%', coords: '19.2183° N, 72.9781° E' },
              { name: 'Mumbai Suburban Met Observational Tower', id: 'MET-MUM-05', ping: '9ms', status: 'Online', uptime: '99.9%', coords: '19.0760° N, 72.8777° E' },
            ].map((node) => (
              <div key={node.id} className="feature-card" style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: '#fff' }}>{node.name}</strong>
                  <span className="sys-status-label" style={{ color: '#10b981', fontSize: '10px' }}>● {node.status}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', margin: '4px 0' }}><code>{node.id}</code> • {node.coords}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginTop: '6px' }}>
                  <span>Latency: <strong className="text-emerald">{node.ping}</strong></span>
                  <span>Uptime: <strong className="text-cyan">{node.uptime}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SELECTED REGION KPI BANNER (Default Overview Mode)
          ========================================================================= */}
      {activeNav === 'OVERVIEW' && (
        <>
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

          {/* SPLIT SECTION: [WHY THIS ALERT?] vs [FORECAST TIMELINE] */}
          <div className="ops-split-explanation-grid">
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

            <div className="ops-timeline-box">
              <div className="ops-box-header">
                <Clock size={15} className="text-amber" />
                <span className="ops-box-title">2–6 HOUR NOWCAST TIMELINE</span>
                <span className="timeline-formula-sub">NOW → +1h → +2h → +3h → +4h → +5h → +6h</span>
              </div>

              <div className="timeline-bars-sequence">
                {selectedRegion.timeline.map((slot, idx) => (
                  <div key={idx} className="timeline-col-block">
                    <div className="timeline-time-label">{slot.time}</div>
                    
                    <div className="ascii-block-column">
                      <div className="bar-track-outer">
                        <div 
                          className={`bar-fill-block block-${slot.level}`}
                          style={{ height: `${slot.val}%` }}
                        ></div>
                      </div>
                      <span className="block-val-readout">{slot.val}%</span>
                    </div>

                    <div className="timeline-rain-rate">{slot.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: METEOROLOGICAL EVIDENCE */}
          <div className="ops-meteorological-evidence-panel">
            <div className="evidence-panel-header">
              <Activity size={16} className="text-emerald" />
              <span className="evidence-title">METEOROLOGICAL EVIDENCE</span>
              <span className="evidence-sensors-tag">FUSED SATELLITE + IMDAA PREDICTIVE MATRIX</span>
            </div>

            <div className="evidence-badges-row">
              <div className="evidence-badge-chip chip-cyan">
                <div className="badge-chip-top">
                  <span className="chip-symbol">IWV ↑</span>
                  <span className="chip-sub">MOISTURE FUEL</span>
                </div>
                <strong className="chip-metric">{selectedRegion.precursors.iwv}</strong>
                <span className="chip-source">INSAT-3D WV ({selectedRegion.precursors.iwvRate || '+14.2 mm/hr'})</span>
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

            <div className="model-interpretation-footer-banner">
              <div className="model-interp-label">MODEL INTERPRETATION:</div>
              <div className="model-interp-text">
                {selectedRegion.interpretation}
              </div>
              <button className="xai-inspect-btn" onClick={() => onOpenXaiModal(selectedRegionId)}>
                <span>View Attention Weights</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
