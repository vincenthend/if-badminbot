import { CalendarEvent, ChannelData } from 'src/types'
import { createTelegramRequest } from 'src/apis/telegram'

const TELEGRAM_TOKEN = PropertiesService.getScriptProperties().getProperty('TELEGRAM_TOKEN')
export const CALENDAR_ID =
  '09ed05dae206a55fa5a1e3ff733a49fb161887b20a59e7ffcce91d85259a843d@group.calendar.google.com'

export const SPREADSHEET_ID = '1cf5yMNXceKOq5F_obU-8dPzk6bH6PTDEr6Aa4PG6yGU'

export const ALERT_CHANNEL = -4042384933
export const CHANNEL_IDS: ChannelData[] = [
  {
    // TEST ENV
    channel_id: ALERT_CHANNEL,
    channel_name: 'ALERT',
  },
  {
    // ALUMNI IF
    test: (event: CalendarEvent) => {
      const title = event.getTitle()
      return !title.toLowerCase().includes('reserved')
    },
    channel_id: -4052020064,
    channel_name: 'BADMIN_IF',
  },
]

export const tAPI = createTelegramRequest(TELEGRAM_TOKEN)
