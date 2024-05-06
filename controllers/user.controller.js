const mg = require('../mailgunConfig');
require('dotenv').config('../config.env');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/users');

const verifyUser = async (req, res, next) => {
  try {
    const verificationToken = req.params.verificationToken;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.verify = true;
    user.verificationToken = null;
    await user.save();
    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${process.env.BASE_URL}/api/users/verify/${verificationToken}`,
  };

  await mg.messages().send(mailOptions);
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: 'Missing required field email' });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: 'Verification has already been passed' });
    }
    const verificationToken = uuidv4();
    user.verificationToken = verificationToken;
    await user.save();
    await sendVerificationEmail(user.email, verificationToken);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyUser, sendVerificationEmail, resendVerificationEmail };
