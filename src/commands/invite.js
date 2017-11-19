import Command from '../structures/command'

export default class Invite extends Command {
  static info = {
    name: 'invite',
    triggers: ['invite', 'i'],
    description: 'generates a bot invite link',
  }

  run(message, parts) {
    this.client
      .generateInvite(['SEND_MESSAGES', 'MENTION_EVERYONE'])
      .then(link => message.reply(`here is the invite link: ${link}`))
  }
}
