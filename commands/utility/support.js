const { Command } = require('discord.js-commando');

module.exports = class SupportCommand extends Command{
    constructor(client){
        super(client, {
            name : 'support',
            // aliases : [''],
            group : 'utility',
            memberName : 'support',
            description : 'Get the link to bot support server',
            examples : [client.commandPrefix + 'support'],
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
        return message.say(`Join the bot support server for help, bug report, development update, feature request on discord.gg/eNQQbmq`);
    }
}