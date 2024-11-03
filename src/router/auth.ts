
import {  localVariables, verifyUser } from "../middlewares/auth";
import { generateOTP, login, logout, register, resetPassword, verifyOTP } from "../controllers/auth";
import { Router } from "express";
import { registerMail } from "../controllers/mailer";

export default (router: Router) => {
  router.post("/auth/register", register)
  router.post("/auth/register-mail", registerMail)
  router.post("/auth/login", login)
  router.post("/auth/logout", logout)
  router.post("/auth/authenticate", verifyUser, (req, res) => res.end())
  router.post("/auth/generate-otp", verifyUser, localVariables, generateOTP)
  router.post("/auth/verify-otp", verifyUser, verifyOTP)
  router.put("/auth/reset-password", verifyUser, resetPassword)
};
