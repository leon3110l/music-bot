const infoDefault = {
  title: '',
  album: '',
  artists: [],
  cover: '',
}

export default class Song {
  constructor(url, info = infoDefault) {
    if (!url) throw new Error('no url supplied!')
    this.url = url
    this.info = info
  }

  // TODO add create embed, create an image with the canvas to make a sort of info thingy to show the song info
}
