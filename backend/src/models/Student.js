const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
    {
        studentId: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, trim: true },
        classLevel: { type: Number, required: true, min: 1, max: 20 },
        batch: { type: String, default: '' },
        phone: { type: String, default: '' },
        gender: { type: String, default: '' },
        attendancePct: { type: Number, default: 0, min: 0, max: 100 },
        performancePct: { type: Number, default: 0, min: 0, max: 100 },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        academicYear: { type: String, default: '2025-2026', index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);

