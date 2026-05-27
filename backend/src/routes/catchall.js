const express = require('express');

const router = express.Router();
router.get('/', (req, res) => {
    res.json({
        message: 'Coaching ERP API. Use /api/dashboard/summary, /api/students, /api/teachers, /api/fees, /api/salary, /api/attendance',
    });
});

module.exports = router;

