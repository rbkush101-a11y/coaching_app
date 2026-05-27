const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const { Student } = require('../models');

const router = express.Router();

// GET /api/students?search=&classLevel=&academicYear=
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { search = '', classLevel, academicYear = '2025-2026', limit = 50, page = 1 } = req.query;
        const q = { academicYear };

        if (classLevel) q.classLevel = Number(classLevel);
        if (search) q.name = { $regex: String(search), $options: 'i' };

        const p = Math.max(1, Number(page));
        const l = Math.min(200, Math.max(1, Number(limit)));

        const [items, total] = await Promise.all([
            Student.find(q)
                .sort({ createdAt: -1 })
                .skip((p - 1) * l)
                .limit(l),
            Student.countDocuments(q),
        ]);

        return ok(res, { items, total, page: p, limit: l });
    })
);

// GET /api/students/:studentId
router.get(
    '/:studentId',
    asyncHandler(async (req, res) => {
        const student = await Student.findOne({ studentId: req.params.studentId });
        if (!student) return fail(res, 404, 'Student not found');
        return ok(res, { student });
    })
);

// POST /api/students (create)
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const body = req.body || {};
        const academicYear = body.academicYear || '2025-2026';

        if (!body.studentId || !body.name || !body.classLevel) {
            return fail(res, 400, 'studentId, name, classLevel are required');
        }

        const exists = await Student.findOne({ studentId: body.studentId, academicYear });
        if (exists) return fail(res, 409, 'Student already exists');

        const student = await Student.create({
            ...body,
            academicYear,
        });

        return ok(res, { student });
    })
);

// PUT /api/students/:studentId (update)
router.put(
    '/:studentId',
    asyncHandler(async (req, res) => {
        const body = req.body || {};

        const updated = await Student.findOneAndUpdate(
            { studentId: req.params.studentId },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updated) return fail(res, 404, 'Student not found');
        return ok(res, { student: updated });
    })
);

// DELETE /api/students/:studentId
router.delete(
    '/:studentId',
    asyncHandler(async (req, res) => {
        const deleted = await Student.findOneAndDelete({ studentId: req.params.studentId });
        if (!deleted) return fail(res, 404, 'Student not found');
        return ok(res, { deleted: true, studentId: req.params.studentId });
    })
);

// POST /api/students/demo/seed
router.post(
    '/demo/seed',
    asyncHandler(async (req, res) => {
        const academicYear = req.body?.academicYear || '2025-2026';

        const demo = [
            { studentId: 'S-1001', name: 'Aarav Sharma', classLevel: 6, batch: 'Batch A', phone: '9000000001', gender: 'Male', attendancePct: 92, performancePct: 78, academicYear },
            { studentId: 'S-1002', name: 'Ishita Verma', classLevel: 7, batch: 'Batch B', phone: '9000000002', gender: 'Female', attendancePct: 88, performancePct: 85, academicYear },
            { studentId: 'S-1003', name: 'Vihaan Rao', classLevel: 8, batch: 'Batch A', phone: '9000000003', gender: 'Male', attendancePct: 95, performancePct: 91, academicYear },
            { studentId: 'S-1004', name: 'Anaya Singh', classLevel: 9, batch: 'Batch C', phone: '9000000004', gender: 'Female', attendancePct: 81, performancePct: 73, academicYear },
            { studentId: 'S-1005', name: 'Kabir Patel', classLevel: 10, batch: 'Batch B', phone: '9000000005', gender: 'Male', attendancePct: 86, performancePct: 88, academicYear },
        ];

        await Student.deleteMany({ academicYear });
        const inserted = await Student.insertMany(demo);
        return ok(res, { seeded: inserted.length, items: inserted });
    })
);

module.exports = router;

