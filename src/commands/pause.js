import Command from '../structures/command'

export default class Pause extends Command {
  static info = {
    name: 'pause',
    triggers: ['pause', 'p'],
    description: 'pause the playing of music',
  }

  run(message, parts, addons) {
    const musicManager = message.guild.musicManager
    musicManager.pause()
  }
}
