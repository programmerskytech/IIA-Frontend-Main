# Quick Start Guide - Admin Panel

## 🚀 Getting Started in 3 Steps

### Step 1: Start Your Application
```bash
cd "e:\Work 2.0\IIA\Frontend-test"
npm start
```

### Step 2: Login as Admin
- Open browser: `http://localhost:3000`
- Login with admin credentials
- Your user must have "Admin" role

### Step 3: Access Admin Panel
- Look at the sidebar menu
- Find **"Admin Panel"** (with settings icon)
- Click to expand - you'll see 7 menu items

---

## 📋 All Admin Routes

| Module | Route | Description |
|--------|-------|-------------|
| **Admin Dashboard** | `/admin` | Landing page with stats and quick access |
| **List of Values** | `/admin/lov` | Manage dropdown values (Form → Designator → Values) |
| **Approval Workflow** | `/admin/approvers` | Manage approvers (Workflow → Branch → Approvers) |
| **Projects** | `/admin/projects` | CRUD for projects and budget codes |
| **Budget** | `/admin/budget` | Budget tracking with summary cards |
| **Employee Registration** | `/admin/employee` | Register employees with enhanced fields |
| **User Creation** | `/admin/user` | Create user accounts with password validation |

---

## 🎯 Quick Test Checklist

### ✅ List of Values
1. Select Form → Select Designator → View LOV Values
2. Click "Add New" → Fill form → Submit
3. Verify entry appears in table ✓

### ✅ Approval Workflow
1. Select Workflow → Select Branch → View Approvers
2. Click "Add New" → Select Role → Set Level/Sequence → Submit
3. Verify approver code auto-generated (e.g., W2-B1-001) ✓

### ✅ Projects
1. Click "Add New Project"
2. Fill: Name, Budget Code, Manager, Dates, Status
3. Submit → Verify in table ✓

### ✅ Budget
1. Check summary cards at top (Allocated/Spent/Remaining)
2. Click "Add New Budget"
3. Enter Allocated & Spent → Verify Remaining auto-calculates ✓

### ✅ Employee Registration
1. Fill Personal Info (First Name, Last Name, DOB, etc.)
2. Fill Employment Info (Job Title, Department, Employment Type)
3. Fill Address (Street, City, State, ZIP)
4. Submit → Success message ✓

### ✅ User Creation
1. Enter Username, Email, Password (must meet requirements)
2. Confirm Password (must match)
3. Select User Role
4. Submit → Check "Recently Created Users" table ✓

---

## 🔑 Important Backend APIs

Make sure these are working:

### LOV Module:
- `GET /api/admin/lov/forms`
- `GET /api/admin/lov/forms/{formId}/designators`
- `GET /api/admin/lov/designators/{designatorId}/values`
- `POST /api/admin/lov/values`

### Approvers Module:
- `GET /api/admin/approvers/workflows/{workflowId}/branches`
- `GET /api/admin/approvers/{workflowId}/{branchId}`
- `POST /api/admin/approvers`

### Budget Module:
- `GET /api/admin/budget/summary`
- `GET /api/admin/budget`
- `POST /api/admin/budget`

### Projects Module:
- `GET /api/project-master`
- `POST /api/project-master`
- `PUT /api/project-master/{projectCode}`

### Employee Module:
- `GET /api/employee-department-master/departments`
- `GET /api/employee-department-master/designations`
- `POST /api/employee-department-master`

### User Module:
- `GET /api/employee-department-master/roles`
- `POST /api/userMaster`

---

## ⚡ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Admin Panel menu not showing | Login with "Admin" role user |
| API calls failing (404) | Check backend is running on port 8081 |
| Dropdowns empty | Check API response has `responseData` or `data` field |
| Form validation not working | Check all required fields are filled |
| Can't see new entries | Click "Refresh" button in the page |

---

## 📱 Pro Tips

1. **Search Everything** - Every table has a search bar at the top
2. **Refresh Data** - Use the refresh button to reload latest data
3. **Check Validation** - Forms show real-time validation errors
4. **Auto-Calculate** - Budget remaining amount calculates automatically
5. **Cascading Dropdowns** - Select parent dropdown first (Form → Designator, Workflow → Branch)
6. **Recently Created Users** - Shows last 10 users on User Creation page
7. **Status Badges** - Color-coded (Green=Active, Red=Inactive/Closed, Blue=Completed)

---

## 🎨 What You'll See

### Admin Dashboard
- 6 statistic cards (Employees, Projects, Budget, Users, Workflows, LOVs)
- 6 colorful module cards with icons
- Click any card to navigate to that module

### All Tables Include:
- Search bar
- Pagination (10/20/50 items per page)
- Sort columns (click column header)
- Edit and Delete buttons
- Status badges
- "Add New" button (top right)
- "Refresh" button

### All Forms Have:
- Clear field labels
- Required field indicators (*)
- Real-time validation
- Cancel and Submit buttons
- Success/Error messages

---

## 🔥 Ready to Go!

Your Admin Panel is **fully functional** and ready to use. Just:
1. Start the app
2. Login as Admin
3. Navigate to Admin Panel in sidebar
4. Start managing your data!

**Need help?** Check [ADMIN_PANEL_IMPLEMENTATION.md](ADMIN_PANEL_IMPLEMENTATION.md) for detailed documentation.

---

**Quick Access:** `/admin` → Your Admin Dashboard 🎉
