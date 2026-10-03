import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  BarChart2, 
  Zap, 
  Clock, 
  CheckCircle,
  Activity,
  MapPin,
  AlertTriangle,
  CloudLightning,
  Waves,
  Droplets,
  Wind
} from 'lucide-react';
import { REGIONS_DATA } from '../../data/weatherData';

export default function ExplainableAiModal({ isOpen, onClose, region, onSelectRegion }) {
  if (!isOpen) return null;

  // Resolve target region from prop or default to vasai
  const initialRegionId = (typeof region === 'object' ? region?.id : region)?.toLowerCase() || 'vasai';
  const [activeRegionId, setActiveRegionId] = useState(initialRegionId);

  const targetRegion = REGIONS_DATA[activeRegionId] || REGIONS_DATA.vasai;

  const handleRegionSwitch = (id) => {
    setActiveRegionId(id);
    if (onSelectRegion) {
      onSelectRegion(REGIONS_DATA[id]);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container xai-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header header-purple">
          <div className="header-left-title">
            <Cpu size={20} className="text-purple" />
            <div>
              <h2 className="modal-title">Explainable AI (XAI) Attribution — {targetRegion.name}</h2>
              <span className="modal-subtitle">
                Spatiotemporal Multi-Task Attention & Precursor Dynamics for {targetRegion.zoneName}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Region Selector Bar */}
        <div className="xai-region-selector-bar">
          <span className="xai-selector-label">Target Region:</span>
          {Object.values(REGIONS_DATA).map((r) => (
            <button
              key={r.id}
              className={`xai-region-pill ${activeRegionId === r.id ? 'active' : ''}`}
              onClick={() => handleRegionSwitch(r.id)}
            >
              <span className="xai-pill-dot" style={{ backgroundColor: r.risk === 'Extreme' ? '#ef4444' : r.risk === 'Severe' ? '#f97316' : '#eab308' }}></span>
              <span>{r.name}</span>
              <strong className="xai-pill-prob">{r.riskProb}</strong>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="modal-body-scrollable">
          {/* Region Status KPI Card */}
          <div className="xai-kpi-summary-card">
            <div className="xai-kpi-item">
              <span className="xai-kpi-lbl">Assessed Risk</span>
              <strong className={`xai-kpi-val ${targetRegion.risk === 'Extreme' || targetRegion.risk === 'Severe' ? 'text-red' : 'text-amber'}`}>
                {targetRegion.risk} ({targetRegion.riskProb})
              </strong>
            </div>
            <div className="xai-kpi-item">
              <span className="xai-kpi-lbl">Model Confidence</span>
              <strong className="xai-kpi-val text-cyan">{targetRegion.confidence}</strong>
            </div>
            <div className="xai-kpi-item">
              <span className="xai-kpi-lbl">Actionable ETA</span>
              <strong className="xai-kpi-val text-emerald">{targetRegion.eta}</strong>
            </div>
            <div className="xai-kpi-item">
              <span className="xai-kpi-lbl">District Basin</span>
              <strong className="xai-kpi-val">{targetRegion.district}</strong>
            </div>
          </div>

          {/* Architecture Overview */}
          <div className="xai-block">
            <h4 className="xai-section-title">
              <Layers size={16} className="text-cyan" />
              <span>Multi-Task Learning (MTL) Spatiotemporal Architecture</span>
            </h4>
            <p className="xai-text">
              Instead of running computationally heavy thermodynamic simulations (NWP) which take hours, SkyWatch uses a shared 3D Spatiotemporal Transformer backbone. The shared layers ingest multi-spectral satellite imagery and reanalysis grids to distill foundational features, branching into three dedicated heads calibrated for <strong>{targetRegion.name}</strong>:
            </p>

            <div className="mtl-pipeline-diagram">
              <div className="pipe-stage stage-inputs">
                <span className="stage-title">Multi-Modal Inputs</span>
                <span className="pipe-pill">INSAT-3D WV (IWV mm)</span>
                <span className="pipe-pill">INSAT-3D TIR (CTT)</span>
                <span className="pipe-pill">IMDAA CAPE/CIN/Wind</span>
                <span className="pipe-pill">CartoDEM 30m Slope</span>
              </div>
              <div className="pipe-arrow">➔</div>
              <div className="pipe-stage stage-backbone">
                <span className="stage-title">Shared MTL Backbone</span>
                <span className="backbone-desc">3D Spatiotemporal Conv + Cross-Attention Alignment</span>
              </div>
              <div className="pipe-arrow">➔</div>
              <div className="pipe-stage stage-heads">
                <span className="stage-title">Multi-Task Heads ({targetRegion.name})</span>
                <span className="head-badge-item badge-orange">
                  <Zap size={13} className="inline-icon" /> Thunderstorms ({targetRegion.mtlHeads?.thunderstorm?.probability ?? 91}%)
                </span>
                <span className="head-badge-item badge-red">
                  <CloudLightning size={13} className="inline-icon" /> Cloudbursts ({targetRegion.mtlHeads?.cloudburst?.probability ?? 88}%)
                </span>
                <span className="head-badge-item badge-blue">
                  <Waves size={13} className="inline-icon" /> Flash Floods ({targetRegion.mtlHeads?.flashflood?.probability ?? 84}%)
                </span>
              </div>
            </div>
          </div>

          {/* Regional Live Precursors Telemetry Strip */}
          <div className="xai-block">
            <h4 className="xai-section-title">
              <Activity size={16} className="text-emerald" />
              <span>Fused Physical Precursors Telemetry ({targetRegion.name})</span>
            </h4>

            <div className="precursors-mini-grid">
              <div className="precursor-mini-box">
                <span className="p-label">IWV (Water Vapor)</span>
                <span className="p-val text-cyan">{targetRegion.precursors.iwv}</span>
                <span className="p-sub-val" style={{ fontSize: '10.5px', color: '#38bdf8' }}>{targetRegion.precursors.iwvRate}</span>
              </div>
              <div className="precursor-mini-box">
                <span className="p-label">CAPE / CIN Buoyancy</span>
                <span className="p-val text-amber">{targetRegion.precursors.cape}</span>
                <span className="p-sub-val" style={{ fontSize: '10.5px', color: '#f59e0b' }}>CIN: {targetRegion.precursors.cin}</span>
              </div>
              <div className="precursor-mini-box">
                <span className="p-label">Convergence (Lift)</span>
                <span className="p-val text-purple">{targetRegion.precursors.convergence}</span>
                <span className="p-sub-val" style={{ fontSize: '10.5px', color: '#c084fc' }}>Low-level Trigger</span>
              </div>
              <div className="precursor-mini-box">
                <span className="p-label">CTT Drop Rate</span>
                <span className="p-val text-red">{targetRegion.precursors.ctt}</span>
                <span className="p-sub-val" style={{ fontSize: '10.5px', color: '#f87171' }}>Rapid Updraft Core</span>
              </div>
            </div>
          </div>

          {/* Region-Specific Feature Contributions (SHAP) */}
          <div className="xai-block">
            <h4 className="xai-section-title">
              <BarChart2 size={16} className="text-amber" />
              <span>SHAP Feature Importance & Attribution ({targetRegion.name})</span>
            </h4>
            
            <div className="feature-cards-grid">
              {targetRegion.xaiFeatures.map((feat, idx) => (
                <div key={idx} className="feature-card">
                  <div className="fc-top">
                    <span className="fc-title">{idx + 1}. {feat.feature}</span>
                    <span className={`fc-val ${idx === 0 ? 'text-cyan' : idx === 1 ? 'text-red' : idx === 2 ? 'text-blue' : 'text-amber'}`}>
                      {feat.weight}% Weight
                    </span>
                  </div>
                  <div className="fc-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                    <span className="pipe-pill" style={{ fontSize: '10px', background: '#1e293b' }}>{feat.category}</span>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, feat.weight * 2.5)}%`,
                          background: idx === 0 ? '#38bdf8' : idx === 1 ? '#f87171' : idx === 2 ? '#60a5fa' : '#fbbf24',
                        }}
                      />
                    </div>
                  </div>
                  <p className="fc-desc">
                    {feat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Nowcasting vs Traditional NWP Comparison Table */}
          <div className="xai-block">
            <h4 className="xai-section-title">
              <TrendingUp size={16} className="text-emerald" />
              <span>AI Nowcasting vs Traditional Physics-Based NWP</span>
            </h4>

            <table className="nwp-comp-table">
              <thead>
                <tr>
                  <th>Performance Metric</th>
                  <th>Traditional Physics NWP</th>
                  <th>SkyWatch AI Nowcast Net</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Inference / Compute Latency</strong></td>
                  <td className="text-red">3 to 6 Hours (supercomputer delay)</td>
                  <td className="text-emerald"><strong>&lt; 1.5 Seconds (Real-Time)</strong></td>
                </tr>
                <tr>
                  <td><strong>Actionable Warning Lead Time</strong></td>
                  <td>30 - 45 mins (Radar extrapolation)</td>
                  <td className="text-emerald"><strong>2 to 6 Hours Ahead</strong></td>
                </tr>
                <tr>
                  <td><strong>Spatial Resolution</strong></td>
                  <td>3 km - 12 km grid cell</td>
                  <td className="text-emerald"><strong>Hyper-local (500m to 1km)</strong></td>
                </tr>
                <tr>
                  <td><strong>Precursors Fused</strong></td>
                  <td>Pure thermodynamics</td>
                  <td className="text-emerald"><strong>INSAT-3D WV (mm) + TIR + IMDAA + DEM</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close Explanation</button>
        </div>
      </div>
    </div>
  );
}
