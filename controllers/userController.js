const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    // Validation

    if (!email || !password || !passwordVerify)
      return res.status(400).json({
        errorMessage: 'Please enter all required fields.',
      });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: 'Please enter a password of at least 6 characters.',
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: 'Please enter the same password twice for verification.',
      });

    // Existing eMail

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: 'An account with this email already exists.',
      });

    // Password Hash

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Save to DB

    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    // Create JWT Token

    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === 'development'
            ? 'lax'
            : process.env.NODE_ENV === 'production' && 'none',
        secure:
          process.env.NODE_ENV === 'development'
            ? false
            : process.env.NODE_ENV === 'production' && true,
      })
      .send();
  } catch (err) {
    res.status(500).send();
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation

    if (!email || !password)
      return res.status(400).json({
        errorMessage: 'Please enter all required fields.',
      });

    // Get Account

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(401).json({
        errorMessage: 'Wrong email or password.',
      });

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!correctPassword)
      return res.status(401).json({
        errorMessage: 'Wrong email or password.',
      });

    // Create JWT Token

    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === 'development'
            ? 'lax'
            : process.env.NODE_ENV === 'production' && 'none',
        secure:
          process.env.NODE_ENV === 'development'
            ? false
            : process.env.NODE_ENV === 'production' && true,
      })
      .send();
  } catch (err) {
    res.status(500).send();
  }
};

const userVerify = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(null);

    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);

    res.json(validatedUser.id);
  } catch (err) {
    return res.json(null);
  }
};

const userLogOut = (req, res) => {
  try {
    res
      .cookie('token', '', {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === 'development'
            ? 'lax' // Not allow different origins
            : process.env.NODE_ENV === 'production' && 'none',
        secure:
          process.env.NODE_ENV === 'development'
            ? false
            : process.env.NODE_ENV === 'production' && true,
        expires: new Date(0),
      })
      .send();
  } catch (err) {
    return res.json(null);
  }
};

module.exports = {
  userRegister,
  userLogin,
  userVerify,
  userLogOut,
};
