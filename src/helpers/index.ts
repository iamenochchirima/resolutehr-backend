import { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../schema/secrets";

export const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET as string, {
    expiresIn: "1d",
  });

  res.cookie("RESOLUTEHR_JWT", token, {
    httpOnly: true,
    secure :  process.env.NODE_ENV === "production" ? true : false, 
    sameSite: "strict",
    maxAge : 1000 * 60 * 60 * 24,
  });
} 