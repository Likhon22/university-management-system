/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../error/AppError';

export const sendEmail = async (resetLink: string, toEmail: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: config.node_env === 'production',
      auth: {
        user: 'likhonsarker793@gmail.com',
        pass: `${config.smtp_email_pass}`,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: 'likhonsarker793@gmail.com', // sender address
      to: toEmail, // receiver's email address
      subject: 'Password Reset Request', // Subject line
      text: `
      Hi there,
      
      You recently requested to reset your password. Please use the link below to set a new password. This link will expire in 10 minutes.

      Reset your password: ${resetLink}

      If you did not request a password reset, please ignore this email or contact support if you have concerns.

      Best regards,
      The Support Team
    `, // plain text body
      html: `
      <p>Hi there,</p>
      <p>You recently requested to reset your password. Please use the link below to set a new password. <strong>This link will expire in 10 minutes.</strong></p>
      <p><a href="${resetLink}" target="_blank">Reset your password</a></p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Best regards,<br>The Support Team</p>
    `, // HTML body
    });
  } catch (err) {
    throw new AppError(500, 'Failed to send email');
  }
};
