import React from "react";

import { Grid } from "@mui/material";

import Card from "@/components/ui/Card";
import FoodList from "@/components/food/FoodList";
import FoodEntryList from "@/components/food/FoodEntryList";
import MacrosChart from "@/components/food/MacrosChart";
import { requireAuth } from "@/utils/auth";

const Page = async () => {
  await requireAuth();

  return (
    <Grid container padding={2} spacing={2}>
      <Grid size={8}>
        <Card>
          <MacrosChart />
        </Card>
      </Grid>
      <Grid size={4}>
        <Card>
          <FoodEntryList />
        </Card>
      </Grid>
      <Grid size={4}>
        <Card>
          <FoodList />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Page;
