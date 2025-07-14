import React from "react";

import { Grid } from "@mui/material";

import Card from "@/components/ui/Card";
import FoodList from "@/components/food/FoodList";
import FoodEntryList from "@/components/food/FoodEntryList";
import MacrosChart from "@/components/food/MacrosChart";
import { requireAuth } from "@/utils/auth";
import MacroGoalsCard from "@/components/goal/MacroGoal";

const Page = async () => {
  await requireAuth();

  return (
    <Grid container padding={2} spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <MacrosChart />
        </Card>
      </Grid>
      <Grid size={{ lg: 4, md: 6, xs: 12 }}>
        <Card>
          <FoodEntryList />
        </Card>
      </Grid>
      <Grid size={{ lg: 4, md: 6, xs: 12 }}>
        <Card>
          <FoodList />
        </Card>
      </Grid>
      <Grid size={{ lg: 4, md: 6, xs: 12 }}>
        <Card>
          <MacroGoalsCard />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Page;
