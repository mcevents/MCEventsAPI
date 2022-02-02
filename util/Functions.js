const MojangAPI = require('mojang-api');

module.exports = {
  renameKeys(object,remove) {
    Object.keys(object).map((key) => {
      object[key.replace(remove,"")] = object[key];
      delete object[key];
    });
    return object;
  },
  getGames() {
    db.query(`SELECT PLAYED from Minigames;`, (err, qRes) => {
      if (err) throw err;
      else db.games = Object.keys(
        module.exports.renameKeys(
          JSON.parse(qRes[0].PLAYED),"Games"
        )
      );
    });
  },
  async getGame(game) {
    if (game === undefined) return {res: {}, error: {code: 404, message: "No game provided!"}};
    const games = db.games.map(name => name.toLowerCase());
    if (games.includes(game.toLowerCase())) return db.games[games.indexOf(game.toLowerCase())];
    else return {res: {}, error: {code: 404, message: `No game with the name '${game}' was found!`}};
  },
  async getUser(user) {
    if (user === undefined) return {res: {}, error: {code: 404, message: "No user provided!"}};
    if (user.indexOf("-") === -1) {
      user = await module.exports.getUUID(user).catch(() => {
        return {res: {}, error: {code: 404, message: "User doesn't exist!"}};
      });
      if (user === null || user === undefined) return {res: {}, error: {code: 404, message: "User doesn't exist!"}};
    }
    return user;
  },
  async getUUID(username) {
    return new Promise((resolve, reject) => {
      MojangAPI.nameToUuid(username, (err, res) => {
        if (err) reject(err);
        else {
          const id = res[0].id;
          // Dunno why id returns without the dashes.
          resolve(id.slice(0,8) + "-" + id.slice(8,12) + "-" + id.slice(12,16) + "-" + id.slice(16,20) + "-" + id.slice(20));
        }
      });
    });
  },
  async getUsername(uuid) {
    return new Promise((resolve, reject) => {
      MojangAPI.profile(uuid, (err, res) => {
        if (err) reject(err);
        else {
          resolve(res.name);
        }
      });
    });
  }
}