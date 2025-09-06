import { Metadata } from "next";
import EnhancedFoodList from "@/components/food/EnhancedFoodList";

export const metadata: Metadata = {
  title: "Food Search - Calorie Counter",
  description: "Search for foods across multiple nutrition databases",
};

export default function FoodSearchPage() {
  return <EnhancedFoodList />;
}
