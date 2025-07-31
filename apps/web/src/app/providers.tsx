"use client";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeModeProvider, useThemeMode } from "../context/ThemeModeContext";
import { DateProvider } from "@/context/DateContext";

function InnerProviders({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useThemeMode();
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => setMounted(true), []);

  const theme = useMemo(
    () => createTheme({ palette: { mode: resolvedTheme } }),
    [resolvedTheme]
  );

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme} key={resolvedTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {children}
        </LocalizationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeModeProvider>
      <DateProvider>
        <InnerProviders>{children}</InnerProviders>
      </DateProvider>
    </ThemeModeProvider>
  );
}
