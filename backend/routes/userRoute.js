const express = require("express");
const dotenv = require("dotenv");
const { registerUser, loginUser, handleForgotPassword, handleVerifyOtp, resetPassword,fireBaseLogin } = require("../Controller/UserController");

dotenv.config();

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/firebase-login",fireBaseLogin)

router.post("/forgot-password",handleForgotPassword)

router.post("/verify-otp",handleVerifyOtp)

router.post("/reset-password",resetPassword)

module.exports = router;
