import ytdl from 'ytdl-core'

export default class MusicManager {
  constructor(client, guild) {
    if (!client) throw new Error('no client supplied')
    if (!guild) throw new Error('no guild supplied')
    this.client = client
    this.guild = guild
    this.queue = []

    const voiceChannel = this.guild.channels
      .filter(x => x.type === 'voice')
      .first()

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

  get playing() {
    if (this.dispatcher) {
      return !this.dispatcher.paused
    }
    return false
  }

  get paused() {
    if (this.dispatcher) {
      return this.dispatcher.paused
    }
    return true
  }

  get currentSong() {
    return this.queue[this.currentlyPlaying]
  }

  init() {
    this.dispatcher = this.connection.playBroadcast(this.broadcast)
    this.dispatcher.stream.on('end', () => {
      console.log('stream end call')
      this.playNext() // play the next song in the queue
    })
  }

  add(song) {
    this.queue.push(song)
  }

  resume() {
    if (this.paused) {
      this.dispatcher.resume()
    }
  }

  pause() {
    if (this.playing) {
      this.dispatcher.pause()
    }
  }

  prev() {
    return this.currentlyPlaying--
  }

  next() {
    console.log('next')
    return this.currentlyPlaying++
  }

  play() {
    if (!this.currentSong) {
      console.log('no more songs', this.currentlyPlaying)
      return
    }
    const stream = ytdl(this.currentSong.url, {
      filter: 'audioonly',
    })
    console.log('added new stream')
    this.broadcast.playStream(stream)
  }

  skip() {
    this.dispatcher.stream.end()
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
