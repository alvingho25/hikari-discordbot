const sqlite3 = require('sqlite3').verbose();

module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    if(message.channel.type == "dm") return;

    //checking message contain discord link
    if(message.channel.permissionsFor(message.member).has("MANAGE_GUILD") == false){
        let link = message.content.toLowerCase();
        if(link.includes("discord.gg/") || link.includes("discord.me/")){
            message.delete(0).then(() => {
                message.channel.send(`${message.author}, Warning no self promote discord link here, Contact admin or moderator to verify your discord link before promote`)
                if(!client.provider.get(message.guild.id, "log_channel")){
                    return ;
                }
                else{
                    let channel = message.guild.channels.get(client.provider.get(message.guild.id, "log_channel"))
                    channel.send(`Did ${message.member.user.tag} just send ${message.content} on ${message.channel} ?`).catch(console.error)
                    return ;
                }
            });
        }
    }

    //get custom command from database and set it here
    if(message.content.startsWith(client.commandPrefix)){
        getCommand(message.guild.id).then(row => {
            row.forEach(element => {
                let command = client.commandPrefix + element.command;
                if(message.content == command){
                    return message.channel.send(element.respond);
                } 
            });
        }).catch(err => {
            console.log(err)
        });
    }
}

function getCommand(guildID){
    return new Promise(function (resolve, reject) {
        let db = new sqlite3.Database('./huolong.db', (err) => {
            if(err){
                reject(err);
            }
            // else{
            // }
        })
        db.serialize( () => {
            db
            .all(`SELECT * FROM command WHERE guildID = ?`,
            [`${guildID}`], 
                (err, row) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(row);
                    }
            })
            .close((err) => {
                if (err) {
                    reject(err);
                }
                // else{
                // }
            })
        })
    });
}

