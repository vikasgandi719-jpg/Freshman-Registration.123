const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"BVRITN Freshman Registration" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendRegistrationEmail = async (to, { name, uniqueId }) => {
  return sendEmail({
    to,
    subject: 'Registration Successful – BVRITN Freshman Registration',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your registration was successful.</p>
      <p><strong>Your Unique ID:</strong> ${uniqueId}</p>
      <p>Use this ID along with your password to log in to the portal.</p>
      <br/>
      <p>– BVRITN Admissions Team</p>
    `,
  });
};

const sendOTPEmail = async (to, otp) => {
  return sendEmail({
    to,
    subject: 'Your OTP – BVRITN Freshman Registration',
    html: `
      <h2>Your OTP</h2>
      <p>Use the following OTP to verify your email:</p>
      <h1 style="letter-spacing:8px">${otp}</h1>
      <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
    `,
  });
};

module.exports = { sendEmail, sendRegistrationEmail, sendOTPEmail };

