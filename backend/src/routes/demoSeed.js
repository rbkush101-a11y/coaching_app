const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const { Student, Teacher } = require('../models');

// Convenience endpoint: seed everything in correct order
const router = express.Router();

router.post(
    '/seed-all',
    asyncHandler(async (req, res) => {
        const academicYear = req.body?.academicYear || '2025-2026';

        // Students
        await Student.deleteMany({ academicYear });
        const students = await Student.insertMany([
            { studentId: 'S-1001', name: 'Aarav Sharma', classLevel: 6, batch: 'Batch A', phone: '9000000001', gender: 'Male', attendancePct: 92, performancePct: 78, academicYear },
            { studentId: 'S-1002', name: 'Ishita Verma', classLevel: 7, batch: 'Batch B', phone: '9000000002', gender: 'Female', attendancePct: 88, performancePct: 85, academicYear },
            { studentId: 'S-1003', name: 'Vihaan Rao', classLevel: 8, batch: 'Batch A', phone: '9000000003', gender: 'Male', attendancePct: 95, performancePct: 91, academicYear },
            { studentId: 'S-1004', name: 'Anaya Singh', classLevel: 9, batch: 'Batch C', phone: '9000000004', gender: 'Female', attendancePct: 81, performancePct: 73, academicYear },
            { studentId: 'S-1005', name: 'Kabir Patel', classLevel: 10, batch: 'Batch B', phone: '9000000005', gender: 'Male', attendancePct: 86, performancePct: 88, academicYear },
        ]);

        // Teachers
        await Teacher.deleteMany({ academicYear });
        const teachers = await Teacher.insertMany([
            { teacherId: 'T-201', name: 'Ms. Neha Mehta', role: 'Teacher', subject: 'Mathematics', academicYear, salaryBase: 25000, rating: 4.2 },
            { teacherId: 'T-202', name: 'Mr. Rohit Kapoor', role: 'Teacher', subject: 'Science', academicYear, salaryBase: 24000, rating: 4.0 },
            { teacherId: 'A-301', name: 'Ms. Sara Khan', role: 'Admin', department: 'Operations', academicYear, salaryBase: 28000, rating: 3.9 },
        ]);

        // Fees / attendance / salary can be seeded via their module endpoints.
        return ok(res, {
            seeded: true,
            academicYear,
            students: students.length,
            teachers: teachers.length,
            next: {
                seedFees: '/api/fees/demo/seed',
                seedAttendance: '/api/attendance/demo/seed',
                seedSalary: '/api/salary/demo/seed',
            },
        });
    })
);

module.exports = router;

