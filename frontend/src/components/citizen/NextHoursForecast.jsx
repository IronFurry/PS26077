import React from 'react';
import { Clock, MapPin, CloudRain, CloudLightning, CloudDrizzle, CloudSun, Zap } from 'lucide-react';

export default function NextHoursForecast({ activeLocation }) {
  const forecastSlots = [
    { time: 'Now', temp: '27°', desc: 'Light rain', icon: 'drizzle' },
    { time: '+1 hr', temp: '25°', desc: 'Heavy rain', icon: 'heavyRain', isAlert: true },
    { time: '+2 hr', temp: '24°', desc: 'Thunderstorm', icon: 'storm', isPeak: true, isAlert: true },
    { time: '+3 hr', temp: '25°', desc: 'Rain easing', icon: 'easing', isAlert: true },
    { time: '+4 hr', temp: '26°', desc: 'Passing rain', icon: 'rain' },
    { time: '+5 hr', temp: '27°', desc: 'Light shower', icon: 'drizzle' },
    { time: '+6 hr', temp: '28°', desc: 'Partly sunny', icon: 'easing' },
  ];

  const renderIcon = (type) => {
    switch (type) {
      case 'drizzle':
        return (
          <div className="weather-glyph drizzle-glyph">
            <CloudDrizzle size={24} className="glyph-cloud" />
          </div>
        );
      case 'rain':
        return (
          <div className="weather-glyph rain-glyph">
            <CloudRain size={24} className="glyph-cloud" />
          </div>
        );
      case 'heavyRain':
        return (
          <div className="weather-glyph heavy-glyph">
            <CloudRain size={26} className="glyph-cloud" />
          </div>
        );
      case 'storm':
        return (
          <div className="weather-glyph storm-glyph">
            <CloudLightning size={26} className="glyph-cloud pulse" />
          </div>
        );
      case 'easing':
        return (
          <div className="weather-glyph easing-glyph">
            <CloudSun size={24} className="glyph-cloud" />
          </div>
        );
      default:
        return <CloudRain size={24} />;
    }
  };

  return (
    <div className="next-hours-card">
      <div className="next-hours-header">
        <div className="title-with-icon">
          <Clock size={16} className="clock-icon" />
          <span className="card-heading">2–6 Hours Prediction Horizon</span>
          <span className="nowcast-lead-pill" title="MoES / NCMRWF High-Resolution 2-6 Hours Nowcast Target">
            <Zap size={11} />
            <span>2–6h NOWCAST</span>
          </span>
        </div>
        <div className="location-pin-sub">
          <MapPin size={13} />
          <span>{activeLocation?.name || 'Vasai Gaon'}</span>
        </div>
      </div>

      <div className="hourly-slots-grid">
        {forecastSlots.map((slot) => {
          const isLeadTimeWindow = ['+2 hr', '+3 hr', '+4 hr', '+5 hr', '+6 hr'].includes(slot.time);
          return (
            <div 
              key={slot.time} 
              className={`hourly-slot-col ${slot.isPeak ? 'slot-storm-alert' : ''} ${isLeadTimeWindow ? 'slot-lead-window' : ''}`}
            >
              <div className="slot-time-row">
                <span className="slot-time">{slot.time}</span>
                {slot.isPeak && <span className="slot-peak-tag">PEAK</span>}
              </div>
              <div className="slot-icon-box">
                {renderIcon(slot.icon)}
              </div>
              <span className="slot-desc">{slot.desc}</span>
              <span className="slot-temp">{slot.temp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

