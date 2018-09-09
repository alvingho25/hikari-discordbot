const { Command } = require('discord.js-commando');
const { RichEmbed} = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = class RerollCommand extends Command{
    constructor(client){
        super(client, {
            name : 'reroll',
            aliases : ['roll', 'restart'],
            group : 'giveaway',
            memberName : 'reroll',
            description : 'reroll the last giveaway or messageID of giveaway',
            examples : [client.commandPrefix + 'reroll', client.commandPrefix + 'reroll MessageID'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:[
                {
                    key:'id',
                    prompt : 'What is the messageID ?',
                    type : 'message',
                    default: ''
                }
            ]
        });
    }

    run(message, {id}){
        let msgID;
        let maker;
        let winner;
        let prize;
        let channel;
        let role;
        if(id == ''){
            msgID = this.client.provider.get(message.guild.id, "giveaway", null);
            if(!msgID){
                return message.say(`can't find any giveaway please make sure you already have giveaway running on server`)
            }
        }
        else{
            msgID = id;
        }

        getGiveaway(msgID).then(row => {
            if(!row){
                return message.say(`can't find any giveaway please make sure you already have giveaway running on server`);
            }
            winner = row.winner;
            prize = row.prize;
            msgID = row.messageID;

            channel = row.channelID;
            channel = message.guild.channels.get(channel);
            role = row.role;
            role = message.guild.roles.find('name', role);
            maker = row.sponsorID;
            maker = message.guild.members.get(maker);
            let user = [];
            channel.fetchMessage(msgID).then(pesan => {
                let reaction = pesan.reactions.get('🎉');
                reaction.fetchUsers().then(hasil => {
                hasil.forEach(element => {
                    let m = message.guild.members.get(element.id);
                    if(element.bot == false && element.id != maker.id && m.roles.find('name', role)){
                        console.log(element.id);
                        user.push(element.id);
                    }
                    });
                getWinner(this.client, message, user, winner, maker, prize, channel);
                });
            }).catch(console.error);
            message.delete();
        }).catch(err => console.error);
    }
}

function getWinner(client, message, user, winner, maker, present,channel){
    if(user.length < winner){
        let embed = new RichEmbed()
        .setTitle(`Giveaway Ended`)
        .setAuthor(`${maker.user.tag}`, `${maker.user.displayAvatarURL}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setDescription(`Unfortunately entry for this giveaway is not enough to get winner\n`+
        `Thank you for all member that has join the giveaway, good luck on the next giveaway`)
        if(!message.guild.iconURL){
            embed.setFooter(`© ${message.guild.name} Discord Server`)
        }
        else{
            embed.setFooter(`© ${message.guild.name} Discord Server`, `${message.guild.iconURL}`)
        }
        channel.send(embed).catch(console.error);
    }
    else{
        if(winner == 1){
            let rand = user[Math.floor(Math.random() * user.length)];
            let member = guild.members.get(rand);
            
            let pemenang = `${member}`;
            let embed = new RichEmbed()
            .setTitle(`Giveaway Ended`)
            .setAuthor(`${maker.user.tag}`, `${maker.user.displayAvatarURL}`)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(`Thank you for all member that has join the giveaway\n` + 
            `Winner can contact ${maker.displayName} to claim your prize\n` + 
            `See you in the next giveaway`)
            .addField("Hadiah",
            `${present}`)
            .addField("Pemenang",
            pemenang, true);
            if(!message.guild.iconURL){
                embed.setFooter(`© ${message.guild.name} Discord Server`)
            }
            else{
                embed.setFooter(`© ${message.guild.name} Discord Server`, `${message.guild.iconURL}`)
            }
            channel.send(embed).catch(console.error);
            member.send(`🎉🎉🎉 **Congratulations** 🎉🎉🎉 \n` +
            `You win **${present}** from giveaway on ${member.guild}, Contact ${maker.displayName} to claim your prize`);
        }
        else{
            let pemenang = "";
            let i = 0;
            while(i < winner){
                let rand = user[Math.floor(Math.random() * user.length)];
                let member = guild.members.get(rand);
                pemenang = pemenang + `${member} \n`;
                member.send(`🎉🎉🎉 **Congratulations** 🎉🎉🎉 \n` +
                `You win **${present}** from giveaway on ${member.guild}, Contact ${maker.displayName} to claim your prize`);
                let index = user.indexOf(rand);
                user.splice(index,1);
                i++;
            }
            let embed = new RichEmbed()
            .setTitle(`Giveaway Ended`)
            .setAuthor(`${maker.user.tag}`, `${maker.user.displayAvatarURL}`)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(`Thank you for all member that has join the giveaway\n` + 
            `Winner can contact ${maker.displayName} to claim your prize\n` + 
            `See you in the next giveaway`)
            .addField("Hadiah",
            `${present}`)
            .addField("Pemenang",
            pemenang, true);
            if(!message.guild.iconURL){
                embed.setFooter(`© ${message.guild.name} Discord Server`)
            }
            else{
                embed.setFooter(`© ${message.guild.name} Discord Server`, `${message.guild.iconURL}`)
            }
            channel.send(embed).catch(console.error);
        }
    }
}

function getGiveaway(messageID){
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
            .get(`SELECT * FROM giveaway WHERE messageID = ?`,
            [`${messageID}`], 
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