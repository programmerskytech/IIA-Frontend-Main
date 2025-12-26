# Workflow Branch Setup Guide

## ✅ Problem Fixed!

The Approval Workflow page now has **Branch Management** functionality! You can create, edit, and delete workflow branches directly from the UI.

---

## 🎯 How to Create Branches from the UI

### Step 1: Navigate to Approval Workflow
1. Login as **Admin**
2. Go to **Admin Panel** → **Approval Workflow**
3. URL: `http://localhost:3000/admin/approvers`

### Step 2: Select a Workflow
1. In the **"Workflow"** dropdown, select **"Indent Workflow"** (or any workflow)
2. You'll see a message: *"No branches found for this workflow. Click "Manage Branches" to create one."*

### Step 3: Click "Manage Branches" Button
- The **"Manage Branches"** button is located next to the Branch dropdown
- It has a settings icon ⚙️
- Click it to open the Branch Management modal

### Step 4: Click "Add Branch" or "Create First Branch"
- You'll see an **"Add New Branch"** form modal
- Fill in the following fields:

---

## 📋 Branch Form Fields Explained

### 1. **Branch Code** (Required)
- **Example:** `INDENT-DEFAULT`, `INDENT-HIGH-VALUE`, `INDENT-CATEGORY-COMPUTER`
- **Tip:** Use uppercase with hyphens
- **Cannot be changed after creation**

### 2. **Branch Name** (Required)
- **Example:** `Default Branch`, `High Value Branch`, `Computer Category Branch`
- **Tip:** Make it descriptive

### 3. **Description** (Optional)
- **Example:** `Default approval path for all indents`, `For indents above 100000`
- **Tip:** Explain when this branch is used

### 4. **Condition Type** (Optional)
Choose from:
- **DEFAULT** - Used when no other branch matches (recommended for first branch)
- **AMOUNT_BASED** - Based on monetary amount (e.g., > 100000)
- **CATEGORY_BASED** - Based on item category (e.g., Computer items)
- **DEPARTMENT_BASED** - Based on department
- **CUSTOM** - Custom condition logic

### 5. **Condition Config (JSON)** (Optional)
- **Example for AMOUNT_BASED:** `{"minAmount": 100000}`
- **Example for CATEGORY_BASED:** `{"category": "Computer"}`
- **Leave empty for DEFAULT branches**

### 6. **Display Order** (Required)
- **Example:** `1`, `2`, `3`
- **Tip:** Lower numbers appear first in the dropdown

### 7. **Status** (Required)
- **Active** - Branch is in use
- **Inactive** - Branch is disabled

---

## 🚀 Quick Start: Create Your First Branch for Indent Workflow

### Example 1: Default Branch (Recommended First)

1. Click "Manage Branches"
2. Click "Add Branch"
3. Fill in:
   - **Branch Code:** `INDENT-DEFAULT`
   - **Branch Name:** `Default Branch`
   - **Description:** `Default approval path for all indents`
   - **Condition Type:** `DEFAULT`
   - **Condition Config:** *(leave empty)*
   - **Display Order:** `1`
   - **Status:** `Active`
4. Click **"Add Branch"**
5. ✅ Success! Your first branch is created

### Example 2: High Value Branch

1. Click "Add Branch" again
2. Fill in:
   - **Branch Code:** `INDENT-HIGH-VALUE`
   - **Branch Name:** `High Value Branch`
   - **Description:** `For indents above 100000`
   - **Condition Type:** `AMOUNT_BASED`
   - **Condition Config:** `{"minAmount": 100000}`
   - **Display Order:** `2`
   - **Status:** `Active`
3. Click **"Add Branch"**

### Example 3: Computer Category Branch

1. Click "Add Branch" again
2. Fill in:
   - **Branch Code:** `INDENT-CATEGORY-COMPUTER`
   - **Branch Name:** `Computer Category Branch`
   - **Description:** `For computer-related items`
   - **Condition Type:** `CATEGORY_BASED`
   - **Condition Config:** `{"category": "Computer"}`
   - **Display Order:** `3`
   - **Status:** `Active`
3. Click **"Add Branch"**

---

## 🎯 Now You Can Add Approvers!

After creating branches:

### Step 1: Go Back to Approvers View
- Click **"Back to Approvers"** button (if you're in Branch Management view)
- Or select a branch from the **"Branch"** dropdown

### Step 2: Select the Branch
- Choose a branch from the dropdown (e.g., "Default Branch")

### Step 3: Add Approvers
- Click **"Add New"** button
- Fill in:
  - **Approver Name (Role):** Select from dropdown (e.g., Finance Manager)
  - **Level:** `1`, `2`, `3`, etc.
  - **Sequence:** `1`, `2`, `3`, etc. (within same level)
  - **Status:** `Active`
- Click **"Add Approver"**

The approver code will be auto-generated (e.g., `W1-B1-001`)

---

## 🔄 Managing Existing Branches

### Edit a Branch
1. Click "Manage Branches"
2. Click **"Edit"** button next to the branch
3. Update fields
4. Click **"Update Branch"**

### Delete a Branch
1. Click "Manage Branches"
2. Click **"Delete"** button next to the branch
3. Confirm deletion
4. ⚠️ **Warning:** This will also delete all approvers in that branch!

### View All Branches
- Click "Manage Branches" to see the branches table
- Columns shown: Branch Code, Branch Name, Description, Condition Type, Display Order, Status, Actions

---

## 📊 Branch Management UI Features

✅ **Create Branches** - Add new branches with conditions
✅ **Edit Branches** - Modify existing branches
✅ **Delete Branches** - Remove branches (with confirmation)
✅ **View All Branches** - See all branches in a table
✅ **Sort by Display Order** - Click column header to sort
✅ **Status Indicators** - Green for Active, Red for Inactive
✅ **Helpful Tips** - Form includes guidance tooltips
✅ **Validation** - Required fields are enforced
✅ **Console Logging** - See API responses in browser console

---

## 🔍 Troubleshooting

### Branch not appearing in dropdown after creation
**Solution:**
- Check browser console (F12 → Console)
- Look for "Create response" log
- Click "Refresh" button next to Branch dropdown
- Or reload the page

### Backend API Error
**Check these endpoints are working:**
- `POST /api/admin/approvers/workflows/{workflowId}/branches` - Create branch
- `GET /api/admin/approvers/workflows/{workflowId}/branches` - List branches
- `PUT /api/admin/approvers/workflows/{workflowId}/branches/{branchId}` - Update branch
- `DELETE /api/admin/approvers/workflows/{workflowId}/branches/{branchId}` - Delete branch

### No "Manage Branches" button visible
**Solution:**
- Make sure you selected a workflow first
- The button is next to the Branch dropdown
- It has a settings icon ⚙️

---

## 💡 Best Practices

1. **Always create a DEFAULT branch first**
   - This handles all cases by default
   - Other branches are for special cases

2. **Use clear naming conventions**
   - Branch Code: WORKFLOW-TYPE (e.g., INDENT-DEFAULT, PO-HIGH-VALUE)
   - Branch Name: Descriptive name (e.g., Default Branch, High Value Branch)

3. **Set Display Order logically**
   - DEFAULT branch: Order 1
   - Special branches: Order 2, 3, 4, etc.

4. **Document conditions in Description**
   - Explain when the branch is used
   - Makes it easier to manage later

5. **Test with console logs**
   - Open browser console (F12)
   - Check "Branches API Response" log
   - Verify data is returned correctly

---

## 🎉 You're All Set!

Now you can:
1. ✅ Create workflow branches from the UI
2. ✅ Edit existing branches
3. ✅ Delete branches
4. ✅ View all branches in a table
5. ✅ Add approvers to branches

No more empty branch dropdowns! 🚀

---

## 📝 Summary of UI Changes

**What Was Added:**
1. **"Manage Branches" button** - Next to Branch dropdown
2. **Branch Management Table** - Shows all branches for selected workflow
3. **"Add Branch" modal** - Form to create new branches
4. **"Edit Branch" functionality** - Modify existing branches
5. **"Delete Branch" functionality** - Remove branches with confirmation
6. **Helpful messages** - When no branches exist
7. **"Create First Branch" button** - Quick access when starting fresh
8. **Console logging** - Debug API responses
9. **Flexible response handling** - Works with different backend formats

**Where to Find It:**
- Path: `/admin/approvers`
- Button: Next to "Branch" dropdown (has ⚙️ icon)
- Menu: Admin Panel → Approval Workflow

---

**Updated:** December 18, 2025
**Status:** ✅ Complete and Working!
