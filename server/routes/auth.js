const express = require("express");
const pool = require("../utils/db");
const dotenv = require("dotenv");
const { sendOtpEmail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

dotenv.config();

const router = express.Router();

const otpStore = {};

//generaye otp
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//request otp
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    //check if email available
    const userResult = await pool.query(
      "SELECT id, name, email FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 mins expiry

    //store otp
    otpStore[email] = { otp, expires };

    //send otp
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("REQUEST OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//verify otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }


    delete otpStore[email]; //clear otp if valid and verified

    //get user details
    const userResult = await pool.query(
      "SELECT id, name, email FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Verification successful" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//fetch scores
router.get("/dashboard", verifyToken, async (req, res) => {
  try {

    const userResult = await pool.query(
      "SELECT id, name, regno, dept, email FROM users WHERE id = $1",
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    //results
    const resultsResult = await pool.query(
      `SELECT 
        comprehension, programming, verbal, core, aptitude, totalPoints,
        subject_knowledge, communication_skills, body_language, listening_skills, active_participation
       FROM results WHERE userId = $1`,
      [user.id]
    );

    const results = resultsResult.rows[0] || {};

    res.json({ user, results });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
