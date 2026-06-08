/**
 * CarbonLens — Carbon Footprint Calculator
 *
 * Pure utility functions for computing carbon emissions across
 * transport, energy, diet, and lifestyle categories.
 *
 * All functions are pure (no side effects) for easy testing.
 * All return values in kg CO₂e per month.
 *
 * @module calculator
 */

import {
  TRANSPORT_FACTORS,
  FLIGHT_FACTORS,
  ENERGY_FACTORS,
  DIET_FACTORS,
  FOOD_WASTE_FACTORS,
  LOCAL_FOOD_FACTORS,
  LIFESTYLE_FACTORS,
  NATIONAL_AVERAGES,
  CLIMATE_TARGETS,
} from '../data/emissionFactors.js';

/**
 * Calculate monthly transport emissions.
 *
 * @param {Object} data - Transport input data
 * @param {string} data.vehicleType - Key from TRANSPORT_FACTORS
 * @param {number} data.weeklyKm - Weekly distance in km
 * @param {Array<{type: string, tripsPerYear: number}>} data.flights - Flight data
 * @param {number} [data.publicTransportKm=0] - Weekly public transport km
 * @param {string} [data.publicTransportType='bus'] - Type of public transport
 * @returns {number} Monthly transport emissions in kg CO₂e
 */
export function calculateTransportEmissions(data) {
  if (!data) return 0;

  let total = 0;

  // Vehicle emissions
  const vehicleFactor = TRANSPORT_FACTORS[data.vehicleType];
  if (vehicleFactor && data.weeklyKm > 0) {
    total += vehicleFactor.factor * data.weeklyKm * 4.33; // weeks per month
  }

  // Flight emissions
  if (data.flights && Array.isArray(data.flights)) {
    for (const flight of data.flights) {
      const flightFactor = FLIGHT_FACTORS[flight.type];
      if (flightFactor && flight.tripsPerYear > 0) {
        // Round trip (x2), spread across 12 months
        const monthlyFlightKm =
          (flightFactor.avgDistance * 2 * flight.tripsPerYear) / 12;
        total += flightFactor.factor * monthlyFlightKm;
      }
    }
  }

  // Public transport emissions
  if (data.publicTransportKm > 0) {
    const ptType = data.publicTransportType || 'bus';
    const ptFactor = TRANSPORT_FACTORS[ptType];
    if (ptFactor) {
      total += ptFactor.factor * data.publicTransportKm * 4.33;
    }
  }

  return Math.round(total * 100) / 100;
}

/**
 * Calculate monthly home energy emissions.
 *
 * @param {Object} data - Energy input data
 * @param {number} data.electricityKwh - Monthly electricity in kWh
 * @param {string} data.heatingType - Key from ENERGY_FACTORS
 * @param {number} data.heatingUsage - Monthly heating usage (kWh or liters)
 * @param {number} [data.renewablePercentage=0] - % of energy from renewables (0-100)
 * @returns {number} Monthly energy emissions in kg CO₂e
 */
export function calculateEnergyEmissions(data) {
  if (!data) return 0;

  let total = 0;
  const renewableOffset = 1 - (data.renewablePercentage || 0) / 100;

  // Electricity
  if (data.electricityKwh > 0) {
    total += ENERGY_FACTORS.electricity.factor * data.electricityKwh;
  }

  // Heating
  if (data.heatingType && data.heatingUsage > 0) {
    const heatingFactor = ENERGY_FACTORS[data.heatingType];
    if (heatingFactor) {
      total += heatingFactor.factor * data.heatingUsage;
    }
  }

  // Apply renewable offset
  total *= renewableOffset;

  return Math.round(total * 100) / 100;
}

/**
 * Calculate monthly diet emissions.
 *
 * @param {Object} data - Diet input data
 * @param {string} data.dietType - Key from DIET_FACTORS
 * @param {string} [data.foodWaste='average'] - Key from FOOD_WASTE_FACTORS
 * @param {string} [data.localFood='mostly_imported'] - Key from LOCAL_FOOD_FACTORS
 * @returns {number} Monthly diet emissions in kg CO₂e
 */
export function calculateDietEmissions(data) {
  if (!data) return 0;

  const dietFactor = DIET_FACTORS[data.dietType];
  if (!dietFactor) return 0;

  let total = dietFactor.factor;

  // Apply food waste multiplier
  const wasteFactor = FOOD_WASTE_FACTORS[data.foodWaste || 'average'];
  if (wasteFactor) {
    total *= wasteFactor.multiplier;
  }

  // Apply local food offset
  const localFactor = LOCAL_FOOD_FACTORS[data.localFood || 'mostly_imported'];
  if (localFactor) {
    total *= localFactor.offset;
  }

  return Math.round(total * 100) / 100;
}

/**
 * Calculate monthly lifestyle / consumption emissions.
 *
 * @param {Object} data - Lifestyle input data
 * @param {string} data.shoppingLevel - Key from LIFESTYLE_FACTORS.shopping
 * @param {string} data.electronicsLevel - Key from LIFESTYLE_FACTORS.electronics
 * @param {string} data.waterLevel - Key from LIFESTYLE_FACTORS.water
 * @param {string} data.recyclingLevel - Key from LIFESTYLE_FACTORS.recycling
 * @returns {number} Monthly lifestyle emissions in kg CO₂e
 */
export function calculateLifestyleEmissions(data) {
  if (!data) return 0;

  let total = 0;

  // Shopping
  const shoppingFactor = LIFESTYLE_FACTORS.shopping[data.shoppingLevel || 'average'];
  if (shoppingFactor) {
    total += shoppingFactor.factor;
  }

  // Electronics
  const electronicsFactor = LIFESTYLE_FACTORS.electronics[data.electronicsLevel || 'moderate'];
  if (electronicsFactor) {
    total += electronicsFactor.factor;
  }

  // Water
  const waterFactor = LIFESTYLE_FACTORS.water[data.waterLevel || 'average'];
  if (waterFactor) {
    total += waterFactor.factor;
  }

  // Apply recycling offset
  const recyclingFactor = LIFESTYLE_FACTORS.recycling[data.recyclingLevel || 'some'];
  if (recyclingFactor) {
    total *= recyclingFactor.offset;
  }

  return Math.round(total * 100) / 100;
}

/**
 * Calculate total monthly carbon footprint with breakdown.
 *
 * @param {Object} allData - All category data
 * @param {Object} allData.transport - Transport data
 * @param {Object} allData.energy - Energy data
 * @param {Object} allData.diet - Diet data
 * @param {Object} allData.lifestyle - Lifestyle data
 * @returns {Object} Total footprint with breakdown
 */
export function calculateTotalFootprint(allData) {
  const transport = calculateTransportEmissions(allData?.transport);
  const energy = calculateEnergyEmissions(allData?.energy);
  const diet = calculateDietEmissions(allData?.diet);
  const lifestyle = calculateLifestyleEmissions(allData?.lifestyle);

  const total = transport + energy + diet + lifestyle;
  const annualTotal = total * 12;

  return {
    total: Math.round(total * 100) / 100,
    annual: Math.round(annualTotal * 100) / 100,
    breakdown: {
      transport: Math.round(transport * 100) / 100,
      energy: Math.round(energy * 100) / 100,
      diet: Math.round(diet * 100) / 100,
      lifestyle: Math.round(lifestyle * 100) / 100,
    },
    percentages: {
      transport: total > 0 ? Math.round((transport / total) * 100) : 0,
      energy: total > 0 ? Math.round((energy / total) * 100) : 0,
      diet: total > 0 ? Math.round((diet / total) * 100) : 0,
      lifestyle: total > 0 ? Math.round((lifestyle / total) * 100) : 0,
    },
  };
}

/**
 * Compare user footprint to national and global averages.
 *
 * @param {number} monthlyTotal - User's monthly CO₂e in kg
 * @param {string} [country='global'] - Country key from NATIONAL_AVERAGES
 * @returns {Object} Comparison data
 */
export function compareToAverage(monthlyTotal, country = 'global') {
  const nationalAvg = NATIONAL_AVERAGES[country] || NATIONAL_AVERAGES.global;
  const globalAvg = NATIONAL_AVERAGES.global;

  const vsNational = monthlyTotal - nationalAvg.value;
  const vsGlobal = monthlyTotal - globalAvg.value;

  const parisTarget2030 = CLIMATE_TARGETS.paris_2030.value;
  const parisTarget2050 = CLIMATE_TARGETS.paris_2050.value;

  return {
    national: {
      label: nationalAvg.label,
      flag: nationalAvg.flag,
      average: nationalAvg.value,
      difference: Math.round(vsNational),
      percentDiff:
        nationalAvg.value > 0
          ? Math.round((vsNational / nationalAvg.value) * 100)
          : 0,
      isBelowAverage: monthlyTotal < nationalAvg.value,
    },
    global: {
      label: globalAvg.label,
      flag: globalAvg.flag,
      average: globalAvg.value,
      difference: Math.round(vsGlobal),
      percentDiff:
        globalAvg.value > 0
          ? Math.round((vsGlobal / globalAvg.value) * 100)
          : 0,
      isBelowAverage: monthlyTotal < globalAvg.value,
    },
    parisTargets: {
      target2030: parisTarget2030,
      target2050: parisTarget2050,
      meetsTarget2030: monthlyTotal <= parisTarget2030,
      meetsTarget2050: monthlyTotal <= parisTarget2050,
      reductionNeeded2030: Math.max(0, Math.round(monthlyTotal - parisTarget2030)),
      reductionNeeded2050: Math.max(0, Math.round(monthlyTotal - parisTarget2050)),
    },
    rating: getRating(monthlyTotal),
  };
}

/**
 * Get a qualitative rating based on monthly emissions.
 *
 * @param {number} monthlyKg - Monthly emissions in kg CO₂e
 * @returns {{label: string, color: string, emoji: string}}
 */
function getRating(monthlyKg) {
  if (monthlyKg <= 100) {
    return { label: 'Exceptional', color: '#22c55e', emoji: '🌟' };
  }
  if (monthlyKg <= 200) {
    return { label: 'Excellent', color: '#4ade80', emoji: '🌿' };
  }
  if (monthlyKg <= 350) {
    return { label: 'Good', color: '#86efac', emoji: '🍃' };
  }
  if (monthlyKg <= 500) {
    return { label: 'Average', color: '#fbbf24', emoji: '🌤️' };
  }
  if (monthlyKg <= 800) {
    return { label: 'Above Average', color: '#f59e0b', emoji: '☁️' };
  }
  if (monthlyKg <= 1200) {
    return { label: 'High', color: '#f87171', emoji: '🔥' };
  }
  return { label: 'Very High', color: '#ef4444', emoji: '🚨' };
}

/**
 * Format kg CO₂e value for display.
 *
 * @param {number} kg - Value in kg CO₂e
 * @param {Object} [options]
 * @param {boolean} [options.showUnit=true] - Whether to show unit
 * @param {number} [options.decimals=0] - Decimal places
 * @returns {string} Formatted string
 */
export function formatEmissions(kg, options = {}) {
  const { showUnit = true, decimals = 0 } = options;

  if (kg >= 1000) {
    const tonnes = (kg / 1000).toFixed(decimals || 1);
    return showUnit ? `${tonnes} t CO₂e` : tonnes;
  }

  const formatted = kg.toFixed(decimals);
  return showUnit ? `${formatted} kg CO₂e` : formatted;
}
