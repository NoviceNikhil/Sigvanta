const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/sql");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "ShoppingBag",
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "bg-blue-500",
    },
  },
  {
    tableName: "categories",
    timestamps: true,
  },
);

module.exports = Category;
