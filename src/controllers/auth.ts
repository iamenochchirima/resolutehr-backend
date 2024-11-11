import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { generateToken } from "../helpers";
import otpGenerator from "otp-generator";
import { compareSync, hashSync } from "bcryptjs";
import { prismaClient } from "../";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";

export const register = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, firstname, lastname } = req.body;

  if (!email || !password || !firstname || !lastname) {
    throw new BadRequestException(
      "Invalid data: Missing required fields",
      ErrorCode.INVALID_DATA
    );
  }

  if (password !== confirmPassword) {
    throw new BadRequestException(
      "Passwords do not match",
      ErrorCode.NOT_MATCHING_PASSWORDS
    );
  }

  if (!email.includes("@") || !email.includes(".")) {
    throw new BadRequestException(
      "Invalid email format",
      ErrorCode.INVALID_EMAIL
    );
  }

  if (password.length < 6) {
    throw new BadRequestException(
      "Password must be at least 6 characters",
      ErrorCode.INVALID_PASSWORD
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prismaClient.user.findFirst({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new BadRequestException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  const newUser = await prismaClient.user.create({
    data: {
      email: normalizedEmail,
      password: hashSync(password, 10),
      firstname,
      lastname,
    },
  });

  generateToken(res, newUser.id.toString());
  res.status(201).json({
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    email: newUser.email,
    isEmailVerified: newUser.isEmailVerified,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestException("Invalid data", ErrorCode.INVALID_DATA);
  }

  const user = await prismaClient.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new BadRequestException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      "Incorrect password",
      ErrorCode.INVALID_PASSWORD
    );
  }

  generateToken(res, user.id.toString());
  res
    .status(200)
    .json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    })
    .end();
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("RESOLUTEHR_JWT");
  res.status(200).json({ message: "User logged out" });
};

export async function generateOTP(req: Request, res: Response) {
  req.app.locals.OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
    lowerCaseAlphabets: false,
  });
  res.status(200).send({ code: req.app.locals.OTP });
}

export const verifyOTP = async (req: Request, res: Response) => {
  const { code } = req.body;
  if (code === req.app.locals.OTP) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    res.status(201).json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};

export const createResetSession = async (req: Request, res: Response) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    res.status(200).json({ message: "Access granted" });
  } else {
    res.status(400).json({ message: "Session expired" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  // if (!req.app.locals.resetSession) {
  //   return res.status(400).json({ message: "Session expired" });
  // }
  // const { email, password, confirm } = req.body;
  // if (!email || !password || !confirm) {
  //   return res.status(400).json({ message: "Invalid data" });
  // }
  // if (password !== confirm) {
  //   return res.status(400).json({ message: "Passwords do not match" });
  // }
  // const user = await getUserByEmail(email);
  // if (!user) {
  //   return res.status(400).json({ message: "User not found" });
  // }
  // req.app.locals.resetSession = false;
  // user.password = password;
  // await user.save();
  // res.status(200).json({ message: "Password reset" });
};
