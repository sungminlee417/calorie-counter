import { Grid } from "@mui/material";

import FoodList from "@/components/food/FoodList";
import Card from "@/components/ui/Card";
import FoodEntryList from "@/components/food/FoodEntryList";

const Dashboard = () => {
  return (
    <Grid container padding={2} spacing={2}>
      <Grid size={4}>
        <Card>
          <FoodList />
        </Card>
      </Grid>
      <Grid size={4}>
        <Card>
          <FoodEntryList />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
