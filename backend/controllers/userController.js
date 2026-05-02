import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Token helpers
const createAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const createRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh", { expiresIn: "7d" });

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ success: true, token: accessToken, refreshToken, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Register user
export const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });
    if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
    if (password.length < 8) return res.json({ success: false, message: "Password must be at least 8 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const accessToken = createAccessToken("temp");
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const newAccessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ success: true, token: newAccessToken, refreshToken, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.json({ success: false, message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh");
    const user = await userModel.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = createAccessToken(user._id);
    const newRefreshToken = createRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ success: true, token: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.json({ success: false, message: "Refresh token expired, please login again" });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (refreshToken) {
      await userModel.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }
    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all users (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password -refreshToken");
    res.json({ success: true, data: users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
