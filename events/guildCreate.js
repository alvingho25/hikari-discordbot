module.exports = (client, member) => {
    client.provider.set(member.guild.id, "timezone", "Etc/GMT");
}