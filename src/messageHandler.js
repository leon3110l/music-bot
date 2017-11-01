export default class MessageHandler {
  constructor(prefix) {
    this.items = new Map()
    this.prefix = prefix || ''
  }
  set(key, value, prefix = true) {
    this.items.set(prefix ? this.prefix + key : key, value)
  }
  handle(message) {
    if (message.author.bot) return
    const parts = message.content.split(' ')
    const get = this.items.get(parts[0])
    if (get) {
      try {
        get(message, parts)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
