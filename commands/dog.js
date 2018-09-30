const Discord = require('discord.js');
const http = require('https');
module.exports = {
    'aliases': [
        'rd',
        'rdog',
        'randomdog'
    ],
    'description': 'A random dog',
    execute (message) {
        http.get('https://dog.ceo/api/breeds/image/random', (res) => {
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                const data = JSON.parse(rawData);
                const embed = new Discord.RichEmbed();
                embed.setImage(data.message);
                embed.setColor('EFFF00');
                message.channel.send('I found one! :dog:', {
                    embed
                });
            })
        })
    },
    'name': 'dog',
    'usage': 'dog'
};