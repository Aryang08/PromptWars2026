/**
 * CarbonLens — Calculator Unit Tests
 *
 * Tests for the core carbon footprint calculation functions.
 * Validates emission calculations against known EPA/IPCC values.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateDietEmissions,
  calculateLifestyleEmissions,
  calculateTotalFootprint,
  compareToAverage,
  formatEmissions,
} from '../calculator.js';

describe('calculateTransportEmissions', () => {
  it('should return 0 for null input', () => {
    expect(calculateTransportEmissions(null)).toBe(0);
  });

  it('should return 0 for zero distances', () => {
    const data = {
      vehicleType: 'car_gasoline',
      weeklyKm: 0,
      flights: [],
      publicTransportKm: 0,
    };
    expect(calculateTransportEmissions(data)).toBe(0);
  });

  it('should calculate gasoline car emissions correctly', () => {
    const data = {
      vehicleType: 'car_gasoline',
      weeklyKm: 100,
      flights: [],
      publicTransportKm: 0,
    };
    // 0.21 * 100 * 4.33 = 90.93 kg/month
    const result = calculateTransportEmissions(data);
    expect(result).toBeCloseTo(90.93, 1);
  });

  it('should return 0 for bicycle', () => {
    const data = {
      vehicleType: 'bicycle',
      weeklyKm: 200,
      flights: [],
      publicTransportKm: 0,
    };
    expect(calculateTransportEmissions(data)).toBe(0);
  });

  it('should include flight emissions', () => {
    const data = {
      vehicleType: 'bicycle',
      weeklyKm: 0,
      flights: [
        { type: 'short_haul', tripsPerYear: 4 },
        { type: 'long_haul', tripsPerYear: 1 },
      ],
      publicTransportKm: 0,
    };
    const result = calculateTransportEmissions(data);
    expect(result).toBeGreaterThan(0);
  });

  it('should include public transport emissions', () => {
    const data = {
      vehicleType: 'walking',
      weeklyKm: 0,
      flights: [],
      publicTransportKm: 50,
      publicTransportType: 'train',
    };
    // 0.041 * 50 * 4.33 = 8.88 kg/month
    const result = calculateTransportEmissions(data);
    expect(result).toBeCloseTo(8.88, 1);
  });
});

describe('calculateEnergyEmissions', () => {
  it('should return 0 for null input', () => {
    expect(calculateEnergyEmissions(null)).toBe(0);
  });

  it('should calculate electricity emissions correctly', () => {
    const data = {
      electricityKwh: 500,
      heatingType: 'natural_gas',
      heatingUsage: 0,
      renewablePercentage: 0,
    };
    // 0.417 * 500 = 208.5 kg/month
    const result = calculateEnergyEmissions(data);
    expect(result).toBeCloseTo(208.5, 1);
  });

  it('should apply renewable offset', () => {
    const data = {
      electricityKwh: 500,
      heatingType: 'natural_gas',
      heatingUsage: 0,
      renewablePercentage: 50,
    };
    // (0.417 * 500) * 0.5 = 104.25
    const result = calculateEnergyEmissions(data);
    expect(result).toBeCloseTo(104.25, 1);
  });

  it('should return 0 with 100% renewables', () => {
    const data = {
      electricityKwh: 500,
      heatingType: 'natural_gas',
      heatingUsage: 200,
      renewablePercentage: 100,
    };
    expect(calculateEnergyEmissions(data)).toBe(0);
  });

  it('should add heating emissions', () => {
    const data = {
      electricityKwh: 0,
      heatingType: 'natural_gas',
      heatingUsage: 300,
      renewablePercentage: 0,
    };
    // 0.202 * 300 = 60.6
    const result = calculateEnergyEmissions(data);
    expect(result).toBeCloseTo(60.6, 1);
  });
});

describe('calculateDietEmissions', () => {
  it('should return 0 for null input', () => {
    expect(calculateDietEmissions(null)).toBe(0);
  });

  it('should return base factor for diet type', () => {
    const data = { dietType: 'vegan', foodWaste: 'none', localFood: 'mostly_local' };
    // 85 * 1.0 * 0.85 = 72.25
    const result = calculateDietEmissions(data);
    expect(result).toBeCloseTo(72.25, 1);
  });

  it('should apply food waste multiplier', () => {
    const data = { dietType: 'medium_meat', foodWaste: 'high', localFood: 'mostly_imported' };
    // 198 * 1.25 * 1.0 = 247.5
    const result = calculateDietEmissions(data);
    expect(result).toBeCloseTo(247.5, 1);
  });

  it('should rank emissions: vegan < vegetarian < high_meat', () => {
    const vegan = calculateDietEmissions({ dietType: 'vegan', foodWaste: 'average', localFood: 'mostly_imported' });
    const veg = calculateDietEmissions({ dietType: 'vegetarian', foodWaste: 'average', localFood: 'mostly_imported' });
    const meat = calculateDietEmissions({ dietType: 'high_meat', foodWaste: 'average', localFood: 'mostly_imported' });
    expect(vegan).toBeLessThan(veg);
    expect(veg).toBeLessThan(meat);
  });
});

describe('calculateLifestyleEmissions', () => {
  it('should return 0 for null input', () => {
    expect(calculateLifestyleEmissions(null)).toBe(0);
  });

  it('should calculate combined lifestyle emissions', () => {
    const data = {
      shoppingLevel: 'average',
      electronicsLevel: 'moderate',
      waterLevel: 'average',
      recyclingLevel: 'some',
    };
    // (75 + 25 + 12) * 0.96 = 107.52
    const result = calculateLifestyleEmissions(data);
    expect(result).toBeCloseTo(107.52, 1);
  });

  it('should apply recycling offset', () => {
    const withRecycling = calculateLifestyleEmissions({
      shoppingLevel: 'average',
      electronicsLevel: 'moderate',
      waterLevel: 'average',
      recyclingLevel: 'all',
    });
    const withoutRecycling = calculateLifestyleEmissions({
      shoppingLevel: 'average',
      electronicsLevel: 'moderate',
      waterLevel: 'average',
      recyclingLevel: 'none',
    });
    expect(withRecycling).toBeLessThan(withoutRecycling);
  });
});

describe('calculateTotalFootprint', () => {
  it('should return zero for empty data', () => {
    const result = calculateTotalFootprint({});
    expect(result.total).toBe(0);
    expect(result.annual).toBe(0);
  });

  it('should sum all categories', () => {
    const data = {
      transport: { vehicleType: 'car_gasoline', weeklyKm: 50, flights: [], publicTransportKm: 0 },
      energy: { electricityKwh: 300, heatingType: 'natural_gas', heatingUsage: 100, renewablePercentage: 0 },
      diet: { dietType: 'medium_meat', foodWaste: 'average', localFood: 'mostly_imported' },
      lifestyle: { shoppingLevel: 'average', electronicsLevel: 'moderate', waterLevel: 'average', recyclingLevel: 'some' },
    };
    const result = calculateTotalFootprint(data);
    expect(result.total).toBeGreaterThan(0);
    expect(result.breakdown.transport).toBeGreaterThan(0);
    expect(result.breakdown.energy).toBeGreaterThan(0);
    expect(result.breakdown.diet).toBeGreaterThan(0);
    expect(result.breakdown.lifestyle).toBeGreaterThan(0);
    expect(result.total).toBeCloseTo(
      result.breakdown.transport +
      result.breakdown.energy +
      result.breakdown.diet +
      result.breakdown.lifestyle,
      1
    );
  });

  it('should calculate correct percentages', () => {
    const data = {
      transport: { vehicleType: 'car_gasoline', weeklyKm: 100, flights: [], publicTransportKm: 0 },
      energy: { electricityKwh: 500, heatingType: 'natural_gas', heatingUsage: 0, renewablePercentage: 0 },
      diet: { dietType: 'medium_meat', foodWaste: 'average', localFood: 'mostly_imported' },
      lifestyle: { shoppingLevel: 'average', electronicsLevel: 'moderate', waterLevel: 'average', recyclingLevel: 'some' },
    };
    const result = calculateTotalFootprint(data);
    const pctSum = result.percentages.transport + result.percentages.energy +
      result.percentages.diet + result.percentages.lifestyle;
    // Allow for rounding: should be between 98 and 102
    expect(pctSum).toBeGreaterThanOrEqual(98);
    expect(pctSum).toBeLessThanOrEqual(102);
  });
});

describe('compareToAverage', () => {
  it('should compare to global average', () => {
    const result = compareToAverage(300, 'global');
    expect(result.global.average).toBe(383);
    expect(result.global.isBelowAverage).toBe(true);
  });

  it('should detect when above average', () => {
    const result = compareToAverage(500, 'global');
    expect(result.global.isBelowAverage).toBe(false);
    expect(result.global.difference).toBe(117);
  });

  it('should check Paris targets', () => {
    const result = compareToAverage(100, 'global');
    expect(result.parisTargets.meetsTarget2030).toBe(true);
    expect(result.parisTargets.reductionNeeded2030).toBe(0);
  });

  it('should provide rating', () => {
    const lowResult = compareToAverage(100, 'global');
    expect(lowResult.rating.label).toBe('Exceptional');

    const highResult = compareToAverage(1500, 'global');
    expect(highResult.rating.label).toBe('Very High');
  });
});

describe('formatEmissions', () => {
  it('should format kg values', () => {
    expect(formatEmissions(250)).toBe('250 kg CO₂e');
  });

  it('should format tonnes for large values', () => {
    expect(formatEmissions(1500)).toBe('1.5 t CO₂e');
  });

  it('should format without unit', () => {
    expect(formatEmissions(250, { showUnit: false })).toBe('250');
  });
});
