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
    this.dispatcher = this.connection.playBroadcast(this.broadcast)
    this.dispatcher.on('end', () => {
      this.playNext() // play the next song in the queue
    })
    this.currentlyPlaying = 0
  }

  add(song) {
    this.queue.push(song)
  }

  resume() {
    if (this.dispatcher.paused) {
      this.dispatcher.resume()
    }
  }

  pause() {
    if (!this.dispatcher.paused) {
      this.dispatcher.pause()
    }
  }

  playNext() {
    const song = this.queue[this.currentlyPlaying++]
    if (!song) return
    const stream = ytdl(song.url, {
      filter: 'audioonly',
    })
    this.broadcast.playStream(stream)
  }
}
