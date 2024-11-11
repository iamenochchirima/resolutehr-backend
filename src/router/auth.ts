
import {  localVariables, verifyUser } from "../middlewares/auth";
import { generateOTP, login, logout, register, resetPassword, verifyOTP } from "../controllers/auth";
import { Router } from "express";
import { registerMail } from "../controllers/mailer";
import { errorHandler } from "../exceptions/error-handler";

export default (router: Router) => {
  router.post("/auth/register", errorHandler(register))
  router.post("/auth/login", errorHandler(login))
  router.post("/auth/register-mail", registerMail)
  router.post("/auth/logout", logout)
  router.post("/auth/authenticate", verifyUser, (req, res) => res.end())
  router.post("/auth/generate-otp", verifyUser, localVariables, generateOTP)
  router.post("/auth/verify-otp", verifyUser, verifyOTP)
  router.put("/auth/reset-password", verifyUser, resetPassword)
};
