// Import the connection from a local file.
import { connection } from "./connection.js";
import { UserEntity } from "./types.js";
// A function to get a reference to the 'user' table from the database.
// It uses generics to type the return of the table as 'UserEntity'.
const getUserTable = () => connection.table<UserEntity>("user");

/**
 * Retrieves a user from the database based on the username.
 * @param {string} username - The username of the user to retrieve.
 * @returns A promise that resolves to the user entity or undefined if not found.
 */
export async function getUser(username: string) {
  return await getUserTable().first().where({ username });
}
