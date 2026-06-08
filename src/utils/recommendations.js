/**
 * CarbonLens — Smart Recommendations Engine
 *
 * Analyzes the user's carbon footprint breakdown and generates
 * personalized, actionable recommendations ranked by impact.
 *
 * Uses a rule-based approach with contextual awareness —
 * recommendations adapt based on the user's specific profile.
 *
 * @module recommendations
 */

import { CATEGORY_META } from '../data/emissionFactors.js';

/**
 * Master recommendations database.
 * Each recommendation targets a specific category and condition.
 *
 * @type {Array<{
 *   id: string,
 *   category: string,
 *   title: string,
 *   description: string,
 *   savingsKg: number,
 *   difficulty: 'easy'|'medium'|'hard',
 *   condition: function,
 *   icon: string
 * }>}
 */
const RECOMMENDATIONS_DB = [
  // ── Transport ──────────────────────────────────────────────────────────
  {
    id: 'transport-switch-ev',
    category: 'transport',
    title: 'Switch to an Electric Vehicle',
    description:
      'EVs produce up to 75% fewer emissions than gasoline cars over their lifetime. Consider making the switch on your next vehicle purchase.',
    savingsKg: 120,
    difficulty: 'hard',
    condition: (data) =>
      data?.transport?.vehicleType === 'car_gasoline' ||
      data?.transport?.vehicleType === 'car_diesel',
    icon: '⚡',
  },
  {
    id: 'transport-switch-hybrid',
    category: 'transport',
    title: 'Consider a Hybrid Vehicle',
    description:
      'Hybrid vehicles can reduce your driving emissions by about 50% compared to traditional gasoline cars.',
    savingsKg: 60,
    difficulty: 'medium',
    condition: (data) =>
      data?.transport?.vehicleType === 'car_gasoline' &&
      data?.transport?.weeklyKm > 100,
    icon: '🔋',
  },
  {
    id: 'transport-reduce-driving',
    category: 'transport',
    title: 'Reduce Weekly Driving by 20%',
    description:
      'Combine trips, carpool, or work from home one extra day. Even a small reduction in driving makes a meaningful difference.',
    savingsKg: 35,
    difficulty: 'easy',
    condition: (data) => data?.transport?.weeklyKm > 50,
    icon: '🚗',
  },
  {
    id: 'transport-public-transit',
    category: 'transport',
    title: 'Use Public Transit for Commuting',
    description:
      'Taking the bus or train instead of driving can cut your commuting emissions by up to 65%. Many cities offer monthly passes at a discount.',
    savingsKg: 45,
    difficulty: 'medium',
    condition: (data) =>
      data?.transport?.weeklyKm > 30 && data?.transport?.publicTransportKm < 20,
    icon: '🚌',
  },
  {
    id: 'transport-bike-walk',
    category: 'transport',
    title: 'Walk or Cycle for Short Trips',
    description:
      'For trips under 5 km, walking or cycling produces zero emissions and boosts your health. It\'s the ultimate win-win.',
    savingsKg: 15,
    difficulty: 'easy',
    condition: (data) => data?.transport?.weeklyKm > 20,
    icon: '🚲',
  },
  {
    id: 'transport-reduce-flights',
    category: 'transport',
    title: 'Reduce Air Travel',
    description:
      'One fewer round-trip flight per year can save hundreds of kg of CO₂e. Consider video calls for business or exploring closer destinations.',
    savingsKg: 200,
    difficulty: 'medium',
    condition: (data) =>
      data?.transport?.flights?.some((f) => f.tripsPerYear > 1),
    icon: '✈️',
  },
  {
    id: 'transport-offset-flights',
    category: 'transport',
    title: 'Offset Your Flight Emissions',
    description:
      'When flying is necessary, purchase verified carbon offsets. Look for Gold Standard or VCS certified programs.',
    savingsKg: 100,
    difficulty: 'easy',
    condition: (data) =>
      data?.transport?.flights?.some((f) => f.tripsPerYear > 0),
    icon: '🌳',
  },

  // ── Energy ─────────────────────────────────────────────────────────────
  {
    id: 'energy-solar-panels',
    category: 'energy',
    title: 'Install Solar Panels',
    description:
      'Rooftop solar can offset 80-100% of your electricity emissions. Many regions offer tax credits and incentives that make this surprisingly affordable.',
    savingsKg: 150,
    difficulty: 'hard',
    condition: (data) =>
      data?.energy?.electricityKwh > 300 &&
      (data?.energy?.renewablePercentage || 0) < 50,
    icon: '☀️',
  },
  {
    id: 'energy-green-tariff',
    category: 'energy',
    title: 'Switch to a Green Energy Tariff',
    description:
      'Many utility providers now offer 100% renewable electricity tariffs. The price premium is often minimal — sometimes even cheaper.',
    savingsKg: 100,
    difficulty: 'easy',
    condition: (data) => (data?.energy?.renewablePercentage || 0) < 30,
    icon: '💚',
  },
  {
    id: 'energy-reduce-electricity',
    category: 'energy',
    title: 'Reduce Electricity Usage by 15%',
    description:
      'Switch to LED bulbs, unplug devices on standby, and use energy-efficient appliances. These small changes add up fast.',
    savingsKg: 30,
    difficulty: 'easy',
    condition: (data) => data?.energy?.electricityKwh > 200,
    icon: '💡',
  },
  {
    id: 'energy-smart-thermostat',
    category: 'energy',
    title: 'Install a Smart Thermostat',
    description:
      'Smart thermostats can reduce heating/cooling energy by 10-25% by learning your schedule and optimizing automatically.',
    savingsKg: 40,
    difficulty: 'medium',
    condition: (data) =>
      data?.energy?.heatingUsage > 100 &&
      data?.energy?.heatingType !== 'solar',
    icon: '🌡️',
  },
  {
    id: 'energy-insulation',
    category: 'energy',
    title: 'Improve Home Insulation',
    description:
      'Proper insulation can reduce heating energy by up to 40%. Start with attic and window sealing for the best return on investment.',
    savingsKg: 60,
    difficulty: 'hard',
    condition: (data) => data?.energy?.heatingUsage > 150,
    icon: '🏠',
  },
  {
    id: 'energy-heat-pump',
    category: 'energy',
    title: 'Switch to a Heat Pump',
    description:
      'Heat pumps are 3-4x more efficient than traditional heating. They can dramatically cut your heating emissions and energy costs.',
    savingsKg: 80,
    difficulty: 'hard',
    condition: (data) =>
      data?.energy?.heatingType === 'natural_gas' ||
      data?.energy?.heatingType === 'heating_oil',
    icon: '🔄',
  },

  // ── Diet ───────────────────────────────────────────────────────────────
  {
    id: 'diet-reduce-meat',
    category: 'diet',
    title: 'Reduce Meat Consumption',
    description:
      'Cutting meat intake by half can save over 50 kg CO₂e per month. Try "Meatless Mondays" or swap one meal a day for plant-based.',
    savingsKg: 55,
    difficulty: 'medium',
    condition: (data) =>
      data?.diet?.dietType === 'high_meat' || data?.diet?.dietType === 'medium_meat',
    icon: '🥗',
  },
  {
    id: 'diet-go-vegetarian',
    category: 'diet',
    title: 'Try a Vegetarian Diet',
    description:
      'A vegetarian diet produces about 60% fewer food-related emissions. Explore the wide variety of delicious plant-based recipes available.',
    savingsKg: 95,
    difficulty: 'hard',
    condition: (data) => data?.diet?.dietType === 'high_meat',
    icon: '🌿',
  },
  {
    id: 'diet-reduce-food-waste',
    category: 'diet',
    title: 'Reduce Food Waste',
    description:
      'Plan meals ahead, store food properly, and compost scraps. Reducing food waste cuts both emissions and your grocery bill.',
    savingsKg: 20,
    difficulty: 'easy',
    condition: (data) =>
      data?.diet?.foodWaste === 'high' || data?.diet?.foodWaste === 'average',
    icon: '🗑️',
  },
  {
    id: 'diet-buy-local',
    category: 'diet',
    title: 'Buy Local and Seasonal Food',
    description:
      'Local and seasonal produce has a smaller transport footprint. Visit farmers markets or join a local food co-op.',
    savingsKg: 15,
    difficulty: 'easy',
    condition: (data) => data?.diet?.localFood !== 'mostly_local',
    icon: '🌾',
  },
  {
    id: 'diet-plant-based-protein',
    category: 'diet',
    title: 'Choose Plant-Based Proteins',
    description:
      'Beans, lentils, tofu, and nuts are nutritious alternatives to meat with a fraction of the carbon footprint.',
    savingsKg: 30,
    difficulty: 'easy',
    condition: (data) =>
      data?.diet?.dietType !== 'vegan' && data?.diet?.dietType !== 'vegetarian',
    icon: '🫘',
  },

  // ── Lifestyle ──────────────────────────────────────────────────────────
  {
    id: 'lifestyle-reduce-shopping',
    category: 'lifestyle',
    title: 'Adopt Mindful Shopping Habits',
    description:
      'Buy quality over quantity, choose second-hand, and avoid fast fashion. Each purchase has a hidden carbon cost.',
    savingsKg: 40,
    difficulty: 'easy',
    condition: (data) =>
      data?.lifestyle?.shoppingLevel === 'frequent' ||
      data?.lifestyle?.shoppingLevel === 'excessive',
    icon: '🛍️',
  },
  {
    id: 'lifestyle-recycle-more',
    category: 'lifestyle',
    title: 'Improve Your Recycling Habits',
    description:
      'Properly sort recyclables and learn what your local facility accepts. Recycling reduces the need for raw material extraction.',
    savingsKg: 15,
    difficulty: 'easy',
    condition: (data) =>
      data?.lifestyle?.recyclingLevel === 'none' ||
      data?.lifestyle?.recyclingLevel === 'some',
    icon: '♻️',
  },
  {
    id: 'lifestyle-reduce-screen-time',
    category: 'lifestyle',
    title: 'Reduce Digital Carbon Footprint',
    description:
      'Stream in standard definition when possible, unsubscribe from unnecessary emails, and turn off devices when not in use.',
    savingsKg: 10,
    difficulty: 'easy',
    condition: (data) => data?.lifestyle?.electronicsLevel === 'high',
    icon: '📱',
  },
  {
    id: 'lifestyle-water-conservation',
    category: 'lifestyle',
    title: 'Conserve Water Usage',
    description:
      'Take shorter showers, fix leaks, and use water-efficient appliances. Water treatment and heating are energy-intensive.',
    savingsKg: 8,
    difficulty: 'easy',
    condition: (data) => data?.lifestyle?.waterLevel === 'high',
    icon: '💧',
  },
  {
    id: 'lifestyle-composting',
    category: 'lifestyle',
    title: 'Start Composting',
    description:
      'Composting organic waste prevents methane emissions from landfills. It also creates nutrient-rich soil for gardens.',
    savingsKg: 12,
    difficulty: 'easy',
    condition: () => true,
    icon: '🪱',
  },
];

/**
 * Generate personalized recommendations based on user data.
 * Returns recommendations sorted by impact (highest savings first).
 *
 * @param {Object} userData - All category user input data
 * @param {Object} breakdown - Emissions breakdown from calculateTotalFootprint
 * @param {Object} [options]
 * @param {number} [options.maxResults=10] - Maximum recommendations to return
 * @returns {Array<Object>} Sorted and filtered recommendations
 */
export function generateRecommendations(userData, breakdown, options = {}) {
  const { maxResults = 10 } = options;

  if (!userData || !breakdown) return [];

  // Find applicable recommendations
  const applicable = RECOMMENDATIONS_DB.filter((rec) => {
    try {
      return rec.condition(userData);
    } catch {
      return false;
    }
  });

  // Score and sort recommendations
  const scored = applicable.map((rec) => {
    const categoryEmissions = breakdown[rec.category] || 0;
    const categoryMeta = CATEGORY_META[rec.category];

    // Priority score: combination of absolute savings and % of category
    const percentImpact =
      categoryEmissions > 0 ? (rec.savingsKg / categoryEmissions) * 100 : 0;
    const priorityScore = rec.savingsKg * 0.6 + percentImpact * 0.4;

    return {
      ...rec,
      categoryLabel: categoryMeta?.label || rec.category,
      categoryColor: categoryMeta?.color || '#888',
      categoryIcon: categoryMeta?.icon || '📊',
      percentImpact: Math.round(percentImpact),
      priorityScore,
      // Remove the condition function from the output (not serializable)
      condition: undefined,
    };
  });

  // Sort by priority score descending
  scored.sort((a, b) => b.priorityScore - a.priorityScore);

  return scored.slice(0, maxResults);
}

/**
 * Generate a summary insight message based on footprint data.
 *
 * @param {Object} breakdown - Emissions breakdown
 * @param {number} total - Total monthly emissions
 * @returns {Object} Summary insight with message and emphasis
 */
export function generateInsightSummary(breakdown, total) {
  if (!breakdown || total <= 0) {
    return {
      message: 'Complete the calculator to get personalized insights.',
      emphasis: 'neutral',
    };
  }

  // Find the highest category
  const categories = Object.entries(breakdown);
  categories.sort((a, b) => b[1] - a[1]);
  const [topCategory, topValue] = categories[0];
  const topPercent = Math.round((topValue / total) * 100);
  const meta = CATEGORY_META[topCategory];

  let message = '';
  let emphasis = 'info';

  if (total <= 200) {
    message = `Great job! Your footprint is well below the global average. Your biggest area is ${meta?.label || topCategory} (${topPercent}%), but it's already quite low.`;
    emphasis = 'positive';
  } else if (total <= 400) {
    message = `You're doing better than average! Focus on ${meta?.label || topCategory} — it makes up ${topPercent}% of your footprint and has the most room for improvement.`;
    emphasis = 'positive';
  } else if (total <= 700) {
    message = `Your carbon footprint is around the global average. ${meta?.label || topCategory} accounts for ${topPercent}% of your emissions — start there for the biggest impact.`;
    emphasis = 'info';
  } else {
    message = `Your footprint is above average, but small changes can make a big difference. ${meta?.label || topCategory} is your largest category at ${topPercent}% — our personalized tips can help you cut it significantly.`;
    emphasis = 'warning';
  }

  return { message, emphasis, topCategory, topPercent };
}
