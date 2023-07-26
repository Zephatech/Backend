import nodemailer, { Transporter } from 'nodemailer';

// TODO: Add your email account credentials
export const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: 'zhubolin010118@gmail.com',
    pass: 'PRjY2W1XcLTKZCMd'
  }
});


