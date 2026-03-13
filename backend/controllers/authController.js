const authService = require('../services/authService');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  try {
    const token = await authService.registerUser(req.body);
    res.status(201).json({ success: true, token });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);
    res.status(200).json({ success: true, token });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(401).json({ success: false, error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
