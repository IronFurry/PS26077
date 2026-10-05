/**
 * Real-time AI Nowcasting Radar & Hazard Zone Spatial Grids
 * SIH Problem Statement 26077 (MoES - NCMRWF)
 *
 * Provides:
 * 1. getNowcastFrame(stepIndex): Generates ~1 km GeoJSON grid cells over the
 *    Vasai-Virar-Thane area with a Gaussian storm cell drifting North-East across
 *    13 time steps (0 to 6 hours, 30 min intervals). Values in mm/hr.
 * 2. NOWCAST_STORM_CELL: Baseline frame 0 export for backward compatibility.
 * 3. RISK_ZONE_POLYGONS: Administrative risk-colored zones for Vasai, Nalasopara, and Virar.
 * 4. FORECAST_STEPS: 13 step labels from 'Now' to '+6h'.
 */

export const FORECAST_STEPS = [
  'Now',
  '+30m',
  '+1h',
  '+1h 30m',
  '+2h',
  '+2h 30m',
  '+3h',
  '+3h 30m',
  '+4h',
  '+4h 30m',
  '+5h',
  '+5h 30m',
  '+6h',
];

// Area bounding box: Vasai - Virar - Thane coastal & foothill corridor
const BOUNDS = {
  minLon: 72.72,
  maxLon: 73.04,
  minLat: 19.18,
  maxLat: 19.54,
  stepLon: 0.0095, // ~1.0 km in longitude
  stepLat: 0.0090, // ~1.0 km in latitude
};

// Storm path: Gaussian cell drifting North-East (NE) across 13 steps
// Starts SW off Vasai coast, moves NE towards Virar foothills & Northern Thane
const TRAJECTORY = {
  startLon: 72.77,
  startLat: 19.31,
  endLon: 72.97,
  endLat: 19.50,
};

// Peak rainfall intensity (mm/hr) profile across 13 steps
// Starts moderate/high (72 mm/hr), peaks during cloudburst explosive phase (96 mm/hr), then gradually dissipates
const PEAK_RATES = [
  72, // Step 0 (Now)
  86, // Step 1 (+30m)
  96, // Step 2 (+1h) - Cloudburst peak
  92, // Step 3 (+1h 30m)
  82, // Step 4 (+2h)
  70, // Step 5 (+2h 30m)
  58, // Step 6 (+3h)
  48, // Step 7 (+3h 30m)
  40, // Step 8 (+4h)
  32, // Step 9 (+4h 30m)
  24, // Step 10 (+5h)
  18, // Step 11 (+5h 30m)
  12, // Step 12 (+6h)
];

// Cache memoized frames to guarantee fast 60fps scrubbing
const framesCache = new Map();

/**
 * Returns a GeoJSON FeatureCollection of ~1 km grid cells representing
 * the radar nowcast precipitation intensity field at the given time step.
 *
 * @param {number} stepIndex - 0 to 12 (30-min intervals up to 6 hours)
 * @returns {Object} GeoJSON FeatureCollection
 */
export function getNowcastFrame(stepIndex = 0) {
  const step = Math.max(0, Math.min(12, Math.round(stepIndex)));

  if (framesCache.has(step)) {
    return framesCache.get(step);
  }

  const t = step / 12; // 0.0 to 1.0 progress
  const centerLon = TRAJECTORY.startLon + t * (TRAJECTORY.endLon - TRAJECTORY.startLon);
  const centerLat = TRAJECTORY.startLat + t * (TRAJECTORY.endLat - TRAJECTORY.startLat);
  const peakRate = PEAK_RATES[step] || 50;

  const features = [];
  const sigma = 4.8; // km dispersion radius

  for (let lat = BOUNDS.minLat; lat < BOUNDS.maxLat; lat += BOUNDS.stepLat) {
    for (let lon = BOUNDS.minLon; lon < BOUNDS.maxLon; lon += BOUNDS.stepLon) {
      const cellCenterLon = lon + BOUNDS.stepLon / 2;
      const cellCenterLat = lat + BOUNDS.stepLat / 2;

      // Distance in km from storm center
      const dx = (cellCenterLon - centerLon) * 111 * Math.cos((centerLat * Math.PI) / 180);
      const dy = (cellCenterLat - centerLat) * 111;

      // Elliptical stretch along the NE motion vector (45 deg angle)
      const distAlong = (dx + dy) / Math.SQRT2;
      const distAcross = (-dx + dy) / Math.SQRT2;
      const distEffective = Math.sqrt((distAlong / 1.25) ** 2 + (distAcross / 0.9) ** 2);

      // Gaussian rainfall rate (mm/hr)
      const rate = peakRate * Math.exp(-(distEffective ** 2) / (2 * sigma * sigma));

      // Filter out negligible rain to optimize rendering
      if (rate < 2.5) continue;

      // Classify into legend color classes
      let color = '#38bdf8';
      let level = 'light';
      let label = 'Light';
      let dbz = '20-30 dBZ';

      if (rate >= 65) {
        color = '#ef4444';
        level = 'extreme';
        label = 'Extreme (Cloudburst)';
        dbz = '> 55 dBZ';
      } else if (rate >= 35) {
        color = '#fb923c';
        level = 'veryHeavy';
        label = 'Very Heavy';
        dbz = '48-55 dBZ';
      } else if (rate >= 15) {
        color = '#facc15';
        level = 'heavy';
        label = 'Heavy';
        dbz = '40-48 dBZ';
      } else if (rate >= 7.5) {
        color = '#10b981';
        level = 'moderate';
        label = 'Moderate';
        dbz = '30-40 dBZ';
      }

      features.push({
        type: 'Feature',
        properties: {
          id: `cell-${lon.toFixed(4)}-${lat.toFixed(4)}`,
          rate: Math.round(rate * 10) / 10,
          color,
          level,
          label,
          dbz,
          step,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [lon, lat],
              [lon + BOUNDS.stepLon, lat],
              [lon + BOUNDS.stepLon, lat + BOUNDS.stepLat],
              [lon, lat + BOUNDS.stepLat],
              [lon, lat],
            ],
          ],
        },
      });
    }
  }

  const frameCollection = {
    type: 'FeatureCollection',
    features,
  };

  framesCache.set(step, frameCollection);
  return frameCollection;
}

// Baseline Frame 0 for initial load and backward compatibility
export const NOWCAST_STORM_CELL = getNowcastFrame(0);

/**
 * Generates a smooth circular GeoJSON Polygon geometry centered at (centerLon, centerLat) with radius (radiusKm).
 */
export function createGeoJsonCircle(centerLon, centerLat, radiusKm = 4.5, numPoints = 64) {
  const coords = [];
  const kmInLat = 1 / 110.574;
  const kmInLon = 1 / (111.320 * Math.cos((centerLat * Math.PI) / 180));

  for (let i = 0; i <= numPoints; i++) {
    const theta = (i * 2 * Math.PI) / numPoints;
    const dx = radiusKm * Math.cos(theta);
    const dy = radiusKm * Math.sin(theta);

    const lon = centerLon + dx * kmInLon;
    const lat = centerLat + dy * kmInLat;
    coords.push([lon, lat]);
  }

  return {
    type: 'Polygon',
    coordinates: [coords],
  };
}

// Administrative Risk-colored Circular Hazard Zones for Vasai, Nalasopara, Virar, Mumbai, and Thane
export const RISK_ZONE_POLYGONS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'vasai',
        name: 'Vasai Zone',
        risk: 'Severe',
        riskProb: '88%',
        color: '#f97316',
      },
      geometry: createGeoJsonCircle(72.8093, 19.3639, 4.5),
    },
    {
      type: 'Feature',
      properties: {
        id: 'nalasopara',
        name: 'Nalasopara Zone',
        risk: 'Extreme',
        riskProb: '94%',
        color: '#ef4444',
      },
      geometry: createGeoJsonCircle(72.7989, 19.4167, 4.8),
    },
    {
      type: 'Feature',
      properties: {
        id: 'virar',
        name: 'Virar Zone',
        risk: 'High',
        riskProb: '76%',
        color: '#eab308',
      },
      geometry: createGeoJsonCircle(72.8000, 19.4700, 4.2),
    },
    {
      type: 'Feature',
      properties: {
        id: 'mumbai',
        name: 'Mumbai Suburbs',
        risk: 'Moderate',
        riskProb: '62%',
        color: '#3b82f6',
      },
      geometry: createGeoJsonCircle(72.8777, 19.0760, 5.0),
    },
    {
      type: 'Feature',
      properties: {
        id: 'thane',
        name: 'Thane North',
        risk: 'Moderate',
        riskProb: '58%',
        color: '#a855f7',
      },
      geometry: createGeoJsonCircle(72.9781, 19.2183, 4.5),
    },
  ],
};
