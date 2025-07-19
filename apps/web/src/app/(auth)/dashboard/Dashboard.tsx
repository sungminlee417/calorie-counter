"use client";

import React, { useState } from "react";
import { Grid } from "@mui/material";

import Card from "@/components/ui/Card";
import FoodList from "@/components/food/FoodList";
import FoodEntryList from "@/components/food/FoodEntryList";
import MacrosChart from "@/components/food/MacrosChart";
import MacroGoalPanel from "@/components/goal/MacroGoalPanel";
import ChatFab from "@/components/ai/ChatFab";
import ChatDrawer from "@/components/ai/ChatDrawer";

const Dashboard = () => {
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  return (
    <>
      <Grid
        container
        padding={2}
        spacing={2}
        aria-label="Macro Nutrients Chart"
      >
        <Grid size={{ xs: 12 }}>
          <Card>
            <MacrosChart />
          </Card>
        </Grid>

        {[FoodEntryList, FoodList, MacroGoalPanel].map((Component, i) => (
          <Grid
            key={i}
            size={{ lg: 4, md: 6, xs: 12 }}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Card>
              <Component />
            </Card>
          </Grid>
        ))}
      </Grid>
      <ChatFab
        hideButton={isChatDrawerOpen}
        onClick={() => setIsChatDrawerOpen(true)}
      />
      <ChatDrawer
        isDrawerOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
      />
    </>
  );
};

export default Dashboard;
