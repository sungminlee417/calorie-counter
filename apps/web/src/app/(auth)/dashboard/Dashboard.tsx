"use client";

import React, { useState } from "react";
import { Grid, Box, useTheme } from "@mui/material";

import FoodList from "@/components/food/FoodList";
import FoodEntryList from "@/components/food/FoodEntryList";
import MacrosChart from "@/components/food/MacrosChart";
import MacroGoalPanel from "@/components/goal/MacroGoalPanel";
import ChatFab from "@/components/ai/ChatFab";
import ChatDrawer from "@/components/ai/ChatDrawer";

const Dashboard = () => {
  const theme = useTheme();
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Main Nutrition Chart - Full Width */}
        <Grid size={{ xs: 12 }}>
          <MacrosChart />
        </Grid>

        {/* Three Column Layout for Components */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FoodEntryList />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FoodList />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MacroGoalPanel />
        </Grid>
      </Grid>

      {/* Floating Action Button for Chat */}
      <ChatFab
        hideButton={isChatDrawerOpen}
        onClick={() => setIsChatDrawerOpen(true)}
      />

      {/* Chat Drawer */}
      <ChatDrawer
        isDrawerOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
      />
    </Box>
  );
};

export default Dashboard;
