const Jimp = require("jimp");

module.exports = (client, member) => {
    if(member.displayName.includes("discord.gg/")){
        member.ban("Username contains discord link possible spam").catch(console.error);
        if(!client.provider.get(member.guild.id, "log_channel")){
            return ;
        }
        else{
            let channel = member.guild.channels.get(client.provider.get(member.guild.id, "log_channel"))
            return channel.send(`I'm banning ${member.user.tag} for joining the server because the username contain discord link`)
        }
    }
    else{
        let channel = client.provider.get(member.guild.id, "welcome_channel", null);
        let text = client.provider.get(member.guild.id, "welcome_message", null);
        let image = client.provider.get(member.guild.id, "welcome_image", null);
        if(channel != null && text != null){
            channel = client.channels.get(channel);
            if(text.includes("${USER}")){
                text = text.replace("${USER}", `${member.user}`);
            }
            if(text.includes("${GUILD}")){
                text = text.replace("${GUILD}", `${member.guild}`);
            }
            if(text.includes("${COUNT}")){
                text = text.replace("${COUNT}", `${member.guild.memberCount}`);
            }
            if(text.includes("${TAG}")){
                text = text.replace("${TAG}", `${member.user.tag}`);
            }
            if (image != null ){
                createImage(member, image).then(()=> {
                    setTimeout(() => {
                        channel.send(
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
                    channel.send(`${text}`)
                })
            }
            else{
                channel.send(`${text}`)
            }
        }
        else{
            return;
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
            let word = member.user.tag;
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
    
            let url = member.user.avatarURL;
            if(url == null){
                url = member.user.defaultAvatarURL;
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