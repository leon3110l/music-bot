import * as commands from '../commands'

export default class MessageHandler {
  constructor(client, prefix = '/', addons = {}) {
    if (!client) throw new Error('no client!')
    this.items = new Map()
    this.client = client
    this.prefix = prefix
    this.addons = addons
    Object.keys(commands).forEach(key => {
      this.set(commands[key])
    })
  }

  set(command, prefix = true) {
    command.info.triggers.forEach(x => {
      this.items.set(prefix ? this.prefix + x : x, command)
    })
  }

  handle(message) {
    if (message.author.bot) return
    const parts = message.content.split(' ')
    const CClass = this.items.get(parts[0])
    if (CClass) {
      try {
        const Command = new CClass(this.client)
        Command.run(message, parts, this.addons)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
