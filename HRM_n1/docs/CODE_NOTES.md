# HRM System – Code Notes

Cập nhật: 2025-09-03

## 0) Cấu trúc dự án

- Thư mục gốc
  - `index.html`
  - `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
  - `README.md`, `api_deploy.md`, `HR-business-logic.docx`
- `src/`
  - `main.jsx`, `App.jsx`, `index.css`
  - `contexts/`
    - `AuthContext.jsx`
  - `components/`
    - `Layout.jsx`, `Header.jsx`, `Sidebar.jsx`, `SimpleSidebar.jsx`, `EmployeeForm.jsx`
  - `pages/`
    - `Dashboard.jsx`, `EmployeeManagement.jsx`, `EmployeeProfile.jsx`, `Departments.jsx`, `ESS.jsx`, `PayrollSettings.jsx`, `Announcements.jsx`, `Performance.jsx`, `Recruitment.jsx`, `Reports.jsx`, `TimeAttendance.jsx`, `Training.jsx`, `Login.jsx`
  - `services/`
    - `api.js`, `ess.js`, `payroll.js`
    - `utils/cn.js`

## 1) Cấu hình dự án (top-level)

- package.json
  - scripts: `dev` (vite), `build`, `preview`, `lint`, `lint:fix`.
  - deps: React 18, React Router 6, Tailwind, Recharts, date-fns, react-hook-form + zod, clsx, tailwind-merge.
  - devDeps: Vite, @vitejs/plugin-react, ESLint, Tailwind, PostCSS, TypeScript.

- vite.config.js
  - Plugin: `react()`.
  - server: `port: 3000`, `open: true`. (Dev thực tế đã chạy ở 3002 nếu 3000 bận.)

- tailwind.config.js
  - `content`: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`.
  - `theme.extend`:
    - Màu `primary` và `gray` tùy biến.
    - `fontFamily.sans = Inter`.
    - `boxShadow.soft` cho card.

- postcss.config.js
  - Plugins: `tailwindcss`, `autoprefixer`.
  - File dùng ESM => Node cảnh báo nếu thiếu `"type": "module"` trong package.json.

- index.html
  - Mount id `root` và load `src/main.jsx` theo ES module.
  - Tiền kết nối Google Fonts + Inter.

## 2) Bootstrap ứng dụng

- src/main.jsx
  - Import `./index.css` và render `<App />` trong `React.StrictMode`.

- src/App.jsx (Routing)
  - Dùng `BrowserRouter` + `Routes`.
  - Bọc toàn bộ bởi `AuthProvider` (context auth).
  - Routes:
    - `/login` → `Login`.
    - `/` → `Layout` (layout chính, chứa Outlet):
      - index → `Dashboard`
      - `/employees` → `EmployeeManagement`
      - `/employees/:id` → `EmployeeProfile`
      - `/departments` → `Departments`
      - `/ess` → `ESS`
      - `/attendance` → `TimeAttendance`
      - `/payroll` → `PayrollSettings`
      - `/announcements` → `Announcements`
      - `/performance` → `Performance`
      - `/reports` → `Reports`

## 3) Authentication Context

- src/contexts/AuthContext.jsx
  - State: `user`, `loading`.
  - `loadUser()` đọc `currentUserId` từ localStorage qua service `getCurrentUserId()`, lấy chi tiết từ `getEmployee(id)`.
  - Suy ra `role` dựa vào `getIsHR()` (admin/employee). Avatar dùng UI Avatars theo tên.
  - `login(email, password)` (mock):
    - admin: `admin@company.com`/`admin123` → set `currentUserId='1'`, `isHR=true`, set `authToken`.
    - user: `user@company.com`/`user123` → set `currentUserId='2'`, `isHR=false`, set `authToken`.
    - Gọi lại `loadUser()` sau khi set để cập nhật context.
  - `logout()` xoá context và localStorage keys (`currentUserId`, `isHR`, `authToken`).

## 4) Service Layer (localStorage demo)

- src/services/api.js
  - Auth helpers: `getCurrentUserId()`, `setCurrentUserId()`, `getIsHR()`, `setIsHR()`.
  - Employees:
    - `listEmployees(filter)`: lọc theo q/department/status.
    - `upsertEmployee(input)`: update theo `id` hoặc tạo mới auto `id` + `code`.
    - `deleteEmployee(id)`.
    - `getEmployee(id)`: seed 2 mẫu nếu rỗng.
  - Departments:
    - `listDepartments()` (seed mặc định HR/IT/ACCT), sorted theo tên.
    - `upsertDepartment(input)`, `deleteDepartment(id)`.
  - Announcements:
    - `listAnnouncements()` (seed 1 thông báo chào mừng), sort desc theo `createdAt`.
    - `upsertAnnouncement(input)`, `deleteAnnouncement(id)`.

- src/services/ess.js (ESS của nhân viên)
  - Yêu cầu `currentUserId` tồn tại, thao tác theo user hiện tại.
  - Leave:
    - `listLeave()` → filter theo employeeId, sort desc theo `createdAt`.
    - `upsertLeave(input)` → update theo id hoặc tạo mới (status `pending`).
    - `deleteLeave(id)` → xoá yêu cầu của chính user.
  - Overtime:
    - `listOvertime()`, `upsertOvertime(input)`, `deleteOvertime(id)` tương tự leave.
  - Profile draft:
    - `getProfileDraft()`, `saveProfileDraft(draft)` lưu theo key `profileDraft_${userId}`.

- src/services/payroll.js (Cấu hình và tính lương)
  - `getDefaultSettings()` định nghĩa mặc định: lương cơ bản, hệ số OT, BHXH/BHYT/BHTN, PIT, personalAllowance.
  - `readSettings()` đọc localStorage, nếu rỗng thì seed mặc định.
  - `saveSettings(partial)` merge và lưu lại.
  - `calculateNetSalary(settings, workingDays=22, overtimeHours=0)`:
    - gross = baseSalary + OT (dựa dailySalary/8 * otRate).
    - Tính khấu trừ bảo hiểm (bhxh/bhyt/bhtn), thu nhập chịu thuế = max(0, gross - insurance - allowance).
    - Thuế PIT (mô phỏng lũy tiến đơn giản 5/10/15/20%).
    - Trả về breakdown: gross, deductions, taxableIncome, tax, net.

## 5) Tóm tắt Pages (UI, state, service)

- __`src/pages/Dashboard.jsx`__
  - Hiển thị KPI, biểu đồ Recharts (attendance, contract distro), bảng phòng ban, activity feed, quick actions.
  - Dữ liệu demo trong component; không gọi service ghi/đọc.

- __`src/pages/EmployeeManagement.jsx`__
  - Danh sách nhân viên dạng card, tìm kiếm, filter theo phòng ban/trạng thái.
  - CRUD dùng `EmployeeForm` (modal) và services: `listEmployees`, `upsertEmployee`, `deleteEmployee` (từ `services/api.js`).
  - State: danh sách, filter, modal open/editing, loading.

- __`src/pages/EmployeeProfile.jsx`__
  - Hồ sơ chi tiết theo tab: Overview/Attendance/Documents/Performance (mock data).
  - Định tuyến theo `:id` nhưng dữ liệu demo; có thể mở rộng gọi `getEmployee(id)`.

- __`src/pages/Departments.jsx`__
  - Danh sách phòng ban, search, thêm/sửa/xoá. Validate biểu mẫu.
  - Gọi `listDepartments`, `upsertDepartment`, `deleteDepartment` và `listEmployees` để đếm/leader.

- __`src/pages/ESS.jsx`__
  - Cổng tự phục vụ: tab Hồ sơ (draft), Nghỉ phép, Tăng ca, Bảng lương, Thông báo.
  - Gọi `ess.js`: `getProfileDraft`/`saveProfileDraft`, `listLeave`/`upsertLeave`/`deleteLeave`, `listOvertime`/`upsertOvertime`/`deleteOvertime`.
  - Ràng buộc đăng nhập qua `getCurrentUserId()` (nếu thiếu → lỗi, UI xử lý).

- __`src/pages/PayrollSettings.jsx`__
  - Form cấu hình lương, preview tính lương theo `calculateNetSalary`.
  - Gọi `readSettings`, `saveSettings` (localStorage) và tính toán thuế/bảo hiểm.

- __`src/pages/Announcements.jsx`__
  - Danh sách thông báo, tìm kiếm, tạo/sửa/xoá (modal form).
  - Dùng `listAnnouncements`, `upsertAnnouncement`, `deleteAnnouncement`.

- __`src/pages/Performance.jsx`, `Recruitment.jsx`, `Reports.jsx`, `TimeAttendance.jsx`, `Training.jsx`__
  - Placeholder: hiển thị tiêu đề và thông báo "đang phát triển".

- __`src/pages/Login.jsx`__
  - Form đăng nhập; gọi `useAuth().login(email, password)`. Đăng nhập demo: admin/user.

## 6) Tóm tắt Components (vai trò, props)

- __`src/components/Layout.jsx`__
  - Khung layout chính: sidebar cố định, header, nội dung `<Outlet />`.
  - Dùng `useAuth()` để kiểm tra `loading/user`. Nếu chưa đăng nhập → điều hướng `/login` (v6) và spinner khi loading.

- __`src/components/Header.jsx`__
  - Tìm kiếm (UI), chuông thông báo, hiển thị avatar/tên/phòng ban, nút cài đặt/đăng xuất.

- __`src/components/Sidebar.jsx`__
  - Nav chính với icon, highlight route đang active, responsive (overlay di động), có footer copyright.

- __`src/components/SimpleSidebar.jsx`__
  - Sidebar tối giản, style inline; dùng cho layout thay thế đơn giản.

- __`src/components/EmployeeForm.jsx`__
  - Modal form thêm/sửa nhân viên. Quản lý state/validate/loading, `onSave`/`onCancel`.
  - Tải danh sách phòng ban async để chọn.

## 7) Bảo vệ route & luồng Auth

- `AuthProvider` trong `src/contexts/AuthContext.jsx` cung cấp `user`, `loading`, `login`, `logout`.
- `src/components/Layout.jsx` kiểm tra auth, chuyển `/login` nếu thiếu `user` (sau khi `loading=false`).
- `login()` set `currentUserId`, `isHR`, `authToken` vào localStorage, rồi `loadUser()` lấy nhân viên qua `getEmployee()`.

## 8) Bản đồ tương tác Service ↔ Pages

- Employees: `EmployeeManagement.jsx` ↔ `listEmployees`, `upsertEmployee`, `deleteEmployee`.
- Departments: `Departments.jsx` ↔ `listDepartments`, `upsertDepartment`, `deleteDepartment`, `listEmployees`.
- ESS: `ESS.jsx` ↔ `getProfileDraft`/`saveProfileDraft`, `listLeave`/`upsertLeave`/`deleteLeave`, `listOvertime`/`upsertOvertime`/`deleteOvertime`.
- Payroll: `PayrollSettings.jsx` ↔ `readSettings`, `saveSettings`, `calculateNetSalary`.
- Announcements: `Announcements.jsx` ↔ `listAnnouncements`, `upsertAnnouncement`, `deleteAnnouncement`.

