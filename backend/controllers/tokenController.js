const tokenService = require('../services/tokenService');
const logger = require('../utils/logger');

exports.createToken = async (req, res) => {
  try {
    const { patientId } = req.body;
    if(!patientId) return res.status(400).json({ success: false, error: 'patientId is required' });
    
    const token = await tokenService.generateToken(patientId);
    res.status(201).json({ success: true, data: token });
  } catch (error) {
    logger.error(`Error in createToken: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getTokens = async (req, res) => {
  try {
    const queue = await tokenService.getQueue();
    res.status(200).json({ success: true, data: queue, count: queue.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateTokenStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const token = await tokenService.updateTokenStatus(req.params.id, status);
    res.status(200).json({ success: true, data: token });
  } catch (error) {
    logger.error(`Error in updateTokenStatus: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};
