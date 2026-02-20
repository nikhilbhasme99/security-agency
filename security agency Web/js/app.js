/**
 * Main Application Logic for HRM Pro
 */

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

const App = {
    currentView: 'dashboard',

    init() {
        // Initialize Lucide Icons
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Show body after initial load
        document.body.classList.remove('hidden');

        // Check for session
        const currentUser = store.getCurrentUser();
        if (currentUser) {
            this.showApp();
        } else {
            this.setupLogin();
        }

        // Setup Modal Close
        const closeBtn = document.getElementById('close-modal');
        const overlay = document.getElementById('modal-overlay');
        if (closeBtn) closeBtn.onclick = () => this.hideModal();
        if (overlay) {
            overlay.onclick = (e) => {
                if (e.target === overlay) this.hideModal();
            };
        }
    },

    setupLogin() {
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');

        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;

            if (store.login(user, pass)) {
                this.showApp();
            } else {
                loginError.classList.remove('hidden');
                setTimeout(() => loginError.classList.add('hidden'), 3000);
            }
        };
    },

    showApp() {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('app-shell').classList.remove('hidden');

        const user = store.getCurrentUser();
        document.getElementById('current-user-name').textContent = user.name;
        document.getElementById('current-user-avatar').textContent = user.name.split(' ').map(n => n[0]).join('');

        this.setupNavigation();
        this.setupTheme();
        this.renderView('dashboard');

        // Setup Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Logout clicked');
                if (confirm('Are you sure you want to logout?')) {
                    store.logout();
                    location.replace(location.pathname); // Force full reload at root
                }
            };
        }
    },

    setupNavigation() {
        const user = store.getCurrentUser();

        // Filter Sidebar based on role
        document.querySelectorAll('.nav-group').forEach(group => {
            const roleReq = group.getAttribute('data-role');
            if (roleReq === 'superadmin-only' && user.role !== 'Super Admin') {
                group.classList.add('hidden');
            } else {
                group.classList.remove('hidden');
            }
        });

        // Specific item filtering for Admin
        if (user.role === 'Admin') {
            document.querySelectorAll('[data-admin-hide="true"]').forEach(el => el.classList.add('hidden'));
        }

        document.querySelectorAll('.nav-item[data-view]').forEach(item => {
            item.onclick = (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                this.renderView(view);

                // Update UI State
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            };
        });

        // Search Bar functionality (Mock)
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.oninput = (e) => {
                console.log('Searching for:', e.target.value);
            };
        }
    },

    setupTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        let currentTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', currentTheme);

        if (themeToggle) {
            themeToggle.onclick = () => {
                currentTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.body.setAttribute('data-theme', currentTheme);
                localStorage.setItem('theme', currentTheme);

                // Update Icon
                const icon = themeToggle.querySelector('i');
                icon.setAttribute('data-lucide', currentTheme === 'light' ? 'moon' : 'sun');
                lucide.createIcons();
            };
        }
    },

    renderView(viewId) {
        this.currentView = viewId;
        const container = document.getElementById('main-view');
        const title = document.getElementById('page-title');

        // Capitalize for title
        const titles = {
            'dashboard': 'Dashboard Overview',
            'employees': 'Employee Directory',
            'shifts': 'Shift Management',
            'attendance': 'Attendance Tracking',
            'id-cards': 'ID Card Creator',
            'payroll': 'Payroll & Salaries',
            'companies': 'Company Management',
            'locations': 'Location Management',
            'clients': 'Client Status Tracking',
            'admin': 'Admin Control Panel',
            'reminders': 'Reminders & Notifications'
        };
        title.textContent = titles[viewId] || viewId.charAt(0).toUpperCase() + viewId.slice(1);

        // Clear container
        container.innerHTML = '<div class="loader-placeholder" style="display: flex; justify-content: center; padding: 3rem;"><i data-lucide="refresh-cw" class="spin"></i></div>';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            switch (viewId) {
                case 'dashboard':
                    this.renderDashboard(container);
                    break;
                case 'employees':
                    this.renderEmployees(container);
                    break;
                case 'shifts':
                    this.renderShifts(container);
                    break;
                case 'attendance':
                    this.renderAttendance(container);
                    break;
                case 'id-cards':
                    title.textContent = "ID Card Creator";
                    this.renderIDCardView(container);
                    break;
                case 'payroll':
                    this.renderPayroll(container);
                    break;
                case 'companies':
                    this.renderCompanies(container);
                    break;
                case 'locations':
                    this.renderLocations(container);
                    break;
                case 'clients':
                    this.renderClients(container);
                    break;
                case 'reminders':
                    this.renderReminders(container);
                    break;
                case 'admin':
                    this.renderAdmin(container);
                    break;
                default:
                    container.innerHTML = `
                        <div class="card" style="text-align: center; padding: 5rem;">
                            <i data-lucide="construction" style="width: 64px; height: 64px; color: var(--primary); margin-bottom: 1.5rem;"></i>
                            <h2>${viewId.charAt(0).toUpperCase() + viewId.slice(1)} Module</h2>
                            <p style="color: var(--text-muted); margin-top: 1rem;">This module is being developed with premium features. Stay tuned!</p>
                        </div>
                    `;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 300);
    },

    // --- View Renderers ---

    renderDashboard(container) {
        const employees = store.getEmployees();
        const activeCount = employees.filter(e => e.status === 'Active').length;
        const user = store.getCurrentUser();

        container.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <h2 style="font-size: 1.5rem; font-weight: 800;">Welcome back, ${user.name}! 👋</h2>
                <p style="color: var(--text-muted);">${user.role} Dashboard Overview</p>
            </div>

            <div class="grid grid-cols-4" style="margin-bottom: 2rem;">
                ${Components.StatCard('Total Employees', employees.length, '+8%', 'users', '99, 102, 241')}
                ${Components.StatCard('Active Now', activeCount, '+12%', 'user-check', '16, 185, 129')}
                ${Components.StatCard('On Leave', '3', '-2%', 'calendar-off', '239, 68, 68')}
                ${Components.StatCard('Shift Coverage', '96%', '+2%', 'layout', '245, 158, 11')}
            </div>

            <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 1.5rem;">
                <div class="card" style="height: 350px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h3 style="font-weight: 700;">Attendance Patterns</h3>
                        <div style="display: flex; gap: 0.5rem;">
                             <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Weekly</button>
                             <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Monthly</button>
                        </div>
                    </div>
                    <div style="height: 230px;">
                        <canvas id="mainChart"></canvas>
                    </div>
                </div>
                
                <div class="card">
                     <h3 style="font-weight: 700; margin-bottom: 1.5rem;">Recent Activities</h3>
                     <div class="activity-list" style="display: flex; flex-direction: column; gap: 1rem;">
                        ${this.renderActivityItem('New Employee Joined', 'Rahul Patil joined TechWave Solutions', '2h ago', 'user-plus', 'var(--primary)')}
                        ${user.role === 'Super Admin' ? this.renderActivityItem('Payroll Generated', 'Jan 2026 payroll for InnoServices generated', '5h ago', 'banknote', 'var(--accent)') : ''}
                        ${this.renderActivityItem('Leave Approved', 'Anjali Sharma medical leave approved', '1d ago', 'check-circle', 'var(--info)')}
                        ${this.renderActivityItem('Shift Changed', 'Morning shift count updated for LOC001', '2d ago', 'clock', 'var(--warning)')}
                     </div>
                </div>
            </div>
        `;

        // Initialize Chart
        this.initMainChart();
    },

    renderActivityItem(title, desc, time, icon, color) {
        return `
            <div style="display: flex; gap: 1rem; align-items: start;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: ${color}15; color: ${color}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i data-lucide="${icon}" style="width: 16px;"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="font-size: 0.875rem; font-weight: 600;">${title}</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted);">${desc}</p>
                    <span style="font-size: 0.7rem; color: var(--text-muted); opacity: 0.7;">${time}</span>
                </div>
            </div>
        `;
    },

    renderEmployees(container) {
        const employees = store.getEmployees();

        container.innerHTML = `
            <div class="card fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h3 style="font-weight: 700;">Employee Directory</h3>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Manage all employees from here.</p>
                    </div>
                    <button class="btn btn-primary" id="add-employee-btn">
                        <i data-lucide="plus"></i> Add New Employee
                    </button>
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Join Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="employee-table-body">
                            ${employees.map(emp => Components.EmployeeRow(emp)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('add-employee-btn').onclick = () => this.showAddEmployeeModal();
    },

    renderShifts(container) {
        const shifts = store.getShifts();
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h3 style="font-weight: 700;">Shift Management</h3>
                    <p style="color: var(--text-muted); font-size: 0.875rem;">Configure and assign shifts across locations.</p>
                </div>
                <button class="btn btn-primary"><i data-lucide="plus"></i> Create Shift Setup</button>
            </div>
            
            <div class="grid grid-cols-3">
                ${shifts.map(s => Components.ShiftCard(s, s.id === 'SHF002' ? 25 : 12)).join('')}
            </div>

            <div class="card" style="margin-top: 2rem;">
                <h3 style="font-weight: 700; margin-bottom: 1.5rem;">Quick Assign Shift</h3>
                <form id="assign-shift-form" class="grid grid-cols-4">
                    ${Components.SelectField('Employee', 'shift-emp', store.getEmployees().map(e => ({ label: e.name, value: e.id })), '', true)}
                    ${Components.SelectField('Shift', 'shift-id', shifts.map(s => ({ label: s.name, value: s.id })), '', true)}
                    ${Components.FormField('Location', 'shift-loc', 'text', 'Enter location manually', '', true)}
                    <div class="form-group" style="display: flex; align-items: flex-end;">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Assign Shift</button>
                    </div>
                </form>
            </div>
        `;
    },

    renderCompanies(container) {
        const companies = store.getCompanies();
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h3 style="font-weight: 700;">Organization Management</h3>
                    <p style="color: var(--text-muted); font-size: 0.875rem;">Manage multiple companies and their registration details.</p>
                </div>
                <button class="btn btn-primary"><i data-lucide="plus"></i> Add Company</button>
            </div>
            
            <div class="grid grid-cols-2">
                ${companies.map(c => Components.CompanyCard(c)).join('')}
            </div>
        `;
    },

    renderAttendance(container) {
        container.innerHTML = `
             <div class="card fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h3 style="font-weight: 700;">Attendance & Holiday Management</h3>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Default status is Present (P). Manual overrides possible.</p>
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                         <button class="btn btn-secondary"><i data-lucide="calendar"></i> Holiday Setup</button>
                         <button class="btn btn-primary"><i data-lucide="download"></i> Monthly Report</button>
                    </div>
                </div>

                <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 1rem; background: var(--bg-main); border-radius: var(--radius-md);">
                    <button class="icon-button"><i data-lucide="chevron-left"></i></button>
                    <span style="font-weight: 700; font-size: 1.125rem;">February 2026</span>
                    <button class="icon-button"><i data-lucide="chevron-right"></i></button>
                </div>

                <div class="calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem;">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `
                        <div style="text-align: center; color: var(--text-muted); font-weight: 600; font-size: 0.75rem;">${day}</div>
                    `).join('')}
                    
                    ${Array.from({ length: 28 }, (_, i) => {
            const day = i + 1;
            const isWeekend = (day % 7 === 1 || day % 7 === 0);
            return `
                            <div class="card" style="padding: 1rem; text-align: center; cursor: pointer; border: 1px solid ${isWeekend ? 'var(--primary)20' : 'var(--border)'}; background: ${isWeekend ? 'var(--primary)05' : 'var(--bg-card)'}">
                                <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">${day}</div>
                                <div style="font-size: 0.75rem; font-weight: 700; color: ${isWeekend ? 'var(--warning)' : 'var(--accent)'}">${isWeekend ? 'H' : 'P'}</div>
                            </div>
                        `;
        }).join('')}
                </div>
             </div>
        `;
    },

    renderIDCardView(container) {
        const employees = store.getEmployees();
        container.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-weight: 700;">Employee ID Card Creator</h3>
                <p style="color: var(--text-muted); font-size: 0.875rem;">Select an employee to generate and preview their official identity card.</p>
            </div>
            
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                <div class="card">
                    <h4 style="font-weight: 700; margin-bottom: 1.5rem;">Select Employee</h4>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        ${employees.map(e => `
                            <div class="nav-item" style="justify-content: space-between; padding: 1rem; border: 1px solid var(--border);" onclick="window.handleGenerateID('${e.id}')">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div class="user-avatar" style="width: 32px; height: 32px;">${e.name.split(' ').map(n => n[0]).join('')}</div>
                                    <div>
                                        <p style="font-weight: 600; font-size: 0.875rem;">${e.name}</p>
                                        <p style="font-size: 0.75rem; color: var(--text-muted);">${e.id}</p>
                                    </div>
                                </div>
                                <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="id-card-preview-area" style="display: flex; justify-content: center; align-items: center; min-height: 500px; background: var(--bg-main); border-radius: var(--radius-lg); border: 2px dashed var(--border);">
                    <div style="text-align: center; color: var(--text-muted);">
                        <i data-lucide="contact-2" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.3;"></i>
                        <p>Select an employee from the list<br>to view preview</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderPayroll(container) {
        const employees = store.getEmployees();
        container.innerHTML = `
            <div class="card fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h3 style="font-weight: 700;">Payroll Management</h3>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Calculate salaries, PF, and generate slips per company.</p>
                    </div>
                    <select class="form-control" style="width: auto; background: var(--bg-main);">
                        ${store.getCompanies().map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Days</th>
                                <th>Salary (Base)</th>
                                <th>PF (12%)</th>
                                <th>Advances</th>
                                <th>Net Payable</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees.map(e => `
                                <tr>
                                    <td style="font-weight: 600;">${e.name}</td>
                                    <td>22/22</td>
                                    <td>₹${e.salary.toLocaleString()}</td>
                                    <td>₹${e.pfApplicable ? (e.salary * 0.12).toFixed(0) : '0'}</td>
                                    <td style="color: var(--danger)">-₹2,000</td>
                                    <td style="font-weight: 700; color: var(--primary)">₹${(e.salary - (e.pfApplicable ? e.salary * 0.12 : 0) - 2000).toLocaleString()}</td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;"><i data-lucide="printer"></i> Print Slip</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
         `;
    },

    renderLocations(container) {
        const locations = store.getLocations();
        container.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-weight: 700;">Location Management</h3>
                <p style="color: var(--text-muted); font-size: 0.875rem;">Manage office locations and site mapping.</p>
            </div>
            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>Location ID</th><th>Name</th><th>Parent Company</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${locations.map(l => `
                                <tr>
                                    <td>${l.id}</td>
                                    <td><strong>${l.name}</strong></td>
                                    <td>${store.getCompanies().find(c => c.id === l.companyId)?.name || 'N/A'}</td>
                                    <td><span class="status-badge active-status">Operational</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <button class="btn btn-primary" style="margin-top: 1.5rem;"><i data-lucide="plus"></i> Add New Location</button>
            </div>
        `;
    },

    renderReminders(container) {
        const reminders = store.getReminders();
        container.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-weight: 700;">Reminders & Notifications</h3>
                    <p style="color: var(--text-muted); font-size: 0.875rem;">Stay updated with system generated alerts and manual reminders.</p>
                </div>
                ${reminders.map(r => Components.ReminderItem(r.title, r.desc, r.urgency)).join('')}
                <button class="btn btn-primary" style="margin-top: 1rem;"><i data-lucide="plus"></i> Add Personal Reminder</button>
            </div>
        `;
    },

    renderClients(container) {
        const clients = store.getClients();
        const tasks = store.getClientTasks();
        const user = store.getCurrentUser();

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h3 style="font-weight: 700;">Client Onboarding</h3>
                    <p style="color: var(--text-muted); font-size: 0.875rem;">Manage direct clients and their respective company assignments.</p>
                </div>
                ${user.role === 'Admin' ? '<button class="btn btn-primary" onclick="App.showAddTaskModal()"><i data-lucide="plus-circle"></i> Add Status Task</button>' : ''}
            </div>
            <div class="grid grid-cols-2">
                ${clients.map(c => Components.ClientCard(c, tasks.filter(t => t.clientId === c.id))).join('')}
                ${user.role === 'Admin' ? `
                    <div class="card" style="border: 2px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted); cursor: pointer; min-height: 250px;">
                        <i data-lucide="user-plus" style="width: 48px; height: 48px;"></i>
                        <p style="font-weight: 600;">Onboard New Client</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    showAddTaskModal() {
        const clients = store.getClients().map(c => ({ label: c.name, value: c.id }));
        const statuses = [
            { label: 'Task Allocated', value: 'Task Allocated' },
            { label: 'In Process', value: 'In Process' },
            { label: 'Followup', value: 'Followup' }
        ];

        const content = `
            <form id="add-task-form">
                ${Components.SelectField('Client', 'task-client', clients, '', true)}
                ${Components.FormField('Task Name', 'task-name', 'text', 'e.g. KYC Verification', '', true)}
                ${Components.SelectField('Status', 'task-status', statuses, 'Task Allocated', true)}
                ${Components.FormField('Deadline', 'task-deadline', 'date', '', '', true)}
                <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" onclick="App.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Assign Task</button>
                </div>
            </form>
        `;

        this.showModal('Add Client Status Task', content);

        document.getElementById('add-task-form').onsubmit = (e) => {
            e.preventDefault();
            const newTask = {
                clientId: document.getElementById('task-client').value,
                task: document.getElementById('task-name').value,
                status: document.getElementById('task-status').value,
                deadline: document.getElementById('task-deadline').value
            };
            store.addClientTask(newTask);
            this.hideModal();
            this.renderView('clients');
        };
    },

    renderAdmin(container) {
        container.innerHTML = `
            <div class="grid grid-cols-2">
                <div class="card">
                    <h3 style="font-weight: 700; margin-bottom: 1.5rem;">User Permissions</h3>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr><th>User</th><th>Role</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Super Admin</td><td>Full Access</td><td><span class="status-badge active-status">Active</span></td></tr>
                                <tr><td>Admin User 1</td><td>Company Manager</td><td><span class="status-badge active-status">Active</span></td></tr>
                                <tr><td>HR Lead</td><td>Employee Manager</td><td><span class="status-badge inactive-status">Offline</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 1.5rem;">Create New Admin User</button>
                </div>
                
                <div class="card">
                    <h3 style="font-weight: 700; margin-bottom: 1.5rem;">System Configuration</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>Automatic Attendance Marking</span>
                            <input type="checkbox" checked>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>Email Notifications for Salary Slips</span>
                            <input type="checkbox" checked>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>Dark mode as default</span>
                            <input type="checkbox">
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>Two-Factor Authentication</span>
                            <input type="checkbox" checked>
                        </div>
                    </div>
                    <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border);">
                    <button class="btn btn-primary">Save System Settings</button>
                </div>
            </div>
            
            <div class="card" style="margin-top: 2.0rem;">
                 <h3 style="font-weight: 700; margin-bottom: 1.5rem;">3-Dimension Dashboard View</h3>
                 <div class="grid grid-cols-3">
                    <button class="btn btn-secondary"><i data-lucide="building"></i> Company-wise View</button>
                    <button class="btn btn-secondary"><i data-lucide="map-pin"></i> Location-wise View</button>
                    <button class="btn btn-secondary"><i data-lucide="users"></i> Employee-wise View</button>
                 </div>
            </div>
        `;
    },

    // --- Modal Logic ---

    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-overlay').style.display = 'flex';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    hideModal() {
        document.getElementById('modal-overlay').style.display = 'none';
    },

    showAddEmployeeModal() {
        const companies = store.getCompanies().map(c => ({ label: c.name, value: c.id }));
        const locations = store.getLocations().map(l => ({ label: l.name, value: l.id }));

        const content = `
            <form id="add-employee-form">
                <div class="grid grid-cols-2">
                    ${Components.FormField('Full Name', 'emp-name', 'text', 'Enter name', '', true)}
                    ${Components.FormField('Mobile Number', 'emp-mobile', 'tel', '10 digit mobile', '', true)}
                    ${Components.FormField('Email Address', 'emp-email', 'email', 'user@email.com', '', true)}
                    ${Components.FormField('Aadhaar Number', 'emp-aadhaar', 'text', '0000-0000-0000', '', true)}
                    ${Components.FormField('PAN Number', 'emp-pan', 'text', 'ABCDE1234F', '', true)}
                    ${Components.FormField('Joining Date', 'emp-date', 'date', '', '', true)}
                    ${Components.FormField('Date of Birth', 'emp-dob', 'date', '', '', true)}
                    ${Components.SelectField('Blood Group', 'emp-blood', [
            { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
            { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
            { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' },
            { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' }
        ], '', true)}
                    ${Components.SelectField('Company', 'emp-company', companies, '', true)}
                    ${Components.SelectField('Location', 'emp-location', locations, '', true)}
                    ${Components.SelectField('PF Applicable', 'emp-pf', [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], 'yes', true)}
                    ${Components.FormField('Monthly Salary', 'emp-salary', 'number', '0.00', '', true)}
                    <div class="form-group" style="grid-column: span 2;">
                        <label>Residential Address</label>
                        <textarea id="emp-address" class="form-control" rows="2" placeholder="Enter full address" required style="resize: none;"></textarea>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 1.5rem;">
                    <label>Document Upload (Aadhaar/PAN)</label>
                    <div style="border: 2px dashed var(--border); padding: 2rem; text-align: center; border-radius: var(--radius-md);">
                        <i data-lucide="upload-cloud" style="width: 32px; height: 32px; color: var(--text-muted); margin-bottom: 1rem;"></i>
                        <p style="font-size: 0.875rem; color: var(--text-muted)">Click or drag files to upload</p>
                        <input type="file" multiple style="opacity: 0; position: absolute; inset: 0; cursor: pointer;">
                    </div>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" onclick="App.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Employee</button>
                </div>
            </form>
        `;

        this.showModal('Add New Employee', content);

        document.getElementById('add-employee-form').onsubmit = (e) => {
            e.preventDefault();
            const newEmp = {
                name: document.getElementById('emp-name').value,
                mobile: document.getElementById('emp-mobile').value,
                email: document.getElementById('emp-email').value,
                aadhaar: document.getElementById('emp-aadhaar').value,
                pan: document.getElementById('emp-pan').value,
                joiningDate: document.getElementById('emp-date').value,
                companyId: document.getElementById('emp-company').value,
                locationId: document.getElementById('emp-location').value,
                pfApplicable: document.getElementById('emp-pf').value === 'yes',
                salary: parseFloat(document.getElementById('emp-salary').value),
                bloodGroup: document.getElementById('emp-blood').value,
                dob: document.getElementById('emp-dob').value,
                address: document.getElementById('emp-address').value,
                status: 'Active',
                documents: []
            };

            store.addEmployee(newEmp);
            this.hideModal();
            this.renderView('employees');
            this.showToast('Employee added successfully!');
        };
    },

    showToast(message) {
        // Simple mock toast
        alert(message);
    },

    // --- Helpers ---

    initMainChart() {
        const ctx = document.getElementById('mainChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Feb 14', 'Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20'],
                datasets: [
                    {
                        label: 'Present Count',
                        data: [42, 45, 40, 48, 46, 43, 47],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#6366f1',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Target',
                        data: [45, 45, 45, 45, 45, 45, 45],
                        borderColor: '#94a3b8',
                        borderDash: [5, 5],
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { family: 'Inter', size: 12 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#1e293b',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { font: { family: 'Inter' } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Inter' } }
                    }
                }
            }
        });
    }
};

// Global handlers for elements injected via HTML strings
window.handleEditEmployee = (id) => {
    console.log('Editing employee:', id);
    alert('Edit functionality for ' + id + ' coming soon!');
};

window.handleGenerateID = (id) => {
    const emp = store.getEmployees().find(e => e.id === id);
    if (!emp) return;

    const previewArea = document.getElementById('id-card-preview-area');
    const cardHtml = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            ${Components.IDCard(emp)}
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button class="btn btn-secondary" onclick="window.print()"><i data-lucide="printer"></i> Print ID Card</button>
                <button class="btn btn-primary"><i data-lucide="download"></i> Download Image</button>
            </div>
        </div>
    `;

    if (previewArea) {
        previewArea.innerHTML = cardHtml;
        previewArea.style.background = 'white';
        previewArea.style.borderStyle = 'solid';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } else {
        App.showModal('Identity Card Preview', cardHtml);
    }
};

window.handleDeleteEmployee = (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
        store.deleteEmployee(id);
        App.renderView('employees');
    }
};
