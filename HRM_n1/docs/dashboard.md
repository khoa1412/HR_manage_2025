# 🏠 Dashboard & Báo cáo

## 📊 Tổng Quan Module

Dashboard là trung tâm điều khiển chính của hệ thống HRM, tích hợp tất cả analytics, báo cáo và đánh giá hiệu suất trong một giao diện thống nhất. Module này cung cấp cái nhìn tổng quan về tình hình nhân sự, tài chính và hoạt động của công ty.

## 🎯 Mục Đích Sử Dụng

- **C-Level Executives**: Cái nhìn strategical về tình hình công ty
- **HR Managers**: Monitoring và quản lý nhân sự toàn diện  
- **Department Heads**: Theo dõi performance của team
- **Finance Team**: Phân tích chi phí lương và benefits

## 🧭 Cách Truy Cập

1. **Từ sidebar**: Click vào icon 🏠 "Dashboard"
2. **URL trực tiếp**: `http://localhost:3001/`
3. **Shortcut**: Dashboard là trang mặc định sau khi login

## 📱 Giao Diện & Tính Năng

### 🔧 Header Controls
```
┌─────────────────────────────────────────────────────┐
│ 📊 Dashboard & Báo cáo                    [🔄 Làm mới] │
│ Tổng hợp analytics, báo cáo và đánh giá hiệu suất    │
└─────────────────────────────────────────────────────┘
```

### 📋 4 Tab Chính

#### 1️⃣ **Tab Tổng Quan** 
**Chức năng**: Dashboard metrics tổng hợp
- **KPI Cards**: 4 cards hiển thị metrics chính
  - 👥 **Tổng nhân viên**: Số lượng + tăng trưởng
  - 💰 **Chi phí lương**: Tổng + trung bình/người  
  - ⏰ **Tỷ lệ chấm công**: % + giờ tăng ca
  - 🎯 **Hiệu suất TB**: Điểm/5.0 + số phòng ban

- **Interactive Charts**:
  - 📈 **Xu hướng 6 tháng**: Line chart performance metrics
  - 📊 **Hiệu suất phòng ban**: Bar chart so sánh
  - 🥧 **Phân bổ hiệu suất**: Pie chart distribution
  - 📋 **Chi tiết phòng ban**: Data table với metrics

#### 2️⃣ **Tab Phân Tích Chấm Công**
**Chức năng**: Thời gian làm việc theo tháng/quý/phòng ban

**🎛️ Filters & Controls**:
```
┌─ Khung thời gian ─┬─ Năm ─┬─ Quý ─┬─ [📥 Xuất báo cáo] ─┐
│  ● Theo tháng     │ 2024  │  Q4   │                      │
│  ○ Theo quý       │       │       │                      │  
│  ○ Theo năm       │       │       │                      │
└───────────────────┴───────┴───────┴──────────────────────┘
```

**📊 Analytics Components**:
- **Summary Cards**: Tỷ lệ chấm công TB, Tổng giờ tăng ca, Vi phạm, Ngày làm việc
- **Trends Chart**: Area chart xu hướng 12 tháng/8 quý/5 năm
- **Department Comparison**: Bar chart chấm công vs tăng ca
- **Productivity Metrics**: Line chart năng suất và hiệu quả
- **Violation Reports**: Table vi phạm gần đây với severity levels

#### 3️⃣ **Tab Phân Tích Lương**  
**Chức năng**: Chi phí lương và benefits theo kỳ

**💰 Financial Metrics**:
- **Chi phí lương tháng**: Tổng + growth rate vs kỳ trước
- **Lương trung bình**: Per employee + total headcount  
- **Chi phí/Nhân viên**: Monthly cost per capita
- **Chi phí tăng ca**: Total overtime expenses

**📈 Visualization**:
- **Salary Trends**: ComposedChart (Bar + Line) cho 12 tháng
- **Department Costs**: Bar chart chi phí theo phòng ban
- **Cost Structure**: Pie chart phân bổ (Lương cơ bản 70%, Phụ cấp 15%, Tăng ca 10%, Khác 5%)
- **Salary Distribution**: Bar chart phân bổ theo mức lương
- **Detailed Table**: Chi tiết chi phí từng phòng ban

#### 4️⃣ **Tab Đánh Giá Hiệu Suất**
**Chức năng**: Performance review và KPIs

**🔄 4 Sub-tabs**:

##### 📋 **Overview Sub-tab**
- **Performance KPIs**: Điểm TB, Hoàn thành mục tiêu, Nhân viên xuất sắc, Đánh giá hoàn thành
- **Performance Trends**: Line chart 6 quý (Điểm TB, Hoàn thành mục tiêu, Đánh giá)
- **Department Performance**: Bar chart hiệu suất theo phòng ban  
- **Top 10 Performers**: Ranking list với scores và achievements

##### ⭐ **Evaluations Sub-tab**  
- **[➕ Tạo đánh giá mới]** button
- **Evaluation Table**: Danh sách đánh giá với filters
  - Columns: Nhân viên, Điểm tổng, Mục tiêu (progress bar), Trạng thái, Đánh giá cuối
  - Actions: 👁️ Xem chi tiết, ✏️ Chỉnh sửa

##### 🎯 **Goals Sub-tab**
- **Goal Tracking Cards**: 4 KPI cards với progress bars
  - Revenue, Customer Satisfaction, Employee Retention, Training Completion  
- **Department Goals Analysis**: Table phân tích mục tiêu theo phòng ban
- **Progress Indicators**: Visual status (ahead/on-track/at-risk)

##### 📈 **Development Sub-tab**
- **Development Plans**: 3 programs với progress
  - Đào tạo kỹ năng mềm (80% hoàn thành)
  - Chứng chỉ chuyên môn (60% hoàn thành)  
  - Mentoring Program (90% tích cực)
- **Development Trends**: Line chart Training hours & Promotions
- **Individual Recommendations**: Table đề xuất phát triển cá nhân

## 🎛️ Controls & Interactions

### 🔄 Refresh Data
- **Button**: [🔄 Làm mới] ở header
- **Function**: Reload toàn bộ data cho tab hiện tại
- **Shortcut**: F5 hoặc Ctrl+R

### 📊 Period Selection
- **Monthly View**: 12 tháng gần đây
- **Quarterly View**: 8 quý gần đây  
- **Yearly View**: 5 năm gần đây
- **Dynamic**: Data tự động update khi chọn period

### 📥 Export Functions
- **Excel Reports**: Chi tiết data với formatting
- **PDF Reports**: Professional layout với charts
- **Print-friendly**: Optimized cho in ấn

## 📊 Data Sources & Calculations

### 👥 Employee Metrics
```javascript
// KPI Calculations
totalEmployees = employees.length
activeEmployees = employees.filter(emp => emp.status === 'Active').length  
attendanceRate = (presentToday / totalEmployees) * 100
avgPerformanceScore = evaluations.reduce(sum + score) / evaluations.length
```

### 💰 Salary Analytics  
```javascript
// Financial Calculations
totalMonthlyCost = payroll.summary.totalNetSalary
avgSalary = totalMonthlyCost / totalEmployees
salaryGrowthRate = (currentMonth - previousMonth) / previousMonth * 100
costPerEmployee = totalMonthlyCost / totalEmployees
```

### ⏰ Attendance Analysis
```javascript
// Attendance Calculations  
attendanceRate = (presentDays / totalWorkingDays) * 100
overtimeHours = records.reduce(sum + overtime)
violationCount = violations.filter(v => v.date === currentMonth).length
productivityScore = performance metrics weighted average
```

## 🎨 Visual Elements

### 📈 Chart Types
- **Line Charts**: Trends over time với smooth curves
- **Bar Charts**: Comparisons between departments  
- **Area Charts**: Cumulative data với gradient fills
- **Pie Charts**: Percentage breakdowns với custom colors
- **Composed Charts**: Multi-metric visualization

### 🎨 Color Scheme
- **Primary Blue**: #3B82F6 - Main actions, positive metrics
- **Success Green**: #10B981 - Achievements, completed items
- **Warning Yellow**: #F59E0B - Attention items, pending status  
- **Danger Red**: #EF4444 - Issues, violations, negative trends
- **Info Purple**: #8B5CF6 - Secondary metrics, neutral data

### 📱 Responsive Design
- **Desktop (1280px+)**: 4-column grids, full charts
- **Tablet (768-1279px)**: 2-column grids, compact charts
- **Mobile (< 768px)**: Single column, stacked layout

## 🔧 Troubleshooting

### ❌ Common Issues

#### 📊 Charts không hiển thị
**Nguyên nhân**: Browser không support SVG hoặc JS bị block
**Giải pháp**: 
1. Update browser lên version mới nhất
2. Enable JavaScript trong browser settings
3. Refresh page (Ctrl+F5)

#### 📉 Data không chính xác
**Nguyên nhân**: Cache cũ hoặc data source bị lỗi
**Giải pháp**:
1. Click [🔄 Làm mới] để reload data
2. Clear browser cache
3. Check LocalStorage có data đúng không

#### 🐌 Loading chậm
**Nguyên nhân**: Quá nhiều data cần process
**Giải pháp**:
1. Sử dụng filters để giảm data range
2. Chuyển sang view có ít data hơn (Year → Quarter → Month)
3. Close các tabs khác để giải phóng memory

### 🔍 Debug Mode
Mở Developer Console (F12) để xem logs:
```javascript
// Check data loading
console.log('Dashboard data:', dashboardData)

// Monitor performance  
console.time('Dashboard render')
// ... render complete
console.timeEnd('Dashboard render')
```

## 💡 Tips & Best Practices

### 📊 Dashboard Usage
1. **Start với Overview**: Hiểu tổng quan trước khi drill-down
2. **Use Filters**: Thu hẹp data scope để analysis hiệu quả
3. **Export Regular**: Tạo reports định kỳ cho management
4. **Monitor Trends**: Focus vào trends hơn là absolute numbers

### 🎯 Performance Optimization  
1. **Limit Date Range**: Không load quá nhiều data một lúc
2. **Close Unused Tabs**: Giảm memory consumption
3. **Regular Refresh**: Update data để đảm bảo accuracy
4. **Use Shortcuts**: Keyboard shortcuts cho faster navigation

### 📈 Data Interpretation
1. **Context is Key**: So sánh với baseline và targets
2. **Look for Patterns**: Identify seasonal trends và anomalies  
3. **Correlate Metrics**: Liên kết attendance với performance
4. **Action-Oriented**: Focus vào actionable insights

---

**📝 Next**: [👥 Quản lý Nhân sự](./employee-management.md)  
**🔙 Back**: [📚 Trang chủ](./README.md)
