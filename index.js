//const Discord = require('discord.js');
require('dotenv').load();
const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const fs = require('fs');
const sqlite = require('sqlite');

const client = new CommandoClient({
    commandPrefix : process.env.PREFIX,
    owner : process.env.OWNERID,
    unknownCommandResponse: false
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
});

client.registry
    .registerGroups([
        ['giveaway', 'Giveaway Commands'],
        ['utility', 'Utility Commands'],
        ['admin', 'Admin Only Commands'],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

sqlite.open(path.join(__dirname, "settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});

client.login(process.env.TOKEN);