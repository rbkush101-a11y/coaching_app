const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');

const { Attendance, Student, Teacher } = require('../models');

const router = express.Router();

// GET /api/attendance?academicYear=&type=student&classLevel=&date=
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { academicYear = '2025-2026', type, classLevel, date, limit = 100, page = 1 } = req.query;
        const q = { academicYear };
        if (type) q.type = type;
        if (classLevel) q.classLevel = Number(classLevel);
        if (date) {
            const d = new Date(date);
            q.date = { $gte: d, $lt: new Date(d.getTime() + 86400000) };
        }

        const p = Math.max(1, Number(page));
        const l = Math.min(300, Math.max(1, Number(limit)));

        const [items, total] = await Promise.all([
            Attendance.find(q)
                .populate('studentRef', 'studentId name classLevel')
                .populate('teacherRef', 'teacherId name role subject department')
                .sort({ date: -1, createdAt: -1 })
                .skip((p - 1) * l)
                .limit(l),
            Attendance.countDocuments(q),
        ]);

        return ok(res, { items, total, page: p, limit: l });
    })
);

// POST /api/attendance/mark
// Body: { academicYear, date, type:'student'|'teacher', studentId?, teacherId?, status:'present'|'absent', classLevel?, batch?, markedBy? }
router.post(
    '/mark',
    asyncHandler(async (req, res) => {
        const body = req.body || {};
        const academicYear = body.academicYear || '2025-2026';
        if (!body.date || !body.type || !body.status) return fail(res, 400, 'date, type, status are required');

        const date = new Date(body.date);

        const student = body.type === 'student' ? await Student.findOne({ studentId: body.studentId, academicYear }) : null;
        const teacher = body.type === 'teacher' ? await Teacher.findOne({ teacherId: body.teacherId, academicYear }) : null;

        if (body.type === 'student' && !student) return fail(res, 404, 'Student not found');
        if (body.type === 'teacher' && !teacher) return fail(res, 404, 'Teacher not found');

        const query = {
            academicYear,
            date: new Date(date.toISOString().slice(0, 10)),
            type: body.type,
        };

        if (body.type === 'student') query.studentRef = student._id;
        if (body.type === 'teacher') query.teacherRef = teacher._id;

        const update = {
            $set: {
                status: body.status,
                classLevel: body.classLevel != null ? Number(body.classLevel) : body.type === 'student' ? student.classLevel : undefined,
                batch: body.batch || (body.type === 'student' ? student.batch : ''),
                markedBy: body.markedBy || 'admin',
                studentRef: body.type === 'student' ? student._id : undefined,
                teacherRef: body.type === 'teacher' ? teacher._id : undefined,
            },
        };

        // Upsert by (academicYear + date + type + studentRef/teacherRef)
        const attendance = await Attendance.findOneAndUpdate(query, update, { upsert: true, new: true, runValidators: true });

        return ok(res, { attendance });
    })
);

// POST /api/attendance/demo/seed
router.post(
    '/demo/seed',
    asyncHandler(async (req, res) => {
        const academicYear = req.body?.academicYear || '2025-2026';
        const date = req.body?.date || new Date().toISOString().slice(0, 10);

        const students = await Student.find({ academicYear }).limit(5);
        const teachers = await Teacher.find({ academicYear, role: 'Teacher' }).limit(3);

        if (!students.length) return fail(res, 400, 'Seed students first');
        if (!teachers.length) return fail(res, 400, 'Seed teachers first');

        await Attendance.deleteMany({ academicYear, date: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) } });

        const docs = [];
        for (const s of students) {
            docs.push(
                {
                    academicYear,
                    date: new Date(date),
                    type: 'student',
                    studentRef: s._id,
                    classLevel: s.classLevel,
                    batch: s.batch,
                    status: Math.random() > 0.2 ? 'present' : 'absent',
                    markedBy: 'demo',
                }
            );
        }
        for (const t of teachers) {
            docs.push(
                {
                    academicYear,
                    date: new Date(date),
                    type: 'teacher',
                    teacherRef: t._id,
                    classLevel: undefined,
                    batch: '',
                    status: Math.random() > 0.15 ? 'present' : 'absent',
                    markedBy: 'demo',
                }
            );
        }

        const inserted = await Attendance.insertMany(docs);
        return ok(res, { seeded: inserted.length, items: inserted });
    })
);

module.exports = router;

