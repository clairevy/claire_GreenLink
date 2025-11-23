import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import welcomeEmail from "../EmailTemplate/welcome.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    // If the request is multipart (files), multer populated req.body and req.files
    const {
      username,
      email,
      password,
      role,
      companyName,
      contactName,
      phone,
      taxId,
      address,
      productTypes,
      supplyCapacity,
      deliveryAreas,
      certifications,
      otherCertification,
    } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // 2. Check if email or username already exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được sử dụng!" });
    } // 3. Mã hóa password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // 4. Tạo user mới

    // prepare file urls if files were uploaded
    let businessLicenseUrl;
    let imageUrls = [];
    try {
      if (req.files) {
        const bl = req.files.businessLicense && req.files.businessLicense[0];
        if (bl) businessLicenseUrl = `/uploads/${bl.filename}`;
        const imgs = req.files.images || [];
        imageUrls = imgs.map((f) => `/uploads/${f.filename}`);
      }
    } catch (e) {
      console.warn("No files parsed by multer", e.message);
    }

    const parsedProductTypes = (() => {
      if (!productTypes) return [];
      if (Array.isArray(productTypes)) return productTypes;
      try {
        return JSON.parse(productTypes);
      } catch {
        return String(productTypes)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    })();

    const parsedCertifications = (() => {
      if (!certifications) return [];
      if (Array.isArray(certifications)) return certifications;
      try {
        return JSON.parse(certifications);
      } catch {
        return String(certifications)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    })();

    // generate email confirm token
    const token = crypto.randomBytes(24).toString("hex");
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: role || undefined,
      companyName: companyName || undefined,
      contactName: contactName || undefined,
      phone: phone || undefined,
      taxId: taxId || undefined,
      address: address || undefined,
      productTypes: parsedProductTypes,
      supplyCapacity: supplyCapacity || undefined,
      deliveryAreas: deliveryAreas || undefined,
      certifications: parsedCertifications,
      otherCertification: otherCertification || undefined,
      businessLicenseUrl,
      imageUrls,
      isConfirmed: false,
      confirmToken: token,
      confirmTokenExpiry: expiry,
    }); // 5. Lưu vào database

    const user = await newUser.save(); // 6. Trả về kết quả (Loại bỏ password hash) // Dùng user._doc để đảm bảo làm việc với plain object

    // send welcome/confirm email
    const backendBase =
      process.env.BACKEND_BASE_URL ||
      `http://localhost:${process.env.PORT || 5000}`;
    const frontendBase =
      process.env.FRONTEND_BASE_URL || "http://localhost:5174";
    const verifyUrl = `${backendBase}/api/auth/verify-email?token=${token}`;

    // build email HTML using template
    const html = welcomeEmail({
      name: contactName || username,
      verifyUrl,
      profileUrl: `${frontendBase}/register/success`,
      startUrl: `${frontendBase}/login`,
      companyName: process.env.COMPANY_NAME || "GreenBanana Coop",
    });

    let emailSent = false;
    try {
      if (
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
      ) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: `Welcome to ${
            process.env.COMPANY_NAME || "GreenBanana Coop"
          }`,
          html,
        });
        emailSent = true;
      }
    } catch (e) {
      console.error("Failed to send confirmation email:", e.message);
    }

    const { password: _, ...userToReturn } = user._doc;
    // return confirmUrl if email not sent (dev convenience)
    const resp = { user: userToReturn };
    if (!emailSent) resp.confirmUrl = verifyUrl;
    res.status(201).json(resp);
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    if (error && error.code === 11000) {
      // Duplicate key (username or email)
      const dupField = Object.keys(error.keyValue || {})[0] || "field";
      return res.status(409).json({ message: `${dupField} đã tồn tại` });
    }
    res
      .status(500)
      .json({ message: "Lỗi server nội bộ", error: error.message });
  }
};

export const verifyEmailGet = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token");
    const user = await User.findOne({ confirmToken: token });
    if (!user) return res.status(404).send("Invalid token");
    if (user.confirmTokenExpiry && user.confirmTokenExpiry < new Date()) {
      return res.status(400).send("Token expired");
    }

    user.isConfirmed = true;
    user.confirmToken = undefined;
    user.confirmTokenExpiry = undefined;
    await user.save();

    const frontendBase =
      process.env.FRONTEND_BASE_URL || "http://localhost:5173";
    const redirectUrl = `${frontendBase}/login?confirmed=1&username=${encodeURIComponent(
      user.username
    )}`;
    return res.redirect(redirectUrl);
  } catch (e) {
    console.error("verifyEmailGet error", e);
    return res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  // Loại bỏ khối bao ngoài không cần thiết
  try {
    // allow login via username or email
    const identifier = req.body.username || req.body.email;
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Tên người dùng không tồn tại và không đúng" });
    }

    if (!user.isConfirmed) {
      return res.status(403).json({
        message:
          "Tài khoản chưa được xác nhận. Vui lòng kiểm tra email để xác thực.",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(404).json({ message: "Mật khẩu không đúng" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_KEY_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_KEY_SECRET,
      { expiresIn: "7d" }
    );

    // Return user without password
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return res.status(200).json({ user: userObj, accessToken });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res
      .status(500)
      .json({ message: "Lỗi server nội bộ", error: error.message });
  }
};
