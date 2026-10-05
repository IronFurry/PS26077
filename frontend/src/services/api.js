/**
 * STORMS API Service Layer
 * SIH Problem Statement 26077 (MoES - NCMRWF)
 *
 * Provides async services for Nowcast predictions, Severe Weather Alerts,
 * and Common Alerting Protocol (CAP) multi-channel dispatch.
 */

import {
  REGIONS_DATA,
  LOCATIONS,
  HOURLY_FORECAST,
  SEVERE_ALERT,
  OFFICIALS_PRECURSORS,
  MTL_HEADS_DATA,
  WARDS_STATUS,
  XAI_FEATURE_CONTRIBUTION,
} from '../data/weatherData';
import { NOWCAST_STORM_CELL, RISK_ZONE_POLYGONS } from '../data/mockNowcast';

/**
 * Fetch real-time AI nowcasting data for a given region (or all regions).
 * Simulates network / model inference with a realistic short delay.
 *
 * @param {string | Object} regionId - ID or object of region
 * @returns {Promise<Object>} Nowcast package including region, precursors, MTL heads, and radar layers
 */
export async function getNowcast(regionId = 'vasai') {
  await new Promise((resolve) => setTimeout(resolve, 320));

  const id = (typeof regionId === 'object' ? regionId?.id : regionId)?.toLowerCase() || 'vasai';
  const region = REGIONS_DATA[id] || REGIONS_DATA.vasai;

  return {
    region,
    allRegions: REGIONS_DATA,
    locations: LOCATIONS,
    stormCell: NOWCAST_STORM_CELL,
    riskZones: RISK_ZONE_POLYGONS,
    hourlyForecast: HOURLY_FORECAST,
    precursors: {
      ...OFFICIALS_PRECURSORS,
      moistureFuel: {
        ...OFFICIALS_PRECURSORS.moistureFuel,
        currentValue: region.precursors.iwv,
        deltaRate: region.precursors.iwvRate,
      },
      instabilityEnergy: {
        ...OFFICIALS_PRECURSORS.instabilityEnergy,
        capeValue: region.precursors.cape,
        cinValue: region.precursors.cin,
      },
      kinematicsLift: {
        ...OFFICIALS_PRECURSORS.kinematicsLift,
        convergenceValue: region.precursors.convergence,
      },
      observationalSignature: {
        ...OFFICIALS_PRECURSORS.observationalSignature,
        currentRate: region.precursors.ctt,
      },
    },
    mtlHeads: MTL_HEADS_DATA.map((h) => ({
      ...h,
      probability: region.mtlHeads?.[h.id]?.probability ?? h.probability,
      riskLevel: region.mtlHeads?.[h.id]?.riskLevel ?? h.riskLevel,
      leadTime: region.mtlHeads?.[h.id]?.leadTime ?? h.leadTime,
    })),
    wardsStatus: WARDS_STATUS,
    xaiFeatures: region.xaiFeatures || XAI_FEATURE_CONTRIBUTION,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetch active severe weather alerts for a target region.
 *
 * @param {string | Object} regionId - Target region
 * @returns {Promise<Object>} Severe alert details and action checklist
 */
export async function getAlerts(regionId = 'vasai') {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const id = (typeof regionId === 'object' ? regionId?.id : regionId)?.toLowerCase() || 'vasai';
  const region = REGIONS_DATA[id] || REGIONS_DATA.vasai;

  return {
    severeAlert: {
      ...SEVERE_ALERT,
      headline: `${region.risk} rainfall expected near ${region.name}`,
      eta: `Likely within ${region.eta}`,
      severity: region.risk,
      regionName: region.name,
      xaiDetails: {
        ...SEVERE_ALERT.xaiDetails,
        iwvSurge: `${region.precursors.iwvRate} (Column Moisture Surge)`,
        cttDropRate: `${region.precursors.ctt} (Convective Updraft Core)`,
        capeCin: `${region.precursors.cape} CAPE / ${region.precursors.cin} CIN`,
        convergence: `${region.precursors.convergence} (Low-level trigger)`,
      },
    },
    activeRegions: Object.values(REGIONS_DATA),
  };
}

/**
 * Dispatch Common Alerting Protocol (CAP) emergency alert broadcast.
 *
 * @param {Object} alertPayload - Alert dispatch payload
 * @returns {Promise<Object>} Dispatch confirmation receipt
 */
export async function dispatchAlert(alertPayload) {
  // Realistic dispatch broadcast latency
  await new Promise((resolve) => setTimeout(resolve, 550));

  return {
    success: true,
    dispatchId: `CAP-IN-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    broadcastTargets: ['Targeted Cell Broadcast', 'State Emergency Ops Center', 'NDRF Response Battalion', 'Citizen Public Alert Portal'],
    status: 'DISPATCH_BROADCAST_SUCCESS',
    details: alertPayload,
  };
}
