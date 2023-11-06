import { Request, Response } from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getUser } from "./db/users.js";
import { UserEntity } from "./db/types.js";

// The secret key used for signing and verifying JWT tokens.
// It's assumed to be a Base64-encoded string that needs to be converted to a Buffer.
const secret = Buffer.from("+Z3zPGXY7v/0MoMm1p8QuHDGGVrhELGd", "base64");

/**
 * Middleware to authenticate JWT tokens in incoming requests.
 * It allows requests without credentials but includes the user identity in req.auth if available.
 */
export const authMiddleware = expressjwt({
  algorithms: ["HS256"],
  credentialsRequired: false,
  secret,
});

/**
 * Decodes and verifies a JWT token using the secret key.
 *
 * @param token - The JWT token to decode.
 * @returns The decoded token payload if verification is successful.
 */
export function decodeToken(token: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

/**
 * Handles user login by checking credentials and issuing a JWT token upon successful authentication.
 *
 * @param req - The request object, expected to contain username and password.
 * @param res - The response object used to send back the JWT token or a 401 status.
 */
export async function handleLogin(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  const user: UserEntity | undefined = await getUser(username);

  // Check the credentials and respond accordingly.
  if (!user || user.password !== password) {
    // Send a 401 Unauthorized response if authentication fails.
    res.sendStatus(401);
  } else {
    // Create the claims and generate a token if authentication is successful.
    const claims = { sub: username };
    const token = jwt.sign(claims, secret, { algorithm: "HS256" });

    // Send the token back to the client.
    res.json({ token });
  }
}
