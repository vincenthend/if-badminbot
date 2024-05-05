import { ALERT_CHANNEL, tAPI } from 'src/constants'
import { TelegramAPI } from 'src/apis/telegram/types'

export function sendError(error: Error | string) {
  const message = `
🚨*ALERT*
Badmin Bot has thrown an error!

Error:
\`\`\`
${typeof error === 'string' ? error : error?.message}
\`\`\`
`
  tAPI(TelegramAPI.SEND_MESSAGE, { chat_id: ALERT_CHANNEL, text: message, parse_mode: 'Markdown' })
}

export function sendWarning(error: Error | string) {
  const message = `
⚠️*WARNING*
Warning from Badmin Bot
\`\`\`
${typeof error === 'string' ? error : error?.message}
\`\`\`
`
  tAPI(TelegramAPI.SEND_MESSAGE, { chat_id: ALERT_CHANNEL, text: message, parse_mode: 'Markdown' })
}
