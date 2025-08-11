import { gql } from '@apollo/client';

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages(order_by: { created_at: desc }, limit: 1) {
        id
        content
        is_bot
        created_at
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`;

export const GET_CHAT = gql`
  query GetChat($id: uuid!) {
    chats_by_pk(id: $id) {
      id
      title
      created_at
      updated_at
    }
  }
`;