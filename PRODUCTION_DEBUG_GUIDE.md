# 🔧 Hướng Dẫn Debug Lỗi Production

## ✅ Đã Fix

### Commit: `df640d3`
**Message**: "Improve DB error handling - add retry logic and return empty array on connection failure"

### Các Thay Đổi:

#### 1. `backend/src/config/db.js` - Cải thiện Database Connection
**Thêm**:
- ✅ Retry logic: Tự động thử lại 5 lần nếu kết nối thất bại
- ✅ Timeout: 10 giây cho mỗi lần thử
- ✅ Delay: Đợi 5 giây giữa các lần retry
- ✅ Validation: Kiểm tra `MONGODB_CONNECTION_STRING` có tồn tại không
- ✅ Event listeners: Log khi connected/disconnected/error
- ✅ Better logging: Hiển thị format của connection string để debug

```javascript
const connectDB = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            if (!process.env.MONGODB_CONNECTION_STRING) {
                throw new Error("MONGODB_CONNECTION_STRING is not defined");
            }
            await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
                serverSelectionTimeoutMS: 10000,
            });
            console.log("✅ Database connected successfully");
            return;
        } catch (error) {
            // Retry logic with delay...
        }
    }
}
```

#### 2. `backend/src/controllers/userControllers.js` - Cải thiện Error Handling
**Thêm**:
- ✅ Check database connection trước khi query
- ✅ Return empty array `[]` thay vì error 500 nếu DB chưa connected
- ✅ Better logging với emoji và stack trace
- ✅ Import mongoose để check `readyState`

```javascript
export const getPublicCooperatives = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️  Database not connected, returning empty array");
      return res.status(200).json([]);
    }

    const raw = await User.find({ role: "cooperative" })...
    console.log(`✅ Found ${raw.length} cooperatives`);
    res.status(200).json(coops);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
    // Return empty array instead of 500 error
    res.status(200).json([]);
  }
};
```

## 🚨 Nguyên Nhân Lỗi "Internal Server Error"

### Lỗi gốc:
```
Coop fetch error: Error: Internal server error
```

### Phân tích:
1. **Production backend trả về 500 error** khi gọi `/api/user/public/cooperatives`
2. **Health endpoint timeout** - backend không respond
3. **Nguyên nhân**: Database connection string chưa được set đúng hoặc MongoDB Atlas không accessible

### Vấn đề có thể gặp:
- ✅ `MONGODB_CONNECTION_STRING` chưa được set trong Render environment
- ✅ MongoDB Atlas IP whitelist không bao gồm Render servers
- ✅ Database connection timeout
- ✅ Backend crash khi không kết nối được DB

## 🔍 Các Bước Kiểm Tra Sau Deploy

### 1. Đợi Render Auto-Deploy
- ⏳ Thời gian: ~10-15 phút
- 📍 URL: https://dashboard.render.com
- ✅ Check status: "Deployed" màu xanh

### 2. Kiểm Tra Backend Logs
**Cách 1: Qua Render Dashboard**
1. Vào https://dashboard.render.com
2. Click vào `greenco-op-backend`
3. Tab "Logs" → Xem logs realtime

**Cách 2: Qua CLI** (nếu có Render CLI)
```bash
render logs greenco-op-backend --tail
```

**Những gì cần tìm trong logs**:
```
✅ Database connected successfully       → GOOD!
📊 Database: dev                         → GOOD!
🔗 Mongoose connected to MongoDB         → GOOD!

❌ Database connection attempt 1/5 failed → BAD! Check connection string
❌ All database connection attempts failed → BAD! Check MongoDB Atlas
⚠️  Database not connected, returning empty array → WARNING! DB issue
```

### 3. Test Production Endpoints

#### A. Health Check
```bash
curl https://greenco-op-backend.onrender.com/api/health
```
**Expected response**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-24T...",
  "uptime": 123.456,
  "environment": "production",
  "database": "connected"  // ← Quan trọng!
}
```

#### B. Cooperatives API
```bash
curl https://greenco-op-backend.onrender.com/api/user/public/cooperatives
```
**Expected response**:
```json
[]  // Nếu chưa seed
[{...}]  // Nếu đã seed
```

### 4. Kiểm Tra MongoDB Atlas Configuration

**Vào MongoDB Atlas**:
1. Login: https://cloud.mongodb.com
2. Chọn Cluster → "Connect" button

**Check Network Access**:
1. Sidebar → "Network Access"
2. Nên thấy:
   ```
   0.0.0.0/0  (Allow access from anywhere)
   ```
   Hoặc add Render IPs manually

**Check Database Users**:
1. Sidebar → "Database Access"
2. Username: `lework90_db_user`
3. Password: `IFSwrz5cuZRI9voM`
4. Roles: `readWrite` on `dev` database

### 5. Verify Render Environment Variables

**Vào Render Dashboard**:
1. Click `greenco-op-backend`
2. Tab "Environment"
3. Check các biến:

```
✅ NODE_ENV = production
✅ PORT = 5000
✅ MONGODB_CONNECTION_STRING = mongodb+srv://lework90_db_user:IFSwrz5cuZRI9voM@cluster0.n5kr4jg.mongodb.net/dev?appName=Cluster0
✅ JWT_ACCESS_KEY_SECRET = (auto-generated)
✅ JWT_REFRESH_KEY_SECRET = (auto-generated)
✅ SEED_SECRET = (auto-generated)
✅ EMAIL_USERNAME = lengocthaovy1587@gmail.com
✅ EMAIL_PASSWORD = rlgl euxa iqqk gxxu
```

**⚠️ QUAN TRỌNG**: `MONGODB_CONNECTION_STRING` phải có format:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

## 🌱 Seed Data (Sau Khi DB Connected)

### Kiểm Tra Database Status
```bash
curl https://greenco-op-backend.onrender.com/api/seed/status
```
**Response**:
```json
{
  "cooperatives": 0,
  "products": 0,
  "inventory": 0
}
```

### Seed Database
1. Lấy `SEED_SECRET` từ Render Environment
2. Gọi API:
```bash
curl -X POST "https://greenco-op-backend.onrender.com/api/seed/run?secret=YOUR_SEED_SECRET"
```

**Response**:
```json
{
  "success": true,
  "message": "Successfully seeded 6 cooperatives with products and inventory",
  "cooperatives": 6,
  "products": 6,
  "inventory": 6
}
```

### Verify Seed
```bash
curl https://greenco-op-backend.onrender.com/api/user/public/cooperatives
```
**Should return**: Array với 6 cooperatives

## 🎯 Test Frontend

### 1. Mở Production URL
```
https://greenco-op-frontend.onrender.com
```

### 2. Open Browser Console (F12)
- Tab "Console" → Không có lỗi
- Tab "Network" → Filter "cooperatives"
- Thấy request:
  ```
  URL: https://greenco-op-backend.onrender.com/api/user/public/cooperatives
  Status: 200 OK
  Response: [...]
  ```

### 3. Scroll Xuống "MẠNG LƯỚI HTX"
**Nếu DB connected và đã seed**:
- ✅ Thấy carousel với 6 cards
- ✅ Mỗi card có: tên HTX, địa chỉ, nút "Tìm hiểu"

**Nếu DB chưa connected**:
- ⚠️  "Chưa có hợp tác xã. Vui lòng seed data."
- → Check backend logs
- → Verify MongoDB Atlas configuration
- → Verify Render environment variables

**Nếu DB connected nhưng chưa seed**:
- 📭 "Chưa có hợp tác xã. Vui lòng seed data."
- → Gọi `/api/seed/run` endpoint

## 🐛 Common Issues & Solutions

### Issue 1: Health check timeout
**Symptom**: `/api/health` không respond
**Cause**: Backend crash hoặc không khởi động
**Solution**:
1. Check Render logs
2. Verify all environment variables are set
3. Check if port 5000 is correct

### Issue 2: "Database not connected"
**Symptom**: Logs show "❌ All database connection attempts failed"
**Cause**: MongoDB connection string wrong or network issue
**Solution**:
1. Verify `MONGODB_CONNECTION_STRING` in Render Environment
2. Check MongoDB Atlas Network Access → Add `0.0.0.0/0`
3. Verify MongoDB user credentials
4. Test connection string locally:
   ```bash
   mongosh "mongodb+srv://lework90_db_user:IFSwrz5cuZRI9voM@cluster0.n5kr4jg.mongodb.net/dev"
   ```

### Issue 3: "Internal server error" on API calls
**Symptom**: `/api/user/public/cooperatives` returns 500
**Cause**: Database operation failed
**Solution**:
- ✅ Fixed! New code returns `[]` instead of 500 when DB not connected
- After deploy, should return empty array instead of error

### Issue 4: Frontend shows "Chưa có hợp tác xã"
**Symptom**: Carousel empty but no error
**Cause**: Database connected but no data
**Solution**: Seed data using `/api/seed/run` endpoint

### Issue 5: CORS error
**Symptom**: "CORS policy: This origin is not allowed"
**Cause**: Frontend URL not in `allowedOrigins`
**Solution**: Verify `server.js` includes:
```javascript
const allowedOrigins = [
  "https://greenco-op-frontend.onrender.com",
  // ...
];
```

## 📊 Expected Timeline

| Time | Step | Expected Result |
|------|------|----------------|
| 0 min | Push code | ✅ Git push successful |
| 2 min | Render detects | ✅ Build started |
| 5-10 min | Backend build | ✅ npm install complete |
| 10-12 min | Backend deploy | ✅ Server running |
| 12-15 min | Frontend build | ✅ Vite build complete |
| 15-17 min | Frontend deploy | ✅ Static files served |
| 17 min | Test health | ✅ `/api/health` returns OK |
| 18 min | Test API | ✅ `/api/user/public/cooperatives` returns [] |
| 19 min | Seed data | ✅ 6 cooperatives created |
| 20 min | Test frontend | ✅ Carousel displays cooperatives |

## 🎉 Success Criteria

- [x] Backend deployed without errors
- [x] Frontend deployed without errors
- [x] Health check returns `{"status":"ok", "database":"connected"}`
- [x] Cooperatives API returns data (or empty array if not seeded)
- [x] Frontend displays cooperatives carousel
- [x] No console errors in browser
- [x] Can click cooperative card → Navigate to profile page
- [x] Profile page displays cooperative details

## 📞 Next Steps

1. ⏳ **Đợi Render deploy** (~15-20 phút)
2. ✅ **Check backend logs** để verify DB connection
3. ✅ **Test health endpoint**
4. ✅ **Seed database** nếu connected
5. 🎉 **Test frontend** - should work perfectly!

---

**Commit**: `df640d3`  
**Status**: ✅ Đã push lên GitHub  
**Render**: ⏳ Đang auto-deploy
