import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['Shortlisted', 'Rejected', 'Processing', 'Uncategorized'], required: true },
  skills: { type: String, required: true },
  college: { type: String, required: true },
  batch: { type: String, required: true },
  experience: { type: String, required: true },
  resume: { type: String, required: true }
  
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
