import Command from '../structures/command'
import ytsearch from '../utils/youtube'
import musicFilter from '../utils/musicFilter'

import { yt_url } from '../conf'

export class Yt extends Command {
  static info = {
    name: 'youtube search',
    triggers: ['yt', 'youtube'],
    description: 'search for stuff on youtube',
  }

  run(message, parts) {
    if (!parts[1]) return

    const q = parts.slice(1).join(' ')
    ytsewarch({ q }).then(res => {
      const { items } = res
      let msg = 'found\r\n\r\n'
      for (let x of items.filter(musicFilter(q))) {
        msg += `${yt_url}${x.id.videoId}\r\n`
        break
      }
      message.reply(msg)
    })
  }
}

export class YtMultiple extends Command {
  static info = {
    name: 'youtube search',
    triggers: ['yt:m', 'yt:multiple', 'youtube:multiple', 'youtube:m'],
    description: 'search for stuff on youtube with multiple results',
  }

  run(message, parts) {
    if (parts[1]) {
      ytsearch({ q: parts.slice(1).join(' ') }).then(res => {
        const { items } = res
        let msg = 'found\r\n\r\n'
        items.forEach((x, i) => {
          msg += `${i + 1}. ${yt_url}${x.id.videoId}\r\n`
        })
        msg += ''
        message.reply(msg)
      })
    }
  }
}
