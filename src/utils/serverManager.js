export default class ServerManager {
  constructor(client, addons = {}) {
    if (!client) throw new Error('no client supplied')
    this.client = client
    this.servers = new Map()
    this.addons = addons

    this.client.on('ready', () => {
      const guilds = this.client.guilds.array()
      guilds.forEach(guild => {
        this.add(guild)
      })
    })

    this.client.on('guildCreate', guild => {
      this.add(guild)
    })
  }

  add(guild) {
    for (const key in this.addons) {
      const Addon = this.addons[key]
      const name = key.charAt(0).toLowerCase() + key.slice(1)
      guild[name] = new Addon(this.client, guild)
    }
    this.servers.set(guild.id, guild)
  }

  get(snowflake) {
    this.servers.get(snowflake)
  }
}
