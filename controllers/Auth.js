import Usermodel from "../models/User.js";
import bcrypt from "bcryptjs";
import generateVerificationCode from "../utils/generateCode.js";
import { sendVerificationCode } from "../middleware/email.js";


export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await Usermodel.findOne({ email });

if (existingUser) {
  if (existingUser.isVerified) {
    return res.status(400).json({ message: "User already registered" });
  }

  // 🔥 UPDATE PASSWORD ALSO IF USER NOT VERIFIED
  const hashedPassword = await bcrypt.hash(password, 10);

  existingUser.password = hashedPassword;
  existingUser.verificationCode = generateVerificationCode();

  await existingUser.save();
  await sendVerificationCode(existingUser.email, existingUser.verificationCode);

  return res.status(200).json({
    success: true,
    message: "Verification code resent and password updated",
  });
}

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const user = new Usermodel({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false,
    });

    await user.save();
    await sendVerificationCode(user.email, verificationCode);
    // ⚠️ TEMP: send code in response (email comes next)
    res.status(201).json({
      success: true,
      message: "User registered. Verification code sent.",
      verificationCode, // ❌ remove after email setup
    });
  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code required" });
    }

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error("VERIFY ERROR ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE NAME =================
export const updateName = async (req, res) => {
  try {
    const { userId, name } = req.body;

    await Usermodel.findByIdAndUpdate(userId, { name });

    res.json({ message: "Name updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await Usermodel.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong old password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};