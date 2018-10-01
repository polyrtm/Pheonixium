const yt = require('ytdl-core');
const youtube = require('youtube-api-v3-search');
let servers;
const functions = require('../index.js');
const play = (connection, message) => {
    const server = servers[message.guild.id];
    server.playing = true;
    /* eslint-disable-next-line no-magic-numbers */
    server.dispatcher = connection.playStream(yt(server.queue[0].url, {
        'filter': 'audioonly'
    }));
    /* eslint-disable-next-line no-magic-numbers */
    message.channel.send(`Now Playing: ${server.queue[0].name}`);
    functions.setServers(servers);
    server.dispatcher.on('end', () => {
        server.queue.shift();
        /* eslint-disable-next-line no-magic-numbers */
        if (server.queue[0]) {
            play(connection, message);
        } else {
            connection.disconnect();
            server.playing = false;
        }
    })
}
const getURL = async (input) => {
    let isYtdl = true;
    await yt.getInfo(input).catch(() => {
        isYtdl = false;
    });
    if (!isYtdl) {
        const res = await youtube('AIzaSyCpLaGOQaUR0jaGQsGeGfQ-9_NEB7KnKfM', {
            'part': 'snippet',
            'q': input,
            'type': 'video'
        })

        return {
            /* eslint-disable-next-line no-magic-numbers */
            'name': res.items[0].snippet.title,
            /* eslint-disable-next-line no-magic-numbers */
            'url': `http://www.youtube.com/watch?v=${res.items[0].id.videoId}`
        };
    }

    return {
        'name': await yt.getInfo(input).title,
        'url': input
    };

}
let connection;
module.exports = {
    'aliases': ['p'],
    'description': 'Plays a song from a YouTube URL or search keyword',
    async execute (message, args) {
        if (!message.guild) {
            return message.channel.send('This command only works in servers.');
        }
        if (!message.member.voiceChannel) {
            return message.channel.send('You are not in a voice channel.');
        }
        servers = functions.getServers();
        /* eslint-disable-next-line no-magic-numbers */
        if (args.length > 0) {
            const url = await getURL(args.join(' '));
            servers[message.guild.id].queue.push(url);
        }
        const server = servers[message.guild.id];
        servers = functions.setServers(servers);
        /* eslint-disable-next-line no-magic-numbers */
        if (server.queue.length === 0) {
            return message.channel.send('Please add some songs to the queue!');
        }
        if (!message.guild.voiceConnection) {
            connection = await message.member.voiceChannel.join();
        }
        if (!server.playing) {
            play(connection, message);
        }

        return null;
    },
    'name': 'play',
    'usage': 'play [YT url of song or search keyword]'
};