const { Command } = require('discord.js-commando');
const sqlite3 = require('sqlite3').verbose();

module.exports = class CmdrmCommand extends Command{
    constructor(client){
        super(client, {
            name : 'cmd-rm',
            aliases : ['rmcmd', 'removecmd'],
            group : 'admin',
            memberName : 'cmd-rm',
            description : 'Hapus command server',
            examples : [client.commandPrefix + 'rmcmd test'],
            guildOnly: true,
            //clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            }
        });
    }

    run(message){
        let command
        let guildID = message.guild.id;
        deleteCommand(guildID, command).then(() => {
            return message.say(`Command ${command} berhasil dihapus`);
        }).catch(err => {
            return message.say(err.message);
        })
    }
}

function getCommand(message){
    return new Promise((resolve, reject) => {
        message.channel.send(`Apa nama command yang mau dihapus ??\n`+
        `Tidak perlu memasukkan prefix karena tidak termasuk dalam nama commad\n`+
        `Respon batal untuk membatalkan command ini. Command ini akan otomatis dibatalkan setelah 180 detik.`).then(m => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 180000, errors: ['time'] })
            .then(collected => {
                let answer = collected.first();
                let command = answer.content;
                if(command.toLowerCase() == 'batal'){
                    return message.channel.send(`Command dibatalkan`)
                }
                else{
                    m.delete();
                    answer.delete();
                    resolve(command);
                }
            })
            .catch( collected => {
                return message.channel.send(`Command dibatalkan`)
            });
        })
    })
    .catch(err=> {
        reject(err);
    });
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