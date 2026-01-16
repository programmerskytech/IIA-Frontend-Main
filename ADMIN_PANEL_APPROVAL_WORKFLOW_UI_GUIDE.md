# 🎯 IIA Frontend - Admin Panel Approval Workflow UI Complete Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Access & Navigation](#access--navigation)
3. [Workflow Management UI](#workflow-management-ui)
4. [Branch Configuration](#branch-configuration)
5. [Approver Management](#approver-management)
6. [Condition Types Explained](#condition-types-explained)
7. [Step-by-Step Configuration Guide](#step-by-step-configuration-guide)
8. [Testing Scenarios](#testing-scenarios)
9. [Database Tables & Data Structure](#database-tables--data-structure)
10. [API Integration Details](#api-integration-details)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🎯 Overview

The **Admin Panel Approval Workflow UI** is a comprehensive management system that allows administrators to configure multi-level approval hierarchies for all procurement workflows in the IIA system.

### What Can You Do?

✅ **Configure 5 Different Workflows:**
- Indent Approval Workflow
- Tender Approver Workflow
- Tender Evaluator Workflow
- Purchase Order Workflow
- Contingency Purchase Workflow

✅ **Create Custom Approval Branches:**
- Default Branch (fallback route)
- High Value Branch (amount-based routing)
- Urgent Branch (priority handling)
- Custom branches based on conditions

✅ **Define Conditional Routing:**
- Amount-Based (e.g., > ₹50,000)
- Category-Based (Computer vs Non-Computer)
- Location-Based (Bangalore vs Non-Bangalore)
- Project-Based (Under Project or Not)
- Bid Type (Open Bid, Sealed Bid)
- Committee-Based routing
- Combined conditions

✅ **Manage Approval Hierarchy:**
- Assign approvers by role
- Set approval levels (L1, L2, L3...)
- Define approval sequence
- Configure parallel vs sequential approvals
- Mark approvals as mandatory or optional

---

## 🔐 Access & Navigation

### Login Requirement

**Role Required:** Admin

Only users with "Admin" role can access the Admin Panel.

### Navigation Path

#### Method 1: From Dashboard
1. Login with Admin credentials
2. Dashboard loads automatically
3. Click on **"Admin Panel"** card/section
4. Select **"Approval Workflow"** (Green icon with CheckSquare)

#### Method 2: Direct URL
```
/admin/approvers
```

#### Method 3: Side Navigation Menu
1. Open side navigation menu
2. Look for **"Admin Panel"** section
3. Click **"Approval Workflow"**

### Admin Dashboard Overview

**Path:** `/admin`

**Features:**
- Quick statistics (Total Employees, Projects, Budget, Users, Workflows, LOV Entries)
- Navigation cards to all admin modules:
  - List of Values
  - **Approval Workflow** ← Our focus
  - Projects
  - Budget
  - Employee Registration
  - User Creation

---

## 🔧 Workflow Management UI

### Main Component Location

**File:** `src/pages/dashboard/admin/ApprovalWorkflow.jsx`

### UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Admin Panel > Approval Workflow Configuration              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Select Workflow: [Dropdown ▼]                              │
│  Select Branch:   [Dropdown ▼]                              │
│                                                             │
│  [Manage Branches]                    [+ Add Approver]      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Tabs: [Approvers] [Branches]                         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  TABLE: Showing approvers/branches based on tab      │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Workflow Dropdown Options

**Available Workflows:**

| ID | Workflow Name | Key | Purpose |
|----|--------------|-----|---------|
| 1 | Indent Approval Workflow | INDENT | Material requisition approvals |
| 2 | Tender Approver Workflow | TENDER_APPROVER | Tender request approvals |
| 3 | Tender Evaluator Workflow | TENDER_EVALUATOR | Vendor bid evaluations |
| 4 | Purchase Order Workflow | PO | Purchase order approvals |
| 5 | Contingency Purchase Workflow | CP | Emergency purchase approvals |

**UI Element:**
```jsx
<Select
  placeholder="Select Workflow"
  style={{ width: 300 }}
  onChange={handleWorkflowChange}
>
  {workflows.map(w => (
    <Option key={w.id} value={w.id}>{w.name}</Option>
  ))}
</Select>
```

### Branch Dropdown

**Dynamic Loading:**
- Branches are loaded when workflow is selected
- Shows only branches for the selected workflow
- Displays: branchName (branchCode)

**Example Options:**
- Default Branch (DEFAULT)
- High Value Branch (HIGH_VALUE)
- Urgent Branch (URGENT)
- Computer Branch (COMPUTER)
- Non-Computer Branch (NON_COMPUTER)
- Bangalore Branch (BANGALORE)

---

## 🌿 Branch Configuration

### What is a Branch?

A **branch** represents a conditional routing path within a workflow. When a user submits a request (Indent, Tender, PO, etc.), the system evaluates all branches and routes the request to the matching branch's approval chain.

**Think of it as:** "IF condition is met, THEN use these approvers"

### Branch Table Columns

| Column | Description | Example |
|--------|-------------|---------|
| **Branch Code** | Unique identifier | HIGH_VALUE |
| **Branch Name** | Display name | High Value Indents |
| **Description** | What this branch handles | Indents above ₹1 Lakh |
| **Condition Type** | Type of routing rule | AMOUNT |
| **Condition Config** | JSON configuration | `{"minAmount": 100000}` |
| **Display Order** | Priority order | 1, 2, 3... |
| **Status** | Active/Inactive | Active (green tag) |
| **Actions** | Edit, Delete buttons | 🖊️ 🗑️ |

### Add/Edit Branch Modal

**Form Fields:**

#### 1. Branch Code
```
Type: Text Input (required)
Example: HIGH_VALUE
Rules:
  - Required
  - Disabled when editing (cannot change)
  - Unique within workflow
```

#### 2. Branch Name
```
Type: Text Input (required)
Example: High Value Indents
Rules:
  - Required
  - Descriptive name
```

#### 3. Description
```
Type: TextArea
Example: Handles all indent requests with total value between ₹1 Lakh to ₹5 Lakhs
```

#### 4. Condition Type
```
Type: Select Dropdown (required)
Options:
  - DEFAULT (No conditions)
  - AMOUNT (Amount-Based)
  - CATEGORY (Computer/Non-Computer)
  - LOCATION (Bangalore/Non-Bangalore)
  - PROJECT (Under Project/Not)
  - COMPOSITE (Multiple conditions)
  - AMOUNT_WITH_ROLE
  - AMOUNT_WITH_PROJECT
  - BID_TYPE
  - INDENT_COUNT
  - COMMITTEE
```

#### 5. Condition Configuration
```
Type: TextArea (JSON format)
Placeholder: Enter JSON configuration (see examples below)
Validation: Must be valid JSON
Special: Set to null for DEFAULT type
```

**JSON Configuration Examples Panel:**

The UI shows a collapsible panel with examples for each condition type:

```json
// AMOUNT
{
  "minAmount": 100000,
  "maxAmount": 500000
}

// CATEGORY
{
  "category": "Computer"
}

// LOCATION
{
  "location": "Bangalore"
}

// PROJECT
{
  "hasProject": true
}

// COMPOSITE
{
  "minAmount": 100000,
  "category": "Electronics",
  "location": "Head Office"
}

// BID_TYPE
{
  "bidType": "double"
}

// INDENT_COUNT
{
  "minCount": 5
}

// COMMITTEE
{
  "committeeType": "techno_financial"
}
```

#### 6. Display Order
```
Type: Number Input
Example: 1
Purpose: Determines evaluation priority (lower = higher priority)
```

#### 7. Status
```
Type: Switch (Active/Inactive)
Default: Active
```

### Branch Operations

#### Create Branch
1. Click **"Manage Branches"** button
2. Switch to **"Branches"** tab
3. Click **"+ Add Branch"** button (top-right)
4. Fill in all required fields
5. Set condition type and configuration
6. Click **"Save"**

**API Call:**
```
POST /api/admin/approvers/workflows/{workflowId}/branches
Body: {
  branchCode,
  branchName,
  branchDescription,
  conditionType,
  conditionConfig,
  displayOrder,
  isActive
}
```

#### Edit Branch
1. Locate branch in table
2. Click **Edit** icon (🖊️)
3. Modal opens with pre-filled data
4. Modify fields (except Branch Code)
5. Click **"Save"**

**API Call:**
```
PUT /api/admin/approvers/branches/{branchId}
```

#### Delete Branch
1. Locate branch in table
2. Click **Delete** icon (🗑️)
3. Confirm in popup dialog
4. Branch is deleted

**API Call:**
```
DELETE /api/admin/approvers/branches/{branchId}
```

**⚠️ Warning:** Deleting a branch will also delete all associated approvers!

### Branch Status Toggle

- Each branch has an Active/Inactive status
- Inactive branches are not evaluated during routing
- Status shown as colored tag:
  - **Active**: Green tag
  - **Inactive**: Red tag

---

## 👥 Approver Management

### What is an Approver?

An **approver** is a role assigned to review and approve/reject requests at a specific level in the approval hierarchy for a given branch.

**Example:** For "High Value Branch", you might configure:
- **Level 1:** Finance Manager (must approve first)
- **Level 2:** CFO (approves after Finance Manager)
- **Level 3:** Director (final approval)

### Approver Table Columns

| Column | Description | Example |
|--------|-------------|---------|
| **Code** | Auto-generated unique code | W1-B5-001 |
| **Role** | Approver role name | Finance Manager (purple tag) |
| **Level** | Approval level | L1 |
| **Sequence** | Order within level | 1 |
| **Parallel** | Approval logic | OR / AND |
| **Mandatory** | Required approval? | Yes / No |
| **Status** | Active/Inactive toggle | Switch (green/gray) |
| **Actions** | Edit, Delete buttons | 🖊️ 🗑️ |

### Approver Code Format

**Pattern:** `W{workflowId}-B{branchId}-{sequence}`

**Examples:**
- `W1-B5-001` → Workflow 1, Branch 5, 1st approver
- `W3-B2-003` → Workflow 3, Branch 2, 3rd approver

### Add/Edit Approver Modal

**Form Fields:**

#### 1. Approver Role
```
Type: Select Dropdown (searchable, required)
Options: Loaded from /api/employee-department-master/roles
Examples:
  - Reporting Officer
  - Project Head
  - Finance Manager
  - CFO
  - Director
  - Purchase Head
  - Tender Approver
  - Administrative Officer
```

#### 2. Approval Level
```
Type: Number Input (required)
Example: 1, 2, 3
Purpose: Determines hierarchy (L1 → L2 → L3)
Rules: Must be positive integer
```

#### 3. Approval Sequence
```
Type: Number Input (required)
Example: 1, 2, 3
Purpose: Order within the same level
Validation: Must be unique within the same level
Info: UI shows suggested next available sequence
```

**Sequence Validation Example:**
```
Existing approvers at Level 2: Sequence 1, 2
You try to add: Sequence 1
Result: ❌ Error - "Sequence 1 already exists at Level 2"
Suggestion: "Available sequences: 3, 4, 5..."
```

#### 4. Parallel Approval
```
Type: Switch (Yes/No)
Default: No (Sequential - AND logic)
Options:
  - No (Off) → AND logic: All approvers at this level must approve
  - Yes (On) → OR logic: Any one approver at this level can approve
```

**Example Scenarios:**

**Sequential (AND logic - Switch OFF):**
```
Level 2:
  - Finance Manager (Sequence 1, Parallel: No)
  - Account Manager (Sequence 2, Parallel: No)

Result: BOTH must approve for request to proceed to Level 3
```

**Parallel (OR logic - Switch ON):**
```
Level 2:
  - Finance Manager (Sequence 1, Parallel: Yes)
  - Account Manager (Sequence 2, Parallel: Yes)

Result: Either Finance Manager OR Account Manager can approve
```

#### 5. Mandatory Approval
```
Type: Switch (Yes/No)
Default: Yes
Options:
  - Yes (On) → Approver must act (cannot skip)
  - No (Off) → Approver is optional
```

#### 6. Status
```
Type: Select Dropdown
Options:
  - Active → Approver will receive approval requests
  - Inactive → Approver will be skipped
```

### Approver Operations

#### Create Approver
1. Select workflow and branch
2. Click **"+ Add Approver"** button (top-right)
3. Fill in all required fields
4. Choose role, level, sequence
5. Set parallel and mandatory flags
6. Click **"Save"**

**API Call:**
```
POST /api/admin/approvers
Body: {
  workflowId,
  branchId,
  roleId,
  roleName,
  approvalLevel,
  approvalSequence,
  isParallelApproval,
  isMandatory,
  status
}
```

**Auto-Generated:**
- `approverCode` (e.g., W1-B5-001)
- `createdBy` (from session)
- `createdDate` (timestamp)

#### Edit Approver
1. Locate approver in table
2. Click **Edit** icon (🖊️)
3. Modal opens with pre-filled data
4. Modify fields (except Approver Code)
5. Click **"Save"**

**API Call:**
```
PUT /api/admin/approvers/{approverId}
```

#### Toggle Approver Status
1. Locate approver in table
2. Click the **Status Switch** toggle
3. Approver status changes (Active ↔ Inactive)

**API Call:**
```
PUT /api/admin/approvers/{approverId}/status?status={Active|Inactive}&updatedBy=admin
```

**Use Case:** Temporarily disable an approver without deleting them.

#### Delete Approver
1. Locate approver in table
2. Click **Delete** icon (🗑️)
3. Confirm in popup dialog
4. Approver is deleted

**API Call:**
```
DELETE /api/admin/approvers/{approverId}
```

### Approver Search

**Search Bar:** Top of approvers table

**Search Criteria:**
- Approver Code
- Role Name

**Example:**
```
Search: "finance"
Results: All approvers with "Finance" in role name
  - Finance Manager
  - Finance Officer
```

---

## 🎛️ Condition Types Explained

### 1. DEFAULT (No Conditions)

**Purpose:** Fallback branch when no other conditions match

**Condition Config:** `null` or `{}`

**When to Use:**
- Every workflow should have ONE default branch
- Catches all requests that don't match specific conditions

**Example Configuration:**
```json
{
  "branchCode": "DEFAULT",
  "branchName": "Default Branch",
  "conditionType": "DEFAULT",
  "conditionConfig": null
}
```

**How It Works:**
```
User submits Indent with Amount: ₹30,000

Evaluation:
1. Check HIGH_VALUE branch: Amount >= 100000? NO
2. Check URGENT branch: Priority = "Urgent"? NO
3. Check DEFAULT branch: No condition → MATCH ✓

Result: Route to DEFAULT branch approvers
```

---

### 2. AMOUNT (Amount-Based Routing)

**Purpose:** Route based on total request value

**Condition Config Fields:**
- `minAmount` (optional): Minimum threshold
- `maxAmount` (optional): Maximum threshold

**Examples:**

**Low Value (up to ₹50,000):**
```json
{
  "maxAmount": 50000
}
```

**Medium Value (₹50,000 - ₹2,00,000):**
```json
{
  "minAmount": 50000,
  "maxAmount": 200000
}
```

**High Value (above ₹2,00,000):**
```json
{
  "minAmount": 200000
}
```

**Backend Field Mapping:**

| Workflow | Field Used |
|----------|-----------|
| Indent | `totalIntentValue` |
| Tender | `totalTenderValue` |
| PO | `totalValueOfPo` |
| CP | `totalCpValue` |

**Routing Logic:**
```javascript
if (minAmount && maxAmount) {
  return amount >= minAmount && amount <= maxAmount;
} else if (minAmount) {
  return amount >= minAmount;
} else if (maxAmount) {
  return amount <= maxAmount;
}
```

**Real-World Example:**

**Scenario:** Purchase Order Workflow

**Branches:**
1. **Low Value PO**
   - Condition: `{"maxAmount": 100000}`
   - Approvers: Procurement Manager only

2. **Medium Value PO**
   - Condition: `{"minAmount": 100000, "maxAmount": 500000}`
   - Approvers: Procurement Manager → CFO

3. **High Value PO**
   - Condition: `{"minAmount": 500000}`
   - Approvers: Procurement Manager → CFO → Director

**User Submits PO with ₹3,50,000:**
- Low Value: 350000 <= 100000? NO
- Medium Value: 350000 >= 100000 AND <= 500000? NO
- High Value: 350000 >= 500000? NO... Wait!

**⚠️ Common Mistake:** Range overlap or gaps

**Correct Configuration:**
```json
// Low Value
{"maxAmount": 99999.99}

// Medium Value
{"minAmount": 100000, "maxAmount": 499999.99}

// High Value
{"minAmount": 500000}
```

---

### 3. CATEGORY (Computer vs Non-Computer)

**Purpose:** Route based on material category

**Condition Config:**
```json
{
  "category": "Computer"
}
```
OR
```json
{
  "category": "Non-Computer"
}
```

**Backend Field:** `materialCategory`

**Example Branches:**

**Computer Branch:**
```json
{
  "branchCode": "COMPUTER",
  "branchName": "Computer Items",
  "conditionType": "CATEGORY",
  "conditionConfig": "{\"category\": \"Computer\"}"
}
```

**Approvers:**
- IT Manager (L1)
- CTO (L2)

**Non-Computer Branch:**
```json
{
  "branchCode": "NON_COMPUTER",
  "branchName": "Non-Computer Items",
  "conditionType": "CATEGORY",
  "conditionConfig": "{\"category\": \"Non-Computer\"}"
}
```

**Approvers:**
- Admin Manager (L1)
- CFO (L2)

**Use Case:**
```
User creates Indent:
  - Material: "Dell Laptop"
  - Category: "Computer"

Routing: Computer Branch → IT Manager → CTO
```

---

### 4. LOCATION (Bangalore vs Non-Bangalore)

**Purpose:** Route based on consignee location

**Condition Config:**
```json
{
  "location": "Bangalore"
}
```
OR
```json
{
  "location": "Non-Bangalore"
}
```

**Backend Field:** `consignesLocation`

**Example Branches:**

**Bangalore Branch:**
```json
{
  "branchCode": "BANGALORE",
  "conditionType": "LOCATION",
  "conditionConfig": "{\"location\": \"Bangalore\"}"
}
```

**Approvers:**
- Bangalore Office Manager (L1)
- Regional Head - South (L2)

**Non-Bangalore Branch:**
```json
{
  "branchCode": "NON_BANGALORE",
  "conditionType": "LOCATION",
  "conditionConfig": "{\"location\": \"Non-Bangalore\"}"
}
```

**Approvers:**
- Site Manager (L1)
- Regional Head (L2)

**Use Case:**
```
User creates Indent:
  - Consignee Location: "Bangalore - Head Office"

Routing: Bangalore Branch → Bangalore Office Manager → Regional Head - South
```

---

### 5. PROJECT (Under Project vs Not)

**Purpose:** Route based on whether request is linked to a project

**Condition Config:**
```json
{
  "hasProject": true
}
```
OR
```json
{
  "hasProject": false
}
```

**Backend Field:** `projectName`

**Backend Logic:**
```javascript
if (hasProject === true) {
  return projectName !== null && projectName !== "";
} else {
  return projectName === null || projectName === "";
}
```

**Example Branches:**

**Project-Based:**
```json
{
  "branchCode": "PROJECT_BASED",
  "conditionType": "PROJECT",
  "conditionConfig": "{\"hasProject\": true}"
}
```

**Approvers:**
- Project Manager (L1)
- Project Director (L2)

**Non-Project:**
```json
{
  "branchCode": "NON_PROJECT",
  "conditionType": "PROJECT",
  "conditionConfig": "{\"hasProject\": false}"
}
```

**Approvers:**
- Department Head (L1)
- Administrative Director (L2)

**Use Case:**
```
User creates Contingency Purchase:
  - Project Name: "Project Alpha - Phase 2"

Routing: Project-Based Branch → Project Manager → Project Director
```

---

### 6. COMPOSITE (Multiple Conditions)

**Purpose:** Combine multiple conditions (AND logic)

**Condition Config:**
```json
{
  "minAmount": 100000,
  "category": "Electronics",
  "location": "Head Office"
}
```

**Backend Logic:**
```javascript
// ALL conditions must match
amount >= 100000
  AND category === "Electronics"
  AND location === "Head Office"
```

**Example Branch:**
```json
{
  "branchCode": "HIGH_VALUE_ELECTRONICS_HO",
  "branchName": "High Value Electronics - Head Office",
  "conditionType": "COMPOSITE",
  "conditionConfig": "{\"minAmount\": 100000, \"category\": \"Electronics\", \"location\": \"Head Office\"}"
}
```

**Approvers:**
- IT Procurement Manager (L1)
- Finance Manager (L2)
- CFO (L3)

**Use Case:**
```
User creates Indent:
  - Amount: ₹1,50,000
  - Category: "Electronics"
  - Location: "Head Office"

Routing: HIGH_VALUE_ELECTRONICS_HO Branch
```

---

### 7. AMOUNT_WITH_ROLE

**Purpose:** Route based on amount AND department/role

**Condition Config:**
```json
{
  "minAmount": 100000,
  "department": "Engineering"
}
```

**Backend Field:** `TotalPriceOfAllMaterialsAndDept`

**Example Format:** `"100000(Engineering)"`

**Use Case:**
```
Engineering department requests over ₹1 Lakh require additional approval from Engineering Director
```

---

### 8. AMOUNT_WITH_PROJECT

**Purpose:** Route based on amount within project context

**Condition Config:**
```json
{
  "minAmount": 200000,
  "requiresProject": true
}
```

**Use Case:**
```
High-value project purchases require Project Steering Committee approval
```

---

### 9. BID_TYPE (Tender Specific)

**Purpose:** Route based on tender bid type

**Condition Config:**
```json
{
  "bidType": "double"
}
```
OR
```json
{
  "bidType": "open"
}
```

**Backend Field:** `bidType`

**Example Branches:**

**Double Bid System:**
```json
{
  "branchCode": "DOUBLE_BID",
  "conditionType": "BID_TYPE",
  "conditionConfig": "{\"bidType\": \"double\"}"
}
```

**Approvers:**
- Technical Evaluation Committee (L1)
- Financial Evaluation Committee (L2)
- Purchase Committee (L3)

**Open Bid System:**
```json
{
  "branchCode": "OPEN_BID",
  "conditionType": "BID_TYPE",
  "conditionConfig": "{\"bidType\": \"open\"}"
}
```

**Approvers:**
- Evaluation Committee (L1)
- Purchase Head (L2)

**Use Case:**
```
Tender Evaluator creates evaluation:
  - Bid Type: "Double Bid System"

Routing: Double Bid Branch → Technical Committee → Financial Committee → Purchase Committee
```

---

### 10. INDENT_COUNT

**Purpose:** Route based on number of indent items

**Condition Config:**
```json
{
  "minCount": 5
}
```

**Backend Field:** Count of items in indent

**Use Case:**
```
Large indents (>10 items) require additional scrutiny
```

---

### 11. COMMITTEE (Committee-Based)

**Purpose:** Route to specific committees

**Condition Config:**
```json
{
  "committeeType": "techno_financial"
}
```

**Options:**
- `techno_financial` → Techno-Financial Committee
- `purchase` → Purchase Committee
- `tender` → Tender Committee

**Use Case:**
```
Certain high-value or technical purchases require committee approvals
```

---

## 📝 Step-by-Step Configuration Guide

### Scenario 1: Configure Indent Approval Workflow

**Requirement:**
- **Low Value Indents** (up to ₹50,000): Reporting Officer → Project Head
- **Medium Value Indents** (₹50,000 - ₹2,00,000): Reporting Officer → Administrative Officer → Purchase Head
- **High Value Indents** (above ₹2,00,000): Reporting Officer → Administrative Officer → Dean → Director → Purchase Head

---

#### Step 1: Create LOW_VALUE Branch

**1.1 Navigate to Approval Workflow**
- Go to `/admin/approvers`

**1.2 Select Workflow**
- Select: "Indent Approval Workflow" from dropdown

**1.3 Add Branch**
- Click "Manage Branches" button
- Switch to "Branches" tab
- Click "+ Add Branch"

**1.4 Fill Branch Form**
```
Branch Code: LOW_VALUE
Branch Name: Low Value Indents
Description: Indents with total value up to ₹50,000
Condition Type: AMOUNT
Condition Config:
{
  "maxAmount": 50000
}
Display Order: 1
Status: Active (toggle ON)
```

**1.5 Save Branch**
- Click "Save"
- Verify branch appears in table

---

#### Step 2: Add Approvers for LOW_VALUE Branch

**2.1 Select Branch**
- Select "Low Value Indents" from Branch dropdown

**2.2 Add First Approver (Level 1)**
- Click "+ Add Approver"
- Fill form:
```
Approver Role: Reporting Officer
Approval Level: 1
Approval Sequence: 1
Parallel Approval: No (OFF)
Mandatory Approval: Yes (ON)
Status: Active
```
- Click "Save"

**2.3 Add Second Approver (Level 2)**
- Click "+ Add Approver"
- Fill form:
```
Approver Role: Project Head
Approval Level: 2
Approval Sequence: 1
Parallel Approval: No (OFF)
Mandatory Approval: Yes (ON)
Status: Active
```
- Click "Save"

**2.4 Verify Approver Hierarchy**
- Table should show:
  - L1: Reporting Officer
  - L2: Project Head

---

#### Step 3: Create MEDIUM_VALUE Branch

**3.1 Add Branch**
- Switch to "Branches" tab
- Click "+ Add Branch"

**3.2 Fill Branch Form**
```
Branch Code: MEDIUM_VALUE
Branch Name: Medium Value Indents
Description: Indents between ₹50,000 to ₹2,00,000
Condition Type: AMOUNT
Condition Config:
{
  "minAmount": 50000,
  "maxAmount": 200000
}
Display Order: 2
Status: Active
```

**3.3 Save Branch**

---

#### Step 4: Add Approvers for MEDIUM_VALUE Branch

**4.1 Select Branch**
- Select "Medium Value Indents" from dropdown

**4.2 Add Approvers (3 levels)**

**Level 1:**
```
Role: Reporting Officer
Level: 1
Sequence: 1
Parallel: No
Mandatory: Yes
```

**Level 2:**
```
Role: Administrative Officer
Level: 2
Sequence: 1
Parallel: No
Mandatory: Yes
```

**Level 3:**
```
Role: Purchase Head
Level: 3
Sequence: 1
Parallel: No
Mandatory: Yes
```

---

#### Step 5: Create HIGH_VALUE Branch

**5.1 Add Branch**
```
Branch Code: HIGH_VALUE
Branch Name: High Value Indents
Description: Indents above ₹2,00,000
Condition Type: AMOUNT
Condition Config:
{
  "minAmount": 200000
}
Display Order: 3
Status: Active
```

---

#### Step 6: Add Approvers for HIGH_VALUE Branch

**6.1 Add 5 Approvers**

```
L1: Reporting Officer (Sequence 1)
L2: Administrative Officer (Sequence 1)
L3: Dean (Sequence 1)
L4: Director (Sequence 1)
L5: Purchase Head (Sequence 1)
```

---

#### Step 7: Test Configuration

**7.1 Verify All Branches**
- Switch to "Branches" tab
- Verify all 3 branches exist:
  - LOW_VALUE (Display Order: 1)
  - MEDIUM_VALUE (Display Order: 2)
  - HIGH_VALUE (Display Order: 3)

**7.2 Verify Approvers for Each Branch**
- Select each branch
- Verify approver hierarchy is correct

**7.3 Test with Sample Data**

**Test Case 1: Low Value (₹30,000)**
```
Expected Route: Reporting Officer → Project Head
```

**Test Case 2: Medium Value (₹1,50,000)**
```
Expected Route: Reporting Officer → Administrative Officer → Purchase Head
```

**Test Case 3: High Value (₹3,00,000)**
```
Expected Route: Reporting Officer → Administrative Officer → Dean → Director → Purchase Head
```

---

### Scenario 2: Configure Computer vs Non-Computer Routing

**Requirement:**
- **Computer Items**: IT Manager → CTO
- **Non-Computer Items**: Admin Manager → CFO

---

#### Step 1: Create COMPUTER Branch

```
Branch Code: COMPUTER
Branch Name: Computer Items
Description: All computer and IT equipment purchases
Condition Type: CATEGORY
Condition Config:
{
  "category": "Computer"
}
Display Order: 1
Status: Active
```

**Approvers:**
```
L1: IT Manager (Sequence 1)
L2: CTO (Sequence 1)
```

---

#### Step 2: Create NON_COMPUTER Branch

```
Branch Code: NON_COMPUTER
Branch Name: Non-Computer Items
Description: All non-computer purchases
Condition Type: CATEGORY
Condition Config:
{
  "category": "Non-Computer"
}
Display Order: 2
Status: Active
```

**Approvers:**
```
L1: Admin Manager (Sequence 1)
L2: CFO (Sequence 1)
```

---

### Scenario 3: Configure Parallel Approval

**Requirement:**
- At Level 2, EITHER Finance Manager OR Account Manager can approve (not both required)

---

#### Configuration

**Level 1:**
```
Role: Reporting Officer
Level: 1
Sequence: 1
Parallel: No
Mandatory: Yes
```

**Level 2 - Approver 1:**
```
Role: Finance Manager
Level: 2
Sequence: 1
Parallel: Yes (ON) ← OR logic
Mandatory: Yes
```

**Level 2 - Approver 2:**
```
Role: Account Manager
Level: 2
Sequence: 2
Parallel: Yes (ON) ← OR logic
Mandatory: Yes
```

**Level 3:**
```
Role: Director
Level: 3
Sequence: 1
Parallel: No
Mandatory: Yes
```

---

**Workflow Behavior:**
```
1. Request goes to Reporting Officer (L1)
2. Reporting Officer approves
3. Request goes to BOTH Finance Manager AND Account Manager (L2)
4. If Finance Manager approves → Proceed to Director (L3)
   OR
   If Account Manager approves → Proceed to Director (L3)
5. Director approves → Request APPROVED
```

**Key Point:** Only ONE of the L2 approvers needs to approve, not both!

---

### Scenario 4: Configure Location-Based Routing

**Requirement:**
- **Bangalore Office**: Bangalore Manager → Regional Head South
- **Other Locations**: Site Manager → Regional Head

---

#### Step 1: Create BANGALORE Branch

```
Branch Code: BANGALORE
Branch Name: Bangalore Office
Condition Type: LOCATION
Condition Config:
{
  "location": "Bangalore"
}
Display Order: 1
Status: Active
```

**Approvers:**
```
L1: Bangalore Office Manager
L2: Regional Head - South
```

---

#### Step 2: Create DEFAULT Branch (for other locations)

```
Branch Code: DEFAULT
Branch Name: Other Locations
Condition Type: DEFAULT
Condition Config: null
Display Order: 99
Status: Active
```

**Approvers:**
```
L1: Site Manager
L2: Regional Head
```

---

**Routing Logic:**
```
If consignesLocation contains "Bangalore" → BANGALORE Branch
Else → DEFAULT Branch
```

---

## 🧪 Testing Scenarios

### Test Scenario 1: Amount-Based Routing

**Setup:**
- Workflow: Purchase Order Workflow
- Branches: LOW_VALUE, MEDIUM_VALUE, HIGH_VALUE

**Test Cases:**

| Test # | PO Amount | Expected Branch | Expected Approvers |
|--------|-----------|-----------------|-------------------|
| TC-01 | ₹25,000 | LOW_VALUE | Procurement Manager |
| TC-02 | ₹50,000 | LOW_VALUE (edge case) | Procurement Manager |
| TC-03 | ₹50,001 | MEDIUM_VALUE | Procurement Manager → CFO |
| TC-04 | ₹1,50,000 | MEDIUM_VALUE | Procurement Manager → CFO |
| TC-05 | ₹2,00,000 | MEDIUM_VALUE (edge case) | Procurement Manager → CFO |
| TC-06 | ₹2,00,001 | HIGH_VALUE | Procurement Manager → CFO → Director |
| TC-07 | ₹10,00,000 | HIGH_VALUE | Procurement Manager → CFO → Director |

**Steps:**
1. Login as user with PO creation permission
2. Create PO with test amount
3. Submit PO
4. Initiate workflow
5. Verify routing to correct branch
6. Check approver receives notification
7. Approver logs in and verifies PO appears in pending list

---

### Test Scenario 2: Category-Based Routing

**Setup:**
- Workflow: Indent Approval Workflow
- Branches: COMPUTER, NON_COMPUTER

**Test Cases:**

| Test # | Material Category | Expected Branch | Expected Approvers |
|--------|-------------------|-----------------|-------------------|
| TC-08 | Computer | COMPUTER | IT Manager → CTO |
| TC-09 | Non-Computer | NON_COMPUTER | Admin Manager → CFO |

**Steps:**
1. Create Indent with category = "Computer"
2. Initiate workflow
3. Verify IT Manager receives approval request
4. IT Manager approves
5. Verify CTO receives approval request
6. CTO approves
7. Verify Indent status = "APPROVED"

---

### Test Scenario 3: Parallel Approval

**Setup:**
- Level 2 has 2 approvers with Parallel: Yes

**Test Cases:**

| Test # | L2 Approver Who Acts | Expected Result |
|--------|---------------------|-----------------|
| TC-10 | Finance Manager approves | Proceeds to L3 |
| TC-11 | Account Manager approves | Proceeds to L3 |
| TC-12 | Both approve | Proceeds to L3 (first approval is enough) |

**Steps:**
1. Create request, L1 approves
2. Request goes to both Finance Manager and Account Manager
3. Finance Manager approves first
4. Verify request immediately proceeds to L3 (doesn't wait for Account Manager)

---

### Test Scenario 4: Rejection Handling

**Test Cases:**

| Test # | Rejection Point | Expected Behavior |
|--------|----------------|-------------------|
| TC-13 | L1 rejects | All transitions marked REJECTED, request status = REJECTED |
| TC-14 | L2 rejects | Same as above |
| TC-15 | L3 rejects | Same as above |

**Steps:**
1. Create request
2. L1 approves
3. L2 REJECTS with remarks "Budget not available"
4. Verify:
   - Request status = "REJECTED"
   - All workflow transitions marked "REJECTED"
   - Creator receives rejection email
   - Request is no longer editable

---

### Test Scenario 5: Change Request

**Test Cases:**

| Test # | Change Request Point | Expected Behavior |
|--------|---------------------|-------------------|
| TC-16 | L2 requests change | Request returns to creator, status = CHANGE_REQUESTED |

**Steps:**
1. Create request
2. L1 approves
3. L2 clicks "Request Changes" with remarks "Please update quantity"
4. Verify:
   - Request status = "CHANGE_REQUESTED"
   - Creator receives notification
   - Request becomes editable
5. Creator modifies request and re-submits
6. Verify workflow restarts from L1

---

### Test Scenario 6: Branch Priority

**Setup:**
- Multiple branches with overlapping conditions

**Test Cases:**

| Test # | Amount | Category | Expected Branch | Reason |
|--------|--------|----------|----------------|--------|
| TC-17 | ₹1,50,000 | Computer | HIGH_VALUE_COMPUTER | Display Order 1 (highest priority) |
| TC-18 | ₹1,50,000 | Non-Computer | HIGH_VALUE | Display Order 2 |

**Configuration:**
```
Branch 1: HIGH_VALUE_COMPUTER
  Condition: {"minAmount": 100000, "category": "Computer"}
  Display Order: 1

Branch 2: HIGH_VALUE
  Condition: {"minAmount": 100000}
  Display Order: 2
```

**Key Point:** Lower Display Order = Higher Priority

---

### Test Scenario 7: Inactive Approver

**Test Cases:**

| Test # | Scenario | Expected Behavior |
|--------|----------|-------------------|
| TC-19 | L2 approver is Inactive | Request skips L2, goes directly to L3 |

**Steps:**
1. Configure: L1 → L2 → L3
2. Set L2 approver status = Inactive
3. Create request
4. L1 approves
5. Verify request goes directly to L3 (skips inactive L2)

---

### Test Scenario 8: Inactive Branch

**Test Cases:**

| Test # | Scenario | Expected Behavior |
|--------|----------|-------------------|
| TC-20 | Matching branch is Inactive | Falls back to DEFAULT branch |

**Steps:**
1. Configure:
   - HIGH_VALUE branch (Amount > 100000, Status = Inactive)
   - DEFAULT branch (Status = Active)
2. Create request with amount = ₹2,00,000
3. Verify request routes to DEFAULT branch (HIGH_VALUE is skipped)

---

### Test Scenario 9: Multiple Workflows

**Test Cases:**

| Test # | Workflow | Request Type | Expected Approvers |
|--------|----------|--------------|-------------------|
| TC-21 | Indent Workflow | Indent | Reporting Officer → ... |
| TC-22 | Tender Approver Workflow | Tender | Tender Approver |
| TC-23 | Tender Evaluator Workflow | Tender Evaluation | Tender Evaluator → Purchase Dept |
| TC-24 | PO Workflow | Purchase Order | Store Purchase Officer → ... |
| TC-25 | CP Workflow | Contingency Purchase | CP Approver |

---

### Test Scenario 10: End-to-End Complete Workflow

**Workflow:** Indent Approval (High Value)

**Approvers:**
```
L1: Reporting Officer
L2: Administrative Officer
L3: Dean
L4: Director
L5: Purchase Head
```

**Steps:**
1. **User creates Indent**
   - Amount: ₹3,00,000
   - Category: Electronics
   - Location: Bangalore
   - Submit

2. **Initiate Workflow**
   - POST /initiateWorkflow
   - Verify:
     - WORKFLOW_TRANSITION record created (status: IN_PROGRESS)
     - Email sent to Reporting Officer

3. **L1: Reporting Officer Approves**
   - Login as Reporting Officer
   - Check pending approvals list
   - Verify Indent appears
   - Click "Approve"
   - Add remarks: "Approved by Reporting Officer"
   - Submit
   - Verify:
     - L1 transition status: COMPLETED
     - L2 transition created (status: IN_PROGRESS)
     - Email sent to Administrative Officer

4. **L2: Administrative Officer Approves**
   - Login as Administrative Officer
   - Approve with remarks
   - Verify L3 transition created
   - Email sent to Dean

5. **L3: Dean Approves**
   - Login as Dean
   - Approve
   - Verify L4 transition created
   - Email sent to Director

6. **L4: Director Approves**
   - Login as Director
   - Approve
   - Verify L5 transition created
   - Email sent to Purchase Head

7. **L5: Purchase Head Approves (Final)**
   - Login as Purchase Head
   - Approve
   - Verify:
     - All transitions status: COMPLETED
     - Indent status: APPROVED
     - Indent isEditable: false
     - No more pending transitions

8. **Post-Approval**
   - User can now create Tender based on this Indent
   - Indent appears in "Approved Indents" list

---

## 🗄️ Database Tables & Data Structure

### Table 1: workflow_master

**Purpose:** Stores all available workflows

**Columns:**
```sql
workflow_id          INT PRIMARY KEY AUTO_INCREMENT
workflow_name        VARCHAR(100) NOT NULL
created_by           VARCHAR(100)
created_date         DATETIME DEFAULT NOW()
```

**Sample Data:**
```
1 | Indent Workflow
2 | Tender Approver Workflow
3 | Tender Evaluator Workflow
4 | PO Workflow
5 | CP Workflow
```

---

### Table 2: workflow_branch_master

**Purpose:** Stores branches and their conditions for each workflow

**Columns:**
```sql
branch_id            BIGINT PRIMARY KEY AUTO_INCREMENT
workflow_id          INT NOT NULL
branch_code          VARCHAR(50) NOT NULL
branch_name          VARCHAR(100) NOT NULL
branch_description   TEXT
condition_type       VARCHAR(50)
condition_config     JSON
is_active            BOOLEAN DEFAULT TRUE
display_order        INT
created_by           VARCHAR(100)
created_date         DATETIME DEFAULT NOW()
modified_by          VARCHAR(100)
modified_date        DATETIME
UNIQUE (workflow_id, branch_code)
```

**Sample Data:**
```
| branch_id | workflow_id | branch_code | branch_name | condition_type | condition_config | display_order |
|-----------|-------------|-------------|-------------|----------------|------------------|---------------|
| 1 | 1 | DEFAULT | Default Branch | DEFAULT | null | 99 |
| 2 | 1 | LOW_VALUE | Low Value Indents | AMOUNT | {"maxAmount":50000} | 1 |
| 3 | 1 | MEDIUM_VALUE | Medium Value | AMOUNT | {"minAmount":50000,"maxAmount":200000} | 2 |
| 4 | 1 | HIGH_VALUE | High Value | AMOUNT | {"minAmount":200000} | 3 |
| 5 | 1 | COMPUTER | Computer Items | CATEGORY | {"category":"Computer"} | 10 |
| 6 | 1 | BANGALORE | Bangalore Office | LOCATION | {"location":"Bangalore"} | 20 |
```

---

### Table 3: approver_master

**Purpose:** Stores approver hierarchy for each branch

**Columns:**
```sql
approver_id          BIGINT PRIMARY KEY AUTO_INCREMENT
approver_code        VARCHAR(50) UNIQUE
workflow_id          INT NOT NULL
branch_id            BIGINT NOT NULL
role_id              INT NOT NULL
role_name            VARCHAR(100) NOT NULL
approval_level       INT NOT NULL
approval_sequence    INT NOT NULL
is_parallel_approval BOOLEAN DEFAULT FALSE
is_mandatory         BOOLEAN DEFAULT TRUE
status               VARCHAR(20) DEFAULT 'Active'
created_by           VARCHAR(100)
created_date         DATETIME DEFAULT NOW()
modified_by          VARCHAR(100)
modified_date        DATETIME
FOREIGN KEY (workflow_id) REFERENCES workflow_master(workflow_id)
FOREIGN KEY (branch_id) REFERENCES workflow_branch_master(branch_id)
```

**Sample Data:**
```
| approver_id | approver_code | workflow_id | branch_id | role_name | approval_level | approval_sequence | is_parallel | is_mandatory | status |
|-------------|---------------|-------------|-----------|-----------|----------------|-------------------|-------------|--------------|--------|
| 1 | W1-B2-001 | 1 | 2 | Reporting Officer | 1 | 1 | 0 | 1 | Active |
| 2 | W1-B2-002 | 1 | 2 | Project Head | 2 | 1 | 0 | 1 | Active |
| 3 | W1-B3-001 | 1 | 3 | Reporting Officer | 1 | 1 | 0 | 1 | Active |
| 4 | W1-B3-002 | 1 | 3 | Admin Officer | 2 | 1 | 0 | 1 | Active |
| 5 | W1-B3-003 | 1 | 3 | Purchase Head | 3 | 1 | 0 | 1 | Active |
```

---

### Table 4: workflow_transition

**Purpose:** Runtime tracking of approval workflow execution

**Columns:**
```sql
workflow_transition_id  INT PRIMARY KEY AUTO_INCREMENT
workflow_id             INT
workflow_name           VARCHAR(100) NOT NULL
transition_id           INT
request_id              VARCHAR(100) NOT NULL
created_by              INT
modified_by             INT
status                  VARCHAR(50)
next_action             VARCHAR(50)
transition_order        INT
transition_sub_order    INT
action                  VARCHAR(50)
remarks                 TEXT
current_role            VARCHAR(100)
next_role               VARCHAR(100)
created_date            DATETIME DEFAULT NOW()
modification_date       DATETIME
workflow_sequence       INT
```

**Sample Data:**
```
| id | workflow_name | request_id | current_role | next_role | status | next_action | order | sub_order | sequence |
|----|--------------|-----------|-------------|-----------|--------|------------|-------|----------|----------|
| 1 | Indent Workflow | IND1001 | Indent Creator | Reporting Officer | Created | Completed | 1 | 1 | 1 |
| 2 | Indent Workflow | IND1001 | Reporting Officer | Project Head | In-progress | Completed | 2 | 1 | 2 |
| 3 | Indent Workflow | IND1001 | Project Head | Director | In-progress | Completed | 3 | 2 | 3 |
| 4 | Indent Workflow | IND1001 | Director | Purchase Head | In-progress | Completed | 7 | 1 | 4 |
| 5 | Indent Workflow | IND1001 | Purchase Head | null | Completed | null | 8 | 1 | 5 |
```

**Status Values:**
- `Created` → Initial state
- `In-progress` → Currently pending approval
- `Completed` → Approved and moved to next level
- `Rejected` → Request rejected

**Next Action Values:**
- `Pending` → Awaiting approver action
- `Completed` → Action taken
- `null` → Final state (no more actions needed)

---

### Table 5: indent_creation

**Purpose:** Stores indent request data

**Columns (relevant to workflow):**
```sql
indent_id            VARCHAR(100) PRIMARY KEY
total_intent_value   DECIMAL(15,2)
material_category    VARCHAR(100)
consignes_location   VARCHAR(200)
project_name         VARCHAR(200)
current_status       VARCHAR(50)
is_editable          BOOLEAN
created_by           INT
created_date         DATETIME
```

**Sample Data:**
```
| indent_id | total_intent_value | material_category | consignes_location | project_name | current_status | is_editable |
|-----------|-------------------|------------------|-------------------|--------------|---------------|-------------|
| IND1001 | 75000.00 | Electronics | Bangalore | Project Alpha | APPROVED | 0 |
| IND1002 | 150000.00 | Computer | Head Office | null | IN_PROGRESS | 1 |
| IND1003 | 30000.00 | Non-Computer | Mumbai | Project Beta | SUBMITTED | 1 |
```

**Status Values:**
- `SUBMITTED` → Initial submission
- `IN_PROGRESS` → Approval workflow in progress
- `APPROVED` → All approvals completed
- `REJECTED` → Rejected by any approver
- `CHANGE_REQUESTED` → Sent back to creator for modification

---

### Table 6: employee_department_master

**Purpose:** Stores employee and role information

**Columns:**
```sql
employee_id          INT PRIMARY KEY AUTO_INCREMENT
employee_name        VARCHAR(200)
email                VARCHAR(200)
role_id              INT
role_name            VARCHAR(100)
department_id        INT
department_name      VARCHAR(100)
```

**Sample Data:**
```
| employee_id | employee_name | email | role_id | role_name |
|-------------|--------------|-------|---------|-----------|
| 17 | John Doe | john@example.com | 5 | Reporting Officer |
| 18 | Jane Smith | jane@example.com | 10 | Finance Manager |
| 19 | Bob Johnson | bob@example.com | 15 | Director |
| 20 | Alice Williams | alice@example.com | 12 | Purchase Head |
```

---

### Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  CONFIGURATION PHASE (Admin Panel)                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  workflow_master                                             │
│  ↓                                                           │
│  workflow_branch_master (Branches with Conditions)           │
│  ↓                                                           │
│  approver_master (Approver Hierarchy per Branch)             │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  RUNTIME PHASE (User Request Processing)                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User creates request (indent_creation, etc.)             │
│  2. System reads workflow_branch_master                      │
│  3. Evaluates conditions against request data                │
│  4. Selects matching branch                                  │
│  5. Reads approver_master for that branch                    │
│  6. Creates workflow_transition records (one per approver)   │
│  7. Sends email to first approver                            │
│                                                              │
│  APPROVAL LOOP:                                              │
│  8. Approver acts (approve/reject/change)                    │
│  9. Update workflow_transition (status: COMPLETED)           │
│  10. Create next workflow_transition                         │
│  11. Send email to next approver                             │
│  12. Repeat until all levels completed                       │
│                                                              │
│  13. Final approval → Update request status: APPROVED        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Integration Details

### Backend Base URL

**Development:**
```
http://localhost:8080
```

**Production:**
```
https://api.iia.example.com
```

### Authentication

All API calls require authentication token in header:
```
Authorization: Bearer <JWT_TOKEN>
```

### API Endpoints Summary

#### Workflow Management APIs

**1. Get All Workflows**
```
GET /api/admin/workflows
Response: [
  { workflowId: 1, workflowName: "Indent Workflow" },
  ...
]
```

**2. Get Branches for Workflow**
```
GET /api/admin/approvers/workflows/{workflowId}/branches
Response: [
  {
    branchId: 5,
    branchCode: "HIGH_VALUE",
    branchName: "High Value Indents",
    conditionType: "AMOUNT",
    conditionConfig: "{\"minAmount\": 100000}",
    isActive: true,
    displayOrder: 1
  },
  ...
]
```

**3. Create Branch**
```
POST /api/admin/approvers/workflows/{workflowId}/branches
Body: {
  "branchCode": "HIGH_VALUE",
  "branchName": "High Value Indents",
  "branchDescription": "Indents over 1 Lakh",
  "conditionType": "AMOUNT",
  "conditionConfig": "{\"minAmount\": 100000}",
  "displayOrder": 1,
  "isActive": true
}
Response: {
  branchId: 5,
  message: "Branch created successfully"
}
```

**4. Update Branch**
```
PUT /api/admin/approvers/branches/{branchId}
Body: {
  "branchName": "High Value Indents - Updated",
  "conditionConfig": "{\"minAmount\": 150000}",
  ...
}
Response: {
  message: "Branch updated successfully"
}
```

**5. Delete Branch**
```
DELETE /api/admin/approvers/branches/{branchId}
Response: {
  message: "Branch deleted successfully"
}
```

---

#### Approver Management APIs

**6. Get Approvers for Branch**
```
GET /api/admin/approvers/workflow/{workflowId}/branch/{branchId}
Response: [
  {
    approverId: 1,
    approverCode: "W1-B5-001",
    roleId: 10,
    roleName: "Finance Manager",
    approvalLevel: 1,
    approvalSequence: 1,
    isParallelApproval: false,
    isMandatory: true,
    status: "Active"
  },
  ...
]
```

**7. Create Approver**
```
POST /api/admin/approvers
Body: {
  "workflowId": 1,
  "branchId": 5,
  "roleId": 10,
  "roleName": "Finance Manager",
  "approvalLevel": 1,
  "approvalSequence": 1,
  "isParallelApproval": false,
  "isMandatory": true,
  "status": "Active"
}
Response: {
  approverId: 25,
  approverCode: "W1-B5-001",
  message: "Approver created successfully"
}
```

**8. Update Approver**
```
PUT /api/admin/approvers/{approverId}
Body: {
  "approvalLevel": 2,
  "approvalSequence": 1,
  ...
}
Response: {
  message: "Approver updated successfully"
}
```

**9. Update Approver Status**
```
PUT /api/admin/approvers/{approverId}/status?status=Inactive&updatedBy=admin
Response: {
  message: "Approver status updated successfully"
}
```

**10. Delete Approver**
```
DELETE /api/admin/approvers/{approverId}
Response: {
  message: "Approver deleted successfully"
}
```

---

#### Role Management APIs

**11. Get All Roles**
```
GET /api/employee-department-master/roles
Response: [
  { roleId: 1, roleName: "Reporting Officer" },
  { roleId: 2, roleName: "Project Head" },
  { roleId: 3, roleName: "Finance Manager" },
  ...
]
```

---

#### Workflow Execution APIs (User-facing)

**12. Initiate Workflow**
```
POST /api/workflow/initiateWorkflow
Body: {
  "requestId": "IND1001",
  "workflowName": "IndentWorkflow",
  "createdBy": 18
}
Response: {
  message: "Workflow initiated successfully",
  workflowTransitionId: 501
}
```

**13. Perform Approval Action**
```
POST /api/workflow/performTransitionAction
Body: {
  "workflowTransitionId": 501,
  "action": "APPROVED",
  "remarks": "Approved successfully",
  "actionBy": 17
}
Response: {
  message: "Action performed successfully",
  nextRole: "Finance Manager",
  isComplete: false
}
```

**14. Get Pending Approvals**
```
GET /api/workflow/pendingWorkflowTransition?roleId=10&userId=18
Response: [
  {
    workflowTransitionId: 502,
    requestId: "IND1001",
    workflowName: "Indent Workflow",
    currentRole: "Finance Manager",
    createdDate: "2025-06-24T14:21:51"
  },
  ...
]
```

**15. Get Completed Workflows**
```
GET /api/workflow/completedIndentWorkflowTransition
Response: ["IND1001", "IND1006", "IND1007", ...]
```

---

### Error Handling

**Standard Error Response:**
```json
{
  "status": "error",
  "message": "Descriptive error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-06-24T14:21:51"
}
```

**Common Error Codes:**

| Code | Message | Resolution |
|------|---------|-----------|
| 400 | Invalid JSON format | Check conditionConfig syntax |
| 404 | Workflow not found | Verify workflowId exists |
| 404 | Branch not found | Verify branchId exists |
| 409 | Branch code already exists | Use unique branchCode |
| 409 | Sequence already exists | Use different approvalSequence |
| 500 | Internal server error | Contact support |

---

## 🔧 Troubleshooting Guide

### Issue 1: Branch Not Routing Correctly

**Symptoms:**
- Request goes to wrong branch
- Request goes to DEFAULT branch instead of specific branch

**Diagnosis:**
1. Check condition configuration JSON syntax
2. Verify displayOrder (lower = higher priority)
3. Check if branch is Active

**Resolution:**
```
1. Go to Branches tab
2. Find the branch
3. Click Edit
4. Verify Condition Config:
   - Valid JSON?
   - Correct field names (minAmount, maxAmount, category, etc.)?
   - Correct values?
5. Check Display Order:
   - More specific conditions should have lower display order
6. Verify Status = Active
```

**Example:**
```json
// WRONG
{
  "min": 100000  // Should be "minAmount"
}

// CORRECT
{
  "minAmount": 100000
}
```

---

### Issue 2: Approver Not Receiving Notification

**Symptoms:**
- Workflow initiated but approver doesn't get email
- Request stuck at certain level

**Diagnosis:**
1. Check approver status (Active?)
2. Verify email configuration
3. Check role mapping

**Resolution:**
```
1. Go to Approvers tab
2. Find approver in table
3. Verify Status = Active
4. Check if role mapping is correct
5. Verify user has that role assigned
6. Check email logs (backend)
```

---

### Issue 3: Sequence Validation Error

**Symptoms:**
- Cannot add approver
- Error: "Sequence already exists"

**Diagnosis:**
- Trying to use duplicate sequence number within same level

**Resolution:**
```
1. Check existing approvers at that level
2. Note used sequences (e.g., 1, 2)
3. Use next available sequence (e.g., 3)
OR
4. Edit existing approver to change sequence
```

---

### Issue 4: Parallel Approval Not Working

**Symptoms:**
- System waits for all approvers instead of just one

**Diagnosis:**
- isParallelApproval flag not set correctly

**Resolution:**
```
1. Edit both approvers at the same level
2. Ensure BOTH have "Parallel Approval" = Yes (ON)
3. Save changes
4. Test workflow
```

**Key Point:** ALL approvers at the same level must have isParallelApproval = true for OR logic to work.

---

### Issue 5: Workflow Stuck

**Symptoms:**
- Request shows IN_PROGRESS indefinitely
- No approver receiving notification

**Diagnosis:**
1. Check workflow_transition table
2. Look for transition with status = IN_PROGRESS

**Resolution (Database Query):**
```sql
SELECT * FROM workflow_transition
WHERE request_id = 'IND1001'
ORDER BY transition_order, transition_sub_order;

-- Check for:
-- 1. Missing next_role (should not be null except for final step)
-- 2. Status stuck at IN_PROGRESS
-- 3. Next approver is Inactive
```

**Manual Fix:**
```sql
-- Update stuck transition to completed
UPDATE workflow_transition
SET status = 'COMPLETED', next_action = 'Completed'
WHERE workflow_transition_id = 123;

-- Create next transition manually (if needed)
-- Contact backend developer
```

---

### Issue 6: Cannot Delete Branch

**Symptoms:**
- Delete button doesn't work
- Error: "Cannot delete branch with approvers"

**Diagnosis:**
- Branch has associated approvers

**Resolution:**
```
1. Select the branch
2. Go to Approvers tab
3. Delete all approvers for this branch
4. Go back to Branches tab
5. Now delete the branch
```

**⚠️ Warning:** This will permanently delete all approver configurations for this branch.

---

### Issue 7: JSON Configuration Errors

**Symptoms:**
- Error: "Invalid JSON format"
- Cannot save branch

**Common Mistakes:**

**1. Missing Quotes:**
```json
// WRONG
{minAmount: 100000}

// CORRECT
{"minAmount": 100000}
```

**2. Trailing Comma:**
```json
// WRONG
{
  "minAmount": 100000,
  "maxAmount": 500000,
}

// CORRECT
{
  "minAmount": 100000,
  "maxAmount": 500000
}
```

**3. Single Quotes:**
```json
// WRONG
{'category': 'Computer'}

// CORRECT
{"category": "Computer"}
```

**Resolution:**
- Use online JSON validator (jsonlint.com)
- Copy example from UI panel
- Ensure proper syntax

---

### Issue 8: Approver Level Confusion

**Symptoms:**
- Approvals happening out of order
- Lower level approving before higher level

**Diagnosis:**
- Approval levels not set correctly

**Resolution:**
```
1. Review approver hierarchy
2. Ensure levels are sequential:
   - L1: First approver
   - L2: Second approver
   - L3: Third approver
3. Lower level numbers = earlier in sequence
4. Edit approvers to correct levels
```

**Example:**
```
WRONG:
  L3: Reporting Officer
  L1: Director
  L2: Finance Manager

CORRECT:
  L1: Reporting Officer
  L2: Finance Manager
  L3: Director
```

---

### Issue 9: Multiple Branches Match

**Symptoms:**
- Unclear which branch will be selected
- Random routing behavior

**Diagnosis:**
- Multiple branches with overlapping conditions

**Resolution:**
```
1. Review all branch conditions
2. Ensure conditions are mutually exclusive OR
3. Use Display Order to prioritize
4. More specific conditions should have lower display order

Example:
  Display Order 1: {"minAmount": 100000, "category": "Computer"}
  Display Order 2: {"minAmount": 100000}
  Display Order 3: DEFAULT (null)
```

**Routing Logic:**
```
System evaluates branches in Display Order:
1. Check Display Order 1 → If match, use this branch
2. Check Display Order 2 → If match, use this branch
3. Check Display Order 3 (DEFAULT) → Always matches
```

---

### Issue 10: Changes Not Reflecting

**Symptoms:**
- Modified branch/approver but workflow still uses old configuration

**Diagnosis:**
- Cache issue or workflow already initiated

**Resolution:**
```
1. Refresh browser (Ctrl+F5)
2. Clear cache
3. Re-login
4. Verify changes in database:

SELECT * FROM workflow_branch_master WHERE branch_id = X;
SELECT * FROM approver_master WHERE branch_id = X;

5. For in-progress workflows:
   - Changes only affect NEW workflows
   - Old workflows use configuration from initiation time
```

---

## 📊 Quick Reference

### Workflow IDs
```
1 → Indent Approval Workflow
2 → Tender Approver Workflow
3 → Tender Evaluator Workflow
4 → Purchase Order Workflow
5 → Contingency Purchase Workflow
```

### Condition Types
```
DEFAULT              → No conditions (fallback)
AMOUNT               → Amount-based routing
CATEGORY             → Computer/Non-Computer
LOCATION             → Bangalore/Non-Bangalore
PROJECT              → Under Project/Not
COMPOSITE            → Multiple conditions (AND logic)
AMOUNT_WITH_ROLE     → Amount + Department
AMOUNT_WITH_PROJECT  → Amount + Project context
BID_TYPE             → Open/Sealed/Double bid
INDENT_COUNT         → Item count based
COMMITTEE            → Committee-based routing
```

### Common Roles
```
Reporting Officer
Project Head
Finance Manager
Administrative Officer
Dean
Director
Purchase Head
CFO
CTO
IT Manager
Admin Manager
Tender Approver
Tender Evaluator
Store Purchase Officer
Account Officer
```

### Request Status Values
```
SUBMITTED            → Initial submission
IN_PROGRESS          → Workflow in progress
APPROVED             → All approvals done
REJECTED             → Rejected by approver
CHANGE_REQUESTED     → Sent back for modification
```

### Workflow Transition Status
```
Created              → Initial creation
In-progress          → Awaiting approval
Completed            → Approved
Rejected             → Request rejected
```

### Next Action Values
```
Pending              → Awaiting action
Completed            → Action taken
null                 → Final state (no more actions)
```

---

## 🎓 Training Checklist

### For New Admins

**Phase 1: Understanding (1-2 hours)**
- [ ] Read this complete guide
- [ ] Understand workflow → branch → approver hierarchy
- [ ] Review condition types
- [ ] Study database tables

**Phase 2: Observation (30 minutes)**
- [ ] Login to Admin Panel
- [ ] Navigate to Approval Workflow
- [ ] Explore existing workflows
- [ ] View branches and approvers
- [ ] Don't modify anything yet

**Phase 3: Practice (2-3 hours)**
- [ ] Create test workflow branch (e.g., TEST_BRANCH)
- [ ] Add test approvers
- [ ] Test with sample data
- [ ] Modify configurations
- [ ] Delete test data

**Phase 4: Real Configuration (As needed)**
- [ ] Configure actual workflows based on requirements
- [ ] Test thoroughly
- [ ] Document configurations
- [ ] Train end users

---

## 📞 Support

### Getting Help

**Documentation:**
- This guide (UI perspective)
- Backend documentation (Backend perspective)
- API documentation

**Contacts:**
- System Admin: admin@iia.example.com
- Technical Support: support@iia.example.com
- Developer Team: dev@iia.example.com

---

## 📄 Document Version

**Version:** 1.0
**Last Updated:** 2025-01-04
**Author:** System Documentation Team
**Frontend Project:** IIA Frontend-test
**Backend Integration:** IIA Backend Production

---

## ✅ Summary

This guide provides complete UI-focused documentation for the Admin Panel Approval Workflow system. Anyone new to the project can:

1. ✅ Understand the complete approval workflow architecture
2. ✅ Navigate the Admin Panel UI
3. ✅ Configure workflows, branches, and approvers
4. ✅ Understand condition types and routing logic
5. ✅ Test configured workflows
6. ✅ Troubleshoot common issues
7. ✅ Access database tables and API endpoints
8. ✅ Train new team members

**Key Takeaways:**

- **3-Tier System:** Workflows → Branches (Conditions) → Approvers (Hierarchy)
- **Flexible Routing:** 11 condition types for complex routing logic
- **Complete CRUD:** Create, Read, Update, Delete all configurations
- **Real-time Testing:** Test workflows immediately after configuration
- **Database Integration:** Full visibility into data structure
- **API Documentation:** All endpoints documented with examples

**Next Steps:**
- Share this guide with team members
- Configure actual workflows based on business requirements
- Test thoroughly before production deployment
- Train end users on the approval process

---

**END OF DOCUMENT**
