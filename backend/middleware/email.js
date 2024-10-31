import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `"AUTHENTIQUE COLLECTIBLE" <percival.feliciano@cvsu.edu.ph`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (userEmail, verificationToken) => {
  const verificationUrl = `http://yourdomain.com/verify?token=${verificationToken}`;
  const htmlContent = `
      <h1>Verify Your Account</h1>
      <p>Thank you for registering! Please verify your account by clicking the button below:</p>
      <a href="${verificationUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Account</a>
    `;

  await sendEmail({
    email: userEmail,
    subject: "Account Verification",
    html: htmlContent,
  });
};
export { sendEmail, sendVerificationEmail };
