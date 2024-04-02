const nodemailer = require('nodemailer');
const { logger } = require("../utils/logger");

async function mailer(req_email, _id) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req_email,
      subject: 'Verify your account',
      text: 'Verify your account - http://localhost:3006/api/v1/admin/email-verify/' + _id
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (e) {
        // return console.log("error in sending a mail",error);
        return logger.info(`error in sending a mail ,${e}`);

      } else {
        // console.log('Email sent: ', mailOptions);
        logger.info(`Email sent: ,${mailOptions}`);
      }
    });


  } catch (error) {
    console.log(error)
  }
};

async function setPassword(req_email, _id) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req_email,
      subject: 'Set your password',
      text: 'Set your password - http://localhost:3006/api/v1/admin/set-password/' + _id
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log("error in sending a mail", error);
      } else {
        console.log('Email sent: ', mailOptions);
      }
    });


  } catch (error) {
    console.log(error)
  }
};

module.exports = {
  mailer,
  setPassword
};
