# MCEvents API
The official API for the MCEvents Minecraft server. 
Developed by the MCEvents development team, along with the open source community.

## Installing and running
It should be noted that the DB itself is not public. 
However, this API is designed to be semi-dynamic, meaning you don't need the original DB.

You can make your own by doing the following SQL commands:

```sql
CREATE TABLE Minigames (UUID varchar(36), XPDATA mediumtext, WINS mediumtext, KILLS mediumtext, PLAYED mediumtext);
INSERT INTO Minigames VALUES ("d2c95f31-40cb-4035-b13c-fc7e00aa8940", "{\"level\":0, \"amount\": 0}", "{\"gameWins\":0}", "{\"gameKills\":0}", "{\"gameGames\":0}");
```

This will give you enough to test the API. Tweak the insert command if needed, or add more.

To actually run the API, you'll need [node.js](https://nodejs.org/en/).
Download the source code and put it into a folder you like. 
Remove '.example' in the files `.env.example` and `config.js.example`
and configure in them. Then run using `node index`.

## Documentation
All documentation can be found in [api.mcevents.club](https://api.mcevents.club).
Alternatively, you can look through the source code and find the docs through there.

## License
This project is licensed under [the GPL 3.0 license.](https://www.gnu.org/licenses/gpl-3.0.en.html)

This license requires that this project, along with any forks and any project using this API,
to be under the same license. That means if your project uses this API, it must also use GPL 3.0,
and thus, be open source.