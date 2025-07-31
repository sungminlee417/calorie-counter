"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  THEME,
  type ThemePreference,
  type ResolvedTheme,
} from "@/constants/app";

interface ThemeModeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setThemePreference: (preference: ThemePreference) => void;
  toggleMode: () => void;
  systemTheme: ResolvedTheme;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined
);

/**
 * Hook to detect system theme preference
 */
const useSystemTheme = (): ResolvedTheme => {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return systemTheme;
};

export const ThemeModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const systemTheme = useSystemTheme();

  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(
        THEME.STORAGE_KEY
      ) as ThemePreference | null;
      if (
        stored === THEME.MODES.DARK ||
        stored === THEME.MODES.LIGHT ||
        stored === THEME.MODES.SYSTEM
      ) {
        return stored;
      }
    }
    return THEME.DEFAULT_MODE as ThemePreference;
  });

  // Resolve the actual theme based on preference and system theme
  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (preference === THEME.MODES.SYSTEM) {
      return systemTheme;
    }
    return preference;
  }, [preference, systemTheme]);

  useEffect(() => {
    localStorage.setItem(THEME.STORAGE_KEY, preference);
  }, [preference]);

  const setThemePreference = useCallback((newPreference: ThemePreference) => {
    setPreference(newPreference);
  }, []);

  const toggleMode = useCallback(() => {
    if (preference === THEME.MODES.LIGHT) {
      setPreference(THEME.MODES.DARK);
    } else if (preference === THEME.MODES.DARK) {
      setPreference(THEME.MODES.SYSTEM);
    } else {
      setPreference(THEME.MODES.LIGHT);
    }
  }, [preference]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      preference,
      resolvedTheme,
      setThemePreference,
      toggleMode,
      systemTheme,
    }),
    [preference, resolvedTheme, setThemePreference, toggleMode, systemTheme]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);
  if (!context)
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  return context;
};
