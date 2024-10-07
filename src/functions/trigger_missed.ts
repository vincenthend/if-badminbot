import { getNextNDaysEvents } from 'src/utils/events'
import { sendError } from 'src/utils/alert'
import { sendReminder } from 'src/functions/scan_n_day'

export function triggerMissedReminder() {
  try {
    const events = getNextNDaysEvents(0, 14)
    if (events.length) {
      for (const event of events) {
        sendReminder(event)
      }
    }
  } catch (e) {
    sendError(e as Error)
  }
}
