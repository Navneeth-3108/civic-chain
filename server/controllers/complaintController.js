const Complaint = require('../models/Complaint');
const blockchain = require('../services/blockchainService');
const { statusNames, statusNameToContract } = require('../utils/status');

function errorMessage(error) {
  if (error.code === 'CALL_EXCEPTION') return 'The blockchain rejected this operation.';
  if (error.code === 'BAD_DATA' || error.code === 'NETWORK_ERROR') return 'Unable to connect to the blockchain.';
  return error.message || 'Request failed.';
}

async function createComplaint(req, res, next) {
  try {
    const { title, description, walletAddress } = req.body;
    if (!title?.trim() || !description?.trim() || !walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ success: false, message: 'Title, description, and a valid wallet address are required.' });
    }
    const result = await blockchain.registerComplaint(title.trim(), description.trim());
    const complaint = await Complaint.create({ ...result, status: 'Pending' });
    return res.status(201).json({ success: true, complaint, transactionHash: result.transactionHash });
  } catch (error) { return next(errorMessage(error)); }
}

async function listComplaints(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const filter = {};
    if (statusNames.includes(req.query.status)) filter.status = req.query.status;
    if (req.query.search) filter.$text = { $search: req.query.search };
    const [complaints, total] = await Promise.all([
      Complaint.find(filter).sort({ complaintId: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Complaint.countDocuments(filter)
    ]);
    return res.json({ success: true, complaints, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

async function getComplaint(req, res, next) {
  try {
    const complaint = await blockchain.getComplaint(Number(req.params.id));
    const indexed = await Complaint.findOne({ complaintId: complaint.complaintId }).lean();
    return res.json({ success: true, complaint: { ...complaint, transactionHash: indexed?.transactionHash || null } });
  } catch (error) { return next(errorMessage(error)); }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const contractStatus = statusNameToContract(status);
    if (contractStatus < 0) return res.status(400).json({ success: false, message: 'Status must be Pending, In Progress, or Resolved.' });
    const result = await blockchain.updateComplaintStatus(Number(req.params.id), contractStatus);
    const complaint = await Complaint.findOneAndUpdate({ complaintId: Number(req.params.id) }, { status, updatedAt: new Date() }, { new: true }).lean();
    return res.json({ success: true, complaint: complaint || result.complaint, transactionHash: result.transactionHash });
  } catch (error) { return next(errorMessage(error)); }
}

async function stats(req, res, next) {
  try {
    const groups = await Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const values = Object.fromEntries(groups.map((group) => [group._id, group.count]));
    return res.json({ success: true, stats: { total: Object.values(values).reduce((sum, count) => sum + count, 0), pending: values.Pending || 0, inProgress: values['In Progress'] || 0, resolved: values.Resolved || 0 } });
  } catch (error) { return next(error); }
}

async function blockchainInfo(req, res, next) {
  try { return res.json({ success: true, blockchain: await blockchain.getBlockchainInfo() }); } catch (error) { return next(errorMessage(error)); }
}

module.exports = { createComplaint, listComplaints, getComplaint, updateStatus, stats, blockchainInfo };