const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');

const HTMLpath = path.join(__dirname, '../templetes/templateRegister.hbs');

const readHTMLFile = fs.readFileSync(HTMLpath, "utf8");
const template = handlebars.compile(readHTMLFile);
const mailgunTransport = require('nodemailer-mailgun-transport');



const transporter = nodemailer.createTransport(mailgunTransport({
  auth: {
    api_key: process.env.API_KEY, 
    domain: process.env.DOMAIN
  }
}));



const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info}`);
      }
    });
  };


module.exports = {
    sendMail,
    template,
};


