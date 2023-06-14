const nodemailer = require('nodemailer');

// TODO: Add your email account credentials
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email',
    pass: 'email password'
  }
});

// Mail Option Template
// const mailOptions = {
//   from: 'your-email@gmail.com',
//   to: 'recipient@example.com',
//   subject: 'Test Email',
//   text: 'Hello, this is a test email.'
// };

// Send email template
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

