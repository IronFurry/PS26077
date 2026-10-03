import React from 'react';
import { Clock, MapPin, CloudRain, CloudLightning, CloudDrizzle, CloudSun } from 'lucide-react';

export default function NextHoursForecast({ activeLocation }) {
  const forecastSlots = [
    { time: 'Now', temp: '27°', desc: 'Light rain', icon: 'drizzle' },
    { time: '30 min', temp: '26°', desc: 'Moderate rain', icon: 'rain' },
    { time: '1 hr', temp: '25°', desc: 'Heavy rain', icon: 'heavyRain' },
    { time: '2 hr', temp: '24°', desc: 'Thunderstorm likely', icon: 'storm' },
    { time: '3 hr', temp: '26°', desc: 'Rain easing', icon: 'easing' },
  ];

  const renderIcon = (type) => {
    switch (type) {
      case 'drizzle':
        return (
          <div className="weather-glyph drizzle-glyph">
            <CloudDrizzle size={26} className="glyph-cloud" />
          </div>
        );
      case 'rain':
        return (
          <div className="weather-glyph rain-glyph">
            <CloudRain size={26} className="glyph-cloud" />
          </div>
        );
      case 'heavyRain':
        return (
          <div className="weather-glyph heavy-glyph">
            <CloudRain size={28} className="glyph-cloud" />
          </div>
        );
      case 'storm':
        return (
          <div className="weather-glyph storm-glyph">
            <CloudLightning size={28} className="glyph-cloud pulse" />
          </div>
        );
      case 'easing':
        return (
          <div className="weather-glyph easing-glyph">
            <CloudSun size={26} className="glyph-cloud" />
          </div>
        );
      default:
        return <CloudRain size={26} />;
    }
  };

  return (
    <div className="next-hours-card">
      <div className="next-hours-header">
        <div className="title-with-icon">
          <Clock size={16} className="clock-icon" />
          <span className="card-heading">Next 3 Hours</span>
        </div>
        <div className="location-pin-sub">
          <MapPin size={13} />
          <span>{activeLocation?.name || 'Vasai Gaon'}</span>
        </div>
      </div>

      <div className="hourly-slots-grid">
        {forecastSlots.map((slot) => (
          <div key={slot.time} className={`hourly-slot-col ${slot.time === '2 hr' ? 'slot-storm-alert' : ''}`}>
            <span className="slot-time">{slot.time}</span>
            <div className="slot-icon-box">
              {renderIcon(slot.icon)}
            </div>
            <span className="slot-desc">{slot.desc}</span>
            <span className="slot-temp">{slot.temp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
