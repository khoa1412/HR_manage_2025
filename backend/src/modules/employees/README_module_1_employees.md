## Module 1 — Employees (Backend)

Mục tiêu: Cung cấp API quản lý nhân viên (Controller ↔ Service ↔ Repository) bám sát DB đã có và yêu cầu từ `docs/employee-management.md`.

### 🚀 Trạng thái Implementation
- ✅ **Database**: Đã tạo migration và seed data
- ✅ **Controller**: Đã implement đầy đủ endpoints
- ✅ **Service**: Đã có business logic cơ bản
- ✅ **Repository**: Đã có query builder với view `v_employees_api`
- ⚠️ **Authentication**: Tạm thời disable để test
- ⚠️ **DTOs**: Cần bổ sung validation đầy đủ

### Các file chính (thực hiện nội dung gì?)
- `employees.module.ts`: Khai báo module, wire controller/service/repository.
- `employees.controller.ts`: Định nghĩa REST endpoints `/api/employees` và các nhánh con (positions, salaries, benefits, contacts, documents).
- `employees.service.ts`: Xử lý nghiệp vụ (validate rule, map lỗi, điều phối repo/transaction).

### 🚨 Known Issues & TODOs
- ⚠️ **Authentication**: Tạm thời disable SelfOrRoleGuard để test
- ⚠️ **Mock Data**: Endpoint `/me` đang return mock data thay vì query database
- ⚠️ **Validation**: Cần bổ sung validation đầy đủ trong DTOs
- ⚠️ **Error Messages**: Cần customize error messages cho từng trường hợp
- `employees.repository.ts`: Truy vấn DB (PostgreSQL) qua TypeORM `DataSource` + QueryBuilder/raw SQL. Tận dụng view `v_employees_api`, `v_current_positions` và các index.
- `dto/*.ts`: DTO validate input/request (class-validator): create/update/query employee; create position/salary/benefit.
- `entities/*.ts`: Khai báo Entity tối thiểu để map bảng chính (không sync schema, chỉ map type/column name).
- `filters/db-exception.filter.ts`: Map constraint DB → HTTP 409/4xx.

Tất cả mã chỉ cho module Employees, không sinh mã cho module khác.

### API danh sách (theo Controller)
- GET `/api/v1/employees` — list + filter + paginate (trả shape từ view `v_employees_api`).
- GET `/api/v1/employees/:id` — chi tiết 1 nhân viên (join dept + current position + current salary + active benefits).
- GET `/api/v1/employees/me` — lấy hồ sơ của chính user đăng nhập.
- POST `/api/v1/employees` — tạo nhân viên mới.
- PATCH `/api/v1/employees/:id` — cập nhật thông tin cơ bản.
- DELETE `/api/v1/employees/:id` — hard delete (admin-only).
- POST `/api/v1/employees/:id/terminate` — nghỉ việc (soft), đóng các lịch sử open-ended.

Positions
- GET `/api/v1/employees/:id/positions?activeOnly=true|false`
- POST `/api/v1/employees/:id/positions`
- PATCH `/api/v1/employees/:id/positions/:positionId`
- DELETE `/api/v1/employees/:id/positions/:positionId`

Salaries
- GET `/api/v1/employees/:id/salaries`
- GET `/api/v1/employees/:id/salaries/current`
- POST `/api/v1/employees/:id/salaries`
- PATCH `/api/v1/employees/:id/salaries/:salaryId`
- DELETE `/api/v1/employees/:id/salaries/:salaryId`

Benefits
- GET `/api/v1/employees/:id/benefits`
- POST `/api/v1/employees/:id/benefits`
- PATCH `/api/v1/employees/:id/benefits/:benefitId`
- DELETE `/api/v1/employees/:id/benefits/:benefitId`

Contacts
- GET `/api/v1/employees/:id/contacts`
- POST `/api/v1/employees/:id/contacts`
- DELETE `/api/v1/employees/:id/contacts/:contactId`

Documents
- GET `/api/v1/employees/:id/documents`
- POST `/api/v1/employees/:id/documents`
- DELETE `/api/v1/employees/:id/documents/:docId`

### Ghi chú triển khai
- ID bigint map sang string ở API/DTO.
- Ngày định dạng ISO `YYYY-MM-DD` (`@IsDateString`).
- Tiền nhận/gửi dạng string.
- Map lỗi overlap: `ex_positions_no_overlap`, `ex_salaries_no_overlap`, `ex_benefits_no_overlap` → 409.
- Không bật TypeORM synchronize, schema do Flyway quản lý (đã có migrations SQL trong `database/migrations`).

### Bảo mật & Guard
- `SelfOrRoleGuard`: Admin/HR full quyền; Employee chỉ xem `me` hoặc `:id` nếu trùng `employeeId`.



