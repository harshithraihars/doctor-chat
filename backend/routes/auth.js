const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const dotenv = require("dotenv");
const { registerUser, loginUser, handleForgotPassword, handleVerifyOtp, resetPassword } = require("../Controller/UserController");

dotenv.config();

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password",handleForgotPassword)

router.post("/verify-otp",handleVerifyOtp)

router.post("/reset-password",resetPassword)

module.exports = router;
