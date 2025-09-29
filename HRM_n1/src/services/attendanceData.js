// Attendance Data Service
// Handle attendance data collection, import, and processing

export const importAttendanceFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const csv = e.target.result
          const lines = csv.split('\n').filter(line => line.trim())
          
          if (lines.length < 2) {
            reject(new Error('File không có dữ liệu hợp lệ'))
            return
          }
          
          // Remove BOM if present
          const headers = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())
          const attendanceRecords = []
          
          // Expected headers: employee_id, employee_code, datetime, type, device_id, location
          const requiredHeaders = ['employee_id', 'datetime', 'type']
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
          
          if (missingHeaders.length > 0) {
            reject(new Error(`Thiếu cột bắt buộc: ${missingHeaders.join(', ')}`))
            return
          }
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
            
            if (values.length < headers.length || !values[0]) continue // Skip empty rows
            
            const record = {}
            headers.forEach((header, index) => {
              const value = values[index] || ''
              
              switch (header) {
                case 'employee_id':
                case 'employee_code':
                  record.employeeId = value
                  break
                case 'datetime':
                  // Parse various datetime formats
                  const dateTime = parseDateTime(value)
                  if (dateTime) {
                    record.datetime = dateTime.toISOString()
                    record.date = dateTime.toISOString().split('T')[0]
                    record.time = dateTime.toTimeString().split(' ')[0].substring(0, 5)
                  }
                  break
                case 'type':
                  record.type = value.toLowerCase() // 'in', 'out', 'break_start', 'break_end'
                  break
                case 'device_id':
                  record.deviceId = value
                  break
                case 'location':
                  record.location = value
                  break
                case 'terminal_id':
                  record.terminalId = value
                  break
                default:
                  record[header] = value
              }
            })
            
            // Generate ID and validate required fields
            if (record.employeeId && record.datetime && record.type) {
              record.id = `${record.employeeId}_${Date.parse(record.datetime)}_${record.type}`
              record.status = 'pending' // pending, processed, error
              record.importedAt = new Date().toISOString()
              attendanceRecords.push(record)
            }
          }
          
          resolve(attendanceRecords)
        } catch (parseError) {
          reject(new Error('Lỗi khi phân tích file: ' + parseError.message))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Lỗi khi đọc file'))
      }
      
      reader.readAsText(file, 'UTF-8')
    } catch (error) {
      reject(new Error('Lỗi khi xử lý file: ' + error.message))
    }
  })
}

export const parseDateTime = (dateTimeStr) => {
  try {
    // Support multiple formats:
    // 2024-12-15 08:30:00
    // 15/12/2024 08:30
    // 2024-12-15T08:30:00
    // 15-12-2024 08:30:00
    
    let cleanStr = dateTimeStr.trim()
    
    // Replace common separators
    cleanStr = cleanStr.replace(/\//g, '-')
    
    // Handle DD-MM-YYYY format
    if (/^\d{2}-\d{2}-\d{4}/.test(cleanStr)) {
      const parts = cleanStr.split(' ')
      const datePart = parts[0]
      const timePart = parts[1] || '00:00:00'
      
      const [day, month, year] = datePart.split('-')
      cleanStr = `${year}-${month}-${day} ${timePart}`
    }
    
    // Ensure time has seconds
    if (!/\d{2}:\d{2}:\d{2}/.test(cleanStr) && /\d{2}:\d{2}$/.test(cleanStr)) {
      cleanStr += ':00'
    }
    
    const date = new Date(cleanStr)
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateTimeStr)
      return null
    }
    
    return date
  } catch (error) {
    console.warn('Date parsing error:', error, dateTimeStr)
    return null
  }
}

export const validateAttendanceData = (records) => {
  const errors = []
  const warnings = []
  const employeeIds = new Set()
  
  records.forEach((record, index) => {
    const rowNum = index + 1
    
    // Required field validation
    if (!record.employeeId) {
      errors.push(`Dòng ${rowNum}: Thiếu mã nhân viên`)
    }
    if (!record.datetime) {
      errors.push(`Dòng ${rowNum}: Thiếu thời gian chấm công`)
    }
    if (!record.type) {
      errors.push(`Dòng ${rowNum}: Thiếu loại chấm công`)
    }
    
    // Type validation
    const validTypes = ['in', 'out', 'break_start', 'break_end']
    if (record.type && !validTypes.includes(record.type.toLowerCase())) {
      errors.push(`Dòng ${rowNum}: Loại chấm công không hợp lệ (${record.type})`)
    }
    
    // DateTime validation
    if (record.datetime) {
      const date = new Date(record.datetime)
      const now = new Date()
      
      if (date > now) {
        warnings.push(`Dòng ${rowNum}: Thời gian chấm công trong tương lai`)
      }
      
      // Check if datetime is more than 1 year old
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      if (date < oneYearAgo) {
        warnings.push(`Dòng ${rowNum}: Dữ liệu chấm công quá cũ (${record.date})`)
      }
    }
    
    employeeIds.add(record.employeeId)
  })
  
  return { 
    errors, 
    warnings, 
    isValid: errors.length === 0,
    totalRecords: records.length,
    uniqueEmployees: employeeIds.size
  }
}

export const processAttendanceRecords = async (records, onProgress) => {
  const results = {
    total: records.length,
    processed: 0,
    failed: 0,
    duplicates: 0,
    errors: []
  }
  
  // Get existing attendance records to check for duplicates
  const existingRecords = getAttendanceRecords()
  const existingIds = new Set(existingRecords.map(r => r.id))
  
  // Group records by employee and date for processing
  const groupedRecords = groupByEmployeeDate(records)
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    
    try {
      // Check for duplicates
      if (existingIds.has(record.id)) {
        results.duplicates++
        continue
      }
      
      // Process and save record
      await saveAttendanceRecord(record)
      results.processed++
      
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: records.length,
          percent: Math.round(((i + 1) / records.length) * 100)
        })
      }
      
    } catch (error) {
      results.failed++
      results.errors.push({
        record: `${record.employeeId} - ${record.datetime}`,
        error: error.message
      })
    }
  }
  
  return results
}

export const groupByEmployeeDate = (records) => {
  const grouped = {}
  
  records.forEach(record => {
    const key = `${record.employeeId}_${record.date}`
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(record)
  })
  
  // Sort records within each group by datetime
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
  })
  
  return grouped
}

export const generateAttendanceTemplate = () => {
  try {
    const headers = [
      'employee_id', 'employee_code', 'datetime', 'type', 'device_id', 'location', 'terminal_id'
    ]
    
    const sampleData = [
      'EMP001', 'EMP001', '2024-12-15 08:00:00', 'in', 'DEVICE01', 'Main Entrance', 'T001',
      'EMP001', 'EMP001', '2024-12-15 12:00:00', 'break_start', 'DEVICE01', 'Main Entrance', 'T001',
      'EMP001', 'EMP001', '2024-12-15 13:00:00', 'break_end', 'DEVICE01', 'Main Entrance', 'T001',
      'EMP001', 'EMP001', '2024-12-15 17:00:00', 'out', 'DEVICE01', 'Main Entrance', 'T001'
    ]
    
    const csvContent = [
      headers.join(','),
      sampleData.join(','),
      // Add empty rows for user input
      new Array(headers.length).fill('').join(','),
      new Array(headers.length).fill('').join(',')
    ].join('\n')
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `mau-import-cham-cong.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    return true
  } catch (error) {
    console.error('Error generating template:', error)
    throw new Error('Không thể tạo file mẫu')
  }
}

// Local storage functions for MVP
export const saveAttendanceRecord = async (record) => {
  const records = getAttendanceRecords()
  records.push({
    ...record,
    savedAt: new Date().toISOString()
  })
  localStorage.setItem('attendanceRecords', JSON.stringify(records))
  return record
}

export const getAttendanceRecords = () => {
  try {
    const records = localStorage.getItem('attendanceRecords')
    return records ? JSON.parse(records) : []
  } catch (error) {
    console.error('Error loading attendance records:', error)
    return []
  }
}

export const getAttendanceByEmployee = (employeeId, startDate, endDate) => {
  const records = getAttendanceRecords()
  return records.filter(record => {
    if (record.employeeId !== employeeId) return false
    if (startDate && record.date < startDate) return false
    if (endDate && record.date > endDate) return false
    return true
  }).sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
}

export const getAttendanceByDateRange = (startDate, endDate) => {
  const records = getAttendanceRecords()
  return records.filter(record => {
    return record.date >= startDate && record.date <= endDate
  }).sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
}

// Performance monitoring for 10k+ records
export const performanceMonitor = {
  start: (operation) => {
    const startTime = performance.now()
    console.log(`Starting ${operation}...`)
    return {
      operation,
      startTime,
      end: () => {
        const endTime = performance.now()
        const duration = endTime - startTime
        console.log(`${operation} completed in ${duration.toFixed(2)}ms`)
        return duration
      }
    }
  }
}
