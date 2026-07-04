const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');

router.post('/onboard-doctor', auth(['admin']), async (req, res) => {
  try {
    const { name, email, phone, specialization, hospital, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Doctor already registered' });
    const user = new User({ name, email, password, role: 'doctor' });
    await user.save();
    const doctor = new Doctor({ name, email, phone, specialization, hospital, linkedUserId: user._id });
    await doctor.save();
    await User.findByIdAndUpdate(user._id, { linkedId: doctor._id });
    res.status(201).json({ message: 'Doctor onboarded successfully', doctorId: doctor._id, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/verify-doctor/:doctorId', auth(['admin']), async (req, res) => {
  try {
    const { verified } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(req.params.doctorId, { verified }, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: `Doctor ${verified ? 'verified' : 'unverified'} successfully`, doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/doctors', auth(['admin']), async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/audit-logs', auth(['admin']), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics', auth(['admin']), async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const verifiedDoctors = await Doctor.countDocuments({ verified: true });
    const highRiskPatients = await Patient.countDocuments({ highRisk: true });
    const chronicPatients = await Patient.countDocuments({ chronic: true });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayLogs = await AuditLog.countDocuments({ timestamp: { $gte: todayStart } });
    res.json({ totalPatients, totalDoctors, verifiedDoctors, highRiskPatients, chronicPatients, todayFootfall: todayLogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
