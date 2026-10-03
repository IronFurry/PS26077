import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Smartphone, 
  Tv, 
  Volume2, 
  Users, 
  MapPin,
  Clock
} from 'lucide-react';
import { dispatchAlert } from '../../services/api';

export default function DispatchModal({ isOpen, onClose }) {
  const [selectedChannels, setSelectedChannels] = useState({
    cellBroadcast: true,
    ndrf: true,
    sms: true,
    sirens: false,
    tvMedia: true
  });
  const [targetZone, setTargetZone] = useState('vasai-virar');
  const [severity, setSeverity] = useState('Severe');
  const [dispatched, setDispatched] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [dispatchReceipt, setDispatchReceipt] = useState(null);

  if (!isOpen) return null;

  const toggleChannel = (channel) => {
    setSelectedChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  const handleDispatch = async () => {
    setDispatchProgress(25);
    try {
      setTimeout(() => setDispatchProgress(65), 250);
      const res = await dispatchAlert({
        targetZone,
        severity,
        selectedChannels
      });
      setDispatchReceipt(res);
      setDispatchProgress(100);
      setDispatched(true);
    } catch (err) {
      console.error('Dispatch failed:', err);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container dispatch-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header header-orange">
          <div className="header-left-title">
            <Radio size={20} className="text-amber" />
            <div>
              <h2 className="modal-title">CAP Alert Dispatcher Console</h2>
              <span className="modal-subtitle">Common Alerting Protocol (ITU-T X.1303 / NDMA Standard)</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="modal-body-scrollable">
          {dispatched ? (
            <div className="dispatch-success-view">
              <div className="success-icon-wrap">
                <CheckCircle2 size={54} className="text-emerald" />
              </div>
              <h3 className="success-title">CAP Alert Successfully Broadcasted</h3>
              <p className="success-desc">
                High-priority alert broadcasted across 4 selected delivery vectors to <strong>425,000 citizens</strong> and emergency response agencies across the Vasai-Virar Catchment polygon.
              </p>

              <div className="dispatch-summary-box">
                <div className="summary-row">
                  <span>CAP Alert ID:</span>
                  <code>{dispatchReceipt?.dispatchId || 'CAP-IN-824192'}</code>
                </div>
                <div className="summary-row">
                  <span>Broadcast Status:</span>
                  <strong className="text-emerald">{dispatchReceipt?.status || 'BROADCAST_SUCCESS'}</strong>
                </div>
                <div className="summary-row">
                  <span>Recipients Reached:</span>
                  <strong className="text-emerald">425,180 (Cell Broadcast + SMS)</strong>
                </div>
                <div className="summary-row">
                  <span>First Responders Mobilized:</span>
                  <strong>NDRF 5th Bn, VVMC Disaster Cell, Coastal Police</strong>
                </div>
                <div className="summary-row">
                  <span>Lead Time Provided:</span>
                  <strong className="text-cyan">3 Hours 20 Minutes</strong>
                </div>
              </div>

              <div className="dispatch-actions-row">
                <button className="btn-secondary" onClick={() => setDispatched(false)}>Dispatch Another</button>
                <button className="btn-primary" onClick={onClose}>Return to Operations</button>
              </div>
            </div>
          ) : (
            <div className="dispatch-form-view">
              {/* Target Zone & Severity */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Target Geospatial Polygon</label>
                  <select 
                    className="form-select"
                    value={targetZone}
                    onChange={(e) => setTargetZone(e.target.value)}
                  >
                    <option value="vasai-virar">Vasai-Virar Catchment Polygon (85 km²)</option>
                    <option value="nalasopara">Nalasopara Basin Corridor (42 km²)</option>
                    <option value="mira-bhayandar">Mira-Bhayandar Creek Inundation Belt (38 km²)</option>
                    <option value="mumbai-metro">Mumbai Metropolitan Region (Full MMR)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Alert Severity Category</label>
                  <select 
                    className="form-select"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="Severe">Severe (Orange - Action Recommended)</option>
                    <option value="Extreme">Extreme (Red - Immediate Evacuation/Shelter)</option>
                    <option value="Watch">Watch (Yellow - Heightened Vigilance)</option>
                  </select>
                </div>
              </div>

              {/* Alert Content Preview */}
              <div className="form-group">
                <label className="form-label">Synthesized Alert Message (Multi-lingual SMS & Cell Broadcast)</label>
                <div className="alert-preview-textarea">
                  [MoES-NCMRWF / VVMC ALERT]: Severe cloudburst and flash flood precursor detected by SkyWatch AI Nowcasting. Heavy downpours (70-95 mm/hr) expected within 45 mins over Vasai-Virar. Avoid Vasai Creek Road & low-lying subways. Move to higher ground. Call 1077 for emergency assistance.
                </div>
              </div>

              {/* Broadcast Channels */}
              <div className="form-group">
                <label className="form-label">Multi-Modal Dissemination Channels</label>
                <div className="channels-grid">
                  <div 
                    className={`channel-checkbox-card ${selectedChannels.cellBroadcast ? 'checked' : ''}`}
                    onClick={() => toggleChannel('cellBroadcast')}
                  >
                    <Smartphone size={20} className="channel-icon" />
                    <div className="channel-text">
                      <span className="channel-name">Cell Broadcast (WEA)</span>
                      <span className="channel-sub">Geo-targeted sirens on all phones</span>
                    </div>
                  </div>

                  <div 
                    className={`channel-checkbox-card ${selectedChannels.ndrf ? 'checked' : ''}`}
                    onClick={() => toggleChannel('ndrf')}
                  >
                    <ShieldAlert size={20} className="channel-icon text-red" />
                    <div className="channel-text">
                      <span className="channel-name">NDRF & SDRF Hotline</span>
                      <span className="channel-sub">Automated tactical dispatch</span>
                    </div>
                  </div>

                  <div 
                    className={`channel-checkbox-card ${selectedChannels.sms ? 'checked' : ''}`}
                    onClick={() => toggleChannel('sms')}
                  >
                    <Users size={20} className="channel-icon text-cyan" />
                    <div className="channel-text">
                      <span className="channel-name">Telecom SMS Push</span>
                      <span className="channel-sub">Geo-fenced mobile subscribers</span>
                    </div>
                  </div>

                  <div 
                    className={`channel-checkbox-card ${selectedChannels.tvMedia ? 'checked' : ''}`}
                    onClick={() => toggleChannel('tvMedia')}
                  >
                    <Tv size={20} className="channel-icon text-amber" />
                    <div className="channel-text">
                      <span className="channel-name">Broadcast Media & DTH</span>
                      <span className="channel-sub">Emergency ticker banner</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Time & Precursor Summary */}
              <div className="dispatch-meta-strip">
                <div className="meta-pill">
                  <Clock size={14} />
                  <span>Lead Time: <strong>3h 20m</strong></span>
                </div>
                <div className="meta-pill">
                  <MapPin size={14} />
                  <span>Est. Reach: <strong>~425,000 citizens</strong></span>
                </div>
                <div className="meta-pill">
                  <AlertTriangle size={14} />
                  <span>Status: <strong>Verified by MTL Engine</strong></span>
                </div>
              </div>

              {dispatchProgress > 0 && dispatchProgress < 100 && (
                <div className="progress-bar-container">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${dispatchProgress}%` }}></div>
                  </div>
                  <span className="progress-label">Broadcasting across multi-agency gateways... {dispatchProgress}%</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="modal-footer">
                <button className="btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn-primary btn-dispatch-action" onClick={handleDispatch}>
                  <Send size={15} />
                  <span>Authorize & Broadcast Alert</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
