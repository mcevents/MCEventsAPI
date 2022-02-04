// Init Vars
require('dotenv').config();

const config = require('./config.js');
const Functions = require('./util/Functions.js');

const express = require('express');
const app = express();
const port = config.port;

const rateLimit = require('express-rate-limit');

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
  definition: require("./openapi.json"),
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

app.use(rateLimit({
  windowMs: 15 * 6000, // 15 minutes
  max: 100, // 100 per windowMs
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use("/v1/stats/", require("./routes/stats.js"));
app.use("/v1/lb/", require("./routes/leaderboard.js"));
app.use("/v1/game/", require("./routes/game.js"));

app.listen(port, () => logger.info(`Server has started! Port is ${port}.`));