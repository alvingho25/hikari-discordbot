const { Command } = require('discord.js-commando');
const Jimp = require("jimp");

module.exports = class BannerCommand extends Command{
    constructor(client){
        super(client, {
            name : 'banner',
            aliases : ['banner-image', 'bannerimage'],
            group : 'admin',
            memberName : 'banner',
            description : 'set banner image to add picture for welcome message and as background for image command, Recommended size : 1024x450',
            examples : [client.commandPrefix + 'banner https://i.imgur.com/PRrOybp.png'],
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
                    key:'image',
                    prompt : 'Please link your image \n' +
                    "Use link that end with jpg, jpeg, or png like imgur",
                    type : 'string',
                    wait : 120
                }
            ]
        });
    }

    run(message, {image}){
        if (image != ""){
            Jimp.read(image).then((banner) => {
                this.client.provider.set(message.guild.id, "welcome_image", image);
            }).catch(err => {
                return message.say(`Image not found please make sure you submit the correct link`)
            })
            
        }
    }
}