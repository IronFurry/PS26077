import React from 'react';
import { 
  CloudRain, 
  ChevronRight, 
  AlertOctagon, 
  MapPin, 
  Info, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle, 
  Droplet, 
  Home, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { SEVERE_ALERT } from '../../data/weatherData';

export default function RightAlertPanel({ 
  onOpenAlertDetails, 
  onOpenXai, 
  onOpenSafetyGuide,
  activeLocation 
}) {
  return (
    <div className="right-alert-column">
      {/* Top weather condition header */}
      <div className="current-condition-bar">
        <div className="curr-left">
          <div className="curr-icon-wrap">
            <CloudRain size={28} className="curr-cloud-icon" />
          </div>
          <div className="curr-temp-stack">
            <span className="curr-temp">27°C</span>
            <span className="curr-desc">Light rain</span>
          </div>
        </div>

        <div className="curr-right" onClick={onOpenAlertDetails}>
          <div className="curr-next-stack">
            <span className="curr-next-label">2–6h Nowcast</span>
            <span className="curr-next-pred">Heavy rain peak (+2h)</span>
          </div>
          <ChevronRight size={16} className="curr-next-chevron" />
        </div>
      </div>

      {/* Critical Severe Rainfall Alert Card */}
      <div className="severe-alert-card">
        <div className="severe-alert-top">
          <div className="severe-alert-tag">
            <ShieldAlert size={13} className="text-red-400" />
            <span className="severe-tag-text">{SEVERE_ALERT.title}</span>
          </div>
          <span className="severe-time-ago">{SEVERE_ALERT.timestamp}</span>
        </div>

        <div className="severe-alert-body">
          <div className="severe-icon-badge">
            <CloudRain size={26} className="text-red-400" />
          </div>
          <div className="severe-body-text">
            <h3 className="severe-heading">{SEVERE_ALERT.headline}</h3>
            <div className="severe-meta-row">
              <MapPin size={13} className="meta-pin-icon" />
              <span>{SEVERE_ALERT.eta} • {SEVERE_ALERT.distance}</span>
            </div>
          </div>
        </div>

        <div className="severe-alert-action">
          <button className="view-details-btn" onClick={onOpenAlertDetails}>
            <span>View Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Why this alert? (XAI citizen explanation) */}
      <div className="info-card why-alert-card">
        <div className="info-card-header">
          <div className="info-icon-circle blue-circle">
            <Info size={15} />
          </div>
          <h4 className="info-title">Why this alert?</h4>
        </div>
        <p className="info-text">
          {SEVERE_ALERT.explanation}
        </p>
        <button className="info-action-link" onClick={onOpenXai}>
          <span>Learn more</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* What should you do? */}
      <div className="info-card what-to-do-card">
        <div className="info-card-header">
          <div className="info-icon-circle blue-circle">
            <ShieldCheck size={16} />
          </div>
          <h4 className="info-title">What should you do?</h4>
        </div>

        <div className="safety-checklist">
          <div className="safety-item">
            <div className="safety-item-icon">
              <AlertTriangle size={15} className="safety-amber" />
            </div>
            <span className="safety-text">Avoid low-lying roads and flooded areas</span>
          </div>

          <div className="safety-item">
            <div className="safety-item-icon">
              <Droplet size={15} className="safety-blue" />
            </div>
            <span className="safety-text">Don't cross flowing water</span>
          </div>

          <div className="safety-item">
            <div className="safety-item-icon">
              <Home size={15} className="safety-slate" />
            </div>
            <span className="safety-text">Stay indoors if possible</span>
          </div>
        </div>

        <button className="info-action-link" onClick={onOpenSafetyGuide}>
          <span>View full safety guide</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Areas to Avoid */}
      <div className="info-card areas-avoid-card">
        <div className="areas-header-row">
          <div className="areas-title-left">
            <AlertTriangle size={16} className="text-red" />
            <h4 className="info-title">Areas to Avoid</h4>
          </div>
          <button className="areas-count-link" onClick={onOpenAlertDetails}>
            <span>3 locations near you</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="areas-list">
          {SEVERE_ALERT.areasToAvoid.map((area, idx) => (
            <div key={idx} className="area-item" onClick={onOpenAlertDetails}>
              <div className="area-item-pin">
                <MapPin size={16} className="area-pin-red" />
              </div>
              <div className="area-item-content">
                <span className="area-item-name">{area.name}</span>
                <span className="area-item-reason">{area.reason}</span>
              </div>
              <ChevronRight size={15} className="area-item-arrow" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
