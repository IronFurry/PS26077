// Real-time meteorological & nowcasting data for SIH Problem Statement 26077
// Ministry of Earth Sciences (MoES) & NCMRWF

export const LOCATIONS = [
  { id: 'vasai', name: 'Vasai Gaon', lat: 19.3639, lon: 72.8093, risk: 'Moderate', district: 'Palghar / MMR' },
  { id: 'nalasopara', name: 'Nalasopara West', lat: 19.4167, lon: 72.7989, risk: 'Severe', district: 'Palghar / MMR' },
  { id: 'virar', name: 'Virar South', lat: 19.4700, lon: 72.8000, risk: 'Heavy', district: 'Palghar / MMR' },
  { id: 'mumbai', name: 'Mumbai Suburbs', lat: 19.0760, lon: 72.8777, risk: 'Moderate', district: 'Mumbai' },
  { id: 'thane', name: 'Thane North', lat: 19.2183, lon: 72.9781, risk: 'Moderate', district: 'Thane' },
];

export const HOURLY_FORECAST = [
  { time: 'Now', temp: 27, condition: 'Light rain', icon: 'CloudDrizzle', precipitationMm: 2.4, rainProbability: 85, alert: false },
  { time: '30 min', temp: 26, condition: 'Moderate rain', icon: 'CloudRain', precipitationMm: 12.8, rainProbability: 92, alert: true },
  { time: '1 hr', temp: 25, condition: 'Heavy rain', icon: 'CloudRainWind', precipitationMm: 34.5, rainProbability: 96, alert: true },
  { time: '2 hr', temp: 24, condition: 'Thunderstorm likely', icon: 'CloudLightning', precipitationMm: 58.2, rainProbability: 98, alert: true },
  { time: '3 hr', temp: 26, condition: 'Rain easing', icon: 'CloudSunRain', precipitationMm: 14.1, rainProbability: 60, alert: false },
  { time: '4 hr', temp: 27, condition: 'Intermittent Showers', icon: 'CloudDrizzle', precipitationMm: 4.8, rainProbability: 40, alert: false },
];

export const SEVERE_ALERT = {
  title: 'SEVERE RAINFALL ALERT',
  timestamp: '12 min ago',
  headline: 'Heavy rainfall is expected near you',
  eta: 'Likely within 45 minutes',
  distance: '3.2 km away',
  type: 'Cloudburst & Flash Flood Precursor',
  severity: 'Severe',
  explanation: 'Our system detected rapidly developing storm clouds and increasing moisture levels in your area, which can lead to heavy rainfall.',
  xaiDetails: {
    iwvSurge: '+14.2 g/kg/hr (High Moisture Fuel)',
    cttDropRate: '-18.5°C in 15 mins (Rapid Updraft Core)',
    capeCin: '3,240 J/kg CAPE (Severe Buoyancy)',
    convergence: '6.8 × 10⁻⁵ s⁻¹ (Low-level wind trigger)',
    demSlopeRisk: 'High (Runoff channeled into low-lying natural basins)',
  },
  recommendedActions: [
    { id: 1, text: 'Avoid low-lying roads and flooded areas', icon: 'AlertTriangle' },
    { id: 2, text: "Don't cross flowing water", icon: 'Droplets' },
    { id: 3, text: 'Stay indoors if possible', icon: 'Home' },
    { id: 4, text: 'Keep mobile devices charged and emergency numbers ready', icon: 'Smartphone' },
  ],
  areasToAvoid: [
    {
      name: 'Vasai Creek Road',
      reason: 'Flood risk & Tidal Backwater Surge',
      status: 'Water rising (0.4m)',
      severity: 'high',
      distance: '1.8 km'
    },
    {
      name: 'Low-lying section near Nalasopara',
      reason: 'Water accumulation & Subway Inundation',
      status: 'Traffic blocked',
      severity: 'high',
      distance: '3.4 km'
    },
    {
      name: 'Gaon Junction',
      reason: 'Heavy rainfall runoff',
      status: 'Slow moving traffic',
      severity: 'medium',
      distance: '1.2 km'
    }
  ]
};

// PS 26077 - Ministry of Earth Sciences Precursor Telemetry Data
export const OFFICIALS_PRECURSORS = {
  moistureFuel: {
    name: 'Integrated Water Vapor (IWV)',
    currentValue: '62.8 mm',
    deltaRate: '+14.2 g/kg/hr',
    source: 'INSAT-3D/3DR WV Channels (MOSDAC)',
    status: 'Critical Surge',
    threshold: '> 55.0 mm',
    description: 'Tracks rapid spatial and temporal accumulations of IWV identifying concentrated moisture pools required for heavy precipitation.'
  },
  instabilityEnergy: {
    name: 'Atmospheric Instability (CAPE / CIN)',
    capeValue: '3,240 J/kg',
    cinValue: '-12 J/kg',
    source: 'IMDAA Reanalysis Thermodynamic Profile',
    status: 'Explosive Buoyancy',
    threshold: 'CAPE > 2500 J/kg & CIN > -25 J/kg',
    description: 'Assesses thermal buoyancy profile. High CAPE with rapidly eroding CIN indicates impending violent vertical convective updrafts.'
  },
  kinematicsLift: {
    name: 'Kinematics & Lift (Convergence & Shear)',
    convergenceValue: '7.4 × 10⁻⁵ s⁻¹',
    windShearValue: '26.8 m/s (0-6 km)',
    source: 'IMDAA U/V Components & Radar QPE',
    status: 'High Low-Level Lift',
    threshold: 'Convergence > 5.0 × 10⁻⁵ s⁻¹',
    description: 'Low-level wind vectors colliding at surface forcing air upward; vertical shear indicates quasi-stationary storm cell potential.'
  },
  observationalSignature: {
    name: 'Cloud Top Temperature (CTT) Drop Rate',
    currentRate: '-19.4°C / 15 min',
    coreTemp: '-72.8°C (Deep Convection)',
    source: 'INSAT-3D/3DR Thermal Infrared (TIR)',
    status: 'Severe Explosive Updraft',
    threshold: 'Drop > -15°C / 15 min',
    description: 'Direct satellite infrared confirmation of cloud tops punching through tropopause within minutes.'
  },
  topographicDynamics: {
    name: 'Topographic Dynamics (CartoDEM 30m)',
    peakRunoff: '520 m³/s',
    drainageBasin: 'Ulhas-Vasai Catchment Channel',
    source: 'CartoDEM High-Res Slope & Drainage Baseline',
    status: 'Severe Flash Flood Hazard',
    threshold: 'Runoff > 380 m³/s',
    description: 'Translates extreme precipitation into ground-level runoff flow channels and natural basin ponding.'
  }
};

export const MTL_HEADS_DATA = [
  {
    id: 'thunderstorm',
    name: 'Severe Thunderstorm Head',
    probability: 94,
    leadTime: '2h 15m lead time',
    riskLevel: 'Severe',
    color: '#f59e0b',
    icon: 'Zap',
    triggerThreshold: 'Exceeded (CAPE 3240, CTT -19.4°C)',
    affectedRadius: '14.5 km',
    keyPrecursor: 'High CAPE + Explosive CTT Drop'
  },
  {
    id: 'cloudburst',
    name: 'Localized Cloudburst Head',
    probability: 88,
    leadTime: '3h 10m lead time',
    riskLevel: 'Extreme',
    color: '#ef4444',
    icon: 'CloudLightning',
    triggerThreshold: 'Exceeded (IWV 62.8mm, Moisture Convergence)',
    affectedRadius: '8.2 km',
    keyPrecursor: 'Extreme IWV Surge (>60mm pool)'
  },
  {
    id: 'flashflood',
    name: 'Flash Flood & Inundation Head',
    probability: 82,
    leadTime: '3h 45m lead time',
    riskLevel: 'High',
    color: '#3b82f6',
    icon: 'Waves',
    triggerThreshold: 'Exceeded (CartoDEM low-depression ponding)',
    affectedRadius: '11.0 km',
    keyPrecursor: 'DEM Slope Channelling + QPE > 85mm/hr'
  }
];

export const WARDS_STATUS = [
  { name: 'Vasai West (Gaon & Sandor)', risk: 'Severe (88%)', population: '185,000', pumps: 6, boats: 2, shelters: 2 },
  { name: 'Nalasopara West (Sopara)', risk: 'Extreme (94%)', population: '240,000', pumps: 8, boats: 4, shelters: 3 },
  { name: 'Virar South (Bolinj)', risk: 'High (76%)', population: '160,000', pumps: 4, boats: 1, shelters: 2 },
  { name: 'Mira-Bhayandar East', risk: 'Moderate (62%)', population: '320,000', pumps: 5, boats: 2, shelters: 3 },
  { name: 'Thane Creek / Ghodbunder', risk: 'Moderate (58%)', population: '290,000', pumps: 4, boats: 1, shelters: 2 }
];

export const XAI_FEATURE_CONTRIBUTION = [
  { feature: 'Integrated Water Vapor (IWV) Accumulation', weight: 36, category: 'Moisture Fuel' },
  { feature: 'Cloud Top Temperature (CTT) Drop Rate', weight: 28, category: 'Observational' },
  { feature: 'CartoDEM Topographic Basin Elevation', weight: 18, category: 'Topography' },
  { feature: 'Convective Instability (CAPE / CIN)', weight: 12, category: 'Thermodynamics' },
  { feature: 'Low-Level Wind Convergence (U/V)', weight: 6, category: 'Kinematics' },
];
