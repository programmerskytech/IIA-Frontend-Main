# Visual Testing Guide - What to Look For

## 🎯 Quick Visual Checklist

This guide shows you **exactly what you should see** on screen when testing the UI changes.

---

## 1️⃣ Indent Creation Form - NEW Status Section

### Location: Dashboard → Indent Creation → Search an existing indent

### What You Should See:

```
┌────────────────────────────────────────────────────────┐
│  Search Indent                                         │
│  ┌──────────────┐  ┌────────────┐                     │
│  │ Search Value │  │ [ Search ] │                     │
│  └──────────────┘  └────────────┘                     │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Status                                     ← NEW!     │
│  ┌──────────────┬──────────────┬─────────┬──────────┐ │
│  │ Current      │ Current      │ Version │ Approval │ │
│  │ Status       │ Stage        │         │ Level    │ │
│  ├──────────────┼──────────────┼─────────┼──────────┤ │
│  │ APPROVED     │ INDENT_      │    1    │    0     │ │
│  │              │ APPROVED     │         │          │ │
│  └──────────────┴──────────────┴─────────┴──────────┘ │
└────────────────────────────────────────────────────────┘
```

**Look for:**
- ✅ 4 fields displayed horizontally
- ✅ All fields are disabled (grey background)
- ✅ Values populated from backend
- ✅ "colCnt: 4" makes them appear in one row

---

## 2️⃣ Indent Creation Form - ALERTS

### Scenario A: Locked Indent (Tender Created)

```
┌──────────────────────────────────────────────────────────┐
│  Indent Creation                                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ⚠️  Indent Locked                          ← YELLOW!    │
│  Tender T1001 has been created for this indent          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [Indent Type Dropdown]                                  │
└──────────────────────────────────────────────────────────┘
```

**Look for:**
- ✅ Yellow/orange warning alert box
- ✅ Warning icon (⚠️)
- ✅ Specific tender ID mentioned
- ✅ Alert appears BEFORE indent type selection

### Scenario B: Not Editable (In Approval)

```
┌──────────────────────────────────────────────────────────┐
│  Indent Creation                                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ℹ️  Indent Not Editable                   ← BLUE!       │
│  This indent is currently in approval workflow.         │
│  It can only be edited when sent back for revision.    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [Indent Type Dropdown]                                  │
└──────────────────────────────────────────────────────────┘
```

**Look for:**
- ✅ Blue info alert box
- ✅ Info icon (ℹ️)
- ✅ Explanation message
- ✅ Alert appears BEFORE indent type selection

### Scenario C: Version Indicator (Revised Indent)

```
┌──────────────────────────────────────────────────────────┐
│  Indent Creation                                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ℹ️  Version 3                             ← BLUE!       │
│  This indent has been revised 2 time(s)                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [Indent Type Dropdown]                                  │
└──────────────────────────────────────────────────────────┘
```

**Look for:**
- ✅ Blue info alert box
- ✅ Info icon (ℹ️)
- ✅ Version number shown
- ✅ Revision count calculated (version - 1)

### Multiple Alerts Can Show Together:

```
┌──────────────────────────────────────────────────────────┐
│  Indent Creation                                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ⚠️  Indent Locked                                       │
│  Tender T1001 has been created for this indent          │
│                                                          │
│  ℹ️  Version 2                                           │
│  This indent has been revised 1 time(s)                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [Indent Type Dropdown]                                  │
└──────────────────────────────────────────────────────────┘
```

---

## 3️⃣ Indent Status Report - NEW COLUMNS

### Location: Reports → Indent Status

### What You Should See:

```
╔════════════╦════════════╦═══════════════╦═══════════════╦═════════╦═════════════╦══════════╦════════╗
║ Indent ID  ║ Created By ║ Current       ║ Current       ║ Version ║ Approval    ║ Editable ║ Locked ║
║            ║            ║ Status        ║ Stage         ║         ║ Level       ║          ║        ║
╠════════════╬════════════╬═══════════════╬═══════════════╬═════════╬═════════════╬══════════╬════════╣
║ IND1001    ║ John Doe   ║ ┌───────────┐ ║ INDENT        ║    1    ║      0      ║   No     ║   No   ║
║            ║            ║ │ APPROVED  │ ║ APPROVED      ║         ║             ║          ║        ║
║            ║            ║ └───────────┘ ║               ║         ║             ║          ║        ║
║            ║            ║   (GREEN)     ║               ║         ║             ║          ║        ║
╠════════════╬════════════╬═══════════════╬═══════════════╬═════════╬═════════════╬══════════╬════════╣
║ IND1002    ║ Jane Smith ║ ┌───────────┐ ║ INDENT        ║    2    ║      1      ║   No     ║   No   ║
║            ║            ║ │IN_APPROVAL│ ║ APPROVAL      ║         ║             ║          ║        ║
║            ║            ║ └───────────┘ ║ LEVEL 1       ║         ║             ║          ║        ║
║            ║            ║   (BLUE)      ║               ║         ║             ║          ║        ║
╠════════════╬════════════╬═══════════════╬═══════════════╬═════════╬═════════════╬══════════╬════════╣
║ IND1003    ║ Bob Wilson ║ ┌───────────┐ ║ TENDER        ║    1    ║      0      ║   No     ║   Yes  ║
║            ║            ║ │  TENDER_  │ ║ GENERATION    ║         ║             ║          ║        ║
║            ║            ║ │  CREATED  │ ║               ║         ║             ║          ║        ║
║            ║            ║ └───────────┘ ║               ║         ║             ║          ║        ║
║            ║            ║   (PURPLE)    ║               ║         ║             ║          ║        ║
╚════════════╩════════════╩═══════════════╩═══════════════╩═════════╩═════════════╩══════════╩════════╝
         ↑                        ↑               ↑             ↑           ↑            ↑        ↑
      OLD COLUMN              NEW BADGE      NEW COLUMN    NEW COLUMN   NEW COLUMN  NEW COLUMN  NEW
```

**Look for:**
- ✅ **Current Status** column with colored badges
- ✅ **Current Stage** column with formatted text (spaces, not underscores)
- ✅ **Version** column (number, centered)
- ✅ **Approval Level** column (number, centered)
- ✅ **Editable** column (Yes/No text)
- ✅ **Locked** column (Yes/No text)
- ✅ All new columns have filter icons
- ✅ Status badges have icons inside them

---

## 4️⃣ Indent List Report - TAGS

### Location: Reports → Indent List

### What You Should See:

```
╔════════════╦═══════════════╦═════════════╦════════════╦════════════╗
║ Indent ID  ║ Current       ║ Version     ║ Editable   ║ Locked     ║
║            ║ Status        ║             ║            ║            ║
╠════════════╬═══════════════╬═════════════╬════════════╬════════════╣
║ IND1001    ║ ┌───────────┐ ║  ┌──────┐  ║  ┌──────┐  ║  ┌──────┐  ║
║            ║ │ APPROVED  │ ║  │  v1  │  ║  │ Yes  │  ║  │  No  │  ║
║            ║ └───────────┘ ║  └──────┘  ║  └──────┘  ║  └──────┘  ║
║            ║   (GREEN)     ║  (BLUE)    ║  (GREEN)   ║  (GRAY)    ║
╠════════════╬═══════════════╬═════════════╬════════════╬════════════╣
║ IND1002    ║ ┌───────────┐ ║  ┌──────┐  ║  ┌──────┐  ║  ┌──────┐  ║
║            ║ │IN_APPROVAL│ ║  │  v2  │  ║  │  No  │  ║  │  No  │  ║
║            ║ └───────────┘ ║  └──────┘  ║  └──────┘  ║  └──────┘  ║
║            ║   (BLUE)      ║  (BLUE)    ║  (RED)     ║  (GRAY)    ║
╠════════════╬═══════════════╬═════════════╬════════════╬════════════╣
║ IND1003    ║ ┌───────────┐ ║  ┌──────┐  ║  ┌──────┐  ║  ┌──────┐  ║
║            ║ │  TENDER_  │ ║  │  v1  │  ║  │  No  │  ║  │ Yes  │  ║
║            ║ │  CREATED  │ ║  └──────┘  ║  └──────┘  ║  └──────┘  ║
║            ║ └───────────┘ ║  (BLUE)    ║  (RED)     ║ (ORANGE)   ║
║            ║   (PURPLE)    ║            ║            ║            ║
╚════════════╩═══════════════╩═════════════╩════════════╩════════════╝
```

**Look for:**
- ✅ **Version** shows as tag with "v" prefix (v1, v2, v3...)
- ✅ **Editable** shows as colored tag:
  - Green "Yes" = editable
  - Red "No" = not editable
- ✅ **Locked** shows as colored tag:
  - Orange "Yes" = locked
  - Gray "No" = not locked
- ✅ All tags have rounded corners
- ✅ All columns centered

---

## 5️⃣ Status Badge Colors Reference

### Visual Color Guide:

```
┌─────────────────────────────────────────────────────────┐
│  Status Badges - Hover to see tooltip                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐                                   │
│  │ 📝 DRAFT         │  ← Gray (#6B7280)                │
│  └─────────────────┘                                   │
│                                                         │
│  ┌─────────────────┐                                   │
│  │ 🕐 IN_APPROVAL   │  ← Blue (#3B82F6)                │
│  └─────────────────┘                                   │
│                                                         │
│  ┌─────────────────┐                                   │
│  │ ✅ APPROVED      │  ← Green (#10B981)               │
│  └─────────────────┘                                   │
│                                                         │
│  ┌─────────────────┐                                   │
│  │ ⬅️ CHANGE_       │  ← Orange (#F59E0B)              │
│  │    REQUESTED     │                                  │
│  └─────────────────┘                                   │
│                                                         │
│  ┌─────────────────┐                                   │
│  │ 📄 TENDER_       │  ← Purple (#8B5CF6)              │
│  │    CREATED       │                                  │
│  └─────────────────┘                                   │
│                                                         │
│  ┌─────────────────┐                                   │
│  │ ❌ CANCELLED     │  ← Red (#EF4444)                 │
│  └─────────────────┘                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**How to verify colors:**
1. Right-click on badge
2. Select "Inspect Element"
3. Look at `background-color` or `color` in Styles panel
4. Compare hex code with table above

---

## 6️⃣ Error Messages - What You Should See

### Error 1: Locked Indent Edit Attempt

**When:** Try to submit changes to a locked indent

```
┌────────────────────────────────────────────┐
│  ❌ Error                                   │
│                                            │
│  Cannot edit: Tender already created for   │
│  this indent                               │
│                                            │
│  [ OK ]                                    │
└────────────────────────────────────────────┘
```

**Look for:**
- ✅ Red error notification (Ant Design message.error)
- ✅ Appears at top-right of screen
- ✅ Auto-closes after 5 seconds
- ✅ Clear, user-friendly message

### Error 2: Not Editable Edit Attempt

**When:** Try to submit changes to indent in approval

```
┌────────────────────────────────────────────┐
│  ❌ Error                                   │
│                                            │
│  Cannot edit: Indent is in approval        │
│  workflow                                  │
│                                            │
│  [ OK ]                                    │
└────────────────────────────────────────────┘
```

**Look for:**
- ✅ Red error notification
- ✅ Appears at top-right of screen
- ✅ Auto-closes after 5 seconds
- ✅ Clear, user-friendly message

---

## 7️⃣ Browser Console - What You Should NOT See

### Open DevTools (F12) → Console Tab

**Good Console (No Errors):**
```
Console (empty or minimal warnings)
```

**Bad Console (Has Errors):**
```
❌ ERROR: Cannot read property 'currentStatus' of undefined
❌ ERROR: IndentStatusBadge is not defined
❌ WARNING: Failed prop type: indent is required
```

**If you see errors:**
1. Check component imports
2. Check API response format
3. Check field names match exactly

---

## 8️⃣ Network Tab - API Response Verification

### Open DevTools (F12) → Network Tab

### Steps:
1. Clear network log
2. Search for an indent
3. Find API call: `/api/indents/indentData/IND1001`
4. Click on it
5. Go to "Response" or "Preview" tab

### What You Should See:

```json
{
  "responseData": {
    "indentId": "IND1001",
    "indentorName": "John Doe",

    // ✅ THESE 8 FIELDS MUST BE PRESENT:
    "isEditable": false,           ← Boolean
    "isLockedForTender": false,    ← Boolean
    "lockedReason": null,          ← String or null
    "version": 1,                  ← Number
    "parentIndentId": null,        ← String or null
    "currentStatus": "IN_APPROVAL",← String
    "currentStage": "INDENT_APPROVAL_LEVEL_1", ← String
    "approvalLevel": 1,            ← Number

    // ... other fields ...
  },
  "responseStatus": {
    "message": "Success",
    "statusCode": 200
  }
}
```

**Verify:**
- ✅ All 8 new fields present
- ✅ Correct data types
- ✅ Values make sense (e.g., version >= 1)

---

## 9️⃣ Hover Effects - Interactive Elements

### Status Badges (Hover to see tooltip)

**Before Hover:**
```
┌─────────────┐
│ IN_APPROVAL │
└─────────────┘
```

**After Hover:**
```
┌─────────────┐
│ IN_APPROVAL │ ← Cursor pointer
└─────────────┘
     ↓
┌─────────────────────────────┐
│ Indent is in approval       │
│ workflow                    │
└─────────────────────────────┘
```

**Look for:**
- ✅ Tooltip appears on hover
- ✅ Tooltip contains description
- ✅ Cursor changes to pointer (optional)

---

## 🔟 Mobile/Responsive View (Bonus)

### Test on smaller screens:

**Desktop (1920px):**
- All columns visible
- Status section shows 4 fields in one row

**Tablet (768px):**
- Horizontal scroll may appear
- Status section may wrap to 2 rows

**Mobile (375px):**
- Horizontal scroll required
- Status section stacks vertically

**How to test:**
1. Press F12
2. Click device toggle icon (phone icon)
3. Select different screen sizes
4. Verify layout doesn't break

---

## ✅ Quick Visual Checklist

Print this and check off as you test:

### Indent Creation Form
- [ ] Status section has 4 fields
- [ ] Locked alert is yellow/orange
- [ ] Not editable alert is blue
- [ ] Version alert is blue
- [ ] Error messages appear at top-right
- [ ] Form fields disabled when not editable

### Indent Status Report
- [ ] Current Status column with badges
- [ ] Current Stage column formatted
- [ ] Version column shows numbers
- [ ] Approval Level column shows numbers
- [ ] Editable column shows Yes/No
- [ ] Locked column shows Yes/No

### Indent List Report
- [ ] Version shown as blue tags (v1, v2...)
- [ ] Editable shown as green/red tags
- [ ] Locked shown as orange/gray tags
- [ ] Status badges colored correctly

### Colors Match
- [ ] DRAFT = Gray
- [ ] IN_APPROVAL = Blue
- [ ] APPROVED = Green
- [ ] CHANGE_REQUESTED = Orange
- [ ] TENDER_CREATED = Purple
- [ ] CANCELLED = Red

### No Errors
- [ ] Browser console clear
- [ ] Network responses correct
- [ ] All components render
- [ ] No "undefined" warnings

---

## 📸 Example Screenshots

### Good Example: Status Section
```
✅ This looks correct:
- 4 fields visible
- Values populated
- Grey disabled background
- Labels clear
```

### Bad Example: Missing Fields
```
❌ This is incorrect:
- Only 2 fields showing
- Empty values
- White background
- API might not be returning new fields
```

### Good Example: Locked Alert
```
✅ This looks correct:
- Yellow warning box
- Warning icon visible
- Specific tender ID shown
- Alert at top of form
```

### Bad Example: No Alert
```
❌ This is incorrect:
- No alert showing for locked indent
- Check formData.isLockedForTender value
- Check conditional rendering
```

---

## 🎯 Pass/Fail Criteria

### ✅ PASS if:
- All 8 new fields present in API response
- Status section shows 4 fields
- Alerts display correctly
- Status badges render with correct colors
- Tags show with correct colors
- No console errors
- Edit restrictions work
- Error messages display

### ❌ FAIL if:
- Missing new fields in API
- Status section missing or incomplete
- No alerts for locked/non-editable indents
- Status badges missing or wrong colors
- Console shows errors
- Can edit locked indents
- Error messages don't show

---

## 📞 Quick Debug Commands

Open browser console and run these to debug:

```javascript
// Check if components are loaded
console.log(IndentStatusBadge);
console.log(WorkflowProgressTracker);

// Check form data
console.log(formData);

// Check if new fields exist
console.log({
  isEditable: formData.isEditable,
  isLockedForTender: formData.isLockedForTender,
  currentStatus: formData.currentStatus,
  version: formData.version
});
```

---

**Happy Testing! 🎉**

Remember: If it looks right, it probably IS right. Trust your eyes!
