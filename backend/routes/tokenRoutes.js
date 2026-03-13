const express = require('express');
const { createToken, getTokens, updateTokenStatus } = require('../controllers/tokenController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('Admin', 'Receptionist'), createToken)
  .get(authorize('Admin', 'Receptionist', 'Doctor'), getTokens);

router.route('/:id/status')
  .put(authorize('Admin', 'Receptionist', 'Doctor'), updateTokenStatus);

module.exports = router;
