// Timesheeting Service
// Handle attendance processing, IN/OUT pairing, overtime calculation

import { getAttendanceRecords, getAttendanceByEmployee } from './attendanceData'

export const calculateWorkingHours = (checkIn, checkOut, shiftTemplate) => {
  if (!checkIn || !checkOut || !shiftTemplate) return null

  const checkInTime = new Date(checkIn)
  const checkOutTime = new Date(checkOut)
  
  if (checkOutTime <= checkInTime) return null

  // Calculate total minutes worked
  const totalMinutes = Math.floor((checkOutTime - checkInTime) / (1000 * 60))
  
  // Apply rounding rules
  const roundedCheckIn = applyRounding(checkInTime, shiftTemplate.roundingRules.checkIn, 'in')
  const roundedCheckOut = applyRounding(checkOutTime, shiftTemplate.roundingRules.checkOut, 'out')
  
  // Calculate break time
  const breakMinutes = calculateBreakTime(checkInTime, checkOutTime, shiftTemplate)
  
  // Net working hours
  const netMinutes = Math.floor((roundedCheckOut - roundedCheckIn) / (1000 * 60)) - breakMinutes
  const netHours = Math.round((netMinutes / 60) * 100) / 100 // Round to 2 decimals

  // Calculate late/early departure
  const shiftStart = parseTimeToDate(shiftTemplate.startTime, checkInTime)
  const shiftEnd = parseTimeToDate(shiftTemplate.endTime, checkInTime)
  
  const lateMinutes = Math.max(0, Math.floor((roundedCheckIn - shiftStart) / (1000 * 60)))
  const earlyMinutes = Math.max(0, Math.floor((shiftEnd - roundedCheckOut) / (1000 * 60)))
  
  // Calculate overtime (work beyond scheduled end time)
  const overtimeMinutes = Math.max(0, Math.floor((roundedCheckOut - shiftEnd) / (1000 * 60)))
  const overtimeHours = Math.round((overtimeMinutes / 60) * 100) / 100

  return {
    checkIn: checkInTime.toISOString(),
    checkOut: checkOutTime.toISOString(),
    roundedCheckIn: roundedCheckIn.toISOString(),
    roundedCheckOut: roundedCheckOut.toISOString(),
    totalMinutes,
    netMinutes,
    netHours,
    breakMinutes,
    lateMinutes,
    earlyMinutes,
    overtimeMinutes,
    overtimeHours,
    status: getAttendanceStatus(lateMinutes, earlyMinutes, netMinutes, shiftTemplate)
  }
}

export const applyRounding = (datetime, roundingMinutes, type) => {
  const rounded = new Date(datetime)
  const minutes = rounded.getMinutes()
  const seconds = rounded.getSeconds()
  
  // Set seconds to 0
  rounded.setSeconds(0, 0)
  
  if (roundingMinutes <= 0) return rounded
  
  const remainder = minutes % roundingMinutes
  
  if (type === 'in') {
    // Round check-in up (benefit employee)
    if (remainder > 0) {
      rounded.setMinutes(minutes + (roundingMinutes - remainder))
    }
  } else {
    // Round check-out down (benefit employee)
    if (remainder > 0) {
      rounded.setMinutes(minutes - remainder)
    }
  }
  
  return rounded
}

export const calculateBreakTime = (checkIn, checkOut, shiftTemplate) => {
  if (!shiftTemplate.breakStart || !shiftTemplate.breakEnd) return 0
  
  const breakStart = parseTimeToDate(shiftTemplate.breakStart, checkIn)
  const breakEnd = parseTimeToDate(shiftTemplate.breakEnd, checkIn)
  
  // Check if work period overlaps with break time
  if (checkOut <= breakStart || checkIn >= breakEnd) return 0
  
  const overlapStart = new Date(Math.max(checkIn, breakStart))
  const overlapEnd = new Date(Math.min(checkOut, breakEnd))
  
  return Math.floor((overlapEnd - overlapStart) / (1000 * 60))
}

export const parseTimeToDate = (timeString, referenceDate) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = new Date(referenceDate)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export const getAttendanceStatus = (lateMinutes, earlyMinutes, netMinutes, shiftTemplate) => {
  const standardMinutes = 8 * 60 // Standard 8-hour day
  
  if (netMinutes === 0) return 'absent'
  if (netMinutes < standardMinutes / 2) return 'half-day'
  if (lateMinutes > 15) return 'late'
  if (earlyMinutes > 15) return 'early'
  return 'present'
}

export const processAttendanceRecords = (employeeId, date, shiftTemplate) => {
  const records = getAttendanceByEmployee(employeeId, date, date)
  
  if (records.length === 0) {
    return {
      date,
      employeeId,
      status: 'absent',
      records: [],
      workingHours: null,
      anomalies: ['No attendance record']
    }
  }
  
  // Group records by type
  const ins = records.filter(r => r.type === 'in').sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
  const outs = records.filter(r => r.type === 'out').sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
  const breakStarts = records.filter(r => r.type === 'break_start')
  const breakEnds = records.filter(r => r.type === 'break_end')
  
  const anomalies = []
  let workingHours = null
  
  // Validation checks
  if (ins.length === 0) {
    anomalies.push('Missing check-in')
  }
  if (outs.length === 0) {
    anomalies.push('Missing check-out')
  }
  if (ins.length > 1) {
    anomalies.push(`Multiple check-ins (${ins.length})`)
  }
  if (outs.length > 1) {
    anomalies.push(`Multiple check-outs (${outs.length})`)
  }
  if (breakStarts.length !== breakEnds.length) {
    anomalies.push('Unmatched break records')
  }
  
  // Calculate working hours if we have basic in/out
  if (ins.length > 0 && outs.length > 0) {
    workingHours = calculateWorkingHours(ins[0].datetime, outs[outs.length - 1].datetime, shiftTemplate)
  }
  
  return {
    date,
    employeeId,
    records,
    workingHours,
    anomalies,
    status: workingHours?.status || 'error',
    processedAt: new Date().toISOString()
  }
}

export const generateDailyTimesheet = (date, employees, shiftTemplates, shiftAssignments) => {
  const timesheet = []
  
  employees.forEach(employee => {
    // Find employee's shift assignment
    const assignment = shiftAssignments.find(a => 
      a.employeeId === employee.id && 
      a.isActive && 
      new Date(a.effectiveDate) <= new Date(date) &&
      (!a.endDate || new Date(a.endDate) >= new Date(date))
    )
    
    const shiftTemplate = assignment ? 
      shiftTemplates.find(s => s.id === assignment.shiftTemplateId) : 
      shiftTemplates[0] // Default template
    
    const processed = processAttendanceRecords(employee.id, date, shiftTemplate)
    
    timesheet.push({
      ...processed,
      employee: {
        id: employee.id,
        code: employee.code,
        fullName: employee.fullName,
        department: employee.department
      },
      shiftTemplate: {
        id: shiftTemplate.id,
        name: shiftTemplate.name,
        startTime: shiftTemplate.startTime,
        endTime: shiftTemplate.endTime
      }
    })
  })
  
  return timesheet.sort((a, b) => a.employee.fullName.localeCompare(b.employee.fullName))
}

export const calculateMonthlyTimesheet = (employeeId, year, month, shiftTemplates, shiftAssignments) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const monthly = {
    employeeId,
    year,
    month,
    totalDays: daysInMonth,
    workingDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    earlyDays: 0,
    halfDays: 0,
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    lateMinutes: 0,
    earlyMinutes: 0,
    dailyRecords: []
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayOfWeek = new Date(year, month - 1, day).getDay()
    
    // Find shift template for this day
    const assignment = shiftAssignments.find(a => 
      a.employeeId === employeeId && 
      a.isActive && 
      new Date(a.effectiveDate) <= new Date(date) &&
      (!a.endDate || new Date(a.endDate) >= new Date(date))
    )
    
    const shiftTemplate = assignment ? 
      shiftTemplates.find(s => s.id === assignment.shiftTemplateId) : 
      null
    
    // Check if it's a working day
    const isWorkingDay = shiftTemplate?.workDays?.includes(dayOfWeek) ?? false
    
    if (isWorkingDay) {
      monthly.workingDays++
      
      const processed = processAttendanceRecords(employeeId, date, shiftTemplate)
      monthly.dailyRecords.push(processed)
      
      // Aggregate statistics
      switch (processed.status) {
        case 'present':
          monthly.presentDays++
          break
        case 'absent':
          monthly.absentDays++
          break
        case 'late':
          monthly.lateDays++
          monthly.presentDays++
          break
        case 'early':
          monthly.earlyDays++
          monthly.presentDays++
          break
        case 'half-day':
          monthly.halfDays++
          break
      }
      
      if (processed.workingHours) {
        monthly.totalHours += processed.workingHours.netHours
        monthly.regularHours += Math.min(processed.workingHours.netHours, 8)
        monthly.overtimeHours += processed.workingHours.overtimeHours
        monthly.lateMinutes += processed.workingHours.lateMinutes
        monthly.earlyMinutes += processed.workingHours.earlyMinutes
      }
    }
  }
  
  // Calculate attendance rate
  monthly.attendanceRate = monthly.workingDays > 0 ? 
    Math.round((monthly.presentDays / monthly.workingDays) * 100) : 0
  
  return monthly
}

export const detectAnomalies = (timesheet) => {
  const anomalies = []
  
  timesheet.forEach(record => {
    if (record.anomalies && record.anomalies.length > 0) {
      anomalies.push({
        type: 'data_quality',
        employeeId: record.employeeId,
        employee: record.employee,
        date: record.date,
        issues: record.anomalies,
        severity: 'high'
      })
    }
    
    if (record.workingHours) {
      const { lateMinutes, earlyMinutes, overtimeHours } = record.workingHours
      
      if (lateMinutes > 30) {
        anomalies.push({
          type: 'late_arrival',
          employeeId: record.employeeId,
          employee: record.employee,
          date: record.date,
          value: lateMinutes,
          severity: lateMinutes > 60 ? 'high' : 'medium'
        })
      }
      
      if (earlyMinutes > 30) {
        anomalies.push({
          type: 'early_departure',
          employeeId: record.employeeId,
          employee: record.employee,
          date: record.date,
          value: earlyMinutes,
          severity: earlyMinutes > 60 ? 'high' : 'medium'
        })
      }
      
      if (overtimeHours > 4) {
        anomalies.push({
          type: 'excessive_overtime',
          employeeId: record.employeeId,
          employee: record.employee,
          date: record.date,
          value: overtimeHours,
          severity: overtimeHours > 8 ? 'high' : 'medium'
        })
      }
    }
  })
  
  return anomalies
}

// Local storage functions for MVP
export const saveTimesheet = (timesheet) => {
  try {
    const existing = JSON.parse(localStorage.getItem('timesheets') || '[]')
    existing.push({
      ...timesheet,
      id: `timesheet_${timesheet.date || Date.now()}`,
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('timesheets', JSON.stringify(existing))
  } catch (error) {
    console.error('Error saving timesheet:', error)
  }
}

export const getTimesheets = (startDate, endDate) => {
  try {
    const timesheets = JSON.parse(localStorage.getItem('timesheets') || '[]')
    return timesheets.filter(t => {
      if (!t.date) return false
      return (!startDate || t.date >= startDate) && (!endDate || t.date <= endDate)
    })
  } catch (error) {
    console.error('Error loading timesheets:', error)
    return []
  }
}
