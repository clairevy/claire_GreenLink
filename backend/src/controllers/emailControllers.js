import { sendEmailService } from "../services/EmailServices.js";
import crypto from "crypto"; // tạo token verify

export const sendEmail = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    // tạo token verify tạm thời (có thể lưu DB để check)
    const token = crypto.randomBytes(32).toString("hex");
    const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
    const profileUrl = `${process.env.BASE_URL}/profile`;
    const startUrl = `${process.env.BASE_URL}/dashboard`;

    await sendEmailService({
      to: email,
      name,
      verifyUrl,
      profileUrl,
      startUrl,
    });

    return res.status(200).json({ message: "Welcome email sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
