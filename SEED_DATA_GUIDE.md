# 🌱 SEED DATA - FIX "NO COOPERATIVES FOUND"

## ❌ Vấn Đề

Khi deploy lên Render, database MongoDB mới và trống → Trang chủ hiển thị:
```
"No cooperatives found"
```

## ✅ Giải Pháp: Seed Data qua API

### Bước 1: Check Data Status

Mở browser và truy cập:
```
https://greenco-op-backend.onrender.com/api/seed/status
```

Response sẽ là:
```json
{
  "cooperatives": 0,
  "products": 0,
  "inventory": 0,
  "needsSeed": true
}
```

---

### Bước 2: Get SEED_SECRET từ Render

1. Vào Render Dashboard
2. Chọn service **greenco-op-backend**
3. Tab **Environment**
4. Tìm `SEED_SECRET` (auto-generated)
5. Copy giá trị (dạng: `rnd_abc123xyz...`)

---

### Bước 3: Run Seed API

#### Option A: Browser (Đơn giản nhất)

Mở URL này trong browser (thay `YOUR_SECRET` bằng giá trị thật):
```
https://greenco-op-backend.onrender.com/api/seed/run?secret=YOUR_SECRET
```

#### Option B: cURL (Terminal)

```bash
curl -X POST "https://greenco-op-backend.onrender.com/api/seed/run" \
  -H "x-seed-secret: YOUR_SECRET"
```

#### Option C: Postman/Thunder Client

```
POST https://greenco-op-backend.onrender.com/api/seed/run
Headers:
  x-seed-secret: YOUR_SECRET
```

---

### Bước 4: Verify Success

#### Check API Response:
```json
{
  "success": true,
  "message": "Successfully seeded 6 cooperatives with products and inventory",
  "data": [
    {
      "id": "...",
      "username": "htx_cuchi_01",
      "name": "HTX Củ Chi 1",
      "product": "Rau cải ngọt",
      "price": 12.5
    },
    ...
  ]
}
```

#### Check Frontend:
1. Mở: https://greenco-op-frontend.onrender.com
2. Scroll xuống phần "Hợp Tác Xã"
3. ✅ Thấy 6 cooperatives với carousel

#### Check API:
```
https://greenco-op-backend.onrender.com/api/user/public/cooperatives
```
Expect: Array of 6 cooperatives

---

## 📊 Seed Data Includes

### 6 Cooperatives:
1. **HTX Củ Chi 1** - Củ Chi (12.5k/kg)
2. **HTX Củ Chi 2** - Củ Chi (11.0k/kg)
3. **HTX Thủ Đức** - Thủ Đức (13.0k/kg)
4. **HTX Bình Tân** - Bình Tân (12.0k/kg)
5. **HTX Tân Điệp** - Quận 12 (10.5k/kg)
6. **HTX Long Phước** - Nhơn Trạch (9.8k/kg)

### Each Cooperative Has:
- ✅ User account (role: "cooperative")
- ✅ Product: "Rau cải ngọt" với giá khác nhau
- ✅ Inventory: 200-1000kg stock
- ✅ Location và phone number

### Credentials:
- Username: `htx_cuchi_01`, `htx_cuchi_02`, etc.
- Password: `password123` (tất cả)
- Email: `htx_cuchi_01@greenco-op.com`, etc.

---

## 🔒 Security

- ✅ Endpoint protected bằng `SEED_SECRET`
- ✅ Auto-generated secret trên Render
- ✅ Chỉ seed khi có secret đúng
- ✅ Safe để chạy nhiều lần (clear old data trước)

---

## 🧪 Test Flow

### 1. Before Seed:
```
GET /api/user/public/cooperatives
Response: []
```

### 2. Run Seed:
```
POST /api/seed/run?secret=YOUR_SECRET
Response: { success: true, ... }
```

### 3. After Seed:
```
GET /api/user/public/cooperatives
Response: [6 cooperatives array]
```

### 4. Frontend:
- ✅ Homepage shows carousel with 6 cooperatives
- ✅ Each card clickable → CooperativeProfile page
- ✅ "No cooperatives found" biến mất

---

## 🔄 Re-seed (Nếu Cần)

Seed API an toàn để chạy lại:
1. Clear old sample data
2. Create fresh data
3. Không ảnh hưởng user data thật

Simply call lại endpoint `/api/seed/run` với secret.

---

## 📝 Local Development

Nếu chạy local và cần seed:

```bash
cd backend
node src/seeds/seedSampleData.js
```

Hoặc call API local:
```
POST http://localhost:5000/api/seed/run
# Không cần secret khi NODE_ENV !== production
```

---

## ✅ Success Criteria

Sau khi seed thành công:

- ✅ `/api/seed/status` shows cooperatives > 0
- ✅ `/api/user/public/cooperatives` returns 6 items
- ✅ Frontend homepage hiển thị carousel
- ✅ Có thể click vào từng cooperative
- ✅ CooperativeProfile page load data đúng

---

## 🎉 Done!

Database đã có data → Frontend hiển thị cooperatives → "No cooperatives found" đã fix! 🚀

**Next Steps:**
1. Seed data trên production
2. Test frontend carousel
3. Test CooperativeProfile pages
4. Enjoy! ☕
