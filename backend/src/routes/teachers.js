const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const { Teacher } = require('../models');

const router = express.Router();

// GET /api/teachers?search=&academicYear=&role=
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { search = '', academicYear = '2025-2026', role, limit = 50, page = 1 } = req.query;
        const q = { academicYear };
        if (role) q.role = role;
        if (search) q.name = { $regex: String(search), $options: 'i' };

        const p = Math.max(1, Number(page));
        const l = Math.min(200, Math.max(1, Number(limit)));

        const [items, total] = await Promise.all([
            Teacher.find(q).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
            Teacher.countDocuments(q),
        ]);

        return ok(res, { items, total, page: p, limit: l });
    })
);

router.get(
    '/:teacherId',
    asyncHandler(async (req, res) => {
        const teacher = await Teacher.findOne({ teacherId: req.params.teacherId });
        if (!teacher) return fail(res, 404, 'Teacher not found');
        return ok(res, { teacher });
    })
);

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const body = req.body || {};
        const academicYear = body.academicYear || '2025-2026';

        if (!body.teacherId || !body.name) return fail(res, 400, 'teacherId and name are required');

        const exists = await Teacher.findOne({ teacherId: body.teacherId, academicYear });
        if (exists) return fail(res, 409, 'Teacher already exists');

        const teacher = await Teacher.create({ ...body, academicYear });
        return ok(res, { teacher });
    })
);

router.put(
    '/:teacherId',
    asyncHandler(async (req, res) => {
        const body = req.body || {};

        const updated = await Teacher.findOneAndUpdate(
            { teacherId: req.params.teacherId },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updated) return fail(res, 404, 'Teacher not found');
        return ok(res, { teacher: updated });
    })
);

router.delete(
    '/:teacherId',
    asyncHandler(async (req, res) => {
        const deleted = await Teacher.findOneAndDelete({ teacherId: req.params.teacherId });
        if (!deleted) return fail(res, 404, 'Teacher not found');
        return ok(res, { deleted: true, teacherId: req.params.teacherId });
    })
);

router.post(
    '/demo/seed',
    asyncHandler(async (req, res) => {
        const academicYear = req.body?.academicYear || '2025-2026';

        const demo = [
            { teacherId: 'T-201', name: 'Ms. Neha Mehta', role: 'Teacher', subject: 'Mathematics', academicYear, salaryBase: 25000, rating: 4.2 },
            { teacherId: 'T-202', name: 'Mr. Rohit Kapoor', role: 'Teacher', subject: 'Science', academicYear, salaryBase: 24000, rating: 4.0 },
            { teacherId: 'A-301', name: 'Ms. Sara Khan', role: 'Admin', department: 'Operations', academicYear, salaryBase: 28000, rating: 3.9 },
        ];

        await Teacher.deleteMany({ academicYear });
        const inserted = await Teacher.insertMany(demo);
        return ok(res, { seeded: inserted.length, items: inserted });
    })
);

module.exports = router;

