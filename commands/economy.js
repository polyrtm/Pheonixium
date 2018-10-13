const Discord = require('discord.js')
const index = require('../index.js')
module.exports = {
    'aliases': ['money'],
    'description': 'Gets User Money.',
    execute (msg, args) {
        /* eslint-disable-next-line no-magic-numbers */
        const mUser = (/([0-9]+)/gmu).test(args.join(' ')) ? args.join(' ').match(/([0-9]+)/gmu)[0] : msg.author.id
        const economy = index.getEconomy()
        msg.guild.fetchMember(mUser).then((tUser) => {
            if (!economy[tUser.id]) {
                economy[tUser.id] = {
                    'items': [],
                    'money': 0
                }
            }
            const emb = new Discord.RichEmbed().
                setColor('#f4c842').
                setThumbnail(tUser.user.avatarURL).
                setTitle(`${tUser.user.username}'s Money:`).
                setDescription(`$${economy[tUser.id].money}`).
                setFooter(`Used by: ${msg.author.username}`, msg.author.avatarURL)

            return msg.channel.send(emb)
        }).
            catch(() => {
                msg.channel.send(`:x: **${msg.author.username}** that user doesn't exist.`)
            })

    },
    'name': 'economy',
    'usage': 'economy [user]'
}