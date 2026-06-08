/**
 * CarbonLens — Application Context & State Management
 *
 * Centralized state management using React Context + useReducer.
 * Handles: calculator data, snapshots history, badges, user profile.
 * Automatically syncs to localStorage for persistence.
 *
 * @module AppContext
 */

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { calculateTotalFootprint, compareToAverage } from '../utils/calculator.js';
import { generateRecommendations, generateInsightSummary } from '../utils/recommendations.js';
import { checkBadges, calculatePoints, getCurrentLevel, calculateStreak } from '../utils/badges.js';

const STORAGE_KEY = 'carbonlens_data';

/** @type {Object} Initial application state */
const initialState = {
  /** Current calculator input data */
  calculatorData: {
    transport: {
      vehicleType: 'car_gasoline',
      weeklyKm: 0,
      flights: [
        { type: 'short_haul', tripsPerYear: 0 },
        { type: 'medium_haul', tripsPerYear: 0 },
        { type: 'long_haul', tripsPerYear: 0 },
      ],
      publicTransportKm: 0,
      publicTransportType: 'bus',
    },
    energy: {
      electricityKwh: 0,
      heatingType: 'natural_gas',
      heatingUsage: 0,
      renewablePercentage: 0,
    },
    diet: {
      dietType: 'medium_meat',
      foodWaste: 'average',
      localFood: 'mostly_imported',
    },
    lifestyle: {
      shoppingLevel: 'average',
      electronicsLevel: 'moderate',
      waterLevel: 'average',
      recyclingLevel: 'some',
    },
  },
  /** Calculated results */
  results: null,
  /** Historical monthly snapshots */
  snapshots: [],
  /** Unlocked badge IDs */
  unlockedBadges: [],
  /** Completed action IDs */
  completedActions: [],
  /** User profile / preferences */
  profile: {
    country: 'global',
    name: '',
    simulatorUsed: false,
    dataExported: false,
  },
  /** Current page for routing */
  currentPage: 'landing',
  /** Whether calculation has been done at least once */
  hasCalculated: false,
  /** Current UI theme ('dark' or 'light') */
  theme: 'dark',
};

/**
 * Load state from localStorage.
 * @returns {Object} Saved state merged with defaults
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        // Always reset current page to landing on fresh load
        currentPage: parsed.hasCalculated ? 'dashboard' : 'landing',
      };
    }
  } catch (error) {
    console.warn('CarbonLens: Failed to load saved data:', error);
  }
  return initialState;
}

/**
 * Save state to localStorage.
 * @param {Object} state - Current state to persist
 */
function saveState(state) {
  try {
    const toSave = {
      calculatorData: state.calculatorData,
      results: state.results,
      snapshots: state.snapshots,
      unlockedBadges: state.unlockedBadges,
      completedActions: state.completedActions,
      profile: state.profile,
      hasCalculated: state.hasCalculated,
      theme: state.theme,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.warn('CarbonLens: Failed to save data:', error);
  }
}

/**
 * Action types for the reducer.
 * @enum {string}
 */
export const ActionTypes = {
  SET_CALCULATOR_DATA: 'SET_CALCULATOR_DATA',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  CALCULATE: 'CALCULATE',
  SAVE_SNAPSHOT: 'SAVE_SNAPSHOT',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  NAVIGATE: 'NAVIGATE',
  MARK_SIMULATOR_USED: 'MARK_SIMULATOR_USED',
  MARK_DATA_EXPORTED: 'MARK_DATA_EXPORTED',
  RESET_DATA: 'RESET_DATA',
  IMPORT_DATA: 'IMPORT_DATA',
  TOGGLE_THEME: 'TOGGLE_THEME',
};

/**
 * Application state reducer.
 *
 * @param {Object} state - Current state
 * @param {Object} action - Dispatched action
 * @returns {Object} New state
 */
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CALCULATOR_DATA:
      return {
        ...state,
        calculatorData: { ...state.calculatorData, ...action.payload },
      };

    case ActionTypes.UPDATE_CATEGORY:
      return {
        ...state,
        calculatorData: {
          ...state.calculatorData,
          [action.category]: {
            ...state.calculatorData[action.category],
            ...action.payload,
          },
        },
      };

    case ActionTypes.CALCULATE: {
      const results = calculateTotalFootprint(state.calculatorData);
      const comparison = compareToAverage(results.total, state.profile.country);
      const recommendations = generateRecommendations(
        state.calculatorData,
        results.breakdown
      );
      const insight = generateInsightSummary(results.breakdown, results.total);

      // Update badge stats
      const stats = buildStats(state, results.total);
      const unlockedBadges = checkBadges(stats);

      return {
        ...state,
        results: {
          ...results,
          comparison,
          recommendations,
          insight,
        },
        unlockedBadges,
        hasCalculated: true,
      };
    }

    case ActionTypes.SAVE_SNAPSHOT: {
      const now = new Date().toISOString();
      const snapshot = {
        date: now,
        month: new Date().toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        }),
        total: state.results?.total || 0,
        breakdown: state.results?.breakdown || {},
        data: { ...state.calculatorData },
      };

      // Prevent duplicate snapshots in the same month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const filtered = state.snapshots.filter((s) => {
        const d = new Date(s.date);
        return !(d.getMonth() === currentMonth && d.getFullYear() === currentYear);
      });

      return {
        ...state,
        snapshots: [...filtered, snapshot],
      };
    }

    case ActionTypes.TOGGLE_ACTION: {
      const actionId = action.payload;
      const completed = state.completedActions.includes(actionId)
        ? state.completedActions.filter((id) => id !== actionId)
        : [...state.completedActions, actionId];

      // Re-check badges with updated action count
      const stats = buildStats(
        { ...state, completedActions: completed },
        state.results?.total || 0
      );
      const unlockedBadges = checkBadges(stats);

      return {
        ...state,
        completedActions: completed,
        unlockedBadges,
      };
    }

    case ActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };

    case ActionTypes.NAVIGATE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case ActionTypes.MARK_SIMULATOR_USED: {
      const newState = {
        ...state,
        profile: { ...state.profile, simulatorUsed: true },
      };
      const stats = buildStats(newState, state.results?.total || 0);
      return { ...newState, unlockedBadges: checkBadges(stats) };
    }

    case ActionTypes.MARK_DATA_EXPORTED: {
      const newState = {
        ...state,
        profile: { ...state.profile, dataExported: true },
      };
      const stats = buildStats(newState, state.results?.total || 0);
      return { ...newState, unlockedBadges: checkBadges(stats) };
    }

    case ActionTypes.RESET_DATA:
      return { ...initialState, currentPage: 'landing' };

    case ActionTypes.IMPORT_DATA:
      try {
        const imported = JSON.parse(action.payload);
        
        // Security: Validate schema structure to prevent prototype pollution and XSS
        if (!imported || typeof imported !== 'object') {
          throw new Error('Invalid format: Expected JSON object');
        }
        
        // Safe deep mapping
        const safeImport = {
          calculatorData: imported.calculatorData || state.calculatorData,
          results: imported.results || null,
          snapshots: Array.isArray(imported.snapshots) ? imported.snapshots : [],
          unlockedBadges: Array.isArray(imported.unlockedBadges) ? imported.unlockedBadges : [],
          completedActions: Array.isArray(imported.completedActions) ? imported.completedActions : [],
          profile: { ...state.profile, ...(imported.profile || {}) },
          hasCalculated: Boolean(imported.hasCalculated),
          theme: ['light', 'dark'].includes(imported.theme) ? imported.theme : state.theme,
        };

        return {
          ...state,
          ...safeImport,
          currentPage: safeImport.hasCalculated ? 'dashboard' : 'landing',
        };
      } catch (error) {
        console.error('Security Warning: Data import rejected due to validation failure.', error);
        return state;
      }

    case ActionTypes.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };

    default:
      return state;
  }
}

/**
 * Build badge-check stats from current state.
 *
 * @param {Object} state - Current app state
 * @param {number} latestTotal - Latest monthly total
 * @returns {Object} Stats object for badge checking
 */
function buildStats(state, latestTotal) {
  const snapshotDates = state.snapshots.map((s) => s.date);
  const firstTotal = state.snapshots.length > 0 ? state.snapshots[0].total : latestTotal;

  return {
    totalScans: state.snapshots.length + (state.hasCalculated ? 1 : 0),
    currentStreak: calculateStreak(snapshotDates),
    latestTotal,
    firstTotal,
    completedActions: state.completedActions?.length || 0,
    simulatorUsed: state.profile?.simulatorUsed || false,
    dataExported: state.profile?.dataExported || false,
  };
}

/** React Context */
const AppContext = createContext(null);

/**
 * Application context provider component.
 * Wraps the app and provides state + dispatch to all children.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadState);

  // Auto-save to localStorage on state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Convenience action creators
  const actions = {
    updateCategory: useCallback(
      (category, data) =>
        dispatch({ type: ActionTypes.UPDATE_CATEGORY, category, payload: data }),
      []
    ),
    calculate: useCallback(
      () => dispatch({ type: ActionTypes.CALCULATE }),
      []
    ),
    saveSnapshot: useCallback(
      () => dispatch({ type: ActionTypes.SAVE_SNAPSHOT }),
      []
    ),
    toggleAction: useCallback(
      (actionId) =>
        dispatch({ type: ActionTypes.TOGGLE_ACTION, payload: actionId }),
      []
    ),
    navigate: useCallback(
      (page) => dispatch({ type: ActionTypes.NAVIGATE, payload: page }),
      []
    ),
    updateProfile: useCallback(
      (data) =>
        dispatch({ type: ActionTypes.UPDATE_PROFILE, payload: data }),
      []
    ),
    markSimulatorUsed: useCallback(
      () => dispatch({ type: ActionTypes.MARK_SIMULATOR_USED }),
      []
    ),
    exportData: useCallback(() => {
      dispatch({ type: ActionTypes.MARK_DATA_EXPORTED });
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carbonlens-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, []),
    importData: useCallback(
      (jsonString) =>
        dispatch({ type: ActionTypes.IMPORT_DATA, payload: jsonString }),
      []
    ),
    resetData: useCallback(
      () => dispatch({ type: ActionTypes.RESET_DATA }),
      []
    ),
    toggleTheme: useCallback(
      () => dispatch({ type: ActionTypes.TOGGLE_THEME }),
      []
    ),
  };

  // Derived data
  const derived = {
    stats: buildStats(state, state.results?.total || 0),
    points: calculatePoints(buildStats(state, state.results?.total || 0)),
    level: getCurrentLevel(
      calculatePoints(buildStats(state, state.results?.total || 0))
    ),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions, derived }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook to access the application context.
 *
 * @returns {{ state: Object, dispatch: Function, actions: Object, derived: Object }}
 * @throws {Error} If used outside of AppProvider
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
