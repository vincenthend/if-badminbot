import { CHANNEL_IDS, tAPI } from 'src/constants'
import { CalendarEvent } from 'src/types'
import { getEventsRegistrationMsg, getNextNDaysEvents } from 'src/utils/events'
import { sendError } from 'src/utils/alert'
import { TelegramAPI } from 'src/apis/telegram/types'

const SCAN_RANGES = [7, 3]

function sendReminder(event: CalendarEvent, range: number) {
  const targetChannels = CHANNEL_IDS.filter((channel) =>
    channel.test ? channel.test(event) : true,
  )
  const messageText = `
*[🏸 Registration Reminder!]*
Hallo! Bakal ada badmin dalam ${range} hari lho!
Jangan lupa register di message sebelumnya ya~
`

  targetChannels
    .map((channel) => getEventsRegistrationMsg(event, channel))
    .forEach(([channelId, messageId]) => {
      tAPI(TelegramAPI.SEND_MESSAGE, {
        chat_id: channelId,
        text: messageText,
        parse_mode: 'Markdown',
        reply_parameters: {
          chat_id: messageId,
          allow_sending_without_reply: false,
        },
      })
    })
}

export function sendRegisterReminder() {
  try {
    SCAN_RANGES.forEach((range) => {
      const events = getNextNDaysEvents(range)
      if (events.length) {
        for (const event of events) {
          sendReminder(event, range)
        }
      }
    })
  } catch (e) {
    sendError(e as Error)
  }
}
