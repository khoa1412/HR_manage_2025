# 📖 Hướng dẫn sử dụng

## 🚀 Bắt đầu

### 🔐 Đăng nhập

1. **Truy cập URL**: `http://localhost:3000/login` (hoặc cổng tương ứng khi triển khai).
2. **Sử dụng tài khoản demo**:
   - **Admin/HR**:
     - **Email**: `admin@company.com`
     - **Mật khẩu**: `admin123`
   - **Nhân viên**:
     - **Email**: `user@company.com`
     - **Mật khẩu**: `user123`
3. Nhấn nút **"Đăng nhập"**.

### 🗺️ Điều hướng cơ bản

- **Thanh bên (Sidebar)**: Chứa các liên kết đến các module chính của hệ thống.
- **Phần đầu (Header)**: Hiển thị thông tin người dùng đang đăng nhập và nút đăng xuất.
- **Vùng nội dung chính**: Nơi hiển thị giao diện chức năng của module được chọn.

## 🔄 Các quy trình làm việc chính

### 🆕 **Quy trình Thêm một nhân viên mới**

1. **Truy cập module**: Từ thanh bên, chọn **"Nhân viên"**.
2. **Mở form**: Nhấn nút **"Thêm nhân viên"**.
3. **Nhập thông tin**: Điền các thông tin cơ bản trong modal hiện ra, bao gồm họ tên, email, phòng ban, chức vụ và trạng thái.
4. **Lưu lại**: Nhấn nút **"Lưu"** để hoàn tất. Nhân viên mới sẽ xuất hiện trong danh sách.

### ⚙️ **Quy trình Cấu hình và xem trước tính lương**

1. **Truy cập module**: Từ thanh bên, chọn **"Lương thưởng"**.
2. **Thiết lập tham số**:
   - Nhập mức lương cơ bản, hệ số tăng ca.
   - Điều chỉnh tỷ lệ các khoản bảo hiểm (BHXH, BHYT, BHTN).
   - Cấu hình các bậc thuế TNCN và mức giảm trừ gia cảnh.
3. **Lưu cấu hình**: Nhấn nút **"Lưu thay đổi"** để áp dụng các thiết lập mới.
4. **Xem trước kết quả**:
   - Nhập số ngày làm việc và số giờ tăng ca giả định.
   - Hệ thống sẽ tự động tính toán và hiển thị chi tiết lương thực nhận (Net salary) dựa trên cấu hình đã lưu.

### 👤 **Quy trình Tự phục vụ của nhân viên (ESS)**

1. **Truy cập module**: Từ thanh bên, chọn **"ESS"**.
2. **Sử dụng các tab**:
   - **Hồ sơ**: Xem và chỉnh sửa thông tin cá nhân (lưu dưới dạng bản nháp).
   - **Nghỉ phép/Tăng ca**: Gửi yêu cầu mới và theo dõi lịch sử các yêu cầu đã gửi.
   - **Bảng lương**: Xem và tải phiếu lương hàng tháng.
   - **Tài liệu & Thông báo**: Truy cập các tài liệu và nhận thông báo từ công ty.

## 💡 Lưu ý

- **Dữ liệu Demo**: Hệ thống hiện đang sử dụng dữ liệu giả lập lưu trong `localStorage` của trình duyệt. Dữ liệu sẽ được làm mới nếu bạn xóa cache trình duyệt.
- **Tính năng đang phát triển**: Một số module như "Chấm công", "Báo cáo", "Tuyển dụng"... đang trong quá trình xây dựng và sẽ được cập nhật trong các phiên bản sau.

---

**🏠 Quay lại**: [Tổng quan tài liệu](./README.md)