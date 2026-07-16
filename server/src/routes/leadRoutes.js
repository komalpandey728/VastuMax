const express = require('express');
const { createLead, getLeads, updateLeadStatus } = require('../controllers/leadController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { ROLES } = require('../constants');

const router = express.Router();

router.post('/', optionalAuth, createLead);

router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get('/', getLeads);
router.patch('/:id', updateLeadStatus);

module.exports = router;
