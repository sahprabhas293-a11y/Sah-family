import { useCallback, useEffect, useMemo, useState } from 'react'

const API = '/api'
const initialStaffForm = { fullName: '', email: '', phone: '', jobTitle: '', salary: '', departmentId: '' }
const initialDepartmentForm = { name: '', description: '', location: '' }

function Icon({ name, size = 19 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    building: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M9 21V8h6v13M7 8h.01M17 8h.01M7 12h.01M17 12h.01M7 16h.01M17 16h.01"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
    money: <><rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9a7 7 0 0 1 11.6-2L20 12M4 12l2.9 5a7 7 0 0 0 11.6-2"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>
}

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || '—'
}
function money(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount) : '—'
}
function prettyDate() {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())
}

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [staff, setStaff] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [staffModal, setStaffModal] = useState(null)
  const [departmentModal, setDepartmentModal] = useState(null)
  const [staffForm, setStaffForm] = useState(initialStaffForm)
  const [departmentForm, setDepartmentForm] = useState(initialDepartmentForm)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [staffResponse, departmentResponse] = await Promise.all([
        fetch(`${API}/staff`), fetch(`${API}/departments`),
      ])
      if (!staffResponse.ok || !departmentResponse.ok) throw new Error('The API returned an error. Confirm that Spring Boot is running on port 8080.')
      const [staffData, departmentData] = await Promise.all([staffResponse.json(), departmentResponse.json()])
      setStaff(Array.isArray(staffData) ? staffData : [])
      setDepartments(Array.isArray(departmentData) ? departmentData : [])
    } catch (err) {
      setError(`${err.message || 'Could not connect to the API.'} Start your Spring Boot backend, then select Refresh.`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(''), 3500)
    return () => clearTimeout(timer)
  }, [notice])

  const departmentById = useMemo(() => Object.fromEntries(departments.map(dept => [dept.id, dept])), [departments])
  const totalSalary = staff.reduce((sum, member) => sum + (Number(member.salary) || 0), 0)
  const filteredStaff = staff.filter(member => [member.fullName, member.email, member.jobTitle, departmentById[member.departmentId]?.name].some(value => String(value || '').toLowerCase().includes(search.toLowerCase())))
  const staffPerDepartment = departments.map(dept => ({ ...dept, count: staff.filter(member => member.departmentId === dept.id).length }))

  async function saveStaff(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const editing = staffModal?.mode === 'edit'
      const response = await fetch(editing ? `${API}/staff/${staffModal.record.id}` : `${API}/staff`, {
        method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...staffForm, salary: Number(staffForm.salary), departmentId: staffForm.departmentId }),
      })
      if (!response.ok) throw new Error(await responseMessage(response))
      setStaffModal(null); setNotice(editing ? 'Staff record updated.' : 'Staff member added.')
      await loadData()
    } catch (err) { setError(err.message || 'Unable to save staff member.') }
    finally { setSaving(false) }
  }

  async function saveDepartment(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const editing = departmentModal?.mode === 'edit'
      const response = await fetch(editing ? `${API}/departments/${departmentModal.record.id}` : `${API}/departments`, {
        method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(departmentForm),
      })
      if (!response.ok) throw new Error(await responseMessage(response))
      setDepartmentModal(null); setNotice(editing ? 'Department updated.' : 'Department created.')
      await loadData()
    } catch (err) { setError(err.message || 'Unable to save department.') }
    finally { setSaving(false) }
  }

  async function deleteRecord(type, record) {
    const label = type === 'staff' ? record.fullName : record.name
    if (!window.confirm(`Delete ${label}? This action cannot be undone.`)) return
    try {
      const response = await fetch(`${API}/${type}/${record.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(await responseMessage(response))
      setNotice(`${type === 'staff' ? 'Staff member' : 'Department'} deleted.`)
      await loadData()
    } catch (err) { setError(err.message || 'Delete failed.') }
  }

  function openStaffCreate() { setStaffForm({ ...initialStaffForm, departmentId: departments[0]?.id || '' }); setStaffModal({ mode: 'create' }); setError('') }
  function openStaffEdit(record) { setStaffForm({ fullName: record.fullName || '', email: record.email || '', phone: record.phone || '', jobTitle: record.jobTitle || '', salary: String(record.salary ?? ''), departmentId: record.departmentId || '' }); setStaffModal({ mode: 'edit', record }); setError('') }
  function openDepartmentCreate() { setDepartmentForm(initialDepartmentForm); setDepartmentModal({ mode: 'create' }); setError('') }
  function openDepartmentEdit(record) { setDepartmentForm({ name: record.name || '', description: record.description || '', location: record.location || '' }); setDepartmentModal({ mode: 'edit', record }); setError('') }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">SF</div><div><strong>Sah Family</strong><span>OFFICE MANAGEMENT</span></div></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="navigation" aria-label="Main navigation">
        {[['Dashboard', 'grid'], ['Staff Management', 'users'], ['Departments', 'building']].map(([label, icon]) => <button key={label} className={`nav-link ${page === label ? 'active' : ''}`} onClick={() => { setPage(label); setSearch('') }}><Icon name={icon}/><span>{label}</span>{page === label && <span className="active-indicator"/>}</button>)}
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><strong>Need a hand?</strong><p>Manage your office records from one simple workspace.</p><button onClick={() => setNotice('Use the left navigation to switch between dashboard, staff, and departments.')}>Quick tip <Icon name="arrow" size={15}/></button></div><div className="sidebar-user"><div className="avatar avatar-indigo">SF</div><div className="user-copy"><strong>Sah Family Office</strong><span>Administrator</span></div><Icon name="more"/></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div><div className="topbar-right"><div className="date-label"><Icon name="calendar" size={16}/>{prettyDate()}</div><span className="topbar-divider"/><button className="icon-button notification-button" title="Notifications" onClick={() => setNotice('You are all caught up.')}><Icon name="bell"/><i/></button><div className="top-avatar">SF</div></div></header>
      <div className="page-content">
        {error && <div className="alert alert-error"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error"><Icon name="close" size={17}/></button></div>}
        {notice && <div className="alert alert-success"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification"><Icon name="close" size={17}/></button></div>}
        {page === 'Dashboard' && <>
          <div className="page-heading"><div><div className="eyebrow">OVERVIEW</div><h1>Good to see you <span className="wave">✦</span></h1><p>Here’s what’s happening across your office today.</p></div><button className="button button-secondary" onClick={loadData}><Icon name="refresh" size={17}/> Refresh data</button></div>
          <section className="metric-grid">
            <MetricCard title="Total staff" value={staff.length} subtitle="People in your organization" icon="users" tone="violet" badge="Live data" />
            <MetricCard title="Departments" value={departments.length} subtitle="Teams across the office" icon="building" tone="blue" badge="Live data" />
            <MetricCard title="Monthly payroll" value={money(totalSalary)} subtitle="Combined listed salaries" icon="money" tone="green" badge="Estimate" />
            <MetricCard title="Average salary" value={staff.length ? money(totalSalary / staff.length) : money(0)} subtitle="Per staff member" icon="grid" tone="orange" badge="Estimate" />
          </section>
          <section className="dashboard-grid">
            <div className="panel staff-panel"><div className="panel-heading"><div><h2>Recent staff</h2><p>Your latest employee records</p></div><button className="text-link" onClick={() => setPage('Staff Management')}>View all <Icon name="arrow" size={15}/></button></div>
              {loading ? <LoadingRows/> : staff.length ? <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>JOB TITLE</th><th>DEPARTMENT</th><th>SALARY</th></tr></thead><tbody>{staff.slice(0, 5).map(person => <tr key={person.id}><td><div className="person-cell"><div className={`avatar ${avatarTone(person.fullName)}`}>{initials(person.fullName)}</div><div><strong>{person.fullName}</strong><span>{person.email}</span></div></div></td><td>{person.jobTitle}</td><td><span className="department-pill">{departmentById[person.departmentId]?.name || 'Unassigned'}</span></td><td className="salary-cell">{money(person.salary)}</td></tr>)}</tbody></table></div> : <EmptyState title="No staff records yet" detail="Add a staff member to see them here."/>}
            </div>
            <div className="panel department-panel"><div className="panel-heading"><div><h2>Departments</h2><p>Staff distribution by team</p></div><button className="icon-button subtle" title="Manage departments" onClick={() => setPage('Departments')}><Icon name="arrow" size={17}/></button></div>
              {loading ? <LoadingRows/> : departments.length ? <div className="department-list">{staffPerDepartment.map((dept, index) => <div className="department-row" key={dept.id}><div className={`department-icon dept-tone-${index % 4}`}><Icon name="building" size={18}/></div><div className="department-info"><strong>{dept.name}</strong><span>{dept.location || 'Location not set'}</span><div className="progress-track"><div className={`progress-fill fill-${index % 4}`} style={{ width: `${staff.length ? Math.max(4, (dept.count / staff.length) * 100) : 0}%` }}/></div></div><div className="department-count"><strong>{dept.count}</strong><span>{dept.count === 1 ? 'person' : 'people'}</span></div></div>)}</div> : <EmptyState title="No departments yet" detail="Create departments to organize your team."/>}
              <button className="outline-full-button" onClick={() => setPage('Departments')}>Manage departments <Icon name="arrow" size={16}/></button>
            </div>
          </section>
          <div className="bottom-note"><span className="status-dot"/> Connected to your office records <span className="note-separator">·</span> Data loads from your Spring Boot API</div>
        </>}

        {page === 'Staff Management' && <>
          <div className="page-heading"><div><div className="eyebrow">PEOPLE</div><h1>Staff management</h1><p>Keep employee information organized and up to date.</p></div><button className="button button-primary" onClick={openStaffCreate}><Icon name="plus" size={18}/> Add staff member</button></div>
          <div className="list-toolbar"><div className="search-box"><Icon name="search" size={18}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name, role, email, department..." aria-label="Search staff"/><kbd>⌘ K</kbd></div><button className="button button-secondary" onClick={loadData}><Icon name="refresh" size={16}/> Refresh</button></div>
          <div className="panel list-panel"><div className="list-panel-heading"><div><h2>All staff <span className="count-bubble">{filteredStaff.length}</span></h2><p>Employee directory and department assignments</p></div></div>
            {loading ? <LoadingRows/> : filteredStaff.length ? <div className="table-wrap"><table className="full-table"><thead><tr><th>EMPLOYEE</th><th>CONTACT</th><th>JOB TITLE</th><th>DEPARTMENT</th><th>MONTHLY SALARY</th><th>ACTIONS</th></tr></thead><tbody>{filteredStaff.map(person => <tr key={person.id}><td><div className="person-cell"><div className={`avatar ${avatarTone(person.fullName)}`}>{initials(person.fullName)}</div><div><strong>{person.fullName}</strong><span>ID: {person.id.slice(-6)}</span></div></div></td><td><div className="contact-cell"><span>{person.email}</span><small>{person.phone || 'No phone added'}</small></div></td><td>{person.jobTitle}</td><td><span className="department-pill">{departmentById[person.departmentId]?.name || 'Unassigned'}</span></td><td className="salary-cell">{money(person.salary)}</td><td><div className="row-actions"><button className="icon-button action-edit" title={`Edit ${person.fullName}`} onClick={() => openStaffEdit(person)}><Icon name="edit" size={16}/></button><button className="icon-button action-delete" title={`Delete ${person.fullName}`} onClick={() => deleteRecord('staff', person)}><Icon name="trash" size={16}/></button></div></td></tr>)}</tbody></table></div> : <EmptyState title="No matching staff" detail={search ? 'Try another search term.' : 'Add your first staff member to get started.'}/>}</div>
        </>}

        {page === 'Departments' && <>
          <div className="page-heading"><div><div className="eyebrow">ORGANIZATION</div><h1>Department management</h1><p>Organize teams and see how your staff are distributed.</p></div><button className="button button-primary" onClick={openDepartmentCreate}><Icon name="plus" size={18}/> Add department</button></div>
          <div className="department-summary"><div><span>Total departments</span><strong>{departments.length}</strong></div><div><span>Assigned staff</span><strong>{staff.filter(person => departments.some(dept => dept.id === person.departmentId)).length}</strong></div><div><span>Teams with staff</span><strong>{staffPerDepartment.filter(dept => dept.count > 0).length}</strong></div></div>
          {loading ? <div className="panel"><LoadingRows/></div> : departments.length ? <div className="department-card-grid">{staffPerDepartment.map((dept, index) => <article className="department-card" key={dept.id}><div className="department-card-top"><div className={`department-icon dept-tone-${index % 4}`}><Icon name="building" size={21}/></div><div className="row-actions"><button className="icon-button action-edit" title={`Edit ${dept.name}`} onClick={() => openDepartmentEdit(dept)}><Icon name="edit" size={16}/></button><button className="icon-button action-delete" title={`Delete ${dept.name}`} onClick={() => deleteRecord('departments', dept)}><Icon name="trash" size={16}/></button></div></div><div className="department-card-title"><h2>{dept.name}</h2><p>{dept.description || 'No description provided.'}</p></div><div className="department-card-location"><Icon name="pin" size={16}/>{dept.location || 'Location not set'}</div><div className="department-card-bottom"><div className="mini-avatars">{staff.filter(person => person.departmentId === dept.id).slice(0, 3).map(person => <span key={person.id} className={`mini-avatar ${avatarTone(person.fullName)}`} title={person.fullName}>{initials(person.fullName)}</span>)}{dept.count === 0 && <span className="no-people">—</span>}</div><span className="member-count">{dept.count} {dept.count === 1 ? 'member' : 'members'}</span></div></article>)}</div> : <div className="panel"><EmptyState title="No departments yet" detail="Create a department to start organizing your office."/></div>}
        </>}
        <footer className="page-footer"><span>© {new Date().getFullYear()} Sah Family Office</span><span>Office management made simpler.</span></footer>
      </div>
    </main>

    {staffModal && <Modal title={staffModal.mode === 'edit' ? 'Edit staff member' : 'Add staff member'} subtitle="Enter the employee details below." onClose={() => setStaffModal(null)}><form className="form-grid" onSubmit={saveStaff}><Field label="Full name" required><input autoFocus required value={staffForm.fullName} onChange={e => setStaffForm({ ...staffForm, fullName: e.target.value })} placeholder="e.g. Prabhas Sah"/></Field><Field label="Email address" required><input required type="email" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} placeholder="name@example.com"/></Field><Field label="Phone number"><input value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} placeholder="98XXXXXXXX"/></Field><Field label="Job title" required><input required value={staffForm.jobTitle} onChange={e => setStaffForm({ ...staffForm, jobTitle: e.target.value })} placeholder="e.g. Office Administrator"/></Field><Field label="Monthly salary (NPR)" required><input required type="number" min="0" step="1" value={staffForm.salary} onChange={e => setStaffForm({ ...staffForm, salary: e.target.value })} placeholder="35000"/></Field><Field label="Department" required><select required value={staffForm.departmentId} onChange={e => setStaffForm({ ...staffForm, departmentId: e.target.value })}><option value="" disabled>Select a department</option>{departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}</select></Field><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setStaffModal(null)}>Cancel</button><button type="submit" className="button button-primary" disabled={saving || !departments.length}>{saving ? 'Saving...' : staffModal.mode === 'edit' ? 'Save changes' : 'Add staff member'}</button></div>{!departments.length && <p className="form-hint">Create a department before adding staff.</p>}</form></Modal>}
    {departmentModal && <Modal title={departmentModal.mode === 'edit' ? 'Edit department' : 'Add department'} subtitle="Set up the department information." onClose={() => setDepartmentModal(null)}><form className="form-grid single-column" onSubmit={saveDepartment}><Field label="Department name" required><input autoFocus required value={departmentForm.name} onChange={e => setDepartmentForm({ ...departmentForm, name: e.target.value })} placeholder="e.g. Human Resources"/></Field><Field label="Description"><textarea rows="3" value={departmentForm.description} onChange={e => setDepartmentForm({ ...departmentForm, description: e.target.value })} placeholder="What does this department manage?"/></Field><Field label="Location"><input value={departmentForm.location} onChange={e => setDepartmentForm({ ...departmentForm, location: e.target.value })} placeholder="Kathmandu, Nepal"/></Field><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setDepartmentModal(null)}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Saving...' : departmentModal.mode === 'edit' ? 'Save changes' : 'Create department'}</button></div></form></Modal>}
  </div>
}

async function responseMessage(response) {
  try { const data = await response.json(); return data.message || data.error || `Request failed (${response.status}).` }
  catch { return `Request failed (${response.status}).` }
}
function avatarTone(name = '') { const tones = ['avatar-violet', 'avatar-blue', 'avatar-green', 'avatar-orange', 'avatar-rose']; return tones[(name.charCodeAt(0) || 0) % tones.length] }
function MetricCard({ title, value, subtitle, icon, tone, badge }) { return <article className="metric-card"><div className="metric-top"><div className={`metric-icon metric-${tone}`}><Icon name={icon} size={20}/></div><span className="metric-badge"><i/>{badge}</span></div><div className="metric-value">{value}</div><div className="metric-title">{title}</div><p>{subtitle}</p></article> }
function LoadingRows() { return <div className="loading-state"><span className="spinner"/> Loading records...</div> }
function EmptyState({ title, detail }) { return <div className="empty-state"><div className="empty-icon"><Icon name="grid" size={23}/></div><strong>{title}</strong><p>{detail}</p></div> }
function Field({ label, required, children }) { return <label className="form-field"><span>{label}{required && <b> *</b>}</span>{children}</label> }
function Modal({ title, subtitle, onClose, children }) { return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><h2 id="modal-title">{title}</h2><p>{subtitle}</p></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close"/></button></div>{children}</section></div> }
