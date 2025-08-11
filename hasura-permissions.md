# Hasura Permissions Configuration Guide

## For `chats` table:

### Select Permission (user role):
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

### Insert Permission (user role):
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
Column permissions: id, title, user_id, created_at, updated_at
Column presets: user_id = X-Hasura-User-Id

### Update Permission (user role):
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```
Column permissions: title, updated_at

### Delete Permission (user role):
```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

## For `messages` table:

### Select Permission (user role):
```json
{
  "chat": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  }
}
```

### Insert Permission (user role):
```json
{
  "chat": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  }
}
```
Column permissions: id, chat_id, content, is_bot, created_at, user_id
Column presets: user_id = X-Hasura-User-Id

## Relationships to configure:

### In `chats` table:
- Array relationship: messages -> public.messages using chat_id -> id

### In `messages` table:
- Object relationship: chat -> public.chats using chat_id -> id
- Object relationship: user -> auth.users using user_id -> id
