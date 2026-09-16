const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: Number, required: true, unique: true, index: true },
  complainant: { type: String, required: true, lowercase: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending', index: true },
  timestamp: { type: Date, required: true },
  transactionHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

complaintSchema.index({ title: 'text', description: 'text', complainant: 'text' });

module.exports = mongoose.model('Complaint', complaintSchema);