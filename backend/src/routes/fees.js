const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const { Fee, Payment, Student } = require('../models');

const router = express.Router();

// GET /api/fees?academicYear=&status=&classLevel=&search=
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { academicYear = '2025-2026', status, classLevel, limit = 50, page = 1, search = '' } = req.query;
        const q = { academicYear };
        if (status) q.status = status;
        if (classLevel) q.classLevel = Number(classLevel);

        // optional search by student name
        let studentIds = null;
        if (search) {
            const matches = await Student.find({ academicYear, name: { $regex: String(search), $options: 'i' } }).select('_id');
            studentIds = matches.map(m => m._id);
            q.studentRef = { $in: studentIds.length ? studentIds : [null] };
        }

        const p = Math.max(1, Number(page));
        const l = Math.min(200, Math.max(1, Number(limit)));

        const [items, total] = await Promise.all([
            Fee.find(q)
                .populate('studentRef', 'studentId name classLevel')
                .sort({ dueDate: 1 })
                .skip((p - 1) * l)
                .limit(l),
            Fee.countDocuments(q),
        ]);

        return ok(res, { items, total, page: p, limit: l });
    })
);

// POST /api/fees (create fee)
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const body = req.body || {};
        const academicYear = body.academicYear || '2025-2026';

        if (!body.feeId || !body.studentRef || !body.classLevel || !body.dueDate || body.amountDue == null) {
            return fail(res, 400, 'feeId, studentRef, classLevel, dueDate, amountDue are required');
        }

        const exists = await Fee.findOne({ feeId: body.feeId, academicYear });
        if (exists) return fail(res, 409, 'Fee already exists');

        const fee = await Fee.create({
            ...body,
            academicYear,
            dueDate: new Date(body.dueDate),
            amountDue: Number(body.amountDue),
            discount: Number(body.discount || 0),
        });

        return ok(res, { fee });
    })
);

// POST /api/fees/:feeId/pay (collect fee)
router.post(
    '/:feeId/pay',
    asyncHandler(async (req, res) => {
        const { feeId } = req.params;
        const body = req.body || {};

        const fee = await Fee.findOne({ feeId });
        if (!fee) return fail(res, 404, 'Fee not found');

        const amountPaid = Number(body.amountPaid || 0);
        if (!amountPaid || amountPaid <= 0) return fail(res, 400, 'amountPaid must be > 0');

        const payment = await Payment.create({
            paymentId: body.paymentId || `P-${Date.now()}`,
            academicYear: body.academicYear || fee.academicYear,
            feeRef: fee._id,
            studentRef: fee.studentRef,
            amountPaid,
            method: body.method || 'upi',
            paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(),
            receiptNo: body.receiptNo || '',
        });

        // simplistic status rule: paid if payment >= net due
        const netDue = Math.max(0, fee.amountDue - (fee.discount || 0));
        const alreadyPaid = await Payment.aggregate([
            { $match: { feeRef: fee._id } },
            { $group: { _id: '$feeRef', total: { $sum: '$amountPaid' } } },
        ]);
        const totalPaid = alreadyPaid[0]?.total || 0;

        if (totalPaid >= netDue) {
            await Fee.findByIdAndUpdate(fee._id, { status: 'paid' });
        }

        return ok(res, { payment, feeStatus: (await Fee.findById(fee._id)).status });
    })
);

// GET /api/fees/:feeId/payments
router.get(
    '/:feeId/payments',
    asyncHandler(async (req, res) => {
        const { feeId } = req.params;
        const fee = await Fee.findOne({ feeId });
        if (!fee) return fail(res, 404, 'Fee not found');

        const payments = await Payment.find({ feeRef: fee._id }).sort({ paymentDate: -1 });
        return ok(res, { payments });
    })
);

// POST /api/fees/demo/seed
router.post(
    '/demo/seed',
    asyncHandler(async (req, res) => {
        const academicYear = req.body?.academicYear || '2025-2026';

        const students = await Student.find({ academicYear }).limit(5);
        if (!students.length) return fail(res, 400, 'Seed students first using /api/students/demo/seed');

        await Fee.deleteMany({ academicYear });
        await Payment.deleteMany({ academicYear });

        const now = Date.now();
        const demoFees = students.map((s, idx) => {
            const feeId = `F-${academicYear}-${idx + 1}`;
            return {
                feeId,
                academicYear,
                studentRef: s._id,
                classLevel: s.classLevel,
                batch: s.batch,
                dueDate: new Date(now + (idx + 1) * 86400000),
                amountDue: 25000 + idx * 2000,
                discount: idx % 2 === 0 ? 1000 : 0,
                couponCode: idx % 2 === 0 ? 'NEWYEAR' : '',
                status: 'pending',
            };
        });

        const inserted = await Fee.insertMany(demoFees);
        return ok(res, { seeded: inserted.length, items: inserted });
    })
);

module.exports = router;

