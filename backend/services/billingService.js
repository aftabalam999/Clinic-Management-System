const Bill = require('../models/Bill');
const logger = require('../utils/logger');

class BillingService {
  async generateBill(data) {
    const { patientId, consultationFee, medicineCost } = data;
    const totalAmount = Number(consultationFee) + Number(medicineCost);

    const bill = await Bill.create({
      patientId,
      consultationFee,
      medicineCost,
      totalAmount,
      paymentStatus: 'Paid' // default to paid for now based on simple flow
    });

    logger.info(`Bill generated successfully for patient ${patientId}. Amount: ₹${totalAmount}`);
    return bill;
  }

  async getPatientBills(patientId) {
    return await Bill.find({ patientId }).sort('-date');
  }
}

module.exports = new BillingService();
