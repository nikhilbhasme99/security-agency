/**
 * Data and State Management for HRM Pro
 */

const STORAGE_KEY = 'hrm_pro_state';

const initialState = {
    employees: [
        {
            id: 'EMP001',
            name: 'Rahul Patil',
            mobile: '9876543210',
            email: 'rahul.p@company.com',
            aadhaar: '1234-5678-9012',
            pan: 'ABCDE1234F',
            pfApplicable: true,
            joiningDate: '2024-01-15',
            salary: 45000,
            status: 'Active',
            companyId: 'COM001',
            locationId: 'LOC001',
            bloodGroup: 'B+',
            dob: '1995-05-20',
            address: 'Sector 4, Hitech City, Hyderabad',
            documents: []
        },
        {
            id: 'EMP002',
            name: 'Anjali Sharma',
            mobile: '8765432109',
            email: 'anjali.s@company.com',
            aadhaar: '5678-9012-3456',
            pan: 'WXYZR5678G',
            pfApplicable: false,
            joiningDate: '2024-02-10',
            salary: 35000,
            status: 'Active',
            companyId: 'COM001',
            locationId: 'LOC002',
            bloodGroup: 'O+',
            dob: '1998-11-12',
            address: 'Phase 2, Pimple Saudagar, Pune',
            documents: []
        }
    ],
    companies: [
        {
            id: 'COM001',
            name: 'TechWave Solutions',
            clientName: 'Global Retail Corp',
            gstNumber: '27AAAAA0000A1Z5',
            address: 'Hitech City, Hyderabad',
            contact: '+91 40 1234 5678',
            locations: ['LOC001', 'LOC002']
        },
        {
            id: 'COM002',
            name: 'InnoServices Pvt Ltd',
            clientName: 'Eco-Friendly Systems',
            gstNumber: '27BBBBB1111B1Z6',
            address: 'Pimple Saudagar, Pune',
            contact: '+91 20 2233 4455',
            locations: ['LOC003']
        }
    ],
    locations: [
        { id: 'LOC001', name: 'Main Office - Pune', companyId: 'COM001' },
        { id: 'LOC002', name: 'Branch Office - Mumbai', companyId: 'COM001' },
        { id: 'LOC003', name: 'Regional Center - Delhi', companyId: 'COM002' }
    ],
    shifts: [
        { id: 'SHF001', name: 'Morning Shift', time: '08:00 AM - 04:00 PM', color: '#fbbf24' },
        { id: 'SHF002', name: 'Day Shift', time: '10:00 AM - 06:00 PM', color: '#10b981' },
        { id: 'SHF003', name: 'Night Shift', time: '10:00 PM - 06:00 AM', color: '#6366f1' }
    ],
    shiftAssignments: [
        { empId: 'EMP001', shiftId: 'SHF002', location: 'Floor 1, Block A', date: '2026-02-20' },
        { empId: 'EMP002', shiftId: 'SHF001', location: 'Reception Desk', date: '2026-02-20' }
    ],
    attendance: {},
    holidays: [
        { date: '2026-01-26', name: 'Republic Day' },
        { date: '2026-08-15', name: 'Independence Day' },
        { date: '2026-10-02', name: 'Gandhi Jayanti' }
    ],
    reminders: [
        { id: 1, title: 'Payroll Due', desc: 'Process Feb payroll for TechWave', urgency: 'high' },
        { id: 2, title: 'Document Expiry', desc: '3 employees have expiring PAN cards', urgency: 'medium' },
        { id: 3, title: 'New Leave Request', desc: 'John Doe requested 2 days leave', urgency: 'medium' }
    ],
    clients: [
        { id: 'CLI001', name: 'Global Retail Corp', date: '2025-10-12', contact: 'manager@globalretail.com', region: 'NA' },
        { id: 'CLI002', name: 'Eco-Friendly Systems', date: '2025-11-05', contact: 'admin@ecosystems.in', region: 'IN' }
    ],
    clientTasks: [
        { id: 'TSK001', clientId: 'CLI001', task: 'Policy Setup', status: 'Task Allocated', deadline: '2026-03-01' },
        { id: 'TSK002', clientId: 'CLI001', task: 'KYC Verification', status: 'In Process', deadline: '2026-03-05' },
        { id: 'TSK003', clientId: 'CLI002', task: 'Portal Training', status: 'Followup', deadline: '2026-03-10' }
    ],
    systemUsers: [
        { username: 'superadmin', password: 'password123', role: 'Super Admin', name: 'Nikhil' },
        { username: 'admin', password: 'admin123', role: 'Admin', name: 'Nikhil.Itpl' }
    ],
    currentUser: null
};

class HRMStore {
    constructor() {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        this.state = saved || initialState;

        // Sync system users to ensure name changes in code reflect immediately
        if (saved) {
            this.state.systemUsers = initialState.systemUsers;

            // Also update current user details if logged in
            if (this.state.currentUser) {
                const updatedUser = this.state.systemUsers.find(u => u.username === this.state.currentUser.username);
                if (updatedUser) {
                    this.state.currentUser = { ...updatedUser };
                }
            }
            this.save();
        }
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }

    // Employee Methods
    getEmployees() { return this.state.employees; }
    addEmployee(emp) {
        emp.id = 'EMP' + (this.state.employees.length + 1).toString().padStart(3, '0');
        this.state.employees.push(emp);
        this.save();
    }
    updateEmployee(id, updates) {
        const idx = this.state.employees.findIndex(e => e.id === id);
        if (idx !== -1) {
            this.state.employees[idx] = { ...this.state.employees[idx], ...updates };
            this.save();
        }
    }
    deleteEmployee(id) {
        this.state.employees = this.state.employees.filter(e => e.id !== id);
        this.save();
    }

    // Company Methods
    getCompanies() { return this.state.companies; }
    getLocations() { return this.state.locations; }
    getClients() { return this.state.clients; }
    getClientTasks() { return this.state.clientTasks || []; }

    addClientTask(task) {
        task.id = 'TSK' + (this.state.clientTasks.length + 1).toString().padStart(3, '0');
        if (!this.state.clientTasks) this.state.clientTasks = [];
        this.state.clientTasks.push(task);
        this.save();
    }

    // Shift Methods
    getShifts() { return this.state.shifts; }
    getShiftAssignments() { return this.state.shiftAssignments; }

    getReminders() { return this.state.reminders; }

    // Authentication Methods
    login(username, password) {
        const user = this.state.systemUsers.find(u => u.username === username && u.password === password);
        if (user) {
            this.state.currentUser = { ...user };
            delete this.state.currentUser.password; // Security: Don't keep password in active session
            this.save();
            return true;
        }
        return false;
    }

    logout() {
        this.state.currentUser = null;
        this.save();
    }

    getCurrentUser() {
        return this.state.currentUser;
    }

    // Attendance Methods
    getAttendance(date) { return this.state.attendance[date] || {}; }
    markAttendance(date, empId, status) {
        if (!this.state.attendance[date]) this.state.attendance[date] = {};
        this.state.attendance[date][empId] = status;
        this.save();
    }
}

const store = new HRMStore();
window.store = store; // For debugging
