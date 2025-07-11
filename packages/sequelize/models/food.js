'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Food.init({
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    servingSize: DataTypes.FLOAT,
    servingUnit: DataTypes.STRING,
    calories: DataTypes.FLOAT,
    protein: DataTypes.FLOAT,
    carbs: DataTypes.FLOAT,
    fat: DataTypes.FLOAT,
    fiber: DataTypes.FLOAT,
    sugar: DataTypes.FLOAT,
    sodium: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Food',
  });
  return Food;
};