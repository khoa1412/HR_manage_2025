// Attendance Reports Service
// Handle attendance reports and data export

import { generateDailyTimesheet, calculateMonthlyTimesheet, detectAnomalies } from './timesheeting'
import { listEmployees } from './api'

export const generateMonthlyReport = async (year, month, departments = []) => {
  try {
    const employees = await listEmployees()
    const filteredEmployees = departments.length > 0 ? 
      employees.filter(emp => departments.includes(emp.department)) : 
      employees

    // Generate mock monthly data for demo
    const monthlyData = filteredEmployees.map(employee => {
      const workingDays = 22
      const presentDays = Math.floor(Math.random() * 3) + 19 // 19-22 days
      const absentDays = workingDays - presentDays
      const lateDays = Math.floor(Math.random() * 4) // 0-3 late days
      const earlyDays = Math.floor(Math.random() * 2) // 0-1 early days
      const totalHours = presentDays * 8
      const overtimeHours = Math.floor(Math.random() * 20) // 0-20 overtime hours
      const attendanceRate = Math.round((presentDays / workingDays) * 100)

      return {
        employeeId: employee.id,
        year,
        month,
        workingDays,
        presentDays,
        absentDays,
        lateDays,
        earlyDays,
        halfDays: 0,
        totalHours,
        regularHours: Math.min(totalHours, presentDays * 8),
        overtimeHours,
        lateMinutes: lateDays * 15,
        earlyMinutes: earlyDays * 10,
        attendanceRate,
        employee: {
          id: employee.id,
          code: employee.code,
          fullName: employee.fullName,
          department: employee.department,
          position: employee.position
        }
      }
    })
    // Calculate summary statistics
    const summaryStats = {
      totalEmployees: monthlyData.length,
      totalWorkingDays: monthlyData.reduce((sum, emp) => sum + emp.workingDays, 0),
      totalPresentDays: monthlyData.reduce((sum, emp) => sum + emp.presentDays, 0),
      totalAbsentDays: monthlyData.reduce((sum, emp) => sum + emp.absentDays, 0),
      totalLateDays: monthlyData.reduce((sum, emp) => sum + emp.lateDays, 0),
      totalEarlyDays: monthlyData.reduce((sum, emp) => sum + emp.earlyDays, 0),
      totalOvertimeHours: monthlyData.reduce((sum, emp) => sum + emp.overtimeHours, 0),
      avgAttendanceRate: monthlyData.length > 0 ? 
        Math.round(monthlyData.reduce((sum, emp) => sum + emp.attendanceRate, 0) / monthlyData.length) : 0,
      departmentStats: monthlyData.reduce((acc, emp) => {
        const dept = emp.employee.department
        if (!acc[dept]) {
          acc[dept] = {
            employees: 0,
            presentDays: 0,
            absentDays: 0,
            overtimeHours: 0
          }
        }
        acc[dept].employees++
        acc[dept].presentDays += emp.presentDays
        acc[dept].absentDays += emp.absentDays
        acc[dept].overtimeHours += emp.overtimeHours
        return acc
      }, {})
    }

    return {
      year,
      month,
      employees: monthlyData.sort((a, b) => a.employee.fullName.localeCompare(b.employee.fullName)),
      summary: summaryStats,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error generating monthly report:', error)
    throw error
  }
}

export const generateViolationReport = async (startDate, endDate, departments = []) => {
  try {
    const employees = await listEmployees()
    const filteredEmployees = departments.length > 0 ? 
      employees.filter(emp => departments.includes(emp.department)) : 
      employees
    
    const violations = []
    const dateRange = generateDateRange(startDate, endDate)
    
    // Generate mock violations
    filteredEmployees.forEach(employee => {
      dateRange.forEach(date => {
        const dayOfWeek = new Date(date).getDay()
        
        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) return
        
        // Random chance of violations
        if (Math.random() < 0.15) { // 15% chance of violation per working day
          const violationTypes = [
            { type: 'late_arrival', severity: 'medium', value: Math.floor(Math.random() * 30) + 5 },
            { type: 'early_departure', severity: 'medium', value: Math.floor(Math.random() * 20) + 5 },
            { type: 'excessive_overtime', severity: 'high', value: Math.floor(Math.random() * 4) + 4 },
            { type: 'data_quality', severity: 'low', issues: ['Missing check-out'] }
          ]
          
          const violation = violationTypes[Math.floor(Math.random() * violationTypes.length)]
          
          violations.push({
            id: `violation_${employee.id}_${date}_${Date.now()}`,
            employeeId: employee.id,
            date,
            type: violation.type,
            severity: violation.severity,
            value: violation.value,
            issues: violation.issues,
            employee: {
              id: employee.id,
              code: employee.code,
              fullName: employee.fullName,
              department: employee.department
            }
          })
        }
      })
    })

    // Group violations by type
    const violationsByType = violations.reduce((acc, violation) => {
      if (!acc[violation.type]) acc[violation.type] = []
      acc[violation.type].push(violation)
      return acc
    }, {})

    // Statistics
    const stats = {
      totalViolations: violations.length,
      byType: Object.keys(violationsByType).map(type => ({
        type,
        count: violationsByType[type].length,
        percentage: Math.round((violationsByType[type].length / violations.length) * 100)
      })),
      bySeverity: {
        high: violations.filter(v => v.severity === 'high').length,
        medium: violations.filter(v => v.severity === 'medium').length,
        low: violations.filter(v => v.severity === 'low').length
      },
      byEmployee: violations.reduce((acc, violation) => {
        const key = violation.employee.id
        if (!acc[key]) {
          acc[key] = {
            employee: violation.employee,
            count: 0,
            types: new Set()
          }
        }
        acc[key].count++
        acc[key].types.add(violation.type)
        return acc
      }, {})
    }

    return {
      startDate,
      endDate,
      violations: violations.sort((a, b) => new Date(b.date) - new Date(a.date)),
      violationsByType,
      statistics: stats,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error generating violation report:', error)
    throw error
  }
}

export const generateOvertimeReport = async (year, month, departments = []) => {
  try {
    const employees = await listEmployees()
    const filteredEmployees = departments.length > 0 ? 
      employees.filter(emp => departments.includes(emp.department)) : 
      employees

    const overtimeData = []
    let totalOvertimeHours = 0
    let totalOvertimeCost = 0

    filteredEmployees.forEach(employee => {
      const regularHours = 176 // 22 days * 8 hours
      const overtimeHours = Math.floor(Math.random() * 25) // 0-25 overtime hours
      
      if (overtimeHours > 0) {
        const overtimeCost = calculateOvertimeCost(overtimeHours, employee.officialSalary || 15000000)
        
        // Generate daily overtime records
        const dailyOvertimes = []
        let remainingHours = overtimeHours
        for (let day = 1; day <= 22 && remainingHours > 0; day++) {
          if (Math.random() < 0.3) { // 30% chance of overtime on any day
            const dayHours = Math.min(Math.floor(Math.random() * 4) + 1, remainingHours)
            remainingHours -= dayHours
            dailyOvertimes.push({
              date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
              hours: dayHours,
              cost: calculateOvertimeCost(dayHours, employee.officialSalary || 15000000)
            })
          }
        }
        
        overtimeData.push({
          employee: {
            id: employee.id,
            code: employee.code,
            fullName: employee.fullName,
            department: employee.department,
            position: employee.position,
            salary: employee.officialSalary || 15000000
          },
          regularHours,
          overtimeHours,
          overtimeRate: 1.5, // 150% for overtime
          overtimeCost,
          dailyOvertimes
        })

        totalOvertimeHours += overtimeHours
        totalOvertimeCost += overtimeCost
      }
    })

    // Statistics
    const stats = {
      totalEmployees: overtimeData.length,
      totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
      totalOvertimeCost,
      avgOvertimePerEmployee: overtimeData.length > 0 ? 
        Math.round((totalOvertimeHours / overtimeData.length) * 100) / 100 : 0,
      topOvertimeEmployees: overtimeData
        .sort((a, b) => b.overtimeHours - a.overtimeHours)
        .slice(0, 10),
      departmentStats: overtimeData.reduce((acc, data) => {
        const dept = data.employee.department
        if (!acc[dept]) {
          acc[dept] = {
            employees: 0,
            totalHours: 0,
            totalCost: 0
          }
        }
        acc[dept].employees++
        acc[dept].totalHours += data.overtimeHours
        acc[dept].totalCost += data.overtimeCost
        return acc
      }, {})
    }

    return {
      year,
      month,
      overtimeData: overtimeData.sort((a, b) => b.overtimeHours - a.overtimeHours),
      statistics: stats,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error generating overtime report:', error)
    throw error
  }
}

export const calculateOvertimeCost = (overtimeHours, monthlySalary) => {
  const hourlyRate = monthlySalary / (22 * 8) // 22 working days, 8 hours per day
  return Math.round(overtimeHours * hourlyRate * 1.5) // 150% rate for overtime
}

export const generateDateRange = (startDate, endDate) => {
  const dates = []
  const current = new Date(startDate)
  const end = new Date(endDate)
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

export const exportToCSV = (data, filename) => {
  try {
    let csvContent = ''
    
    if (data.type === 'monthly') {
      // Monthly report CSV
      const headers = [
        'Mã NV', 'Họ và tên', 'Phòng ban', 'Chức vụ', 'Số ngày làm việc', 
        'Số ngày có mặt', 'Số ngày vắng mặt', 'Số lần đi muộn', 'Số lần về sớm',
        'Tổng giờ làm việc', 'Giờ tăng ca', 'Tỷ lệ chấm công (%)'
      ]
      
      csvContent = headers.join(',') + '\n'
      
      data.employees.forEach(emp => {
        const row = [
          emp.employee.code,
          `"${emp.employee.fullName}"`,
          `"${emp.employee.department}"`,
          `"${emp.employee.position}"`,
          emp.workingDays,
          emp.presentDays,
          emp.absentDays,
          emp.lateDays,
          emp.earlyDays,
          emp.totalHours,
          emp.overtimeHours,
          emp.attendanceRate
        ]
        csvContent += row.join(',') + '\n'
      })
    } else if (data.type === 'violations') {
      // Violations report CSV
      const headers = [
        'Ngày', 'Mã NV', 'Họ và tên', 'Phòng ban', 'Loại vi phạm', 'Mức độ', 'Giá trị', 'Mô tả'
      ]
      
      csvContent = headers.join(',') + '\n'
      
      data.violations.forEach(violation => {
        const row = [
          violation.date,
          violation.employee.code,
          `"${violation.employee.fullName}"`,
          `"${violation.employee.department}"`,
          getViolationTypeName(violation.type),
          violation.severity,
          violation.value || '',
          `"${getViolationDescription(violation)}"`
        ]
        csvContent += row.join(',') + '\n'
      })
    } else if (data.type === 'overtime') {
      // Overtime report CSV
      const headers = [
        'Mã NV', 'Họ và tên', 'Phòng ban', 'Giờ làm việc thường', 'Giờ tăng ca', 
        'Chi phí tăng ca', 'Số ngày tăng ca'
      ]
      
      csvContent = headers.join(',') + '\n'
      
      data.overtimeData.forEach(ot => {
        const row = [
          ot.employee.code,
          `"${ot.employee.fullName}"`,
          `"${ot.employee.department}"`,
          ot.regularHours,
          ot.overtimeHours,
          ot.overtimeCost,
          ot.dailyOvertimes.length
        ]
        csvContent += row.join(',') + '\n'
      })
    }
    
    // Download CSV file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    return true
  } catch (error) {
    console.error('Error exporting CSV:', error)
    throw new Error('Không thể xuất file CSV')
  }
}

export const getViolationTypeName = (type) => {
  const types = {
    late_arrival: 'Đi muộn',
    early_departure: 'Về sớm',
    excessive_overtime: 'Tăng ca quá mức',
    data_quality: 'Lỗi dữ liệu',
    missing_checkin: 'Thiếu chấm công vào',
    missing_checkout: 'Thiếu chấm công ra'
  }
  return types[type] || type
}

export const getViolationDescription = (violation) => {
  switch (violation.type) {
    case 'late_arrival':
      return `Đi muộn ${violation.value} phút`
    case 'early_departure':
      return `Về sớm ${violation.value} phút`
    case 'excessive_overtime':
      return `Tăng ca ${violation.value} giờ`
    case 'data_quality':
      return violation.issues?.join(', ') || 'Lỗi dữ liệu'
    default:
      return violation.description || ''
  }
}

// Mock data for demo
export const getSampleReportData = () => {
  return {
    monthly: {
      type: 'monthly',
      year: 2024,
      month: 12,
      employees: [
        {
          employee: {
            code: 'EMP001',
            fullName: 'Nguyễn Văn An',
            department: 'Phòng IT',
            position: 'Developer'
          },
          workingDays: 22,
          presentDays: 21,
          absentDays: 1,
          lateDays: 2,
          earlyDays: 0,
          totalHours: 168,
          overtimeHours: 12,
          attendanceRate: 95.5
        }
      ]
    }
  }
}
