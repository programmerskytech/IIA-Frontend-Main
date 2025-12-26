# LOV Remaining Integrations - Detailed Implementation Guide

## ✅ COMPLETED INTEGRATIONS

### 1. IndentCreation.jsx ([src/pages/dashboard/indentCreation/Indent1.jsx](src/pages/dashboard/indentCreation/Indent1.jsx:169))
**Status**: ✅ Complete
**Form ID**: 3
**Fields Updated**:
- `consigneeLocation` - Consignee Location dropdown

**Code Added**:
```javascript
// Import added at line 17
import { useLOVValues } from '../../../hooks/usLOVValues';

// Hook added at line 169
const { lovValues: consigneeLocationLOV, loading: loadingLocations } = useLOVValues(3, 'consigneeLocation');

// LOV mapping with fallback at line 172
const locationDropdown = consigneeLocationLOV.length > 0
    ? consigneeLocationLOV.map((item) => ({
        label: item.lovDisplayValue,
        value: item.lovValue
      }))
    : locationMaster.map((item) => ({
        label: item.locationName,
        value: item.locationCode
      }))
```

---

### 2. EmployeeRegistration.jsx ([src/pages/dashboard/admin/EmployeeRegistration.jsx](src/pages/dashboard/admin/EmployeeRegistration.jsx:17))
**Status**: ✅ Complete
**Form ID**: 4
**Fields Updated**:
- `department` - Department dropdown
- `designation` - Job Title dropdown
- `location` - Office Location dropdown

**Code Added**:
```javascript
// Import added at line 6
import { useLOVValues } from '../../../hooks/useLOVValues';

// Hooks added at lines 17-19
const { lovValues: departmentLOV, loading: loadingDepartments } = useLOVValues(4, 'department');
const { lovValues: designationLOV, loading: loadingDesignations } = useLOVValues(4, 'designation');
const { lovValues: locationLOV, loading: loadingLocations } = useLOVValues(4, 'location');

// All three Select components updated to use LOV values
```

---

### 3. ContingencyPurchase.jsx ([src/pages/dashboard/contingencyPurchase/ContingencyPurchase.jsx](src/pages/dashboard/contingencyPurchase/ContingencyPurchase.jsx:45))
**Status**: ✅ Complete
**Form ID**: 2
**Fields Updated** (6 fields):
- `gstPercentage` - GST Percentage dropdown
- `paymentTo` - Payment To dropdown
- `budgetCode` - Budget Code dropdown
- `materialCategory` - Material Category dropdown
- `materialSubCategory` - Material Subcategory dropdown
- `countryOfOrigin` - Country of Origin dropdown

**Files Modified**:
1. `ContingencyPurchase.jsx` - Added LOV hooks and passed to InputFields
2. `InputFields.js` - Updated to accept lovData parameter and use LOV for 6 fields

**Code Added in ContingencyPurchase.jsx**:
```javascript
// Import added at line 13
import { useLOVValues } from '../../../hooks/useLOVValues';

// Hooks added at lines 45-50
const { lovValues: gstPercentageLOV, loading: loadingGst } = useLOVValues(2, 'gstPercentage');
const { lovValues: paymentToLOV, loading: loadingPaymentTo } = useLOVValues(2, 'paymentTo');
const { lovValues: budgetCodeLOV, loading: loadingBudgetCode } = useLOVValues(2, 'budgetCode');
const { lovValues: materialCategoryLOV, loading: loadingMaterialCategory } = useLOVValues(2, 'materialCategory');
const { lovValues: materialSubCategoryLOV, loading: loadingMaterialSubCategory } = useLOVValues(2, 'materialSubCategory');
const { lovValues: countryOfOriginLOV, loading: loadingCountryOfOrigin } = useLOVValues(2, 'countryOfOrigin');

// LOV data passed to CpDetails at line 478
const lovData = {
  gstPercentageLOV,
  paymentToLOV,
  budgetCodeLOV,
  materialCategoryLOV,
  materialSubCategoryLOV,
  countryOfOriginLOV
};

return CpDetails(formData, lovData).map(section => {
```

**Code Added in InputFields.js**:
```javascript
// Function signature updated to accept lovData
export const CpDetails =(formData = {}, lovData = {}) => [

// All 6 fields updated with LOV fallback pattern
```

---

## ⏳ PENDING INTEGRATIONS

### 4. MaterialForm.jsx ([src/pages/masters/MaterialForm.jsx](src/pages/masters/MaterialForm.jsx))
**Status**: ⏳ Pending
**Form ID**: 6
**Fields to Update** (4 fields):
- `category` - Material Category
- `subcategory` - Material Subcategory
- `uom` - Unit of Measurement
- `currency` - Currency

**Current State**:
- Uses hardcoded arrays: `materialCategories`, `materialSubcategories`, `uomOptions`
- Fetches from API: `/api/material-master-util`

**Implementation Steps**:

1. Add import:
```javascript
import { useLOVValues } from '../../hooks/useLOVValues';
```

2. Add hooks after state declarations (around line 50):
```javascript
// ✅ Fetch dropdown values from LOV system (Form ID: 6 - MaterialMaster)
const { lovValues: categoryLOV, loading: loadingCategory } = useLOVValues(6, 'category');
const { lovValues: subcategoryLOV, loading: loadingSubcategory } = useLOVValues(6, 'subcategory');
const { lovValues: uomLOV, loading: loadingUom } = useLOVValues(6, 'uom');
const { lovValues: currencyLOV, loading: loadingCurrency } = useLOVValues(6, 'currency');
```

3. Find the Select components for these fields and update them:
```javascript
// Category Select
<Select
  placeholder="Select category"
  loading={loadingCategory}
>
  {(categoryLOV.length > 0 ? categoryLOV : materialCategories).map((item) => (
    <Option
      key={item.lovId || item}
      value={item.lovValue || item}
    >
      {item.lovDisplayValue || item}
    </Option>
  ))}
</Select>

// Subcategory Select
<Select
  placeholder="Select subcategory"
  loading={loadingSubcategory}
>
  {(subcategoryLOV.length > 0 ? subcategoryLOV : materialSubcategories).map((item) => (
    <Option
      key={item.lovId || item}
      value={item.lovValue || item}
    >
      {item.lovDisplayValue || item}
    </Option>
  ))}
</Select>

// UOM Select
<Select
  placeholder="Select UOM"
  loading={loadingUom}
>
  {(uomLOV.length > 0 ? uomLOV : uomOptions).map((item) => (
    <Option
      key={item.lovId || item.value}
      value={item.lovValue || item.value}
    >
      {item.lovDisplayValue || item.label}
    </Option>
  ))}
</Select>

// Currency Select
<Select
  placeholder="Select currency"
  loading={loadingCurrency}
>
  {(currencyLOV.length > 0 ? currencyLOV : [{label: 'INR', value: 'INR'}, {label: 'USD', value: 'USD'}]).map((item) => (
    <Option
      key={item.lovId || item.value}
      value={item.lovValue || item.value}
    >
      {item.lovDisplayValue || item.label}
    </Option>
  ))}
</Select>
```

---

### 5. JobForm.jsx ([src/pages/masters/JobForm.jsx](src/pages/masters/JobForm.jsx))
**Status**: ⏳ Pending
**Form ID**: 5
**Fields to Update** (4 fields):
- `jobCategory` - Job Category
- `jobSubcategory` - Job Subcategory
- `uom` - Unit of Measurement
- `currency` - Currency

**Current State**:
- Uses: `jobCategories`, `jobSubcategories`, `uomOptions`
- Fetches from API: `/api/job-master`

**Implementation Steps**:

1. Add import:
```javascript
import { useLOVValues } from '../../hooks/useLOVValues';
```

2. Add hooks after state declarations (around line 40):
```javascript
// ✅ Fetch dropdown values from LOV system (Form ID: 5 - JobMaster)
const { lovValues: jobCategoryLOV, loading: loadingJobCategory } = useLOVValues(5, 'jobCategory');
const { lovValues: jobSubcategoryLOV, loading: loadingJobSubcategory } = useLOVValues(5, 'jobSubcategory');
const { lovValues: uomLOV, loading: loadingUom } = useLOVValues(5, 'uom');
const { lovValues: currencyLOV, loading: loadingCurrency } = useLOVValues(5, 'currency');
```

3. Update Select components:
```javascript
// Job Category Select
<Select
  placeholder="Select job category"
  loading={loadingJobCategory}
>
  {(jobCategoryLOV.length > 0 ? jobCategoryLOV : jobCategories).map((item) => (
    <Option
      key={item.lovId || item}
      value={item.lovValue || item}
    >
      {item.lovDisplayValue || item}
    </Option>
  ))}
</Select>

// Job Subcategory Select
<Select
  placeholder="Select job subcategory"
  loading={loadingJobSubcategory}
>
  {(jobSubcategoryLOV.length > 0 ? jobSubcategoryLOV : jobSubcategories).map((item) => (
    <Option
      key={item.lovId || item}
      value={item.lovValue || item}
    >
      {item.lovDisplayValue || item}
    </Option>
  ))}
</Select>

// UOM Select (same as MaterialForm)
<Select
  placeholder="Select UOM"
  loading={loadingUom}
>
  {(uomLOV.length > 0 ? uomLOV : uomOptions).map((item) => (
    <Option
      key={item.lovId || item.value}
      value={item.lovValue || item.value}
    >
      {item.lovDisplayValue || item.label}
    </Option>
  ))}
</Select>

// Currency Select (same as MaterialForm)
<Select
  placeholder="Select currency"
  loading={loadingCurrency}
>
  {(currencyLOV.length > 0 ? currencyLOV : [{label: 'INR', value: 'INR'}, {label: 'USD', value: 'USD'}]).map((item) => (
    <Option
      key={item.lovId || item.value}
      value={item.lovValue || item.value}
    >
      {item.lovDisplayValue || item.label}
    </Option>
  ))}
</Select>
```

---

### 6. VendorMaster.jsx ([src/pages/masters/VendorMaster.jsx](src/pages/masters/VendorMaster.jsx))
**Status**: ⏳ Pending
**Form ID**: 7
**Fields to Update** (1 field):
- `primaryBusiness` - Primary Business dropdown

**Implementation Steps**:

1. Add import:
```javascript
import { useLOVValues } from '../../hooks/useLOVValues';
```

2. Add hook:
```javascript
// ✅ Fetch dropdown values from LOV system (Form ID: 7 - VendorMaster)
const { lovValues: primaryBusinessLOV, loading: loadingPrimaryBusiness } = useLOVValues(7, 'primaryBusiness');
```

3. Update the primaryBusiness Select component:
```javascript
<Select
  placeholder="Select primary business"
  loading={loadingPrimaryBusiness}
>
  {primaryBusinessLOV.map((business) => (
    <Option key={business.lovId} value={business.lovValue}>
      {business.lovDisplayValue}
    </Option>
  ))}
</Select>
```

---

### 7. Asset.jsx ([src/pages/dashboard/asset/Asset.jsx](src/pages/dashboard/asset/Asset.jsx))
**Status**: ⏳ Pending - FILE NEEDS TO BE LOCATED
**Form ID**: 1 (AssetMaster)
**Fields to Update** (1 field):
- `locator` - Asset Locator dropdown

**Implementation Steps**:

1. Add import:
```javascript
import { useLOVValues } from '../../../hooks/useLOVValues';
```

2. Add hook:
```javascript
// ✅ Fetch dropdown values from LOV system (Form ID: 1 - AssetMaster)
const { lovValues: locatorLOV, loading: loadingLocator } = useLOVValues(1, 'locator');
```

3. Update the locator Select component:
```javascript
<Select
  placeholder="Select locator"
  loading={loadingLocator}
>
  {locatorLOV.map((loc) => (
    <Option key={loc.lovId} value={loc.lovValue}>
      {loc.lovDisplayValue}
    </Option>
  ))}
</Select>
```

---

### 8. Purchase Order (FILE NOT FOUND)
**Status**: ⏳ Pending - FILE NEEDS TO BE LOCATED
**Form ID**: 8
**Possible file locations**:
- `src/pages/purchaseOrder/*.jsx`
- `src/pages/dashboard/purchaseOrder/*.jsx`
- `src/pages/procurement/*.jsx`

**Fields to Update** (3 fields):
- `deliveryPeriod` - Delivery Period
- `warranty` - Warranty
- `applicablePbgToBeSubmitted` - Applicable PBG to be Submitted

**Implementation Template** (Once file is found):

```javascript
// 1. Add import
import { useLOVValues } from '../../../hooks/useLOVValues'; // Adjust path as needed

// 2. Add hooks
const { lovValues: deliveryPeriodLOV, loading: loadingDeliveryPeriod } = useLOVValues(8, 'deliveryPeriod');
const { lovValues: warrantyLOV, loading: loadingWarranty } = useLOVValues(8, 'warranty');
const { lovValues: pbgLOV, loading: loadingPbg } = useLOVValues(8, 'applicablePbgToBeSubmitted');

// 3. Update Select components
// Delivery Period
<Select placeholder="Select delivery period" loading={loadingDeliveryPeriod}>
  {deliveryPeriodLOV.map((period) => (
    <Option key={period.lovId} value={period.lovValue}>
      {period.lovDisplayValue}
    </Option>
  ))}
</Select>

// Warranty
<Select placeholder="Select warranty" loading={loadingWarranty}>
  {warrantyLOV.map((war) => (
    <Option key={war.lovId} value={war.lovValue}>
      {war.lovDisplayValue}
    </Option>
  ))}
</Select>

// Applicable PBG
<Select placeholder="Select applicable PBG" loading={loadingPbg}>
  {pbgLOV.map((pbg) => (
    <Option key={pbg.lovId} value={pbg.lovValue}>
      {pbg.lovDisplayValue}
    </Option>
  ))}
</Select>
```

---

### 9. Tender Request ([src/pages/dashboard/tenderRequest/Tender.jsx](src/pages/dashboard/tenderRequest/Tender.jsx))
**Status**: ⏳ Pending
**Form ID**: 9
**Fields to Update** (2 fields):
- `incoTerms` - Inco Terms
- `paymentTerms` - Payment Terms

**Implementation Steps**:

1. Add import:
```javascript
import { useLOVValues } from '../../../hooks/useLOVValues';
```

2. Add hooks:
```javascript
// ✅ Fetch dropdown values from LOV system (Form ID: 9 - TenderRequest)
const { lovValues: incoTermsLOV, loading: loadingIncoTerms } = useLOVValues(9, 'incoTerms');
const { lovValues: paymentTermsLOV, loading: loadingPaymentTerms } = useLOVValues(9, 'paymentTerms');
```

3. Update Select components:
```javascript
// Inco Terms
<Select placeholder="Select inco terms" loading={loadingIncoTerms}>
  {incoTermsLOV.map((term) => (
    <Option key={term.lovId} value={term.lovValue}>
      {term.lovDisplayValue}
    </Option>
  ))}
</Select>

// Payment Terms
<Select placeholder="Select payment terms" loading={loadingPaymentTerms}>
  {paymentTermsLOV.map((term) => (
    <Option key={term.lovId} value={term.lovValue}>
      {term.lovDisplayValue}
    </Option>
  ))}
</Select>
```

---

## IMPLEMENTATION CHECKLIST

### For Each File:
- [ ] Locate the file
- [ ] Add `import { useLOVValues } from '../../hooks/useLOVValues';` (adjust path)
- [ ] Add LOV hook calls for each field
- [ ] Find existing Select components
- [ ] Update each Select with LOV values and loading state
- [ ] Add fallback to existing hardcoded values
- [ ] Test dropdown functionality
- [ ] Verify values display correctly

---

## SUMMARY TABLE

| Form | File | Form ID | Fields | Status |
|------|------|---------|--------|--------|
| Indent Creation | Indent1.jsx | 3 | 1 (consigneeLocation) | ✅ Complete |
| Employee Registration | EmployeeRegistration.jsx | 4 | 3 (department, designation, location) | ✅ Complete |
| Contingency Purchase | ContingencyPurchase.jsx + InputFields.js | 2 | 6 (gstPercentage, paymentTo, budgetCode, materialCategory, materialSubCategory, countryOfOrigin) | ✅ Complete |
| Material Master | MaterialForm.jsx | 6 | 4 (category, subcategory, uom, currency) | ⏳ Pending |
| Job Master | JobForm.jsx | 5 | 4 (jobCategory, jobSubcategory, uom, currency) | ⏳ Pending |
| Vendor Master | VendorMaster.jsx | 7 | 1 (primaryBusiness) | ⏳ Pending |
| Asset Master | Asset.jsx (?) | 1 | 1 (locator) | ⏳ Pending (File location unclear) |
| Purchase Order | ??? | 8 | 3 (deliveryPeriod, warranty, applicablePbgToBeSubmitted) | ⏳ Pending (File not found) |
| Tender Request | Tender.jsx | 9 | 2 (incoTerms, paymentTerms) | ⏳ Pending |

**Progress**: 3/9 forms complete (33%), 10/25 fields complete (40%)

---

## NEXT STEPS

1. Complete MaterialForm.jsx and JobForm.jsx integrations
2. Complete VendorMaster.jsx integration
3. Locate Asset Master file and complete integration
4. Locate Purchase Order file and complete integration
5. Complete Tender Request integration
6. Test all LOV integrations end-to-end
7. Seed initial LOV data in backend database
8. Document any issues or special cases encountered

---

## SUPPORT

For assistance with LOV integrations:
- Main Guide: [LOV_INTEGRATION_GUIDE.md](LOV_INTEGRATION_GUIDE.md)
- Implementation Status: [LOV_IMPLEMENTATION_STATUS.md](LOV_IMPLEMENTATION_STATUS.md)
- Hook Documentation: [src/hooks/useLOVValues.js](src/hooks/useLOVValues.js)
- Admin Panel: [src/pages/dashboard/admin/ListOfValues.jsx](src/pages/dashboard/admin/ListOfValues.jsx)
