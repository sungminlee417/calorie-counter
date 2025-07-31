"use client";

import * as React from "react";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Box, Typography, useTheme } from "@mui/material";
import { LocalFireDepartment, Logout, Person } from "@mui/icons-material";

import { fetchLogout } from "@/lib/supabase/fetch-auth";
import ThemeSelector from "./ThemeSelector";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";
import { useThemeMode } from "@/context/ThemeModeContext";

const Navigation = () => {
  const theme = useTheme();
  const { resolvedTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      role="banner"
      key={resolvedTheme} // Force re-render when theme changes
      sx={{
        background:
          theme.palette.mode === "dark"
            ? UI_COLORS.gradients.neutral.dark
            : UI_COLORS.gradients.neutral.light,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: UI_COLORS.shadows.medium,
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo and Brand Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            flexGrow: 1,
            gap: 2,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 60,
              height: 60,
              borderRadius: 2,
              overflow: "hidden",
              background: `${MACRO_CHART_COLORS.calories}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/logo.png"
              alt="Calorie Counter Logo"
              height={50}
              width={50}
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>

          <Box>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.calories}, ${MACRO_CHART_COLORS.carbs})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              Calorie Counter
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
            >
              <LocalFireDepartment
                sx={{
                  color: MACRO_CHART_COLORS.calories,
                  fontSize: 14,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="500"
              >
                Track • Analyze • Optimize
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ThemeSelector />

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{
              backgroundColor: `${theme.palette.primary.main}15`,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: `${theme.palette.primary.main}25`,
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Person />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                mt: 1,
                boxShadow: UI_COLORS.shadows.medium,
                minWidth: 160,
              },
            }}
          >
            <MenuItem
              onClick={fetchLogout}
              sx={{
                gap: 1.5,
                py: 1.5,
                "&:hover": {
                  backgroundColor: `${theme.palette.error.light}15`,
                  color: theme.palette.error.main,
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Logout sx={{ fontSize: 18 }} />
              <Typography variant="body2" fontWeight="500">
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
