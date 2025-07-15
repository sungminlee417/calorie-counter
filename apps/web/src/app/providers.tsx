"use client";
import React, { ReactNode, useMemo, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeModeProvider, useThemeMode } from "../context/ThemeModeContext";

function InnerProviders({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode();

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider theme={theme}>
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
      <InnerProviders>{children}</InnerProviders>
    </ThemeModeProvider>
  );
}
