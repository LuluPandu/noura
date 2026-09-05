const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const verifyAdmin = require('../middleware/verifyAdmin');

// PUBLIC: Submit a new campaign request (goes in as "pending")
router.post('/submit', async (req, res) => {
  try {
    const campaign = new Campaign({ ...req.body, status: 'pending', addedBy: 'public_request' });
    await campaign.save();
    res.status(201).json({ message: 'Campaign submitted for review', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting campaign', error: err.message });
  }
});

// PUBLIC: Get all approved campaigns (homepage)
router.get('/approved', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'approved' });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching campaigns', error: err.message });
  }
});

// PUBLIC: Get single campaign by ID (detail page)
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching campaign', error: err.message });
  }
});

// ADMIN: Get all pending campaigns
router.get('/admin/pending', verifyAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'pending' });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending campaigns', error: err.message });
  }
});

// ADMIN: Approve a campaign
router.patch('/admin/approve/:id', verifyAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { returnDocument: 'after' }
    );
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Campaign approved', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Error approving campaign', error: err.message });
  }
});

// ADMIN: Reject a campaign
router.patch('/admin/reject/:id', verifyAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { returnDocument: 'after' }
    );
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Campaign rejected', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting campaign', error: err.message });
  }
});

module.exports = router;