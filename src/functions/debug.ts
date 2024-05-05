import { ALERT_CHANNEL, tAPI } from 'src/constants'
import { getNextNDaysEvents } from 'src/utils/events'
import { sendError } from 'src/utils/alert'
import { TelegramAPI } from 'src/apis/telegram/types'

export function debugListEvents() {
  try {
    const events = getNextNDaysEvents(0, 14)
    const eventList = events
      .map((event) => `- ${event.getId()} - ${event.getStartTime().getTime()}`)
      .join('\n')
    tAPI(TelegramAPI.SEND_MESSAGE, {
      chat_id: ALERT_CHANNEL,
      text: `Events List: 

${eventList}
    `,
      parse_mode: 'Markdown',
    })
  } catch (e) {
    sendError(e as Error)
  }
}
