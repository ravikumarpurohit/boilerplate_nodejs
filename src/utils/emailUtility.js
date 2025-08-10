import nodemailer from "nodemailer";
import { emailConfig } from "../config/index";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailConfig.userName,
    pass: emailConfig.password, // Use environment variable for security
  },
});

export const mailer = async (req_email, _id) => {
  try {
    const mailOptions = {
      from: emailConfig.from, // Use environment variable for security
      to: req_email,
      subject: "Verify your account",
      text: `Verify your account - http://localhost:3005/api/v1/user/email-verify/${_id}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error in sending mail:", error);
      } else {
        console.log("Email sent:", mailOptions);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const setPassword = async (req_email, _id) => {
  try {
    const mailOptions = {
      from: "divyeshborkhatariya1@gmail.com",
      to: req_email,
      subject: "Set Your Password",
      text: `Set Your Password - http://localhost:3005/api/v1/user/set-password/${_id}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error in sending mail:", error);
      } else {
        console.log("Email sent:", mailOptions);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
