const cat = require('random.cat-meow');
const Discord = require('discord.js');
module.exports = {
    'aliases': [
        'rc',
        'rcat',
        'randomcat'
    ],
    'description': 'A random cat',
    execute (message) {
        cat().
            then((catURL) => {
                const embed = new Discord.RichEmbed();
                embed.setImage(catURL);
                embed.setColor('EFFF00');

                return message.channel.send('I found one! :cat:', {
                    embed
                });
            }).
            catch(() => message.channel.send('There was an error.'));
    },
    'name': 'cat',
    'usage': 'cat'
};