import { CALENDAR_ID } from 'src/constants'
import { CalendarEvent } from 'src/types'

export function getNextNDaysEvents(start = 0, end: number = start): CalendarEvent[] {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID)
  const nextNDaysStart = new Date()
  nextNDaysStart.setDate(nextNDaysStart.getDate() + start)
  nextNDaysStart.setHours(0, 0, 0, 0)

  const nextNDaysEnd = new Date()
  nextNDaysEnd.setDate(nextNDaysEnd.getDate() + end)
  nextNDaysEnd.setHours(23, 59, 59, 999)

  const events = calendar.getEvents(nextNDaysStart, nextNDaysEnd)
  return events
}
