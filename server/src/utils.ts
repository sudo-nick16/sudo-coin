import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./constants";
import { TokenPayload } from "./types"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const createRefreshToken = (payload: TokenPayload): string => {
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  })
  return refreshToken;
}

export const verifyRefreshToken = (token: string): (TokenPayload | undefined) => {
  const payload = (jwt.verify(token, REFRESH_TOKEN_SECRET, {
    algorithms: ["HS256"],
  }) as unknown) as TokenPayload;
  if (!payload) {
    return undefined;
  }
  return payload;
}

export const createAccessToken = (payload: TokenPayload): string => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: 15 * 60 * 1000,
  })
  return accessToken;
}

export const verifyAccessToken = (token: string): TokenPayload | undefined => {
  const payload = (jwt.verify(token, ACCESS_TOKEN_SECRET, {
    algorithms: ["HS256"],
  }) as unknown) as TokenPayload;
  if (!payload) {
    return undefined;
  }
  return payload;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export const isCorrectPassword = async (password: string, hash: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}

export const isStrongPassword = (password: string): boolean => {
  const strongRegex = new RegExp("^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$");
  return strongRegex.test(password);
}
