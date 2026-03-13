const express = require('express');
const { generateBill, getPatientBills } = require('../controllers/billingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('Receptionist', 'Admin'), generateBill);

router.route('/:patientId')
  .get(authorize('Receptionist', 'Admin', 'Doctor'), getPatientBills);

module.exports = router;
