/**
 * CarbonLens — Recommendations Engine Tests
 */

import { describe, it, expect } from 'vitest';
import { generateRecommendations, generateInsightSummary } from '../recommendations.js';

describe('generateRecommendations', () => {
  it('should return empty array for null input', () => {
    expect(generateRecommendations(null, null)).toEqual([]);
  });

  it('should generate transport recommendations for high drivers', () => {
    const userData = {
      transport: {
        vehicleType: 'car_gasoline',
        weeklyKm: 200,
        flights: [{ type: 'short_haul', tripsPerYear: 2 }],
        publicTransportKm: 0,
      },
      energy: { electricityKwh: 300, heatingType: 'natural_gas', heatingUsage: 100, renewablePercentage: 0 },
      diet: { dietType: 'medium_meat', foodWaste: 'average', localFood: 'mostly_imported' },
      lifestyle: { shoppingLevel: 'average', electronicsLevel: 'moderate', waterLevel: 'average', recyclingLevel: 'some' },
    };
    const breakdown = { transport: 200, energy: 150, diet: 200, lifestyle: 100 };

    const recs = generateRecommendations(userData, breakdown);
    expect(recs.length).toBeGreaterThan(0);

    // Should include some transport recommendations
    const transportRecs = recs.filter((r) => r.category === 'transport');
    expect(transportRecs.length).toBeGreaterThan(0);
  });

  it('should prioritize high-impact recommendations', () => {
    const userData = {
      transport: { vehicleType: 'car_gasoline', weeklyKm: 300, flights: [{ type: 'long_haul', tripsPerYear: 3 }], publicTransportKm: 0 },
      energy: { electricityKwh: 500, heatingType: 'natural_gas', heatingUsage: 200, renewablePercentage: 0 },
      diet: { dietType: 'high_meat', foodWaste: 'high', localFood: 'mostly_imported' },
      lifestyle: { shoppingLevel: 'excessive', electronicsLevel: 'high', waterLevel: 'high', recyclingLevel: 'none' },
    };
    const breakdown = { transport: 400, energy: 250, diet: 300, lifestyle: 200 };

    const recs = generateRecommendations(userData, breakdown);
    // First recommendation should have higher savings than last
    if (recs.length >= 2) {
      expect(recs[0].priorityScore).toBeGreaterThanOrEqual(recs[recs.length - 1].priorityScore);
    }
  });

  it('should respect maxResults limit', () => {
    const userData = {
      transport: { vehicleType: 'car_gasoline', weeklyKm: 200, flights: [{ type: 'short_haul', tripsPerYear: 2 }], publicTransportKm: 5 },
      energy: { electricityKwh: 500, heatingType: 'natural_gas', heatingUsage: 200, renewablePercentage: 0 },
      diet: { dietType: 'high_meat', foodWaste: 'high', localFood: 'mostly_imported' },
      lifestyle: { shoppingLevel: 'excessive', electronicsLevel: 'high', waterLevel: 'high', recyclingLevel: 'none' },
    };
    const breakdown = { transport: 200, energy: 250, diet: 300, lifestyle: 200 };

    const recs = generateRecommendations(userData, breakdown, { maxResults: 3 });
    expect(recs.length).toBeLessThanOrEqual(3);
  });

  it('should not include condition function in output', () => {
    const userData = {
      transport: { vehicleType: 'car_gasoline', weeklyKm: 100, flights: [], publicTransportKm: 0 },
      energy: { electricityKwh: 300, heatingType: 'natural_gas', heatingUsage: 0, renewablePercentage: 0 },
      diet: { dietType: 'medium_meat', foodWaste: 'average', localFood: 'mostly_imported' },
      lifestyle: { shoppingLevel: 'average', electronicsLevel: 'moderate', waterLevel: 'average', recyclingLevel: 'some' },
    };
    const breakdown = { transport: 100, energy: 100, diet: 200, lifestyle: 100 };

    const recs = generateRecommendations(userData, breakdown);
    recs.forEach((rec) => {
      expect(rec.condition).toBeUndefined();
    });
  });
});

describe('generateInsightSummary', () => {
  it('should return neutral message for empty data', () => {
    const result = generateInsightSummary(null, 0);
    expect(result.emphasis).toBe('neutral');
  });

  it('should return positive for low footprint', () => {
    const result = generateInsightSummary(
      { transport: 30, energy: 40, diet: 60, lifestyle: 20 },
      150
    );
    expect(result.emphasis).toBe('positive');
  });

  it('should return warning for high footprint', () => {
    const result = generateInsightSummary(
      { transport: 300, energy: 200, diet: 250, lifestyle: 200 },
      950
    );
    expect(result.emphasis).toBe('warning');
  });

  it('should identify the top category', () => {
    const result = generateInsightSummary(
      { transport: 100, energy: 50, diet: 300, lifestyle: 50 },
      500
    );
    expect(result.topCategory).toBe('diet');
    expect(result.topPercent).toBe(60);
  });
});
