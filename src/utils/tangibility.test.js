import { describe, it, expect } from 'vitest';
import { calculateTangibleImpact } from './tangibility.js';

describe('Tangibility Engine', () => {
  it('should calculate accurate ice melt based on total emissions', () => {
    const impact = calculateTangibleImpact(1000, 208, 'USD');
    expect(impact.iceMeltedSqMeters).toBe("3.00");
  });

  it('should calculate accurate tree debt based on total emissions', () => {
    const impact = calculateTangibleImpact(1000, 208, 'USD');
    expect(impact.treesNeeded).toBe(547); // 1000 / 1.83 = 546.4 -> Math.ceil = 547
  });

  it('should calculate car miles based on total emissions', () => {
    const impact = calculateTangibleImpact(1000, 208, 'USD');
    expect(impact.carMiles).toBe(2475); // 1000 / 0.404 = 2475.2 -> Math.round = 2475
  });

  it('should handle zero gracefully', () => {
    const impact = calculateTangibleImpact(0, 208, 'USD');
    expect(impact.carMiles).toBe(0);
    expect(impact.deficit).toBe(0);
  });
  
  it('should format currency localized correctly', () => {
    const impact = calculateTangibleImpact(1000, 208, 'india');
    expect(impact.currencySymbol).toBe('₹');
    // Deficit = 1000 - 208 = 792 kg. 792/1000 = 0.792 tons. Cost = 25 * 83 = 2075. 0.792 * 2075 = 1643.4
    expect(impact.offsetCost).toBe("1,643"); // formatted due to > 100
  });
});
