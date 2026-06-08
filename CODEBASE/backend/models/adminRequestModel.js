const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userSchema");

const AdminRequest = sequelize.define("AdminRequest", {
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending", // pending | approved | rejected
  },
});

// relation
User.hasMany(AdminRequest, { foreignKey: "userId" });
AdminRequest.belongsTo(User, { foreignKey: "userId" });

module.exports = AdminRequest;