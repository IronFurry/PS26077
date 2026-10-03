import React from 'react';
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
  Activity
} from 'lucide-react';
import { XAI_FEATURE_CONTRIBUTION } from '../../data/weatherData';

export default function ExplainableAiModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container xai-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header header-purple">
          <div className="header-left-title">
            <Cpu size={20} className="text-purple" />
            <div>
              <h2 className="modal-title">Explainable AI (XAI) Meteorological Attribution</h2>
              <span className="modal-subtitle">
                Deconstructing Spatiotemporal Multi-Task Attention & Precursor Dynamics
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="modal-body-scrollable">
          {/* Architecture Overview */}
          <div className="xai-block">
            <h4 className="xai-section-title">
              <Layers size={16} className="text-cyan" />
              <span>Multi-Task Learning (MTL) Spatiotemporal Architecture</span>
            </h4>
            <p className="xai-text">
              Instead of running computationally heavy thermodynamic simulations (NWP) which take hours, SkyWatch uses a shared 3D Spatiotemporal Transformer backbone. The shared layers ingest multi-spectral satellite imagery and reanalysis grids to distill foundational features, branching into three dedicated heads:
            </p>

            <div className="mtl-pipeline-diagram">
              <div className="pipe-stage stage-inputs">
                <span className="stage-title">Multi-Modal Inputs</span>
                <span className="pipe-pill">INSAT-3D WV (IWV)</span>
                <span className="pipe-pill">INSAT-3D TIR (CTT)</span>
                <span className="pipe-pill">IMDAA CAPE/CIN/Wind</span>
                <span className="pipe-pill">CartoDEM 30m Slope</span>
              </div>
              <div className="pipe-arrow">➔</div>
              <div className="pipe-stage stage-backbone">
                <span className="stage-title">Shared MTL Backbone</span>
                <span className="backbone-desc">3D Spatiotemporal Conv + Cross-Attention Feature Alignment</span>
              </div>
              <div className="pipe-arrow">➔</div>
              <div className="pipe-stage stage-heads">
                <span className="stage-title">Multi-Task Heads</span>
                <span className="head-badge-item badge-orange">⚡ Thunderstorms (94%)</span>
                <span className="head-badge-item badge-red">🌧️ Cloudbursts (88%)</span>
                <span className="head-badge-item badge-blue">🌊 Flash Floods (82%)</span>
              </div>
            </div>
          </div>

          {/* Precursor Breakdown */}
          <div className="xai-block">
            <h4 className="xai-section-title">
              <BarChart2 size={16} className="text-amber" />
              <span>Predictive Matrix Precursors (SHAP Feature Importance)</span>
            </h4>
            
            <div className="feature-cards-grid">
              <div className="feature-card">
                <div className="fc-top">
                  <span className="fc-title">1. Moisture Fuel (IWV)</span>
                  <span className="fc-val text-cyan">36% Weight</span>
                </div>
                <p className="fc-desc">
                  Tracking spatial & temporal rate of change in Integrated Water Vapor (IWV) captures moisture pooling before cloud formation.
                </p>
              </div>

              <div className="feature-card">
                <div className="fc-top">
                  <span className="fc-title">2. CTT Drop Rate</span>
                  <span className="fc-val text-red">28% Weight</span>
                </div>
                <p className="fc-desc">
                  Drop rate of -19.4°C in 15 mins indicates rapid updrafts penetrating the tropopause, a definitive severe storm precursor.
                </p>
              </div>

              <div className="feature-card">
                <div className="fc-top">
                  <span className="fc-title">3. CartoDEM Inundation</span>
                  <span className="fc-val text-blue">18% Weight</span>
                </div>
                <p className="fc-desc">
                  Overlaying precipitation probability onto high-res DEM calculates runoff routing and depression ponding in low-lying subways.
                </p>
              </div>

              <div className="feature-card">
                <div className="fc-top">
                  <span className="fc-title">4. CAPE / CIN Buoyancy</span>
                  <span className="fc-val text-amber">12% Weight</span>
                </div>
                <p className="fc-desc">
                  High thermal energy (3,240 J/kg) coupled with eroding capping inversion provides explosive upward buoyancy.
                </p>
              </div>
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
                  <td><strong>Precursor Fused</strong></td>
                  <td>Pure thermodynamics</td>
                  <td className="text-emerald"><strong>INSAT-3D WV/TIR + IMDAA + DEM</strong></td>
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
