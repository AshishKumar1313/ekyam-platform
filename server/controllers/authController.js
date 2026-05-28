import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOtp, sendVerificationEmail } from '../utils/email.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const userResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  community: user.community,
  role: user.role,
  isVerified: user.isVerified,
  ...(token && { token }),
});

export const register = async (req, res) => {
  try {
    const { name, email, password, community, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const exists = await User.findOne({ email });
    if (exists?.isVerified) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + OTP_EXPIRY_MS);
    const useEmailOtp = true;

    let user;
    if (exists) {
      exists.name = name;
      exists.password = password;
      exists.community = community ?? exists.community;
      exists.bio = bio ?? exists.bio;
      exists.otp = otp;
      exists.otpExpires = otpExpires;
      user = await exists.save();
    } else {
      user = await User.create({
        name,
        email,
        password,
        community,
        bio,
        isVerified: !useEmailOtp,
        otp: useEmailOtp ? otp : null,
        otpExpires: useEmailOtp ? otpExpires : null,
      });
    }

    if (!useEmailOtp) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(201).json({
        message: 'Account created successfully',
        ...userResponse(user, generateToken(user._id)),
      });
    }

    await sendVerificationEmail(email, name, otp);

    res.status(200).json({
      message: 'OTP sent! Please check your email inbox.',
      needsVerification: true,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'OTP expired or invalid email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    if (!user.otp || user.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please register again.' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(201).json({
      message: 'Verification successful! Account created.',
      ...userResponse(user, generateToken(user._id)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isVerified === false) {
      return res.status(403).json({
        message: 'Please verify your email first',
        needsVerification: true,
        email: user.email,
      });
    }

    res.json({
      message: 'Login successful',
      ...userResponse(user, generateToken(user._id)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name ?? user.name;
    user.community = req.body.community ?? user.community;
    user.bio = req.body.bio ?? user.bio;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      community: updated.community,
      bio: updated.bio,
      role: updated.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
