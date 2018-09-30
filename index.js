const Discord = require('discord.js');
const {token} = require('./token.json')
const Client = new Discord.Client();
Client.login(token);
module.exports.Client = Client;