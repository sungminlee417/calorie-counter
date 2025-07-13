export { default as sequelize } from "./db";
export * from "./models/User";
export * from "./models/Food";
export * from "./models/FoodEntry";

export * from "./types";

import { Food } from "./models/Food";
import { FoodEntry } from "./models/FoodEntry";

Food.hasMany(FoodEntry, { foreignKey: "foodId" });
FoodEntry.belongsTo(Food, { as: "food", foreignKey: "foodId" });
