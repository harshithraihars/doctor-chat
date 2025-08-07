require("dotenv").config({});
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log(req.body);

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are Required" });
    }
    const user = new User({ email, password, name });
    await user.save();
    console.log("done correct");

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error.message);

    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, "xxxyyy", {
      expiresIn: "1h",
    });
    res.json({ token: token, user: user.name });
  } catch (error) {
    res.status(400).json({ message: "Error logging in" });
  }
};

const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const hashedotp = await bcrypt.hash(otp.toString(), 10);

    user.otp = hashedotp;
    user.otpExpiry = new Date(Date.now() + 60 * 1000);

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "OTP",
      text: `your otp is ${otp}`,
    };
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const handleVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp || !email) {
      return res.status(400).json({ message: "OTP and email are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ismatched = await bcrypt.compare(otp.toString(), user.otp);
    const isExpired = Date.now() > user.otpExpiry;

    if (!ismatched) return res.status(400).json({ message: "Invalid OTP" });
    if (isExpired) return res.status(400).json({ message: "OTP Expired" });

    return res.status(200).json({ message: "OTP validated" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password; 
    await user.save();

    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  handleForgotPassword,
  handleVerifyOtp,
  resetPassword,
};
