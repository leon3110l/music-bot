import Discord from 'discord.js'

import { token, prefix } from './conf'
import MessageHandler from './utils/messageHandler'

// seperate command imports
import Help from './commands/help'

const bot = new Discord.Client()
const handler = new MessageHandler(bot, prefix)

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
