const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbName = process.env.DB_NAME || process.env.SQL_DB_NAME;
const dbUser = process.env.DB_USER || process.env.SQL_DB_USER;
const dbPassword = process.env.DB_PASSWORD || process.env.SQL_PASSWORD;
const dbHost = process.env.DB_HOST || process.env.SQL_HOST || "127.0.0.1";
const dbPortRaw = process.env.DB_PORT || process.env.SQL_PORT;
const dbPort = dbPortRaw ? Number(dbPortRaw) : undefined;

const dialectOptions = {};
if (process.env.SQL_SSL === "true") {
  dialectOptions.ssl = {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  };
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  ...(Object.keys(dialectOptions).length > 0 && { dialectOptions }),
});

module.exports = sequelize;