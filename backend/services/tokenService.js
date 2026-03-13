const Token = require('../models/Token');
const logger = require('../utils/logger');

class TokenService {
  async generateToken(patientId) {
    // get the last token created today
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const lastToken = await Token.findOne({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort('-tokenNumber');

    const newTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const token = await Token.create({
      tokenNumber: newTokenNumber,
      patientId,
      status: 'Waiting'
    });

    logger.info(`Token generated #${newTokenNumber} for patient ${patientId}`);
    return token;
  }

  async getQueue() {
    return await Token.find({ status: { $ne: 'Completed' } })
      .populate('patientId', 'name symptoms _id')
      .sort('tokenNumber');
  }

  async updateTokenStatus(tokenId, status) {
    const token = await Token.findById(tokenId);
    if(!token) throw new Error('Token not found');
    
    token.status = status;
    await token.save();
    
    logger.info(`Token #${token.tokenNumber} status updated to ${status}`);
    return token;
  }
}

module.exports = new TokenService();
