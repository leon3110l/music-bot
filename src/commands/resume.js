import Command from '../structures/command'

export default class Resume extends Command {
  static info = {
    name: 'resume',
    triggers: ['resume', 'r'],
    description: 'resume the playing of music',
  }

  run(message, parts, addons) {
    const musicManager = message.guild.musicManager
    musicManager.resume()
  }
}
