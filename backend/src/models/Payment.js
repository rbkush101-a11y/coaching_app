const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        paymentId: { type: String, required: true, unique: true, index: true },
        academicYear: { type: String, default: '2025-2026', index: true },
        feeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true, index: true },
        studentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
        amountPaid: { type: Number, required: true, min: 0 },
        method: { type: String, enum: ['cash', 'card', 'upi', 'bank'], default: 'upi' },
        paymentDate: { type: Date, required: true },
        receiptNo: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);

