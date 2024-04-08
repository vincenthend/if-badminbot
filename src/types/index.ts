export type CalendarEvent = GoogleAppsScript.Calendar.CalendarEvent

export type ChannelData = {
  test?: (event: CalendarEvent) => boolean
  channel_id: number
}
