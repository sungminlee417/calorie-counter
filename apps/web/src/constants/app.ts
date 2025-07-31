// Search and pagination constants
export const SEARCH_DEBOUNCE_DELAY = 300;
export const SEARCH_MIN_LENGTH = 3;
export const PAGE_SIZE = 10;

// UI constants
export const MACRO_CHART_COLORS = {
  carbs: "#8884d8",
  fat: "#82ca9d",
  protein: "#ffc658",
  calories: "#f44336",
} as const;

// Macro calculations
export const MACRO_CALORIES = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

// Form validation
export const FOOD_NAME_MAX_LENGTH = 100;
export const FOOD_BRAND_MAX_LENGTH = 50;

// API endpoints
export const API_ENDPOINTS = {
  chat: "/api/chat",
} as const;

// Theme constants
export const THEME = {
  STORAGE_KEY: "theme-preference",
  MODES: {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
  } as const,
  DEFAULT_MODE: "system",
} as const;

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
