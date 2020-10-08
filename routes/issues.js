const express = require('express');

const { addIssue, getIssues, getIssuesByProject, addIssueView } = require('../controllers/issues');

const router = express.Router();

router.route('/add').post(addIssue);
router.route('/getall').get(getIssues);
router.route('/get/:projectId').get(getIssuesByProject);
router.route('/:projectId/add').post(addIssueView);

module.exports = router;