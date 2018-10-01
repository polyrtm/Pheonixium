const index = require('../index.js')
module.exports = {
    'aliases': ['xprole'],
    'description': 'Sets which roles will be given when user reaches `X` level.',
    execute (msg, args) {
        if (msg.member.hasPermission('MANAGE_ROLES')) {
            /* eslint-disable prefer-destructuring, no-magic-numbers */
            if ((/([0-9]+)/u).test(args[0]) && (/([0-9]+)/u).test(args[1])) {
                const [, lvlToReach] = args[0].match(/([0-9]+)/u)[1];
                const [, levelRole] = args[1].match(/([0-9]+)/u)[1];
                /* eslint-enable prefer-destructuring, no-magic-numbers */

                if (msg.guild.roles.exists('id', levelRole)) {
                    const servers = index.getServers();

                    if (!servers[msg.guild.id].lvlroles) {
                        servers[msg.guild.id].lvlroles = {};
                    }

                    servers[msg.guild.id].lvlroles[lvlToReach] = levelRole;
                    index.setServers(servers);
                    msg.channel.send(`:white_check_mark: Changed Level **${lvlToReach}** role to **${msg.guild.roles.get(levelRole).name}**.`);
                } else {
                    msg.channel.send(`:x: **${msg.author.username}** that role doesn't exist.`);
                }
            } else {
                msg.channel.send(`:x: **${msg.author.username}** Argument 1 isn't a number, or Argument 2 is not a role.`);
            }
        } else {
            msg.channel.send(`:x: **${msg.author.username}** you don't have permission \`Manage roles\`.`);
        }
    },
    'name': 'lvlrole',
    'usage': 'lvlrole <level(num)> <Role ID/Mention>'
}