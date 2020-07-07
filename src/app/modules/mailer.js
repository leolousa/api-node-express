const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../../config/mail.json');

/**
 * Configurações do Nodemailer
 */

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: './src/resources/mail/',
    layoutsDir: path.resolve('./src/resources/mail/auth'),
    defaultLayout: 'forgot_password.html',
  },
  viewPath: path.resolve('./src/resources/mail/auth'),
  extName: '.html',
};

transport.use('compile', hbs(handlebarOptions));

module.exports = transport;
