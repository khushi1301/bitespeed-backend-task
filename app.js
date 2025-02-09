const express = require("express");
const identifyRoutes = require("./src/routes/identify");

const app = express();
app.use(express.json());

app.use("/api", identifyRoutes);

module.exports = app;
