const sequelize = require("../config/database");
const Contact = require("./contact");

const initDB = async () => {
  await sequelize.sync({ alter: true });
  console.log("Database synced!");
};

module.exports = { sequelize, Contact, initDB };
