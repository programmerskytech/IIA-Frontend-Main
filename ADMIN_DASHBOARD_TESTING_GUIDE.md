# Admin Dashboard Testing Guide

## Problem
The Admin Dashboard shows:
- Total Budget Allocated: **0.00** (should show actual budget total)
- Total LOV Entries: **0** (should show actual LOV count)

## Root Cause
1. **Backend needs to be restarted** to load the new LOV count endpoint
2. **Database might be empty** - no LOV or Budget data exists yet
3. **API errors are being silently caught** - we need to check console logs

---

## Step 1: Check Browser Console

1. Open Admin Dashboard in your browser
2. Open **Developer Tools** (F12)
3. Go to the **Console** tab
4. Look for these log messages:

```
=== API Responses ===
Budget Response: { ... }
LOV Response: { ... }
Parsed Budget: 0
Parsed LOVs: 0
```

### If you see API errors:
```
Budget Summary API Error: ...
LOV Count API Error: ...
```

**This means:**
- The backend server might not be running
- The new LOV count endpoint isn't deployed yet
- There's a network/CORS issue

---

## Step 2: Restart Backend Server

The backend code has been updated with the new LOV count endpoint. You MUST restart your backend server:

```bash
# Navigate to backend directory
cd e:\Work 2.0\IIA\Backend-prod

# If using Maven
mvn spring-boot:run

# Or if running from IDE, stop and restart the application
```

**Wait for the server to fully start** (usually shows "Started Application in X seconds")

---

## Step 3: Test API Endpoints Manually

After restarting the backend, test these endpoints directly:

### Test LOV Count Endpoint
```bash
# Using curl (if you have it)
curl http://103.181.158.220:8081/astro-service/api/admin/lov/values/count

# Or open in browser:
http://103.181.158.220:8081/astro-service/api/admin/lov/values/count
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "totalCount": 100
  }
}
```

### Test Budget Summary Endpoint
```bash
# Using curl
curl http://103.181.158.220:8081/astro-service/api/admin/lov/budget/summary

# Or open in browser:
http://103.181.158.220:8081/astro-service/api/admin/budget/summary
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "totalAllocated": 5000000.00,
    "totalOnHold": 0,
    "totalSpent": 0,
    "totalRemaining": 5000000.00
  }
}
```

---

## Step 4: Check Database Data

### Check if LOV data exists:
```sql
-- Check total LOV count
SELECT COUNT(*) as total_lovs
FROM lov_master
WHERE is_active = true;

-- Check LOV data
SELECT * FROM lov_master LIMIT 10;
```

### Check if Budget data exists:
```sql
-- Check total budget allocated
SELECT SUM(allocated_amount) as total_allocated
FROM budget_master;

-- Check budget data
SELECT * FROM budget_master LIMIT 10;
```

**If these return 0 or no rows:**
- You need to create LOV values first (go to Admin Dashboard → List of Values)
- You need to create budgets (go to Admin Dashboard → Budget)

---

## Step 5: Create Test Data

### Create Test LOV Values:
1. Go to **Admin Dashboard** → **List of Values**
2. Select a form (e.g., "Budget")
3. Select a designator (e.g., "Status")
4. Click **"Add New"**
5. Fill in the form:
   - Code: `ACTIVE`
   - Name: `Active`
   - Display Order: `1`
   - Status: `Active`
6. Click **"Add Entry"**
7. Repeat for more values

### Create Test Budget:
1. Go to **Admin Dashboard** → **Budget**
2. Click **"Add New Budget"**
3. Fill in the form:
   - Budget Code: `BUD001`
   - Category: `Operations`
   - Allocated Amount: `100000`
   - Fiscal Year: `2025`
   - Status: `Active`
4. Click **"Add Budget"**

---

## Step 6: Refresh Dashboard

1. Go back to **Admin Dashboard**
2. Press **F5** to refresh the page
3. Check if the numbers updated:
   - **Total LOV Entries**: Should show the count of LOV values you created
   - **Total Budget Allocated**: Should show the sum of allocated budgets

---

## Troubleshooting

### Issue: "LOV Count API Error: Request failed with status code 404"

**Solution:**
- The backend server doesn't have the new endpoint yet
- Make sure you restarted the backend server
- Check if the LOVController.java file was saved properly
- Rebuild and redeploy the backend

### Issue: "Budget Summary API Error: Request failed with status code 500"

**Solution:**
- Check backend server logs for Java exceptions
- Verify the budget_master table exists in the database
- Check if there are any database connection issues

### Issue: Both endpoints work but show 0

**Solution:**
- The database is empty
- Create test data using the Admin Panel (see Step 5)
- Check if data is being saved to the correct database

### Issue: "CORS error" or "Network error"

**Solution:**
- Backend server might not be running
- Check if proxy is configured correctly in package.json (should be `http://103.181.158.220:8081`)
- Check firewall settings

---

## Expected Console Output (After Fix)

When everything is working, you should see:

```
=== API Responses ===
Budget Response: {
  status: 'success',
  data: {
    totalAllocated: 5000000,
    totalOnHold: 0,
    totalSpent: 0,
    totalRemaining: 5000000
  }
}
LOV Response: {
  status: 'success',
  data: {
    totalCount: 152
  }
}
Parsed Budget: 5000000
Parsed LOVs: 152
```

---

## Files Modified

### Backend:
1. ✅ `LOVController.java` - Added `/values/count` endpoint
2. ✅ `LOVService.java` - Added service method
3. ✅ `LOVServiceImpl.java` - Implemented count logic with caching
4. ✅ `LOVMasterRepository.java` - Added count query
5. ✅ `CacheConfig.java` - Added cache configuration

### Frontend:
6. ✅ `AdminDashboard.jsx` - Added API calls and improved error handling

---

## Quick Checklist

- [ ] Backend server is running
- [ ] Backend server was restarted after code changes
- [ ] LOV count endpoint returns data: `/api/admin/lov/values/count`
- [ ] Budget summary endpoint returns data: `/api/admin/budget/summary`
- [ ] Database has LOV data
- [ ] Database has Budget data
- [ ] Browser console shows no API errors
- [ ] Dashboard displays correct numbers

---

## Need More Help?

1. **Share the browser console output** - Copy the "=== API Responses ===" section
2. **Share backend server logs** - Any errors during startup or API calls
3. **Share database query results** - Results of the SQL queries above

---

**Last Updated:** 2025-12-26
