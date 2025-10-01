# HRM System - Hệ thống Quản lý Nhân sự

Hệ thống HRM toàn diện được xây dựng với React và Tailwind CSS, hỗ trợ quản lý nhân sự cho doanh nghiệp có quy mô 500+ nhân viên.

## ✨ Tính năng chính

### 🔐 **Hệ thống xác thực**
- Đăng nhập với 2 cấp quyền: Admin (HR) và Nhân viên
- Quản lý phiên đăng nhập và bảo mật

### 📊 **Dashboard tổng quan**
- Thống kê nhân sự theo thời gian thực
- Biểu đồ chấm công và phân bố hợp đồng
- Hoạt động gần đây và thao tác nhanh
- Responsive design cho mọi thiết bị

### 👥 **Quản lý Nhân sự**
- **CRUD đầy đủ**: Thêm, sửa, xóa, tìm kiếm nhân viên
- **Hồ sơ chi tiết**: Thông tin cá nhân, công việc, lịch sử
- **Lọc và tìm kiếm**: Theo phòng ban, trạng thái, từ khóa
- **Quản lý trạng thái**: Active, Probation, Inactive

### 🏢 **Quản lý Phòng ban**
- Tạo và quản lý cơ cấu tổ chức
- Phân quyền theo cấp bậc
- Thống kê nhân sự theo phòng ban
- Quản lý trưởng phòng

### 🏠 **Employee Self-Service Portal (ESS)**
- **Thông tin cá nhân**: Xem và đề nghị cập nhật
- **Quản lý nghỉ phép**: 
  - Đăng ký nghỉ phép với nhiều loại
  - Theo dõi số ngày phép còn lại
  - Trạng thái duyệt/từ chối
- **Quản lý tăng ca**:
  - Đăng ký tăng ca theo giờ
  - Ghi chú lý do làm thêm
  - Theo dõi trạng thái phê duyệt

### ⏰ **Chấm công** (Khung sẵn)
- Chuẩn bị tích hợp với thiết bị chấm công
- Quản lý ca làm việc
- Xử lý correction requests

### 🔢 **Cài đặt Bảng lương**
- **Tính toán lương chi tiết**:
  - Lương cơ bản + tăng ca
  - BHXH, BHYT, BHTN
  - Thuế thu nhập cá nhân (thang lũy tiến)
- **Cấu hình linh hoạt**: Tỷ lệ bảo hiểm, giảm trừ gia cảnh
- **Preview tính lương**: Mô phỏng bảng lương theo tham số

### 📢 **Thông báo**
- Tạo và quản lý thông báo công ty
- Hiển thị theo thời gian
- Tìm kiếm trong nội dung

### 📊 **Báo cáo và Analytics** (Mở rộng)
- Dashboard phân tích
- Báo cáo tùy chỉnh
- Xuất dữ liệu

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd HRM-n1

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Ứng dụng sẽ chạy tại:
- **URL**: http://localhost:8386 (hoặc cổng khác nếu 8386 đã được sử dụng)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## 👤 Tài khoản Demo

### Admin (HR):
- **Email**: admin@company.com
- **Mật khẩu**: admin123
- **Quyền**: Toàn quyền quản lý hệ thống

### Nhân viên:
- **Email**: user@company.com  
- **Mật khẩu**: user123
- **Quyền**: ESS và xem thông tin cá nhân

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18**: Framework JavaScript hiện đại
- **Vite**: Build tool nhanh và hiệu quả
- **Tailwind CSS 3**: Utility-first CSS framework
- **React Router 6**: Routing và navigation
- **Lucide React**: Icon library đẹp và nhất quán

### Charts & Visualization
- **Recharts**: Thư viện biểu đồ cho React
- **Responsive design**: Tối ưu cho mọi kích thước màn hình

### State Management
- **React Context**: Quản lý state toàn cục
- **Local Storage**: Lưu trữ dữ liệu demo
- **Custom hooks**: Logic tái sử dụng

## 📁 Cấu trúc dự án

```
src/
├── components/          # Component tái sử dụng
│   ├── Layout.jsx      # Layout chính
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── Header.jsx      # Header với search và user menu
├── pages/              # Các trang chính
│   ├── Dashboard.jsx   # Trang tổng quan
│   ├── EmployeeManagement.jsx
│   ├── EmployeeProfile.jsx
│   ├── Departments.jsx
│   ├── ESS.jsx
│   ├── PayrollSettings.jsx
│   ├── Announcements.jsx
│   └── Login.jsx
├── services/           # API và business logic
│   ├── api.js         # Core API functions
│   ├── ess.js         # ESS services
│   └── payroll.js     # Payroll calculations
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── utils/              # Utilities
│   └── cn.js          # Class name utilities
└── index.css          # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Chính, trustworthy
- **Secondary**: Gray tones - Background và text
- **Success**: Green (#10b981) - Approved, positive states
- **Warning**: Yellow (#f59e0b) - Pending, attention
- **Error**: Red (#ef4444) - Rejected, errors

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Responsive typography với Tailwind classes

### Components
- **Cards**: Shadow effects với hover states
- **Buttons**: Primary, secondary, outline variants
- **Forms**: Consistent styling với validation states
- **Tables**: Responsive với sorting và filtering

## 🔧 Cấu hình API

Hệ thống hiện tại sử dụng **Local Storage** làm database demo. Để tích hợp với backend thật:

1. **Thay thế localStorage** bằng HTTP calls trong `src/services/`
2. **Cập nhật API endpoints** theo backend architecture
3. **Thêm error handling** và loading states
4. **Implement authentication** với JWT tokens

### API Structure (sẵn sàng mở rộng)
```javascript
// src/services/api.js
export async function listEmployees(filter) {
  // Thay localStorage bằng fetch/axios call
  // return fetch('/api/employees', { params: filter })
}
```

## 📱 Responsive Design

- **Mobile First**: Thiết kế ưu tiên mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Collapsible sidebar trên mobile
- **Tables**: Horizontal scroll trên màn hình nhỏ
- **Forms**: Stack layout trên mobile

## 🔐 Bảo mật

### Current (Demo)
- **Local Storage**: Session management
- **Client-side validation**: Form validation
- **Route protection**: Protected routes với auth check

### Production Ready
- **JWT Tokens**: Secure authentication
- **HTTPS**: SSL/TLS encryption  
- **CORS**: Cross-origin resource sharing
- **Input Sanitization**: XSS protection
- **Role-based Access**: Granular permissions

## 🚀 Tính năng sắp tới

### Phase 2
- [ ] **Module Chấm công hoàn chỉnh**: Tích hợp thiết bị, correction requests
- [ ] **Holiday Management**: Quản lý ngày nghỉ lễ
- [ ] **Advanced Attendance**: Face recognition, GPS tracking
- [ ] **Performance Management**: KPI tracking, reviews
- [ ] **Training Management**: Courses, certifications
- [ ] **Recruitment**: Job postings, candidate tracking

### Phase 3  
- [ ] **Mobile App**: React Native companion app
- [ ] **Advanced Analytics**: AI-powered insights
- [ ] **Document Management**: File storage và sharing
- [ ] **Workflow Automation**: Approval workflows
- [ ] **Integration**: Third-party services (Slack, email)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Hỗ trợ

- **Documentation**: Xem file `api_deploy.md` cho chi tiết API
- **Issues**: Tạo issue trên GitHub
- **Email**: support@hrmsystem.com

---

**HRM System v1.0** - Xây dựng bởi React với ❤️ cho doanh nghiệp Việt Nam.

