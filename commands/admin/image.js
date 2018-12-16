const { Command } = require('discord.js-commando');
const Jimp = require("jimp");

module.exports = class ImageCommand extends Command{
    constructor(client){
        super(client, {
            name : 'image',
            aliases : ['gambar'],
            group : 'utility',
            memberName : 'image',
            description : 'Get your own picture with server banner image',
            examples : [client.commandPrefix + 'image https://i.imgur.com/PRrOybp.png'],
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
                    prompt : 'Please link your profile image ?\n' +
                    "Use link that end with jpg, jpeg, or png like imgur\n"+
                    "type 'profile' to use your discord profile picture",
                    type : 'string',
                    wait : 120
                }
            ]
        });
    }

    run(message, {image}){
        let banner = client.provider.get(member.guild.id, "welcome_image", null);
        if (banner == null){
            return message.say('No Banner found please ask your admin to set one')
        }
        else{
            createImage(message.member, image, banner).then(()=> {
                setTimeout(() => {
                    message.channel.send(
                        `${text}`,
                        {
                        files: [{
                            attachment: './image/profile.png',
                            name: 'profile.png'
                        }] 
                    }).catch(console.error);
                }, 300);
            }).catch(err => {
                console.log(err)
                message.channel.send(`Image not found please make sure to submit the right link`)
            })
        }
    }
}

function measureText(font, text) {
    var x = 0;
    for (var i = 0; i < text.length; i++) {
        if (font.chars[text[i]]) {
            x += font.chars[text[i]].xoffset
                + (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0)
                + (font.chars[text[i]].xadvance || 0);
        }
    }
    return x;
};

function addfontselamatdatang(banner, member){
    return new Promise((resolve, reject) => {
        Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(function (font) {
            let bannerwidth = banner.bitmap.width/2;
            let word = member.displayName;
            let wordwidth = measureText(font, word)
            let width = wordwidth/2;
            let number = bannerwidth - width;
            banner.print(font, number, 300, word)
            .quality(100)
            .write("./image/profile.png");
            resolve(banner);
        })
        .catch(err => {
            reject(err);
        });
    })
}

function createImage(member, image, banner){
    return new Promise((resolve, reject) => {
        let mask = "./image/mask.png";
        let background = banner;
        Jimp.read(mask).then((mask) => {
            mask.resize(252, 250)
            if (image == 'profile'){
                image = member.avatarURL;
                if(image == null){
                    image = member.defaultAvatarURL;
                }
            }
            Jimp.read(url).then((profile) => {
                profile.resize(252, 250)
                .mask(mask, 0, 0)
                // .write("hasil.png")
                Jimp.read(background).then((banner) => {
                    banner.resize(1024, 450)
                    banner.composite(profile,386, 25)
                    //.write("./image/hasil.png")
                    addfontselamatdatang(banner).then(banner => {
                        resolve()
                    })
                }).catch(function (err) {
                    console.error(err);
                    reject(err);
                });
            }).catch(function (err) {
                console.error(err);
                reject(err);
            });
        }).catch(function (err) {
            console.error(err);
            reject(err);
        });
    });    
}