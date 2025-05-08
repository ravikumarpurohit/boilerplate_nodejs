import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { emailConfig } from "../config/index";
import { logger } from "../utils/logger";

const oauth2Client = new OAuth2Client(
  emailConfig.oathClientId,
  emailConfig.oathClientSecret,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: emailConfig.oathRefreshToken,
});

const prepareTextMail = (to, subject, text) => ({
  from: emailConfig.from,
  to,
  subject,
  text,
});

const prepareHTMLMail = (to, subject, htmlData) => ({
  from: emailConfig.from,
  to,
  subject,
  html: htmlData,
});

const prepareWithAttachmentMail = (to, subject, text, attachments = []) => {
  const data = {
    from: emailConfig.from,
    to,
    subject,
    text,
    attachments: [],
  };

  if (attachments.length > 0) {
    attachments.forEach((element) => {
      data.attachments.push(element);
    });
  }

  return data;
};

const sendMail = async (mailObj) => {
  try {
    const accessToken = await oauth2Client.getAccessToken().catch((error) => {
      logger.error(error, "", error);
    });

    if (accessToken) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: emailConfig.userName,
          clientId: emailConfig.oathClientId,
          clientSecret: emailConfig.oathClientSecret,
          refreshToken: emailConfig.oathRefreshToken,
          accessToken,
        },
      });

      await transporter.sendMail(mailObj, (error, info) => {
        if (error) {
          logger.error(error.message, "", error);
        } else {
          logger.info(
            `Mail sent successfully to ${mailObj.to} with subject: ${mailObj.subject}`
          );
        }
        transporter.close();
      });
    }
  } catch (error) {
    logger.error(error, "");
    transporter.close();
  }
};

export {
  sendMail,
  prepareWithAttachmentMail,
  prepareHTMLMail,
  prepareTextMail,
};
