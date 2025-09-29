# 💰 Cài đặt Lương & Tính lương

## 📋 Tổng quan

Module này cho phép phòng Nhân sự định cấu hình các tham số tính lương chung và mô phỏng (preview) cách tính lương thực nhận (net salary) dựa trên các cấu hình đó. Đây là công cụ hỗ trợ việc ra quyết định và đảm bảo tính minh bạch trong chính sách lương.

## 🎯 Đối tượng sử dụng

- **👩‍💼 Nhân viên HR**: Thiết lập và điều chỉnh các quy tắc tính lương, thuế và bảo hiểm.
- **👨‍💻 Quản lý**: Sử dụng công cụ để mô phỏng lương cho các vị trí hoặc kịch bản khác nhau.

## 🧭 Cách truy cập

1. **Từ thanh điều hướng (sidebar)**: Nhấn vào mục "Lương thưởng".
2. **URL trực tiếp**: `http://localhost:3000/payroll`.

## 📱 Giao diện và Chức năng

Giao diện được chia thành hai phần chính: Form cấu hình và Khu vực xem trước kết quả.

### ⚙️ **Form Cấu hình Lương**

Đây là nơi người dùng nhập vào các tham số sẽ được sử dụng trong công thức tính lương.

- **Lương cơ bản (Base Salary)**: Mức lương thỏa thuận trước khi tính các khoản khác.
- **Hệ số tăng ca (OT Rate)**: Tỷ lệ dùng để tính lương làm thêm giờ (ví dụ: 1.5, 2.0).
- **Tỷ lệ các khoản bảo hiểm**:
    - Bảo hiểm xã hội (BHXH)
    - Bảo hiểm y tế (BHYT)
    - Bảo hiểm thất nghiệp (BHTN)
- **Thuế thu nhập cá nhân (PIT)**: Các bậc thuế suất tương ứng với từng mức thu nhập.
- **Giảm trừ gia cảnh (Personal Allowance)**: Mức giảm trừ cho bản thân người nộp thuế.

### 🧮 **Xem trước kết quả tính lương (Preview)**

Sau khi điều chỉnh các tham số trong form, khu vực này sẽ tự động tính toán và hiển thị chi tiết lương thực nhận của một nhân viên giả định.

- **Các tham số đầu vào**:
    - **Số ngày làm việc (Working Days)**: Mặc định là 22.
    - **Số giờ tăng ca (Overtime Hours)**: Mặc định là 0.
- **Kết quả chi tiết**:
    - **Lương gộp (Gross Salary)**: `Lương cơ bản + Lương tăng ca`.
    - **Các khoản khấu trừ (Deductions)**: Chi tiết các khoản bảo hiểm.
    - **Thu nhập chịu thuế (Taxable Income)**: `max(0, Lương gộp - Bảo hiểm - Giảm trừ gia cảnh)`.
    - **Thuế TNCN (Tax)**: Số tiền thuế được tính dựa trên thu nhập chịu thuế.
    - **Lương thực nhận (Net Salary)**: `Lương gộp - Bảo hiểm - Thuế`.

## ⚙️ Tích hợp và Dữ liệu

- **API sử dụng**: Các chức năng của module này tương tác với các hàm trong `src/services/payroll.js`:
    - `readSettings()`: Đọc các cấu hình lương đã lưu từ localStorage. Nếu chưa có, sẽ sử dụng giá trị mặc định từ `getDefaultSettings()`.
    - `saveSettings(data)`: Lưu các thay đổi về cấu hình vào localStorage.
    - `calculateNetSalary(settings, workingDays, overtimeHours)`: Thực hiện tính toán lương chi tiết dựa trên cấu hình và các tham số đầu vào.

---

**📝 Tiếp theo**: [Thông báo](./announcements.md)  
**🔙 Quay lại**: [Chấm công](./time-attendance.md)
