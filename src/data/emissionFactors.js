/**
 * CarbonLens — Emission Factors Database
 *
 * Emission factors sourced from:
 * - EPA GHG Emission Factors Hub (2024)
 * - IPCC AR6 (2023)
 * - DEFRA Conversion Factors (2024)
 * - Our World in Data
 *
 * All values in kg CO₂e unless otherwise noted.
 */

/**
 * Transport emission factors (kg CO₂e per km)
 * @type {Object.<string, {label: string, factor: number, unit: string, icon: string}>}
 */
export const TRANSPORT_FACTORS = {
  car_gasoline: {
    label: 'Gasoline Car',
    factor: 0.21,
    unit: 'kg CO₂e/km',
    icon: '🚗',
    description: 'Average gasoline passenger vehicle',
  },
  car_diesel: {
    label: 'Diesel Car',
    factor: 0.17,
    unit: 'kg CO₂e/km',
    icon: '🚙',
    description: 'Average diesel passenger vehicle',
  },
  car_hybrid: {
    label: 'Hybrid Car',
    factor: 0.11,
    unit: 'kg CO₂e/km',
    icon: '🔋',
    description: 'Hybrid electric vehicle',
  },
  car_electric: {
    label: 'Electric Car',
    factor: 0.05,
    unit: 'kg CO₂e/km',
    icon: '⚡',
    description: 'Battery electric vehicle (grid average)',
  },
  bus: {
    label: 'Bus',
    factor: 0.089,
    unit: 'kg CO₂e/km',
    icon: '🚌',
    description: 'City bus per passenger',
  },
  train: {
    label: 'Train',
    factor: 0.041,
    unit: 'kg CO₂e/km',
    icon: '🚆',
    description: 'National rail per passenger',
  },
  metro: {
    label: 'Metro / Subway',
    factor: 0.033,
    unit: 'kg CO₂e/km',
    icon: '🚇',
    description: 'Urban rail per passenger',
  },
  motorcycle: {
    label: 'Motorcycle',
    factor: 0.113,
    unit: 'kg CO₂e/km',
    icon: '🏍️',
    description: 'Average motorcycle',
  },
  bicycle: {
    label: 'Bicycle',
    factor: 0.0,
    unit: 'kg CO₂e/km',
    icon: '🚲',
    description: 'Zero emissions',
  },
  walking: {
    label: 'Walking',
    factor: 0.0,
    unit: 'kg CO₂e/km',
    icon: '🚶',
    description: 'Zero emissions',
  },
};

/**
 * Flight emission factors (kg CO₂e per km per passenger)
 * Includes radiative forcing multiplier of 1.9x for high-altitude emissions
 */
export const FLIGHT_FACTORS = {
  short_haul: {
    label: 'Short Haul (<1500 km)',
    factor: 0.255,
    unit: 'kg CO₂e/km',
    avgDistance: 800,
    icon: '✈️',
  },
  medium_haul: {
    label: 'Medium Haul (1500-4000 km)',
    factor: 0.195,
    unit: 'kg CO₂e/km',
    avgDistance: 2500,
    icon: '✈️',
  },
  long_haul: {
    label: 'Long Haul (>4000 km)',
    factor: 0.150,
    unit: 'kg CO₂e/km',
    avgDistance: 8000,
    icon: '✈️',
  },
};

/**
 * Energy emission factors
 */
export const ENERGY_FACTORS = {
  /** Electricity: kg CO₂e per kWh (US grid average) */
  electricity: {
    label: 'Electricity (Grid Average)',
    factor: 0.417,
    unit: 'kg CO₂e/kWh',
    icon: '💡',
  },
  /** Natural gas: kg CO₂e per kWh */
  natural_gas: {
    label: 'Natural Gas',
    factor: 0.202,
    unit: 'kg CO₂e/kWh',
    icon: '🔥',
  },
  /** Heating oil: kg CO₂e per liter */
  heating_oil: {
    label: 'Heating Oil',
    factor: 2.54,
    unit: 'kg CO₂e/liter',
    icon: '🛢️',
  },
  /** LPG: kg CO₂e per kWh */
  lpg: {
    label: 'LPG / Propane',
    factor: 0.214,
    unit: 'kg CO₂e/kWh',
    icon: '🔥',
  },
  /** Solar: effectively zero */
  solar: {
    label: 'Solar Panel',
    factor: 0.0,
    unit: 'kg CO₂e/kWh',
    icon: '☀️',
  },
};

/**
 * Average monthly electricity usage benchmarks (kWh)
 */
export const ELECTRICITY_BENCHMARKS = {
  apartment_small: { label: 'Small Apartment', kwhPerMonth: 200 },
  apartment_large: { label: 'Large Apartment', kwhPerMonth: 400 },
  house_small: { label: 'Small House', kwhPerMonth: 600 },
  house_medium: { label: 'Medium House', kwhPerMonth: 900 },
  house_large: { label: 'Large House', kwhPerMonth: 1200 },
};

/**
 * Diet emission factors (kg CO₂e per month)
 * Based on average dietary patterns from Our World in Data
 */
export const DIET_FACTORS = {
  high_meat: {
    label: 'High Meat Eater',
    factor: 274,
    unit: 'kg CO₂e/month',
    icon: '🥩',
    description: 'Meat with most meals daily',
  },
  medium_meat: {
    label: 'Medium Meat Eater',
    factor: 198,
    unit: 'kg CO₂e/month',
    icon: '🍖',
    description: 'Meat 3-5 times per week',
  },
  low_meat: {
    label: 'Low Meat Eater',
    factor: 148,
    unit: 'kg CO₂e/month',
    icon: '🍗',
    description: 'Meat 1-2 times per week',
  },
  pescatarian: {
    label: 'Pescatarian',
    factor: 120,
    unit: 'kg CO₂e/month',
    icon: '🐟',
    description: 'Fish but no other meat',
  },
  vegetarian: {
    label: 'Vegetarian',
    factor: 103,
    unit: 'kg CO₂e/month',
    icon: '🥗',
    description: 'No meat or fish',
  },
  vegan: {
    label: 'Vegan',
    factor: 85,
    unit: 'kg CO₂e/month',
    icon: '🌱',
    description: 'No animal products',
  },
};

/**
 * Food waste multiplier (percentage that becomes additional emissions)
 */
export const FOOD_WASTE_FACTORS = {
  none: { label: 'Very Low', multiplier: 1.0, description: 'Composting, minimal waste' },
  low: { label: 'Low', multiplier: 1.05, description: 'Some waste but mostly consumed' },
  average: { label: 'Average', multiplier: 1.12, description: 'Typical household waste' },
  high: { label: 'High', multiplier: 1.25, description: 'Significant food thrown away' },
};

/**
 * Local food sourcing offset
 */
export const LOCAL_FOOD_FACTORS = {
  mostly_local: { label: 'Mostly Local/Seasonal', offset: 0.85 },
  some_local: { label: 'Some Local', offset: 0.92 },
  mostly_imported: { label: 'Mostly Imported', offset: 1.0 },
};

/**
 * Lifestyle / consumption factors (kg CO₂e per month)
 */
export const LIFESTYLE_FACTORS = {
  shopping: {
    minimal: { label: 'Minimal', factor: 25, icon: '🛍️', description: 'Buy only essentials' },
    average: { label: 'Average', factor: 75, icon: '🛍️', description: 'Regular shopping' },
    frequent: { label: 'Frequent', factor: 150, icon: '🛍️', description: 'Regular online/retail shopping' },
    excessive: { label: 'Excessive', factor: 250, icon: '🛍️', description: 'Frequent fast fashion, electronics' },
  },
  electronics: {
    low: { label: 'Low', factor: 10, icon: '📱', description: '<2 hrs screen time daily' },
    moderate: { label: 'Moderate', factor: 25, icon: '💻', description: '2-6 hrs screen time daily' },
    high: { label: 'High', factor: 45, icon: '🖥️', description: '6+ hrs, gaming, streaming' },
  },
  water: {
    low: { label: 'Conservative', factor: 5, icon: '💧', description: 'Short showers, water-conscious' },
    average: { label: 'Average', factor: 12, icon: '🚿', description: 'Standard usage' },
    high: { label: 'High', factor: 25, icon: '🛁', description: 'Long showers, baths, garden' },
  },
  recycling: {
    all: { label: 'Recycle Everything', offset: 0.85, icon: '♻️' },
    most: { label: 'Recycle Most', offset: 0.92, icon: '♻️' },
    some: { label: 'Recycle Some', offset: 0.96, icon: '🗑️' },
    none: { label: 'No Recycling', offset: 1.0, icon: '🗑️' },
  },
};

/**
 * National average carbon footprint per capita (kg CO₂e per month)
 */
export const NATIONAL_AVERAGES = {
  global: { label: 'Global Average', value: 383, flag: '🌍', currency: 'USD', symbol: '$', rateToUsd: 1 },
  us: { label: 'United States', value: 1250, flag: '🇺🇸', currency: 'USD', symbol: '$', rateToUsd: 1 },
  uk: { label: 'United Kingdom', value: 458, flag: '🇬🇧', currency: 'GBP', symbol: '£', rateToUsd: 0.79 },
  eu: { label: 'EU Average', value: 542, flag: '🇪🇺', currency: 'EUR', symbol: '€', rateToUsd: 0.92 },
  india: { label: 'India', value: 158, flag: '🇮🇳', currency: 'INR', symbol: '₹', rateToUsd: 83 },
  china: { label: 'China', value: 658, flag: '🇨🇳', currency: 'CNY', symbol: '¥', rateToUsd: 7.2 },
  japan: { label: 'Japan', value: 750, flag: '🇯🇵', currency: 'JPY', symbol: '¥', rateToUsd: 150 },
  australia: { label: 'Australia', value: 1292, flag: '🇦🇺', currency: 'AUD', symbol: 'A$', rateToUsd: 1.5 },
  canada: { label: 'Canada', value: 1208, flag: '🇨🇦', currency: 'CAD', symbol: 'C$', rateToUsd: 1.35 },
  brazil: { label: 'Brazil', value: 183, flag: '🇧🇷', currency: 'BRL', symbol: 'R$', rateToUsd: 5.0 },
  germany: { label: 'Germany', value: 642, flag: '🇩🇪', currency: 'EUR', symbol: '€', rateToUsd: 0.92 },
};

/**
 * Paris Agreement targets (kg CO₂e per month per person)
 */
export const CLIMATE_TARGETS = {
  paris_2030: {
    label: '2030 Target',
    value: 208,
    description: '2.5 tonnes CO₂e per year',
  },
  paris_2050: {
    label: '2050 Target',
    value: 83,
    description: '1 tonne CO₂e per year (net zero pathway)',
  },
};

/**
 * Category metadata for consistent UI rendering
 */
export const CATEGORY_META = {
  transport: {
    key: 'transport',
    label: 'Transportation',
    icon: '🚗',
    color: '#3b82f6',
    colorVar: 'var(--color-transport)',
  },
  energy: {
    key: 'energy',
    label: 'Home Energy',
    icon: '⚡',
    color: '#f59e0b',
    colorVar: 'var(--color-energy)',
  },
  diet: {
    key: 'diet',
    label: 'Diet & Food',
    icon: '🍽️',
    color: '#22c55e',
    colorVar: 'var(--color-diet)',
  },
  lifestyle: {
    key: 'lifestyle',
    label: 'Lifestyle',
    icon: '🛍️',
    color: '#8b5cf6',
    colorVar: 'var(--color-lifestyle)',
  },
};
