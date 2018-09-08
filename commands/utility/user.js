const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment-timezone');

module.exports = class UserCommand extends Command{
    constructor(client){
        super(client, {
            name : 'user',
            aliases : ['userinfo', 'u'],
            group : 'utility',
            memberName : 'user',
            description : 'Get user information or other user information on guild',
            examples : [client.commandPrefix + 'user', client.commandPrefix + 'user @user'],
            guildOnly: true,
            //clientPermissions: ['MANAGE_MESSAGES'],
            //userPermissions: ['MANAGE_MESSAGES'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:[
                {
                    key:'user',
                    prompt : 'which user do you want to get ?',
                    type : 'user',
                    default: ''
                }
            ]
        });
    }

    run(message, {user}){
        let member;
        if(user == ''){
            member = message.member;   
        }
        else{
            member = message.guild.members.get(user.id);
        }
        let now = member.user.createdAt;
        let tanggal = moment.tz(now,"Asia/Jakarta").locale('id').format("dddd, DD MMMM YYYY");
        let jam = moment.tz(now,"Asia/Jakarta").locale('id').format("HH:mm:ss");
        let teks = tanggal + " jam " + jam;


        now = member.joinedAt;
        tanggal = moment.tz(now,"Asia/Jakarta").locale('id').format("dddd, DD MMMM YYYY");
        jam = moment.tz(now,"Asia/Jakarta").locale('id').format("HH:mm:ss");
        let join = tanggal + " jam " + jam;

        let role = "";
        let roles = member.roles; 
        roles.forEach(element => {
            if(element.name != "@everyone"){
                role = role + element.name + ` \n`;
            }
        });

        const embed = new RichEmbed()
            .setTitle(`ID : ${member.id}`)
            .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL}`)
            .setColor(0x00AE86)
            .setFooter(`© ${message.guild.name} Discord Server`, `${message.guild.iconURL}`)
            .setThumbnail(`${member.user.displayAvatarURL}`)
            .setTimestamp()
            .addField("Nickname Server",
            `${member.displayName}`, true)
            .addField("Akun Dibuat",
            `${teks}`, false)
            .addField("Waktu Join",
            `${join}`, false)
            .addField("Roles",
            `${role}`, false);

        return message.say(embed);
    }
}