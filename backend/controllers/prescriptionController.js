const prescriptionService = require('../services/prescriptionService');
const logger = require('../utils/logger');

exports.addPrescription = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const prescription = await prescriptionService.addPrescription(req.body, doctorId);
    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    logger.error(`Error in addPrescription: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const history = await prescriptionService.getPatientHistory(patientId);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    logger.error(`Error in getPatientPrescriptions: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};
