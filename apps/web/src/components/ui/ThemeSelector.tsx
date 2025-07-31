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
          size="medium"
          onClick={handleClick}
          aria-label="Theme selector"
          aria-controls={open ? "theme-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
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
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
            background:
              resolvedTheme === "dark"
                ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
                : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
            border: `1px solid ${resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}`,
          },
        }}
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
