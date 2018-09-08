const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment-timezone');

const verifLevel = ["None (No Verification)", "Low (Verified email)",
         "Medium (Registered on Discord for 5+ minutes)", 
         "(╯°□°）╯︵ ┻━┻ (Wait for 10 minutes)",
        "┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻ (Need Phone verification)"]

module.exports = class ServerCommand extends Command{
    constructor(client){
        super(client, {
            name : 'server',
            aliases : ['serverinfo', 'guild', 'guildinfo'],
            group : 'utility',
            memberName : 'server',
            description : 'Get server or guild information',
            examples : [client.commandPrefix + 'server', client.commandPrefix + 'guild'],
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
        let now = message.guild.createdAt;
        let tanggal = moment.tz(now,"Asia/Jakarta").locale('id').format("dddd, DD MMMM YYYY");
        let jam = moment.tz(now,"Asia/Jakarta").locale('id').format("HH:mm:ss");
        let teks = tanggal + " jam " + jam;

        now = message.member.joinedAt;
        tanggal = moment.tz(now,"Asia/Jakarta").locale('id').format("dddd, DD MMMM YYYY");
        jam = moment.tz(now,"Asia/Jakarta").locale('id').format("HH:mm:ss");
        let join = tanggal + " jam " + jam;
        
        let verifikasi = verifLevel[message.guild.verificationLevel]
        const embed = new RichEmbed()
            .setTitle(`ID : ${message.guild.id}`)
            .setAuthor(`${message.guild.name}`, `${message.guild.iconURL}`)
            .setColor(0x00AE86)
            .setFooter(`© ${message.guild.name} Discord Server`, `${message.guild.iconURL}`)
            .setThumbnail(`${message.guild.iconURL}`)
            .setTimestamp()
            .addField("Verification Level",
            `${verifikasi}`, true)
            .addField("Region",
            `${message.guild.region}`, true)
            .addField("Member",
            `${message.guild.memberCount} orang`, true)
            .addField("Owner Server",
            `${message.guild.owner.user.tag}`, true)
            .addField("Server Dibuat",
            `${teks}`, false)
            .addField("Waktu Join",
            `${join}`, false);
    
        return message.say(embed);
    }
}