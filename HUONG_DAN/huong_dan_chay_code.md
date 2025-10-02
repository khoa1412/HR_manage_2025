# 🚀 Hướng dẫn chạy code HR Management System

## 📋 Tổng quan
Hệ thống HR Management bao gồm:
- **Frontend**: React + Vite (port 8386)
- **Backend**: NestJS + TypeScript (port 8300)
- **Database**: PostgreSQL

## 🛠️ Cài đặt và chạy

### 1. Cài đặt Dependencies

#### Backend
```bash
cd HR_manage_2025/backend
npm install
# Hoặc nếu gặp lỗi version conflict:
npm install --legacy-peer-deps
```

#### Frontend
```bash
cd HR_manage_2025/HRM_n1
npm install
```

### 2. Cấu hình Database

#### Tạo Database
```sql
-- Kết nối PostgreSQL và tạo database
CREATE DATABASE hrm_db;
```

#### Cấu hình kết nối
Tạo file `.env` trong thư mục `backend`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=hrm_db
NODE_ENV=development
```

### 3. Nạp dữ liệu vào Database

#### Cách 1: Sử dụng script migration (Khuyến nghị)
```bash
cd HR_manage_2025/backend
# Cài đặt pg package nếu chưa có
npm install pg
# Chạy migration
node scripts/test-migrate.js
```

#### Cách 2: Chạy migration SQL trực tiếp
```bash
# Kết nối PostgreSQL
psql -U postgres -d hrm_db

# Chạy file migration
\i src/database/migrations/001_create_employee_database.sql
```

#### Cách 3: Sử dụng pgAdmin hoặc GUI tool
1. Mở pgAdmin hoặc tool quản lý PostgreSQL
2. Kết nối đến database `hrm_db`
3. Mở file `src/database/migrations/001_create_employee_database.sql`
4. Copy và paste nội dung vào Query Tool
5. Execute script

### 4. Chạy ứng dụng

#### Backend (Terminal 1)
```bash
cd HR_manage_2025/backend
# Chạy backend với watch mode
npm run start:dev
# Hoặc nếu gặp lỗi:
npm run build && npm run start:prod
```
Backend sẽ chạy tại: `http://localhost:8300`

#### Frontend (Terminal 2)
```bash
cd HR_manage_2025/HRM_n1
# Chạy frontend với Vite dev server
npm run dev
# Hoặc nếu cần build production:
npm run build && npm run preview
```
Frontend sẽ chạy tại: `http://localhost:8386`

## 🔐 Demo Accounts

### Admin/HR Account
- **Email**: `admin@company.com`
- **Password**: `admin123`

### Employee Account
- **Email**: `user@company.com`
- **Password**: `admin123`

## 📊 Kiểm tra Database

### Xem danh sách bảng
```sql
\dt
```

### Xem cấu trúc bảng employees
```sql
\d employees
```

### Xem dữ liệu mẫu
```sql
SELECT * FROM employees LIMIT 5;
SELECT * FROM departments LIMIT 5;
```

## 🐛 Troubleshooting

### Lỗi kết nối Database
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra thông tin kết nối trong `.env`
- Kiểm tra database `hrm_db` đã tồn tại chưa

### Lỗi Migration
- Đảm bảo đã cài đặt `pg` package: `npm install pg`
- Kiểm tra quyền truy cập database
- Chạy migration với quyền admin

### Lỗi Frontend không kết nối Backend
- Kiểm tra backend đã chạy tại port 8300
- Kiểm tra CORS settings
- Kiểm tra `VITE_API_BASE_URL` trong frontend

## 📝 Ghi chú

- **Database Schema**: Được định nghĩa trong `src/database/migrations/001_create_employee_database.sql`
- **API Documentation**: Xem `src/docs/module_1_employees.md`
- **Frontend Documentation**: Xem `docs/employee-management.md`

## 🎯 Các chức năng chính

1. **Quản lý nhân viên**: Thêm, sửa, xóa, xem thông tin nhân viên
2. **Tìm kiếm và lọc**: Tìm kiếm nhân viên theo nhiều tiêu chí
3. **Quản lý phòng ban**: Quản lý cấu trúc tổ chức
4. **Báo cáo**: Các báo cáo thống kê nhân sự

---

**📞 Hỗ trợ**: Nếu gặp vấn đề, vui lòng kiểm tra logs trong terminal hoặc liên hệ team phát triển.
