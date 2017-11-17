// spotify:album:0BFzNaeaNv4mahOzwZFGHK
// spotify:track:1INksmStBpxdNlBzwGUvsg
// spotify:artist:2S5hlvw4CMtMGswFtfdK15
// spotify:user:leon3110l:playlist:10PQQ2oyZ9y8iQTciz479z

export default class SpotifyParser {
  parse = x => {
    const output = {}
    x = x
      .split('spotify:')
      .slice(1)
      .join('spotify:')
      .split(':')

    x.forEach((y, i) => {
      i % 2 === 0 ? (output[y] = x[i + 1]) : null
    })

    return output
  }
}
