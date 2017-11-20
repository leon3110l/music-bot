import Command from '../structures/command'
import Song from '../structures/song'
import ytsearch from '../utils/youtube'
import musicFilter from '../utils/musicFilter'

import { yt_url } from '../conf'
const yturi = 'youtube.com/watch?v=' // used for search

export default class Add extends Command {
  static info = {
    name: 'add',
    triggers: ['add', 'a'],
    description: 'adds a song to the queue',
  }

  run(message, parts, addons) {
    const musicManager = message.guild.musicManager
    const { spotifyParser } = addons

    let match = true
    parts.slice(1).forEach(x => {
      const spotify = spotifyParser.parse(x)

      if (x.search(yturi) != -1) this.ytUrl(musicManager)(x)
      else if (spotify.playlist) this.spotifyPlaylist(musicManager)(spotify)
      else if (spotify.album) this.spotifyAlbum(musicManager)(spotify)
      else match = false
    })

    if (!match && parts.length > 1) this.ytSearch(musicManager)(parts.slice(1))
  }

  ytUrl = mmgr => url => {
    mmgr.add(new Song(url))
  }

  spotifyPlaylist = mmgr => x => {
    console.log('spotifyPlaylist')
  }

  spotifyAlbum = mmgr => x => {
    console.log('spotifyAlbum')
  }

  ytSearch = mmgr => x => {
    const q = x.join(' ')
    ytsearch({ q }).then(res => {
      const { items } = res
      for (let x of items.filter(musicFilter(q))) {
        const { snippet } = x

        const info = {
          title: snippet.title,
          album: '',
          artists: [snippet.channelTitle],
          cover: snippet.thumbnails.high.url,
        }

        mmgr.add(new Song(`${yt_url}${x.id.videoId}`, info))
        break
      }
    })
  }
}
