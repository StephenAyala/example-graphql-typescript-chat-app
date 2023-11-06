import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
import { useServer as useWsServer } from "graphql-ws/lib/use/ws";
import { createServer as createHttpServer } from "node:http";
import { WebSocketServer } from "ws";
import { authMiddleware, decodeToken, handleLogin } from "./auth.js";
import { resolvers } from "./resolvers.js";
import { GraphQLSchema } from "graphql";
import { Request } from "express-jwt";

// Define the port on which the server will listen.
const PORT = parseInt(process.env.PORT) || 9000;

// Initialize the Express application.
const app = express();
// Enable CORS with default settings and parse JSON request bodies.
app.use(cors(), express.json());

// Define a login route that uses the handleLogin function to authenticate users.
app.post("/login", handleLogin);

/**
 * Retrieves HTTP context for an incoming HTTP request.
 * @param { Request } req - The incoming HTTP request object.
 * @returns An object containing the user information if authenticated.
 */
function getHttpContext({ req }: { req: Request }) {
  if (req.auth) {
    return { user: req.auth.sub };
  }
  return {};
}

/**
 * Retrieves WebSocket context for a new WebSocket connection.
 * @param { Record<string, unknown> } connectionParams - Parameters passed in the connection.
 * @returns An object containing the user information if authenticated.
 */
interface WsContextArgs {
  connectionParams?: Record<string, unknown>;
}

function getWsContext({ connectionParams }: WsContextArgs) {
  const accessToken = connectionParams?.accessToken as string | undefined;
  if (accessToken) {
    const payload = decodeToken(accessToken);
    return { user: payload.sub };
  }
  return {};
}

// Load the GraphQL schema definition from a file.
const typeDefs: string = await readFile("./schema.graphql", "utf8");
// Create an executable GraphQL schema from type definitions and resolvers.
const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

// Create an instance of ApolloServer with the constructed schema.
const apolloServer = new ApolloServer({ schema });
// Start the Apollo server before attaching middleware to the Express app.
await apolloServer.start();

// Apply the Apollo GraphQL middleware and the authentication middleware to the Express app.
app.use(
  "/graphql",
  authMiddleware,
  apolloMiddleware(apolloServer, {
    //@ts-expect-error
    context: getHttpContext,
  })
);

// Create an HTTP server from the Express app.
const httpServer = createHttpServer(app);
// Create a WebSocket server instance, specifying the server and the path.
const wsServer: WebSocketServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
// Apply the WebSocket server middleware to handle GraphQL subscriptions.
useWsServer({ schema, context: getWsContext }, wsServer);

// Start the HTTP server and log the URLs where the server is running.
httpServer.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
