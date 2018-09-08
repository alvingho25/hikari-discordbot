module.exports = (client, member) => {
    let prefix = client.commandPrefix
    client.user.setActivity(`${prefix}help`, { type: 'LISTENING' })
}