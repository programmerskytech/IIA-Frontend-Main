# Quick Reference Guide - Indent Status Fields

## New Fields Available in Indent API Responses

```javascript
{
  // Edit Control
  isEditable: boolean,           // Can indent be edited?
  isLockedForTender: boolean,    // Locked after tender creation?
  lockedReason: string | null,   // Why is it locked?

  // Version Tracking
  version: number,               // Current version (starts at 1)
  parentIndentId: string | null, // Original indent ID if revised

  // Status Tracking
  currentStatus: string,         // Current status
  currentStage: string,          // Current workflow stage
  approvalLevel: number          // Current approval level (0 = not submitted)
}
```

---

## Status Values

| Status | Description |
|--------|-------------|
| `DRAFT` | Being created |
| `IN_APPROVAL` | In approval workflow |
| `APPROVED` | Fully approved |
| `CHANGE_REQUESTED` | Sent back for revision |
| `TENDER_CREATED` | Tender generated |
| `CANCELLED` | Cancelled |

---

## Stage Values

| Stage | Description |
|-------|-------------|
| `INDENT_CREATION` | Initial creation |
| `INDENT_REVISION` | Sent back for changes |
| `INDENT_APPROVAL_LEVEL_1` | At approval level 1 |
| `INDENT_APPROVAL_LEVEL_2` | At approval level 2 |
| `INDENT_APPROVED` | Fully approved |
| `TENDER_GENERATION` | Tender created |

---

## Components to Use

### 1. Status Badge
```jsx
import IndentStatusBadge from '../../components/IndentStatusBadge';

<IndentStatusBadge
  indent={indentData}
  showStage={true}
  showApprovalLevel={true}
/>
```

### 2. Workflow Tracker
```jsx
import WorkflowProgressTracker from '../../components/WorkflowProgressTracker';

<WorkflowProgressTracker indent={indentData} compact={false} />
```

---

## Edit Control Logic

```javascript
// Check if indent can be edited
const canEdit = indent.isEditable && !indent.isLockedForTender;

if (!canEdit) {
  if (indent.isLockedForTender) {
    message.error(indent.lockedReason || 'Locked - tender created');
  } else {
    message.error('Not editable - in approval workflow');
  }
  return;
}

// Proceed with edit...
```

---

## Display Patterns

### Version Display
```jsx
{indent.version > 1 && (
  <Alert
    message={`Version ${indent.version}`}
    description={`Revised ${indent.version - 1} time(s)`}
    type="info"
  />
)}
```

### Lock Indicator
```jsx
{indent.isLockedForTender && (
  <Alert
    message="Indent Locked"
    description={indent.lockedReason}
    type="warning"
  />
)}
```

### Editable Indicator
```jsx
{!indent.isEditable && (
  <Alert
    message="Not Editable"
    description="Currently in approval workflow"
    type="info"
  />
)}
```

---

## Table Column Examples

### Status Column
```javascript
{
  title: 'Current Status',
  dataIndex: 'currentStatus',
  key: 'currentStatus',
  render: (text, record) => (
    <IndentStatusBadge indent={record} />
  )
}
```

### Stage Column
```javascript
{
  title: 'Current Stage',
  dataIndex: 'currentStage',
  render: (text) => text ? text.replace(/_/g, ' ') : '-'
}
```

### Version Column
```javascript
{
  title: 'Version',
  dataIndex: 'version',
  width: 80,
  align: 'center',
  render: (text) => text ? <Tag color="blue">v{text}</Tag> : '-'
}
```

### Editable Column
```javascript
{
  title: 'Editable',
  dataIndex: 'isEditable',
  width: 90,
  align: 'center',
  render: (text) => text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>
}
```

### Locked Column
```javascript
{
  title: 'Locked',
  dataIndex: 'isLockedForTender',
  width: 90,
  align: 'center',
  render: (text) => text ? <Tag color="orange">Yes</Tag> : <Tag color="default">No</Tag>
}
```

---

## Error Handling

```javascript
try {
  await updateIndent(indentId, data);
  message.success("Updated successfully");
} catch (error) {
  if (error.response?.status === 400) {
    const msg = error.response?.data?.responseStatus?.message;

    if (msg?.includes("locked for editing")) {
      message.error("Cannot edit: Tender already created");
    } else if (msg?.includes("not editable")) {
      message.error("Cannot edit: In approval workflow");
    } else {
      message.error(msg || "Validation error");
    }
  }
}
```

---

## Color Codes

```javascript
const STATUS_COLORS = {
  'DRAFT': '#6B7280',           // Gray
  'IN_APPROVAL': '#3B82F6',     // Blue
  'APPROVED': '#10B981',        // Green
  'CHANGE_REQUESTED': '#F59E0B', // Orange
  'TENDER_CREATED': '#8B5CF6',  // Purple
  'CANCELLED': '#EF4444'        // Red
};
```

---

## Checklist for Adding Status to New Pages

- [ ] Import `IndentStatusBadge` component
- [ ] Add `currentStatus` column with badge renderer
- [ ] Add `currentStage` column with underscore replacement
- [ ] Add `version` column (optional, but recommended)
- [ ] Add `isEditable` column (if relevant)
- [ ] Add `isLockedForTender` column (if relevant)
- [ ] Test with different status values
- [ ] Verify filtering works on new columns

---

## Common Patterns

### Form Submission Validation
```javascript
const onFinish = async () => {
  // Validate edit permissions
  if (formData?.indentId) {
    if (formData.isLockedForTender) {
      message.error(formData.lockedReason || 'Locked');
      return;
    }
    if (!formData.isEditable) {
      message.error('Not editable');
      return;
    }
  }

  // Proceed with submission...
};
```

### Status Badge in List
```jsx
<List
  dataSource={indents}
  renderItem={indent => (
    <List.Item>
      <IndentStatusBadge indent={indent} />
      <span>{indent.indentId}</span>
      {indent.version > 1 && <Tag color="blue">v{indent.version}</Tag>}
    </List.Item>
  )}
/>
```

### Conditional Edit Button
```jsx
<Button
  type="primary"
  onClick={handleEdit}
  disabled={!indent.isEditable || indent.isLockedForTender}
  title={
    indent.isLockedForTender ? 'Locked - tender created' :
    !indent.isEditable ? 'Not editable - in approval' :
    'Edit indent'
  }
>
  Edit
</Button>
```

---

## FAQ

**Q: What if `currentStatus` is null/undefined?**
A: Show '-' or use old `status` field as fallback

**Q: How to check if indent can be edited?**
A: `indent.isEditable && !indent.isLockedForTender`

**Q: When does version increment?**
A: Automatically on each update by backend

**Q: Can a locked indent be unlocked?**
A: No, once tender is created, indent is permanently locked

**Q: What if backend hasn't migrated yet?**
A: All new fields have defaults, graceful degradation with '-'

---

## Testing Commands

```bash
# Test with different statuses
const testIndent = {
  currentStatus: 'DRAFT',           // Try all 6 statuses
  currentStage: 'INDENT_CREATION',  // Try all stages
  isEditable: true,                 // Try true/false
  isLockedForTender: false,         // Try true/false
  version: 1,                       // Try 1, 2, 3+
  approvalLevel: 0                  // Try 0, 1, 2+
};
```

---

## Performance Tips

- Badge component is lightweight, safe to use in large tables
- Use `compact` mode for workflow tracker in lists
- Consider memoization for large datasets
- Filter/search works on all new fields

---

**Quick Links:**
- [Full UI Changes Summary](./UI_CHANGES_SUMMARY.md)
- [Backend Changes Summary](./backend_changes_summary.md)
- [Database Migration Script](./database_migration_indent_bug_fixes.sql)
