// Init Vars
require('dotenv');

const config = require('./config.js');
const Functions = require('./util/Functions.js');

const express = require('express');
const app = express();
const port = config.port;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");

const mysql = require('mysql2');
global.db = mysql.createConnection(config.db);
db.connect();
Functions.getGames();
db.minigames = config.tables.minigames;

const winston = require('winston');
const format = winston.format;
const logFormat = format.combine(
  format.timestamp({ format: 'MM/DD HH:mm:ss' }),
  format.align(),
  format.errors({ stack: true }),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);
const date = require('fecha').format(new Date(), 'MM-DD-YYYY_HH-mm-ss');
global.logger = winston.createLogger({
  level: config.debug ? 'debug' : 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({ format: format.combine(format.colorize(),logFormat) }),
    new winston.transports.File({
      filename: `logs/${date}.error.log`,
      level: 'error'
    }),
    new winston.transports.File({
      filename: `logs/${date}.log`
    })
  ]
});

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "MCEvents API",
      version: "1.0.0",
      description:
        "The official API for the MCEvents Minecraft server. NOTE: This API logs IPs to prevent API abuse. These logs are cleared on a regular interval and are not used in any other way.",
      license: {
        name: "GPL 3.0",
        url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
      },
      contact: {
        name: "ggtylerr",
        url: "https://ggtylerr.dev",
        email: "ggtylerr_contact@protonmail.com",
      },
    },
  },
  apis: [
    "./routes/stats.js",
    "./routes/leaderboard.js",
    "./routes/game.js"
  ],
};

const specs = swaggerJsdoc(options);
app.use(
  "/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.get("/", (req,res) => res.redirect(req.baseUrl + "/v1/docs"));

app.use("/v1/stats/", require("./routes/stats.js"));
app.use("/v1/lb/", require("./routes/leaderboard.js"));
app.use("/v1/game/", require("./routes/game.js"));

app.listen(port, () => logger.info(`Server has started! Port is ${port}.`));