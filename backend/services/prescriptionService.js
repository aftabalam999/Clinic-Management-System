const Prescription = require('../models/Prescription');
const Token = require('../models/Token');
const logger = require('../utils/logger');

class PrescriptionService {
  async addPrescription(data, doctorId) {
    const { patientId, diagnosis, medicines, notes, tokenId } = data;
    
    const prescription = await Prescription.create({
      patientId,
      doctorId,
      diagnosis,
      medicines,
      notes
    });

    if (tokenId) {
      await Token.findByIdAndUpdate(tokenId, { status: 'Completed' });
      logger.info(`Token #${tokenId} marked as completed during prescription generation`);
    }

    logger.info(`Prescription added for patient ${patientId} by doctor ${doctorId}`);
    return prescription;
  }

  async getPatientHistory(patientId) {
    return await Prescription.find({ patientId }).populate('doctorId', 'name').sort('-date');
  }
}

module.exports = new PrescriptionService();
