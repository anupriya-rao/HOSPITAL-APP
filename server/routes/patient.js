const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const User = require('../models/User');
const QRCode = require('qrcode');
const auth = require('../middleware/auth');

router.post('/create', auth(['patient', 'doctor', 'admin']), async (req, res) => {
  try {
    const { name, age, gender, phone, bloodGroup, allergies, chronicConditions, emergencyContact } = req.body;
    const existing = await Patient.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'Patient with this phone already exists' });
    const patient = new Patient({ name, age, gender, phone, bloodGroup, allergies, chronicConditions, emergencyContact });
    await patient.save();
    const qrData = `http://127.0.0.1:8000/api/patient/scan/${patient._id}`;
    const qrCode = await QRCode.toDataURL(qrData);
    patient.qrCode = qrCode;
    await patient.save();
    await User.findByIdAndUpdate(req.user.id, { linkedId: patient._id });
    res.status(201).json({ message: 'Patient profile created successfully', patientId: patient._id, qrCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-profile', auth(['patient']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.linkedId) return res.status(404).json({ message: 'No patient profile linked' });
    const patient = await Patient.findById(user.linkedId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/profile/:id', auth(['patient', 'doctor', 'admin']), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/scan/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ name: patient.name, age: patient.age, gender: patient.gender, bloodGroup: patient.bloodGroup, allergies: patient.allergies, chronicConditions: patient.chronicConditions, emergencyContact: patient.emergencyContact, medicalHistory: patient.medicalHistory || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search/phone/:phone', auth(['doctor', 'admin']), async (req, res) => {
  try {
    const patient = await Patient.findOne({ phone: req.params.phone });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
