import { SPREADSHEET_ID } from 'src/constants'
import { CalendarEvent } from 'src/types'

const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)

enum SpreadsheetPage {
  MESSAGE_ID = 'msg_id',
}

export function getMessageIdByEvent(event: CalendarEvent, channelId: number) {
  const sheet = spreadsheet.getSheetByName(SpreadsheetPage.MESSAGE_ID)

  if (sheet) {
    const range = sheet?.getRange(1, 1, sheet.getLastRow(), 2).getValues()
    const result = range.find(([eventId]) => eventId === `${event.getId()}_${channelId}`)

    return result ? Number(result[1]) : null
  }

  throw new Error('Message ID sheet is missing')
}

export function setMessageIdByEvent(
  event: CalendarEvent,
  channelId: number,
  messageId: string | number,
) {
  const sheet = spreadsheet.getSheetByName(SpreadsheetPage.MESSAGE_ID)

  if (sheet) {
    sheet
      .insertRowBefore(1)
      .getRange(1, 1, 1, 3)
      .setValues([[`${event.getId()}_${channelId}`, messageId, event.getEndTime().getTime()]])
    return
  }

  throw new Error('Message ID sheet is missing')
}
