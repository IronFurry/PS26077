import RiskMap from '../map/RiskMap';

/**
 * WeatherMap — Citizen Portal Map Panel
 * Renders the reusable MapLibre GL RiskMap component in citizen mode.
 */
export default function WeatherMap({ activeLocation, onSelectLocation, onOpenXai }) {
  return (
    <div className="weather-map-card" style={{ padding: 0, overflow: 'hidden' }}>
      <RiskMap
        mode="citizen"
        activeLocation={activeLocation}
        onSelectLocation={onSelectLocation}
        onOpenXai={onOpenXai}
      />
    </div>
  );
}
