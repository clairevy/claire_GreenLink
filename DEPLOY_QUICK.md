# ✅ CHECKLIST DEPLOY LÊN RENDER

## 🔥 Bước 1: Chuẩn Bị MongoDB Atlas (5 phút)

1. ✅ Đăng nhập https://www.mongodb.com/cloud/atlas
2. ✅ Tạo FREE cluster
3. ✅ Tạo Database User:
   - Username: `greenco-op`
   - Password: (tạo password mạnh, save lại)
4. ✅ Network Access > Add IP: `0.0.0.0/0`
5. ✅ Copy Connection String:
   ```
   mongodb+srv://greenco-op:<password>@cluster0.xxxxx.mongodb.net/greenco-op?retryWrites=true&w=majority
   ```
   (Thay `<password>` bằng password thật)

---

## 🚀 Bước 2: Deploy lên Render (10 phút)

### A. Tạo Account Render

1. ✅ Đăng ký tại https://render.com (dùng GitHub để login nhanh)
2. ✅ Verify email

### B. Deploy bằng Blueprint (KHUYÊN DÙNG - Tự động)

1. ✅ Vào Render Dashboard
2. ✅ Click **New +** > **Blueprint**
3. ✅ Connect repository: `clairevy/claire_GreenLink`
4. ✅ Render sẽ tự đọc file `render.yaml` và tạo 2 services
5. ✅ Thêm Environment Variables cho **Backend**:

   **QUAN TRỌNG - Copy paste vào Render:**

   ```
   MONGODB_URI=mongodb+srv://greenco-op:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/greenco-op
   JWT_SECRET=super-secret-key-minimum-32-characters-long-for-security
   ```

   (Thay `YOUR_PASSWORD` và connection string)

6. ✅ Click **Apply** và đợi deploy (5-10 phút)

### C. Lấy URLs sau khi deploy xong

Backend URL: `https://greenco-op-backend.onrender.com`
Frontend URL: `https://greenco-op-frontend.onrender.com`

---

## 🔧 Bước 3: Cập Nhật CORS (2 phút)

⚠️ **QUAN TRỌNG**: Cần update CORS để frontend connect được backend

1. ✅ Mở file `backend/src/server.js`
2. ✅ Thêm URL frontend vào `allowedOrigins`:

```javascript
const allowedOrigins = [
  frontendBase,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://greenco-op-frontend.onrender.com", // ← THÊM DÒNG NÀY
];
```

3. ✅ Commit và push:

```bash
git add backend/src/server.js
git commit -m "Update CORS for production"
git push origin main
```

4. ✅ Render sẽ tự động deploy lại

---

## 🧪 Bước 4: Test (3 phút)

1. ✅ Test Backend: `https://greenco-op-backend.onrender.com/api/health`

   - Phải thấy: `{"status":"ok",...}`

2. ✅ Test Frontend: `https://greenco-op-frontend.onrender.com`

   - Phải load được trang

3. ✅ Test API: Thử register/login trên frontend

---

## ❌ Nếu Có Lỗi

### Backend không start

- ✅ Vào Render > Backend Service > **Logs**
- ✅ Kiểm tra MongoDB connection string
- ✅ Kiểm tra tất cả env variables đã đúng

### Frontend không call được API

- ✅ Kiểm tra browser Console (F12)
- ✅ Kiểm tra CORS đã update chưa
- ✅ Kiểm tra backend có chạy không

### Database không connect

- ✅ MongoDB Atlas > Network Access > IP = `0.0.0.0/0`
- ✅ Connection string có đúng password không
- ✅ Database name phải là `greenco-op`

---

## 📌 Important Notes

⚠️ **Free Plan Limitations:**

- Service sleep sau 15 phút không dùng
- Mất ~30 giây để wake up
- Bandwidth: 100GB/tháng
- Build time: 500 phút/tháng

💡 **Tips:**

- Dùng UptimeRobot để ping service (tránh sleep)
- Backend URL thường là: `https://greenco-op-backend.onrender.com`
- Frontend URL thường là: `https://greenco-op-frontend.onrender.com`

---

## ✅ Done!

Sau khi hoàn thành, bạn có:

- ✅ Backend API chạy trên Render
- ✅ Frontend chạy trên Render
- ✅ Database trên MongoDB Atlas
- ✅ Auto deploy khi push code

**Live URLs:**

- 🌐 Frontend: https://greenco-op-frontend.onrender.com
- 🔧 Backend: https://greenco-op-backend.onrender.com
- 💾 Database: MongoDB Atlas

🎉 **Chúc mừng bạn đã deploy thành công!**
