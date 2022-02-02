const express = require('express');
const router = express.Router();

const Functions = require('../util/Functions.js');
const config = require('../config.js');

/**
 * @openapi
 *
 * /v1/lb/wins:
 *   get:
 *     summary:
 *       Gets top winners
 *     produces:
 *       - application/json
 */
router.get('/wins', async (req, res) => {
  logger.debug(`GET /v1/lb/wins | IP: ${req.ip}`);
  db.query(`SELECT uuid, JSON_EXTRACT(\`WINS\`, '$.totalWins') AS totalWins FROM ${db.minigames} ORDER BY totalWins DESC;`, async (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 500, message: "Uh-oh. Our database is empty. Yell at mal :P"}});
      let body = {total: []};
      for (let i = 0; i < qRes.length && i < 10; i++) {
        body.total.push({
          uuid: qRes[i].uuid,
          user: await Functions.getUsername(qRes[i].uuid),
          wins: qRes[i].totalWins
        });
      }
      res.json({
        res: body,
        error: {}
      });
    }
  });
});

router.get('/kills', async (req, res) => {
  logger.debug(`GET /v1/lb/kills | IP: ${req.ip}`);
  db.query(`SELECT uuid, JSON_EXTRACT(\`KILLS\`, '$.totalKills') AS totalKills FROM ${db.minigames} ORDER BY totalKills DESC;`, async (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 500, message: "Uh-oh. Our database is empty. Yell at mal :P"}});
      let body = {total: []};
      for (let i = 0; i < qRes.length && i < 10; i++) {
        body.total.push({
          uuid: qRes[i].uuid,
          user: await Functions.getUsername(qRes[i].uuid),
          kills: qRes[i].totalKills
        });
      }
      res.json({
        res: body,
        error: {}
      });
    }
  });
});

router.get('/game/:game', async (req, res) => {
  logger.debug(`GET /v1/lb/game/:game | game: ${req.params.game} | IP: ${req.ip}`);
  const game = await Functions.getGame(req.params.game);
  if (typeof game === "object") return res.json(game);
  // TODO: Figure out a way to do this without doing two queries at once.
  db.query(`SELECT uuid, JSON_EXTRACT(\`WINS\`, '$.${game}Wins') AS gameWins FROM ${db.minigames} ORDER BY gameWins DESC;`, async (err, qRes1) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      db.query(`SELECT uuid, JSON_EXTRACT(\`KILLS\`, '$.${game}Kills') AS gameKills FROM ${db.minigames} ORDER BY gameKills DESC;`, async (err, qRes2) => {
        if (err) res.json({res: {}, error: {code: 500, message: err}});
        else {
          let body = {wins: []};
          for (let i = 0; i < qRes1.length && i < 10; i++) {
            body.wins.push({
              uuid: qRes1[i].uuid,
              user: await Functions.getUsername(qRes1[i].uuid),
              wins: qRes1[i].gameWins
            });
          }
          if (qRes2.length > 0) {
            if (qRes2[0].gameKills !== null) {
              body.kills = [];
              for (let i = 0; i < qRes2.length && i < 10; i++) {
                body.kills.push({
                  uuid: qRes2[i].uuid,
                  user: await Functions.getUsername(qRes2[i].uuid),
                  kills: qRes2[i].gameKills
                });
              }
            }
          }
          res.json({
            res: body,
            error: {}
          });
        }
      });
    }
  });
});

module.exports = router;