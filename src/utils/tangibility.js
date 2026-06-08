/**
 * CarbonLens — Tangibility Engine
 * 
 * Functions to translate invisible kg CO₂e into tangible,
 * real-world concepts (ice melt, tree debt, monetary offset).
 *
 * @module tangibility
 */

import { NATIONAL_AVERAGES } from '../data/emissionFactors.js';

/**
 * Calculate tangible real-world impacts from a monthly carbon footprint.
 * 
 * @param {number} monthlyKg - Monthly footprint in kg CO2e
 * @param {number} budgetKg - Monthly budget (default 208kg for Paris 2030)
 * @param {string} country - Country key to localize currency
 * @returns {Object} Tangible impact metrics
 */
export function calculateTangibleImpact(monthlyKg, budgetKg = 208, country = 'global') {
  // 1 metric ton (1000kg) melts approx 3 sq meters of summer sea ice
  // So 1 kg = 0.003 sq meters
  const iceMeltedSqMeters = (monthlyKg * 0.003).toFixed(2);
  
  // An average mature tree absorbs ~22kg of CO2 per year (approx 1.83kg/month)
  // To absorb `monthlyKg` in a month, you need this many trees working full time
  const treesNeeded = Math.ceil(monthlyKg / 1.83);
  
  // Average gas car gets ~25 MPG and emits ~404 grams of CO2 per mile (0.404 kg/mile)
  const carMiles = Math.round(monthlyKg / 0.404);
  
  // Carbon offset cost. Current voluntary market is roughly $25 USD per ton.
  const countryData = NATIONAL_AVERAGES[country] || NATIONAL_AVERAGES.global;
  const rate = countryData.rateToUsd || 1;
  const symbol = countryData.symbol || '$';
  const costPerTon = 25 * rate;

  // For the deficit (amount over budget)
  const deficit = Math.max(0, monthlyKg - budgetKg);
  
  // Format costs nicely
  const offsetCostRaw = (deficit / 1000) * costPerTon;
  const totalCostRaw = (monthlyKg / 1000) * costPerTon;
  
  const offsetCost = offsetCostRaw > 100 ? Math.round(offsetCostRaw).toLocaleString() : offsetCostRaw.toFixed(2);
  const totalCost = totalCostRaw > 100 ? Math.round(totalCostRaw).toLocaleString() : totalCostRaw.toFixed(2);

  return {
    iceMeltedSqMeters,
    treesNeeded,
    carMiles,
    deficit,
    offsetCost,
    totalCost,
    currencySymbol: symbol
  };
}
