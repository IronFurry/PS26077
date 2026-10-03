import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Droplet, 
  Zap, 
  Home, 
  Car, 
  PhoneCall,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

export default function SafetyGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('flashflood'); // 'flashflood' | 'cloudburst' | 'thunderstorm'

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container safety-guide-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header header-blue">
          <div className="header-left-title">
            <BookOpen size={20} className="text-cyan" />
            <div>
              <h2 className="modal-title">Severe Weather Public Safety Guide</h2>
              <span className="modal-subtitle">Prepared in accordance with NDMA & MoES Disaster Guidelines</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="guide-tab-bar">
          <button 
            className={`guide-tab ${activeTab === 'flashflood' ? 'active' : ''}`}
            onClick={() => setActiveTab('flashflood')}
          >
            <Droplet size={15} />
            <span>Flash Floods</span>
          </button>
          <button 
            className={`guide-tab ${activeTab === 'cloudburst' ? 'active' : ''}`}
            onClick={() => setActiveTab('cloudburst')}
          >
            <AlertTriangle size={15} />
            <span>Cloudbursts</span>
          </button>
          <button 
            className={`guide-tab ${activeTab === 'thunderstorm' ? 'active' : ''}`}
            onClick={() => setActiveTab('thunderstorm')}
          >
            <Zap size={15} />
            <span>Severe Thunderstorms</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="modal-body-scrollable">
          {activeTab === 'flashflood' && (
            <div className="guide-content-section">
              <div className="guide-intro-banner">
                <h3>Flash Floods: Rapid Inundation Protocol</h3>
                <p>
                  Flash floods occur within 2 to 6 hours of excessive rainfall in hilly and low-lying coastal basins (such as Vasai Creek, Nalasopara subways, and Ulhas river catchments). Water levels can rise several feet in minutes.
                </p>
              </div>

              <div className="dos-donts-grid">
                <div className="dos-column">
                  <div className="column-title text-emerald">
                    <CheckCircle size={18} />
                    <span>WHAT TO DO</span>
                  </div>
                  <ul className="guide-list">
                    <li>Move immediately to higher ground or upper storeys of pucca buildings.</li>
                    <li>Turn off main electrical power switches and gas valves before floodwaters enter.</li>
                    <li>Keep an emergency kit ready: bottled water, torch, medicine, power bank, and ID documents in a waterproof pouch.</li>
                    <li>Monitor SkyWatch real-time radar and ward advisory updates continuously.</li>
                  </ul>
                </div>

                <div className="donts-column">
                  <div className="column-title text-red">
                    <XCircle size={18} />
                    <span>WHAT TO AVOID</span>
                  </div>
                  <ul className="guide-list">
                    <li>NEVER walk or drive through moving floodwaters. Just 15 cm of moving water can knock you down, and 30 cm can float a car.</li>
                    <li>Avoid underground subways, underpasses, and basement parking lots.</li>
                    <li>Do not touch fallen power lines or submerged transformers.</li>
                    <li>Never consume flood-contaminated tap water without boiling.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloudburst' && (
            <div className="guide-content-section">
              <div className="guide-intro-banner">
                <h3>Cloudbursts: High-Intensity Rainfall Response</h3>
                <p>
                  A cloudburst produces sudden, concentrated precipitation exceeding 100 mm/hour within a small geographic area (10-30 km²). SkyWatch captures IWV moisture pools to provide 2 to 6 hours lead time.
                </p>
              </div>

              <div className="dos-donts-grid">
                <div className="dos-column">
                  <div className="column-title text-emerald">
                    <CheckCircle size={18} />
                    <span>WHAT TO DO</span>
                  </div>
                  <ul className="guide-list">
                    <li>Stay indoors inside structurally sound buildings.</li>
                    <li>Clear terrace and courtyard drains to prevent structural load pooling.</li>
                    <li>If stranded outdoors, seek shelter in reinforced buildings away from nullahs and natural drains.</li>
                    <li>Maintain contact with family members and share live coordinates before cellular towers get congested.</li>
                  </ul>
                </div>

                <div className="donts-column">
                  <div className="column-title text-red">
                    <XCircle size={18} />
                    <span>WHAT TO AVOID</span>
                  </div>
                  <ul className="guide-list">
                    <li>Do not take shelter under tin sheds, billboards, or weakened structures.</li>
                    <li>Avoid parking vehicles near storm water drains or natural creek banks.</li>
                    <li>Avoid spreading unverified rumors on social media; rely on MoES/NCMRWF official SkyWatch alerts.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'thunderstorm' && (
            <div className="guide-content-section">
              <div className="guide-intro-banner">
                <h3>Severe Thunderstorms &amp; Lightning Safety</h3>
                <p>
                  Severe thunderstorms are fueled by high CAPE values (&gt;2500 J/kg) resulting in cloud-to-ground lightning, violent wind gusts (&gt;60 km/h), and intense localized downpours.
                </p>
              </div>

              <div className="dos-donts-grid">
                <div className="dos-column">
                  <div className="column-title text-emerald">
                    <CheckCircle size={18} />
                    <span>WHAT TO DO</span>
                  </div>
                  <ul className="guide-list">
                    <li>Follow the 30/30 Rule: If time between lightning flash and thunder is less than 30 seconds, seek indoor shelter immediately.</li>
                    <li>Unplug delicate electrical appliances, computers, and televisions.</li>
                    <li>If caught in open terrain with no shelter, crouch down low on balls of your feet with hands on knees (minimize contact with ground).</li>
                  </ul>
                </div>

                <div className="donts-column">
                  <div className="column-title text-red">
                    <XCircle size={18} />
                    <span>WHAT TO AVOID</span>
                  </div>
                  <ul className="guide-list">
                    <li>NEVER seek shelter under tall, isolated trees or metallic light poles.</li>
                    <li>Do not hold umbrellas with metal shafts in open areas during active lightning.</li>
                    <li>Avoid using corded landline phones or washing hands in plumbing during severe lightning strikes.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Helplines Callout */}
          <div className="guide-helpline-box">
            <h4>National & State Emergency Toll-Free Helplines</h4>
            <div className="helpline-grid-3">
              <div className="h-box">
                <span className="h-num">1070</span>
                <span className="h-label">National Disaster Management (NDMA)</span>
              </div>
              <div className="h-box">
                <span className="h-num">1077</span>
                <span className="h-label">Maharashtra State Disaster Control</span>
              </div>
              <div className="h-box">
                <span className="h-num">112</span>
                <span className="h-label">All-in-One Emergency Response (ERSS)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>I Understand</button>
        </div>
      </div>
    </div>
  );
}
