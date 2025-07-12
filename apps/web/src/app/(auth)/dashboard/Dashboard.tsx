import { Grid } from "@mui/material";

import FoodList from "@/components/food/FoodList";
import Card from "@/components/ui/Card";

const Dashboard = () => {
  return (
    <Grid container padding={2}>
      <Grid size={4}>
        <Card>
          <FoodList />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
