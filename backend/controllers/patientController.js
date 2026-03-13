const patientService = require('../services/patientService');
const logger = require('../utils/logger');

exports.createPatient = async (req, res) => {
  try {
    const patient = await patientService.addPatient(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    logger.error(`Error in createPatient: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Patient not found' });
  }
};
