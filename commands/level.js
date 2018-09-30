const {Client} = require('../index.js')
const level = require('./level.json')

Client.on('message', (msg) => {
  if(!msg.author.bot) {
    if(!level[msg.guild.id]) level[msg.guild.id] = {}
    if(!level[msg.guild.id][msg.author.id]) level[msg.guild.id][msg.author.id] = {
      "xp": 0,
      "level": 1
    }
    let newXp = Math.floor(Math.random() * (16 - 3 + 1)) + 16
    let currentXp = level[msg.guild.id][msg.author.id].xp
    let currentLevel = level[msg.guild.id][msg.author.id].level
    let nextLevel = currentLevel * 250
    if(currentXp +  newXp >= nextLevel) {
      level[msg.guild.id][msg.author.id].xp = currentXp + newXp - nextLevel
      level[msg.guild.id][msg.author.id].level++
      let emb = new Discord.RichEmbed()
       .setColor(`#f4c842`)
       .setThumbnail(msg.author.avatarURL)
       .addField(`Level up`, `**${msg.author.username}** has leveled up, to level **${currentLevel+1}**.`)
       .setFooter(`Pheonixium`, Client.user.avatarURL)
      msg.channel.send(emb)
    } else {
      level[msg.guild.id][msg.author.id].xp = currentXp + newXp
    }
    fs.writeFile('./level.json', JSON.stringify(level),  'utf8', (err) => {
      if(err) throw err
    })
  }
})

module.exports = {
  description: 'Gets level/xp of selected user.',
  aliases: ['xp'],
  name: 'level',
  usage: 'level [mention/id]',
  async execute(msg, args) {
    let userMentioned = /([0-9]{5,})/.test(args.join(' ')) ? args.join(' ').match(/([0-9]{5,})/)[1] : msg.author.id
    msg.guild.members.fetch(userMentioned).then((tUser) => {
      let emb = new Discord.RichEmbed()
       .setColor(`#f4c842`)
       .setTitle(`${tUser.user.username} Level Info:`)
       .setThumbnail(tUser.user.avatarURL})
       .addField(`Level`, `${level[msg.guild.id][tUser.id].level}`, true)
       .addField(`Xp`, `[**${level[msg.guild.id][tUser.id].xp}**/**${level[msg.guild.id][tUser.id]*250}**]`, true)
       .setFooter('Pheonixium', Client.user.avatarURL)
      msg.channel.send(emb)
    })
  }
}

