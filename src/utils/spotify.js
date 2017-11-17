import SpotifyWebApi from 'spotify-web-api-node'

import { spotify_secret, spotify_id } from '../conf'

const spotifyApi = new SpotifyWebApi({
  clientId: spotify_id,
  clientSecret: spotify_secret,
})

// Retrieve an access token. (doesn't work btw)
// TODO: fix this
spotifyApi.clientCredentialsGrant().then(
  data => {
    console.log('The access token expires in ' + data.body['expires_in'])
    console.log('The access token is ' + data.body['access_token'])

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token'])
    spotifyApi.setRefreshToken(data.body['refresh_token'])
    setInterval(() => {
      spotifyApi.refreshAccessToken().then(
        data => {
          console.log('The access token has been refreshed!')

          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token'])
        },
        err => {
          console.log('Could not refresh access token', err)
        },
      )
    }, 3550000)
  },
  err => {
    console.log('Something went wrong when retrieving an access token', err)
  },
)

export default spotifyApi
