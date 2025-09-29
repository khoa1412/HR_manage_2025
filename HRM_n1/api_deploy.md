# HRM System API Documentation

Tài liệu này mô tả chi tiết tất cả các API có sẵn trong hệ thống HRM (Quản lý Nhân sự).

## Tổng quan

Hệ thống HRM cung cấp cả REST APIs và các hàm service layer để quản lý:
- Dữ liệu nhân viên
- Theo dõi chấm công
- Quản lý nghỉ phép
- Xử lý bảng lương
- Quản lý phòng ban
- Tính năng ESS (Employee Self Service)
- Thông báo công ty

---

## 1. Authentication APIs

### Service Layer Functions

#### `getCurrentUserId(): string | null`
**Mô tả**: Lấy ID người dùng hiện tại từ localStorage
**Tham số**: Không có
**Trả về**: `string | null` - ID người dùng hoặc null nếu chưa đăng nhập
**Vị trí**: `src/services/auth.ts`

#### `setCurrentUserId(id: string): void`
**Mô tả**: Lưu ID người dùng vào localStorage
**Tham số**: 
- `id: string` - ID người dùng
**Trả về**: `void`
**Vị trí**: `src/services/auth.ts`

#### `getIsHR(): boolean`
**Mô tả**: Kiểm tra người dùng có phải là HR không
**Tham số**: Không có
**Trả về**: `boolean` - true nếu là HR, false nếu không
**Vị trí**: `src/services/auth.ts`

#### `setIsHR(v: boolean): void`
**Mô tả**: Thiết lập quyền HR cho người dùng
**Tham số**: 
- `v: boolean` - true để cấp quyền HR, false để thu hồi
**Trả về**: `void`
**Vị trí**: `src/services/auth.ts`

---

## 2. Employee Management APIs

### Service Layer Functions

#### `listEmployees(filter?: EmployeeFilter): Promise<Employee[]>`
**Mô tả**: Lấy danh sách nhân viên với bộ lọc tùy chọn
**Tham số**: 
- `filter?: EmployeeFilter` - Bộ lọc tùy chọn
  - `q?: string` - Từ khóa tìm kiếm
  - `departmentId?: string` - ID phòng ban
  - `department?: string` - Tên phòng ban
  - `status?: string` - Trạng thái nhân viên
**Trả về**: `Promise<Employee[]>` - Danh sách nhân viên
**Vị trí**: `src/services/employees.ts`

#### `upsertEmployee(input: Omit<Employee, "id"> & Partial<Pick<Employee, "id">>): Promise<Employee>`
**Mô tả**: Tạo mới hoặc cập nhật thông tin nhân viên
**Tham số**: 
- `input` - Thông tin nhân viên (có thể có hoặc không có ID)
**Trả về**: `Promise<Employee>` - Thông tin nhân viên sau khi lưu
**Vị trí**: `src/services/employees.ts`

#### `deleteEmployee(id: EmployeeId): Promise<void>`
**Mô tả**: Xóa nhân viên theo ID
**Tham số**: 
- `id: EmployeeId` - ID nhân viên cần xóa
**Trả về**: `Promise<void>`
**Vị trí**: `src/services/employees.ts`

#### `getEmployee(id: EmployeeId): Promise<Employee | undefined>`
**Mô tả**: Lấy thông tin chi tiết một nhân viên
**Tham số**: 
- `id: EmployeeId` - ID nhân viên
**Trả về**: `Promise<Employee | undefined>` - Thông tin nhân viên hoặc undefined
**Vị trí**: `src/services/employees.ts`

### Employee Data Structure
```typescript
interface Employee {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  managerId: string | null;
  joinDate: string;
  status: "Active" | "Probation" | "Inactive";
}
```

---

## 3. Attendance Management APIs

### REST API Endpoints

#### `GET /api/attendance`
**Mô tả**: Lấy danh sách tất cả bản ghi chấm công
**Tham số**: Không có
**Trả về**: `AttendanceEntry[]` - Danh sách bản ghi chấm công
**Vị trí**: `src/app/api/attendance/route.ts`

#### `POST /api/attendance`
**Mô tả**: Tạo/cập nhật bản ghi chấm công hoặc seed dữ liệu cho tháng
**Tham số**: 
- Body: `Partial<AttendanceEntry>` hoặc `{seedFor: string, month: string}`
**Trả về**: `AttendanceEntry` hoặc `number` (số bản ghi được tạo khi seed)
**Vị trí**: `src/app/api/attendance/route.ts`

### Service Layer Functions

#### `listAttendance(): Promise<AttendanceEntry[]>`
**Mô tả**: Lấy danh sách chấm công (ưu tiên API, fallback localStorage)
**Tham số**: Không có
**Trả về**: `Promise<AttendanceEntry[]>` - Danh sách bản ghi chấm công
**Vị trí**: `src/services/attendance.ts`

#### `upsertAttendance(entry: Partial<AttendanceEntry>): Promise<AttendanceEntry>`
**Mô tả**: Tạo/cập nhật bản ghi chấm công
**Tham số**: 
- `entry: Partial<AttendanceEntry>` - Thông tin chấm công
**Trả về**: `Promise<AttendanceEntry>` - Bản ghi chấm công sau khi lưu
**Vị trí**: `src/services/attendance.ts`

#### `seedAttendanceForEmployeeMonth(employeeId: string, ym: string): Promise<number>`
**Mô tả**: Tạo dữ liệu chấm công mẫu cho nhân viên trong tháng
**Tham số**: 
- `employeeId: string` - ID nhân viên
- `ym: string` - Tháng năm (format: YYYY-MM)
**Trả về**: `Promise<number>` - Số bản ghi được tạo
**Vị trí**: `src/services/attendance.ts`

### Attendance Data Structure
```typescript
interface AttendanceEntry {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // HH:mm
  checkOut: string | null; // HH:mm
  totalHours: number;
  note?: string;
}
```

---

## 4. Attendance Correction APIs

### REST API Endpoints

#### `GET /api/corrections`
**Mô tả**: Lấy danh sách yêu cầu chỉnh sửa chấm công
**Tham số**: Không có
**Trả về**: `CorrectionRequest[]` - Danh sách yêu cầu chỉnh sửa
**Vị trí**: `src/app/api/corrections/route.ts`

#### `POST /api/corrections`
**Mô tả**: Tạo/cập nhật yêu cầu chỉnh sửa chấm công
**Tham số**: 
- Body: `Partial<CorrectionRequest>`
**Trả về**: `CorrectionRequest` - Yêu cầu chỉnh sửa sau khi lưu
**Vị trí**: `src/app/api/corrections/route.ts`

#### `DELETE /api/corrections/[id]`
**Mô tả**: Xóa yêu cầu chỉnh sửa chấm công
**Tham số**: 
- `id: string` - ID yêu cầu chỉnh sửa
**Trả về**: `{ok: true}` - Xác nhận xóa thành công
**Vị trí**: `src/app/api/corrections/[id]/route.ts`

### Service Layer Functions

#### `listCorrections(): Promise<CorrectionRequest[]>`
**Mô tả**: Lấy danh sách yêu cầu chỉnh sửa (ưu tiên API, fallback localStorage)
**Tham số**: Không có
**Trả về**: `Promise<CorrectionRequest[]>` - Danh sách yêu cầu chỉnh sửa
**Vị trí**: `src/services/attendance.ts`

#### `upsertCorrection(input: Partial<CorrectionRequest>): Promise<CorrectionRequest>`
**Mô tả**: Tạo/cập nhật yêu cầu chỉnh sửa chấm công
**Tham số**: 
- `input: Partial<CorrectionRequest>` - Thông tin yêu cầu chỉnh sửa
**Trả về**: `Promise<CorrectionRequest>` - Yêu cầu chỉnh sửa sau khi lưu
**Vị trí**: `src/services/attendance.ts`

#### `deleteCorrection(id: string): Promise<void>`
**Mô tả**: Xóa yêu cầu chỉnh sửa chấm công
**Tham số**: 
- `id: string` - ID yêu cầu chỉnh sửa
**Trả về**: `Promise<void>`
**Vị trí**: `src/services/attendance.ts`

### Correction Request Data Structure
```typescript
interface CorrectionRequest {
  id: string;
  entryId: string;
  date: string; // YYYY-MM-DD
  expectedCheckIn: string | null; // HH:mm
  expectedCheckOut: string | null; // HH:mm
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO string
}
```

---

## 5. Holiday Management APIs

### REST API Endpoints

#### `GET /api/holidays`
**Mô tả**: Lấy danh sách ngày nghỉ lễ (tự động seed nếu chưa có dữ liệu)
**Tham số**: Không có
**Trả về**: `Holiday[]` - Danh sách ngày nghỉ lễ
**Vị trí**: `src/app/api/holidays/route.ts`

### Service Layer Functions

#### `listHolidays(): Promise<Holiday[]>`
**Mô tả**: Lấy danh sách ngày nghỉ lễ (ưu tiên API, fallback localStorage)
**Tham số**: Không có
**Trả về**: `Promise<Holiday[]>` - Danh sách ngày nghỉ lễ
**Vị trí**: `src/services/attendance.ts`

### Holiday Data Structure
```typescript
interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: "public" | "company";
}
```

---

## 6. Department Management APIs

### Service Layer Functions

#### `listDepartments(): Promise<DepartmentDTO[]>`
**Mô tả**: Lấy danh sách phòng ban (được sắp xếp theo tên)
**Tham số**: Không có
**Trả về**: `Promise<DepartmentDTO[]>` - Danh sách phòng ban
**Vị trí**: `src/services/departments.ts`

#### `upsertDepartment(d: Partial<DepartmentDTO>): Promise<DepartmentDTO>`
**Mô tả**: Tạo mới hoặc cập nhật phòng ban
**Tham số**: 
- `d: Partial<DepartmentDTO>` - Thông tin phòng ban
**Trả về**: `Promise<DepartmentDTO>` - Thông tin phòng ban sau khi lưu
**Vị trí**: `src/services/departments.ts`

#### `deleteDepartment(id: string): Promise<boolean>`
**Mô tả**: Xóa phòng ban (tự động chuyển phòng ban con về null)
**Tham số**: 
- `id: string` - ID phòng ban cần xóa
**Trả về**: `Promise<boolean>` - true nếu xóa thành công
**Vị trí**: `src/services/departments.ts`

### Department Data Structure
```typescript
interface DepartmentDTO {
  id: string;
  code: string;
  name: string;
  parentId?: string | null;
  leaderId?: string | null;
  description?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
```

---

## 7. Leave Management APIs

### Service Layer Functions (Legacy)

#### `listMyLeaves(employeeId: string): LeaveRequest[]`
**Mô tả**: Lấy danh sách đơn nghỉ phép của một nhân viên
**Tham số**: 
- `employeeId: string` - ID nhân viên
**Trả về**: `LeaveRequest[]` - Danh sách đơn nghỉ phép
**Vị trí**: `src/services/leave.ts`

#### `upsertLeave(l: Partial<LeaveRequest>): LeaveRequest`
**Mô tả**: Tạo mới hoặc cập nhật đơn nghỉ phép
**Tham số**: 
- `l: Partial<LeaveRequest>` - Thông tin đơn nghỉ phép
**Trả về**: `LeaveRequest` - Đơn nghỉ phép sau khi lưu
**Vị trí**: `src/services/leave.ts`

#### `deleteLeave(id: string): void`
**Mô tả**: Xóa đơn nghỉ phép
**Tham số**: 
- `id: string` - ID đơn nghỉ phép
**Trả về**: `void`
**Vị trí**: `src/services/leave.ts`

### Legacy Leave Request Data Structure
```typescript
type LeaveRequest = {
  id: string;
  employeeId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  reason: string;
  type: "annual" | "sick" | "unpaid" | "other";
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};
```

---

## 8. ESS (Employee Self Service) APIs

### Service Layer Functions

#### Leave Management

#### `listLeave(): Promise<LeaveRequest[]>`
**Mô tả**: Lấy danh sách đơn nghỉ phép của nhân viên hiện tại
**Tham số**: Không có
**Trả về**: `Promise<LeaveRequest[]>` - Danh sách đơn nghỉ phép
**Vị trí**: `src/services/ess.ts`

#### `upsertLeave(input: Omit<LeaveRequest, "id" | "status" | "createdAt"> & Partial<LeaveRequest>): Promise<LeaveRequest>`
**Mô tả**: Tạo mới hoặc cập nhật đơn nghỉ phép
**Tham số**: 
- `input` - Thông tin đơn nghỉ phép (không bắt buộc có id, status, createdAt)
**Trả về**: `Promise<LeaveRequest>` - Đơn nghỉ phép sau khi lưu
**Vị trí**: `src/services/ess.ts`

#### `deleteLeave(id: string): Promise<void>`
**Mô tả**: Xóa đơn nghỉ phép
**Tham số**: 
- `id: string` - ID đơn nghỉ phép
**Trả về**: `Promise<void>`
**Vị trí**: `src/services/ess.ts`

#### Overtime Management

#### `listOvertime(): Promise<OvertimeRequest[]>`
**Mô tả**: Lấy danh sách đơn xin làm thêm giờ
**Tham số**: Không có
**Trả về**: `Promise<OvertimeRequest[]>` - Danh sách đơn làm thêm giờ
**Vị trí**: `src/services/ess.ts`

#### `upsertOvertime(input: Omit<OvertimeRequest, "id" | "status" | "createdAt"> & Partial<OvertimeRequest>): Promise<OvertimeRequest>`
**Mô tả**: Tạo mới hoặc cập nhật đơn làm thêm giờ
**Tham số**: 
- `input` - Thông tin đơn làm thêm giờ (không bắt buộc có id, status, createdAt)
**Trả về**: `Promise<OvertimeRequest>` - Đơn làm thêm giờ sau khi lưu
**Vị trí**: `src/services/ess.ts`

#### `deleteOvertime(id: string): Promise<void>`
**Mô tả**: Xóa đơn làm thêm giờ
**Tham số**: 
- `id: string` - ID đơn làm thêm giờ
**Trả về**: `Promise<void>`
**Vị trí**: `src/services/ess.ts`

#### Profile Management

#### `getProfileDraft(): Promise<ProfileDraft>`
**Mô tả**: Lấy bản nháp thông tin cá nhân
**Tham số**: Không có
**Trả về**: `Promise<ProfileDraft>` - Bản nháp thông tin cá nhân
**Vị trí**: `src/services/ess.ts`

#### `saveProfileDraft(draft: ProfileDraft): Promise<ProfileDraft>`
**Mô tả**: Lưu bản nháp thông tin cá nhân
**Tham số**: 
- `draft: ProfileDraft` - Bản nháp thông tin cá nhân
**Trả về**: `Promise<ProfileDraft>` - Bản nháp sau khi lưu
**Vị trí**: `src/services/ess.ts`

### ESS Data Structures
```typescript
interface LeaveRequest {
  id: string;
  employeeId: string;
  type: "annual" | "sick" | "unpaid" | "other";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO string
}

interface OvertimeRequest {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  hours: number;
  note?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO string
}

interface ProfileDraft {
  [key: string]: any; // Flexible structure for profile updates
}
```

---

## 9. Payroll Management APIs

### Service Layer Functions

#### `getDefaultSettings(): StoredPayrollSettings`
**Mô tả**: Lấy cài đặt bảng lương mặc định
**Tham số**: Không có
**Trả về**: `StoredPayrollSettings` - Cài đặt bảng lương mặc định
**Vị trí**: `src/services/payroll.ts`

#### `readSettings(): Promise<StoredPayrollSettings>`
**Mô tả**: Đọc cài đặt bảng lương từ localStorage
**Tham số**: Không có
**Trả về**: `Promise<StoredPayrollSettings>` - Cài đặt bảng lương hiện tại
**Vị trí**: `src/services/payroll.ts`

#### `saveSettings(s: Partial<StoredPayrollSettings>): Promise<StoredPayrollSettings>`
**Mô tả**: Lưu cài đặt bảng lương
**Tham số**: 
- `s: Partial<StoredPayrollSettings>` - Cài đặt bảng lương cần cập nhật
**Trả về**: `Promise<StoredPayrollSettings>` - Cài đặt bảng lương sau khi lưu
**Vị trí**: `src/services/payroll.ts`

### Payroll Data Structure
```typescript
interface StoredPayrollSettings {
  id: string; // "me"
  baseSalary: number; // VND per month
  otRate: number; // e.g. 1.5 (overtime rate)
  currency?: string; // VND
  bhxhRate?: number; // 0.08 (social insurance rate)
  bhytRate?: number; // 0.015 (health insurance rate)
  bhtnRate?: number; // 0.01 (unemployment insurance rate)
  pitRate?: number; // 0.05 (personal income tax rate - simplified)
  personalAllowance?: number; // 11,000,000 VND default
}
```

---

## 10. Announcements APIs

### Service Layer Functions

#### `listAnnouncements(): Announcement[]`
**Mô tả**: Lấy danh sách thông báo (sắp xếp theo thời gian tạo giảm dần)
**Tham số**: Không có
**Trả về**: `Announcement[]` - Danh sách thông báo
**Vị trí**: `src/services/announcements.ts`

#### `upsertAnnouncement(a: Partial<Announcement>): Announcement`
**Mô tả**: Tạo mới hoặc cập nhật thông báo
**Tham số**: 
- `a: Partial<Announcement>` - Thông tin thông báo
**Trả về**: `Announcement` - Thông báo sau khi lưu
**Vị trí**: `src/services/announcements.ts`

### Announcement Data Structure
```typescript
type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  author?: string;
};
```

---

## Lưu ý kỹ thuật

### Storage Strategy
- **localStorage**: Được sử dụng làm storage chính cho hầu hết các service
- **Next.js API Routes**: Được sử dụng cho attendance, corrections, và holidays với fallback về localStorage
- **Hybrid Approach**: Các service attendance sử dụng API trước, fallback về localStorage khi offline

### Error Handling
- Tất cả các hàm async đều có error handling cơ bản
- localStorage operations được bảo vệ bởi `typeof window === "undefined"` checks
- JSON parsing được bao bọc trong try-catch blocks

### Data Seeding
- **Employees**: Tự động seed 2 nhân viên mẫu khi chưa có dữ liệu
- **Departments**: Tự động seed 3 phòng ban mẫu (Hành chính, Kế toán, Nhân sự)
- **Holidays**: Tự động seed ngày nghỉ mẫu cho tháng hiện tại
- **Announcements**: Tự động seed 1 thông báo chào mừng
- **Attendance**: Có thể seed dữ liệu chấm công cho cả tháng

### Authentication
- Sử dụng localStorage để lưu trữ `currentUserId` và `isHR` flag
- Không có JWT hoặc session management phức tạp
- Phù hợp cho demo và development environment

### API Response Format
- Tất cả REST APIs trả về JSON format
- Error responses sử dụng standard HTTP status codes
- Success responses bao gồm data object hoặc array

### Validation
- Client-side validation được thực hiện trong các service functions
- Server-side validation tối thiểu trong API routes
- Type safety được đảm bảo bởi TypeScript interfaces

