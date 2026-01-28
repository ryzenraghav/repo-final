const express = require("express");
const pool = require("../db");

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM aptitude WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// FETCH USER SCORES
router.get("/aptitude/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const result = await pool.query(
      "SELECT * FROM aptitude WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("FETCH SCORE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
