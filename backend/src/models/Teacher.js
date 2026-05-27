const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema(
    {
        teacherId: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, trim: true },
        role: { type: String, enum: ['Teacher', 'Admin'], default: 'Teacher' },
        subject: { type: String, default: '' },
        department: { type: String, default: '' },
        academicYear: { type: String, default: '2025-2026', index: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        salaryBase: { type: Number, default: 0, min: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Teacher', TeacherSchema);

