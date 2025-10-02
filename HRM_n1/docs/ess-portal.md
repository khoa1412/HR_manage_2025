# 👤 Cổng tự phục vụ (ESS Portal)

## 📋 Tổng quan

Cổng Employee Self-Service (ESS) là không gian làm việc cá nhân, nơi nhân viên có thể chủ động quản lý thông tin, gửi yêu cầu và theo dõi các hoạt động liên quan đến công việc của mình một cách minh bạch và hiệu quả.

## 🎯 Đối tượng sử dụng

- **👤 Nhân viên**: Truy cập thông tin cá nhân, gửi yêu cầu nghỉ phép/tăng ca, xem bảng lương và các tài liệu liên quan.
- **👩‍💼 Quản lý/HR**: (Trong các module khác) Phản hồi các yêu cầu được gửi từ cổng ESS.

## 🧭 Cách truy cập

1. **Từ thanh điều hướng (sidebar)**: Nhấn vào mục "ESS".
2. **URL trực tiếp**: `http://localhost:8386/ess` (cổng mặc định khi phát triển).

## 📱 Giao diện và Tính năng

Giao diện ESS được tổ chức theo các tab chức năng rõ ràng:

### 👤 **Hồ sơ (Profile)**
- **Xem thông tin**: Hiển thị thông tin cá nhân, hợp đồng, vị trí công việc.
- **Cập nhật thông tin (Bản nháp)**: Nhân viên có thể chỉnh sửa thông tin cá nhân (địa chỉ, SĐT, thông tin liên hệ khẩn cấp). Các thay đổi được lưu dưới dạng bản nháp (`ProfileDraft`) để HR xem xét và phê duyệt.
- **API sử dụng**: `getProfileDraft()`, `saveProfileDraft()`.

### 🏖️ **Nghỉ phép (Leave)**
- **Gửi yêu cầu**: Form để tạo và gửi yêu cầu nghỉ phép, nêu rõ lý do, loại phép và thời gian. Yêu cầu mới có trạng thái mặc định là `pending`.
- **Lịch sử yêu cầu**: Danh sách các yêu cầu đã gửi, kèm theo trạng thái (Chờ duyệt, Đã duyệt, Từ chối).
- **Xóa yêu cầu**: Nhân viên có thể tự xóa các yêu cầu chưa được xử lý.
- **API sử dụng**: `listLeave()`, `upsertLeave()`, `deleteLeave()`.

### ⚡ **Tăng ca (Overtime)**
- **Đăng ký tăng ca**: Form để đăng ký thời gian làm thêm giờ.
- **Lịch sử đăng ký**: Theo dõi trạng thái các yêu cầu tăng ca đã gửi.
- **API sử dụng**: `listOvertime()`, `upsertOvertime()`, `deleteOvertime()`.

### 💰 **Bảng lương (Payslip)**
- **Xem phiếu lương**: Truy cập phiếu lương chi tiết hàng tháng.
- **Lịch sử lương**: Lưu trữ và cho phép xem lại phiếu lương của các tháng trước.
- **Tải xuống**: Cho phép tải phiếu lương dưới dạng PDF để lưu trữ.

### ⏰ **Chấm công (Attendance)**
- **Xem bảng chấm công**: Hiển thị dữ liệu chấm công chi tiết của nhân viên theo ngày/tuần/tháng.
- **Gửi yêu cầu điều chỉnh**: (Tính năng dự kiến) Cho phép gửi yêu cầu sửa đổi các sai sót trong dữ liệu chấm công.

### 📂 **Tài liệu (Documents)**
- **Tài liệu cá nhân**: Nơi lưu trữ các tài liệu cá nhân như hợp đồng, phụ lục, quyết định bổ nhiệm.
- **Tài liệu công ty**: Truy cập các tài liệu chung như chính sách, quy định, sổ tay nhân viên.

### 🔔 **Thông báo (Notifications)**
- **Cập nhật trạng thái**: Nhận thông báo khi các yêu cầu (nghỉ phép, tăng ca) được duyệt hoặc từ chối.
- **Thông báo chung**: Các thông báo từ phòng Nhân sự hoặc quản lý trực tiếp.

---

**📝 Tiếp theo**: [Quản lý Chấm công](./time-attendance.md)  
**🔙 Quay lại**: [Quản lý Phòng ban](./department-management.md)
