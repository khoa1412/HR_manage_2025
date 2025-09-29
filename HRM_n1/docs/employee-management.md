# 👥 Quản lý Nhân viên

## 📋 Tổng quan

Module Quản lý Nhân viên cung cấp các chức năng cốt lõi để quản lý hồ sơ nhân viên trong toàn bộ tổ chức. Giao diện được thiết kế để người dùng (chủ yếu là phòng Nhân sự) có thể dễ dàng thực hiện các thao tác thêm, xem, sửa và xóa thông tin nhân viên.

## 🎯 Đối tượng sử dụng

- **👩‍💼 Nhân viên HR**: Thực hiện các thao tác quản lý hồ sơ nhân viên hàng ngày.
- **👨‍💻 Quản lý**: Xem thông tin các thành viên trong nhóm của mình (phân quyền chi tiết sẽ được phát triển).

## 🧭 Cách truy cập

1. **Từ thanh điều hướng (sidebar)**: Nhấn vào mục "Nhân viên".
2. **URL trực tiếp**: `http://localhost:3000/employees`.

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
- **Các trường thông tin**: Form bao gồm các trường cơ bản để quản lý hồ sơ như:
    - Họ tên, email, SĐT.
    - Phòng ban, chức vụ.
    - Trạng thái làm việc.
- **Lưu và Hủy**: Các nút để xác nhận lưu thông tin hoặc đóng modal.

### 🗑️ **Xóa nhân viên**

- **Nút Xóa**: Mỗi thẻ nhân viên có một nút cho phép xóa nhân viên khỏi hệ thống.
- **Xác nhận**: Hệ thống sẽ yêu cầu xác nhận trước khi thực hiện xóa để tránh thao tác nhầm.

## ⚙️ Tích hợp và Dữ liệu

- **API sử dụng**: Các chức năng của module này tương tác trực tiếp với các hàm trong `src/services/api.js`:
    - `listEmployees(filters)`: Lấy danh sách nhân viên, có hỗ trợ lọc.
    - `upsertEmployee(data)`: Tạo mới hoặc cập nhật thông tin một nhân viên.
    - `deleteEmployee(id)`: Xóa một nhân viên dựa trên ID.
- **Dữ liệu phòng ban**: Form thêm/sửa nhân viên sẽ tải danh sách phòng ban từ `listDepartments()` để người dùng lựa chọn.

---

**📝 Tiếp theo**: [Quản lý Phòng ban](./department-management.md)  
**🔙 Quay lại**: [Dashboard](./dashboard.md)
