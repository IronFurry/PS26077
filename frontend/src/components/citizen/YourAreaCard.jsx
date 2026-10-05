import React from 'react';
import { MapPin, AlertTriangle, Waves, Zap, ChevronRight, Crosshair } from 'lucide-react';

export default function YourAreaCard({ activeLocation, onOpenAlertDetails, onDetectGps, isLocatingGps }) {
  return (
    <div className="your-area-card">
      <div className="your-area-header">
        <div className="area-icon-title">
          <MapPin size={16} className="text-blue" />
          <div className="area-labels">
            <span className="card-heading">Your Area</span>
            <span className="area-subname">
              {activeLocation?.name || 'Vasai Gaon'}
              {activeLocation?.isGps && <span className="gps-pill-badge">GPS</span>}
            </span>
          </div>
        </div>

        {onDetectGps && (
          <button
            type="button"
            className={`your-area-gps-btn ${isLocatingGps ? 'locating' : ''}`}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await onDetectGps(true);
              } catch (err) {
                console.log('GPS error:', err);
              }
            }}
            title="Detect my location via GPS"
          >
            <Crosshair size={13} className={isLocatingGps ? 'spin-fast text-cyan' : ''} />
            <span>{isLocatingGps ? 'Locating…' : 'Locate Me'}</span>
          </button>
        )}
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
