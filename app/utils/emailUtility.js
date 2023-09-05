const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const { emailConfig } = require("../config/index");
const { logger } = require("../utils/logger");

const oauth2Client = new OAuth2Client(
  emailConfig.oathClientId,
  emailConfig.oathClientSecret,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: emailConfig.oathRefreshToken,
});

const prepareTextMail = (to, subject, text) => {
  let data = {
    from: emailConfig.from,
    to: to,
    subject: subject,
    text: text,
  };
  return data;
};

const prepareHTMLMail = (to, subject, htmlData) => {
  let data = {
    from: emailConfig.from,
    to: to,
    subject: subject,
    html: htmlData,
  };
  return data;
};

const prepareWithAttachmentMail = (to, subject, text, attachments = []) => {
  let data = {
    from: emailConfig.from,
    to: to,
    subject: subject,
    text: text,
  };
  if (attachments.length > 0) {
    attachments.forEach((element) => {
      data["attachments"].push(element);
    });
  }
  return data;
};

const sendMail = async (mailObj) => {
  try {
    let accessToken = await oauth2Client.getAccessToken().catch((error) => {
      logger.error(error, "",error);
    });

    if (accessToken) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: emailConfig.userName,
          clientId: emailConfig.oathClientId,
          clientSecret: emailConfig.oathClientSecret,
          refreshToken: emailConfig.oathRefreshToken,
          accessToken: accessToken,
        },
      });
      var info = await transporter.sendMail(mailObj, function (error, info) {
        if (error) logger.error(error.message, "", error);
        else {
          logger.info(`Mail sent successfully to ${mailObj.to} with subject: ${mailObj.subject}`);
        }
        transporter.close();
      });
    }
  } catch (error) {
    logger.error(error, "");
    transporter.close();
  }
};

module.exports = {
  sendMail,
  prepareWithAttachmentMail,
  prepareHTMLMail,
  prepareTextMail,
};
