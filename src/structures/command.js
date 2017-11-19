export default class Command {
  constructor(client) {
    if (!client) throw new Error('no client supplied')
    this.client = client
  }

  static info = {}

  run(message, parts) {}
}
