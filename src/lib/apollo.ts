import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { nhost } from './nhost';

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: nhost.graphql.getUrl(),
  // Disable automatic persisted queries
  useGETForQueries: false,
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: nhost.graphql.wsUrl,
    connectionParams: async () => {
      const accessToken = await nhost.auth.getAccessToken();
      return {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    },
  })
);

// Auth link to add authorization header
const authLink = setContext(async (_, { headers }) => {
  const accessToken = await nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
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
  // Disable automatic persisted queries to prevent "PersistedQueryNotSupported" error
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
  // Explicitly disable persisted queries
  ssrMode: false,
});