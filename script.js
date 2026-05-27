/*
  Coaching Management System (Second School Classes)
  Frontend-only demo UI with dummy data + simple routing.
*/

const state = {
  route: 'dashboard',
  academicYear: document?.getElementById('academicYear')?.value || '2025-2026',
  lastUpdated: new Date().toLocaleString(),
  // Dummy datasets for demo filtering
  students: [
    { id: 'S-1001', name: 'Aarav Sharma', class: 6, attendance: 92, performance: 78 },
    { id: 'S-1002', name: 'Ishita Verma', class: 7, attendance: 88, performance: 85 },
    { id: 'S-1003', name: 'Vihaan Rao', class: 8, attendance: 95, performance: 91 },
    { id: 'S-1004', name: 'Anaya Singh', class: 9, attendance: 81, performance: 73 },
    { id: 'S-1005', name: 'Kabir Patel', class: 10, attendance: 86, performance: 88 },
  ],
  staff: [
    { id: 'T-201', name: 'Ms. Neha Mehta', role: 'Teacher', subject: 'Mathematics' },
    { id: 'T-202', name: 'Mr. Rohit Kapoor', role: 'Teacher', subject: 'Science' },
    { id: 'A-301', name: 'Ms. Sara Khan', role: 'Admin', department: 'Operations' },
  ],
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setLastUpdated() {
  const el = $('#lastUpdated');
  if (el) el.textContent = `Last updated: ${state.lastUpdated}`;
}

function setFooterYear() {
  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
}

function setActiveNav(route) {
  $$('.nav-item').forEach(btn => {
    const isActive = btn.dataset.route === route;
    if (isActive) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
}

function renderDashboard() {
  $('#pageTitle').textContent = 'Dashboard';
  $('#pageSubtitle').textContent = 'Overview of students, fees, attendance & performance.';

  const kpi = [
    { label: 'Students', value: state.students.length, badge: { cls: 'primary', text: 'Active' } },
    { label: 'Fees Collected', value: '₹ 18.4L', badge: { cls: 'success', text: '+12% MoM' } },
    { label: 'Attendance', value: '91%', badge: { cls: 'warning', text: 'This year' } },
    { label: 'Avg Performance', value: '84%', badge: { cls: 'primary', text: 'Top track' } },
  ];

  const studentTableRows = state.students
    .map(s => `
      <tr>
        <td><strong>${s.name}</strong><div style="color:var(--muted);font-size:12px">${s.id}</div></td>
        <td>Class ${s.class}</td>
        <td><span class="badge success">${s.attendance}%</span></td>
        <td><span class="badge primary">${s.performance}%</span></td>
        <td><button class="btn secondary" data-action="viewStudent" data-id="${s.id}">View</button></td>
      </tr>
    `).join('');

  const growth = [20, 35, 45, 60, 72, 82];
  const attendanceTrend = [62, 70, 76, 83, 88, 91];

  return `
    <div class="grid grid-4">
      ${kpi.map(x => `
        <section class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${x.label}</div>
              <div class="card-sub">Academic year: ${state.academicYear}</div>
            </div>
            <div class="badge ${x.badge.cls}">${x.badge.text}</div>
          </div>
          <div class="stat">
            <div>
              <div class="value">${x.value}</div>
              <div class="label">Live (demo)</div>
            </div>
          </div>
        </section>
      `).join('')}
    </div>

    <div class="grid grid-2" style="align-items:start">
      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Growth (Demo)</div>
            <div class="card-sub">Students' progress over terms</div>
          </div>
          <div class="badge primary">Chart</div>
        </div>
        <div class="chart" aria-label="Growth chart">
          ${growth.map(v => `<div class="bar" style="height:${v}%" title="${v}%"></div>`).join('')}
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Attendance Trend (Demo)</div>
            <div class="card-sub">Overall attendance over terms</div>
          </div>
          <div class="badge warning">Trend</div>
        </div>
        <div class="chart" aria-label="Attendance chart">
          ${attendanceTrend.map(v => `<div class="bar" style="height:${v}%" title="${v}%"></div>`).join('')}
        </div>
      </section>
    </div>

    <section class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Recent Students</div>
          <div class="card-sub">Quick access to student overview</div>
        </div>
        <button class="btn" data-action="openStudents">Manage Students</button>
      </div>
      <table class="table" role="table" aria-label="Students table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Attendance</th>
            <th>Performance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${studentTableRows}
        </tbody>
      </table>
    </section>
  `;
}

function renderReports() {
  $('#pageTitle').textContent = 'Reports';
  $('#pageSubtitle').textContent = 'Charts for growth, attendance, and results (demo UI).';

  const growth = [18, 26, 41, 58, 71, 86];
  const attendance = [60, 68, 74, 82, 89, 93];
  const results = [22, 33, 44, 61, 74, 88];

  return `
    <div class="grid grid-3">
      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Student Growth</div>
            <div class="card-sub">Term-wise improvement</div>
          </div>
          <div class="badge primary">Growth</div>
        </div>
        <div class="chart">${growth.map(v => `<div class="bar" style="height:${v}%"></div>`).join('')}</div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Attendance</div>
            <div class="card-sub">Presence ratio</div>
          </div>
          <div class="badge warning">Attendance</div>
        </div>
        <div class="chart">${attendance.map(v => `<div class="bar" style="height:${v}%" title="${v}%"></div>`).join('')}</div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Results</div>
            <div class="card-sub">Exam outcomes</div>
          </div>
          <div class="badge success">Results</div>
        </div>
        <div class="chart">${results.map(v => `<div class="bar" style="height:${v}%"></div>`).join('')}</div>
      </section>
    </div>

    <section class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Generate Report (UI)</div>
          <div class="card-sub">This will call backend APIs in the next step</div>
        </div>
        <button class="btn" data-action="demoToast">Generate</button>
      </div>

      <div class="form-grid">
        <label>
          <div class="card-sub">Class</div>
          <select class="input" id="reportClass">
            <option value="all">All</option>
            ${Array.from({ length: 7 }, (_, i) => i + 4).map(c => `<option value="${c}">Class ${c}</option>`).join('')}
          </select>
        </label>
        <label>
          <div class="card-sub">Date range</div>
          <input class="input" type="date" id="reportFrom" />
        </label>
      </div>

      <div class="row" style="margin-top:12px">
        <label style="flex:1">
          <div class="card-sub">To</div>
          <input class="input" type="date" id="reportTo" />
        </label>
        <button class="btn secondary" style="margin-left:auto" data-action="demoToast">Download PDF</button>
      </div>
    </section>
  `;
}

function renderSimpleModule(title, subtitle, bodyHTML) {
  $('#pageTitle').textContent = title;
  $('#pageSubtitle').textContent = subtitle;
  return `<section class="card"><div class="card-header"><div><div class="card-title">${title}</div><div class="card-sub">${subtitle}</div></div><div class="badge primary">UI</div></div>${bodyHTML}</section>`;
}

function renderStudents() {
  return renderSimpleModule(
    'Students Management',
    'Add, edit, delete and search students (demo table + forms).',
    `
      <div class="row" style="justify-content:space-between">
        <div style="flex:1;min-width:220px">
          <div class="card-sub">Search</div>
          <input class="input" placeholder="Search by name or ID" id="studentSearch" />
        </div>
        <div>
          <button class="btn" data-action="demoToast">Add Student</button>
        </div>
      </div>

      <div style="height:12px"></div>

      <table class="table" aria-label="Students table">
        <thead>
          <tr>
            <th>Name</th><th>Class</th><th>Attendance</th><th>Performance</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.students.map(s => `
            <tr>
              <td><strong>${s.name}</strong><div style="color:var(--muted);font-size:12px">${s.id}</div></td>
              <td>Class ${s.class}</td>
              <td><span class="badge success">${s.attendance}%</span></td>
              <td><span class="badge primary">${s.performance}%</span></td>
              <td>
                <button class="btn secondary" data-action="demoToast">Edit</button>
                <button class="btn danger" data-action="demoToast" style="margin-left:8px">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  );
}

function renderStaff() {
  return renderSimpleModule(
    'Staff Management',
    'Manage teachers and admin staff (demo UI).',
    `
      <div class="row" style="justify-content:space-between">
        <div style="flex:1;min-width:220px">
          <div class="card-sub">Search</div>
          <input class="input" placeholder="Search by name / subject" id="staffSearch" />
        </div>
        <div>
          <button class="btn" data-action="demoToast">Add Staff</button>
        </div>
      </div>

      <div style="height:12px"></div>

      <table class="table" aria-label="Staff table">
        <thead>
          <tr>
            <th>Staff</th><th>Role</th><th>Focus</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.staff.map(t => `
            <tr>
              <td><strong>${t.name}</strong><div style="color:var(--muted);font-size:12px">${t.id}</div></td>
              <td>${t.role}</td>
              <td>${t.subject || t.department || '-'}</td>
              <td>
                <button class="btn secondary" data-action="demoToast">Edit</button>
                <button class="btn danger" data-action="demoToast" style="margin-left:8px">Remove</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  );
}

const ROUTES = {
  dashboard: renderDashboard,
  reports: renderReports,
  students: renderStudents,
  staff: renderStaff,
  curriculum: () => renderSimpleModule('Curriculum', 'Courses, subjects & topics. (Demo UI)', '<div class="row"><div style="flex:1"><div class="card-sub">Class range</div><div class="row"><span class="badge primary">Class 4</span><span class="badge primary">... Class 10</span></div></div><button class="btn" data-action="demoToast">Create Batch</button></div>'),
  timetable: () => renderSimpleModule('Timetable', 'Weekly schedule (UI grid placeholder).', '<div class="card-sub" style="margin-bottom:10px">Weekly schedule will be implemented with real data in backend step.</div><div class="chart" style="height:240px;align-items:flex-start"><div class="bar" style="height:50%"></div><div class="bar" style="height:70%"></div><div class="bar" style="height:40%"></div><div class="bar" style="height:85%"></div><div class="bar" style="height:60%"></div></div>'),
  attendance: () => renderSimpleModule('Attendance', 'Mark present/absent (demo UI).', '<div class="form-grid"><label><div class="card-sub">Class</div><select class="input"><option>Class 6</option><option>Class 7</option><option>Class 8</option></select></label><label><div class="card-sub">Date</div><input class="input" type="date" value="2025-01-15"/></label></div><div class="row" style="margin-top:12px"><button class="btn" data-action="demoToast">Save Attendance</button><button class="btn secondary" data-action="demoToast">View Summary</button></div>'),
  homework: () => renderSimpleModule('Homework', 'Assign and view homework (demo UI).', '<div class="row" style="justify-content:space-between"><div style="flex:1;min-width:220px"><div class="card-sub">Assign to</div><select class="input"><option>Class 6 - Batch A</option><option>Class 7 - Batch B</option></select></div><button class="btn" data-action="demoToast">Assign Homework</button></div>'),
  leave: () => renderSimpleModule('Leave & Holidays', 'Manage holidays and leave approvals (demo UI).', '<div class="grid grid-2"><div class="card"><div class="card-title">Upcoming Holidays</div><div class="card-sub">Demo list</div><div class="badge warning">15 Jun 2025</div></div><div class="card"><div class="card-title">Leave Requests</div><div class="card-sub">Pending approvals</div><div class="badge primary">3 Pending</div></div></div>'),
  exams: () => renderSimpleModule('Exam Entry', 'Offline exam entry (demo UI).', '<div class="row"><div style="flex:1;min-width:220px"><div class="card-sub">Exam</div><select class="input"><option>Unit Test 2</option><option>Half Yearly</option></select></div><button class="btn" data-action="demoToast">Create Exam</button></div>'),
  results: () => renderSimpleModule('Results', 'Generate results & report card UI (demo UI).', '<div class="row"><button class="btn" data-action="demoToast">Generate Results</button><button class="btn secondary" data-action="demoToast">Print Report Card</button></div>'),
  cards: () => renderSimpleModule('Certificates & ID Card', 'Certificate generator and ID card UI (demo UI).', '<div class="row"><button class="btn" data-action="demoToast">Generate Certificate</button><button class="btn secondary" data-action="demoToast">Print ID Card</button></div>'),
  fees: () => renderSimpleModule('Fees Collection', 'Fee collection, discounts, late fees & receipts (demo UI).', '<div class="form-grid"><label><div class="card-sub">Class</div><select class="input"><option>All Classes</option><option>Class 6</option></select></label><label><div class="card-sub">Payment date</div><input class="input" type="date"/></label></div><div class="row" style="margin-top:12px"><button class="btn" data-action="demoToast">Collect Fee</button><button class="btn secondary" data-action="demoToast">Apply Discount</button></div>'),
  reminders: () => renderSimpleModule('Payment Reminders', 'Send reminder via SMS/WhatsApp (demo UI).', '<div class="row"><button class="btn" data-action="demoToast">Send Reminders</button><button class="btn secondary" data-action="demoToast">View Logs</button></div>'),
  payroll: () => renderSimpleModule('Payroll', 'Staff payroll UI (demo UI).', '<div class="form-grid"><label><div class="card-sub">Month</div><input class="input" type="month"/></label><label><div class="card-sub">Pay cycle</div><select class="input"><option>Monthly</option><option>Bi-weekly</option></select></label></div><div class="row" style="margin-top:12px"><button class="btn" data-action="demoToast">Calculate Payroll</button></div>'),
  performance: () => renderSimpleModule('Performance Tracking', 'Track teacher performance and KPIs (demo UI).', '<div class="grid grid-2"><div class="card"><div class="card-title">Best Teachers</div><div class="card-sub">This quarter</div><div class="badge success">Top 5</div></div><div class="card"><div class="card-title">Review Notes</div><div class="card-sub">Demo placeholder</div><div class="badge primary">2 New</div></div></div>'),
  comms: () => renderSimpleModule('Bulk SMS / WhatsApp', 'Send bulk communications to parents (demo UI).', '<div class="row" style="justify-content:space-between"><div style="flex:1;min-width:220px"><div class="card-sub">Template</div><select class="input"><option>Fee Reminder</option><option>Exam Schedule</option><option>Attendance Update</option></select></div><button class="btn" data-action="demoToast">Send</button></div>'),
  email: () => renderSimpleModule('Email Campaigns', 'Email campaign UI (demo).', '<div class="row"><button class="btn" data-action="demoToast">Create Campaign</button><button class="btn secondary" data-action="demoToast">Send Test Email</button></div>'),
  inbox: () => renderSimpleModule('Inbox', 'Messaging inbox UI (demo UI).', '<table class="table"><thead><tr><th>From</th><th>Message</th><th>Time</th></tr></thead><tbody><tr><td>Parent</td><td>Thanks for the update!</td><td>09:12</td></tr><tr><td>Admin</td><td>New timetable published.</td><td>11:42</td></tr></tbody></table>'),
  admissions: () => renderSimpleModule('Admission Enquiry', 'Admission enquiry form UI (demo).', '<div class="form-grid"><label><div class="card-sub">Parent name</div><input class="input" placeholder="e.g. Ramesh"/></label><label><div class="card-sub">Phone</div><input class="input" placeholder="e.g. 9876543210"/></label><label><div class="card-sub">Interested class</div><select class="input">${Array.from({length:7},(_,i)=>i+4).map(c=>`<option>Class ${c}</option>`).join('')}</select></label><label><div class="card-sub">Message</div><input class="input" placeholder="Write details"/></label></div><div class="row" style="margin-top:12px"><button class="btn" data-action="demoToast">Submit Enquiry</button></div>'),
  'custom-fields': () => renderSimpleModule('Custom Fields', 'Create custom fields (demo UI).', '<div class="row"><button class="btn" data-action="demoToast">Add Field</button><button class="btn secondary" data-action="demoToast">Manage Fields</button></div>'),
  ptm: () => renderSimpleModule('PTM Meetings', 'Schedule parent-teacher meetings (demo UI).', '<div class="row"><div style="flex:1;min-width:220px"><div class="card-sub">Select date</div><input class="input" type="date"/></div><button class="btn" data-action="demoToast">Schedule PTM</button></div>'),
};

function renderRoute(route) {
  const fn = ROUTES[route] || renderDashboard;
  const html = fn();
  $('#main').innerHTML = html;
  setActiveNav(route);
}

function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => { el.remove(); }, 2600);
}

function init() {
  setFooterYear();
  setLastUpdated();

  // Initial route
  const initial = 'dashboard';
  state.route = initial;

  renderRoute(state.route);

  // Academic year selector
  $('#academicYear')?.addEventListener('change', (e) => {
    state.academicYear = e.target.value;
    renderRoute(state.route);
  });

  // Sidebar toggle
  $('#sidebarToggle')?.addEventListener('click', () => {
    const sidebar = $('.sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('open');
  });

  // Close sidebar on mobile after click
  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const route = btn.dataset.route;
      state.route = route;
      renderRoute(route);
      const sidebar = $('.sidebar');
      if (sidebar && window.innerWidth <= 640) sidebar.classList.remove('open');
    });
  });

  // Global search (demo only)
  $('#globalSearch')?.addEventListener('input', (e) => {
    const q = (e.target.value || '').trim().toLowerCase();
    // For demo: show toast and do not re-render full pages
    if (q.length >= 2) toast(`Searching “${q}” (demo)`);
  });

  // Delegated actions
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'openStudents') {
      state.route = 'students';
      renderRoute('students');
    } else if (action === 'viewStudent') {
      toast(`Student profile: ${btn.dataset.id} (demo)`);
    } else if (action === 'demoToast') {
      toast('Demo action — connect backend APIs next.');
    }
  });
}

window.addEventListener('DOMContentLoaded', init);

