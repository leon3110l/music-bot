import Command from '../structures/command'

export default class Prev extends Command {
  static info = {
    name: 'previous',
    triggers: ['prev'],
    description: 'goes back a song',
  }

  run(message, parts, addons) {
    const musicManager = message.guild.musicManager
    musicManager.playPrev()
  }
}
