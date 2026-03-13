const Patient = require('../models/Patient');
const logger = require('../utils/logger');

class PatientService {
  async addPatient(patientData) {
    const patient = await Patient.create(patientData);
    logger.info(`Patient created successfully: ${patient.name} (${patient._id})`);
    return patient;
  }

  async getAllPatients() {
    return await Patient.find().sort('-createdAt');
  }

  async getPatientById(id) {
    const patient = await Patient.findById(id);
    if (!patient) {
        throw new Error('Patient not found');
    }
    return patient;
  }
}

module.exports = new PatientService();
