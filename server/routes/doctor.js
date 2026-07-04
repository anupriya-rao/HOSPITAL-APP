const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');

router.post('/visit/:patientId', auth(['doctor']), async (req, res) => {
  try {
    const { hospital, diagnosis, prescription, notes } = req.body;
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const conflicts = prescription.filter(drug =>
      patient.allergies.some(allergy => allergy.toLowerCase() === drug.toLowerCase())
    );
    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Drug conflict detected', conflicts });
    }
    patient.medicalHistory.push({ hospital, doctor: req.user.name, diagnosis, prescription, notes, date: new Date() });
    await patient.save();
    await AuditLog.create({
      accessedBy: req.user.id,
      accessedByName: req.user.name,
      accessedByRole: req.user.role,
      patientId: patient._id,
      patientName: patient.name,
      action: 'ADD_VISIT'
    });
    res.status(201).json({ message: 'Visit recorded successfully', medicalHistory: patient.medicalHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/flag/:patientId', auth(['doctor']), async (req, res) => {
  try {
    const { highRisk, chronic } = req.body;
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    if (highRisk !== undefined) patient.highRisk = highRisk;
    if (chronic !== undefined) patient.chronic = chronic;
    await patient.save();
    await AuditLog.create({
      accessedBy: req.user.id,
      accessedByName: req.user.name,
      accessedByRole: req.user.role,
      patientId: patient._id,
      patientName: patient.name,
      action: 'FLAG'
    });
    res.json({ message: 'Patient flags updated', highRisk: patient.highRisk, chronic: patient.chronic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
