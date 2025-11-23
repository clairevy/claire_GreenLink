import welcomeEmail from "../EmailTemplate/welcome.js";
import nodemailer from "nodemailer";


export const sendEmailService = async ({ to, name, verifyUrl, profileUrl, startUrl }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // App Password
      },
    });

    const html = welcomeEmail({
      name,
      verifyUrl,
      profileUrl,
      startUrl,
      companyName: "GreenCo-op",
    });

    const info = await transporter.sendMail({
      from: `"GreenCo-op" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: "Welcome to GreenCo-op! Verify your account",
      html,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

