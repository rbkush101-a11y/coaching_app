const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const { Salary, Teacher } = require('../models');

const router = express.Router();

// GET /api/salary?academicYear=&month=&paidStatus=
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { academicYear = '2025-2026', month, paidStatus, limit = 50, page = 1 } = req.query;
        const q = { academicYear };
        if (month) q.month = month;
        if (paidStatus) q.paidStatus = paidStatus;

        const p = Math.max(1, Number(page));
        const l = Math.min(200, Math.max(1, Number(limit)));

        const [items, total] = await Promise.all([
            Salary.find(q)
                .populate('teacherRef', 'teacherId name role subject department')
                .sort({ createdAt: -1 })
                .skip((p - 1) * l)
                .limit(l),
            Salary.countDocuments(q),
        ]);

        return ok(res, { items, total, page: p, limit: l });
    })
);

// POST /api/salary/calculate
// Simplified: totalPayable = baseAmount + incentives - deductions + attendanceAdjustment
router.post(
    '/calculate',
    asyncHandler(async (req, res) => {
        const body = req.body || {};
        const academicYear = body.academicYear || '2025-2026';
        const month = body.month;
        if (!month) return fail(res, 400, 'month is required');

        const teachers = await Teacher.find({ academicYear, role: 'Teacher', status: 'active' });
        if (!teachers.length) return fail(res, 400, 'No teachers found. Seed teachers first.');

        const created = [];

        for (const t of teachers) {
            const baseAmount = Number(body.baseOverride ?? t.salaryBase ?? 0);
            const attendanceAdjustment = Number(body.attendanceAdjustment ?? 0);
            const incentives = Number(body.incentives ?? 0);
            const deductions = Number(body.deductions ?? 0);

            const totalPayable = Math.max(0, baseAmount + attendanceAdjustment + incentives - deductions);

            const salaryId = `SAL-${t.teacherId}-${month}-${academicYear}`;

            const salary = await Salary.findOneAndUpdate(
                { salaryId },
                {
                    $set: {
                        salaryId,
                        teacherRef: t._id,
                        academicYear,
                        month,
                        baseAmount,
                        attendanceAdjustment,
                        incentives,
                        deductions,
                        totalPayable,
                        paidStatus: 'unpaid',
                    },
                },
                { upsert: true, new: true, runValidators: true }
            );

            created.push(salary);
        }

        return ok(res, { created: created.length, items: created });
    })
);

// POST /api/salary/:salaryId/mark-paid
router.post(
    '/:salaryId/mark-paid',
    asyncHandler(async (req, res) => {
        const { salaryId } = req.params;
        const { payDate } = req.body || {};

        const salary = await Salary.findOneAndUpdate(
            { salaryId },
            { $set: { paidStatus: 'paid', payDate: payDate ? new Date(payDate) : new Date() } },
            { new: true }
        );

        if (!salary) return fail(res, 404, 'Salary record not found');
        return ok(res, { salary });
    })
);

// POST /api/salary/demo/seed
router.post(
    '/demo/seed',
    asyncHandler(async (req, res) => {
        const academicYear = req.body?.academicYear || '2025-2026';
        const month = req.body?.month || '2026-05';

        // calculate once (simplified)
        const teachers = await Teacher.find({ academicYear, role: 'Teacher' });
        if (!teachers.length) return fail(res, 400, 'Seed teachers first');

        await Salary.deleteMany({ academicYear, month });

        const created = [];
        for (const t of teachers) {
            const baseAmount = t.salaryBase || 0;
            const totalPayable = Math.max(0, baseAmount + 2000 - 500);

            created.push(
                await Salary.create({
                    salaryId: `SAL-${t.teacherId}-${month}-${academicYear}`,
                    teacherRef: t._id,
                    academicYear,
                    month,
                    baseAmount,
                    attendanceAdjustment: 2000,
                    incentives: 1000,
                    deductions: 500,
                    totalPayable,
                    paidStatus: 'unpaid',
                })
            );
        }

        return ok(res, { seeded: created.length, items: created });
    })
);

module.exports = router;

