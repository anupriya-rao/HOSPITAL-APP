const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  accessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessedByName: { type: String, required: true },
  accessedByRole: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, required: true },
  action: { type: String, required: true }, // 'VIEW', 'ADD_VISIT', 'FLAG'
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);