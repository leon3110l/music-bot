import Discord from 'discord.js'
import SpotifyWebApi from 'spotify-web-api-node'
const yt = require('googleapis').youtube('v3')

import {
  token,
  prefix,
  spotify_secret,
  spotify_id,
  youtube_token,
} from './conf.json'
import MessageHandler from './messageHandler'

const bot = new Discord.Client()
const handler = new MessageHandler(prefix)
var spotifyApi = new SpotifyWebApi({
  clientId: spotify_id,
  clientSecret: spotify_secret,
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  data => {
    console.log('The access token expires in ' + data.body['expires_in'])
    console.log('The access token is ' + data.body['access_token'])

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token'])
  },
  err => {
    console.log('Something went wrong when retrieving an access token', err)
  },
)

bot.on('ready', () => {
  bot.generateInvite(['SEND_MESSAGES', 'MENTION_EVERYONE']).then(link => {
    console.log(`Generated bot invite link: ${link}`)
  })
})

handler.set('invite', message => {
  bot
    .generateInvite(['SEND_MESSAGES', 'MENTION_EVERYONE'])
    .then(link => message.reply(`here is the invite link: ${link}`))
})

handler.set('search', (message, parts) => {
  if (parts[1]) {
    spotifyApi.searchTracks(parts.slice(1).join(' ')).then(res => {
      const { items } = res.body.tracks
      let msg = 'found```'
      items.forEach((x, i) => {
        const { album } = x
        msg += `${i}. ${album.name} - ${album.artists[0].name}\r\n`
      })
      msg += '```'
      message.reply(msg)
    })
  }
})

handler.set('yt:multiple', (message, parts) => {
  if (parts[1]) {
    ytsearch({ q: parts.slice(1).join(' ') }).then(res => {
      const { items } = res
      let msg = 'found\r\n\r\n'
      items.forEach((x, i) => {
        msg += `${i + 1}. https://www.youtube.com/watch?v=${x.id.videoId}\r\n`
      })
      msg += ''
      message.reply(msg)
    })
  }
})

handler.set('yt', (message, parts) => {
  if (parts[1]) {
    const q = parts.slice(1).join(' ')
    ytsearch({ q }).then(res => {
      const { items } = res
      let msg = 'found\r\n\r\n'
      items.some((x, i) => {
        if (
          x.snippet.channelTitle.toLowerCase().search(
            new RegExp(
              `vevo|${q
                .toLowerCase()
                .split(' ')
                .join('|')}`,
              'g',
            ),
          ) != -1
        ) {
          msg += `https://www.youtube.com/watch?v=${x.id.videoId}\r\n`
          return true
        }
      })
      message.reply(msg)
    })
  }
})

bot.on('message', message => {
  handler.handle(message)
})

bot.login(token)

function ytsearch(opt) {
  return new Promise((resolve, reject) => {
    yt.search.list(
      {
        order: 'viewCount',
        part: 'snippet',
        auth: youtube_token,
        maxResults: 10,
        type: 'video',
        ...opt,
      },
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      },
    )
  })
}
