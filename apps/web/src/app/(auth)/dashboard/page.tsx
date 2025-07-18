import React from "react";
import { Grid } from "@mui/material";

import Card from "@/components/ui/Card";
import FoodList from "@/components/food/FoodList";
import FoodEntryList from "@/components/food/FoodEntryList";
import MacrosChart from "@/components/food/MacrosChart";
import { requireAuth } from "@/utils/auth";
import MacroGoalPanel from "@/components/goal/MacroGoalPanel";

const Page = async () => {
  await requireAuth();

  return (
    <Grid container padding={2} spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <MacrosChart />
        </Card>
      </Grid>

      <Grid
        size={{ lg: 4, md: 6, xs: 12 }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <FoodEntryList />
        </Card>
      </Grid>

      <Grid
        size={{ lg: 4, md: 6, xs: 12 }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <FoodList />
        </Card>
      </Grid>

      <Grid
        size={{ lg: 4, md: 6, xs: 12 }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <MacroGoalPanel />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Page;
