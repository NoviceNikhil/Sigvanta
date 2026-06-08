const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
  try {
    // transporter create karo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // .env se aayega
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admin Login OTP",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes</p>
      `,
    };

    // send mail
    await transporter.sendMail(mailOptions);

    console.log("✅ OTP email sent successfully");
  } catch (error) {
    console.log("❌ Error sending email:", error.message);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = sendOtpEmail;