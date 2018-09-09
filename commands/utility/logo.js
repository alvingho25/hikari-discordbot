const { Command } = require('discord.js-commando');

module.exports = class LogoCommand extends Command{
    constructor(client){
        super(client, {
            name : 'logo',
            aliases : ['icon'],
            group : 'utility',
            memberName : 'logo',
            description : 'Get the logo of the server',
            examples : [client.commandPrefix + 'logo', client.commandPrefix + 'icon'],
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
        if(!message.guild.iconURL){
            return message.say(`this guild don't have a logo`);
        }
        else{
            return message.say(message.guild.iconURL);
        }
    }
}