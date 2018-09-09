const { Command } = require('discord.js-commando');
const sqlite3 = require('sqlite3').verbose();

module.exports = class AddCommand extends Command{
    constructor(client){
        super(client, {
            name : 'add-command',
            aliases : ['add', 'cmd', 'addcmd'],
            group : 'admin',
            memberName : 'add-command',
            description : 'add custom command',
            examples : [client.commandPrefix + 'add-command'],
            guildOnly: true,
            //clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:
            [
                {
                    key:'command',
                    prompt : 'What is the name of the command ?',
                    type : 'string',
                    wait : 60
                },
                {
                    key:'respond',
                    prompt : 'What is the respond ?',
                    type : 'string',
                    wait : 120
                },
                {
                    key:'description',
                    prompt : 'What is the description of the command ?',
                    type : 'string',
                    wait : 120
                },
            ]
        });
    }

    run(message, {command, respond, description}){
        let guildID = message.guild.id;
        setCommand(guildID, command, respond, description).then(() => {
            return message.say(`Command ${command} successfully added`);
        }).catch(err => {
            return message.say(err.message);
        })
    }
}

function setCommand(guildID, command, respond, description){
    return new Promise(function (resolve, reject) {
        let db = new sqlite3.Database('./huolong.db', (err) => {
            if(err){
                reject(err);
            }
        })
        db.serialize( () => {
            db.run(`CREATE TABLE IF NOT EXISTS command (
                guildID TEXT,
                command TEXT,
                respond TEXT,
                description TEXT)`, (err) => {
                    if(err){
                        reject(err)
                    }
                })

            .run(`INSERT INTO command(guildID, command, respond, description) VALUES(?,?,?,?)`,
            [`${guildID}`,`${command}`, `${respond}`, `${description}`], 
                (err) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve();
                    }
            })

            .close((err) => {
                if (err) {
                    reject(err);
                }
            })
        })
    });
  }