// Import the knex library, which is a SQL query builder for JavaScript.
// This library helps in building queries for SQL databases, and it supports
// multiple databases like PostgreSQL, MySQL, SQLite, and others.
import knex from "knex";

// Create a connection to the database using the knex configuration.
// This sets up a connection to a SQLite3 database using the 'better-sqlite3' driver,
// which is a high-performance driver for Node.js that is designed to be simple
// and straightforward to use.
export const connection = knex({
  // Specify the client to use with knex, in this case 'better-sqlite3' for SQLite.
  client: "better-sqlite3",
  // Define the connection parameters. For SQLite, this is primarily the path to the
  // database file.
  connection: {
    filename: "./data/db.sqlite3", // Location of the SQLite database file.
  },
  // Set `useNullAsDefault` to `true` to automatically use `null` for
  // any columns not provided in an insert.
  useNullAsDefault: true,
});
