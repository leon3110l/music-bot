import Discord from 'discord.js'
import SpotifyWebApi from 'spotify-web-api-node'
const yt = require('googleapis').youtube('v3')

import {
  token,
  prefix,
  spotify_secret,
  spotify_id,
  youtube_token,
  yt_url,
} from './conf'
import help from './help'
import MessageHandler from './messageHandler'
import SpotifyParser from './spotifyParser'

const bot = new Discord.Client()
const handler = new MessageHandler(prefix)
var spotifyApi = new SpotifyWebApi({
  clientId: spotify_id,
  clientSecret: spotify_secret,
})
const parser = new SpotifyParser()

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  data => {
    console.log('The access token expires in ' + data.body['expires_in'])
    console.log('The access token is ' + data.body['access_token'])

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token'])
    spotifyApi.setRefreshToken(data.body['refresh_token'])
  },
  err => {
    console.log('Something went wrong when retrieving an access token', err)
  },
)

bot.on('ready', () => {
  bot.generateInvite(['SEND_MESSAGES', 'MENTION_EVERYONE']).then(link => {
    console.log(`Generated bot invite link: ${link}`)
  })
  bot.user.setGame(prefix + 'help for help')
})

handler.set('help', message => {
  let msg = 'help: \r\n\r\n'
  console.log(help)
  for (let key in help) {
    msg += `${prefix}${key}: ${help[key]}\r\n\r\n`
  }
  message.author.send(msg)
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
        msg += `${i + 1}. ${yt_url}${x.id.videoId}\r\n`
      })
      msg += ''
      message.reply(msg)
    })
  }
})

handler.set('yt', (message, parts) => {
  if (!parts[1]) return

  const q = parts.slice(1).join(' ')
  ytsearch({ q }).then(res => {
    const { items } = res
    let msg = 'found\r\n\r\n'
    for (let x of items.filter(musicFilter(q))) {
      msg += `${yt_url}${x.id.videoId}\r\n`
      break
    }
    message.reply(msg)
  })
})

const album = (message, parts) => {
  if (!parts[0]) return

  spotifyApi
    .getAlbums(
      parts
        .slice(1)
        .map(x => parser.parse(x))
        .map(x => x.album),
    )
    .then(data => {
      const { albums } = data.body
      albums.forEach(x => {
        const { items } = x.tracks
        let msg = 'got: \r\n'

        const all = []
        const qs = []

        items.forEach((x, i) => {
          const q = x.artists[0].name + ' - ' + x.name
          qs.push(q)
          all.push(ytsearch({ q }))
        })

        Promise.all(all).then(a => {
          a.forEach((res, i) => {
            const { items } = res
            for (let x of items.filter(musicFilter(qs[i]))) {
              msg += `${qs[i]}:\r\n${yt_url}${x.id.videoId}\r\n`
              break
            }
            console.log(i, all.length)
            if ((i % 5 === 0 && i != 0) || i === all.length - 1) {
              message.reply(msg)
              msg = ''
            }
          })
        })
      })
    })
}
handler.set('albums', album)
handler.set('album', album)

const playlist = (message, parts) => {
  parts.slice(1).forEach(x => {
    const parsed = parser.parse(x)
    console.log(parsed)
    spotifyApi.getPlaylist(parsed.user, parsed.playlist).then(res => {
      const { items } = res.body.tracks
      let msg = 'got: \r\n'
      const all = []
      const qs = []
      items.forEach((x, i) => {
        x = x.track.album
        const q = `${x.artists[0].name} - ${x.name}`
        all.push(ytsearch({ q }))
        qs.push(q)
      })
      Promise.all(all).then(a => {
        a.forEach((res, i) => {
          const { items } = res
          for (let x of items.filter(musicFilter(qs[i]))) {
            msg += `${qs[i]}:\r\n${yt_url}${x.id.videoId}\r\n`
            break
          }
          if ((i % 5 === 0 && i != 0) || i === all.length - 1) {
            message.reply(msg)
            msg = ''
          }
        })
      })
    })
  })
}
handler.set('playlist', playlist)
handler.set('playlists', playlist)

bot.on('message', message => {
  handler.handle(message)
})

bot.login(token)

function ytsearch(opt) {
  return new Promise((resolve, reject) => {
    yt.search.list(
      {
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

const musicFilter = q => x => {
  const {snippet} = x
  const regex = new RegExp(
    `vevo|official|audio|lyric|${q
      .toLowerCase()
      .split(' ')
      .join('|')}`,
    'g',
  )
  return snippet.channelTitle.toLowerCase().search( regex ) != -1
         || snippet.title.toLowerCase().search(regex) != -1
}
