module.exports = (client, guild) => {
    client.provider.set(guild.id, "timezone", "Etc/GMT");
    guild.channels.sort(function(chan1,chan2){
        if(chan1.type!==`text`) return 1;
        if(!chan1.permissionsFor(guild.me).has(`SEND_MESSAGES`)) return -1;
        return chan1.position < chan2.position ? -1 : 1;
    }).first().send(`Thank your for the invite \n` + 
    `HuoLong bot is still on development and if you found any bug please send it to us on our support server discord.gg/eNQQbmq \n` +
    `If you have any question or request feel free to ask on our support server`);
}

