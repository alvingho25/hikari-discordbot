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
        let tz = this.client.provider.get(message.guild.id, "timezone", "Etc/GMT");
        let member;
        if(user == ''){
            member = message.member;   
        }
        else{
            member = message.guild.members.get(user.id);
        }
        let now = member.user.createdAt;
        let created = moment.tz(now,tz).format("LLLL");


        now = member.joinedAt;
        let join = moment.tz(now,tz).format("LLLL");

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
            .addField("Server Nickname",
            `${member.displayName}`, true)
            .addField("Account Created",
            `${created}`, false)
            .addField("Time Join",
            `${join}`, false)
            .addField("Roles",
            `${role}`, false);

        return message.say(embed);
    }
}