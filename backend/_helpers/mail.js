// const nodemailer = require('nodemailer');
// const htmlToText = require('html-to-text');
// const config = require('../config');
//
// module.exports = sendEmail;
//
// function sendEmail (options) {
//     return new Promise((resolve, reject) => {
//         const transpoter = nodemailer.createTransport({
//             host: config.host,
//             port: config.port,
//             auth: {
//                 user: config.username,
//                 pass: config.password,
//             },
//         });
//
//         console.log('transporter ' + transpoter)
//         const text = htmlToText.fromString(options.html, {
//             wordwrap: 130,
//         });
//         const mailOptions = {
//             from: '"Owl Accounting 👻👻👻" <noreplay@owlaccounting.com>',
//             to: options.email,
//             subject: options.subject,
//             text,
//             html: options.html,
//         };
//         console.log('MailOptions: ' + JSON.stringify(mailOptions));
//
//         transpoter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return reject(error);
//             }
//             console.log('Message id ', info.messageId);
//             console.log('Preview URL ', nodemailer.getTestMessageUrl(info));
//             return resolve({message: 'Reset Email has sent to your inbox'});
//         });
//     });
// }
