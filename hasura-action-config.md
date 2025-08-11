# Hasura Action Configuration

## Action Definition:

Name: `sendMessage`

### Action Definition (GraphQL):
```graphql
type Mutation {
  sendMessage(chat_id: uuid!, message: String!): SendMessageOutput
}
```

### Custom Types:
```graphql
type SendMessageOutput {
  success: Boolean!
  message: String!
  response: String
}
```

### Handler (Webhook URL):
Your n8n webhook URL: `https://your-n8n-instance.com/webhook/chatbot`

### Headers:
```json
{
  "Content-Type": "application/json"
}
```

### Forward Client Headers:
- authorization
- x-hasura-user-id
- x-hasura-role

### Permissions:
Role: `user`
No additional permissions needed (will inherit from session variables)

## Request Transform:
The action will send this payload to n8n:
```json
{
  "input": {
    "chat_id": "{{$body.input.chat_id}}",
    "message": "{{$body.input.message}}"
  },
  "session_variables": {
    "x-hasura-user-id": "{{$body.session_variables['x-hasura-user-id']}}",
    "x-hasura-role": "{{$body.session_variables['x-hasura-role']}}"
  }
}
```
