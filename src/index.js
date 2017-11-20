import Discord from 'discord.js'

import { token, prefix } from './conf'
import MessageHandler from './utils/messageHandler'
import ServerManager from './utils/serverManager'
import MusicManager from './utils/musicManager'
import SpotifyParser from './utils/spotifyParser'

// seperate command imports
import Help from './commands/help'

const bot = new Discord.Client()
const spotifyParser = new SpotifyParser()
const serverManager = new ServerManager(bot, { MusicManager })
const handler = new MessageHandler(bot, prefix, {
  serverManager,
  spotifyParser,
})

bot.on('ready', () => {
  bot.generateInvite(['SEND_MESSAGES', 'MENTION_EVERYONE']).then(link => {
    console.log(`Generated bot invite link: ${link}`)
  })
  bot.user.setGame(prefix + 'help for help')
})

handler.set(Help)

bot.on('message', message => {
  handler.handle(message)
})

bot.login(token)
