import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const generateToken = (
  payload: object,
  secret: Secret,
  expiresIn?: SignOptions["expiresIn"]
) => {
  const options: SignOptions = {
    expiresIn,
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

export default generateToken;
