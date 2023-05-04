const nodemailer = require('nodemailer');
const sendgridTransporter = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(
  sendgridTransporter({
    auth: {
      api_key: process.env.NODE_MAILER_KEY
    }
  })
);

module.exports = transport;