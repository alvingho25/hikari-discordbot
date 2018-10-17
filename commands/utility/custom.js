const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = class CustomCommand extends Command{
    constructor(client){
        super(client, {
            name : 'custom',
            aliases : ['list'],
            group : 'utility',
            memberName : 'custom',
            description : 'Get the list of server custom command',
            examples : [client.commandPrefix + 'custom', client.commandPrefix + 'list'],
            guildOnly: true,
            //clientPermissions: ['MANAGE_MESSAGES'],
            //userPermissions: ['MANAGE_MESSAGES'],
            throttling : {
                usages : 1,
                duration : 5
            },
        });
    }

    run(message){
        getCommand(message.guild.id).then( row => {
            let embed = new RichEmbed()
            .setColor(0x00AE86)
            .setDescription(`Custom Command for ${message.guild}`)
            .setTimestamp();
            if(row.length == 0){
                embed.addField(`No Custom command`, `There is no custom command set for this server`);
            }
            else{
                row.forEach(element => {
                    embed.addField(this.client.commandPrefix+`${element.command}`,`${element.description}`);
                });
            }
            if(!message.guild.iconURL){
                embed.setAuthor(`${message.guild.name}`)
                .setFooter(`© ${message.guild.name} Discord Server`)
            }
            else{
                embed.setAuthor(`${message.guild.name}`, `${message.guild.iconURL}`)
                .setFooter(`© ${message.guild.name} Discord Server`, `${message.guild.iconURL}`)
            }
            return message.embed(embed);
        }).catch( (err) => {
            return message.say(err.message);
        });
    }
}

function getCommand(guildID){
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
            .all(`SELECT * FROM command WHERE guildID = ?`,
            [`${guildID}`], 
                (err, row) => {
                    if(err){
                        console.log(err);
                        reject(err)
                    }
                    else{
                        console.log(row);
                        resolve(row);
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