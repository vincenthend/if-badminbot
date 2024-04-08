import * as Functions from './functions'
import { scanRange } from 'src/functions/scan_range'
import { sendAlert } from 'src/utils/alert'

const _scanEventsToday = Functions.scanEventsToday
const _scanEvents5Days = Functions.scanEvents5Days

function doPost(e: GoogleAppsScript.Events.DoPost) {
  try {
    const data: { message: { text: string; chat: { id: number } } } = JSON.parse(
      e.postData.contents,
    )

    switch (data.message.text) {
      case '/get_schedule':
        scanRange(data.message.chat.id)
        break
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(
      ContentService.MimeType.JSON,
    )
  } catch (e) {
    sendAlert(e as Error)
    return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}
