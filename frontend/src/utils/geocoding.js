/**
 * Geocoding service using OpenStreetMap Nominatim with built-in
 * offline fallback dictionary for major cities.
 * Completely free, no API keys, no external signups.
 */

// Popular cities fallback dictionary (in case of offline/network issues)
const FALLBACK_CITIES = [
  { name: 'Delhi', district: 'National Capital Territory', lat: 28.6139, lon: 77.2090, state: 'Delhi', country: 'India' },
  { name: 'New Delhi', district: 'New Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi', country: 'India' },
  { name: 'Mumbai', district: 'Mumbai City', lat: 19.0760, lon: 72.8777, state: 'Maharashtra', country: 'India' },
  { name: 'Bengaluru', district: 'Bengaluru Urban', lat: 12.9716, lon: 77.5946, state: 'Karnataka', country: 'India' },
  { name: 'Bangalore', district: 'Bengaluru Urban', lat: 12.9716, lon: 77.5946, state: 'Karnataka', country: 'India' },
  { name: 'Kolkata', district: 'Kolkata', lat: 22.5726, lon: 88.3639, state: 'West Bengal', country: 'India' },
  { name: 'Chennai', district: 'Chennai', lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu', country: 'India' },
  { name: 'Hyderabad', district: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'Telangana', country: 'India' },
  { name: 'Pune', district: 'Pune', lat: 18.5204, lon: 73.8567, state: 'Maharashtra', country: 'India' },
  { name: 'Ahmedabad', district: 'Ahmedabad', lat: 23.0225, lon: 72.5714, state: 'Gujarat', country: 'India' },
  { name: 'Jaipur', district: 'Jaipur', lat: 26.9124, lon: 75.7873, state: 'Rajasthan', country: 'India' },
  { name: 'Lucknow', district: 'Lucknow', lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh', country: 'India' },
  { name: 'Patna', district: 'Patna', lat: 25.5941, lon: 85.1376, state: 'Bihar', country: 'India' },
  { name: 'Surat', district: 'Surat', lat: 21.1702, lon: 72.8311, state: 'Gujarat', country: 'India' },
  { name: 'Nagpur', district: 'Nagpur', lat: 21.1458, lon: 79.0882, state: 'Maharashtra', country: 'India' },
  { name: 'Bhopal', district: 'Bhopal', lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh', country: 'India' },
  { name: 'Chandigarh', district: 'Chandigarh', lat: 30.7333, lon: 76.7794, state: 'Chandigarh', country: 'India' },
  { name: 'Dehradun', district: 'Dehradun', lat: 30.3165, lon: 78.0322, state: 'Uttarakhand', country: 'India' },
  { name: 'Shimla', district: 'Shimla', lat: 31.1048, lon: 77.1734, state: 'Himachal Pradesh', country: 'India' },
  { name: 'Srinagar', district: 'Srinagar', lat: 34.0837, lon: 74.7973, state: 'Jammu and Kashmir', country: 'India' },
  { name: 'Guwahati', district: 'Kamrup', lat: 26.1445, lon: 91.7362, state: 'Assam', country: 'India' },
  { name: 'Kochi', district: 'Ernakulam', lat: 9.9312, lon: 76.2673, state: 'Kerala', country: 'India' },
  { name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, state: 'Kerala', country: 'India' },
  { name: 'Goa', district: 'North Goa', lat: 15.2993, lon: 74.1240, state: 'Goa', country: 'India' },
  { name: 'Panaji', district: 'North Goa', lat: 15.4909, lon: 73.8278, state: 'Goa', country: 'India' },
  { name: 'Varanasi', district: 'Varanasi', lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh', country: 'India' },
  { name: 'Indore', district: 'Indore', lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh', country: 'India' },
  { name: 'Agra', district: 'Agra', lat: 27.1767, lon: 78.0081, state: 'Uttar Pradesh', country: 'India' },
  { name: 'Amritsar', district: 'Amritsar', lat: 31.6340, lon: 74.8723, state: 'Punjab', country: 'India' },
  { name: 'Noida', district: 'Gautam Buddha Nagar', lat: 28.5355, lon: 77.3910, state: 'Uttar Pradesh', country: 'India' },
  { name: 'Gurgaon', district: 'Gurugram', lat: 28.4595, lon: 77.0266, state: 'Haryana', country: 'India' },
  { name: 'Gurugram', district: 'Gurugram', lat: 28.4595, lon: 77.0266, state: 'Haryana', country: 'India' },
  { name: 'Faridabad', district: 'Faridabad', lat: 28.4089, lon: 77.3178, state: 'Haryana', country: 'India' },
  { name: 'Ghaziabad', district: 'Ghaziabad', lat: 28.6692, lon: 77.4538, state: 'Uttar Pradesh', country: 'India' },
  { name: 'Nashik', district: 'Nashik', lat: 19.9975, lon: 73.7898, state: 'Maharashtra', country: 'India' },
  { name: 'Navi Mumbai', district: 'Thane', lat: 19.0330, lon: 73.0297, state: 'Maharashtra', country: 'India' },
  { name: 'Andheri', district: 'Mumbai Suburban', lat: 19.1136, lon: 72.8697, state: 'Maharashtra', country: 'India' },
  { name: 'Bandra', district: 'Mumbai Suburban', lat: 19.0596, lon: 72.8295, state: 'Maharashtra', country: 'India' },
  { name: 'Borivali', district: 'Mumbai Suburban', lat: 19.2307, lon: 72.8567, state: 'Maharashtra', country: 'India' },
  { name: 'Vasai', district: 'Palghar', lat: 19.3639, lon: 72.8093, state: 'Maharashtra', country: 'India' },
  { name: 'Virar', district: 'Palghar', lat: 19.4700, lon: 72.8000, state: 'Maharashtra', country: 'India' },
  { name: 'Nalasopara', district: 'Palghar', lat: 19.4167, lon: 72.7989, state: 'Maharashtra', country: 'India' },
  { name: 'Thane', district: 'Thane', lat: 19.2183, lon: 72.9781, state: 'Maharashtra', country: 'India' },
  { name: 'Kalyan', district: 'Thane', lat: 19.2437, lon: 73.1355, state: 'Maharashtra', country: 'India' },
  { name: 'London', district: 'Greater London', lat: 51.5074, lon: -0.1278, state: 'England', country: 'United Kingdom' },
  { name: 'New York', district: 'New York County', lat: 40.7128, lon: -74.0060, state: 'New York', country: 'United States' },
  { name: 'Tokyo', district: 'Tokyo', lat: 35.6762, lon: 139.6503, state: 'Kanto', country: 'Japan' },
  { name: 'Dubai', district: 'Dubai', lat: 25.2048, lon: 55.2708, state: 'Dubai', country: 'United Arab Emirates' },
  { name: 'Singapore', district: 'Central Region', lat: 1.3521, lon: 103.8198, state: 'Singapore', country: 'Singapore' },
];

/**
 * Search locations using OpenStreetMap Nominatim API.
 * Falls back to offline curated list if network fails.
 */
export async function searchLocationsOnline(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim();

  // Try OpenStreetMap Nominatim free geocoding
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=6&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => {
          const addr = item.address || {};
          const shortName = item.name || item.display_name.split(',')[0].trim();
          const region = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || addr.state || '';
          const stateOrCountry = addr.state || addr.country || '';
          const subtitle = [region, stateOrCountry].filter(Boolean).join(', ') || item.display_name;

          return {
            id: `osm-${item.place_id}`,
            name: shortName,
            fullName: item.display_name,
            district: subtitle,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            risk: 'Moderate',
            riskLevel: 'Moderate',
            type: 'osm',
          };
        });
      }
    }
  } catch (err) {
    console.warn('Nominatim network lookup failed, using fallback:', err.message);
  }

  // Fallback match from curated offline list
  const qLower = cleanQuery.toLowerCase();
  const matchedFallbacks = FALLBACK_CITIES.filter(c =>
    c.name.toLowerCase().includes(qLower) ||
    c.district.toLowerCase().includes(qLower) ||
    (c.state && c.state.toLowerCase().includes(qLower))
  ).slice(0, 5);

  return matchedFallbacks.map(c => ({
    id: `fb-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: c.name,
    fullName: `${c.name}, ${c.district}, ${c.state}, ${c.country}`,
    district: `${c.district}, ${c.state}`,
    lat: c.lat,
    lon: c.lon,
    risk: 'Moderate',
    riskLevel: 'Moderate',
    type: 'offline',
  }));
}

/**
 * Direct geocode for Enter key: given any typed text, find the best single location match
 */
export async function directGeocode(query) {
  if (!query || !query.trim()) return null;
  const clean = query.trim();

  // Check if user entered coordinates directly like "19.07, 72.87"
  const coordMatch = clean.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);
  if (coordMatch) {
    const [lat, lon] = clean.split(',').map(s => parseFloat(s.trim()));
    return {
      id: `coord-${Date.now()}`,
      name: `Custom Location (${lat.toFixed(3)}, ${lon.toFixed(3)})`,
      fullName: `Coordinates: ${lat}, ${lon}`,
      district: 'GPS Coordinates',
      lat,
      lon,
      risk: 'Moderate',
      riskLevel: 'Moderate',
      type: 'coord',
    };
  }

  const results = await searchLocationsOnline(clean);
  if (results.length > 0) {
    return results[0];
  }
  return null;
}
