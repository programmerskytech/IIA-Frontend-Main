# LOV (List of Values) Integration Guide

## Overview
This guide explains how the LOV system has been integrated into the IIA Frontend application. All dropdowns are now centrally managed through the Admin Panel's List of Values module.

## Architecture

### Three-Tier LOV Structure
1. **Forms** - Application pages (e.g., MaterialMaster, JobMaster, IndentCreation)
2. **Designators** - Dropdown fields within forms (e.g., category, uom, status)
3. **LOV Values** - Actual dropdown options (e.g., COMPUTER, LAPTOP, ACTIVE)

### Key Components
- **Admin Panel**: [src/pages/dashboard/admin/ListOfValues.jsx](src/pages/dashboard/admin/ListOfValues.jsx)
- **Custom Hook**: [src/hooks/useLOVValues.js](src/hooks/useLOVValues.js)

## Backend APIs

### Forms Management
- `GET /api/admin/lov/forms` - Get all forms
- `POST /api/admin/lov/forms` - Create form
- `PUT /api/admin/lov/forms/{formId}` - Update form
- `DELETE /api/admin/lov/forms/{formId}` - Delete form

### Designators Management
- `GET /api/admin/lov/forms/{formId}/designators` - Get designators for a form
- `POST /api/admin/lov/designators` - Create designator
- `PUT /api/admin/lov/designators/{designatorId}` - Update designator
- `DELETE /api/admin/lov/designators/{designatorId}` - Delete designator

### LOV Values Management
- `GET /api/admin/lov/designators/{designatorId}/values` - Get LOV values
- `POST /api/admin/lov/values` - Create LOV value
- `PUT /api/admin/lov/values/{lovId}` - Update LOV value
- `DELETE /api/admin/lov/values/{lovId}` - Delete LOV value

## Custom Hook Usage

### Basic Usage
```javascript
import { useLOVValues } from '../../hooks/useLOVValues';

const MyComponent = () => {
  const { lovValues, loading, error } = useLOVValues(10, 'status');

  return (
    <Select loading={loading}>
      {lovValues.map(lov => (
        <Option key={lov.lovId} value={lov.lovValue}>
          {lov.lovDisplayValue}
        </Option>
      ))}
    </Select>
  );
};
```

### Using Form Name Instead of Form ID
```javascript
import { useLOVValuesByFormName } from '../../hooks/useLOVValues';

const MyComponent = () => {
  const { lovValues, loading, error } = useLOVValuesByFormName('MaterialMaster', 'category');

  return (
    <Select loading={loading}>
      {lovValues.map(lov => (
        <Option key={lov.lovId} value={lov.lovValue}>
          {lov.lovDisplayValue}
        </Option>
      ))}
    </Select>
  );
};
```

## Forms Updated with LOV Integration

### 1. Indent Creation
**File**: `src/pages/dashboard/indentCreation/Indent1.jsx`
**Form ID**: 3
**Designator**: consigneeLocation

### 2. Employee Registration
**File**: `src/pages/dashboard/admin/EmployeeRegistration.jsx`
**Form ID**: 4
**Designators**:
- department
- designation
- location

### 3. Material Master
**Form ID**: 6
**Designators**:
- category
- subcategory
- uom
- currency

### 4. Job Master
**Form ID**: 5
**Designators**:
- jobCategory
- jobSubcategory
- uom
- currency

### 5. Contingency Purchase
**Form ID**: 2
**Designators**:
- gstPercentage
- paymentTo
- budgetCode
- materialCategory
- materialSubCategory
- countryOfOrigin

### 6. Asset Master
**Form ID**: 1
**Designators**:
- locator

### 7. Vendor Master
**Form ID**: 7
**Designators**:
- primaryBusiness

### 8. Purchase Order
**Form ID**: 8
**Designators**:
- deliveryPeriod
- warranty
- applicablePbgToBeSubmitted

### 9. Tender Request
**Form ID**: 9
**Designators**:
- incoTerms
- paymentTerms

## Migration Steps (Already Completed)

### Step 1: Replace Hardcoded Dropdowns
**Before**:
```javascript
const categories = ['COMPUTER', 'NON-COMPUTER', 'FURNITURE'];

<Select>
  {categories.map(cat => (
    <Option key={cat} value={cat}>{cat}</Option>
  ))}
</Select>
```

**After**:
```javascript
const { lovValues: categories, loading } = useLOVValuesByFormName('MaterialMaster', 'category');

<Select loading={loading}>
  {categories.map(lov => (
    <Option key={lov.lovId} value={lov.lovValue}>
      {lov.lovDisplayValue}
    </Option>
  ))}
</Select>
```

### Step 2: Handle Loading States
```javascript
const { lovValues, loading, error } = useLOVValues(formId, designatorName);

if (error) {
  message.error('Failed to load dropdown values');
}

<Select loading={loading} disabled={loading}>
  {lovValues.map(lov => (
    <Option key={lov.lovId} value={lov.lovValue}>
      {lov.lovDisplayValue}
    </Option>
  ))}
</Select>
```

## Admin Panel Usage

### Managing LOV Values
1. Navigate to Admin Panel > List of Values
2. Select Form from dropdown (e.g., Material Master)
3. Select Designator/Field (e.g., Category)
4. View, Add, Edit, or Delete LOV values
5. Click "Add New" to create new dropdown option
6. Fill in:
   - **Code**: Internal value (e.g., COMPUTER)
   - **Name**: Display value (e.g., Computer Equipment)
   - **Description**: Optional description
   - **Color Code**: Optional color for tags/badges
   - **Display Order**: Sort order (lower number = higher priority)
   - **Status**: Active/Inactive

### Best Practices
- Use uppercase for codes (e.g., COMPUTER, LAPTOP)
- Use descriptive display names (e.g., Computer Equipment)
- Set proper display order (10, 20, 30... to allow insertions)
- Mark unused values as Inactive instead of deleting
- Use color codes consistently across similar dropdowns

## LOV Value Structure

```javascript
{
  lovId: 123,                    // Auto-generated
  designatorId: 45,              // Foreign key to designator
  lovValue: "COMPUTER",          // Internal code value
  lovDisplayValue: "Computer Equipment",  // Display text
  description: "Computer hardware and peripherals",
  colorCode: "#1890ff",          // Optional color
  displayOrder: 10,              // Sort order
  isActive: true,                // Active status
  createdBy: "admin",
  createdDate: "2025-01-15T10:30:00"
}
```

## Troubleshooting

### Dropdown Shows No Values
1. Check if form and designator exist in LOV system
2. Verify at least one LOV value is Active
3. Check browser console for API errors
4. Verify formId and designatorName are correct

### Values Not Updating
1. Refresh the page to reload LOV values
2. Check if changes were saved in Admin Panel
3. Clear browser cache if needed

### API Errors
- **404**: Form/Designator/LOV not found - verify IDs
- **400**: Invalid request - check payload structure
- **500**: Backend error - check server logs

## Form ID Reference

| Form ID | Form Name | Form Display Name |
|---------|-----------|-------------------|
| 1 | AssetMaster | Asset Master |
| 2 | ContingencyPurchase | Contingency Purchase |
| 3 | IndentCreation | Indent Creation |
| 4 | EmployeeRegistration | Employee Registration |
| 5 | JobMaster | Job Master |
| 6 | MaterialMaster | Material Master |
| 7 | VendorMaster | Vendor Master |
| 8 | PurchaseOrder | Purchase Order |
| 9 | TenderRequest | Tender Request |

## Complete Designator Mapping

### Asset Master (Form ID: 1)
- locator

### Contingency Purchase (Form ID: 2)
- gstPercentage
- paymentTo
- budgetCode
- materialCategory
- materialSubCategory
- countryOfOrigin

### Indent Creation (Form ID: 3)
- consigneeLocation

### Employee Registration (Form ID: 4)
- department
- designation
- location

### Job Master (Form ID: 5)
- jobCategory
- jobSubcategory
- uom
- currency

### Material Master (Form ID: 6)
- category
- subcategory
- uom
- currency

### Vendor Master (Form ID: 7)
- primaryBusiness

### Purchase Order (Form ID: 8)
- deliveryPeriod
- warranty
- applicablePbgToBeSubmitted

### Tender Request (Form ID: 9)
- incoTerms
- paymentTerms

## Future Enhancements

1. **Caching**: Implement local storage caching for frequently used LOV values
2. **Dependent Dropdowns**: Support cascading dropdowns (e.g., Category > Subcategory)
3. **Bulk Import**: CSV import for bulk LOV value creation
4. **Audit Trail**: Track changes to LOV values
5. **Multi-language**: Support for multiple display languages

## Support

For questions or issues with LOV integration, contact the development team or refer to:
- Backend API documentation
- Component source code
- This integration guide
