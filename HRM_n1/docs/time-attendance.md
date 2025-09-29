# ⏰ Chấm công

## 📋 Tổng Quan Module

Module Chấm công quản lý toàn bộ quy trình time tracking từ import dữ liệu, xử lý logic chấm công, đến báo cáo và analytics. Hỗ trợ multiple formats và provide insights chi tiết.

## 🎯 Mục Đích Sử Dụng

- **👩‍💼 HR Staff**: Import và process attendance data
- **👨‍💼 HR Manager**: Review reports và handle violations
- **👨‍💻 Department Heads**: Monitor team attendance
- **📊 Analysts**: Attendance analytics và trends

## 🧭 Cách Truy Cập

1. **Từ sidebar**: Click vào icon ⏰ "Chấm công"
2. **URL trực tiếp**: `http://localhost:3001/attendance`

## 📱 Tab Structure & Features

### 📊 **Dashboard Chấm công Tab**
```
┌─────────────────────────────────────────────────────┐
│ 📅 Calendar View - Tháng 12/2024                   │
├─────────────────────────────────────────────────────┤
│ │ T2 │ T3 │ T4 │ T5 │ T6 │ T7 │ CN │              │
│ ├────┼────┼────┼────┼────┼────┼────┤              │
│ │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │              │
│ │8:00│8:15│8:00│7:45│8:30│    │    │              │
│ │    │Late│    │Early│Late│    │    │              │
├─────────────────────────────────────────────────────┤
│ 👥 Danh sách nhân viên hôm nay:                    │
│ ✅ Nguyễn A - 8:00 AM │ ⚠️ Trần B - 8:15 AM (Late)│
│ ✅ Lê C - 7:45 AM     │ ❌ Phạm D - Vắng mặt      │
└─────────────────────────────────────────────────────┘
```

### 📥 **Import Data Tab**
- **File Upload**: Drag & drop CSV/XLSX files
- **Format Support**: Multiple timesheet formats
- **Data Validation**: Real-time validation during import
- **Error Handling**: Detailed error reports
- **Preview**: Data preview trước khi import final

### ⚙️ **Timesheet Processing Tab** 
- **Processing Rules**: Configure work hours, break times
- **Shift Management**: Define multiple shifts
- **Overtime Calculation**: Auto-calculate OT based on rules
- **Exception Handling**: Handle anomalies và missing data

### 📊 **Reports Tab**
```
┌─ Report Type ─┬─ Period ─┬─ Department ─┬─ [Generate] ─┐
│ ● Monthly     │ 12/2024  │ All         │              │
│ ○ Violation   │          │             │              │
│ ○ Overtime    │          │             │              │
└───────────────┴──────────┴─────────────┴──────────────┘

📈 Generated Reports:
├─ Monthly Attendance Summary (PDF/Excel)
├─ Violation Report với severity levels  
├─ Overtime Analysis với cost breakdown
└─ Department Comparison charts
```

### 🎛️ **Settings Tab**
- **Work Schedule**: Define standard work hours
- **Holiday Calendar**: Configure company holidays  
- **Overtime Rules**: Set OT calculation policies
- **Notification Rules**: Alert settings for violations

## 📊 Analytics & Insights

### 📈 **Attendance Metrics**
- **Overall Rate**: Company-wide attendance percentage
- **Department Breakdown**: Per-department statistics
- **Trend Analysis**: Monthly/quarterly trends
- **Violation Tracking**: Late arrivals, early departures

### 💰 **Cost Analysis**
- **Regular Hours Cost**: Standard work time cost
- **Overtime Premium**: OT cost với multipliers
- **Department Costs**: Cost breakdown by department
- **Budget Variance**: Actual vs projected costs

### 🔍 **Anomaly Detection**
- **Pattern Recognition**: Identify unusual patterns
- **Violation Scoring**: Risk-based scoring system
- **Predictive Alerts**: Early warning systems
- **Automated Flagging**: Auto-flag suspicious activities

---

**📝 Next**: [💰 Cài đặt Lương](./payroll-settings.md)  
**🔙 Back**: [👤 Cổng Nhân viên](./ess-portal.md)
