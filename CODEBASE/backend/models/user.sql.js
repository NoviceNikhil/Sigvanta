const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/sql");

const sequelize = require("../config/db");

const validator = require("validator");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isValidEmail(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid email format");
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        isStrong(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error("Password must be strong");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    ProfileIcon: {
      type: DataTypes.STRING,
      // defaultValue: "images/default.png",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  },
);

module.exports = User;
