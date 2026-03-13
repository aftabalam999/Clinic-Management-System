const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: Number,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  status: {
    type: String,
    enum: ['Waiting', 'In-progress', 'Completed', 'Cancelled'],
    default: 'Waiting'
  },
  priority: {
    type: String,
    enum: ['Normal', 'VIP', 'Emergency'],
    default: 'Normal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Token', TokenSchema);
