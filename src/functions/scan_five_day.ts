import { CHANNEL_IDS, tAPI } from 'src/constants'
import { CalendarEvent } from 'src/types'
import { formatDate, formatTime } from 'src/utils'
import { getNextNDaysEvents } from 'src/utils/events'
import { sendAlert } from 'src/utils/alert'
import { TelegramAPI } from 'src/apis/telegram/types'
import { setMessageIdByEvent } from 'src/utils/store'

const SCAN_RANGE = 5

function sendReminder(event: CalendarEvent) {
  const targetChannels = CHANNEL_IDS.filter((channel) =>
    channel.test ? channel.test(event) : true,
  )
  const messageText = `
*[🏸 Open Registration!]*
Hello! Kita bakal ada badmin ${SCAN_RANGE} hari lagi di:
    
📅 *Tanggal*: ${formatDate(event.getStartTime() as Date)}
⏰ *Waktu*: ${formatTime(event.getStartTime() as Date)} - ${formatTime(event.getEndTime() as Date)}
📍 *Tempat*: ${event.getLocation()}

React di message ini ya kalo mau join!
`

  for (const channel of targetChannels) {
    const message = tAPI(TelegramAPI.SEND_MESSAGE, {
      chat_id: channel.channel_id,
      text: messageText,
      parse_mode: 'Markdown',
    })
    setMessageIdByEvent(event, channel.channel_id, message.message_id)
  }
}

export function scanEvents5Days() {
  try {
    const events = getNextNDaysEvents(SCAN_RANGE)
    if (events.length) {
      for (const event of events) {
        sendReminder(event)
      }
    }
  } catch (e) {
    sendAlert(e as Error)
  }
}
