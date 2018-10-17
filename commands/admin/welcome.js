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
                },
                {
                    key:'image',
                    prompt : 'Please link your welcome image ?\n' +
                    "Use link that end with jpg, jpeg, or png \n"+
                    "Leave this blank if you dont want to use welcome image",
                    type : 'string',
                    wait : 120
                }
            ]
        });
    }

    run(message, {channel, text, image}){
        this.client.provider.set(message.guild.id, "welcome_channel" , channel.id);
        this.client.provider.set(message.guild.id, "welcome_message", text);
        if (image != ""){
            this.client.provider.set(message.guild.id, "welcome_image", image);
        }
        if(text.includes("${USER}")){
            text = text.replace("${USER}", `${message.author}`);
        }
        if(text.includes("${GUILD}")){
            text = text.replace("${GUILD}", `${message.guild}`);
        }
        if(text.includes("${COUNT}")){
            text = text.replace("${COUNT}", `${message.guild.memberCount}`);
        }
        if(text.includes("${TAG}")){
            text = text.replace("${TAG}", `${message.author.tag}`);
        }
        message.channel.send(`Your welcome message should be something like this`);
        createImage(message.author, image).then(()=> {
            setTimeout(() => {
                message.channel.send(
                    `${text}`,
                    {
                    files: [{
                        attachment: './image/hasil.png',
                        name: 'welcome.png'
                    }] 
                }).catch(console.error);
            }, 300);
        }).catch(err => {
            console.log(err)
            message.channel.send(`${text}`)
        })
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

function addfontselamatdatang(banner){
    return new Promise((resolve, reject) => {
        Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(function (font) {
            let bannerwidth = banner.bitmap.width/2;
            let word = `Welcome`;
            let wordwidth = measureText(font, word)
            let width = wordwidth/2;
            let number = bannerwidth - width;
            banner.print(font, number, 296, word)
            resolve(banner);
        })
        .catch(err => {
            reject(err);
        });
    })
}

function addfonttag(banner, member){
    return new Promise((resolve, reject) => {
        Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
            let bannerwidth = banner.bitmap.width/2;
            let word = member.tag;
            let wordwidth = measureText(font, word)
            let width = wordwidth/2;
            let number = bannerwidth - width;
            banner.print(font, number, 362, word)
            // word =  member.guild.name;
            // wordwidth = measureText(font, word)
            // width = wordwidth/2;
            // number = 831 - width;
            // banner.print(font, number, 25, word)
            .quality(100)
            .write("./image/hasil.png");
            resolve(banner);
        })
        .catch(err=> {
            reject(err);
        });
    })
}

function createImage(member, image){
    return new Promise((resolve, reject) => {
        let mask = "./image/mask.png";
        let background = image;
        Jimp.read(mask).then((mask) => {
            mask.resize(252, 250)
    
            let url = member.avatarURL;
            if(url == null){
                url = member.defaultAvatarURL;
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
                        addfonttag(banner,member).then(banner => {
                            resolve();
                            // addfontnamaserver(banner,member).then( () => {
                            //     resolve();
                            // })
                        });
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