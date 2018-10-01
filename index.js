const Discord = require('discord.js');
const fs = require('fs');
const level = require('./level.json')
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
module.exports.setServers = (object) => {
    servers = object;

    return servers;
}
module.exports.getServers = () => servers;

client.on('ready', () => {
    client.user.setActivity('Botting...');
});
client.on('message', async (message) => {
    if (!message.author.bot) {
        if (!level[message.guild.id]) {
            level[message.guild.id] = {}
        }
        if (!level[message.guild.id][message.author.id]) {
            level[message.guild.id][message.author.id] = {
                'level': 1,
                'xp': 0
            }
        }
        /* eslint-disable-next-line no-magic-numbers */
        const newXp = Math.floor(Math.random() * (16 - 3 + 1)) + 16
        const currentXp = level[message.guild.id][message.author.id].xp
        const currentLevel = level[message.guild.id][message.author.id].level
        /* eslint-disable-next-line no-magic-numbers */
        const nextLevel = currentLevel * 250
        if (currentXp + newXp >= nextLevel) {
            level[message.guild.id][message.author.id].xp = currentXp + newXp - nextLevel
            level[message.guild.id][message.author.id].level++
            /* eslint-disable-next-line no-magic-numbers */
            if (servers[message.guild.id].lvlroles[currentLevel + 1]) {
                /* eslint-disable no-magic-numbers */
                if (message.guild.me.hasPermission('MANAGE_ROLES') && message.guild.roles.exists('id', servers[message.guild.id].lvlroles[currentLevel + 1])) {
                    message.member.addRole(servers[message.guild.id].lvlroles[currentLevel + 1], 'Level up role')
                    /* eslint-enable no-magic-numbers */
                }
            }
            const emb = new Discord.RichEmbed().
                setColor('#f4c842').
                setThumbnail(message.author.avatarURL).
                /* eslint-disable-next-line no-magic-numbers */
                addField('Level up', `**${message.author.username}** has leveled up, to level **${currentLevel + 1}**.`).
                setFooter('Pheonixium', client.user.avatarURL)
            message.channel.send(emb)
        } else {
            level[message.guild.id][message.author.id].xp = currentXp + newXp
        }
        fs.writeFileSync('./level.json', JSON.stringify(level), 'utf8', (err) => {
            if (err) {
                throw err
            }
        })
    }
    if (!message.guild) {
        if (!servers[`channel${message.channel.id}`]) {
            servers[`channel${message.channel.id}`] = {
                'prefix': '$'
            };
        }
    } else if (!servers[message.guild.id]) {
        servers[message.guild.id] = {
            'playing': false,
            'prefix': '$',
            'queue': []
        };
    }
    let prefix;
    try {
        ({prefix} = servers[message.guild.id]);
    } catch (error) {
        ({prefix} = servers[`channel${message.channel.id}`]);
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
client.login(token);
module.exports.client = client;