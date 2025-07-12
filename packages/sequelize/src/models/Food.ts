import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

// Define interfaces for attributes and creation attributes
export interface FoodAttributes {
  id: number;
  name: string;
  brand?: string;
  servingSize?: number;
  servingUnit?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FoodCreationAttributes
  extends Optional<FoodAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the model class
export class Food
  extends Model<FoodAttributes, FoodCreationAttributes>
  implements FoodAttributes
{
  public id!: number;
  public name!: string;
  public brand?: string;
  public servingSize?: number;
  public servingUnit?: string;
  public calories?: number;
  public protein?: number;
  public carbs?: number;
  public fat?: number;
  public fiber?: number;
  public sugar?: number;
  public sodium?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Food.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    servingSize: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    servingUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    calories: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    protein: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    carbs: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fiber: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sugar: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sodium: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
    tableName: "foods",
    timestamps: true,
  }
);
