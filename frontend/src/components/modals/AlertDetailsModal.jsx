import React from 'react';
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Droplet, 
  Wind, 
  Navigation, 
  CheckCircle2, 
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { SEVERE_ALERT } from '../../data/weatherData';

export default function AlertDetailsModal({ isOpen, onClose, activeLocation }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container alert-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header header-crimson">
          <div className="header-left-title">
            <ShieldAlert size={20} className="text-red-400" />
            <div>
              <h2 className="modal-title">{SEVERE_ALERT.title}</h2>
              <span className="modal-subtitle">Issued by NCMRWF AI Nowcasting Engine • {SEVERE_ALERT.timestamp}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body-scrollable">
          {/* Top Banner */}
          <div className="alert-hero-banner">
            <div className="hero-text-col">
              <h3 className="hero-headline">{SEVERE_ALERT.headline}</h3>
              <p className="hero-sub">
                Target Zone: <strong>{activeLocation?.name || 'Vasai Gaon'}</strong> and surrounding 4.5 km radius.
              </p>
              <div className="hero-tags">
                <span className="hero-tag tag-time">
                  <Clock size={13} /> {SEVERE_ALERT.eta}
                </span>
                <span className="hero-tag tag-distance">
                  <MapPin size={13} /> {SEVERE_ALERT.distance}
                </span>
                <span className="hero-tag tag-severity">
                  <AlertTriangle size={13} /> High Intensity (65-90 mm/hr)
                </span>
              </div>
            </div>
          </div>

          {/* Meteorological Trigger Summary (Explainable AI) */}
          <div className="section-block">
            <h4 className="section-heading">
              <ShieldAlert size={16} className="text-cyan" />
              <span>AI Atmospheric Precursors Detected</span>
            </h4>
            <div className="precursors-mini-grid">
              <div className="precursor-mini-box">
                <span className="p-label">Water Vapor (IWV)</span>
                <span className="p-val text-cyan">{SEVERE_ALERT.xaiDetails.iwvSurge}</span>
              </div>
              <div className="precursor-mini-box">
                <span className="p-label">Cloud Top Drop</span>
                <span className="p-val text-red">{SEVERE_ALERT.xaiDetails.cttDropRate}</span>
              </div>
              <div className="precursor-mini-box">
                <span className="p-label">Thermal CAPE</span>
                <span className="p-val text-amber">{SEVERE_ALERT.xaiDetails.capeCin}</span>
              </div>
              <div className="precursor-mini-box">
                <span className="p-label">Flash Flood DEM Risk</span>
                <span className="p-val text-blue">{SEVERE_ALERT.xaiDetails.demSlopeRisk}</span>
              </div>
            </div>
          </div>

          {/* Areas to Avoid Right Now */}
          <div className="section-block">
            <h4 className="section-heading">
              <MapPin size={16} className="text-red" />
              <span>Hyper-Local Inundation Hotspots to Avoid</span>
            </h4>
            <div className="hotspots-modal-list">
              {SEVERE_ALERT.areasToAvoid.map((area, idx) => (
                <div key={idx} className="hotspot-card">
                  <div className="hotspot-left">
                    <span className="hotspot-marker">📍</span>
                    <div>
                      <strong className="hotspot-name">{area.name}</strong>
                      <span className="hotspot-reason">{area.reason}</span>
                    </div>
                  </div>
                  <div className="hotspot-right">
                    <span className="hotspot-status">{area.status}</span>
                    <span className="hotspot-dist">{area.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Citizen Safety Protocol */}
          <div className="section-block">
            <h4 className="section-heading">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Immediate Actions for Residents</span>
            </h4>
            <ul className="modal-checklist">
              {SEVERE_ALERT.recommendedActions.map((action) => (
                <li key={action.id} className="checklist-li">
                  <CheckCircle2 size={16} className="text-emerald check-icon" />
                  <span>{action.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="helpline-bar">
            <div className="helpline-item">
              <PhoneCall size={14} />
              <span>Disaster Helpline: <strong>1077</strong></span>
            </div>
            <div className="helpline-item">
              <PhoneCall size={14} />
              <span>NDRF Operations: <strong>1070</strong></span>
            </div>
            <div className="helpline-item">
              <PhoneCall size={14} />
              <span>Vasai-Virar Disaster Cell: <strong>0250-2525100</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={onClose}>Acknowledge & Set Alert Reminders</button>
        </div>
      </div>
    </div>
  );
}
