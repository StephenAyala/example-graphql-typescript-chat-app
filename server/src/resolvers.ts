import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { createMessage, getMessages } from "./db/messages.js";
import { IResolvers } from "@graphql-tools/utils";
import { Message } from "./db/types.js";
// Define a new instance of PubSub for handling subscription-related events.
//
// The PubSub class is not recommended for production environments,
// because it's an in-memory event system that only supports a single server instance.
const pubSub = new PubSub();

// Type definitions for the context of the GraphQL operations.
interface Context {
  user: string | null;
}

// Type definitions for the arguments of the addMessage mutation.
interface AddMessageArgs {
  text: string;
}

// Resolver map for GraphQL operations.
export const resolvers: IResolvers<any, Context> = {
  Query: {
    // Resolver for the 'messages' query.
    messages: (
      _root: unknown,
      _args: unknown,
      context: Context
    ): Promise<Message[]> => {
      if (!context.user) throw unauthorizedError();
      return getMessages();
    },
  },

  Mutation: {
    // Resolver for the 'addMessage' mutation.
    addMessage: async (
      _root: unknown,
      { text }: AddMessageArgs,
      context: Context
    ): Promise<Message> => {
      if (!context.user) throw unauthorizedError();
      const message = await createMessage(context.user, text);
      // Publish the 'MESSAGE_ADDED' event to the subscription.
      pubSub.publish("MESSAGE_ADDED", { messageAdded: message });
      return message;
    },
  },

  Subscription: {
    // Resolver for the 'messageAdded' subscription.
    messageAdded: {
      subscribe: (_root: unknown, _args: unknown, context: Context) => {
        if (!context.user) throw unauthorizedError();
        // Return an async iterator for the 'MESSAGE_ADDED' event.
        return pubSub.asyncIterator("MESSAGE_ADDED");
      },
    },
  },
};

// Throws a GraphQLError for unauthorized access.
function unauthorizedError(): GraphQLError {
  return new GraphQLError("Not authenticated", {
    extensions: { code: "UNAUTHORIZED" },
  });
}
