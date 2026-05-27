const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema(
    {
        salaryId: { type: String, required: true, unique: true, index: true },
        teacherRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
        academicYear: { type: String, default: '2025-2026', index: true },
        month: { type: String, required: true, index: true },
        baseAmount: { type: Number, required: true, min: 0 },
        attendanceAdjustment: { type: Number, default: 0 },
        incentives: { type: Number, default: 0, min: 0 },
        deductions: { type: Number, default: 0, min: 0 },
        totalPayable: { type: Number, default: 0, min: 0 },
        paidStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid', index: true },
        payDate: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Salary', SalarySchema);

