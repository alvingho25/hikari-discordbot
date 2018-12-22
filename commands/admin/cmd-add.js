const { Command } = require('discord.js-commando');
const sqlite3 = require('sqlite3').verbose();

module.exports = class CmdaddCommand extends Command{
    constructor(client){
        super(client, {
            name : 'cmd-add',
            aliases : ['cmdadd', 'addcmd'],
            group : 'admin',
            memberName : 'cmd-add',
            description : 'Add Custom Command for your server',
            examples : [client.commandPrefix + 'cmdadd'],
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
                    prompt : 'Add your custom command name',
                    type : 'string',
                    wait : 120
                }
            ]
        });
    }

    run(message, {command}){
        let respond;
        let description;
        getRespond(message, command).then(answer => {
            respond = answer;
            getDescription(message, command).then(answer => {
                description = answer;
                let guildID = message.guild.id;
                setCommand(guildID, command, respond, description).then(() => {
                    return message.say(`Command ${command} successfully added`);
                }).catch(err => {
                    return message.say(err.message);
                })
            }).catch(console.error)
        }).catch(console.error)
    }
}

function getRespond(message, command){
    return new Promise((resolve, reject) => {
        message.channel.send(`What is the respond message?`).then(m => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 180000, errors: ['time'] })
            .then(collected => {
                let answer = collected.first();
                let respond = answer.content;
                if(respond.toLowerCase() == 'cancel'){
                    return message.channel.send(`Command cancelled`)
                }
                else{
                    resolve(respond);
                }
            })
            .catch( () => {
                return message.channel.send(`Command cancelled`)
            });
        });
    })
    .catch(err=> {
        reject(err);
    });
}

function getDescription(message, command){
    return new Promise((resolve, reject) => {
        message.channel.send(`${command} description?`).then(m => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 180000, errors: ['time'] })
            .then(collected => {
                let answer = collected.first();
                let description = answer.content;
                if(description.toLowerCase() == 'cancel'){
                    return message.channel.send(`Command cancelled`)
                }
                else{
                    resolve(description);
                }
            })
            .catch( () => {
                return message.channel.send(`Command cancelled`)
            });
        });
    })
    .catch(err=> {
        reject(err);
    });
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