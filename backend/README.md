# HRM Backend API

Backend API cho hệ thống quản lý nhân sự (HRM) được xây dựng với NestJS và PostgreSQL.

## Cấu hình

### Port
- Backend chạy trên port: **8300**
- Frontend chạy trên port: **8386**

### Database
- PostgreSQL database
- Cấu hình trong file `.env`

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `env.example`:
```bash
cp env.example .env
```

3. Cập nhật thông tin database trong file `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=hrm_db
```

4. Chạy database migrations:
```bash
npm run migration:run
```

5. Chạy seed data (tùy chọn):
```bash
npm run seed:run
```

## Chạy ứng dụng

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Employees
- `GET /api/employees` - Lấy danh sách nhân viên
- `GET /api/employees/:id` - Lấy thông tin nhân viên
- `POST /api/employees` - Tạo nhân viên mới
- `PUT /api/employees/:id` - Cập nhật nhân viên
- `DELETE /api/employees/:id` - Xóa nhân viên

## Cấu trúc thư mục

```
src/
├── modules/
│   └── employees/          # Module quản lý nhân viên
├── database/
│   ├── entities/           # Database entities
│   ├── migrations/         # Database migrations
│   └── seeders/           # Seed data
├── auth/                  # Authentication
├── common/                # Common utilities
└── config/                # Configuration files
```

## Database Schema

Xem file `src/database/README.md` để biết chi tiết về cấu trúc database.
