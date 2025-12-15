# Testing & Verification Guide - Indent UI Changes

## How to Test and Verify All UI Changes

---

## 🚀 Quick Start - Start the Application

### 1. Start Backend Server
```bash
# Make sure backend is running with the new changes
# Backend should be running on default port (usually 8080)
```

### 2. Start Frontend Development Server
```bash
cd e:\Work 2.0\IIA\Frontend-test
npm start
# Or
yarn start
```

### 3. Open Browser
```
http://localhost:3000
```

---

## ✅ Test Checklist Overview

- [ ] Test 1: New Components Render
- [ ] Test 2: Indent Creation Form - Status Display
- [ ] Test 3: Indent Creation Form - Edit Restrictions
- [ ] Test 4: Indent Creation Form - Visual Alerts
- [ ] Test 5: Indent Status Report - New Columns
- [ ] Test 6: Indent Report - Status Display
- [ ] Test 7: Indent List Report - Status Badges
- [ ] Test 8: API Integration - Backend Response
- [ ] Test 9: Error Handling - Edit Restrictions
- [ ] Test 10: Workflow Testing - Complete Flow

---

## 📋 Detailed Testing Steps

### Test 1: Verify New Components Render

#### 1.1 Test IndentStatusBadge Component

**Create a test page (optional):**
```jsx
// Create: src/pages/TestComponents.jsx
import React from 'react';
import IndentStatusBadge from '../components/IndentStatusBadge';

const TestComponents = () => {
  const testStatuses = [
    { currentStatus: 'DRAFT', currentStage: 'INDENT_CREATION', approvalLevel: 0 },
    { currentStatus: 'IN_APPROVAL', currentStage: 'INDENT_APPROVAL_LEVEL_1', approvalLevel: 1 },
    { currentStatus: 'APPROVED', currentStage: 'INDENT_APPROVED', approvalLevel: 0 },
    { currentStatus: 'CHANGE_REQUESTED', currentStage: 'INDENT_REVISION', approvalLevel: 0 },
    { currentStatus: 'TENDER_CREATED', currentStage: 'TENDER_GENERATION', approvalLevel: 0 },
    { currentStatus: 'CANCELLED', currentStage: 'CANCELLED', approvalLevel: 0 }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Status Badge Tests</h2>
      {testStatuses.map((indent, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <IndentStatusBadge indent={indent} showStage={true} showApprovalLevel={true} />
        </div>
      ))}
    </div>
  );
};

export default TestComponents;
```

**Expected Result:**
- ✅ 6 different status badges displayed
- ✅ Each badge has correct color
- ✅ Each badge has appropriate icon
- ✅ Hover shows tooltip with description

---

### Test 2: Indent Creation Form - Status Display

**Steps:**
1. Navigate to **Indent Creation** page
   - Menu: `Dashboard → Indent Creation`
   - Or direct URL: `http://localhost:3000/indent-creation`

2. **Search for an existing indent:**
   - Enter indent ID in search box (e.g., "IND1001")
   - Click Search button
   - Select indent from dropdown

3. **Check Status Section:**
   - Look for "Status" section with 4 fields
   - Verify these fields are visible:
     - ✅ **Current Status** (e.g., "APPROVED")
     - ✅ **Current Stage** (e.g., "INDENT_APPROVED")
     - ✅ **Version** (e.g., "1")
     - ✅ **Approval Level** (e.g., "0")

**Expected Result:**
```
┌─────────────────────────────────────┐
│ Status                              │
├─────────────────────────────────────┤
│ Current Status:  [APPROVED]         │
│ Current Stage:   INDENT_APPROVED    │
│ Version:         1                  │
│ Approval Level:  0                  │
└─────────────────────────────────────┘
```

**Screenshot Location:**
Take screenshot and save as: `screenshots/test2-status-section.png`

---

### Test 3: Indent Creation Form - Edit Restrictions

**Setup:**
You need indents in different states. Use these test scenarios:

#### Scenario A: Draft Indent (Should be editable)
1. Create a new indent (don't submit)
2. Try to edit any field
3. **Expected:** ✅ Can edit all fields

#### Scenario B: In-Approval Indent (Should NOT be editable)
1. Search for an indent that is in approval workflow
   - Status: "IN_APPROVAL"
   - isEditable: false
2. Try to edit and submit
3. **Expected:** ❌ Error message: "Indent is not editable. It can only be edited when sent back by an approver for revision."

#### Scenario C: Locked Indent (Should NOT be editable)
1. Search for an indent with tender created
   - Status: "TENDER_CREATED"
   - isLockedForTender: true
2. Try to edit and submit
3. **Expected:** ❌ Error message: "Indent is locked as tender has been created"

#### Scenario D: Change Requested Indent (Should be editable)
1. Search for an indent sent back for revision
   - Status: "CHANGE_REQUESTED"
   - isEditable: true
2. Try to edit any field
3. **Expected:** ✅ Can edit all fields
4. After save, check version increments

**Test Steps:**
```javascript
// Frontend validation triggers before API call
1. Load indent
2. Modify a field (e.g., quantity)
3. Click "Submit" or "Update" button
4. Observe error message or success
```

---

### Test 4: Indent Creation Form - Visual Alerts

**Test Different Alert Scenarios:**

#### Alert 1: Locked Indent (Yellow Warning)
1. Search indent with tender created
2. **Expected Alert:**
```
┌─────────────────────────────────────────────┐
│ ⚠️  Indent Locked                           │
│                                             │
│ Tender T1001 has been created for this     │
│ indent                                      │
└─────────────────────────────────────────────┘
```
- ✅ Yellow/Orange background
- ✅ Warning icon
- ✅ Specific reason shown

#### Alert 2: Not Editable (Blue Info)
1. Search indent in approval workflow
2. **Expected Alert:**
```
┌─────────────────────────────────────────────┐
│ ℹ️  Indent Not Editable                     │
│                                             │
│ This indent is currently in approval       │
│ workflow. It can only be edited when sent  │
│ back for revision.                         │
└─────────────────────────────────────────────┘
```
- ✅ Blue background
- ✅ Info icon
- ✅ Descriptive message

#### Alert 3: Version Indicator (Blue Info)
1. Search indent that has been revised (version > 1)
2. **Expected Alert:**
```
┌─────────────────────────────────────────────┐
│ ℹ️  Version 3                               │
│                                             │
│ This indent has been revised 2 time(s)     │
└─────────────────────────────────────────────┘
```
- ✅ Blue background
- ✅ Info icon
- ✅ Shows revision count

**Screenshot Location:**
- `screenshots/test4-alert-locked.png`
- `screenshots/test4-alert-not-editable.png`
- `screenshots/test4-alert-version.png`

---

### Test 5: Indent Status Report - New Columns

**Steps:**
1. Navigate to **Reports → Indent Status**
   - URL: `http://localhost:3000/reports/indent-status`

2. Search for indents (enter any indent ID or filter)

3. **Verify New Columns Exist:**
   - ✅ Current Status (with colored badge)
   - ✅ Current Stage (formatted text)
   - ✅ Version (number)
   - ✅ Approval Level (number)
   - ✅ Editable (Yes/No)
   - ✅ Locked (Yes/No)

4. **Check Status Badge Rendering:**
   - Different rows should show different colored badges
   - Hover over badge to see tooltip

5. **Test Column Filtering:**
   - Click filter icon on "Current Status" column
   - Enter "APPROVED"
   - Verify only approved indents show

**Expected Table Structure:**
```
┌──────────┬────────────┬──────────────┬────────────┬─────────┬────────────┬──────────┬────────┐
│ Indent ID│ Created By │ Current      │ Current    │ Version │ Approval   │ Editable │ Locked │
│          │            │ Status       │ Stage      │         │ Level      │          │        │
├──────────┼────────────┼──────────────┼────────────┼─────────┼────────────┼──────────┼────────┤
│ IND1001  │ John Doe   │ [APPROVED]   │ INDENT     │    1    │     0      │   No     │   No   │
│          │            │   (green)    │ APPROVED   │         │            │          │        │
├──────────┼────────────┼──────────────┼────────────┼─────────┼────────────┼──────────┼────────┤
│ IND1002  │ Jane Smith │ [IN_APPROVAL]│ INDENT     │    2    │     1      │   No     │   No   │
│          │            │   (blue)     │ APPROVAL_1 │         │            │          │        │
├──────────┼────────────┼──────────────┼────────────┼─────────┼────────────┼──────────┼────────┤
│ IND1003  │ Bob Wilson │ [TENDER_     │ TENDER     │    1    │     0      │   No     │   Yes  │
│          │            │  CREATED]    │ GENERATION │         │            │          │        │
│          │            │   (purple)   │            │         │            │          │        │
└──────────┴────────────┴──────────────┴────────────┴─────────┴────────────┴──────────┴────────┘
```

**Screenshot Location:**
`screenshots/test5-indent-status-report.png`

---

### Test 6: Indent Report - Status Display

**Steps:**
1. Navigate to **Reports → Indent Report**
   - URL: `http://localhost:3000/reports/indent-report`

2. Select date range and generate report

3. **Verify Columns:**
   - ✅ "Current Stage of Indent" column shows formatted stage names
   - ✅ "Current Status" column shows status badge
   - ✅ "Version" column shows version number

4. **Check Stage Formatting:**
   - Should show: "INDENT APPROVAL LEVEL 1" (not "INDENT_APPROVAL_LEVEL_1")
   - Underscores replaced with spaces

**Expected:**
- Current Stage column: Readable text with spaces
- Current Status column: Colored badges
- Version column: Numeric value

**Screenshot Location:**
`screenshots/test6-indent-report.png`

---

### Test 7: Indent List Report - Status Badges & Tags

**Steps:**
1. Navigate to **Reports → Indent List**
   - URL: `http://localhost:3000/reports/indent-list`

2. Select date range and view report

3. **Verify Enhanced Columns:**

   **Current Status:**
   - ✅ Shows colored badge (same as other reports)

   **Version:**
   - ✅ Shows as blue tag: `v1`, `v2`, `v3`

   **Editable:**
   - ✅ Green tag "Yes" if editable
   - ✅ Red tag "No" if not editable

   **Locked:**
   - ✅ Orange tag "Yes" if locked
   - ✅ Gray tag "No" if not locked

**Expected Visual:**
```
┌──────────┬──────────────┬─────────┬──────────┬────────┐
│ Indent ID│ Current      │ Version │ Editable │ Locked │
│          │ Status       │         │          │        │
├──────────┼──────────────┼─────────┼──────────┼────────┤
│ IND1001  │ [APPROVED]   │  [v1]   │  [Yes]   │  [No]  │
│          │  (green)     │ (blue)  │ (green)  │ (gray) │
├──────────┼──────────────┼─────────┼──────────┼────────┤
│ IND1002  │ [IN_APPROVAL]│  [v2]   │  [No]    │  [No]  │
│          │  (blue)      │ (blue)  │  (red)   │ (gray) │
├──────────┼──────────────┼─────────┼──────────┼────────┤
│ IND1003  │ [TENDER_     │  [v1]   │  [No]    │  [Yes] │
│          │  CREATED]    │ (blue)  │  (red)   │(orange)│
│          │  (purple)    │         │          │        │
└──────────┴──────────────┴─────────┴──────────┴────────┘
```

**Screenshot Location:**
`screenshots/test7-indent-list-report.png`

---

### Test 8: API Integration - Verify Backend Response

**Use Browser DevTools to check API responses:**

#### Steps:
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Navigate to Indent Creation page
4. Search for an indent
5. Look for API call to `/api/indents/indentData/{indentId}`
6. Check the **Response** tab

#### Expected Response Format:
```json
{
  "responseData": {
    "indentId": "IND1001",
    "indentorName": "John Doe",

    // NEW FIELDS - These must be present
    "isEditable": false,
    "isLockedForTender": false,
    "lockedReason": null,
    "version": 1,
    "parentIndentId": null,
    "currentStatus": "IN_APPROVAL",
    "currentStage": "INDENT_APPROVAL_LEVEL_1",
    "approvalLevel": 1,

    // ... other indent fields
  },
  "responseStatus": {
    "message": "Success",
    "statusCode": 200
  }
}
```

#### Verification:
- ✅ All 8 new fields are present
- ✅ Field values are correct (boolean, string, number types)
- ✅ `currentStatus` matches expected status
- ✅ `currentStage` matches workflow stage

**Screenshot Location:**
`screenshots/test8-api-response.png`

---

### Test 9: Error Handling - Edit Restrictions

**Test API Error Messages:**

#### Test 9.1: Locked Indent Error
1. Use API tool (Postman/curl) or browser to send PUT request to locked indent:
```bash
curl -X PUT http://localhost:8080/api/indents/IND1003 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 10}'
```

2. **Expected Response:**
```json
{
  "errorCode": 400,
  "errorType": "VALIDATION",
  "message": "Indent is locked for editing as tender has been created. Reason: Tender T1001 has been created for this indent"
}
```

3. **Expected UI Behavior:**
   - Error message appears: "Cannot edit: Tender already created for this indent"
   - Form does not submit
   - User remains on edit page

#### Test 9.2: Not Editable Error
1. Try to edit indent in approval workflow
2. **Expected Response:**
```json
{
  "errorCode": 400,
  "errorType": "VALIDATION",
  "message": "Indent is not editable. It can only be edited when sent back by an approver for revision."
}
```

3. **Expected UI Behavior:**
   - Error message appears: "Cannot edit: Indent is in approval workflow"
   - Form does not submit

**Screenshot Location:**
- `screenshots/test9-error-locked.png`
- `screenshots/test9-error-not-editable.png`

---

### Test 10: Complete Workflow Testing

**This is the most important end-to-end test:**

#### Workflow Scenario 1: Normal Approval Flow

**Step 1: Create New Indent**
```
1. Login as Indent Creator
2. Navigate to Indent Creation
3. Fill all required fields
4. Click Submit
5. Verify:
   - ✅ version = 1
   - ✅ currentStatus = "DRAFT"
   - ✅ currentStage = "INDENT_CREATION"
   - ✅ isEditable = true
   - ✅ isLockedForTender = false
```

**Step 2: Submit for Approval**
```
1. Click "Send for Approval" button
2. After submission, check status:
   - ✅ currentStatus = "IN_APPROVAL"
   - ✅ currentStage = "INDENT_APPROVAL_LEVEL_1"
   - ✅ isEditable = false
   - ✅ approvalLevel = 1
3. Try to edit:
   - ❌ Should show "Not Editable" alert
   - ❌ Submit should show error
```

**Step 3: Approve (as Approver)**
```
1. Login as Level 1 Approver
2. Navigate to Queue/Approval page
3. Approve the indent
4. Check indent status:
   - ✅ currentStatus = "APPROVED"
   - ✅ currentStage = "INDENT_APPROVED"
   - ✅ isEditable = false
```

**Step 4: Create Tender (as Procurement)**
```
1. Login as Procurement user
2. Create tender from approved indent
3. Check indent status:
   - ✅ currentStatus = "TENDER_CREATED"
   - ✅ currentStage = "TENDER_GENERATION"
   - ✅ isLockedForTender = true
   - ✅ lockedReason = "Tender T1001 has been created..."
4. Try to edit:
   - ❌ Should show "Indent Locked" alert
   - ❌ Submit should show error
```

#### Workflow Scenario 2: Change Request Flow

**Step 1: Submit Indent**
```
1. Create and submit indent (same as Scenario 1)
2. Verify status = "IN_APPROVAL"
```

**Step 2: Request Changes (as Approver)**
```
1. Login as Approver
2. Navigate to approval queue
3. Select "Send Back" or "Request Changes"
4. Add remarks
5. Submit action
```

**Step 3: Verify Indent is Editable Again**
```
1. Login as original Indent Creator
2. Search for the indent
3. Check status:
   - ✅ currentStatus = "CHANGE_REQUESTED"
   - ✅ currentStage = "INDENT_REVISION"
   - ✅ isEditable = true
   - ✅ version = still 1 (doesn't increment until edit saved)
4. Verify NO alerts shown (indent is editable)
```

**Step 4: Edit and Resubmit**
```
1. Make changes to indent
2. Click Submit/Update
3. Check status after save:
   - ✅ version = 2 (incremented!)
   - ✅ currentStatus = "IN_APPROVAL" (back in workflow)
   - ✅ currentStage = "INDENT_APPROVAL_LEVEL_1"
   - ✅ isEditable = false (not editable again)
```

**Step 5: Verify Version History**
```
1. Check all reports show version = 2
2. Version alert shows: "This indent has been revised 1 time(s)"
3. Version tag in reports shows: [v2]
```

---

## 🎨 Visual Verification Checklist

### Color Verification

Open any report and verify these colors:

| Status | Expected Color | Hex Code |
|--------|---------------|----------|
| DRAFT | Gray | #6B7280 |
| IN_APPROVAL | Blue | #3B82F6 |
| APPROVED | Green | #10B981 |
| CHANGE_REQUESTED | Orange | #F59E0B |
| TENDER_CREATED | Purple | #8B5CF6 |
| CANCELLED | Red | #EF4444 |

**How to check:**
1. Inspect element in browser (F12)
2. Look at badge background color
3. Compare with expected hex code

---

## 🔍 Console Error Check

**Important:** Open browser console and check for errors

### Steps:
1. Press F12 to open DevTools
2. Go to **Console** tab
3. Perform all test scenarios above
4. **Verify:**
   - ✅ No red error messages
   - ✅ No "undefined" warnings for new fields
   - ✅ No component rendering errors

**Common errors to watch for:**
- ❌ "Cannot read property 'currentStatus' of undefined"
- ❌ "IndentStatusBadge is not defined"
- ❌ "Failed to render component"

If you see any of these, the component may not be imported correctly.

---

## 📸 Screenshot Checklist

Take screenshots of these scenarios and save in `screenshots/` folder:

- [ ] `test2-status-section.png` - Status section with 4 fields
- [ ] `test4-alert-locked.png` - Locked indent alert
- [ ] `test4-alert-not-editable.png` - Not editable alert
- [ ] `test4-alert-version.png` - Version indicator alert
- [ ] `test5-indent-status-report.png` - Status report with new columns
- [ ] `test6-indent-report.png` - Indent report with status badges
- [ ] `test7-indent-list-report.png` - Indent list with tags
- [ ] `test8-api-response.png` - DevTools showing API response
- [ ] `test9-error-locked.png` - Error message for locked indent
- [ ] `test9-error-not-editable.png` - Error message for not editable
- [ ] `test10-workflow-complete.png` - Complete workflow states

---

## 🐛 Troubleshooting

### Issue 1: Status badges not showing
**Possible causes:**
- Component not imported correctly
- Backend not returning new fields
- API response format incorrect

**Solution:**
1. Check browser console for errors
2. Verify API response includes new fields
3. Check import statement in report files

### Issue 2: Alerts not appearing on indent form
**Possible causes:**
- Indent ID not loaded
- New fields not in formData state
- Conditional rendering not working

**Solution:**
1. Check if `formData.indentId` exists
2. Console log `formData` to see all fields
3. Check `formData.isLockedForTender` value

### Issue 3: Edit still allowed when it shouldn't be
**Possible causes:**
- Frontend validation not working
- Backend not sending correct flags
- Form submission bypassing validation

**Solution:**
1. Check `onFinish` function has validation code
2. Verify API response has correct `isEditable` value
3. Test backend API directly with Postman

### Issue 4: Version not incrementing
**Possible causes:**
- Backend not incrementing version
- Database migration not run
- Cache issue

**Solution:**
1. Check backend code has version increment logic
2. Run database migration script
3. Clear browser cache and refresh

---

## ✅ Final Verification Checklist

### Component Files
- [ ] `IndentStatusBadge.jsx` exists in `src/components/`
- [ ] `WorkflowProgressTracker.jsx` exists in `src/components/`
- [ ] No console errors when components render
- [ ] All 6 status types display correctly

### Indent Creation Form
- [ ] Status section shows 4 fields when indent loaded
- [ ] Locked alert shows for locked indents
- [ ] Not editable alert shows for in-approval indents
- [ ] Version alert shows for revised indents (v > 1)
- [ ] Frontend validation prevents locked/non-editable edits
- [ ] Error messages display correctly

### Reports
- [ ] Indent Status report shows new columns
- [ ] Indent Report shows current status and stage
- [ ] Indent List shows status badges and tags
- [ ] All filters work on new columns
- [ ] Colors match specification

### API Integration
- [ ] Backend returns all 8 new fields
- [ ] Field types are correct (boolean, string, number)
- [ ] Error responses handled correctly
- [ ] 400 errors show user-friendly messages

### Workflow Testing
- [ ] Can create new indent (DRAFT)
- [ ] Cannot edit during approval (IN_APPROVAL)
- [ ] Can edit when sent back (CHANGE_REQUESTED)
- [ ] Version increments on edit
- [ ] Cannot edit after tender created (locked)

---

## 📊 Test Report Template

Use this template to document your testing:

```markdown
# UI Changes Test Report
**Date:** [Current Date]
**Tester:** [Your Name]
**Build Version:** [Version Number]

## Summary
- Total Tests: 10
- Passed: __
- Failed: __
- Blocked: __

## Test Results

### Test 1: New Components
- Status: [ ] Pass [ ] Fail
- Notes:

### Test 2: Status Display
- Status: [ ] Pass [ ] Fail
- Notes:

### Test 3: Edit Restrictions
- Status: [ ] Pass [ ] Fail
- Notes:

[... continue for all 10 tests ...]

## Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Steps to reproduce:
   - Screenshot:

## Overall Assessment
[ ] All tests passed - Ready for production
[ ] Minor issues - Needs fixes
[ ] Major issues - Requires rework
```

---

## 🎯 Quick Smoke Test (5 minutes)

If you're short on time, run this quick smoke test:

1. **Create new indent** → Check version = 1 ✅
2. **Search existing indent** → Check status section shows 4 fields ✅
3. **Open Indent Status report** → Check new columns exist ✅
4. **Check browser console** → No errors ✅
5. **Try to edit approved indent** → Should show error ✅

If all 5 pass, the implementation is working correctly!

---

## 📞 Support

If you encounter issues during testing:

1. Check the [UI_CHANGES_SUMMARY.md](./UI_CHANGES_SUMMARY.md) for detailed implementation info
2. Check the [QUICK_REFERENCE_GUIDE.md](./QUICK_REFERENCE_GUIDE.md) for code examples
3. Check browser console for JavaScript errors
4. Check Network tab for API response issues
5. Verify backend migration script was run

---

**Good luck with testing! 🚀**
