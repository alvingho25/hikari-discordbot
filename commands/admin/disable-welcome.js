const { Command } = require('discord.js-commando');

module.exports = class DisableWelcomeCommand extends Command{
    constructor(client){
        super(client, {
            name : 'disable-welcome',
            //aliases : [],
            group : 'admin',
            memberName : 'disable-welcome',
            description : 'disable welcome message',
            examples : [client.commandPrefix + 'disable-welcome'],
            guildOnly: true,
            //clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:
            [
                {
                    key:'text',
                    prompt : 'Do you want to disable welcome message ? (Y/N)',
                    type : 'string',
                    //default: ''
                }
            ]
        });
    }

    run(message, {text}){
        if(text.toLowerCase() == 'y'){
            this.client.provider.remove(message.guild.id, "welcome_channel");
            this.client.provider.remove(message.guild.id, "welcome_message");
            return message.say(`Welcome message has been disabled`);
        }
        else{
            return message.say(`Command Cancelled`);
        }
        
    }
}