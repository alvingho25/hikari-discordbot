const { Command } = require('discord.js-commando');
const fs = require("fs");
const moment = require('moment-timezone');

module.exports = class LogCommand extends Command{
    constructor(client){
        super(client, {
            name : 'log',
            aliases : [],
            group : 'admin',
            memberName : 'log',
            description : `Set Log Channel. Log channel will be used if bot are banning new member with discord link on their name or \n` 
            `member are promoting discord link on channel \n`
            `More features comming soon`,
            examples : [client.commandPrefix + 'log', client.commandPrefix + 'log #channel'],
            guildOnly: true,
            //clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:[
                {
                    key:'channel',
                    prompt : 'which channel will be used as log channel ?' ,
                    type : 'channel',
                    //default: ''
                    wait: 60
                }
            ]
        });
    }

    run(message, {channel}){
        this.client.provider.set(message.guild.id, "log_channel", channel.id)
        return message.say(`Log channel is set to ${channel}`);
    }
}