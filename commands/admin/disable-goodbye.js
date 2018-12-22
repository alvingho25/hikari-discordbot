const { Command } = require('discord.js-commando');

module.exports = class DisableGoodbyeCommand extends Command{
    constructor(client){
        super(client, {
            name : 'disable-goodbye',
            group : 'admin',
            memberName : 'disable-goodbye',
            description : 'disable goodbye message',
            examples : [client.commandPrefix + 'disable-goodbye'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:
            [
                {
                    key:'text',
                    prompt : 'Do you want to disable goodbye message ? (Y/N)',
                    type : 'string',
                }
            ]
        });
    }

    run(message, {text}){
        if(text.toLowerCase() == 'y'){
            this.client.provider.remove(message.guild.id, "welcome_channel");
            this.client.provider.remove(message.guild.id, "welcome_message");
            return message.say(`Goodbye message has been disabled`);
        }
        else{
            return message.say(`Command Cancelled`);
        }
        
    }
}