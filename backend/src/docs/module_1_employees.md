## Module 1 — Employees (Backend)

Mục tiêu: Cung cấp API quản lý nhân viên theo kiến trúc 3 lớp, bám sát DB đã có và tài liệu `HRM_n1/docs/employee-management.md`.

### Trạng thái Implementation
- ✅ **Database**: Đã tạo migration và seed data với đầy đủ các cột
- ✅ **Controller**: Đã implement đầy đủ endpoints
- ✅ **Service**: Đã có business logic cơ bản
- ✅ **Repository**: Đã có query builder với view `v_employees_api`
- ✅ **DTOs**: Đã mở rộng để hỗ trợ đầy đủ thông tin nhân viên
- ✅ **Entity**: Đã cập nhật interface Employee với tất cả field
- ⚠️ **Authentication**: Tạm thời disable để test
- ⚠️ **Error Handling**: Cần bổ sung error messages chi tiết

### Nội dung nào? Được thực hiện bởi file nào?
- Module & DI: `backend/src/modules/employees/employees.module.ts`
- Controller: `backend/src/modules/employees/employees.controller.ts` (employees + positions/salaries/benefits/contacts/documents)
- Service: `backend/src/modules/employees/employees.service.ts` (nghiệp vụ, validate ngày, terminate transaction)
- Repository: `backend/src/modules/employees/employees.repository.ts` (view `v_employees_api`, EXISTS filters, sort whitelist)
- DTOs: `backend/src/modules/employees/dto/*.ts`
- Entities: `backend/src/modules/employees/entities/*.ts` (không sync schema)
- Filters: `backend/src/modules/employees/filters/db-exception.filter.ts` (map mã PG → HTTP 4xx/409)
- Guard: `backend/src/auth/guards/self-or-role.guard.ts` (RBAC self-or-role)

### API của module
- **Employees**: GET list, GET by id, GET me, POST create, PATCH update, DELETE hard, POST terminate
- **Positions**: GET list, POST create, PATCH update, DELETE one
- **Salaries**: GET list, GET current, POST create, PATCH update, DELETE one
- **Benefits**: GET list, POST create, PATCH update, DELETE one
- **Contacts**: GET list, POST create, DELETE one
- **Documents**: GET list, POST create, DELETE one

### Endpoints chi tiết
```
GET    /api/employees              - List employees với filter/pagination
GET    /api/employees/me           - Get current user info
GET    /api/employees/:id          - Get employee by ID
POST   /api/employees              - Create new employee
PATCH  /api/employees/:id          - Update employee
DELETE /api/employees/:id          - Delete employee
POST   /api/employees/:id/terminate - Terminate employee

GET    /api/employees/:id/positions - List positions
POST   /api/employees/:id/positions - Add position
PATCH  /api/employees/:id/positions/:posId - Update position
DELETE /api/employees/:id/positions/:posId - Delete position

GET    /api/employees/:id/salaries - List salaries
GET    /api/employees/:id/salaries/current - Get current salary
POST   /api/employees/:id/salaries - Add salary
PATCH  /api/employees/:id/salaries/:salId - Update salary
DELETE /api/employees/:id/salaries/:salId - Delete salary

GET    /api/employees/:id/benefits - List benefits
POST   /api/employees/:id/benefits - Add benefit
PATCH  /api/employees/:id/benefits/:benId - Update benefit
DELETE /api/employees/:id/benefits/:benId - Delete benefit

GET    /api/employees/:id/contacts - List contacts
POST   /api/employees/:id/contacts - Add contact
DELETE /api/employees/:id/contacts/:conId - Delete contact

GET    /api/employees/:id/documents - List documents
POST   /api/employees/:id/documents - Add document
DELETE /api/employees/:id/documents/:docId - Delete document
```

### Quy ước chính
- **ID**: bigint ↔ string; Date ISO `YYYY-MM-DD`; Money string.
- **Sort whitelist**: boolean transform trong DTO; map lỗi PG (23505/23P01/23514/23503) → HTTP 4xx/409.
- **Database**: Không bật TypeORM synchronize; schema dùng Flyway migrations.
- **Authentication**: Sử dụng SelfOrRoleGuard cho RBAC
- **Error Handling**: DbExceptionFilter map PostgreSQL errors → HTTP status codes
- **View**: Sử dụng `v_employees_api` view cho API response format
- **DTO Mapping**: Frontend mapping dữ liệu từ form sang DTO format trước khi gửi API
- **Field Support**: Hỗ trợ đầy đủ thông tin: cá nhân, liên hệ, học vấn, thuế, công việc, phúc lợi

### Database Schema
- **Tables**: employees (mở rộng với đầy đủ cột), departments, employee_positions, employee_salaries, employee_benefits, employee_contacts, employee_documents, auth_users, benefit_types
- **Employee Fields**: Hỗ trợ đầy đủ thông tin cá nhân, liên hệ, học vấn, thuế, công việc, phúc lợi
- **Constraints**: EXCLUDE constraints để tránh overlap trong positions/salaries/benefits
- **Indexes**: Optimized cho queries thường dùng
- **Views**: `v_employees_api` cho API response format chuẩn

### Recent Updates
- ✅ **Fixed Create Employee**: Đã sửa lỗi button "Thêm mới" không hoạt động
- ✅ **Extended DTOs**: Mở rộng CreateEmployeeDto và UpdateEmployeeDto với đầy đủ field
- ✅ **Database Schema**: Cập nhật bảng employees với tất cả cột cần thiết
- ✅ **Frontend Mapping**: Thêm logic mapping dữ liệu từ form sang DTO format
- ✅ **Repository Updates**: Cập nhật create/update methods để xử lý tất cả field

### Known Issues & TODOs
- ⚠️ **Authentication**: Tạm thời disable SelfOrRoleGuard để test
- ⚠️ **Mock Data**: Endpoint `/me` đang return mock data thay vì query database
- ⚠️ **Error Messages**: Cần customize error messages cho từng trường hợp
- ⚠️ **Migration**: Cần chạy migration để cập nhật database schema
