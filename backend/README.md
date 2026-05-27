# Coaching ERP Backend (Second School Classes)

## Tech
- Node.js + Express
- MongoDB (Mongoose)

## Run
1) Start MongoDB (local) or set `MONGODB_URI`.
2) Copy env:
   - `cp .env.example .env`
3) Install deps:
   - `npm install`
4) Start dev server:
   - `npm run dev`

API base: `http://localhost:4000/api`

## Endpoints (high level)
- Students: `GET/POST/PUT/DELETE /api/students`
- Teachers: `GET/POST/PUT/DELETE /api/teachers`
- Fees: `GET /api/fees`, `POST /api/fees`, `POST /api/fees/:feeId/pay`
- Salary: `GET /api/salary`, `POST /api/salary/calculate`
- Attendance: `GET /api/attendance`, `POST /api/attendance/mark`
- Dashboard summary: `GET /api/dashboard/summary`

## Demo seed
- `POST /api/students/demo/seed`
- `POST /api/teachers/demo/seed`
- `POST /api/fees/demo/seed` (requires students seed)
- `POST /api/attendance/demo/seed` (requires students + teachers seed)
- `POST /api/salary/demo/seed` (requires teachers seed)

