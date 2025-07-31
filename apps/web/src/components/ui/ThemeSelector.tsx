import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { DarkMode, LightMode, SettingsBrightness } from "@mui/icons-material";
import { useThemeMode } from "@/context/ThemeModeContext";

const ThemeSelector: React.FC = () => {
  const { preference, resolvedTheme, setThemePreference, systemTheme } =
    useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (theme: "light" | "dark" | "system") => {
    setThemePreference(theme);
    handleClose();
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

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      icon: <LightMode />,
      description: "Always use light theme",
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: <DarkMode />,
      description: "Always use dark theme",
    },
    {
      value: "system" as const,
      label: "System",
      icon: <SettingsBrightness />,
      description: `Follow system preference (currently ${systemTheme})`,
    },
  ];

  return (
    <>
      <Tooltip
        title={`Theme: ${preference} ${preference === "system" ? `(${resolvedTheme})` : ""}`}
        arrow
      >
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-label="Theme selector"
          aria-controls={open ? "theme-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ mr: 1 }}
        >
          {getCurrentIcon()}
        </IconButton>
      </Tooltip>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
      >
        {themeOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleThemeSelect(option.value)}
            selected={preference === option.value}
            sx={{ minWidth: 200 }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight="medium">
                {option.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.description}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ThemeSelector;
