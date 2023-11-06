import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  addMessageMutation,
  messageAddedSubscription,
  messagesQuery,
} from "./queries";
import { Message } from "./types";

export function useAddMessage() {
  const [mutate] = useMutation<{ message: Message }>(addMessageMutation);

  /**
   * Sends a new message.
   * @param text The text of the message to be sent.
   * @returns The message that was sent.
   */
  const addMessage = async (text: string): Promise<Message> => {
    const { data } = await mutate({
      variables: { text },
    });
    return data!.message; // Note: This assumes that the mutation always returns a non-null message
  };

  return { addMessage };
}

/**
 * Custom hook to subscribe to new messages and fetch all messages using a GraphQL query and subscription.
 * @returns An object with a list of messages.
 */
export function useMessages() {
  const { data } = useQuery<{ messages: Message[] }>(messagesQuery);
  useSubscription<{ message: Message }>(messageAddedSubscription, {
    onData: ({ client, data }) => {
      const newMessage = data.data.message;
      client.cache.updateQuery<{ messages: Message[] }>(
        { query: messagesQuery },
        (cachedData) => {
          if (cachedData && cachedData.messages) {
            return { messages: [...cachedData.messages, newMessage] };
          }
          return { messages: [newMessage] }; // Fallback in case cached data is empty
        }
      );
    },
  });

  return {
    messages: data?.messages ?? [],
  };
}
