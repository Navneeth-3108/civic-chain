const express = require('express');
const controller = require('../controllers/complaintController');

const router = express.Router();
router.get('/stats', controller.stats);
router.get('/blockchain', controller.blockchainInfo);
router.get('/', controller.listComplaints);
router.post('/', controller.createComplaint);
router.get('/:id', controller.getComplaint);
router.put('/:id/status', controller.updateStatus);

module.exports = router;