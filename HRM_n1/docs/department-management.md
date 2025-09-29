# 🏢 Quản lý Phòng ban

## 📋 Tổng Quan Module

Module Quản lý Phòng ban cho phép HR thiết lập và quản lý cơ cấu tổ chức, định nghĩa hierarchy, phân quyền truy cập và theo dõi metrics của từng phòng ban.

## 🎯 Mục Đích Sử Dụng

- **👨‍💼 HR Manager**: Thiết lập cơ cấu tổ chức, quản lý hierarchy
- **🏢 C-Level**: Xem tổng quan performance các phòng ban  
- **👨‍💻 Department Heads**: Quản lý team của mình
- **📊 Analysts**: Phân tích metrics cross-department

## 🧭 Cách Truy Cập

1. **Từ sidebar**: Click vào icon 🏢 "Phòng ban"
2. **URL trực tiếp**: `http://localhost:3001/departments`

## 📱 Giao Diện & Tính Năng

### 🏢 **Department Cards Layout**
```
┌─────────────────────────────────────────────────────┐
│ [➕ Thêm phòng ban]                               │
├─────────────────────────────────────────────────────┤
│ ┌─ 💻 Phòng IT ──────────────────────── [✏️] [🗑️] ─┐ │
│ │ 👨‍💼 Trưởng phòng: Nguyễn Văn A              │ │
│ │ 👥 45 nhân viên │ 📊 42 có mặt │ ⚡ 93% hiệu suất│ │
│ │ 💰 Chi phí: 850M VND/tháng                    │ │
│ │ 📈 Metrics: [View Details]                    │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### ➕ **Add Department Form**
- **Tên phòng ban**: Required, unique validation
- **Mã phòng ban**: Auto-generated hoặc manual  
- **Trưởng phòng**: Dropdown chọn từ employee list
- **Phòng ban cha**: Hierarchy relationship (optional)
- **Mô tả**: Chức năng và nhiệm vụ của phòng ban
- **Budget**: Ngân sách hàng tháng (optional)

### 📊 **Department Analytics**
- **Headcount**: Số lượng nhân viên hiện tại
- **Attendance Rate**: Tỷ lệ chấm công trung bình
- **Performance Score**: Điểm hiệu suất trung bình
- **Monthly Cost**: Chi phí lương + benefits
- **Growth Rate**: Tăng trưởng so với tháng trước

---

**📝 Next**: [👤 Cổng Nhân viên](./ess-portal.md)  
**🔙 Back**: [👥 Quản lý Nhân sự](./employee-management.md)
