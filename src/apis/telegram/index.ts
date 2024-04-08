import {
  SendMessageRequest,
  SendMessageResponse,
  SendVenueRequest,
  SetMessageReactionRequest,
  TelegramAPI,
} from 'src/apis/telegram/types'

export function createTelegramRequest(token: string) {
  function telegramAPI(
    resource: TelegramAPI.SEND_MESSAGE,
    params: SendMessageRequest,
  ): SendMessageResponse
  function telegramAPI(
    resource: TelegramAPI.SEND_VENUE,
    params: SendVenueRequest,
  ): SendMessageResponse
  function telegramAPI(
    resource: TelegramAPI.SET_MESSAGE_REACTION,
    params: SetMessageReactionRequest,
  ): SendMessageResponse
  function telegramAPI(resource: string, params: Record<string, any>): Record<string, any> {
    const url = `https://api.telegram.org/bot${token}/${resource}`
    const resp = UrlFetchApp.fetch(url, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify(params),
    })

    return (JSON.parse(resp.getContentText()) as { ok: boolean; result: Record<string, any> })
      .result
  }

  return telegramAPI
}
