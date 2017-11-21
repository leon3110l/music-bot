import Command from '../structures/command'

export default class Sp extends Command {
  static info = {
    name: 'spotify search',
    triggers: ['sp', 'spotify'],
    description: 'search for stuff on spotify',
  }

  run(message, parts, addons) {
    if (!parts[1]) return
    const { spotifyApi, spotifyParser } = addons
    const q = parts.slice(1).join(' ')

    // Search tracks whose name, album or artist contains 'Love'
    spotifyApi.searchTracks(q).then(data => {
      message.reply(data.body.tracks.items[0].external_urls.spotify)
    })
  }
}
