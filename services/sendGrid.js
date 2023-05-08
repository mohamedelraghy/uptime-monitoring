const nodemailer = require('nodemailer');
const sendgridTransporter = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(
  sendgridTransporter({
    auth: {
      api_key: process.env.NODE_MAILER_KEY
    }
  })
);

exports.sendVerifyCode = async (email, code) => {
  await transport.sendMail({
    to: email,
    from: "elraghy8+noreplay@gmail.com",
    subject: "Active You Uptime",
    html: `
    <p>You just register on Uptime Monitoring</p>
    <p>Use this code: ${code} to active your Account</p>       
    `,
  });
  
}

exports.sendPingStatus = async (checkData) => {
  await transport.sendMail({
    to: checkData.userEmail,
    from: "elraghy8+noreplay@gmail.com",
    subject: `Your ${checkData.name} status`,
    html: `
    <p>This is a notification from Uptime Monitoring</p>
    <p>Your check: ${checkData.protocol}://${checkData.url}:${checkData.port}${checkData.path} status is: ${checkData.status}</p>
    <p>we Will inform You about any updates</p>      
    `,
  });
}