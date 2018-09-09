const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment-timezone');
const sqlite3 = require('sqlite3').verbose();

module.exports = class GiveawayCommand extends Command{
    constructor(client){
        super(client, {
            name : 'giveaway',
            aliases : ['ga'],
            group : 'giveaway',
            memberName : 'giveaway',
            description : 'create new giveaway. Only user with Manage Server permission can start one',
            examples : [client.commandPrefix + 'giveaway'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:[
                {
                    key:'maker',
                    prompt : 'Who is the sponsor of the giveaway ?',
                    type : 'member',
                    //default: ''
                    wait: 60
                },
                {
                    key:'time',
                    prompt : `How long will the giveaway run ? format 'w'(weeks), 'd'(days), 'h'(hours), 'm'(minutes)`,
                    type : 'string',
                    validate: time => {
                        time = time.split(" ").join("").toLowerCase();
                        let regex = new RegExp(/\d{1,9}[smhdw]/);
                        if(!regex.test(time)){
                            return 'Time format is wrong';
                        }
                        else{
                            return true;
                        }
                    }
                },
                {
                    key:'winner',
                    prompt : 'How many winner ?',
                    type : 'integer',
                    //default: ''
                    wait: 60
                },
                {
                    key:'prize',
                    prompt : 'What is the giveaway prize ?',
                    type : 'string',
                    //default: ''
                    wait: 60
                },
                {
                    key:'role',
                    prompt : 'What role can join the giveaway ? use "everyone" for all guild member, no need to mention the role only the name of the role',
                    type : 'string',
                    //default: ''
                    wait: 60
                },
                {
                    key:'channel',
                    prompt : 'Which channel do you want to start the giveaway ?',
                    type : 'channel',
                    //default: ''
                    wait: 60,
                },
            ]
        });
    }

    run(message, {maker, time, winner, prize, role, channel}){
        let tz = this.client.provider.get(message.guild.id, "timezone", "Etc/GMT");
        let member = maker;
        time = time.split(" ").join("").toLowerCase();
        let menit = 0;
        let array = time.match(/\d{1,9}[smhdw]/g);
        let hitung;
        array.forEach(element => {
            switch(element.charAt(element.length-1)){
                case 'w':
                    hitung = element.substring(0, element.length-1)
                    menit = menit + hitung * 604800;
                    break;
                case 'd':
                    hitung = element.substring(0, element.length-1)
                    menit = menit + hitung * 86400;
                    break;
                case 'h':
                    hitung = element.substring(0, element.length-1)
                    menit = menit + hitung * 3600;
                    break;
                case 'm':
                    hitung = element.substring(0, element.length-1)
                    menit = menit + hitung * 60;
                    break;
                case 's':
                    hitung = element.substring(0, element.length-1)
                    menit = menit + hitung;
                    break;
            }
        });
        let waktu = parseInt(menit) * 1000;

        let durasi = dhm(waktu);

        let roles;
        if(role != 'everyone'){
            roles = message.guild.roles.find('name', role);
        }
        else{
            roles = message.guild.roles.find('name', '@everyone');
        }
        if(!roles){
            return message.say(`Cannot find any role with name ${role} please make sure to type the role name correctly including capital letter`);
        }

        confirmGa(this.client, message, member, waktu, durasi, winner, prize, channel, roles).then(time => {
            let now = time;
            now.setTime(now.getTime() + waktu);
            let tanggal = moment.tz(now,tz).locale('en').format("LLLL");
            sendGiveaway(this.client, message, member, waktu, durasi, winner, prize, tanggal, channel, roles)
        });
    }    
}

function dhm(ms){
    days = Math.floor(ms / (24*60*60*1000));
    daysms=ms % (24*60*60*1000);
    hours = Math.floor((daysms)/(60*60*1000));
    hoursms=ms % (60*60*1000);
    minutes = Math.floor((hoursms)/(60*1000));
    minutesms=ms % (60*1000);
    sec = Math.floor((minutesms)/(1000));
    return days+" days "+hours+" hours "+minutes+" minutes";
}

function confirmGa(client, message, author, waktu, durasi, winner, present, channel, roles){
    return new Promise((resolve, reject) => {
        let embed = new RichEmbed()
        .setTitle(`Confirm Giveaway`)
        .setColor(0x00AE86)
        .setDescription(`This is the giveaway format\n`+
        `Are you sure to start giveaway ? (Y/N)`)
        .addField("Sponsored",
        `${author.user.tag}`,true)
        .addField("Winner",
        `${winner}`,true)
        .addField("Prize",
        `${present}`,true)
        .addField("Roles",
        `${roles.name}`,true)
        .addField("Channel",
        `${channel}`,true)
        .addField("Duration",
        `${durasi}`,false);
        message.channel.send(embed).then(m => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                let answer = collected.first();
                let present = answer.content.toUpperCase();
                if(present == 'Y'){
                    m.delete();
                    let time = answer.createdAt;
                    answer.delete();
                    resolve(time);
                }
                else{
                    m.delete();
                    answer.delete();
                    return message.channel.send(`Giveaway canceled`);
                }
            })
            .catch(collected => {
                return message.channel.send(`No answer, giveaway canceled`)
            });
        }).catch(err => {
            console.log(err);
            reject(err)
        })
    }).catch(err => {
        console.log(err);
        reject(err)
    })
}

function sendGiveaway(client, message, member, waktu, durasi, winner, present, tanggal, channel, role){
    let user = [];
    let guild = message.guild;
    let embed = new RichEmbed()
        .setTitle(`Giveaway`)
        .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL}`)
        .setColor(0x00AE86)
        .setDescription(`React this message with 🎉 only to join the giveaway\n` + 
        `User with roles ${role.name} can join the giveaway\n`+
        `Good Luck`)
        .setTimestamp()
        .addField("Sponsored",
        `${member.user.tag}`,true)
        .addField("Winner",
        `${winner}`,true)
        .addField("Prize",
        `${present}`,true)
        .addField("Duration",
        `${durasi}`,false)
        .addField("End",
        `${tanggal}`,false);
        if(!message.guild.iconURL){
            embed.setFooter(`© ${message.guild.name} Discord Server`)
        }
        else{
            embed.setFooter(`© ${message.guild.name} Discord Server`, `${message.guild.iconURL}`)
        }
    channel.send(`${role}`).catch(console.error);
    channel.send(embed)
    .then(newMessage => {
        newMessage.react('🎉');
        let db = new sqlite3.Database('./huolong.db', (err) => {
            if(err){
                console.error;
            }
            else{
                console.log("Connected to giveaway database");
            }
        })
        db.serialize( () => {
            db.run(`CREATE TABLE IF NOT EXISTS giveaway (
                messageID TEXT,
                sponsorID TEXT,
                winner INT,
                prize TEXT,
                channelID TEXT,
                role TEXT)`, (err) => {
                    if(err){
                    console.log(err)
                    }
                    console.log("Successfully create table giveaway")
                })

            .run(`INSERT INTO giveaway(messageID, sponsorID, winner, prize, channelID, role) VALUES(?,?,?,?,?,?)`,
            [`${newMessage.id}`, `${member.id}`, `${winner}`, `${present}`, `${newMessage.channel.id}`, `${role.name}`], 
                (err) => {
                    if(err){
                        console.log(err)
                    }
                    console.log("Successfully insert table giveaway")
            })

            .each(`SELECT * FROM giveaway`, (err, row) => {
                if (err){
                    console.log(err);
                }
                console.log(row);
            })
            .close((err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("Succesfully close database huolong");
            })
        })
        
        this.client.provider.set(message.guild.id, "giveaway", newMessage.id);
        newMessage.awaitReactions((m) => m.emoji.name === '🎉' , {time : waktu}).then(
        collected => {
            let hasil = collected.get('🎉').users;
            hasil.forEach(element => {
                let m = guild.members.get(element.id);
                if(element.bot == false && element.id != member.id && m.roles.find('name', role)){
                    //console.log(element.id);
                    user.push(element.id);
                }
            });
            getWinner(client, message, user, winner, guild, member, present, channel);
        }).catch(console.error)
    }).catch(console.error)
}

function getWinner(client, message, user, winner, guild, member, present, channel){
    if(user.length < winner){
        let embed = new RichEmbed()
        .setTitle(`Giveaway Ended`)
        .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL}`)
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
            
            let pemenang = `${member.user.tag}`;
            let embed = new RichEmbed()
            .setTitle(`Giveaway Ended`)
            .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL}`)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(`Thank you for all member that has join the giveaway\n` + 
            `Winner can contact ${member.displayName} to claim your prize\n` + 
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
            `You win **${present}** from giveaway on ${member.guild}, Contact ${author.displayName} to claim your prize`);
        }
        else{
            let pemenang = "";
            let i = 0;
            while(i < winner){
                let rand = user[Math.floor(Math.random() * user.length)];
                let member = guild.members.get(rand);
                pemenang = pemenang + `${member.user.tag} \n`;
                member.send(`🎉🎉🎉 **Congratulations** 🎉🎉🎉 \n` +
                `You win **${present}** from giveaway on ${member.guild}, Contact ${author.displayName} to claim your prize`);
                let index = user.indexOf(rand);
                user.splice(index,1);
                i++;
            }
            let embed = new RichEmbed()
            .setTitle(`Giveaway Ended`)
            .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL}`)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(`Thank you for all member that has join the giveaway\n` + 
            `Winner can contact ${member.displayName} to claim your prize\n` + 
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