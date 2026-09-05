const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g. "Natural Calamities"
  region: { type: String, required: true },    // e.g. "Kerala"
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  proofLink: { type: String },                 // optional news article link
  mediaFiles: [{ type: String }],               // array of uploaded file paths
  scannerImage: { type: String, required: true },
  contactInfo: { type: String, required: true },
  requesterName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  addedBy: { type: String, enum: ['admin', 'public_request'], default: 'public_request' },
  isExample: { type: Boolean, default: false }, // for your demo campaigns
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);