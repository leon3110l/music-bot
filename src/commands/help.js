import Command from '../utils/command'
import * as commands from '.'
import { prefix } from '../conf'

export default class Help extends Command {
  static info = {
    name: 'help',
    triggers: ['help', 'h'],
    description: 'generates this help page',
  }

  run(message, parts) {
    let msg = 'help: \r\n\r\n'
    Object.keys(commands).forEach(key => {
      const { info } = commands[key]
      msg += `${prefix}${info.triggers.join(
        ' | ',
      )}: ${info.description}\r\n\r\n`
    })
    message.author.send(msg)
  }
}
