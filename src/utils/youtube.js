const yt = require('googleapis').youtube('v3')

import { youtube_token } from '../conf'

function ytsearch(opt) {
  return new Promise((resolve, reject) => {
    yt.search.list(
      {
        part: 'snippet',
        auth: youtube_token,
        maxResults: 10,
        type: 'video',
        ...opt,
      },
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      },
    )
  })
}

export default ytsearch
