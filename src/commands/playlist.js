import Command from '../structures/command'
import spotifyApi from '../utils/spotify'
import ytsearch from '../utils/youtube'
import musicFilter from '../utils/musicFilter'
import { yt_url } from '../conf'
import SpotifyParser from '../utils/spotifyParser'

const parser = new SpotifyParser()

export default class Playlist extends Command {
  static info = {
    name: 'playlist yt search',
    triggers: ['playlists', 'playlist'],
    description: 'get playlist from spotify and get youtube link from it',
  }

  run(message, parts) {
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
}
