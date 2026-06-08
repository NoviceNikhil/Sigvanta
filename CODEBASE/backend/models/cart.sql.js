const { DataTypes } = require("sequelize");
// const {sequelize} = require("../config/sql");
const sequelize = require("../config/db");

const Cart = sequelize.define(
  "Cart",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "ID",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "ID",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "carts", // Assuming table name; adjust if needed
    timestamps: true,
  },
);

module.exports = Cart;
