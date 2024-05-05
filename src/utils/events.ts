import { CALENDAR_ID } from 'src/constants'
import { CalendarEvent, ChannelData } from 'src/types'
import { getMessageIdByEvent } from 'src/utils/store'
import { formatDate } from 'src/utils/index'
import { sendWarning } from 'src/utils/alert'

export function getNextNDaysEvents(start = 0, end: number = start): CalendarEvent[] {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID)
  const nextNDaysStart = new Date()
  nextNDaysStart.setDate(nextNDaysStart.getDate() + start)
  nextNDaysStart.setHours(0, 0, 0, 0)

  const nextNDaysEnd = new Date()
  nextNDaysEnd.setDate(nextNDaysEnd.getDate() + end)
  nextNDaysEnd.setHours(23, 59, 59, 999)

  return calendar.getEvents(nextNDaysStart, nextNDaysEnd)
}

export function getEventsRegistrationMsg(event: CalendarEvent, channel: ChannelData) {
  const messageId = getMessageIdByEvent(event, channel.channel_id)
  if (!messageId)
    sendWarning(`Failed to find message to reply to for event:
Event: ${event.getTitle()} - ${formatDate(event.getStartTime() as Date)}(${event.getId()}) 
Channel: ${channel.channel_id} (${channel.channel_name})
`)
  return [channel.channel_id, messageId]
}
