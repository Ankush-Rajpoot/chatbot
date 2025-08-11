import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
      updated_at
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($chatId: uuid!, $content: String!, $isBot: Boolean = false) {
    insert_messages_one(object: { 
      chat_id: $chatId, 
      content: $content, 
      is_bot: $isBot 
    }) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`;

export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chatId: uuid!, $message: String!) {
    sendMessage(chat_id: $chatId, message: $message) {
      success
      message
      response
    }
  }
`;

export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($id: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
      title
      updated_at
    }
  }
`;

export const DELETE_CHAT = gql`
  mutation DeleteChat($id: uuid!) {
    delete_chats_by_pk(id: $id) {
      id
    }
  }
`;