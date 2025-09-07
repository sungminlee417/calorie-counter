import { Metadata } from "next";
import Foods from "@/components/food/Foods";

export const metadata: Metadata = {
  title: "Food Database - Calorie Counter",
  description: "Search for foods across multiple nutrition databases",
};

export default function FoodSearchPage() {
  return <Foods />;
}
