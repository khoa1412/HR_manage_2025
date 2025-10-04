## Module 1 — Employees (Backend)

Mục tiêu: Cung cấp API quản lý nhân viên theo kiến trúc 3 lớp, bám sát DB đã có và tài liệu `HRM_n1/docs/employee-management.md`.

### Trạng thái Implementation (Cập nhật 10/4/2025)
- ✅ **Database**: Schema đã được chuẩn hóa với Prisma, có đầy đủ relationships
- ✅ **Controller**: 28 endpoints đã implement (bao gồm HR-only endpoints)
- ✅ **Service**: Business logic cơ bản + HR authorization
- ✅ **Repository**: Hoàn toàn sử dụng Prisma ORM với normalized schema
- ✅ **DTOs**: 10 Create DTOs + 1 Update + 1 Query DTO
- ✅ **Prisma Schema**: Schema chuẩn hóa với 15+ tables và relationships
- ✅ **Authorization**: HrRoleGuard cho HR-only operations
- ✅ **Benefits Removal**: Đã xóa hoàn toàn Benefits APIs khỏi hệ thống
- ⚠️ **Position APIs**: Chỉ có stub methods, chưa implement thực tế
- ⚠️ **Response DTOs**: Thiếu Response DTOs cho output validation
- ⚠️ **Update DTOs**: Thiếu Update DTOs cho các entities khác
- ⚠️ **Mock Data**: Endpoint `/me` vẫn return mock data

### Nội dung nào? Được thực hiện bởi file nào?
- **Module & DI**: `backend/src/modules/employees/employees.module.ts` (import HrRoleGuard)
- **Controller**: `backend/src/modules/employees/employees.controller.ts` (28 endpoints, HR authorization)
- **Service**: `backend/src/modules/employees/employees.service.ts` (business logic + HR validation)
- **Repository**: `backend/src/modules/employees/employees.repository.ts` (Prisma ORM, normalized schema)
- **DTOs**: `backend/src/modules/employees/dto/create_dto/` (10 Create DTOs) + `update-employee.dto.ts` + `query-employee.dto.ts`
- **Prisma Service**: `backend/src/database/prisma.service.ts` (Prisma connection management)
- **Prisma Schema**: `backend/prisma/schema.prisma` (normalized schema với 15+ tables)
- **Guards**: 
  - `backend/src/auth/guards/self-or-role.guard.ts` (RBAC self-or-role - tạm disable)
  - `backend/src/auth/guards/hr-role.guard.ts` (HR-only operations - đang sử dụng)

### API của module (28 endpoints)
- **Employees**: GET list, GET by id, GET me (mock), POST create (HR), PATCH update, DELETE hard, POST terminate
- **Positions**: GET list (stub), POST create (HR), PATCH update (stub), DELETE one (stub)
- **Salaries**: GET list, GET current, POST create (HR), PATCH update, DELETE one
- **Contacts**: GET list, POST create, DELETE one
- **Documents**: GET list, POST create, DELETE one
- **HR-Only Operations**: 
  - POST staff-account, POST contact, POST citizen-id, POST education, POST tax-insurance, POST resign-info
- **Benefits**: ❌ Đã xóa hoàn toàn khỏi hệ thống

### Endpoints chi tiết (28 endpoints)
```
# Employee Management
GET    /api/employees              - List employees với filter/pagination ✅
GET    /api/employees/me           - Get current user info (MOCK) ⚠️
GET    /api/employees/:id          - Get employee by ID ✅
POST   /api/employees              - Create new employee (HR only) ✅
PATCH  /api/employees/:id          - Update employee ✅
DELETE /api/employees/:id          - Delete employee ✅
POST   /api/employees/:id/terminate - Terminate employee ✅

# Position Management (STUB - chưa implement thực tế)
GET    /api/employees/:id/positions - List positions (STUB) ⚠️
POST   /api/employees/:id/positions - Add position (HR only, STUB) ⚠️
PATCH  /api/employees/:id/positions/:posId - Update position (STUB) ⚠️
DELETE /api/employees/:id/positions/:posId - Delete position (STUB) ⚠️

# Salary Management
GET    /api/employees/:id/salaries - List salaries ✅
GET    /api/employees/:id/salaries/current - Get current salary ✅
POST   /api/employees/:id/salaries - Add salary (HR only) ✅
PATCH  /api/employees/:id/salaries/:salId - Update salary ✅
DELETE /api/employees/:id/salaries/:salId - Delete salary ✅

# Contact Management
GET    /api/employees/:id/contacts - List contacts ✅
POST   /api/employees/:id/contacts - Add contact ✅
DELETE /api/employees/:id/contacts/:conId - Delete contact ✅

# Document Management
GET    /api/employees/:id/documents - List documents ✅
POST   /api/employees/:id/documents - Add document ✅
DELETE /api/employees/:id/documents/:docId - Delete document ✅

# HR-Only Operations (NEW)
POST   /api/employees/:id/staff-account - Create staff account (HR only) ✅
POST   /api/employees/:id/contact - Create contact info (HR only) ✅
POST   /api/employees/:id/citizen-id - Create citizen ID (HR only) ✅
POST   /api/employees/:id/education - Create education record (HR only) ✅
POST   /api/employees/:id/tax-insurance - Create tax & insurance (HR only) ✅
POST   /api/employees/:id/resign-info - Create resignation info (HR only) ✅

# Benefits APIs - REMOVED ❌
```

### Quy ước chính
- **ID**: bigint ↔ string; Date ISO `YYYY-MM-DD`; Money string.
- **Sort whitelist**: boolean transform trong DTO; Prisma type-safe queries.
- **Database**: Sử dụng Prisma ORM với PostgreSQL; schema được quản lý bởi Prisma.
- **Authentication**: Sử dụng SelfOrRoleGuard cho RBAC
- **Error Handling**: Prisma error handling với type-safe operations
- **ORM**: Hoàn toàn chuyển đổi từ TypeORM sang Prisma ORM
- **DTO Mapping**: Frontend mapping dữ liệu từ form sang DTO format trước khi gửi API
- **Field Support**: Hỗ trợ đầy đủ thông tin: cá nhân, liên hệ, học vấn, thuế, công việc, phúc lợi

### Database Schema (Normalized)
- **Core Tables**: staff_info, staff_acc, citizen_id, contact, emergency_contact, tax_n_insurance
- **Work Tables**: pos_info, salary, contract, contract_types, department
- **History Tables**: education, certifications, insurances, tax, attendance, leave_requests, absent, resign_info
- **Relationships**: 1-1 mandatory, 1-1 optional, 1-N với proper foreign keys
- **Constraints**: onDelete Cascade cho staff_info, SetNull cho optional relationships
- **Indexes**: staff_code, department_id, absent_id, leave_req_id
- **Enums**: gender_enum, period_type_enum, attendance_type_enum, leave_status_enum, absent_name_enum, staff_role_enum

### Recent Updates (10/4/2025)
- ✅ **Schema Normalization**: Chuyển từ denormalized sang normalized schema với 15+ tables
- ✅ **Benefits Removal**: Xóa hoàn toàn Benefits APIs khỏi frontend và backend
- ✅ **HR Authorization**: Thêm HrRoleGuard cho HR-only operations
- ✅ **DTO Organization**: Tổ chức DTOs vào create_dto/ folder
- ✅ **New HR Endpoints**: 6 endpoints mới cho HR-only operations
- ✅ **Build Success**: Tất cả compilation errors đã được fix
- ✅ **Prisma Client**: Generated client với normalized schema
- ✅ **Type Safety**: Full type safety với Prisma generated types

### DTOs Status
#### ✅ **CREATE DTOs (10 files)**
- `create-employee.dto.ts` - Tạo nhân viên mới
- `create-position.dto.ts` - Tạo vị trí
- `create-salary.dto.ts` - Tạo lương
- `create-contact.dto.ts` - Tạo thông tin liên hệ
- `create-citizen.dto.ts` - Tạo CCCD
- `create-education.dto.ts` - Tạo học vấn
- `create-staff-acc.dto.ts` - Tạo tài khoản
- `create-tax-insurance.dto.ts` - Tạo thuế/BHXH
- `create-resign-info.dto.ts` - Tạo thông tin thôi việc
- `create-tax.dto.ts` - Tạo thuế

#### ✅ **UPDATE DTOs (1 file)**
- `update-employee.dto.ts` - Cập nhật nhân viên

#### ✅ **QUERY DTOs (1 file)**
- `query-employee.dto.ts` - Tìm kiếm/lọc nhân viên

#### ❌ **THIẾU DTOs**
- **Update DTOs**: UpdatePositionDto, UpdateSalaryDto, UpdateContactDto, UpdateCitizenIdDto, UpdateEducationDto, UpdateStaffAccDto, UpdateTaxInsuranceDto, UpdateResignInfoDto
- **Response DTOs**: EmployeeResponseDto, PositionResponseDto, SalaryResponseDto, ContactResponseDto, CitizenIdResponseDto, EducationResponseDto, StaffAccResponseDto, TaxInsuranceResponseDto, ResignInfoResponseDto
- **Query DTOs**: QueryPositionDto, QuerySalaryDto, QueryContactDto

### Known Issues & TODOs
- ⚠️ **Position APIs**: Chỉ có stub methods, chưa implement thực tế với pos_info table
- ⚠️ **Response DTOs**: Thiếu Response DTOs cho output validation và transformation
- ⚠️ **Update DTOs**: Thiếu Update DTOs cho Position, Salary, Contact, Citizen, Education, etc.
- ⚠️ **Mock Data**: Endpoint `/me` đang return mock data thay vì query database
- ⚠️ **Authentication**: SelfOrRoleGuard tạm disable, cần implement proper auth flow
- ⚠️ **Error Messages**: Cần customize error messages cho từng trường hợp
- ⚠️ **Testing**: Cần test các API endpoints với Prisma backend mới
- ⚠️ **Performance**: Cần optimize Prisma queries cho production

### Prisma Commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Create and run migrations
npm run prisma:migrate

# Reset database (DANGEROUS - development only)
npm run prisma:reset

# Open Prisma Studio
npm run prisma:studio

# Full database reset with push and generate
npm run db:reset
```
