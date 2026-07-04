const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  phone: { type: String, required: true, unique: true },
  bloodGroup: { type: String },
  allergies: [String],
  chronicConditions: [String],
  highRisk: { type: Boolean, default: false },
  chronic: { type: Boolean, default: false },
  qrCode: { type: String },          // will store base64 QR image
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  medicalHistory: [
  {
    date: { type: Date, default: Date.now },
    hospital: String,
    doctor: String,
    diagnosis: String,
    prescription: [String],
    notes: String
  }
],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);