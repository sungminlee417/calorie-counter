"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const STORAGE_KEY = "mui-theme-mode";

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined
);

export const ThemeModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === "dark" || stored === "light") {
        return stored;
      }
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
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
