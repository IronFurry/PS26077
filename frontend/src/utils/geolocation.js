import { LOCATIONS, REGIONS_DATA } from '../data/weatherData';

/**
 * Calculates distance in kilometers between two coordinates using the Haversine formula
 */
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the closest monitored station or hazard zone from the given coordinates
 */
export function findClosestStation(lat, lon, locations = LOCATIONS) {
  let closest = locations[0];
  let minDistance = Infinity;

  for (const loc of locations) {
    if (loc.lat != null && loc.lon != null) {
      const dist = getDistanceKm(lat, lon, loc.lat, loc.lon);
      if (dist < minDistance) {
        minDistance = dist;
        closest = {
          ...loc,
          distanceKm: Math.round(dist * 10) / 10,
        };
      }
    }
  }

  return closest;
}

/**
 * Performs fast reverse geocoding via OpenStreetMap Nominatim with timeout
 */
export async function reverseGeocode(lat, lon) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const name =
        addr.suburb ||
        addr.neighbourhood ||
        addr.city_district ||
        addr.town ||
        addr.city ||
        addr.village ||
        data.name ||
        'Current Area';
      const district = addr.county || addr.state_district || addr.state || 'Detected Area';
      return { name, district, displayName: data.display_name };
    }
  } catch (err) {
    console.warn('[Geolocation] Reverse geocoding failed or timed out:', err);
  }
  return null;
}

const STORAGE_KEY = 'storms_active_location';

export function getCachedLocation() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[Geolocation] Could not read cached location:', e);
  }
  return null;
}

export function saveCachedLocation(location) {
  try {
    if (location) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    }
  } catch (e) {
    console.warn('[Geolocation] Could not cache location:', e);
  }
}

/**
 * Requests device GPS coordinates via HTML5 Geolocation API,
 * matches with the closest radar station or builds a custom GPS location object.
 */
export async function requestUserGeolocation(options = {}) {
  if (!navigator || !navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser.');
  }

  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options,
  };

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon, accuracy } = position.coords;
        console.log(`[Geolocation] Successfully acquired coordinates: lat=${lat}, lon=${lon}, accuracy=±${Math.round(accuracy)}m`);

        // Find nearest station
        const closestStation = findClosestStation(lat, lon, LOCATIONS);
        const distKm = getDistanceKm(lat, lon, closestStation.lat, closestStation.lon);

        let resolvedLocation;

        if (distKm <= 35) {
          // Inside or adjacent to the primary MMR / Palghar radar monitoring zone
          resolvedLocation = {
            ...closestStation,
            actualLat: lat,
            actualLon: lon,
            accuracy: Math.round(accuracy),
            isGps: true,
            isClosestStation: true,
            distanceToStationKm: Math.round(distKm * 10) / 10,
            gpsLabel: `Current Location (~${closestStation.name})`,
          };
        } else {
          // Outside immediate primary station footprint: reverse geocode to get city name
          const geocoded = await reverseGeocode(lat, lon);
          const name = geocoded?.name || `Current Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
          const district = geocoded?.district || 'India';

          resolvedLocation = {
            id: `gps_${Math.round(lat * 1000)}_${Math.round(lon * 1000)}`,
            name,
            district,
            lat,
            lon,
            accuracy: Math.round(accuracy),
            isGps: true,
            risk: 'Moderate',
            riskProb: '62%',
            riskScore: 62,
            confidence: '89%',
            impact: 'MODERATE',
            eta: '45 min',
            gpsLabel: `Current Location (${name})`,
          };
        }

        saveCachedLocation(resolvedLocation);
        resolve(resolvedLocation);
      },
      (error) => {
        let msg = 'Failed to acquire device location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location access was denied. Please allow location permissions in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please try again.';
            break;
          default:
            msg = error.message || msg;
        }
        console.warn('[Geolocation] Error:', msg);
        reject(new Error(msg));
      },
      geoOptions
    );
  });
}
