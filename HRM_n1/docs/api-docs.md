# 🔧 API Documentation

## 📡 Service Functions Overview

### 👥 Employee Services (`src/services/api.js`)
```javascript
// Employee CRUD Operations
listEmployees() → Promise<Employee[]>
getEmployee(id) → Promise<Employee>
upsertEmployee(employee) → Promise<Employee>
deleteEmployee(id) → Promise<boolean>

// Department Operations  
listDepartments() → Promise<Department[]>
```

### 🎁 Benefits Services (`src/services/benefitsService.js`)
```javascript
// Benefit Types Management
getBenefitTypes() → BenefitType[]
createBenefitType(type) → BenefitType
updateBenefitType(id, updates) → BenefitType
deleteBenefitType(id) → boolean

// Employee Benefits
getEmployeeBenefits(employeeId) → Benefit[]
addEmployeeBenefit(employeeId, benefit) → Benefit[]
updateEmployeeBenefit(employeeId, benefitId, updates) → Benefit[]
removeEmployeeBenefit(employeeId, benefitId) → Benefit[]
calculateEmployeeBenefits(employeeId) → BenefitSummary
initializeDefaultBenefits(employeeId, position) → Benefit[]
```

### 💰 Payroll Services (`src/services/payrollService.js`)
```javascript
// Salary Calculations
calculateSalary(employee, month, year, attendance) → SalaryData
generateMonthlyPayroll(year, month, employeeIds) → PayrollData
formatNumber(number) → string
formatCurrency(amount) → string

// Export Functions
generatePayslipData(salaryData) → PayslipData
exportPayrollToExcel(payrollData) → ExcelData
```

### ⏰ Attendance Services
```javascript
// Attendance Data (`src/services/attendanceData.js`)
getAttendanceRecords(employeeId, month, year) → AttendanceRecord[]
generateMockAttendance(employeeId, month, year) → AttendanceData

// Reports (`src/services/attendanceReports.js`)
generateMonthlyReport(year, month, employeeIds) → MonthlyReport
generateViolationReport(startDate, endDate, departments) → ViolationReport
generateOvertimeReport(year, month, departments) → OvertimeReport
```

### 📄 Export Services
```javascript
// PDF Service (`src/services/pdfService.js`)
generatePayslipPDF(salaryData) → jsPDF
generatePayrollSummaryPDF(payrollData) → jsPDF
generateBulkPayslipsPDF(payrollArray) → jsPDF
downloadPDF(pdf, filename) → void
printPDF(pdf) → void

// Excel Service (`src/services/excelService.js`)
generatePayrollExcel(payrollData) → WorkBook
downloadExcel(workbook, filename) → void
```

## 📊 Data Structures

### 👤 Employee Object
```typescript
interface Employee {
  id: string
  employeeCode: string
  fullName: string
  email: string
  phone: string
  department: string
  position: string
  joinDate: string
  status: 'Active' | 'Inactive' | 'Probation'
  officialSalary: number
  // ... other fields from 8-tab form
}
```

### 🎁 Benefit Objects
```typescript
interface BenefitType {
  id: string
  name: string
  type: 'allowance' | 'bonus' | 'insurance' | 'benefit' | 'reimbursement'
  category: string
  unit: string
  description?: string
  isCustom?: boolean
  createdAt?: string
}

interface Benefit {
  id: string
  typeId: string
  amount: number
  startDate: string
  endDate?: string
  isActive: boolean
  notes?: string
  createdAt: string
}

interface BenefitSummary {
  totalMonthly: number
  totalYearly: number
  benefitDetails: BenefitDetail[]
  benefitCount: number
}
```

### 💰 Payroll Objects
```typescript
interface SalaryData {
  employeeId: string
  month: number
  year: number
  period: string
  employee: Employee
  attendance: AttendanceData
  salaryComponents: {
    basicSalary: number
    basePay: number
    overtimePay: number
    positionAllowance: number
    transportAllowance: number
    mealAllowance: number
    customBenefits: number
    customBenefitsDetails: BenefitDetail[]
  }
  grossSalary: number
  deductions: {
    socialInsurance: number
    healthInsurance: number
    unemploymentInsurance: number
    personalIncomeTax: number
    total: number
  }
  netSalary: number
}
```

## 🔐 LocalStorage Schema

### 📦 Storage Keys
```javascript
// Employee data
'employees' → Employee[]
'departments' → Department[]

// Benefits data  
'custom_benefit_types' → BenefitType[]
'employee_benefits' → { [employeeId]: Benefit[] }

// Payroll data
'payroll_history' → { [period]: PayrollData }
'salary_adjustments' → { [employeeId]: AdjustmentHistory[] }

// System data
'auth_user' → AuthUser
'app_settings' → AppSettings
```

### 🔄 Data Sync Flow
```
User Action → Service Function → LocalStorage Update → UI Refresh
    ↓                ↓               ↓                ↓
  Input Form → upsertEmployee() → Update 'employees' → Re-render List
```

---

**🔙 Back**: [📚 Documentation Home](./README.md)
