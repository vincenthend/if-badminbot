import { tAPI } from 'src/constants'
import { CalendarEvent } from 'src/types'
import { formatDate, formatTime } from 'src/utils'
import { getNextNDaysEvents } from 'src/utils/events'
import { sendError } from 'src/utils/alert'
import { TelegramAPI } from 'src/apis/telegram/types'

function sendReminder(events: CalendarEvent[], channelId: number) {
  let messageText

  if (!events.length) {
    messageText = `
*[Badmin Schedule]*
Hmm belum ada jadwal badmin dalam seminggu ke depan 🤔   
`
  } else {
    messageText = `
*[🏸 Badmin Schedule]*
Ini jadwal badmin selanjutnya~ 

${events
  .map(
    (event) => `*${formatDate(event.getStartTime() as Date)}*
⏰ *Waktu*: ${formatTime(event.getStartTime() as Date)} - ${formatTime(event.getEndTime() as Date)}
📍 *Tempat*: ${event.getLocation()}`,
  )
  .join('\n')}
`
  }

  tAPI(TelegramAPI.SEND_MESSAGE, {
    chat_id: channelId,
    text: messageText,
    parse_mode: 'Markdown',
  })
}

export function scanRange(channelId: number) {
  try {
    const events = getNextNDaysEvents(0, 7)
    sendReminder(events, channelId)
  } catch (e) {
    sendError(e as Error)
  }
}
