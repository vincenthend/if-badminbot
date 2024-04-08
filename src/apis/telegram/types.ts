/* eslint-disable @typescript-eslint/naming-convention */
export enum TelegramAPI {
  SEND_MESSAGE = 'sendMessage',
  SET_MESSAGE_REACTION = 'setMessageReaction',
  SEND_VENUE = 'sendVenue',
}

export interface SendMessageRequest {
  chat_id: number
  text: string
  parse_mode: 'Markdown'
}

export interface SendMessageResponse {
  message_id: number
  from: MessageUserData
  chat: ChatData
  date: number
  text: string
}

export interface MessageUserData {
  id: number
  is_bot: boolean
  first_name: string
  username: string
}

export interface ChatData {
  id: number
  title: string
  type: string
  all_members_are_administrators: boolean
}

export interface SendVenueRequest {
  chat_id: number
  message_id?: number
  address: string
  latitude: number
  longitude: number
  title?: string
  google_place_id?: number
}

export interface SetMessageReactionRequest {
  chat_id: number
  message_id: number
  reaction: { type: 'emoji'; emoji: string }[]
}
