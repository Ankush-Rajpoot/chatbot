import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || 'https://your-hasura-endpoint.hasura.app/v1/graphql',
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_HASURA_WS_ENDPOINT || 'wss://your-hasura-endpoint.hasura.app/v1/graphql',
    connectionParams: () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('nhostAccessToken')}`,
      },
    }),
  })
);

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('nhostAccessToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Split based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Chat: {
        fields: {
          messages: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});