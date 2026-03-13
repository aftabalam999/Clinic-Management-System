const express = require('express');
const { addPrescription, getPatientPrescriptions } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('Doctor'), addPrescription);

router.route('/:patientId')
  .get(authorize('Doctor', 'Admin', 'Receptionist'), getPatientPrescriptions);

module.exports = router;
