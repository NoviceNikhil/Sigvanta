const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/sql");
const sequelize = require("../config/db");

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "ID",
      },
      onDelete: "CASCADE",
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "inventory",
    timestamps: true,
  },
);

module.exports = Inventory;
