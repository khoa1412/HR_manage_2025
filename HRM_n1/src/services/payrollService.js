// Payroll Service - Salary calculation and management
import { listEmployees, getEmployee } from './api'
import { calculateEmployeeBenefits } from './benefitsService'
import { getAttendanceRecords } from './attendanceData'

// Salary calculation logic
export const calculateSalary = (employee, month, year, attendanceData = null) => {
  const basicSalary = employee.officialSalary || 15000000
  const workingDays = 22 // Standard working days per month
  
  // Get attendance data if not provided
  let attendance = attendanceData
  if (!attendance) {
    attendance = generateMockAttendance(employee.id, month, year)
  }
  
  // Calculate components
  const dailyRate = basicSalary / workingDays
  const actualWorkDays = attendance.presentDays + (attendance.halfDays * 0.5)
  const basePay = dailyRate * actualWorkDays
  
  // Overtime calculation (1.5x rate)
  const overtimeRate = (basicSalary / workingDays / 8) * 1.5
  const overtimePay = attendance.overtimeHours * overtimeRate
  
  // Get custom benefits for employee
  const employeeBenefits = calculateEmployeeBenefits(employee.id)
  
  // Standard allowances
  const positionAllowance = calculatePositionAllowance(employee.position)
  const transportAllowance = 500000 // Default transport allowance
  const mealAllowance = actualWorkDays * 50000 // 50k per working day
  
  // Add custom benefits
  const customBenefitsAmount = employeeBenefits.totalMonthly || 0
  
  // Gross salary
  const grossSalary = basePay + overtimePay + positionAllowance + transportAllowance + mealAllowance + customBenefitsAmount
  
  // Deductions
  const socialInsurance = grossSalary * 0.08 // 8% BHXH
  const healthInsurance = grossSalary * 0.015 // 1.5% BHYT
  const unemploymentInsurance = grossSalary * 0.01 // 1% BHTN
  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance
  
  // Personal income tax
  const taxableIncome = Math.max(0, grossSalary - totalInsurance - 11000000) // 11M personal deduction
  const personalIncomeTax = calculatePersonalIncomeTax(taxableIncome)
  
  // Net salary
  const totalDeductions = totalInsurance + personalIncomeTax
  const netSalary = grossSalary - totalDeductions
  
  return {
    employeeId: employee.id,
    month,
    year,
    period: `${String(month).padStart(2, '0')}/${year}`,
    
    // Employee info
    employee: {
      id: employee.id,
      code: employee.code,
      fullName: employee.fullName,
      department: employee.department,
      position: employee.position,
      basicSalary: basicSalary
    },
    
    // Attendance
    attendance: {
      workingDays,
      presentDays: attendance.presentDays,
      absentDays: attendance.absentDays,
      halfDays: attendance.halfDays,
      overtimeHours: attendance.overtimeHours,
      actualWorkDays
    },
    
    // Salary components
    salaryComponents: {
      basicSalary,
      dailyRate: Math.round(dailyRate),
      basePay: Math.round(basePay),
      overtimeRate: Math.round(overtimeRate),
      overtimePay: Math.round(overtimePay),
      positionAllowance,
      transportAllowance,
      mealAllowance: Math.round(mealAllowance),
      customBenefits: Math.round(customBenefitsAmount),
      customBenefitsDetails: employeeBenefits.benefitDetails || []
    },
    
    // Totals
    grossSalary: Math.round(grossSalary),
    
    // Deductions
    deductions: {
      socialInsurance: Math.round(socialInsurance),
      healthInsurance: Math.round(healthInsurance),
      unemploymentInsurance: Math.round(unemploymentInsurance),
      totalInsurance: Math.round(totalInsurance),
      personalIncomeTax: Math.round(personalIncomeTax),
      total: Math.round(totalDeductions)
    },
    
    netSalary: Math.round(netSalary),
    
    // Metadata
    calculatedAt: new Date().toISOString(),
    status: 'calculated'
  }
}

const calculatePositionAllowance = (position) => {
  const allowances = {
    'CEO': 5000000,
    'Director': 3000000,
    'Manager': 2000000,
    'Team Lead': 1000000,
    'Senior': 500000,
    'Junior': 0
  }
  
  // Find matching position or default to 0
  for (const [key, value] of Object.entries(allowances)) {
    if (position?.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  return 0
}

const calculatePersonalIncomeTax = (taxableIncome) => {
  if (taxableIncome <= 0) return 0
  
  // Vietnam tax brackets (2024)
  const brackets = [
    { min: 0, max: 5000000, rate: 0.05 },
    { min: 5000000, max: 10000000, rate: 0.10 },
    { min: 10000000, max: 18000000, rate: 0.15 },
    { min: 18000000, max: 32000000, rate: 0.20 },
    { min: 32000000, max: 52000000, rate: 0.25 },
    { min: 52000000, max: 80000000, rate: 0.30 },
    { min: 80000000, max: Infinity, rate: 0.35 }
  ]
  
  let tax = 0
  let remainingIncome = taxableIncome
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break
    
    const taxableAtBracket = Math.min(remainingIncome, bracket.max - bracket.min)
    tax += taxableAtBracket * bracket.rate
    remainingIncome -= taxableAtBracket
  }
  
  return tax
}

const generateMockAttendance = (employeeId, month, year) => {
  // Generate realistic attendance data
  const presentDays = Math.floor(Math.random() * 3) + 20 // 20-22 days
  const absentDays = 22 - presentDays
  const halfDays = Math.floor(Math.random() * 2) // 0-1 half days
  const overtimeHours = Math.floor(Math.random() * 20) // 0-20 overtime hours
  
  return {
    presentDays,
    absentDays,
    halfDays,
    overtimeHours
  }
}

// Payroll management functions
export const generateMonthlyPayroll = async (month, year, departmentFilter = null) => {
  try {
    const employees = await listEmployees()
    const filteredEmployees = departmentFilter ? 
      employees.filter(emp => emp.department === departmentFilter) : 
      employees
    
    const payrollData = []
    
    for (const employee of filteredEmployees) {
      const salary = calculateSalary(employee, month, year)
      payrollData.push(salary)
    }
    
    // Calculate summary
    const summary = {
      totalEmployees: payrollData.length,
      totalGrossSalary: payrollData.reduce((sum, p) => sum + p.grossSalary, 0),
      totalNetSalary: payrollData.reduce((sum, p) => sum + p.netSalary, 0),
      totalDeductions: payrollData.reduce((sum, p) => sum + p.deductions.total, 0),
      totalOvertimePay: payrollData.reduce((sum, p) => sum + p.salaryComponents.overtimePay, 0),
      avgNetSalary: payrollData.length > 0 ? 
        Math.round(payrollData.reduce((sum, p) => sum + p.netSalary, 0) / payrollData.length) : 0
    }
    
    return {
      month,
      year,
      period: `${String(month).padStart(2, '0')}/${year}`,
      employees: payrollData.sort((a, b) => a.employee.fullName.localeCompare(b.employee.fullName)),
      summary,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error generating monthly payroll:', error)
    throw error
  }
}

export const savePayrollRecord = (payrollData) => {
  try {
    const existing = JSON.parse(localStorage.getItem('payrollRecords') || '[]')
    const recordId = `payroll_${payrollData.year}_${String(payrollData.month).padStart(2, '0')}`
    
    // Remove existing record for same period
    const filtered = existing.filter(p => p.id !== recordId)
    
    // Add new record
    filtered.push({
      id: recordId,
      ...payrollData,
      savedAt: new Date().toISOString()
    })
    
    localStorage.setItem('payrollRecords', JSON.stringify(filtered))
    return recordId
  } catch (error) {
    console.error('Error saving payroll record:', error)
    throw error
  }
}

export const getPayrollRecords = (startPeriod = null, endPeriod = null) => {
  try {
    const records = JSON.parse(localStorage.getItem('payrollRecords') || '[]')
    
    if (!startPeriod && !endPeriod) {
      return records.sort((a, b) => b.year - a.year || b.month - a.month)
    }
    
    return records.filter(record => {
      const period = `${record.year}${String(record.month).padStart(2, '0')}`
      const start = startPeriod ? startPeriod.replace('/', '') : '000000'
      const end = endPeriod ? endPeriod.replace('/', '') : '999999'
      return period >= start && period <= end
    }).sort((a, b) => b.year - a.year || b.month - a.month)
  } catch (error) {
    console.error('Error loading payroll records:', error)
    return []
  }
}

export const getEmployeeSalaryHistory = async (employeeId) => {
  try {
    const records = JSON.parse(localStorage.getItem('payrollRecords') || '[]')
    const employeeHistory = []
    
    for (const record of records) {
      const empSalary = record.employees.find(emp => emp.employeeId === employeeId)
      if (empSalary) {
        employeeHistory.push(empSalary)
      }
    }
    
    return employeeHistory.sort((a, b) => b.year - a.year || b.month - a.month)
  } catch (error) {
    console.error('Error loading employee salary history:', error)
    return []
  }
}

// PDF Export functions
export const generatePayslipPDF = async (salaryData) => {
  // This would integrate with a PDF library like jsPDF
  // For now, return formatted data for PDF generation
  return {
    title: `PHIẾU LƯƠNG THÁNG ${salaryData.period}`,
    employee: salaryData.employee,
    period: salaryData.period,
    content: {
      attendance: salaryData.attendance,
      salaryComponents: salaryData.salaryComponents,
      grossSalary: salaryData.grossSalary,
      deductions: salaryData.deductions,
      netSalary: salaryData.netSalary
    },
    generatedAt: new Date().toLocaleString('vi-VN'),
    fileName: `phieu-luong-${salaryData.employee.code}-${salaryData.year}-${String(salaryData.month).padStart(2, '0')}.pdf`
  }
}

export const exportPayrollToExcel = async (payrollData) => {
  // Prepare data for Excel export
  const worksheetData = payrollData.employees.map(emp => ({
    'Mã NV': emp.employee.code,
    'Họ tên': emp.employee.fullName,
    'Phòng ban': emp.employee.department,
    'Chức vụ': emp.employee.position,
    'Lương cơ bản': emp.employee.basicSalary,
    'Ngày công': emp.attendance.actualWorkDays,
    'Giờ tăng ca': emp.attendance.overtimeHours,
    'Lương cơ bản thực tế': emp.salaryComponents.basePay,
    'Tiền tăng ca': emp.salaryComponents.overtimePay,
    'Phụ cấp chức vụ': emp.salaryComponents.positionAllowance,
    'Phụ cấp đi lại': emp.salaryComponents.transportAllowance,
    'Phụ cấp ăn trưa': emp.salaryComponents.mealAllowance,
    'Tổng thu nhập': emp.grossSalary,
    'BHXH': emp.deductions.socialInsurance,
    'BHYT': emp.deductions.healthInsurance,
    'BHTN': emp.deductions.unemploymentInsurance,
    'Thuế TNCN': emp.deductions.personalIncomeTax,
    'Tổng khấu trừ': emp.deductions.total,
    'Lương thực nhận': emp.netSalary
  }))
  
  return {
    worksheetName: `Bảng lương ${payrollData.period}`,
    data: worksheetData,
    fileName: `bang-luong-${payrollData.year}-${String(payrollData.month).padStart(2, '0')}.xlsx`,
    summary: payrollData.summary
  }
}

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number)
}
