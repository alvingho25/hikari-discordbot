const { Command } = require('discord.js-commando');

module.exports = class WelcomeCommand extends Command{
    constructor(client){
        super(client, {
            name : 'welcome',
            aliases : ['enable-welcome'],
            group : 'admin',
            memberName : 'welcome',
            description : 'set channel and message for new member',
            examples : [client.commandPrefix + 'welcome'],
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
                    key:'channel',
                    prompt : 'Where do you want the welcome message appear ?',
                    type : 'channel',
                    wait : 60
                },
                {
                    key:'text',
                    prompt : 'What is your welcome message ?\n' +
                    "Use ${USER} to mention the new member, ${GUILD} to get the server name, and ${COUNT} to get number of members",
                    type : 'string',
                    wait : 120
                }
            ]
        });
    }

    run(message, {channel, text}){
        this.client.provider.set(message.guild.id, "welcome_channel" , channel.id);
        this.client.provider.set(message.guild.id, "welcome_message", text);
        return message.say(`Welcome message set on ${channel} with message \n ${text}`);
    }
}