# Fix for "Unexpected token '<'" Error - Cooperative API

## 🔴 Problem
Error: `Unexpected token '<', "<!doctype "... is not valid JSON`

This happens when the frontend requests cooperatives data from the API but receives HTML instead of JSON (typically a 404 page).

## 🎯 Root Cause Analysis

### Issue 1: Inconsistent API Path Construction
The `apiFetch` utility was treating production and development differently:
- **Local Dev**: `VITE_API_BASE` is empty → uses `/api` prefix
- **Production**: `VITE_API_BASE` = `https://greenco-op-backend.onrender.com` 
- **Call**: `apiFetch("/user/public/cooperatives")`
- **Result URL**: `https://greenco-op-backend.onrender.com/user/public/cooperatives` ❌ (missing `/api`)

### Issue 2: Mixed Usage Patterns
Different files were using different patterns:
- HomePage.jsx: `apiFetch("/user/public/cooperatives")` ❌ (missing `/api`)
- LoginPage.jsx: `apiFetch("/auth/login")` ❌ (missing `/api`)
- RegisterPage.jsx: Direct `fetch()` with manual base URL construction

## ✅ Solution

### Step 1: Update `apiFetch` Utility Logic
**File**: `frontend/src/utils/api.js`

```javascript
export default async function apiFetch(path, opts = {}) {
  const base = import.meta.env.VITE_API_BASE || "";
  // If no base URL (local dev), use /api prefix
  // If base URL exists (production), it should be the backend domain without /api
  const url = base ? `${base}${path}` : `/api${path.startsWith("/") ? path : "/" + path}`;
  // ... rest of the code
}
```

**Logic**:
- **Production** (`VITE_API_BASE` = `https://greenco-op-backend.onrender.com`): 
  - `apiFetch("/api/user/public/cooperatives")` → `https://greenco-op-backend.onrender.com/api/user/public/cooperatives` ✅
- **Local Dev** (`VITE_API_BASE` is empty): 
  - `apiFetch("/api/user/public/cooperatives")` → `/api/api/user/public/cooperatives` ❌ (double `/api`)
  
Wait... this needs another fix!

### Step 2: **CORRECT Solution** - Always Use `/api` in Paths

**Rule**: ALL `apiFetch()` calls must include `/api` prefix in the path.

```javascript
// ✅ CORRECT
apiFetch("/api/user/public/cooperatives")
apiFetch("/api/auth/login")
apiFetch("/api/products")

// ❌ WRONG
apiFetch("/user/public/cooperatives")  
apiFetch("/auth/login")
```

**Updated `apiFetch` Logic**:
```javascript
export default async function apiFetch(path, opts = {}) {
  const base = import.meta.env.VITE_API_BASE || "";
  const url = base ? `${base}${path}` : path;
  // ... rest
}
```

**How it works**:
- **Production**: `VITE_API_BASE` = `https://greenco-op-backend.onrender.com`
  - `apiFetch("/api/users")` → `https://greenco-op-backend.onrender.com/api/users` ✅
- **Local Dev**: `VITE_API_BASE` is empty (or undefined)
  - `apiFetch("/api/users")` → `/api/users` ✅ (proxied by Vite to `http://localhost:5000/api/users`)

### Step 3: Update All API Calls

**Files to Update**:
1. ✅ `frontend/src/pages/public/HomePage.jsx` - Changed to `/api/user/public/cooperatives`
2. ✅ `frontend/src/pages/public/CooperativeProfile.jsx` - Changed to `/api/user/public/cooperatives/${id}`
3. ⏳ `frontend/src/pages/public/LoginPage.jsx` - Change to `/api/auth/login`
4. ⏳ `frontend/src/pages/public/RegisterPage.jsx` - Migrate to `apiFetch()`

## 🚀 Deployment Checklist

### Before Deploy:
- [x] Update `apiFetch` utility in `frontend/src/utils/api.js`
- [x] Update HomePage.jsx to use `/api` prefix
- [x] Update CooperativeProfile.jsx to use `/api` prefix
- [ ] Update LoginPage.jsx to use `/api` prefix (currently works, but for consistency)
- [ ] Convert RegisterPage.jsx to use `apiFetch()` instead of direct fetch
- [ ] Check all other files that use `fetch()` directly

### render.yaml Configuration:
```yaml
envVars:
  - key: VITE_API_BASE
    value: https://greenco-op-backend.onrender.com  # NO /api suffix!
```

### After Deploy:
1. Wait for Render to build and deploy (~10-15 min)
2. Check browser console for errors
3. Test cooperatives carousel on homepage
4. Verify API calls in Network tab:
   - Should see: `https://greenco-op-backend.onrender.com/api/user/public/cooperatives`
   - Status: `200 OK`
   - Response: JSON array of cooperatives

## 🧪 Testing URLs

### Backend Health:
```
https://greenco-op-backend.onrender.com/api/health
```

### Cooperatives API:
```
https://greenco-op-backend.onrender.com/api/user/public/cooperatives
```

### Frontend:
```
https://greenco-op-frontend.onrender.com
```

## 📝 Key Learnings

1. **Static Sites Don't Have Proxies**: Render static sites serve HTML/CSS/JS files only. No server-side proxying.

2. **Environment Variables Are Build-Time**: `VITE_API_BASE` is replaced during `npm run build`, not at runtime.

3. **Consistent Path Convention**: Always include `/api` in the path parameter when calling `apiFetch()`.

4. **Base URL Format**: `VITE_API_BASE` should be the domain WITHOUT `/api` suffix.

## 🔧 Future Improvements

1. **Centralize API Calls**: Create a service layer (e.g., `services/cooperativeService.js`) instead of calling `apiFetch` directly in components.

2. **TypeScript**: Add types for API responses to catch errors early.

3. **Error Boundary**: Add React Error Boundary to catch and display API errors gracefully.

4. **Retry Logic**: Add automatic retry for failed API calls.

5. **Caching**: Use React Query or SWR for data fetching and caching.
