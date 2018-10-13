const index = require('../index.js')

module.exports = {
    'aliases': ['work'],
    'description': 'Gives you random amount of money every 24h',
    execute (msg) {
        // Disable eslint and use something diffrent, it's annoying. I can't even disable it.
        if (!index.getDailyCD()[msg.author.id]) {
            const economy = require('../economy.json')
            if (!economy[msg.author.id]) economy[msg.author.id] = {
                'items': [],
                'money': 0
            }
            const min = 15
            const max = 50
            const rand = Math.floor(Math.random() * (max - min + 1)) + min
            economy[msg.author.id].money += rand
            index.setDailyCD(msg.author.id)
            index.setEconomy(economy)
            msg.channel.send(`:package: **${msg.author.username}** you openned box, and there was $${rand} money.`)
        } else {
            msg.channel.send(`:x: **${msg.author.username}**, you are on cooldown. Try again after 24h when you used daily.`)
        }
    },
    'name': 'daily',
    'usage': 'daily'
}