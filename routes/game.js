const express = require('express');
const router = express.Router();

const Functions = require("../util/Functions");

/**
 * @openapi
 *
 * /v1/game/user/game:
 *   get:
 *     summary:
 *       Gets top winners
 *     produces:
 *       - application/json
 */
router.get('/:user/:game', async (req, res) => {
  logger.debug(`GET /v1/game/:user/:game | user: ${req.params.user} | game: ${req.params.game} | IP: ${req.ip}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") return res.json(user);
  const game = await Functions.getGame(req.params.game);
  if (typeof game === "object") return res.json(game);
  db.query(`SELECT UUID, WINS, KILLS, PLAYED FROM ${db.minigames};`, async (err, qRes) => {
    if (err) res.json({res: {}, error: {code: 500, message: err}});
    else {
      if (qRes.length === 0) return res.json({res: {}, error: {code: 404, message: "That user either doesn't exist or doesn't have stats!"}});
      const data = {
        ...JSON.parse(qRes[0].WINS),
        ...JSON.parse(qRes[0].KILLS),
        ...JSON.parse(qRes[0].PLAYED),
      };
      res.json({
        res: {
          wins: data[`${game}Wins`],
          loses: data[`${game}Games`] - data[`${game}Wins`],
          kills: data[`${game}Kills`],
          games: data[`${game}Games`]
        },
        error: {}
      });
    }
  });
});

module.exports = router;