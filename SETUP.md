# Hướng dẫn Setup HRM System

## Cấu hình Port
- **Backend**: Port 8300
- **Frontend**: Port 8386

## 1. Setup Backend

### Cài đặt dependencies
```bash
cd HR_manage_2025/backend
npm install
```

### Cấu hình Database
1. Tạo file `.env` từ `env.example`:
```bash
cp env.example .env
```

2. Cập nhật thông tin database trong file `.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=hrm_db

# Application Configuration
NODE_ENV=development
PORT=8300

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:8386

# Logging
LOG_LEVEL=debug
```

### Chạy Backend
```bash
npm run start:dev
```

Backend sẽ chạy tại: http://localhost:8300

## 2. Setup Frontend

### Cài đặt dependencies
```bash
cd HR_manage_2025/HRM_n1
npm install
```

### Chạy Frontend
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:8386

## 3. Setup Database PostgreSQL

### Tạo Database
```sql
CREATE DATABASE hrm_db;
```

### Chạy Migrations (nếu có)
```bash
cd HR_manage_2025/backend
npm run migration:run
```

## 4. Kiểm tra kết nối

1. Backend API: http://localhost:8300/api/employees
2. Frontend: http://localhost:8386

## Lưu ý

- Đảm bảo PostgreSQL đang chạy
- Cập nhật thông tin database trong file `.env`
- Frontend sẽ tự động fallback về localStorage nếu không kết nối được backend
- CORS đã được cấu hình để cho phép frontend kết nối từ port 8386
