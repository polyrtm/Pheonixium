const Discord = require('discord.js')

module.exports = {
    'aliases': ['xp'],
    'description': 'Gets level/xp of selected user.',
    execute (message) {
        // So you could save 'setlevel' command stuff
        const level = require('../level.json')
        const user = message.mentions.members.first() || message.member
        if (!level[message.guild.id]) {
            level[message.guild.id] = {}
        }
        if (!level[message.guild.id][user.id]) {
            level[message.guild.id][user.id] = {
                'level': 1,
                'xp': 0
            }
        }
        const emb = new Discord.RichEmbed().
            setColor('#f4c842').
            setTitle(`${user.user.username} Level Info:`).
            setThumbnail(user.user.avatarURL).
            /* eslint-disable-next-line no-magic-numbers */
            addField('Level', `${level[message.guild.id][user.id].level}`, true).
            /* eslint-disable-next-line no-magic-numbers */
            addField('Xp', `[**${level[message.guild.id][user.id].xp}**/**${level[message.guild.id][user.id].level * 250}**]`, true).
            setFooter('Pheonixium', require('../index.js').client.user.avatarURL)
        message.channel.send(emb)
    },
    'name': 'level',
    'usage': 'level [mention/id]'
}