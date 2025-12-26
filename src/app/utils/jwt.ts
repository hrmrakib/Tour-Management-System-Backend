import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

type Expiration = string | number | undefined;

/**
 * @param payload - The payload to be signed
 * @param secret - The secret key
 * @param expiresIn - The expiration time in seconds
 * @returns The signed token
 */

const generateToken = async (
  payload: object,
  secret: Secret,
  expiresIn?: Expiration
) => {
  const options: SignOptions = {};

  if (expiresIn) {
    options.expiresIn = expiresIn as number;
  }

  const token = await jwt.sign(payload, secret, options);
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};

export { generateToken, verifyToken };
