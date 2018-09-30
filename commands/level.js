const {client} = require('../index.js')
const level = require('./level.json')
const Discord = require('discord.js');
const fs = require('fs');
client.on('message', (msg) => {
    if (!msg.author.bot) {
        if (!level[msg.guild.id]) {
            level[msg.guild.id] = {}
        }
        if (!level[msg.guild.id][msg.author.id]) {
            level[msg.guild.id][msg.author.id] = {
                'level': 1,
                'xp': 0
            }
        }
        /* eslint-disable-next-line no-magic-numbers */
        const newXp = Math.floor(Math.random() * (16 - 3 + 1)) + 16
        const currentXp = level[msg.guild.id][msg.author.id].xp
        const currentLevel = level[msg.guild.id][msg.author.id].level
        /* eslint-disable-next-line no-magic-numbers */
        const nextLevel = currentLevel * 250
        if (currentXp + newXp >= nextLevel) {
            level[msg.guild.id][msg.author.id].xp = currentXp + newXp - nextLevel
            level[msg.guild.id][msg.author.id].level++
            const emb = new Discord.RichEmbed().
                setColor('#f4c842').
                setThumbnail(msg.author.avatarURL).
                /* eslint-disable-next-line no-magic-numbers */
                addField('Level up', `**${msg.author.username}** has leveled up, to level **${currentLevel + 1}**.`).
                setFooter('Pheonixium', client.user.avatarURL)
            msg.channel.send(emb)
        } else {
            level[msg.guild.id][msg.author.id].xp = currentXp + newXp
        }
        fs.writeFile('./level.json', JSON.stringify(level), 'utf8', (err) => {
            if (err) {
                throw err
            }
        })
    }
})

module.exports = {
    'aliases': ['xp'],
    'description': 'Gets level/xp of selected user.',
    execute (msg, args) {
        /* eslint-disable-next-line no-magic-numbers */
        const userMentioned = (/([0-9]{5,})/u).test(args.join(' ')) ? args.join(' ').match(/([0-9]{5,})/u)[1] : msg.author.id
        msg.guild.members.fetch(userMentioned).then((tUser) => {
            const emb = new Discord.RichEmbed().
                setColor('#f4c842').
                setTitle(`${tUser.user.username} Level Info:`).
                setThumbnail(tUser.user.avatarURL).
                addField('Level', `${level[msg.guild.id][tUser.id].level}`, true).
                /* eslint-disable-next-line no-magic-numbers */
                addField('Xp', `[**${level[msg.guild.id][tUser.id].xp}**/**${level[msg.guild.id][tUser.id] * 250}**]`, true).
                setFooter('Pheonixium', client.user.avatarURL)
            msg.channel.send(emb)
        })
    },
    'name': 'level',
    'usage': 'level [mention/id]'
}