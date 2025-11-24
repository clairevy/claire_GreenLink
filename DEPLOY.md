# 🚀 Hướng Dẫn Deploy GreenCo-op lên Render

## 📋 Yêu Cầu Trước Khi Deploy

1. **Tài khoản Render**: Đăng ký tại [render.com](https://render.com)
2. **MongoDB Atlas**: Database online (hoặc MongoDB khác)
3. **GitHub Repository**: Code đã push lên GitHub

## 🔧 Bước 1: Chuẩn Bị MongoDB Atlas

1. Đăng nhập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster mới (free tier)
3. Tạo database user với username và password
4. Whitelist IP: `0.0.0.0/0` (cho phép mọi IP)
5. Lấy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/greenco-op?retryWrites=true&w=majority
   ```

## 🚀 Bước 2: Deploy Backend trên Render

### Option A: Deploy bằng Blueprint (Tự động - Khuyên dùng)

1. Commit và push file `render.yaml` lên GitHub:

   ```bash
   git add render.yaml backend/.env.example frontend/.env.example
   git commit -m "Add Render deployment config"
   git push origin main
   ```

2. Vào Render Dashboard > **New** > **Blueprint**
3. Connect GitHub repository `claire_GreenLink`
4. Render sẽ tự động đọc `render.yaml` và tạo 2 services
5. Thêm environment variables cho backend:
   - `MONGODB_URI`: Connection string từ MongoDB Atlas
   - `JWT_SECRET`: Tự động generate hoặc tự tạo
   - Các biến khác đã được config sẵn

### Option B: Deploy thủ công

1. Vào Render Dashboard > **New** > **Web Service**
2. Connect GitHub repository `claire_GreenLink`
3. Cấu hình service:

   - **Name**: `greenco-op-backend`
   - **Region**: Singapore
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Thêm Environment Variables:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<generate_random_string>
   JWT_EXPIRES_IN=7d
   FRONTEND_BASE_URL=https://greenco-op-frontend.onrender.com
   ```

5. Click **Create Web Service**

## 🎨 Bước 3: Deploy Frontend trên Render

### Option A: Static Site (Khuyên dùng - Free)

1. Vào Render Dashboard > **New** > **Static Site**
2. Connect GitHub repository `claire_GreenLink`
3. Cấu hình:

   - **Name**: `greenco-op-frontend`
   - **Branch**: main
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Thêm Environment Variable:

   ```
   VITE_API_URL=https://greenco-op-backend.onrender.com
   ```

5. Thêm Rewrite Rule (trong Settings):
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: Rewrite

### Option B: Web Service (Nếu cần server-side rendering)

1. Tương tự như backend
2. **Build Command**: `npm install && npm run build && npm install -g serve`
3. **Start Command**: `serve -s dist -l $PORT`

## ⚙️ Bước 4: Cập Nhật CORS trong Backend

Sau khi có URL từ Render, cập nhật `backend/src/server.js`:

```javascript
const allowedOrigins = [
  frontendBase,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://greenco-op-frontend.onrender.com", // Thêm URL frontend từ Render
];
```

Commit và push lại:

```bash
git add backend/src/server.js
git commit -m "Update CORS for production"
git push origin main
```

## 🔄 Bước 5: Cập Nhật Environment Variables

### Backend Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/greenco-op
JWT_SECRET=your-super-secret-key-here-minimum-32-characters
JWT_EXPIRES_IN=7d
FRONTEND_BASE_URL=https://greenco-op-frontend.onrender.com
```

### Frontend Environment Variables (nếu cần)

```env
VITE_API_URL=https://greenco-op-backend.onrender.com
```

**Lưu ý**: Render tự động deploy lại khi bạn thay đổi environment variables.

## 📝 Bước 6: Test Deployment

1. Truy cập backend: `https://greenco-op-backend.onrender.com/api/products`
2. Truy cập frontend: `https://greenco-op-frontend.onrender.com`
3. Test các chức năng: Login, Register, Products

## 🐛 Troubleshooting

### Backend không kết nối được MongoDB

- Kiểm tra MongoDB Atlas whitelist IP: `0.0.0.0/0`
- Kiểm tra connection string có đúng username/password
- Kiểm tra database name trong connection string

### Frontend không call được API

- Kiểm tra `VITE_API_URL` đã đúng chưa
- Kiểm tra CORS trong backend đã thêm frontend URL
- Kiểm tra network tab trong browser DevTools

### Service bị sleep (Free plan)

- Render free plan sẽ sleep sau 15 phút không hoạt động
- Service sẽ khởi động lại khi có request (mất ~30s)
- Giải pháp: Upgrade lên paid plan hoặc dùng uptime monitor

### Build failed

- Kiểm tra logs trong Render dashboard
- Đảm bảo `package.json` có đầy đủ dependencies
- Kiểm tra Node version compatibility

## 🔄 Auto Deploy

Render tự động deploy lại khi:

- Push code mới lên GitHub branch đã config
- Thay đổi environment variables
- Manual deploy trong dashboard

## 💡 Tips

1. **Custom Domain**: Render cho phép thêm custom domain (cần upgrade plan)
2. **Environment Variables**: Dùng Render secrets cho thông tin nhạy cảm
3. **Logs**: Xem logs realtime trong Render dashboard
4. **Health Checks**: Thêm endpoint `/api/health` để Render check service status
5. **Database Backup**: Thường xuyên backup MongoDB Atlas

## 📊 Monitoring

Tạo health check endpoint trong `backend/src/server.js`:

```javascript
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

## 🎉 Hoàn Tất!

Ứng dụng của bạn đã được deploy thành công lên Render!

- Backend: https://greenco-op-backend.onrender.com
- Frontend: https://greenco-op-frontend.onrender.com

## 📞 Support

Nếu gặp vấn đề, kiểm tra:

1. Render Dashboard > Logs
2. Browser DevTools > Console
3. Render Status Page: status.render.com
