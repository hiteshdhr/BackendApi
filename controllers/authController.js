const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/postgres");
const { registerSchema, loginSchema } = require("../middleware/validate");

// Register a new user
const registerUser = async (req, res, next) => {
  try {
    // validate input first
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // check if user already exists
    const [existingRows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // insert user into mysql
    const [result] = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.insertId,
        email: email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Login user and return token
const loginUser = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // check if user exists
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate jwt token - expires in 7 days
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    next(err);
  }
};

// Get logged in user's profile
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const [rows] = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getProfile };
