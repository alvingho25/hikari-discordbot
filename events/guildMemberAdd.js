const Jimp = require("jimp");

module.exports = (client, member) => {
    if(member.user.username.includes("discord.gg/")){
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
        if(channel != null && text != null){
            channel = client.channels.get(channel);
            if(text.includes("${USER")){
                text.replace("${USER}", member.user);
            }
            if(text.includes("${GUILD")){
                text.replace("${GUILD}", member.guild);
            }
            if(text.includes("${COUNT")){
                text.replace("${COUNT}", member.guild.memberCount);
            }
            channel.send(`${text}`)
        }
        else{
            return;
        }
    }
}