const formData = require('form-data');
const path = require("path");
// const dotenv = require('dotenv').config({path: path.join(__dirname,'../private/.env')})

const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
var DOMAIN = process.env.MAILGUN_DOMAIN;



const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API });

const data = {
  from: 'Excited User <me@'+process.env.MAILGUN_DOMAIN+'>',
  to: ['knaxelbaby@gmail.com'],
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};


// mg.messages.create(process.env.MAILGUN_DOMAIN, data)
//   .then(msg => console.log(msg)) // logs response data
//   .catch(err => console.log(err));;