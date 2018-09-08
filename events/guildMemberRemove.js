module.exports = (client, member) => {
    let channel = client.provider.get(member.guild.id, "goodbye_channel", null);
    let text = client.provider.get(member.guild.id, "goodbye_message", null);
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
        channel.send(`${text}`);
    }
    else{
        return;
    }
    
}