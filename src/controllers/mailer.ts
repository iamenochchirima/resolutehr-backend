import nodemailer from "nodemailer";
import Mialgen from "mailgen";
import "dotenv/config";

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

let nodeConfig = {
  host: "smtp.ethereal.email", // "smtp.gmail.com",
  port: 587,//465,
  secure: false, // true,
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
    name: "Resolute HR",
    link: "http://localhost:5000",
  },
});

export async function otpEmail(userEmail: string, username: string, otp: string) {
  const email = {
    body: {
      name: username,
      intro: `Welcome to Resolute HR!`,
      table: {
        data: [
          { 'Your OTP Code': otp },
        ],
        columns: {
          customWidth: {
            'Your OTP Code': '30%',
          },
          customAlignment: {
            'Your OTP Code': 'center',
          },
        },
      },
      outro: `
        Please enter the above OTP code in the app to verify your email. 
        This code is valid for the next 10 minutes. 
        If you didn't request this, please ignore this email or contact support.`,
    },
  };

  const emailBody = mailGenerator.generate(email);

  const message = {
    from: EMAIL,
    to: userEmail,
    subject: 'Your OTP Code for Resolute HR',
    html: emailBody,
  };

  try {
    await transporter.sendMail(message);
    return { success: true, message: 'OTP email sent' };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, message: 'OTP email not sent', error };
  }
}
