import ytdl from 'ytdl-core'

export default class MusicManager {
  constructor(client, voiceChannel) {
    if (!client) throw new Error('no client supplied')
    this.client = client
    this.queue = []
    this.connection = voiceChannel.connection
    if (!this.connection) {
      voiceChannel.join().then(conn => {
        this.connection = conn
      })
    }
    this.broadcast = client.createVoiceBroadcast()
  }

  add(song) {
    this.queue.push(song)
  }

  play() {
    const stream = ytdl(this.queue[0].url, {
      filter: 'audioonly',
    })
    this.broadcast.playStream(stream)
    const dispatcher = this.connection.playBroadcast(this.broadcast)
  }
}
