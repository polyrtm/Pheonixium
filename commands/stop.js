const functions = require('../index.js');
let servers;
module.exports = {
    'aliases': ['s'],
    'description': 'Stops playing a song.',
    'execute': (message) => {
        if (message.guild) {
            servers = functions.getServers();
            const server = servers[message.guild.id];

            if (server && message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }
        }
    },
    'name': 'stop',
    'usage': 'stop'
}