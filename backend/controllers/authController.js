const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { sendOtp, verifyOtpInRedis } = require("../services/otpService");

exports.register = async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ phone, password: hashedPassword, role, isVerified: false });
    await sendOtp(phone);
    res.status(201).json({ message: "OTP sent to your phone number." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const valid = await verifyOtpInRedis(phone, otp);
    if (!valid) return res.status(400).json({ message: "Invalid OTP" });
    await User.update({ isVerified: true }, { where: { phone } });
    res.json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({ message: "User not found, Please register first!" });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: "Account not verified" });
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", newAccessToken, { httpOnly: true });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
