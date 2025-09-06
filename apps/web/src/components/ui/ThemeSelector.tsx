import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { DarkMode, LightMode, SettingsBrightness } from "@mui/icons-material";
import { useThemeMode } from "@/context/ThemeModeContext";

const ThemeSelector: React.FC = () => {
  const { preference, resolvedTheme, setThemePreference, systemTheme } =
    useThemeMode();

  const handleClick = () => {
    const themeOrder: ("light" | "dark" | "system")[] = [
      "light",
      "dark",
      "system",
    ];
    const currentIndex = themeOrder.indexOf(preference);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setThemePreference(themeOrder[nextIndex]);
  };

  const getThemeIcon = (theme: "light" | "dark" | "system") => {
    switch (theme) {
      case "light":
        return <LightMode />;
      case "dark":
        return <DarkMode />;
      case "system":
        return <SettingsBrightness />;
    }
  };

  const getCurrentIcon = () => {
    return getThemeIcon(preference);
  };

  const getTooltipTitle = () => {
    let title = `Theme: ${preference}`;
    if (preference === "system") {
      title += ` (currently ${systemTheme})`;
    }
    return title;
  };

  return (
    <Tooltip title={getTooltipTitle()} arrow>
      <IconButton
        size="medium"
        onClick={handleClick}
        aria-label="Toggle theme"
        sx={{
          mr: { xs: 0.5, sm: 1 },
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          color: resolvedTheme === "dark" ? "grey.300" : "grey.700",
          backgroundColor:
            resolvedTheme === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.04)",
          "&:hover": {
            backgroundColor:
              resolvedTheme === "dark"
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.08)",
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease-in-out",
          "& svg": {
            fontSize: { xs: 20, sm: 24 },
          },
        }}
      >
        {getCurrentIcon()}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSelector;
