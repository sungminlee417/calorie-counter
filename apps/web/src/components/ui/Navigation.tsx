"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { DarkMode, LightMode } from "@mui/icons-material";

import { fetchLogout } from "@/lib/supabase/fetch-auth";
import { useThemeMode } from "@/context/ThemeModeContext";
import ArrowDatePicker from "../form/ArrowDatePicker";
import { useDate } from "@/context/DateContext";

const Navigation = () => {
  const { mode, toggleMode } = useThemeMode();
  const { selectedDate, setSelectedDate } = useDate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Calorie Counter
        </Typography>

        <ArrowDatePicker
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />

        <IconButton
          color="inherit"
          onClick={toggleMode}
          aria-label="toggle light/dark mode"
          sx={{ mr: 1 }}
        >
          {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>

        <>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
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
          >
            <MenuItem onClick={fetchLogout}>Logout</MenuItem>
          </Menu>
        </>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
