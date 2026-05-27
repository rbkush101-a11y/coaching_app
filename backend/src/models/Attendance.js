const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
    {
        academicYear: { type: String, default: '2025-2026', index: true },
        date: { type: Date, required: true, index: true },
        type: { type: String, enum: ['student', 'teacher'], required: true, index: true },
        studentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', index: true },
        teacherRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', index: true },
        classLevel: { type: Number },
        batch: { type: String, default: '' },
        status: { type: String, enum: ['present', 'absent'], required: true },
        markedBy: { type: String, default: 'admin' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Attendance', AttendanceSchema);

