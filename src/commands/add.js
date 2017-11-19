import Command from '../structures/command'
import MusicManager from '../utils/musicManager'
import Song from '../structures/song'

export default class Add extends Command {
  static info = {
    name: 'add',
    triggers: ['add', 'a'],
    description: 'adds a song to the queue',
  }

  run(message, parts, addons) {
    console.log(addons.serverManager, message.guild.id)
  }
}
