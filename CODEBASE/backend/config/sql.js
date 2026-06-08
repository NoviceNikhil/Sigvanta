require("dotenv").config();
const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(process.env.SQL_DB_NAME, 'root', process.env.SQL_PASSWORD, {
//   host: 'localhost',
//   dialect: 'mysql'//by default it is mysql inodb dialect
//   //can include logging here
// });

// module.exports = sequelize;

const sequelize = new Sequelize(
  process.env.SQL_DB_NAME,
  process.env.SQL_DB_USER,
  process.env.SQL_PASSWORD,
  {
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: "mysql",
    logging: false,
  },
); // Test connection
const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
  } catch (error) {
    console.log(error)
    console.error("MySQL connection failed:", error.message);
    process.exit(1);
  }
};
module.exports = { sequelize, connectSQL };
