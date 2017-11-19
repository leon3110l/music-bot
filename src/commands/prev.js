import Command from '../structures/command'

export default class Prev extends Command {
  static info = {
    name: 'previous',
    triggers: ['prev'],
    description: 'goes back a song',
  }

  run(message, parts, addons) {
    const musicManager = addons.serverManager.get(message.guild.id).musicManager
    musicManager.playPrev()
  }
}
