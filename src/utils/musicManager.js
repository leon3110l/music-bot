import ytdl from 'ytdl-core'

export default class MusicManager {
  constructor(client, voiceChannel) {
    if (!client) throw new Error('no client supplied')
    this.client = client
    this.queue = []
    this.connection = voiceChannel.connection
    this.broadcast = this.client.createVoiceBroadcast()
    if (!this.connection) {
      voiceChannel.join().then(conn => {
        this.connection = conn
        this.init()
      })
    } else {
      this.init()
    }
    this.currentlyPlaying = 0
  }

  init() {
    this.dispatcher = this.connection.playBroadcast(this.broadcast)
    this.dispatcher.on('end', () => {
      this.playNext() // play the next song in the queue
    })
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

  prev() {
    return this.currentlyPlaying--
  }

  next() {
    return this.currentlyPlaying++
  }

  play() {
    const song = this.queue[this.currentlyPlaying]
    if (!song) return
    const stream = ytdl(song.url, {
      filter: 'audioonly',
    })
    this.broadcast.playStream(stream)
  }

  playNext() {
    this.next()
    this.play()
  }

  playPrev() {
    this.prev()
    this.play()
  }
}
