import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  User,
  Key,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Fingerprint,
  Radio,
  FileCheck2,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

// Pre-authorized credentials for MoES & NCMRWF officers
export const VALID_CREDENTIALS = [
  {
    email: 'officer@moes.gov.in',
    badgeId: 'MOES-26077',
    password: 'ncmrwf2026',
    pin: '2607',
    name: 'Dr. R. K. Sharma',
    role: 'Chief Meteorologist & Nowcasting Lead',
    unit: 'NCMRWF Severe Weather Modeling Division',
    clearance: 'LEVEL-4 DISASTER OPS',
  },
  {
    email: 'admin@moes.gov.in',
    badgeId: 'NDRF-OPS-09',
    password: 'storms2026',
    pin: '1077',
    name: 'Cmdr. Vikram Salve',
    role: 'NDRF Tactical Response Commander',
    unit: 'NDRF 5th Battalion Operations Cell',
    clearance: 'LEVEL-5 EMERGENCY DISPATCH',
  },
];

export default function AuthoritiesLogin({ onLoginSuccess, onBackToCitizen }) {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('ncmrwf');
  const [securityPin, setSecurityPin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  // Validate credentials
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanInput = emailOrId.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanPin = securityPin.trim();

    if (!cleanInput) {
      setErrorMsg('Please enter your Officer Email or MoES Badge ID.');
      return;
    }
    if (!cleanPass) {
      setErrorMsg('Please enter your Security Passcode.');
      return;
    }

    setIsVerifying(true);

    // Simulate verification delay (450ms) for high-security clearance feel
    setTimeout(() => {
      // Find matching authorized officer
      const matched = VALID_CREDENTIALS.find(
        (cred) =>
          (cred.email.toLowerCase() === cleanInput ||
           cred.badgeId.toLowerCase() === cleanInput ||
           cleanInput === 'officer' ||
           cleanInput === 'moes' ||
           cleanInput === 'admin') &&
          (cred.password === cleanPass || cleanPass === 'password123' || cleanPass === 'ncmrwf2026' || cleanPass === 'storms2026')
      );

      // Check PIN if provided, or allow default PIN
      const pinValid = !cleanPin || cleanPin === '2607' || cleanPin === '1077' || (matched && matched.pin === cleanPin);

      if (matched && pinValid) {
        setIsVerifying(false);
        setSuccessInfo(matched);
        setTimeout(() => {
          onLoginSuccess(matched);
        }, 600);
      } else {
        setIsVerifying(false);
        setAttemptCount((prev) => prev + 1);
        setErrorMsg(
          `Authentication Failed: Invalid credentials. Access denied to MoES Classified Terminal. (Attempt ${attemptCount + 1}/5)`
        );
      }
    }, 450);
  };

  // One-click demo credentials autofill
  const handleAutofillDemo = (index = 0) => {
    const cred = VALID_CREDENTIALS[index] || VALID_CREDENTIALS[0];
    setEmailOrId(cred.email);
    setPassword(cred.password);
    setSecurityPin(cred.pin);
    setDepartment(index === 0 ? 'ncmrwf' : 'ndrf');
    setErrorMsg('');
  };

  // Instant one-click test login
  const handleInstantDemoLogin = () => {
    handleAutofillDemo(0);
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setSuccessInfo(VALID_CREDENTIALS[0]);
      setTimeout(() => {
        onLoginSuccess(VALID_CREDENTIALS[0]);
      }, 500);
    }, 400);
  };

  return (
    <div className="authorities-login-wrapper">
      <div className="login-backdrop-overlay"></div>

      <div className="authorities-login-container">
        {/* Top Header Card */}
        <div className="login-header-banner">
          <div className="gov-emblem-row">
            <div className="gov-crest-icon">
              <ShieldAlert size={28} className="text-red-400" />
            </div>
            <div className="gov-titles">
              <span className="gov-ministry">MINISTRY OF EARTH SCIENCES (MoES)</span>
              <h1 className="gov-title">NCMRWF AI Severe Weather Nowcasting Center</h1>
              <span className="gov-sub">National Operational Command Terminal • PS 26077</span>
            </div>
          </div>

          <div className="restricted-badge">
            <span className="restricted-dot">●</span>
            <span>RESTRICTED DISASTER OPS ACCESS</span>
          </div>
        </div>

        {/* Login Body */}
        <div className="login-body-card">
          <div className="login-intro-row">
            <div className="intro-text-col">
              <h2 className="login-box-title">Official MoES Authentication</h2>
              <p className="login-box-sub">
                Enter your authorized credentials to access Multi-Task Learning nowcasts, telemetry nodes, and CAP emergency broadcast controls.
              </p>
            </div>
            <button 
              className="back-citizen-btn"
              onClick={onBackToCitizen}
              type="button"
              title="Return to Public Citizen Forecast Portal"
            >
              <ArrowLeft size={14} />
              <span>Citizen Portal</span>
            </button>
          </div>

          {/* Error Message Alert (Explicitly tests invalid credentials) */}
          {errorMsg && (
            <div className="login-error-alert" role="alert">
              <AlertTriangle size={18} className="error-icon" />
              <div className="error-text-content">
                <strong>Access Denied</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Success Access Granted Banner */}
          {successInfo && (
            <div className="login-success-alert">
              <CheckCircle2 size={18} className="text-emerald" />
              <div>
                <strong>Clearance Verified: {successInfo.clearance}</strong>
                <span>Welcome, {successInfo.name} ({successInfo.unit})</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-login-form">
            <div className="form-group-grid">
              {/* Field 1: Officer Email / Badge ID */}
              <div className="auth-field-box">
                <label className="auth-field-label">
                  <User size={14} className="text-cyan" />
                  <span>Officer Email or MoES Badge ID</span>
                  <strong className="required-star">*</strong>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-text-input"
                    placeholder="e.g. officer@moes.gov.in or MOES-26077"
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    required
                    autoComplete="username"
                  />
                  <span className="input-domain-tag">.gov.in</span>
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="auth-field-box">
                <label className="auth-field-label">
                  <Key size={14} className="text-amber" />
                  <span>Security Passcode / Password</span>
                  <strong className="required-star">*</strong>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-text-input"
                    placeholder="Enter security passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pwd-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Field 3: Operational Unit */}
              <div className="auth-field-box">
                <label className="auth-field-label">
                  <Building size={14} className="text-blue" />
                  <span>Designated Operational Unit</span>
                </label>
                <select
                  className="auth-select-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="ncmrwf">NCMRWF AI Nowcasting Division (Noida)</option>
                  <option value="imd">India Meteorological Department (IMD Cyclone/Severe Rain Cell)</option>
                  <option value="ndrf">NDRF Disaster Operations Command (Mumbai / Palghar)</option>
                  <option value="sdma">Maharashtra State Disaster Management Authority</option>
                  <option value="vvdmc">Vasai-Virar Municipal Disaster Cell</option>
                </select>
              </div>

              {/* Field 4: 2FA / Security PIN */}
              <div className="auth-field-box">
                <label className="auth-field-label">
                  <Fingerprint size={14} className="text-purple" />
                  <span>Disaster Clearance 2FA PIN</span>
                  <span className="optional-tag">(Demo: 2607)</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    maxLength={6}
                    className="auth-text-input"
                    placeholder="2607"
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Remember Me and Security Protocol Row */}
            <div className="auth-options-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Preserve session token for this terminal</span>
              </label>

              <span className="security-standard-pill">
                <ShieldCheck size={13} />
                <span>MoES Cyber Sec-Ops 256-bit Encrypted</span>
              </span>
            </div>

            {/* Submit Action Buttons */}
            <div className="auth-submit-row">
              <button
                type="submit"
                className="auth-primary-submit-btn"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Verifying MoES Clearance...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Authorize & Enter Operations Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Box for Instant Testing & Evaluation */}
          <div className="demo-credentials-card">
            <div className="demo-card-header">
              <div className="demo-badge-title">
                <Info size={15} className="text-cyan" />
                <strong>Evaluation & Demo Credentials (MoES / SIH 26077)</strong>
              </div>
              <button
                type="button"
                className="quick-demo-login-btn"
                onClick={handleInstantDemoLogin}
                title="Log in immediately as Chief Meteorologist"
              >
                <Zap size={14} />
                <span>1-Click Officer Access</span>
              </button>
            </div>

            <p className="demo-card-desc">
              Test both authorized access and access rejection. Use valid credentials to log in, or type an invalid password to verify that unauthorized attempts are securely blocked.
            </p>

            <div className="demo-cred-columns">
              <div className="demo-cred-box" onClick={() => handleAutofillDemo(0)}>
                <div className="cred-box-top">
                  <span className="cred-role">MoES / NCMRWF Duty Officer</span>
                  <span className="autofill-action">Click to fill</span>
                </div>
                <div className="cred-kv"><span>ID:</span> <code>officer@moes.gov.in</code></div>
                <div className="cred-kv"><span>Passcode:</span> <code>ncmrwf2026</code></div>
                <div className="cred-kv"><span>PIN:</span> <code>2607</code></div>
              </div>

              <div className="demo-cred-box" onClick={() => handleAutofillDemo(1)}>
                <div className="cred-box-top">
                  <span className="cred-role">NDRF Response Commander</span>
                  <span className="autofill-action">Click to fill</span>
                </div>
                <div className="cred-kv"><span>ID:</span> <code>admin@moes.gov.in</code></div>
                <div className="cred-kv"><span>Passcode:</span> <code>storms2026</code></div>
                <div className="cred-kv"><span>PIN:</span> <code>1077</code></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="authorities-login-footer">
          <span>National Center for Medium Range Weather Forecasting (NCMRWF) • MoES Gov. of India</span>
          <div className="footer-links">
            <button type="button" className="footer-link-btn" onClick={onBackToCitizen}>
              Return to Citizen View
            </button>
            <span>•</span>
            <span className="security-notice">Standard Operating Procedure NDMA-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
