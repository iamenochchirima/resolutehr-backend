import { NextFunction, Request, RequestHandler, Response } from "express";
import "dotenv/config";
import { generateToken } from "../helpers";
import otpGenerator from "otp-generator";
import { compareSync, hashSync } from "bcryptjs";
import { prismaClient } from "../";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { requiredFields } from "../constants";
import { otpEmail } from "./mailer";

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    tradeName,
    DTIRegistrationNumber,
    PAYEorSARSNumber,
    EERefNumber,
    industryOrSector,
    province,
    telNumber,
    cellNumber,
    faxNumber,
    postalAddress,
    physicalAddress,
    CEOorAccountingOfficer,
  } = req.body;

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    throw new BadRequestException(
      `Invalid data: Missing required fields - ${missingFields.join(", ")}`,
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
      firstName,
      lastName,
      tradeName,
      DTIRegistrationNumber,
      PAYEorSARSNumber,
      EERefNumber,
      industryOrSector,
      province,
      telNumber,
      cellNumber,
      faxNumber,
      postalAddress,
      physicalAddress,
      CEOorAccountingOfficer,
    },
  });

  generateToken(res, newUser.id.toString());
  res.status(201).json({
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    tradeName: newUser.tradeName,
    DTIRegistrationNumber: newUser.DTIRegistrationNumber,
    PAYEorSARSNumber: newUser.PAYEorSARSNumber,
    EERefNumber: newUser.EERefNumber,
    industryOrSector: newUser.industryOrSector,
    province: newUser.province,
    telNumber: newUser.telNumber,
    cellNumber: newUser.cellNumber,
    faxNumber: newUser.faxNumber,
    postalAddress: newUser.postalAddress,
    physicalAddress: newUser.physicalAddress,
    CEOorAccountingOfficer: newUser.CEOorAccountingOfficer,
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
      firstName: user.firstName,
      lastName: user.lastName,
      tradeName: user.tradeName,
      DTIRegistrationNumber: user.DTIRegistrationNumber,
      PAYEorSARSNumber: user.PAYEorSARSNumber,
      EERefNumber: user.EERefNumber,
      industryOrSector: user.industryOrSector,
      province: user.province,
      telNumber: user.telNumber,
      cellNumber: user.cellNumber,
      faxNumber: user.faxNumber,
      postalAddress: user.postalAddress,
      physicalAddress: user.physicalAddress,
      CEOorAccountingOfficer: user.CEOorAccountingOfficer,
      isEmailVerified: user.isEmailVerified,
    })
    .end();
};

export const me = async (req: Request, res: Response) => {
res.json(req.user);
};


export const logout = async (req: Request, res: Response) => {
  res.clearCookie("RESOLUTEHR_JWT");
  res.status(200).json({ message: "User logged out" });
};

export async function generateOTP(req: Request, res: Response) {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
    lowerCaseAlphabets: false,
  });
  req.app.locals.OTP = OTP;

  const { email } = req.body;

  const user = await prismaClient.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new BadRequestException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const emailResponse = await otpEmail(email, user.firstName, OTP);
  if (emailResponse.success) {
    res
      .status(200)
      .json({ code: OTP, message: "OTP generated and email sent" });
  } else {
    res.status(500).json({
      code: OTP,
      message: "Email not sent due to an error, try again later!",
      error: emailResponse.error,
    });
  }
}


export const verifyOTP = async (req: Request, res: Response) => {
  const { otp } = req.body;
  console.log("OTP: ", otp, "req.app.locals.OTP: ", req.app.locals.OTP);
  if (otp === req.app.locals.OTP) {
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

export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response
) => {
  console.log("resetPassword endpoint");
  if (!req.app.locals.resetSession) {
    res.status(400).json({ message: "Session expired" });
    return;
  }

  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    res.status(400).json({ message: "Invalid data" });
    return;
  }
  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match" });
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: { email },
  });
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  req.app.locals.resetSession = false;
  user.password = password;
  await prismaClient.user.update({
    where: { id: user.id },
    data: { password: hashSync(password, 10) },
  });
  res.status(200).json({ message: "Password reset" });
  return;
};

