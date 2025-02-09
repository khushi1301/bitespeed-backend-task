const app = require("./app");
const { sequelize, initDB } = require("./src/models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
