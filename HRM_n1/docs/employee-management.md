# 👥 Quản lý Nhân viên

## 📋 Tổng quan

Module Quản lý Nhân viên cung cấp các chức năng cốt lõi để quản lý hồ sơ nhân viên trong toàn bộ tổ chức. Giao diện được thiết kế để người dùng (chủ yếu là phòng Nhân sự) có thể dễ dàng thực hiện các thao tác thêm, xem, sửa và xóa thông tin nhân viên.

### 🚀 Trạng thái Implementation
- ✅ **Frontend**: React components với Vite dev server (port 8386)
- ✅ **Backend**: NestJS API server (port 8300) 
- ✅ **Database**: PostgreSQL với migration và seed data
- ✅ **Authentication**: Basic login với demo accounts
- ✅ **Create Employee**: Đã sửa lỗi button "Thêm mới" không hoạt động
- ✅ **Form Integration**: Đã kết nối đầy đủ form với backend API
- ⚠️ **API Integration**: Đang sử dụng mock data cho `/me` endpoint
- ⚠️ **Error Handling**: Cần bổ sung error handling đầy đủ

## 🎯 Đối tượng sử dụng

- **👩‍💼 Nhân viên HR**: Thực hiện các thao tác quản lý hồ sơ nhân viên hàng ngày.
- **👨‍💻 Quản lý**: Xem thông tin các thành viên trong nhóm của mình (phân quyền chi tiết sẽ được phát triển).

## 🧭 Cách truy cập

1. **Từ thanh điều hướng (sidebar)**: Nhấn vào mục "Nhân viên".
2. **URL trực tiếp**: `http://localhost:8386/employees`.

## 📱 Giao diện và Chức năng

### 📜 **Danh sách nhân viên**

- **Hiển thị**: Nhân viên được liệt kê dưới dạng thẻ (card), hiển thị các thông tin tóm tắt như hình đại diện, họ tên, mã nhân viên, chức vụ và phòng ban.
- **Nút "Thêm nhân viên"**: Mở một modal (cửa sổ pop-up) để nhập thông tin nhân viên mới.

### 🔍 **Tìm kiếm và Lọc**

- **Tìm kiếm**: Một ô tìm kiếm cho phép lọc danh sách nhân viên theo tên hoặc các thông tin liên quan.
- **Lọc theo phòng ban**: Dropdown để chọn và chỉ hiển thị nhân viên thuộc một phòng ban cụ thể.
- **Lọc theo trạng thái**: Dropdown để lọc nhân viên theo trạng thái làm việc (ví dụ: Đang làm việc, Đã nghỉ việc).

### ➕ **Thêm/Sửa nhân viên**

- **Modal Form**: Thao tác thêm mới hoặc chỉnh sửa thông tin nhân viên được thực hiện thông qua một modal `EmployeeForm`.
- **Các trường thông tin**: Form bao gồm đầy đủ thông tin nhân viên được chia thành các tab:
    - **Thông tin cá nhân**: Họ tên, ngày sinh, nơi sinh, giới tính, CCCD, tình trạng hôn nhân
    - **Thông tin liên hệ**: SĐT, email, địa chỉ tạm trú/thường trú
    - **Liên hệ khẩn cấp**: Tên, quan hệ, SĐT người liên hệ
    - **Học vấn**: Bằng cấp, trường, chuyên ngành, chứng chỉ, ngôn ngữ
    - **Thuế & BHXH**: Mã BHXH, mã số thuế
    - **Công việc**: Phòng ban, vị trí, cấp bậc, hợp đồng, lương
    - **Phúc lợi**: Các loại phụ cấp và thưởng
    - **Tài liệu**: Upload các loại giấy tờ liên quan
- **Buttons**: 
    - **"Hủy"**: Đóng modal không lưu thông tin
    - **"Thêm mới"/"Cập nhật"**: Lưu toàn bộ thông tin và đóng modal
- **Validation**: 
    - Form có validation đầy đủ cho các trường bắt buộc
    - Hiển thị warning và chuyển đến tab có lỗi khi thiếu thông tin bắt buộc
    - Thông báo rõ ràng về các trường cần điền

### 🗑️ **Xóa nhân viên**

- **Nút Xóa**: Mỗi thẻ nhân viên có một nút cho phép xóa nhân viên khỏi hệ thống.
- **Xác nhận**: Hệ thống sẽ yêu cầu xác nhận trước khi thực hiện xóa để tránh thao tác nhầm.

## ⚙️ Tích hợp và Dữ liệu

- **API sử dụng**: Các chức năng của module này kết nối REST Backend (Module Employees) qua:
    - `src/services/http.js`: HTTP client tối giản (baseURL từ `VITE_API_BASE_URL`).
    - `src/services/employees.api.js`: Service typed cho Employees (list/get/create/update/delete, positions/salaries/benefits).
    - Giữ kiểu theo BE: `id` và số tiền là chuỗi; ngày ở định dạng ISO `YYYY-MM-DD`.
- **Data Mapping**: Frontend mapping dữ liệu từ form sang DTO format trước khi gửi API để đảm bảo tương thích.
- **Danh sách API chính** (rút gọn):
    - `GET /employees` (list, filter, paginate)
    - `GET /employees/:id`, `GET /employees/me`
    - `POST /employees`, `PATCH /employees/:id`, `DELETE /employees/:id`, `POST /employees/:id/terminate`
    - `GET/POST/PATCH/DELETE /employees/:id/positions[...]`
    - `GET/POST/PATCH/DELETE /employees/:id/salaries[...]`
    - `GET/POST/PATCH/DELETE /employees/:id/benefits[...]`
- **Xử lý lỗi**: Nếu trả về 409 với constraint `ex_*_no_overlap`, hiển thị thông báo "Khoảng thời gian bị chồng lấn".
- **Dữ liệu phòng ban**: Vẫn tải từ `listDepartments()` (local) cho form lựa chọn, giữ nguyên UX.

### 🔐 Demo Accounts
- **Admin/HR**: `admin@company.com` / `admin123`
- **Employee**: `user@company.com` / `admin123`

### 🛠️ Development Setup
```bash
# Backend (port 8300)
cd HR_manage_2025/backend
npm install
npm run start:dev

# Frontend (port 8386)  
cd HR_manage_2025/HRM_n1
npm install
npm run dev

# Database setup
cd HR_manage_2025/backend
npm run db:setup
```

### 🎉 Recent Fixes
- ✅ **Create Employee Bug**: Đã sửa lỗi button "Thêm mới" không hoạt động
- ✅ **Form Integration**: Đã kết nối đầy đủ form với backend API
- ✅ **Data Mapping**: Đã thêm logic mapping dữ liệu từ form sang DTO
- ✅ **Extended Fields**: Hỗ trợ đầy đủ thông tin nhân viên trong form
- ✅ **UI Simplification**: Đã xóa button "Lưu & Tiếp tục" để đơn giản hóa workflow
- ✅ **Enhanced Validation**: Cải thiện logic validation với thông báo rõ ràng

### 🚨 Known Issues
- **Authentication**: SelfOrRoleGuard tạm thời bị disable để test
- **Mock Data**: Endpoint `/me` đang return mock data thay vì query database
- **API Integration**: Cần bổ sung error handling đầy đủ
- **Migration**: Cần chạy migration để cập nhật database schema

---

**📝 Tiếp theo**: [Quản lý Phòng ban](./department-management.md)  
**🔙 Quay lại**: [Dashboard](./dashboard.md)
