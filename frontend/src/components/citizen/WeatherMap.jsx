import React from 'react';
import LiveMap from '../map/LiveMap';

/**
 * WeatherMap — Citizen Portal Map Panel
 * Wraps the real react-leaflet LiveMap component.
 * The old SVG-based implementation has been replaced with the interactive map.
 */
export default function WeatherMap({ activeLocation }) {
  return (
    <div className="weather-map-card" style={{ padding: 0, overflow: 'hidden' }}>
      <LiveMap activeLocation={activeLocation} portalMode="citizen" />
    </div>
  );
}
