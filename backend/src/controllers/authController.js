

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: "Name, email and password are required.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must contain at least 8 characters.",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    return res.status(201).json({
      message: "Account created successfully.",
      user,
      token,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

// Login an existing user
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

// Get logged-in user's profile
export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    return res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Profile error:", error.message);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};