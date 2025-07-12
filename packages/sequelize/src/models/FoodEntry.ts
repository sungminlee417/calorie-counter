import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

export interface FoodEntryAttributes {
  id: number;
  foodId: number;
  date: Date;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FoodEntryCreationAttributes
  extends Optional<FoodEntryAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the model class
export class FoodEntry
  extends Model<FoodEntryAttributes, FoodEntryCreationAttributes>
  implements FoodEntryAttributes
{
  public id!: number;
  public foodId!: number;
  public date!: Date;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FoodEntry.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    foodId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "FoodEntries",
    timestamps: true,
  }
);
