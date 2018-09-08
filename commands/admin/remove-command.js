const { Command } = require('discord.js-commando');
const sqlite3 = require('sqlite3').verbose();

module.exports = class RemoveCommand extends Command{
    constructor(client){
        super(client, {
            name : 'remove-command',
            aliases : ['remove', 'removecmd'],
            group : 'admin',
            memberName : 'remove-command',
            description : 'remove custom command',
            examples : [client.commandPrefix + 'remove-command'],
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
                    prompt : 'What is the name of the command you want to remove?',
                    type : 'string',
                    wait : 60
                },
            ]
        });
    }

    run(message, {command}){
        let guildID = message.guild.id;
        deleteCommand(guildID, command).then(() => {
            return message.say(`Command ${command} successfully removed`);
        }).catch(err => {
            return message.say(err.message);
        })
    }
}

function deleteCommand(guildID, command){
    return new Promise(function (resolve, reject) {
        let db = new sqlite3.Database('./huolong.db', (err) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log("Connected to huolong database");
            }
        })
        db.serialize( () => {
            db
            .run(`DELETE FROM command WHERE guildID = ? AND command = ?`,
            [`${guildID}`,`${command}`], 
                (err, row) => {
                    if(err){
                        console.log(err);
                        reject(err)
                    }
                    else{
                        console.log(row);
                        resolve();
                    }
            })
            .close((err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else{
                    console.log("Succesfully close database huolong");
                }
            })
        })
    });
  }