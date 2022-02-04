const express = require('express');
const router = express.Router();

const Functions = require('../util/Functions.js');

/**
 * /v1/stats/:user
 *
 * GET the user's stats.
 */
router.get('/:user', async (req, res) => {
  logger.debug(`GET /v1/stats/:user | user: ${req.params.user}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") { res.status(user.error.code); return res.json(user); }
  db.query(`SELECT * from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) {
      logger.error(err);
      res.status(500);
      return res.json({res: {}, error: {code: 500, message: err}});
    }
    if (qRes.length === 0) {
      res.status(404);
      return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
    }
    const wins = JSON.parse(qRes[0].WINS);
    const played = JSON.parse(qRes[0].PLAYED);
    const loses = {};
    for (let game of db.games) {
      loses[`${game}Loses`] = played[`${game}Games`] - wins[`${game}Wins`];
    }
    res.json({
      res: {
        ...JSON.parse(qRes[0].XPDATA),
        ...wins,
        ...loses,
        ...JSON.parse(qRes[0].KILLS),
        ...played,
      },
      error: {}
    });
  });
});

/**
 * /v1/stats/:user/xp
 *
 * GET the user's XP stats.
 */
router.get('/:user/xp', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/xp | user: ${req.params.user}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") { res.status(user.error.code); return res.json(user); }
  db.query(`SELECT XPDATA from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) {
      logger.error(err);
      res.status(500);
      return res.json({res: {}, error: {code: 500, message: err}});
    }
    if (qRes.length === 0) {
      res.status(404);
      return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
    }
    res.json({
      res: JSON.parse(qRes[0].XPDATA),
      error: {}
    });
  });
});

/**
 * /v1/stats/:user/wins
 *
 * GET the user's wins.
 */
router.get('/:user/wins', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/wins | user: ${req.params.user}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") { res.status(user.error.code); return res.json(user); }
  db.query(`SELECT WINS from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) {
      logger.error(err);
      res.status(500);
      return res.json({res: {}, error: {code: 500, message: err}});
    }
    if (qRes.length === 0) {
      res.status(404);
      return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
    }
    res.json({
      res: Functions.renameKeys(JSON.parse(qRes[0].WINS,),"Wins"),
      error: {}
    });
  });
});

/**
 * /v1/stats/:user/loses
 *
 * GET the user's loses.
 */
router.get('/:user/loses', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/loses | user: ${req.params.user}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") { res.status(user.error.code); return res.json(user); }
  db.query(`SELECT WINS, PLAYED from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) {
      logger.error(err);
      res.status(500);
      return res.json({res: {}, error: {code: 500, message: err}});
    }
    if (qRes.length === 0) {
      res.status(404);
      return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
    }
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
  });
});

/**
 * /v1/stats/:user/kills
 *
 * GET the user's kills.
 */
router.get('/:user/kills', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/kills | user: ${req.params.user}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") { res.status(user.error.code); return res.json(user); }
  db.query(`SELECT KILLS from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) {
      logger.error(err);
      res.status(500);
      return res.json({res: {}, error: {code: 500, message: err}});
    }
    if (qRes.length === 0) {
      res.status(404);
      return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
    }
    res.json({
      res: Functions.renameKeys(JSON.parse(qRes[0].KILLS,),"Kills"),
      error: {}
    });
  });
});

/**
 * /v1/stats/:user/games
 *
 * GET the user's games played.
 */
router.get('/:user/games', async (req, res) => {
  logger.debug(`GET /v1/stats/:user/games | user: ${req.params.user}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") { res.status(user.error.code); return res.json(user); }
  db.query(`SELECT PLAYED from ${db.minigames} WHERE UUID = '${user}';`, (err, qRes) => {
    if (err) {
      logger.error(err);
      res.status(500);
      return res.json({res: {}, error: {code: 500, message: err}});
    }
    if (qRes.length === 0) {
      res.status(404);
      return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
    }
    res.json({
      res: Functions.renameKeys(JSON.parse(qRes[0].PLAYED,),"Games"),
      error: {}
    });
  });
});

module.exports = router;