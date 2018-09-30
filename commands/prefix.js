const functions = require('../index.js');
module.exports = {
    'aliases': [
        'pr',
        'setprefix'
    ],
    'description': 'Sets the prefix for a server.',
    'execute': (message, args) => {
        const servers = functions.getServers();
        let server;
        try {
            server = servers[message.guild.id];
        } catch (err) {
            server = servers[`channel${message.channel.id}`]
        }
        /* eslint-disable-next-line no-magic-numbers */
        if (args.length === 1) {
            if (server) {
                /* eslint-disable-next-line no-magic-numbers */
                [server.prefix] = args;
            }
            try {
                servers[message.guild.id] = server;
            } catch (err) {
                servers[`channel${message.channel.id}`] = server;
            }
            functions.setServers(servers);
        /* eslint-disable-next-line no-magic-numbers */
        } else if (args.length === 0) {
            return message.channel.send(`**Prefix:** ${server.prefix}`);
        } else {
            return message.channel.send('Please include exactly less than 2 arguments.');
        }

        return null;
    },
    'name': 'prefix',
    'usage': 'prefix [prefix]'
}