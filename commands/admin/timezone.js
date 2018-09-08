const { Command } = require('discord.js-commando');
const moment = require('moment-timezone');

module.exports = class TimezoneCommand extends Command{
    constructor(client){
        super(client, {
            name : 'timezone',
            aliases : ['tz', 'timezones'],
            group : 'admin',
            memberName : 'timezone',
            description : 'Set Local Timezone for your server. All available timezone can be found on <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>. Command without argument will return your current timezone.',
            examples : [client.commandPrefix + 'Timezone', client.commandPrefix + 'tz Asia/Jakarta'],
            guildOnly: true,
            //clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            throttling : {
                usages : 1,
                duration : 5
            },
            args:[
                {
                    key:'timezone',
                    prompt : 'which timezone do you want to use ? \n'+ 
                    `You can see the list of available timezone on <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>`,
                    type : 'string',
                    default: '',
                    wait: 120
                }
            ]
        });
    }

    run(message, {timezone}){
        if(timezone == ''){
            let tz = this.client.provider.get(message.guild.id, "timezone");
            return message.say(`Your current timezone is ${tz}`)
        }
        else if(moment.tz.zone(timezone)){
            this.client.provider.set(message.guild.id, "timezone", timezone)
            return message.say(`Server timezone has been set at ${timezone}`)
        }
        else{
            return message.say(`Cant find timezone with name ${timezone} please make sure to set the correct timezone name`)
        }
    }
}