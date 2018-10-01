const functions = require('../index.js');
let servers;
module.exports = {
  name: 'stop',
  description: 'Stops playing a song.',
  aliases: ['s'],
  usage: 'stop',
  execute: (message, args) => {
    if (message.guild) {
      servers = functions.getServers();
      server = servers[message.guild.id];
      if (server && message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
    }
  }
}