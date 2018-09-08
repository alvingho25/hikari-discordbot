const { Command } = require('discord.js-commando');

module.exports = class ProfileCommand extends Command{
    constructor(client){
        super(client, {
            name : 'profile',
            aliases : ['avatar', 'p', 'a'],
            group : 'utility',
            memberName : 'profile',
            description : 'Get the image of my profile picture or other user',
            examples : [client.commandPrefix + 'profile', client.commandPrefix + 'profile @user'],
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
                    default: '',
                }
            ]
        });
    }

    run(message, {user}){
        let avatar;
        if(user == ''){
            avatar = message.member.user.displayAvatarURL;   
        }
        else{
            avatar = user.displayAvatarURL;
        }
        return message.say(avatar);
    }
}