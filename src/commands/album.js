import Command from '../structures/command'
import spotifyApi from '../utils/spotify'
import ytsearch from '../utils/youtube'
import musicFilter from '../utils/musicFilter'
import { yt_url } from '../conf'
import SpotifyParser from '../utils/spotifyParser'

const parser = new SpotifyParser()

export default class Album extends Command {
  static info = {
    name: 'album yt search',
    triggers: ['albums', 'album'],
    description: 'get album from spotify and get youtube link from it',
  }

  run(message, parts) {
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
