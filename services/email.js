const nodemailer = require("nodemailer");
const {template} = require("./email.template");
require("dotenv").config();

exports.sendEmail = async (options) => {
  let transporter;
  let _template = template(options);
  if (process.env.ENVIRONMENT === "local") {
    transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      // service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDR,
        pass: process.env.MAIL_SECRET,
      }
    });
  }
  //create a transporter e.g gmail

  //define the email options
  const mailOptions = {
    from: process.env.MAIL_ADDR,
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: _template,
  };

  //send the email with nodemailer
  await transporter.sendMail(mailOptions);
};
