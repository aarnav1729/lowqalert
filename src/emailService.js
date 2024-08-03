const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const config = require('./config');

async function getAccessToken() {
  const oAuth2Client = new google.auth.OAuth2(
    config.oauth2.clientId,
    config.oauth2.clientSecret,
    config.oauth2.redirectUri
  );

  oAuth2Client.setCredentials({
    refresh_token: config.oauth2.refreshToken,
  });

  const token = await oAuth2Client.getAccessToken();
  return token.token;
}

async function sendAlert(lowPercentage) {
  try {
    const accessToken = await getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'aarnavsingh836@gmail.com', 
        clientId: config.oauth2.clientId,
        clientSecret: config.oauth2.clientSecret,
        refreshToken: config.oauth2.refreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'aarnavsingh836@gmail.com', 
      to: 'aarnavsingh836@gmail.com',
      subject: 'Low Grade Panel Alert',
      text: `The percentage of low-grade panels is ${lowPercentage.toFixed(2)}% in the last hour, which exceeds the threshold.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendAlert };