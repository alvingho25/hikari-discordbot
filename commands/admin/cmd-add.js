const { Command } = require('discord.js-commando');
const sqlite3 = require('sqlite3').verbose();

module.exports = class CmdaddCommand extends Command{
    constructor(client){
        super(client, {
            name : 'cmd-add',
            aliases : ['cmdadd', 'addcmd'],
            group : 'admin',
            memberName : 'cmd-add',
            description : 'Tambahkan command sendiri untuk membantu menyampaikan informasi di dalam server',
            examples : [client.commandPrefix + 'cmdadd'],
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
        let command;
        let respond;
        let description;
        getCommand(message).then(answer => {
            command = answer;
            getRespond(message, command).then(answer => {
                respond = answer;
                getDescription(message, command).then(answer => {
                    description = answer;
                    let guildID = message.guild.id;
                    setCommand(guildID, command, respond, description).then(() => {
                        return message.say(`Command ${command} berhasil ditambahkan`);
                    }).catch(err => {
                        return message.say(err.message);
                    })
                }).catch(console.error)
            }).catch(console.error)
        }).catch(console.error)
    }
}

function getCommand(message){
    return new Promise((resolve, reject) => {
        message.channel.send(`Apa nama command yang mau ditambahkan ??\n`+
        `Tidak perlu memasukkan prefix karena akan otomatis ditambahkan nantinya \n`+
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

function getRespond(message, command){
    return new Promise((resolve, reject) => {
        message.channel.send(`Apa respon yang ingin disampaikan jika ${command} digunakan ??\n`+
        `Respon batal untuk membatalkan command ini. Command ini akan otomatis dibatalkan setelah 180 detik.`).then(m => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 180000, errors: ['time'] })
            .then(collected => {
                let answer = collected.first();
                let respond = answer.content;
                if(respond.toLowerCase() == 'batal'){
                    return message.channel.send(`Command dibatalkan`)
                }
                else{
                    m.delete();
                    answer.delete();
                    resolve(respond);
                }
            })
            .catch( () => {
                return message.channel.send(`Command dibatalkan`)
            });
        });
    })
    .catch(err=> {
        reject(err);
    });
}

function getDescription(message, command){
    return new Promise((resolve, reject) => {
        message.channel.send(`Apa deskripsi dari ${command} ??\n`+
        `Respon batal untuk membatalkan command ini. Command ini akan otomatis dibatalkan setelah 180 detik.`).then(m => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 180000, errors: ['time'] })
            .then(collected => {
                let answer = collected.first();
                let description = answer.content;
                if(description.toLowerCase() == 'batal'){
                    return message.channel.send(`Command dibatalkan`)
                }
                else{
                    m.delete();
                    answer.delete();
                    resolve(description);
                }
            })
            .catch( () => {
                return message.channel.send(`Command dibatalkan`)
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