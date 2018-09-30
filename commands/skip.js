const functions = require('../index.js');
let servers;
module.exports = {
    'aliases': ['sk'],
    'description': 'Skips a song.',
    'execute': (message) => {
        if (message.guild) {
            servers = functions.getServers();
            const server = servers[message.guild.id];
            if (server && server.dispatcher) {
                server.dispatcher.end();
            }
        }
    },
    'name': 'skip',
    'usage': 'skip'
}