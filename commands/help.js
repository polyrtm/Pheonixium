module.exports = {
    'aliases': ['commands'],
    'description': 'List all of my commands or info about a specific command.',
    async execute (message, args) {
        const data = [];
        const {
            commands
        } = message.client;
        let prefix;
        try {
            ({prefix} = require('../index.js').getServers()[message.guild.id]);
        } catch (error) {
            ({prefix} = require('../index.js').getServers()[`channel${message.channel.id}`]);
        }
        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map((command) => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            try {
                await message.author.send(data, {
                    'split': true
                })
                if (message.channel.type === 'dm') {
                    return null;
                }

                return message.reply('I\'ve sent you a DM with all my commands!');
            } catch (error) {
                return message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
            }
        }
        /* eslint-disable-next-line no-magic-numbers */
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find((comm) => comm.aliases && comm.aliases.includes(name));
        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) {
            data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        }
        if (command.description) {
            data.push(`**Description:** ${command.description}`);
        }
        if (command.usage) {
            data.push(`**Usage:** ${prefix}${command.usage}`);
        }

        return message.channel.send(data, {
            'split': true
        });
    },
    'name': 'help',
    'usage': 'help [command]'
};
