const { Command } = require('discord.js-commando');

module.exports = class LogoCommand extends Command{
    constructor(client){
        super(client, {
            name : 'invite',
            aliases : [],
            group : 'utility',
            memberName : 'invite',
            description : 'Get the bot invite link',
            examples : [client.commandPrefix + 'invite'],
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
        message.say(`Here is the link to invite bot to your server https://discordapp.com/oauth2/authorize?&client_id=442997141703491584&scope=bot&permissions=8`)
    }
}