const express = require('express');
const router = express.Router();
const { fetchUsers } = require('./users-controller');
const {verifyToken} = require('../middleware/tokenVerification');

router.get('/users', verifyToken, fetchUsers);

module.exports = router;
