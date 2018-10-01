const functions = require('../index.js');
let servers;
module.exports = {
    'aliases': ['c'],
    'description': 'Clears the queue.',
    'execute': (message) => {
        if (message.guild) {
            servers = functions.getServers();
            const server = servers[message.guild.id];
            server.queue = []
            message.channel.send('Queue cleared!')
        }
    },
    'name': 'clear',
    'usage': 'clear'
}