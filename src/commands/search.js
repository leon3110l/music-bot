import Command from '../structures/command'
import spotifyApi from '../utils/spotify'

export default class Search extends Command {
  static info = {
    name: 'search',
    triggers: ['search'],
    description: 'search for music on spotify',
  }

  run(message, parts) {
    if (parts[1]) {
      spotifyApi.searchTracks(parts.slice(1).join(' ')).then(res => {
        const { items } = res.body.tracks
        let msg = 'found```'
        items.forEach((x, i) => {
          const { album } = x
          msg += `${i}. ${x.name} - ${album.artists[0].name}\r\n`
        })
        msg += '```'
        message.reply(msg)
      })
    }
  }
}
