import * as jose from 'jose';
import fs from 'fs';

/**
 * Example of how to generate JWT (JSON Web Token).
 *
 * Following things are assumed:
 * 1. Server code and logic is already implemented.
 * 2. Database where users data are stored already exists.
 * 3. JWT will be signed using RS256 algorithm.
 * 4. RSA keypair is already created and stored.
 */

/**
 * On Authentication server private key is used to sign the JWT.
 * Notice that public key is not used at all.
 */
const PRIVATE_KEY = fs.readFileSync('./keys/private.pem', { encoding: 'utf-8' })

/**
 * Authentication server has received HTTP POST request from the Application client.
 * 1. Server will extract user credentials, username and password, from the request's body.
 * 2. Server will query database to find the user with provided credentials.
 *
 * When user is found, JWT Payload can be created using user data.
 */
const JWT_PAYLOAD = {
  /**
   * Custom claims.
   * This can be anything, depending on the use-case you have.
   */
  name: "John Doe", // Name of the user taken from database
  role: "EDITOR", // Role of the user taken from database

  /**
   * Registered claims.
   * List as many rigistered claims as you can, they provide a lot of useful metadata about the token.
   */
  sub: "22334455", // To whom token belongs to (user ID)
  iat: Math.floor(Date.now() / 1000), // Time of creation
  exp: Math.floor(Date.now() / 1000) + (3 * 24 * 60 * 60), // Time of expiration (in 3 days)
  iss: "Authentication server (NO.1)", // Name of the issuer
}

/**
 * Create JWT Header.
 * In this example RS256 algorithm is used.
 */
const JWT_HEADER = {
  alg: "RS256",
  typ: "JWT"
}

/**
 * Library requires private key to be parsed/imported before usage.
 * Keep in mind that every library is different and depending on the one you
 * chose, steps required for generating JWT might be different. Always make
 * sure to follow exact documentation and best practices before using it.
 */
const runtimePrivateKey = await jose.importPKCS8(PRIVATE_KEY, JWT_HEADER.alg)
const generatedToken = await new jose.SignJWT(JWT_PAYLOAD)
  .setProtectedHeader(JWT_HEADER)
  .sign(runtimePrivateKey)

/**
 * When token is generated it can be returned back to the Application client
 * using HTTP Response.
 *
 * Application client can now use the token to request the data from the
 * Application server. Token can be send with every request ether as a
 * query parameter or in Authorization header.
 * 
 * @example Pass token via HTTP query parameter
 * fetch(`https://api.example.com/v1/user?token=${generatedToken}`)
 * 
 * @example Pass token via HTTP Authorization header
 * fetch('https://api.example.com/v1/user', {
 *   method: GET,
 *   headers: {
 *     Authorization: `Bearer ${generatedToken}`
 *   }
 * })
 */
console.log(generatedToken);
