const express = require('express');
const { createPatient, getPatients, getPatientById } = require('../controllers/patientController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All patient routes require auth

router.route('/')
  .post(authorize('Admin', 'Receptionist'), createPatient)
  .get(authorize('Admin', 'Receptionist', 'Doctor'), getPatients);

router.route('/:id')
  .get(authorize('Admin', 'Receptionist', 'Doctor'), getPatientById);

module.exports = router;
