import * as jose from 'jose';
import fs from 'fs';

/**
 * Example of how to verify JWT (JSON Web Token).
 *
 * Following things are assumed:
 * 1. Server code and logic is already implemented.
 * 2. Database where application data is storead already exists.
 * 3. Private and public keys are already created and stored in files.
 */

/**
 * On Application server public key is used to verify the JWT.
 * Notice that private key is not used at all.
 */
const PUBLIC_KEY = fs.readFileSync('./keys/public.pem', { encoding: 'utf-8' })

/**
 * Signature Algorithm that was usged to sign the token.
 * Token is expected to be siged with RS256.
 */
const SIGNATURE_ALGORITHM = 'RS256'

/**
 * Application server has received HTTP GET request from the Application client.
 * 1. Server will extract token ether from HTTP query parameter or Authorization header.
 *
 * Received token will look something like this:
 * NOTE: Run following command, in the root dir, to get the fresh token:
 * node authentication-server.js
 */
const userToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoiRURJVE9SIiwic3ViIjoiMjIzMzQ0NTUiLCJpYXQiOjE2OTM0ODI1NDEsImV4cCI6MTY5Mzc0MTc0MSwiaXNzIjoiQXV0aGVudGljYXRpb24gc2VydmVyIChOTy4xKSJ9.D8MAW7G8a5PP4rFj96_MAw736hZ23vFvVuLoe3NpArSb40I-UCyvaRbDjwdkEMXVWU7ldKkRC1Y6clM24omAdX77rAfhKxMwu-79Vhz_v7ne5t8RM7jgOxUKCg5NTlUtpC__5RvObAVlQAPK0Xg-wjy06iWZfr-BWFpPXGl3dwO0xIFKATQA3N2s0KNkTCIZ2DUuFyShJWe-XkaHh6Vmw4-zQdMxUtN68y0qDF2z9TeJCa_qzKUXi_RVYjWNYYrExdYScWSrSyA0xzTcqIu10lhJYCYghy6prrGQJwrU4kchJ7TWUKSUcrsBdyDrxJTFp8wIBGXFVulhuROLgjx8_A"

/**
 * Library requires public key to be parsed/imported before usage.
 * Keep in mind that every library is different and depending on the one you
 * chose, steps required for generating JWT might be different. Always make
 * sure to follow exact documentation and best practices before using it.
 */
const runtimePublicKey = await jose.importSPKI(PUBLIC_KEY, SIGNATURE_ALGORITHM)
try {
  const { payload, protectedHeader } = await jose.jwtVerify(
    userToken,
    runtimePublicKey,
    {
      algorithms: [SIGNATURE_ALGORITHM],
      issuer: 'Authentication server (NO.1)',
      requiredClaims: ['iss', 'exp', 'role'],
    }
  )

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    const TokenExpiredError = new Error('Token has expired')
    TokenExpiredError.code = 'ERR_TOKEN_EXPIRED'
    throw TokenExpiredError;
  }

  /**
   * Token can be trusted.
   * Application server can return requested resources with HTTP 200 Status Code - OK
   */
  console.log('payload', payload)
  console.log('protectedHeader', protectedHeader)
} catch (error) {
  /**
   * Token verification has failed and provided token is not valid and can not be trusted.
   * Application server will return HTTP 401 Status Code - Unauthorized.
   * 
   * NOTE: This library provides status code for different errors that could occure during
   * token verification. By checking for specific errors it is possible to fine tune the
   * response to provide more information or just put it in the logs for later review.
   */

  console.error(`${error?.code}: ${error?.message}`)
}
