function createTelegramRequest(token) {
  function telegramAPI(resource, params) {
    const url = `https://api.telegram.org/bot${token}/${resource}`;
    const resp = UrlFetchApp.fetch(url, {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      payload: JSON.stringify(params)
    });
    return JSON.parse(resp.getContentText()).result;
  }
  return telegramAPI;
}

const TELEGRAM_TOKEN = PropertiesService.getScriptProperties().getProperty('TELEGRAM_TOKEN');
const CALENDAR_ID = '09ed05dae206a55fa5a1e3ff733a49fb161887b20a59e7ffcce91d85259a843d@group.calendar.google.com';
const SPREADSHEET_ID = '1cf5yMNXceKOq5F_obU-8dPzk6bH6PTDEr6Aa4PG6yGU';
const ALERT_CHANNEL = -4042384933;
const CHANNEL_IDS = [{
  // TEST ENV
  channel_id: ALERT_CHANNEL
}, {
  // ALUMNI IF
  test: event => {
    const title = event.getTitle();
    return !title.toLowerCase().includes('reserved');
  },
  channel_id: -4052020064
}];
const tAPI = createTelegramRequest(TELEGRAM_TOKEN);

function formatTime(time) {
  return `${time.getHours().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })}:${time.getMinutes().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })}`;
}
function formatDate(time) {
  return `${time.toLocaleString('id-ID', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })}`;
}

function getNextNDaysEvents(start = 0, end = start) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  const nextNDaysStart = new Date();
  nextNDaysStart.setDate(nextNDaysStart.getDate() + start);
  nextNDaysStart.setHours(0, 0, 0, 0);
  const nextNDaysEnd = new Date();
  nextNDaysEnd.setDate(nextNDaysEnd.getDate() + end);
  nextNDaysEnd.setHours(23, 59, 59, 999);
  const events = calendar.getEvents(nextNDaysStart, nextNDaysEnd);
  return events;
}

/* eslint-disable @typescript-eslint/naming-convention */
let TelegramAPI = /*#__PURE__*/function (TelegramAPI) {
  TelegramAPI["SEND_MESSAGE"] = "sendMessage";
  TelegramAPI["SET_MESSAGE_REACTION"] = "setMessageReaction";
  TelegramAPI["SEND_VENUE"] = "sendVenue";
  return TelegramAPI;
}({});

function sendAlert(error) {
  const message = `
🚨*ALERT*
Badmin Bot has thrown an error!

Error:
\`\`\`
${typeof error === 'string' ? error : error?.message}
\`\`\`
`;
  tAPI(TelegramAPI.SEND_MESSAGE, {
    chat_id: ALERT_CHANNEL,
    text: message,
    parse_mode: 'Markdown'
  });
}

function sendReminder$2(event) {
  const response = Maps.newGeocoder().geocode(event.getLocation());
  const result = response.results[0];

  // send message
  const targetChannels = CHANNEL_IDS.filter(channel => channel.test ? channel.test(event) : true);
  const messageText = `
*[🏸 Badmin Today!]*
Reminder hari ini bakal ada badmin di:
  
📅 *Tanggal*: ${formatDate(event.getStartTime())}
⏰ *Waktu*: ${formatTime(event.getStartTime())} - ${formatTime(event.getEndTime())}
📍 *Tempat*: ${event.getLocation()}


`;
  for (const channel of targetChannels) {
    tAPI(TelegramAPI.SEND_MESSAGE, {
      chat_id: channel.channel_id,
      text: messageText,
      parse_mode: 'Markdown'
    });
    tAPI(TelegramAPI.SEND_VENUE, {
      chat_id: channel.channel_id,
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      title: event.getLocation(),
      google_place_id: result.place_id
    });
  }
}
function scanEventsToday() {
  try {
    const events = getNextNDaysEvents();
    if (events.length) {
      for (const event of events) {
        sendReminder$2(event);
      }
    }
  } catch (e) {
    sendAlert(e);
  }
}

const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
var SpreadsheetPage = /*#__PURE__*/function (SpreadsheetPage) {
  SpreadsheetPage["MESSAGE_ID"] = "msg_id";
  return SpreadsheetPage;
}(SpreadsheetPage || {});
function setMessageIdByEvent(event, channelId, messageId) {
  const sheet = spreadsheet.getSheetByName(SpreadsheetPage.MESSAGE_ID);
  if (sheet) {
    sheet.insertRowBefore(1).getRange(1, 1, 1, 2).setValues([[`${event.getId()}_${channelId}`, messageId]]);
    return;
  }
  throw new Error('Message ID sheet is missing');
}

function sendReminder$1(event) {
  const targetChannels = CHANNEL_IDS.filter(channel => channel.test ? channel.test(event) : true);
  const messageText = `
*[🏸 Open Registration!]*
Hello! Kita bakal ada badmin 5 hari lagi di:
    
📅 *Tanggal*: ${formatDate(event.getStartTime())}
⏰ *Waktu*: ${formatTime(event.getStartTime())} - ${formatTime(event.getEndTime())}
📍 *Tempat*: ${event.getLocation()}

React di message ini ya kalo mau join!
`;
  for (const channel of targetChannels) {
    const message = tAPI(TelegramAPI.SEND_MESSAGE, {
      chat_id: channel.channel_id,
      text: messageText,
      parse_mode: 'Markdown'
    });
    setMessageIdByEvent(event, channel.channel_id, message.message_id);
  }
}
function scanEvents5Days() {
  try {
    const events = getNextNDaysEvents(5, 7);
    if (events.length) {
      for (const event of events) {
        sendReminder$1(event);
      }
    }
  } catch (e) {
    sendAlert(e);
  }
}

function sendReminder(events, channelId) {
  let messageText;
  if (!events.length) {
    messageText = `
*[Badmin Schedule]*
Hmm belum ada jadwal badmin dalam seminggu ke depan 🤔   
`;
  } else {
    messageText = `
*[🏸 Badmin Schedule]*
Ini jadwal badmin selanjutnya~ 

${events.map(event => `*${formatDate(event.getStartTime())}*
⏰ *Waktu*: ${formatTime(event.getStartTime())} - ${formatTime(event.getEndTime())}
📍 *Tempat*: ${event.getLocation()}`).join('\n')}
`;
  }
  tAPI(TelegramAPI.SEND_MESSAGE, {
    chat_id: channelId,
    text: messageText,
    parse_mode: 'Markdown'
  });
}
function scanRange(channelId) {
  try {
    const events = getNextNDaysEvents(0, 7);
    sendReminder(events, channelId);
  } catch (e) {
    sendAlert(e);
  }
}

const _scanEventsToday = scanEventsToday;
const _scanEvents5Days = scanEvents5Days;
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    switch (data.message.text) {
      case '/get_schedule':
        scanRange(data.message.chat.id);
        break;
    }
    return ContentService.createTextOutput(JSON.stringify({
      success: true
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    sendAlert(e);
    return ContentService.createTextOutput(JSON.stringify({
      success: false
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
