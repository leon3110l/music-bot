import Discord from 'discord.js'

import { token, prefix, yt_url } from './conf'

import MessageHandler from './utils/messageHandler'
import musicFilter from './utils/musicFilter'
import ytsearch from './utils/youtube'

import Help from './commands/help'

const bot = new Discord.Client()
const handler = new MessageHandler(bot, prefix)

bot.on('ready', () => {
  bot.generateInvite(['SEND_MESSAGES', 'MENTION_EVERYONE']).then(link => {
    console.log(`Generated bot invite link: ${link}`)
  })
  bot.user.setGame(prefix + 'help for help')
})

handler.set(Help)

// handler.set('yt:multiple', (message, parts) => {
//   if (parts[1]) {
//     ytsearch({ q: parts.slice(1).join(' ') }).then(res => {
//       const { items } = res
//       let msg = 'found\r\n\r\n'
//       items.forEach((x, i) => {
//         msg += `${i + 1}. ${yt_url}${x.id.videoId}\r\n`
//       })
//       msg += ''
//       message.reply(msg)
//     })
//   }
// })

// handler.set('yt', (message, parts) => {
//   if (!parts[1]) return

//   const q = parts.slice(1).join(' ')
//   ytsearch({ q }).then(res => {
//     const { items } = res
//     let msg = 'found\r\n\r\n'
//     for (let x of items.filter(musicFilter(q))) {
//       msg += `${yt_url}${x.id.videoId}\r\n`
//       break
//     }
//     message.reply(msg)
//   })
// })

// const album = (message, parts) => {
//   if (!parts[0]) return

//   spotifyApi
//     .getAlbums(
//       parts
//         .slice(1)
//         .map(x => parser.parse(x))
//         .map(x => x.album),
//     )
//     .then(data => {
//       const { albums } = data.body
//       albums.forEach(x => {
//         const { items } = x.tracks
//         let msg = 'got: \r\n'

//         const all = []
//         const qs = []

//         items.forEach((x, i) => {
//           const q = x.artists[0].name + ' - ' + x.name
//           qs.push(q)
//           all.push(ytsearch({ q }))
//         })

//         Promise.all(all).then(a => {
//           a.forEach((res, i) => {
//             const { items } = res
//             for (let x of items.filter(musicFilter(qs[i]))) {
//               msg += `${qs[i]}:\r\n${yt_url}${x.id.videoId}\r\n`
//               break
//             }
//             console.log(i, all.length)
//             if ((i % 5 === 0 && i != 0) || i === all.length - 1) {
//               message.reply(msg)
//               msg = ''
//             }
//           })
//         })
//       })
//     })
// }
// handler.set('albums', album)
// handler.set('album', album)

// const playlist = (message, parts) => {
//   parts.slice(1).forEach(x => {
//     const parsed = parser.parse(x)
//     console.log(parsed)
//     spotifyApi.getPlaylist(parsed.user, parsed.playlist).then(res => {
//       const { items } = res.body.tracks
//       let msg = 'got: \r\n'
//       const all = []
//       const qs = []
//       items.forEach((x, i) => {
//         x = x.track.album
//         const q = `${x.artists[0].name} - ${x.name}`
//         all.push(ytsearch({ q }))
//         qs.push(q)
//       })
//       Promise.all(all).then(a => {
//         a.forEach((res, i) => {
//           const { items } = res
//           for (let x of items.filter(musicFilter(qs[i]))) {
//             msg += `${qs[i]}:\r\n${yt_url}${x.id.videoId}\r\n`
//             break
//           }
//           if ((i % 5 === 0 && i != 0) || i === all.length - 1) {
//             message.reply(msg)
//             msg = ''
//           }
//         })
//       })
//     })
//   })
// }
// handler.set('playlist', playlist)
// handler.set('playlists', playlist)

bot.on('message', message => {
  handler.handle(message)
})

bot.login(token)
