# 📚 Tài Liệu Hệ Thống HRM - Smartlog

## 🎯 Tổng Quan Hệ Thống

Hệ thống HRM (Human Resource Management) được thiết kế để quản lý toàn diện nhân sự cho doanh nghiệp quy mô 500 nhân viên. Hệ thống cung cấp các chức năng hiện đại, giao diện thân thiện và workflow tối ưu.

### 🏗️ Kiến Trúc Hệ Thống

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM 6
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Excel Export**: XLSX
- **State Management**: React Context API

### 📱 Các Module Chính

| Module | Chức Năng | Đối Tượng Sử Dụng |
|--------|-----------|-------------------|
| 🏠 **Dashboard** | Analytics, Báo cáo, Đánh giá hiệu suất | HR Manager, C-Level |
| 👥 **Quản lý Nhân sự** | CRUD nhân viên, Hồ sơ, Phúc lợi | HR Team |
| 🏢 **Phòng ban** | Quản lý cơ cấu tổ chức | HR Manager |
| 👤 **Cổng Nhân viên** | Self-service portal | All Employees |
| ⏰ **Chấm công** | Time tracking, Báo cáo | HR Team, Managers |
| 💰 **Cài đặt Lương** | Payroll, Phiếu lương, Export | HR Payroll |
| 📢 **Thông báo** | Communication | HR Team |

## 🚀 Hướng Dẫn Sử Dụng Nhanh

### 📋 Yêu Cầu Hệ Thống
- **Node.js**: 18+ 
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **Screen Resolution**: 1280x720 trở lên

### 🔧 Cài Đặt & Chạy
```bash
# Clone project
git clone [repository-url]
cd HRM-n1

# Install dependencies
npm install

# Start development server
npm run dev

# Access application
http://localhost:3001
```

### 👤 Đăng Nhập
- **URL**: `http://localhost:3001/login`
- **Tài khoản mẫu**:
  - Email: `admin@company.com`
  - Password: `123456`

### 🗺️ Navigation
Hệ thống sử dụng sidebar navigation với 7 module chính. Click vào từng icon để truy cập module tương ứng.

## 📖 Chi Tiết Từng Module

### [🏠 Dashboard & Báo cáo](./dashboard.md)
- Tổng quan metrics hệ thống
- Analytics chấm công, lương, hiệu suất  
- Charts và visualizations
- Export reports

### [👥 Quản lý Nhân sự](./employee-management.md)
- CRUD nhân viên
- Quản lý phúc lợi custom
- Hồ sơ chi tiết
- Import/Export Excel

### [🏢 Quản lý Phòng ban](./department-management.md)
- Cơ cấu tổ chức
- Phân quyền truy cập
- Hierarchy management

### [👤 Cổng Nhân viên (ESS)](./ess-portal.md)
- Self-service portal
- Thông tin cá nhân
- Nghỉ phép, tăng ca
- Phiếu lương

### [⏰ Chấm công](./time-attendance.md)
- Import dữ liệu chấm công
- Dashboard analytics
- Reports theo tháng/phòng ban
- Xử lý vi phạm

### [💰 Cài đặt Lương](./payroll-settings.md)
- Tính lương tự động
- Quản lý phúc lợi
- Export PDF/Excel
- Phiếu lương professional

### [📢 Thông báo](./announcements.md)
- Hệ thống communication
- Quản lý thông báo
- Targeting employees

## 🎯 Workflow Chính

### 🔄 Onboarding Nhân Viên Mới
1. **Tạo nhân viên** → Employee Management
2. **Tự động khởi tạo** → Phúc lợi mặc định
3. **Thiết lập** → Lương, phòng ban, chức vụ
4. **Cấp quyền** → ESS Portal access

### 📊 Monthly Payroll Process
1. **Import chấm công** → Time & Attendance  
2. **Tính lương** → Payroll Settings
3. **Review & Approve** → Salary calculation
4. **Export phiếu lương** → PDF/Excel format
5. **Distribute** → Email to employees

### 📈 Performance Review Cycle
1. **Set goals** → Dashboard/Performance
2. **Track progress** → Monthly reviews
3. **Analytics** → Performance reports
4. **Action plans** → Development plans

## 🔒 Phân Quyền & Bảo Mật

### 👨‍💼 HR Manager
- Full access tất cả modules
- CRUD operations
- Export sensitive data
- System configuration

### 👩‍💼 HR Staff  
- Employee management
- Payroll processing
- Reports generation
- Limited admin functions

### 👤 Employees
- ESS Portal only
- View personal information
- Submit requests
- Download payslips

### 🛡️ Data Security
- LocalStorage cho demo
- Sensitive data protection
- Role-based access control
- Audit trail logging

## 📞 Hỗ Trợ & Liên Hệ

### 🐛 Báo Lỗi
- Mô tả chi tiết lỗi
- Screenshots/Videos
- Browser và OS version
- Steps to reproduce

### 💡 Đề Xuất Tính Năng
- Feature request template
- Business justification
- Priority level
- Expected timeline

### 🆘 Hỗ Trợ Khẩn Cấp
- Critical system issues
- Data recovery
- Security incidents
- 24/7 support hotline

## 📚 Tài Liệu Kỹ Thuật

### 🔧 [API Documentation](./api-docs.md)
- Service functions
- Data structures
- Integration guides

### 🎨 [UI/UX Guidelines](./ui-guidelines.md)  
- Design system
- Component library
- Best practices

### 🧪 [Testing Guidelines](./testing.md)
- Test scenarios
- Quality assurance
- User acceptance testing

---

**📝 Version**: 1.0.0  
**📅 Last Updated**: December 2024  
**🔄 Update Frequency**: Monthly releases  
**👥 Maintained by**: Smartlog Development Team
