const billingService = require('../services/billingService');
const logger = require('../utils/logger');

exports.generateBill = async (req, res) => {
  try {
    const bill = await billingService.generateBill(req.body);
    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    logger.error(`Error in generateBill: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPatientBills = async (req, res) => {
  try {
    const { patientId } = req.params;
    const bills = await billingService.getPatientBills(patientId);
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    logger.error(`Error in getPatientBills: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};
