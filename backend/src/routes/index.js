const express = require('express');

const students = require('./students');
const teachers = require('./teachers');
const fees = require('./fees');
const salary = require('./salary');
const attendance = require('./attendance');
const dashboard = require('./dashboard');
const demoSeed = require('./demoSeed');

const router = express.Router();

router.use('/students', students);
router.use('/teachers', teachers);
router.use('/fees', fees);
router.use('/salary', salary);
router.use('/attendance', attendance);
router.use('/dashboard', dashboard);
router.use('/demo', demoSeed);

// Basic info endpoint
router.get('/', (req, res) => {

    res.json({
        success: true,
        message: 'Coaching ERP API',
        routes: {
            summary: '/api/dashboard/summary',
            students: '/api/students',
            teachers: '/api/teachers',
            fees: '/api/fees',
            salary: '/api/salary',
            attendance: '/api/attendance',
        },
    });
});

module.exports = router;


