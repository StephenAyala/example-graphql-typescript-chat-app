export interface Message {
  id: string;
  user: string;
  text: string;
}
export interface MessageListProps {
  user: string;
  messages: Message[];
}

export interface MessageRowProps {
  user: string;
  message: Message;
}
