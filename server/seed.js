const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const QRCode = require('qrcode');

const doctors = [
  { name: 'Dr. Anil Kumar', email: 'anil@hospital.com', phone: '9876542001', specialization: 'Neurology', hospital: 'AIIMS Delhi' },
  { name: 'Dr. Meera Nair', email: 'meera@hospital.com', phone: '9876542002', specialization: 'Pediatrics', hospital: 'Safdarjung Hospital' },
  { name: 'Dr. Suresh Patel', email: 'suresh@hospital.com', phone: '9876542003', specialization: 'Orthopedics', hospital: 'RML Hospital' },
  { name: 'Dr. Kavita Rao', email: 'kavita@hospital.com', phone: '9876542004', specialization: 'Cardiology', hospital: 'AIIMS Delhi' },
  { name: 'Dr. Rajesh Gupta', email: 'rajesh@hospital.com', phone: '9876542005', specialization: 'Dermatology', hospital: 'Lok Nayak Hospital' },
  { name: 'Dr. Pooja Sharma', email: 'pooja@hospital.com', phone: '9876542006', specialization: 'Gynecology', hospital: 'Safdarjung Hospital' },
  { name: 'Dr. Amit Verma', email: 'amit@hospital.com', phone: '9876542007', specialization: 'Urology', hospital: 'RML Hospital' },
  { name: 'Dr. Sneha Joshi', email: 'sneha@hospital.com', phone: '9876542008', specialization: 'Psychiatry', hospital: 'NIMHANS' },
  { name: 'Dr. Vikram Singh', email: 'vikram@hospital.com', phone: '9876542009', specialization: 'Gastroenterology', hospital: 'AIIMS Delhi' },
  { name: 'Dr. Anita Desai', email: 'anita@hospital.com', phone: '9876542010', specialization: 'Endocrinology', hospital: 'Safdarjung Hospital' },
  { name: 'Dr. Rohit Malhotra', email: 'rohit@hospital.com', phone: '9876542011', specialization: 'Pulmonology', hospital: 'RML Hospital' },
  { name: 'Dr. Priya Iyer', email: 'priya@hospital.com', phone: '9876542012', specialization: 'Nephrology', hospital: 'AIIMS Delhi' },
  { name: 'Dr. Sanjay Bose', email: 'sanjay@hospital.com', phone: '9876542013', specialization: 'Oncology', hospital: 'Tata Memorial' },
  { name: 'Dr. Deepa Menon', email: 'deepa@hospital.com', phone: '9876542014', specialization: 'Rheumatology', hospital: 'Safdarjung Hospital' },
  { name: 'Dr. Rahul Khanna', email: 'rahul@hospital.com', phone: '9876542015', specialization: 'Ophthalmology', hospital: 'AIIMS Delhi' },
  { name: 'Dr. Nisha Tripathi', email: 'nisha@hospital.com', phone: '9876542016', specialization: 'ENT', hospital: 'RML Hospital' },
  { name: 'Dr. Manoj Tiwari', email: 'manoj@hospital.com', phone: '9876542017', specialization: 'General Surgery', hospital: 'Lok Nayak Hospital' },
  { name: 'Dr. Sunita Pillai', email: 'sunita@hospital.com', phone: '9876542018', specialization: 'Anesthesiology', hospital: 'AIIMS Delhi' },
  { name: 'Dr. Arun Chakraborty', email: 'arun@hospital.com', phone: '9876542019', specialization: 'Radiology', hospital: 'Safdarjung Hospital' },
  { name: 'Dr. Lakshmi Reddy', email: 'lakshmi@hospital.com', phone: '9876542020', specialization: 'Hematology', hospital: 'AIIMS Delhi' },
  { name: 'Dr. Gaurav Mishra', email: 'gaurav@hospital.com', phone: '9876542021', specialization: 'Cardiology', hospital: 'Fortis Hospital' },
  { name: 'Dr. Ritu Agarwal', email: 'ritu@hospital.com', phone: '9876542022', specialization: 'Neurology', hospital: 'Max Hospital' },
  { name: 'Dr. Harsh Vardhan', email: 'harsh@hospital.com', phone: '9876542023', specialization: 'Orthopedics', hospital: 'Apollo Hospital' },
  { name: 'Dr. Pallavi Saxena', email: 'pallavi@hospital.com', phone: '9876542024', specialization: 'Dermatology', hospital: 'Medanta' },
  { name: 'Dr. Nikhil Banerjee', email: 'nikhil@hospital.com', phone: '9876542025', specialization: 'Gastroenterology', hospital: 'Fortis Hospital' },
  { name: 'Dr. Swati Kulkarni', email: 'swati@hospital.com', phone: '9876542026', specialization: 'Pediatrics', hospital: 'Max Hospital' },
  { name: 'Dr. Vivek Srivastava', email: 'vivek@hospital.com', phone: '9876542027', specialization: 'Urology', hospital: 'Apollo Hospital' },
  { name: 'Dr. Madhuri Dixit', email: 'madhuri@hospital.com', phone: '9876542028', specialization: 'Gynecology', hospital: 'Medanta' },
  { name: 'Dr. Prasad Naik', email: 'prasad@hospital.com', phone: '9876542029', specialization: 'Pulmonology', hospital: 'Fortis Hospital' },
  { name: 'Dr. Archana Bhatt', email: 'archana@hospital.com', phone: '9876542030', specialization: 'Endocrinology', hospital: 'Max Hospital' },
];

const patients = [
  { name: 'Aarav Sharma', age: 32, gender: 'Male', phone: '9876541001', bloodGroup: 'A+', allergies: ['Aspirin'], chronicConditions: ['Hypertension'] },
  { name: 'Priya Singh', age: 28, gender: 'Female', phone: '9876541002', bloodGroup: 'B+', allergies: [], chronicConditions: [] },
  { name: 'Rohan Mehta', age: 45, gender: 'Male', phone: '9876541003', bloodGroup: 'O+', allergies: ['Penicillin'], chronicConditions: ['Diabetes', 'Hypertension'] },
  { name: 'Ananya Gupta', age: 55, gender: 'Female', phone: '9876541004', bloodGroup: 'AB+', allergies: ['Sulfa'], chronicConditions: ['Arthritis'] },
  { name: 'Vikram Joshi', age: 38, gender: 'Male', phone: '9876541005', bloodGroup: 'A-', allergies: [], chronicConditions: ['Asthma'] },
  { name: 'Divya Nair', age: 42, gender: 'Female', phone: '9876541006', bloodGroup: 'O-', allergies: ['Ibuprofen'], chronicConditions: ['Thyroid'] },
  { name: 'Arjun Patel', age: 61, gender: 'Male', phone: '9876541007', bloodGroup: 'B-', allergies: ['Codeine'], chronicConditions: ['Diabetes', 'Heart Disease'] },
  { name: 'Sneha Reddy', age: 25, gender: 'Female', phone: '9876541008', bloodGroup: 'A+', allergies: [], chronicConditions: [] },
  { name: 'Karan Verma', age: 48, gender: 'Male', phone: '9876541009', bloodGroup: 'B+', allergies: ['Aspirin', 'Penicillin'], chronicConditions: ['Hypertension'] },
  { name: 'Pooja Iyer', age: 35, gender: 'Female', phone: '9876541010', bloodGroup: 'O+', allergies: [], chronicConditions: ['PCOD'] },
  { name: 'Rahul Malhotra', age: 52, gender: 'Male', phone: '9876541011', bloodGroup: 'AB-', allergies: ['Sulfa'], chronicConditions: ['Diabetes', 'Kidney Disease'] },
  { name: 'Neha Bose', age: 29, gender: 'Female', phone: '9876541012', bloodGroup: 'A+', allergies: [], chronicConditions: [] },
  { name: 'Sanjay Pillai', age: 67, gender: 'Male', phone: '9876541013', bloodGroup: 'B+', allergies: ['Penicillin'], chronicConditions: ['Heart Disease', 'Diabetes', 'Hypertension'] },
  { name: 'Meera Chakraborty', age: 44, gender: 'Female', phone: '9876541014', bloodGroup: 'O+', allergies: ['Ibuprofen'], chronicConditions: ['Migraine'] },
  { name: 'Aditya Tiwari', age: 31, gender: 'Male', phone: '9876541015', bloodGroup: 'A-', allergies: [], chronicConditions: [] },
  { name: 'Kavya Desai', age: 58, gender: 'Female', phone: '9876541016', bloodGroup: 'B+', allergies: ['Aspirin'], chronicConditions: ['Osteoporosis', 'Thyroid'] },
  { name: 'Suresh Kulkarni', age: 40, gender: 'Male', phone: '9876541017', bloodGroup: 'O+', allergies: [], chronicConditions: ['Asthma'] },
  { name: 'Lakshmi Menon', age: 72, gender: 'Female', phone: '9876541018', bloodGroup: 'AB+', allergies: ['Codeine', 'Sulfa'], chronicConditions: ['Arthritis', 'Hypertension', 'Diabetes'] },
  { name: 'Gaurav Saxena', age: 36, gender: 'Male', phone: '9876541019', bloodGroup: 'A+', allergies: [], chronicConditions: [] },
  { name: 'Ritu Agarwal', age: 47, gender: 'Female', phone: '9876541020', bloodGroup: 'B-', allergies: ['Penicillin'], chronicConditions: ['Lupus'] },
  { name: 'Nikhil Srivastava', age: 53, gender: 'Male', phone: '9876541021', bloodGroup: 'O+', allergies: [], chronicConditions: ['Diabetes'] },
  { name: 'Pallavi Khanna', age: 27, gender: 'Female', phone: '9876541022', bloodGroup: 'A+', allergies: ['Aspirin'], chronicConditions: [] },
  { name: 'Vivek Tripathi', age: 64, gender: 'Male', phone: '9876541023', bloodGroup: 'B+', allergies: ['Ibuprofen'], chronicConditions: ['Heart Disease', 'Hypertension'] },
  { name: 'Swati Banerjee', age: 39, gender: 'Female', phone: '9876541024', bloodGroup: 'O-', allergies: [], chronicConditions: ['PCOD', 'Thyroid'] },
  { name: 'Manoj Bhatt', age: 56, gender: 'Male', phone: '9876541025', bloodGroup: 'AB+', allergies: ['Sulfa'], chronicConditions: ['Diabetes', 'Kidney Disease'] },
  { name: 'Archana Naik', age: 33, gender: 'Female', phone: '9876541026', bloodGroup: 'A+', allergies: [], chronicConditions: [] },
  { name: 'Prasad Rao', age: 70, gender: 'Male', phone: '9876541027', bloodGroup: 'B+', allergies: ['Penicillin', 'Codeine'], chronicConditions: ['Heart Disease', 'Diabetes', 'Arthritis'] },
  { name: 'Madhuri Jain', age: 46, gender: 'Female', phone: '9876541028', bloodGroup: 'O+', allergies: [], chronicConditions: ['Hypertension'] },
  { name: 'Harsh Pandey', age: 29, gender: 'Male', phone: '9876541029', bloodGroup: 'A-', allergies: ['Aspirin'], chronicConditions: [] },
  { name: 'Sunita Chauhan', age: 61, gender: 'Female', phone: '9876541030', bloodGroup: 'B+', allergies: ['Sulfa'], chronicConditions: ['Osteoporosis', 'Thyroid', 'Diabetes'] },
  { name: 'Deepak Mishra', age: 43, gender: 'Male', phone: '9876541031', bloodGroup: 'O+', allergies: [], chronicConditions: ['Asthma'] },
  { name: 'Nisha Kapoor', age: 37, gender: 'Female', phone: '9876541032', bloodGroup: 'AB-', allergies: ['Ibuprofen'], chronicConditions: [] },
  { name: 'Rajiv Chandra', age: 59, gender: 'Male', phone: '9876541033', bloodGroup: 'A+', allergies: ['Penicillin'], chronicConditions: ['Heart Disease', 'Hypertension'] },
  { name: 'Geeta Varma', age: 51, gender: 'Female', phone: '9876541034', bloodGroup: 'B+', allergies: [], chronicConditions: ['Diabetes', 'Migraine'] },
  { name: 'Siddharth Roy', age: 26, gender: 'Male', phone: '9876541035', bloodGroup: 'O+', allergies: [], chronicConditions: [] },
  { name: 'Tanvi Ghosh', age: 34, gender: 'Female', phone: '9876541036', bloodGroup: 'A+', allergies: ['Codeine'], chronicConditions: ['Anxiety'] },
  { name: 'Abhishek Lal', age: 49, gender: 'Male', phone: '9876541037', bloodGroup: 'B-', allergies: ['Aspirin', 'Sulfa'], chronicConditions: ['Diabetes', 'Kidney Disease'] },
  { name: 'Rekha Pandey', age: 65, gender: 'Female', phone: '9876541038', bloodGroup: 'O+', allergies: [], chronicConditions: ['Arthritis', 'Osteoporosis', 'Hypertension'] },
  { name: 'Mohit Thakur', age: 30, gender: 'Male', phone: '9876541039', bloodGroup: 'AB+', allergies: [], chronicConditions: [] },
  { name: 'Shweta Dubey', age: 41, gender: 'Female', phone: '9876541040', bloodGroup: 'A+', allergies: ['Penicillin'], chronicConditions: ['PCOD'] },
  { name: 'Kunal Shukla', age: 57, gender: 'Male', phone: '9876541041', bloodGroup: 'B+', allergies: [], chronicConditions: ['Heart Disease', 'Diabetes'] },
  { name: 'Isha Bajaj', age: 23, gender: 'Female', phone: '9876541042', bloodGroup: 'O-', allergies: ['Ibuprofen'], chronicConditions: [] },
  { name: 'Tarun Oberoi', age: 68, gender: 'Male', phone: '9876541043', bloodGroup: 'A-', allergies: ['Sulfa', 'Codeine'], chronicConditions: ['Heart Disease', 'Hypertension', 'Diabetes'] },
  { name: 'Monika Sethi', age: 44, gender: 'Female', phone: '9876541044', bloodGroup: 'B+', allergies: [], chronicConditions: ['Thyroid', 'Migraine'] },
  { name: 'Rajan Bhatia', age: 35, gender: 'Male', phone: '9876541045', bloodGroup: 'O+', allergies: [], chronicConditions: [] },
  { name: 'Sarita Mathur', age: 53, gender: 'Female', phone: '9876541046', bloodGroup: 'AB+', allergies: ['Aspirin'], chronicConditions: ['Lupus', 'Thyroid'] },
  { name: 'Dinesh Jha', age: 47, gender: 'Male', phone: '9876541047', bloodGroup: 'A+', allergies: [], chronicConditions: ['Asthma', 'Hypertension'] },
  { name: 'Usha Sinha', age: 74, gender: 'Female', phone: '9876541048', bloodGroup: 'B+', allergies: ['Penicillin'], chronicConditions: ['Diabetes', 'Arthritis', 'Heart Disease'] },
  { name: 'Pankaj Rastogi', age: 38, gender: 'Male', phone: '9876541049', bloodGroup: 'O+', allergies: ['Ibuprofen'], chronicConditions: [] },
  { name: 'Vandana Awasthi', age: 60, gender: 'Female', phone: '9876541050', bloodGroup: 'A+', allergies: ['Sulfa'], chronicConditions: ['Osteoporosis', 'Diabetes', 'Hypertension'] },
];

const visitTemplates = [
  { diagnosis: 'Routine Checkup', prescription: ['Vitamin D', 'Calcium'], notes: 'Patient in good health. Follow up in 3 months.', hospital: 'AIIMS Delhi' },
  { diagnosis: 'Fever and Viral Infection', prescription: ['Paracetamol', 'Cetirizine', 'Amoxicillin'], notes: 'Viral infection. Rest advised for 5 days.', hospital: 'Safdarjung Hospital' },
  { diagnosis: 'Blood Pressure Follow-up', prescription: ['Amlodipine', 'Metoprolol'], notes: 'BP under control. Continue medication.', hospital: 'RML Hospital' },
  { diagnosis: 'Diabetes Management', prescription: ['Metformin', 'Glipizide'], notes: 'HbA1c slightly elevated. Dietary changes recommended.', hospital: 'AIIMS Delhi' },
  { diagnosis: 'Back Pain', prescription: ['Diclofenac', 'Muscle Relaxant'], notes: 'Physiotherapy recommended twice a week.', hospital: 'Safdarjung Hospital' },
  { diagnosis: 'Thyroid Checkup', prescription: ['Levothyroxine'], notes: 'TSH levels normal. Continue current dose.', hospital: 'Max Hospital' },
  { diagnosis: 'Asthma Follow-up', prescription: ['Salbutamol', 'Budesonide'], notes: 'Avoid dust and smoke. Use inhaler as needed.', hospital: 'Fortis Hospital' },
  { diagnosis: 'Migraine Treatment', prescription: ['Sumatriptan', 'Propranolol'], notes: 'Avoid trigger foods. Stress management advised.', hospital: 'Apollo Hospital' },
  { diagnosis: 'Arthritis Management', prescription: ['Hydroxychloroquine', 'Folic Acid'], notes: 'Joint pain managed. Physical therapy ongoing.', hospital: 'Medanta' },
  { diagnosis: 'Chest Pain Evaluation', prescription: ['Aspirin', 'Atorvastatin', 'Nitroglycerin'], notes: 'ECG normal. Stress test recommended.', hospital: 'AIIMS Delhi' },
  { diagnosis: 'Kidney Function Test', prescription: ['Furosemide', 'Potassium'], notes: 'Creatinine slightly elevated. Reduce protein intake.', hospital: 'RML Hospital' },
  { diagnosis: 'Skin Rash Treatment', prescription: ['Hydrocortisone', 'Antihistamine'], notes: 'Allergic reaction. Avoid identified allergen.', hospital: 'Lok Nayak Hospital' },
];

const doctorNames = doctors.map(d => d.name);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected\n');

  // Create doctors
  console.log('Creating 30 doctors...');
  for (const d of doctors) {
    const existing = await User.findOne({ email: d.email });
    if (existing) { console.log(`  ⏭ ${d.name} already exists`); continue; }
    const user = new User({ name: d.name, email: d.email, password: 'doctor123', role: 'doctor' });
    await user.save();
    const doctor = new Doctor({ name: d.name, email: d.email, phone: d.phone, specialization: d.specialization, hospital: d.hospital, verified: true, linkedUserId: user._id });
    await doctor.save();
    await User.findByIdAndUpdate(user._id, { linkedId: doctor._id });
    console.log(`  ✅ ${d.name} — ${d.specialization}`);
  }

  // Create patients
  console.log('\nCreating 50 patients...');
  for (const p of patients) {
    const existing = await Patient.findOne({ phone: p.phone });
    if (existing) { console.log(`  ⏭ ${p.name} already exists`); continue; }

    const patient = new Patient({
      ...p,
      highRisk: p.chronicConditions.length > 1,
      chronic: p.chronicConditions.length > 0,
    });

    // Add 2-5 random visits
    const numVisits = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numVisits; i++) {
      const visit = visitTemplates[Math.floor(Math.random() * visitTemplates.length)];
      patient.medicalHistory.push({
        hospital: visit.hospital,
        doctor: doctorNames[Math.floor(Math.random() * doctorNames.length)],
        diagnosis: visit.diagnosis,
        prescription: visit.prescription,
        notes: visit.notes,
        date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
      });
    }

    const qrCode = await QRCode.toDataURL(`http://127.0.0.1:8000/api/patient/scan/${patient._id}`);
    patient.qrCode = qrCode;
    await patient.save();

    // Create login
    const firstName = p.name.split(' ')[0].toLowerCase();
    const email = `${firstName}${p.phone.slice(-4)}@test.com`;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      const user = new User({ name: p.name, email, password: 'patient123', role: 'patient' });
      await user.save();
      await User.findByIdAndUpdate(user._id, { linkedId: patient._id });
    }
    console.log(`  ✅ ${p.name} | ${p.bloodGroup} | ${p.chronicConditions.length} conditions`);
  }

  console.log('\n🎉 Seed complete!')
  console.log('\n📋 All doctor logins (password: doctor123):')
  doctors.forEach(d => console.log(`  ${d.email}`))
  console.log('\n👤 Sample patient logins (password: patient123):')
  patients.slice(0, 5).forEach(p => {
    const email = `${p.name.split(' ')[0].toLowerCase()}${p.phone.slice(-4)}@test.com`
    console.log(`  ${email}`)
  })
  process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });
