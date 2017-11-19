import Command from '../structures/command'
import Song from '../structures/song'

const yturi = 'youtube.com/watch?v='

export default class Add extends Command {
  static info = {
    name: 'add',
    triggers: ['add', 'a'],
    description: 'adds a song to the queue',
  }

  run(message, parts, addons) {
    const musicManager = message.guild.musicManager

    parts.slice(1).forEach(x => {
      if (x.search(yturi)) this.ytUrl(musicManager)(x)
    })
  }

  ytUrl = mmgr => url => {
    mmgr.add(new Song(url))
  }
}
