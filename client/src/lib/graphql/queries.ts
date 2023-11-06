import { gql } from "@apollo/client";
import { Message } from "./types";

export const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      user
      text
    }
  }
`;

export interface MessagesQueryResult {
  messages: Array<Message>;
}

export const addMessageMutation = gql`
  mutation AddMessageMutation($text: String!) {
    message: addMessage(text: $text) {
      id
      user
      text
    }
  }
`;

export interface AddMessageMutationVariables {
  text: string;
}

export interface AddMessageMutationResult {
  message: Message;
}

export const messageAddedSubscription = gql`
  subscription MessageAddedSubscription {
    message: messageAdded {
      id
      user
      text
    }
  }
`;

export interface MessageAddedSubscriptionResult {
  message: Message;
}
