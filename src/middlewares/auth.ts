// import { getUserByEmail, getUserBySessionToken } from "../schema/users";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../schema/secrets";
import { prismaClient } from "../index";
import { BadRequestException } from "../exceptions/bad-request";

export const authMidleware =  async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.RESOLUTEHR_JWT;

  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any

    const user = await prismaClient.user.findFirst({where: {id: payload.userId}});
    if (!user) {
      next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    req.user = user;
    next();
  } catch ( error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED, error));
  }
};

function isJwtPayloadWithUserId(
  payload: string | JwtPayload
): payload is JwtPayload & { userId: string } {
  return typeof payload === "object" && "userId" in payload;
}

export const protect = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.RESOLUTEHR_JWT;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token found");
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (isJwtPayloadWithUserId(decoded)) {
        req.user = await prismaClient.user.findFirst({
          where: {
            id: decoded.userId,
          },
        });
        next();
      } else {
        console.log("decoded: ", decoded)
        res.status(401);
        throw new Error("Not authorized, invalid token");
      }
    }
  }
);

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email} = req.body;
    if (!email) {
      throw new BadRequestException("Invalid data", ErrorCode.INVALID_DATA);
    };
    const user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      throw new BadRequestException("User not found", ErrorCode.USER_NOT_FOUND);
    }
    return next();
  } catch (error) {
    return res.sendStatus(400);
  }
}


export const localVariables = (req: Request, res: Response, next: NextFunction) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
