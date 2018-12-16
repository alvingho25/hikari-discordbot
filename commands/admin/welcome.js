const { Command } = require('discord.js-commando');
const Jimp = require("jimp");

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
                    "Use ${USER} to mention the new member, ${GUILD} to get the server name,${TAG} to get the username#tag,  and ${COUNT} to get number of members",
                    type : 'string',
                    wait : 240
                }
            ]
        });
    }

    run(message, {channel, text}){
        this.client.provider.set(message.guild.id, "welcome_channel" , channel.id);
        this.client.provider.set(message.guild.id, "welcome_message", text);
        message.channel.send(`Welcome message has been set to ${channel}. Use command ${this.client.commandPrefix}banner to add image for welcome message \n`+
        `You can test the welcome message by using command ${this.client.commandPrefix}emit`);
    }
}