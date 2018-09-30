const functions = require('../index.js');
const Discord = require('discord.js');
let servers;
module.exports = {
    'aliases': ['l'],
    'description': 'Lists the queue.',
    'execute': (message) => {
        if (message.guild) {
            servers = functions.getServers();
            const server = servers[message.guild.id];
            if (server && server.queue[0]) {
                const text = server.queue.map((video, index) => `${(index + 1)}: ${video.name}`).join('\n');
                const embed = new Discord.RichEmbed().
                    setTitle('Queue List').
                    setColor('#EFFF00').
                    addField('Song List:', text);
                message.channel.send({
                    embed
                })
            }
        }
    },
    'name': 'list',
    'usage': 'list'
}