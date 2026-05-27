const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema(
    {
        feeId: { type: String, required: true, unique: true, index: true },
        academicYear: { type: String, default: '2025-2026', index: true },
        studentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
        classLevel: { type: Number, required: true },
        batch: { type: String, default: '' },
        dueDate: { type: Date, required: true },
        amountDue: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        couponCode: { type: String, default: '' },
        lateFeeRuleId: { type: String, default: '' },
        status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending', index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Fee', FeeSchema);

