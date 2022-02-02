const express = require('express');
const router = express.Router();

const Functions = require('../util/Functions.js');
const config = require('../config.js');

/**
 * @openapi
 *
 * /v1/stats/user:
 *   get:
 *     summary:
 *       Gets a user's stats
 *     produces:
 *       - application/json
 */
router.get('/:user', async (req, res) => {
  logger.debug(`GET /v1/stats/:user | user: ${req.params.user} | IP: ${req.ip}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") return res.json(user);
  db.query(`SELECT * from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
      res.json({
        res: {
          ...JSON.parse(qRes[0].XPDATA),
          ...JSON.parse(qRes[0].WINS),
          ...JSON.parse(qRes[0].KILLS),
          ...JSON.parse(qRes[0].PLAYED),
        },
        error: {}
      });
    }
  });
});

router.get('/:user/xp', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/xp | user: ${req.params.user} | IP: ${req.ip}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") return res.json(user);
  db.query(`SELECT XPDATA from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
      res.json({
        res: JSON.parse(qRes[0].XPDATA),
        error: {}
      });
    }
  });
});

router.get('/:user/wins', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/wins | user: ${req.params.user} | IP: ${req.ip}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") return res.json(user);
  db.query(`SELECT WINS from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
      res.json({
        res: Functions.renameKeys(JSON.parse(qRes[0].WINS,),"Wins"),
        error: {}
      });
    }
  });
});

router.get('/:user/loses', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/loses | user: ${req.params.user} | IP: ${req.ip}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") return res.json(user);
  db.query(`SELECT WINS, PLAYED from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
      const played = JSON.parse(qRes[0].PLAYED);
      const wins = JSON.parse(qRes[0].WINS);
      let body = {};
      for (let game of db.games) {
        body[game] = played[`${game}Games`] - wins[`${game}Wins`];
      }
      res.json({
        res: body,
        error: {}
      });
    }
  });
});

router.get('/:user/kills', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/kills | user: ${req.params.user} | IP: ${req.ip}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") return res.json(user);
  db.query(`SELECT KILLS from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
      res.json({
        res: Functions.renameKeys(JSON.parse(qRes[0].KILLS,),"Kills"),
        error: {}
      });
    }
  });
});

router.get('/:user/games', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/games | user: ${req.params.user} | IP: ${req.ip}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") return res.json(user);
  db.query(`SELECT PLAYED from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
      res.json({
        res: Functions.renameKeys(JSON.parse(qRes[0].PLAYED,),"Games"),
        error: {}
      });
    }
  });
});

module.exports = router;