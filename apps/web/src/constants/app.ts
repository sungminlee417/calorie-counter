// Search and pagination constants
export const SEARCH_DEBOUNCE_DELAY = 300;
export const SEARCH_MIN_LENGTH = 3;
export const PAGE_SIZE = 10;

// UI constants - matches MacroGoalPanel color scheme
export const MACRO_CHART_COLORS = {
  carbs: "#ff9800", // Orange (Restaurant icon)
  fat: "#43a047", // Green (EmojiNature icon)
  protein: "#1976d2", // Blue (FitnessCenter primary color)
  calories: "#d32f2f", // Red (LocalFireDepartment error color)
} as const;

// Enhanced UI theme colors for consistent design
export const UI_COLORS = {
  gradients: {
    primary: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
    secondary: "linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)",
    success: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
    warning: "linear-gradient(135deg, #ed6c02 0%, #ffb74d 100%)",
    error: "linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)",
    neutral: {
      light: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      dark: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    },
  },
  borders: {
    light: "rgba(0, 0, 0, 0.12)",
    dark: "rgba(255, 255, 255, 0.12)",
  },
  shadows: {
    soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
    medium: "0 4px 16px rgba(0, 0, 0, 0.12)",
    strong: "0 8px 32px rgba(0, 0, 0, 0.16)",
  },
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
