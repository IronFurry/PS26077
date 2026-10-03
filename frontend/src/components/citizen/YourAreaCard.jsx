import React from 'react';
import { MapPin, AlertTriangle, Waves, Zap, ChevronRight } from 'lucide-react';

export default function YourAreaCard({ activeLocation, onOpenAlertDetails }) {
  return (
    <div className="your-area-card">
      <div className="your-area-header">
        <div className="area-icon-title">
          <MapPin size={16} className="text-blue" />
          <div className="area-labels">
            <span className="card-heading">Your Area</span>
            <span className="area-subname">{activeLocation?.name || 'Vasai Gaon'}</span>
          </div>
        </div>
      </div>

      {/* Warning banner */}
      <div className="area-warning-banner" onClick={onOpenAlertDetails}>
        <div className="warning-content-left">
          <div className="warning-triangle-icon">
            <AlertTriangle size={18} />
          </div>
          <div className="warning-text-lines">
            <span className="warning-title">Moderate Risk</span>
            <span className="warning-desc">Heavy rainfall approaching</span>
          </div>
        </div>
        <ChevronRight size={17} className="warning-chevron" />
      </div>

      {/* Bottom mini risk indicators */}
      <div className="area-mini-risks">
        <div className="mini-risk-item flood-risk">
          <div className="mini-icon-circle green-circle">
            <Waves size={14} />
          </div>
          <div className="mini-risk-labels">
            <span className="mini-risk-label">Flood risk</span>
            <span className="mini-risk-value green-text">Low</span>
          </div>
        </div>

        <div className="mini-risk-item storm-risk">
          <div className="mini-icon-circle amber-circle">
            <Zap size={14} />
          </div>
          <div className="mini-risk-labels">
            <span className="mini-risk-label">Thunderstorm risk</span>
            <span className="mini-risk-value amber-text">Moderate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
