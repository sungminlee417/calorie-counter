import { FoodAttributes } from "../models/Food";
import { FoodEntryAttributes } from "../models/FoodEntry";

export interface FoodEntryWithFood extends FoodEntryAttributes {
  food: FoodAttributes;
}
