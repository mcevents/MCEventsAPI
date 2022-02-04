const express = require('express');
const router = express.Router();

const Functions = require("../util/Functions");

/**
 * /v1/game/:user/:game
 *
 * GET the game stats of said user.
 */
router.get('/:user/:game', async (req, res) => {
  logger.debug(`GET /v1/game/:user/:game | user: ${req.params.user} | game: ${req.params.game}`);
  const user = await Functions.getUser(req.params.user);
  if (typeof user === "object") { res.status(user.error.code); return res.json(user); }
  const game = await Functions.getGame(req.params.game);
  if (typeof game === "object") { res.status(game.error.code); return res.json(game); }
  db.query(`SELECT UUID, WINS, KILLS, PLAYED FROM ${db.minigames};`, async (err, qRes) => {
    if (err) {
      logger.error(err);
      res.status(500);
      return res.json({res: {}, error: {code: 500, message: err}});
    }
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
  });
});

module.exports = router;