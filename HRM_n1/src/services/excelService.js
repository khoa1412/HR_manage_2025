import * as XLSX from 'xlsx'
import { formatNumber } from './payrollService'

export const generatePayrollExcel = (payrollData) => {
  const workbook = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ['BẢNG LƯƠNG TỔNG HỢP'],
    [`Tháng ${payrollData.period}`],
    [''],
    ['THỐNG KÊ TỔNG QUAN'],
    ['Tổng nhân viên', payrollData.summary.totalEmployees],
    ['Tổng chi lương', payrollData.summary.totalNetSalary],
    ['Tổng thu nhập', payrollData.summary.totalGrossSalary || payrollData.employees.reduce((sum, emp) => sum + emp.grossSalary, 0)],
    ['Tổng khấu trừ', payrollData.summary.totalDeductions],
    ['Lương trung bình', payrollData.summary.avgNetSalary],
    ['Tổng tiền tăng ca', payrollData.summary.totalOvertimePay],
    [''],
    ['CHI TIẾT THEO PHÒNG BAN'],
  ]

  // Department breakdown
  const deptStats = {}
  payrollData.employees.forEach(emp => {
    const dept = emp.employee.department
    if (!deptStats[dept]) {
      deptStats[dept] = {
        count: 0,
        totalGross: 0,
        totalNet: 0,
        totalOT: 0
      }
    }
    deptStats[dept].count++
    deptStats[dept].totalGross += emp.grossSalary
    deptStats[dept].totalNet += emp.netSalary
    deptStats[dept].totalOT += emp.salaryComponents.overtimePay
  })

  Object.entries(deptStats).forEach(([dept, stats]) => {
    summaryData.push([
      dept,
      stats.count,
      stats.totalGross,
      stats.totalNet,
      stats.totalOT
    ])
  })

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
  
  // Style the summary sheet
  summaryWS['!cols'] = [
    { width: 25 },
    { width: 15 },
    { width: 20 },
    { width: 20 },
    { width: 20 }
  ]

  XLSX.utils.book_append_sheet(workbook, summaryWS, 'Tong quan')

  // Detailed payroll sheet
  const detailHeaders = [
    'STT',
    'Mã NV',
    'Họ tên',
    'Phòng ban',
    'Chức vụ',
    'Lương cơ bản',
    'Ngày công thực tế',
    'Ngày công chuẩn',
    'Giờ tăng ca',
    'Lương cơ bản thực tế',
    'Tiền tăng ca',
    'Phụ cấp chức vụ',
    'Phụ cấp đi lại',
    'Phụ cấp ăn trưa',
    'Tổng thu nhập',
    'BHXH (8%)',
    'BHYT (1.5%)',
    'BHTN (1%)',
    'Thuế TNCN',
    'Tổng khấu trừ',
    'Lương thực nhận',
    'Tỷ lệ chấm công (%)'
  ]

  const detailData = [detailHeaders]

  payrollData.employees.forEach((emp, index) => {
    const attendanceRate = emp.attendance.workingDays > 0 ? 
      Math.round((emp.attendance.actualWorkDays / emp.attendance.workingDays) * 100) : 0

    detailData.push([
      index + 1,
      emp.employee.code,
      emp.employee.fullName,
      emp.employee.department,
      emp.employee.position,
      emp.employee.basicSalary,
      emp.attendance.actualWorkDays,
      emp.attendance.workingDays,
      emp.attendance.overtimeHours,
      emp.salaryComponents.basePay,
      emp.salaryComponents.overtimePay,
      emp.salaryComponents.positionAllowance,
      emp.salaryComponents.transportAllowance,
      emp.salaryComponents.mealAllowance,
      emp.grossSalary,
      emp.deductions.socialInsurance,
      emp.deductions.healthInsurance,
      emp.deductions.unemploymentInsurance,
      emp.deductions.personalIncomeTax,
      emp.deductions.total,
      emp.netSalary,
      attendanceRate
    ])
  })

  // Add total row
  const totalRow = [
    '',
    '',
    'TỔNG CỘNG',
    '',
    '',
    '',
    payrollData.employees.reduce((sum, emp) => sum + emp.attendance.actualWorkDays, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.attendance.workingDays, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.attendance.overtimeHours, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.salaryComponents.basePay, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.salaryComponents.overtimePay, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.salaryComponents.positionAllowance, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.salaryComponents.transportAllowance, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.salaryComponents.mealAllowance, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.grossSalary, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.deductions.socialInsurance, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.deductions.healthInsurance, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.deductions.unemploymentInsurance, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.deductions.personalIncomeTax, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.deductions.total, 0),
    payrollData.employees.reduce((sum, emp) => sum + emp.netSalary, 0),
    Math.round(payrollData.employees.reduce((sum, emp) => {
      const rate = emp.attendance.workingDays > 0 ? 
        (emp.attendance.actualWorkDays / emp.attendance.workingDays) * 100 : 0
      return sum + rate
    }, 0) / payrollData.employees.length)
  ]

  detailData.push(totalRow)

  const detailWS = XLSX.utils.aoa_to_sheet(detailData)

  // Column widths for detail sheet
  detailWS['!cols'] = [
    { width: 8 },   // STT
    { width: 12 },  // Mã NV
    { width: 25 },  // Họ tên
    { width: 20 },  // Phòng ban
    { width: 20 },  // Chức vụ
    { width: 15 },  // Lương cơ bản
    { width: 12 },  // Ngày công thực tế
    { width: 12 },  // Ngày công chuẩn
    { width: 10 },  // Giờ tăng ca
    { width: 18 },  // Lương cơ bản thực tế
    { width: 15 },  // Tiền tăng ca
    { width: 15 },  // Phụ cấp chức vụ
    { width: 15 },  // Phụ cấp đi lại
    { width: 15 },  // Phụ cấp ăn trưa
    { width: 18 },  // Tổng thu nhập
    { width: 15 },  // BHXH
    { width: 15 },  // BHYT
    { width: 15 },  // BHTN
    { width: 15 },  // Thuế TNCN
    { width: 15 },  // Tổng khấu trừ
    { width: 18 },  // Lương thực nhận
    { width: 12 }   // Tỷ lệ chấm công
  ]

  XLSX.utils.book_append_sheet(workbook, detailWS, 'Chi tiet luong')

  // Individual payslips sheet (first 10 employees)
  const payslipEmployees = payrollData.employees.slice(0, 10)
  const payslipData = []

  payslipEmployees.forEach((emp, empIndex) => {
    if (empIndex > 0) {
      payslipData.push(['']) // Empty row between employees
    }

    payslipData.push([
      `PHIẾU LƯƠNG THÁNG ${payrollData.period}`,
      '',
      '',
      emp.employee.fullName
    ])
    payslipData.push([''])
    
    // Employee info
    payslipData.push(['Thông tin nhân viên'])
    payslipData.push(['Mã nhân viên:', emp.employee.code])
    payslipData.push(['Họ tên:', emp.employee.fullName])
    payslipData.push(['Phòng ban:', emp.employee.department])
    payslipData.push(['Chức vụ:', emp.employee.position])
    payslipData.push([''])

    // Salary breakdown
    payslipData.push(['Khoản mục', 'Số lượng', 'Đơn giá', 'Thành tiền'])
    payslipData.push([
      'Ngày công thực tế',
      `${emp.attendance.actualWorkDays}/${emp.attendance.workingDays}`,
      emp.salaryComponents.dailyRate,
      emp.salaryComponents.basePay
    ])
    payslipData.push([
      'Giờ tăng ca',
      `${emp.attendance.overtimeHours}h`,
      emp.salaryComponents.overtimeRate,
      emp.salaryComponents.overtimePay
    ])
    payslipData.push([
      'Phụ cấp chức vụ',
      '1',
      emp.salaryComponents.positionAllowance,
      emp.salaryComponents.positionAllowance
    ])
    payslipData.push([
      'Phụ cấp đi lại',
      '1',
      emp.salaryComponents.transportAllowance,
      emp.salaryComponents.transportAllowance
    ])
    payslipData.push([
      'Phụ cấp ăn trưa',
      `${emp.attendance.actualWorkDays} ngày`,
      50000,
      emp.salaryComponents.mealAllowance
    ])
    payslipData.push(['TỔNG THU NHẬP', '', '', emp.grossSalary])
    payslipData.push([''])

    // Deductions
    payslipData.push(['Các khoản khấu trừ'])
    payslipData.push(['BHXH (8%)', '', '', emp.deductions.socialInsurance])
    payslipData.push(['BHYT (1.5%)', '', '', emp.deductions.healthInsurance])
    payslipData.push(['BHTN (1%)', '', '', emp.deductions.unemploymentInsurance])
    payslipData.push(['Thuế TNCN', '', '', emp.deductions.personalIncomeTax])
    payslipData.push(['TỔNG KHẤU TRỪ', '', '', emp.deductions.total])
    payslipData.push([''])
    payslipData.push(['LƯƠNG THỰC NHẬN', '', '', emp.netSalary])
  })

  if (payslipData.length > 0) {
    const payslipWS = XLSX.utils.aoa_to_sheet(payslipData)
    payslipWS['!cols'] = [
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 20 }
    ]
    XLSX.utils.book_append_sheet(workbook, payslipWS, 'Phieu luong mau')
  }

  return workbook
}

export const generateAttendanceExcel = (attendanceData, month, year) => {
  const workbook = XLSX.utils.book_new()

  // Summary data
  const summaryData = [
    ['BÁO CÁO CHẤM CÔNG'],
    [`Tháng ${month}/${year}`],
    [''],
    ['THỐNG KÊ TỔNG QUAN'],
    ['Tổng nhân viên', attendanceData.summary.totalEmployees],
    ['Tổng ngày có mặt', attendanceData.summary.totalPresentDays],
    ['Tổng ngày vắng mặt', attendanceData.summary.totalAbsentDays],
    ['Tổng lần đi muộn', attendanceData.summary.totalLateDays],
    ['Tổng giờ tăng ca', attendanceData.summary.totalOvertimeHours],
    ['Tỷ lệ chấm công TB', `${attendanceData.summary.avgAttendanceRate}%`],
    ['']
  ]

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summaryWS, 'Tong quan')

  // Detailed attendance
  const detailHeaders = [
    'STT', 'Mã NV', 'Họ tên', 'Phòng ban', 'Ngày làm việc',
    'Ngày có mặt', 'Ngày vắng mặt', 'Lần đi muộn', 'Lần về sớm',
    'Giờ tăng ca', 'Tỷ lệ chấm công (%)'
  ]

  const detailData = [detailHeaders]

  attendanceData.employees.forEach((emp, index) => {
    detailData.push([
      index + 1,
      emp.employee.code,
      emp.employee.fullName,
      emp.employee.department,
      emp.workingDays,
      emp.presentDays,
      emp.absentDays,
      emp.lateDays,
      emp.earlyDays,
      emp.overtimeHours,
      emp.attendanceRate
    ])
  })

  const detailWS = XLSX.utils.aoa_to_sheet(detailData)
  detailWS['!cols'] = [
    { width: 8 }, { width: 12 }, { width: 25 }, { width: 20 },
    { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 },
    { width: 12 }, { width: 12 }, { width: 15 }
  ]

  XLSX.utils.book_append_sheet(workbook, detailWS, 'Chi tiet cham cong')

  return workbook
}

export const downloadExcel = (workbook, filename) => {
  XLSX.writeFile(workbook, filename)
}

export const generateEmployeeListExcel = (employees) => {
  const workbook = XLSX.utils.book_new()

  const headers = [
    'STT', 'Mã NV', 'Họ tên', 'Email', 'Điện thoại',
    'Phòng ban', 'Chức vụ', 'Ngày vào làm', 'Trạng thái',
    'Lương cơ bản', 'Địa chỉ'
  ]

  const data = [headers]

  employees.forEach((emp, index) => {
    data.push([
      index + 1,
      emp.code,
      emp.fullName,
      emp.email,
      emp.phone,
      emp.department,
      emp.position,
      emp.joinDate,
      emp.status,
      emp.officialSalary || 0,
      emp.address || ''
    ])
  })

  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [
    { width: 8 }, { width: 12 }, { width: 25 }, { width: 30 },
    { width: 15 }, { width: 20 }, { width: 20 }, { width: 12 },
    { width: 12 }, { width: 15 }, { width: 40 }
  ]

  XLSX.utils.book_append_sheet(workbook, ws, 'Danh sach nhan vien')

  return workbook
}
