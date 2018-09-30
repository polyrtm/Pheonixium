const Discord = require('discord.js');
const fs = require('fs');
const {
    token
} = require('./token.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
let servers;
try {
    servers = JSON.parse(fs.readFileSync('servers.json'));
} catch (error) {
    servers = {};
}
client.on('ready', () => {
    client.user.setActivity('Botting...');
});
client.on('message', async (message) => {
    if (!message.guild) {
        if (!servers[`channel${message.channel.id}`]) {
            servers[`channel${message.channel.id}`] = {
                'prefix': ';'
            };
        }
    } else if (!servers[message.guild.id]) {
        servers[message.guild.id] = {
            'playing': false,
            'prefix': ';',
            'queue': []
        };
    }
    let prefix;
    try {
        ({prefix} = servers[message.guild.id].prefix);
    } catch (error) {
        ({prefix} = servers[`channel${message.channel.id}`].prefix);
    }
    if (message.content.startsWith(prefix) && !message.author.bot) {
        const args = message.content.slice(prefix.length).split(/\s+/u);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            return;
        }
        try {
            await command.execute(message, args);
            if (message.channel.type === 'text' && command.name === 'count') {
                message.delete();
            }
        } catch (error) {
            message.reply(`there was an error trying to execute that command!: ${error.message}`);
        }
    }
});
client.login(token);
const delay = 60000;
setInterval(() => {
    const toJson = JSON.stringify(servers, (key, value) => {
        if (key === 'dispatcher') {
            return null;
        } else if (key === 'playing') {
            return false;
        }

        return value;
    });
    fs.writeFileSync('servers.json', toJson);
}, delay)
module.exports.client = client;