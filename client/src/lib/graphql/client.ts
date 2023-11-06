import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  split,
  NormalizedCacheObject,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
// import { DocumentNode } from "graphql";
import { createClient as createWsClient } from "graphql-ws";
import { getAccessToken } from "../auth";

// Auth link that attaches the access token to each request as a Bearer token
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

// HTTP link for regular queries and mutations
const httpLink = createHttpLink({
  uri: "http://localhost:9000/graphql",
});

// Concatenate the auth link with the http link
const httpAuthLink = concat(authLink, httpLink);

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createWsClient({
    url: "ws://localhost:9000/graphql",
    connectionParams: () => ({ accessToken: getAccessToken() }),
  })
);

// Apollo client instance
export const apolloClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    link: split(
      // Split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpAuthLink
    ),
    cache: new InMemoryCache(),
  });

/**
 * Checks if a given GraphQL operation is a subscription.
 *
 * @param operation - The GraphQL operation to check.
 * @returns A boolean indicating whether the operation is a subscription.
 */
// function isSubscription(operation: { query: DocumentNode }): boolean {
//   const definition = getMainDefinition(operation.query);
//   return (definition.kind === "OperationDefinition" &&
//     definition.operation === "subscription") as boolean;
// }
