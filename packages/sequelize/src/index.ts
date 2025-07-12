export { default as sequelize } from "./db";
export * from "./models/User";
export * from "./models/Food";
export * from "./models/FoodEntry";

import { Food } from "./models/Food";
import { FoodEntry } from "./models/FoodEntry";

Food.hasMany(FoodEntry, { foreignKey: "foodId" });
FoodEntry.belongsTo(Food, { foreignKey: "foodId" });
