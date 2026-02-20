/**
 * UI Components for HRM Pro
 */

const Components = {
    // Stat Card for Dashboard
    StatCard: (title, value, trend, icon, color) => `
        <div class="card stat-card fade-in">
            <div class="stat-header">
                <div>
                    <span class="stat-label">${title}</span>
                    <h2 class="stat-value">${value}</h2>
                </div>
                <div class="stat-icon" style="background-color: rgba(${color}, 0.1); color: rgb(${color})">
                    <i data-lucide="${icon}"></i>
                </div>
            </div>
            <div class="stat-trend ${trend.startsWith('+') ? 'trend-up' : 'trend-down'}">
                <i data-lucide="${trend.startsWith('+') ? 'arrow-up-right' : 'arrow-down-right'}"></i>
                <span>${trend} from last month</span>
            </div>
        </div>
    `,

    // Table Row for Employees
    EmployeeRow: (emp) => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${emp.name.split(' ').map(n => n[0]).join('')}</div>
                    <span>${emp.name}</span>
                </div>
            </td>
            <td>${emp.mobile}</td>
            <td>${emp.email}</td>
            <td>${emp.joiningDate}</td>
            <td><span class="status-badge ${emp.status === 'Active' ? 'active-status' : 'inactive-status'}">${emp.status}</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="icon-button" onclick="handleEditEmployee('${emp.id}')" title="Edit"><i data-lucide="edit-3"></i></button>
                    <button class="icon-button" onclick="handleDeleteEmployee('${emp.id}')" title="Delete" style="color: var(--danger)"><i data-lucide="trash-2"></i></button>
                </div>
            </td>
        </tr>
    `,

    // Shift Card for Shift Management
    ShiftCard: (shift, count = 0) => `
        <div class="card fade-in" style="border-left: 4px solid ${shift.color}">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-size: 1.125rem; font-weight: 600;">${shift.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.875rem;">${shift.time}</p>
                </div>
                <div class="stat-icon" style="background-color: ${shift.color}20; color: ${shift.color}">
                    <i data-lucide="clock"></i>
                </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.875rem; font-weight: 500;">${count} Employees</span>
                <button class="btn btn-secondary btn-icon" title="View Details"><i data-lucide="chevron-right"></i></button>
            </div>
        </div>
    `,

    // Company Card
    CompanyCard: (company) => `
        <div class="card fade-in">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div class="logo-icon" style="width: 48px; height: 48px; border-radius: 12px;">${company.name[0]}</div>
                    <div>
                        <h3 style="font-weight: 700;">${company.name}</h3>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Client: ${company.clientName}</p>
                    </div>
                </div>
                <button class="icon-button"><i data-lucide="more-vertical"></i></button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="color: var(--text-muted); font-size: 0.75rem;">GST Number</label>
                    <p style="font-weight: 600; font-size: 0.875rem;">${company.gstNumber}</p>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="color: var(--text-muted); font-size: 0.75rem;">Locations</label>
                    <p style="font-weight: 600; font-size: 0.875rem;">${company.locations?.length || 0} Sites</p>
                </div>
            </div>
            <button class="btn btn-secondary" style="width: 100%;">Managed Assigned Staff</button>
        </div>
    `,

    // Render Form Field
    FormField: (label, id, type = 'text', placeholder = '', value = '', required = false) => `
        <div class="form-group">
            <label for="${id}">${label} ${required ? '<span style="color: var(--danger)">*</span>' : ''}</label>
            <input type="${type}" id="${id}" class="form-control" placeholder="${placeholder}" value="${value}" ${required ? 'required' : ''}>
        </div>
    `,

    // Select Field
    SelectField: (label, id, options, value = '', required = false) => `
        <div class="form-group">
            <label for="${id}">${label} ${required ? '<span style="color: var(--danger)">*</span>' : ''}</label>
            <select id="${id}" class="form-control" ${required ? 'required' : ''}>
                <option value="">Select ${label}</option>
                ${options.map(opt => `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
        </div>
    `,

    // ID Card Template
    IDCard: (emp) => `
        <div class="id-card fade-in" style="width: 350px; height: 550px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; position: relative; border: 1px solid var(--border); font-family: 'Inter', sans-serif;">
            <div style="height: 100px; background: linear-gradient(135deg, var(--primary), #818cf8); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
                <h3 style="margin: 0; font-size: 1.1rem; letter-spacing: 1px;">HRM PRO WEB</h3>
                <p style="font-size: 0.65rem; opacity: 0.9; text-transform: uppercase;">Employee Identity Card</p>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; margin-top: -45px; padding: 15px;">
                <div style="width: 90px; height: 90px; border-radius: 50%; border: 4px solid white; background: var(--secondary); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; margin-bottom: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    ${emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 2px;">${emp.name}</h4>
                <p style="color: var(--primary); font-weight: 700; font-size: 0.8rem; margin-bottom: 15px;">EMPLOYEE</p>
                
                <div style="width: 100%; text-align: left; padding: 0 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div style="grid-column: span 2; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 5px;">
                        <span style="font-size: 0.6rem; color: var(--text-muted); display: block; text-transform: uppercase;">Employee ID</span>
                        <span style="font-size: 0.8rem; font-weight: 700; color: #334155;">${emp.id}</span>
                    </div>
                    <div>
                        <span style="font-size: 0.6rem; color: var(--text-muted); display: block; text-transform: uppercase;">Mobile</span>
                        <span style="font-size: 0.8rem; font-weight: 700; color: #334155;">${emp.mobile}</span>
                    </div>
                    <div>
                        <span style="font-size: 0.6rem; color: var(--text-muted); display: block; text-transform: uppercase;">Blood Group</span>
                        <span style="font-size: 0.8rem; font-weight: 700; color: var(--danger);">${emp.bloodGroup || 'N/A'}</span>
                    </div>
                    <div>
                        <span style="font-size: 0.6rem; color: var(--text-muted); display: block; text-transform: uppercase;">Date of Birth</span>
                        <span style="font-size: 0.8rem; font-weight: 700; color: #334155;">${emp.dob || 'N/A'}</span>
                    </div>
                    <div>
                        <span style="font-size: 0.6rem; color: var(--text-muted); display: block; text-transform: uppercase;">Joining Date</span>
                        <span style="font-size: 0.8rem; font-weight: 700; color: #334155;">${emp.joiningDate}</span>
                    </div>
                    <div style="grid-column: span 2;">
                        <span style="font-size: 0.6rem; color: var(--text-muted); display: block; text-transform: uppercase;">Address</span>
                        <span style="font-size: 0.75rem; font-weight: 600; color: #334155; line-height: 1.2;">${emp.address || 'N/A'}</span>
                    </div>
                </div>
                
                <div style="margin-top: 15px; display: flex; justify-content: center; width: 100%;">
                    <div style="width: 60px; height: 60px; background: #f8fafc; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <i data-lucide="qr-code" style="width: 40px; height: 40px; color: #1e293b;"></i>
                    </div>
                </div>
            </div>
            <div style="position: absolute; bottom: 0; width: 100%; height: 5px; background: var(--primary);"></div>
        </div>
    `,

    // Reminder Item
    ReminderItem: (title, desc, urgency) => `
        <div class="card fade-in" style="border-left: 4px solid ${urgency === 'high' ? 'var(--danger)' : (urgency === 'medium' ? 'var(--warning)' : 'var(--info)')}; margin-bottom: 1rem;">
            <div style="display: flex; gap: 1rem; align-items: start;">
                <div class="stat-icon" style="background: ${urgency === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)'};">
                    <i data-lucide="${urgency === 'high' ? 'alert-circle' : 'bell'}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="font-weight: 700;">${title}</h4>
                    <p style="font-size: 0.875rem; color: var(--text-muted);">${desc}</p>
                </div>
                <button class="icon-button"><i data-lucide="check"></i></button>
            </div>
        </div>
    `,

    ClientCard: (client, tasks = []) => `
        <div class="card fade-in">
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
                <div class="logo-icon" style="background: var(--accent); border-radius: 12px; width: 40px; height: 40px;">${client.name[0]}</div>
                <div>
                    <h3 style="font-weight: 700;">${client.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.75rem;">Onboarded: ${client.date}</p>
                </div>
                <div style="margin-left: auto;">
                    <span class="status-badge active-status" style="font-size: 0.7rem;">Verified</span>
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem; letter-spacing: 0.5px;">Task Status</h4>
                <div class="table-container" style="border: 1px solid var(--border); border-radius: 8px;">
                    <table style="font-size: 0.75rem;">
                        <thead>
                            <tr style="background: var(--secondary) 20;">
                                <th>Task</th>
                                <th>Status</th>
                                <th>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tasks.length ? tasks.map(t => `
                                <tr>
                                    <td style="font-weight: 600;">${t.task}</td>
                                    <td>
                                        <span class="status-badge ${t.status === 'Task Allocated' ? 'info-status' : (t.status === 'In Process' ? 'warning-status' : 'active-status')}" style="padding: 2px 6px; font-size: 0.65rem;">
                                            ${t.status}
                                        </span>
                                    </td>
                                    <td style="color: var(--text-muted);">${t.deadline}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No tasks assigned</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style="font-size: 0.875rem; border-top: 1px solid var(--border); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                   <p style="font-size: 0.7rem; color: var(--text-muted);">CONTACT</p>
                   <p style="font-weight: 600;">${client.contact}</p>
                </div>
                <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">View Sub-companies</button>
            </div>
        </div>
    `
};
