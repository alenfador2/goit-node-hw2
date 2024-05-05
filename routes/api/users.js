const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../controllers/auth.middleware');

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        status: 'failed',
        code: 409,
        message: 'Email in use!',
      });
    }

    const newUser = await new User({ email, password });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'User created succesfully!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Błąd z Joi lub innej biblioteki aplikacji',
    });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        status: 'failed',
        code: 401,
        message: 'Email or password is wrong!',
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'failed',
        code: 401,
        message: 'Email or password is wrong!',
      });
    }

    const token = await jwt.sign(
      { userId: existingUser._id },
      process.env.SECRET,
      {
        expiresIn: '6h',
      }
    );

    existingUser.token = token;

    await existingUser.save();

    return res.status(200).json({
      token,
      user: {
        email: existingUser.email,
        subscription: existingUser.subscription,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/logout', verifyToken, async (req, res, next) => {
  const userId = req.user._id;
  await console.log(req.user);
  try {
    const user = await User.findOne(userId);

    if (!user) {
      return res.status(401).json({
        status: 'failed',
        code: 401,
        message: 'Not authorized',
      });
    }
    user.token = null;
    await user.save();
    return res
      .status(204)
      .json({
        code: 204,
        message: 'User logout',
      })
      .end();
  } catch (error) {
    next(error);
  }
});

router.get('/current', verifyToken, async (req, res, next) => {
  try {
    res.json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
