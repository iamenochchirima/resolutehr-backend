import nodemailer from "nodemailer";
import Mialgen from "mailgen";
import "dotenv/config";
import { Request, Response } from "express";

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

let nodeConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
    method: "LOGIN",
  },
};

const transporter = nodemailer.createTransport(nodeConfig);

const mailGenerator = new Mialgen({
  theme: "default",
  product: {
    name: "Resolute hr",
    link: "http://localhost:5000",
  },
});

export const registerMail = async (req: Request, res: Response) => {
  const { userEmail, username, text, subject } = req.body;

  var email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to Resolute! We are very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we would love to help.",
    },
  };

  var emailBody = mailGenerator.generate(email);

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: subject || "Welcome to Resolute",
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then((info) => {
      res.status(200).json({ message: "Email sent" });
    })
    .catch((error) => {
      res.status(400).json({ message: "Email not sent" });
    });
};
