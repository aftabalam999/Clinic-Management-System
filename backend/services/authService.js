const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class AuthService {
  async registerUser(userData) {
    const { name, email, password, role } = userData;
    const user = await User.create({ name, email, password, role });
    logger.info(`New user registered: ${email} with role ${role}`);
    return this.getSignedJwtToken(user);
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw new Error('Please provide an email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    logger.info(`User logged in: ${email}`);
    return this.getSignedJwtToken(user);
  }

  getSignedJwtToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
  }
}

module.exports = new AuthService();
