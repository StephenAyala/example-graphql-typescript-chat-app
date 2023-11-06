import { connection } from "./connection.js";
import { generateId } from "./ids.js";
import { Message } from "./types.js";
/**
 * Retrieves a reference to the 'message' table in the database.
 * @returns A knex query builder for the 'message' table.
 */
const getMessageTable = () => connection.table<Message>("message");

/**
 * Fetches all messages from the database ordered by creation date in ascending order.
 * @returns A promise that resolves to an array of Message entities.
 */
export async function getMessages(): Promise<Message[]> {
  return await getMessageTable().select().orderBy("createdAt", "asc");
}

/**
 * Creates a new message in the database.
 * @param user The username of the user who is creating the message.
 * @param text The text content of the message.
 * @returns A promise that resolves to the newly created Message entity.
 */
export async function createMessage(
  user: string,
  text: string
): Promise<Message> {
  const message: Message = {
    id: generateId(),
    user,
    text,
    createdAt: new Date().toISOString(),
  };
  await getMessageTable().insert(message);
  return message;
}
