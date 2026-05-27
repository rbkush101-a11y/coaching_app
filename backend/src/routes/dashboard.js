const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const { Student, Teacher, Fee, Payment, Attendance, Salary } = require('../models');

const router = express.Router();

// GET /api/dashboard/summary?academicYear=&from=&to=
router.get(
    '/summary',
    asyncHandler(async (req, res) => {
        const { academicYear = '2025-2026' } = req.query;

        const [studentsCount, teachersCount, feesPendingCount, attendanceAgg, revenueAgg] = await Promise.all([
            Student.countDocuments({ academicYear, status: 'active' }),
            Teacher.countDocuments({ academicYear, status: 'active' }),
            Fee.countDocuments({ academicYear, status: 'pending' }),
            Attendance.aggregate([
                { $match: { academicYear, type: 'student' } },
                {
                    $group: {
                        _id: '$status',
                        c: { $sum: 1 },
                    },
                },
            ]),
            Payment.aggregate([
                { $match: { academicYear } },
                { $group: { _id: null, total: { $sum: '$amountPaid' } } },
            ]),
        ]);

        const presentCount = attendanceAgg.find(x => x._id === 'present')?.c || 0;
        const totalAttendance = attendanceAgg.reduce((a, x) => a + x.c, 0);
        const attendancePct = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0;

        const revenue = revenueAgg[0]?.total || 0;

        const performanceAvgAgg = await Student.aggregate([
            { $match: { academicYear, status: 'active' } },
            { $group: { _id: null, avg: { $avg: '$performancePct' } } },
        ]);

        const performanceAvg = Math.round(performanceAvgAgg[0]?.avg || 0);

        const salaryUnpaid = await Salary.countDocuments({ academicYear, paidStatus: 'unpaid' });

        return ok(res, {
            summary: {
                studentsCount,
                teachersCount,
                feesPendingCount,
                attendancePct,
                performanceAvg,
                revenue,
                salaryUnpaid,
            },
        });
    })
);

module.exports = router;

