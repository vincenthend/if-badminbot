import { CHANNEL_IDS, tAPI } from 'src/constants'
import { CalendarEvent } from 'src/types'
import { formatDate, formatTime } from 'src/utils'
import { getNextNDaysEvents } from 'src/utils/events'
import { sendAlert } from 'src/utils/alert'
import { TelegramAPI } from 'src/apis/telegram/types'

function sendReminder(event: CalendarEvent) {
  const response = Maps.newGeocoder().geocode(event.getLocation())
  const result = response.results[0]

  // send message
  const targetChannels = CHANNEL_IDS.filter((channel) =>
    channel.test ? channel.test(event) : true,
  )
  const messageText = `
*[🏸 Badmin Today!]*
Reminder hari ini bakal ada badmin di:
  
📅 *Tanggal*: ${formatDate(event.getStartTime() as Date)}
⏰ *Waktu*: ${formatTime(event.getStartTime() as Date)} - ${formatTime(event.getEndTime() as Date)}
📍 *Tempat*: ${event.getLocation()}


`

  for (const channel of targetChannels) {
    tAPI(TelegramAPI.SEND_MESSAGE, {
      chat_id: channel.channel_id,
      text: messageText,
      parse_mode: 'Markdown',
    })

    tAPI(TelegramAPI.SEND_VENUE, {
      chat_id: channel.channel_id,
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      title: event.getLocation(),
      google_place_id: result.place_id,
    })
  }
}

export function scanEventsToday() {
  try {
    const events = getNextNDaysEvents()
    if (events.length) {
      for (const event of events) {
        sendReminder(event)
      }
    }
  } catch (e) {
    sendAlert(e as Error)
  }
}
