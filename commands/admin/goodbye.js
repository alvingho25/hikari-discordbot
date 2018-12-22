const { Command } = require('discord.js-commando');

module.exports = class GoodbyeCommand extends Command{
    constructor(client){
        super(client, {
            name : 'goodbye',
            aliases : ['enable-goodbye'],
            group : 'admin',
            memberName : 'goodbye',
            description : 'set channel and message for leaving member',
            examples : [client.commandPrefix + 'goodbye'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:
            [
                {
                    key:'channel',
                    prompt : 'Where do you want the goodbye message appear ?',
                    type : 'channel',
                    wait : 60
                },
                {
                    key:'text',
                    prompt : 'What is your goodbye message ?\n' +
                    "Use ${USER} to mention the new member, ${GUILD} to get the server name, and ${COUNT} to get number of members",
                    type : 'string',
                    wait : 120
                }
            ]
        });
    }

    run(message, {channel, text}){
        this.client.provider.set(message.guild.id, "goodbye_channel" , channel.id);
        this.client.provider.set(message.guild.id, "goodbye_message", text);
        return message.say(`Goodbye message set on ${channel} with message \n ${text}`);
    }
}