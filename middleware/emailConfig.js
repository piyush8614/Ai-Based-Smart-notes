

  //auth: {
    //user: "piyushsinhjadav8614@gmail.com",
    //pass: "aeam tazv zrkk axop",
 
    import nodemailer from "nodemailer";
    import dotenv from "dotenv";

dotenv.config();
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});
