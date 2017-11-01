import Discord from 'discord.js'
import SpotifyWebApi from 'spotify-web-api-node'

import { token, prefix, spotify_secret, spotify_id } from './conf.json'
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

bot.on('message', message => {
  handler.handle(message)
})

bot.login(token)
