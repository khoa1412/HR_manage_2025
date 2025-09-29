// Bulk Actions Service for Employee Management
// Handle Import/Export operations

export const exportEmployeesToExcel = (employees) => {
  try {
    // Convert employee data to CSV format
    const headers = [
      'Mã NV', 'Họ và Tên', 'Email', 'Số điện thoại', 'Phòng ban', 
      'Vị trí', 'Trạng thái', 'Ngày vào làm', 'Số CCCD', 'Ngày sinh',
      'Địa chỉ tạm trú', 'Địa chỉ thường trú', 'Học vấn', 'Mã số thuế',
      'Mã BHXH', 'Loại hợp đồng', 'Lương thử việc', 'Lương chính thức'
    ]
    
    const csvContent = [
      headers.join(','),
      ...employees.map(emp => [
        emp.code || '',
        `"${emp.fullName || ''}"`,
        emp.personalEmail || emp.email || '',
        emp.personalPhone || emp.phone || '',
        `"${emp.department || ''}"`,
        `"${emp.position || ''}"`,
        emp.status || 'Active',
        emp.startDate || emp.joinDate || '',
        emp.cccdNumber || '',
        emp.birthDate || '',
        `"${emp.temporaryAddress || ''}"`,
        `"${emp.permanentAddress || ''}"`,
        `"${emp.highestDegree || ''}"`,
        emp.taxCode || '',
        emp.socialInsuranceCode || '',
        `"${emp.contractType || ''}"`,
        emp.trialSalary || '',
        emp.officialSalary || ''
      ].join(','))
    ].join('\n')
    
    // Create and download file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `danh-sach-nhan-vien-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    return true
  } catch (error) {
    console.error('Error exporting employees:', error)
    throw new Error('Không thể xuất file Excel')
  }
}

export const generateEmployeeTemplate = () => {
  try {
    const headers = [
      'Mã NV', 'Họ và Tên (*)', 'Email (*)', 'Số điện thoại (*)', 'Phòng ban (*)', 
      'Vị trí (*)', 'Trạng thái', 'Ngày vào làm (*)', 'Số CCCD', 'Ngày sinh',
      'Nơi sinh', 'Giới tính', 'Tình trạng hôn nhân', 'Địa chỉ tạm trú', 'Địa chỉ thường trú',
      'Liên hệ khẩn cấp - Tên', 'Liên hệ khẩn cấp - Quan hệ', 'Liên hệ khẩn cấp - SĐT',
      'Học vấn cao nhất', 'Trường tốt nghiệp', 'Chuyên ngành', 'Mã số thuế', 'Mã BHXH',
      'Loại hợp đồng (*)', 'Thời gian hợp đồng (tháng)', 'Lương thử việc', 'Lương chính thức'
    ]
    
    const sampleData = [
      'EMP001', 'Nguyễn Văn A', 'nguyen.van.a@company.com', '0901234567', 'Phòng IT',
      'Developer', 'Active', '2024-01-15', '123456789012', '1990-05-15',
      'Hà Nội', 'Nam', 'Độc thân', '123 Đường ABC, Hà Nội', '456 Đường XYZ, Hà Nội',
      'Nguyễn Thị B', 'Mẹ', '0987654321', 'Đại học', 'ĐH Bách khoa Hà Nội', 'Công nghệ thông tin',
      '1234567890', 'HN12345678', 'Chính thức', '24', '12000000', '15000000'
    ]
    
    const csvContent = [
      headers.join(','),
      sampleData.map(field => `"${field}"`).join(','),
      // Thêm 2 dòng trống để người dùng điền
      new Array(headers.length).fill('').join(','),
      new Array(headers.length).fill('').join(',')
    ].join('\n')
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `mau-import-nhan-vien.csv`)
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

export const parseCSVFile = (file) => {
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
          const headers = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.replace(/"/g, '').trim())
          const employees = []
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
            
            if (values.length < headers.length || !values[1]) continue // Skip empty rows or rows without name
            
            const employee = {}
            headers.forEach((header, index) => {
              const value = values[index] || ''
              
              // Map CSV headers to employee object properties
              switch (header) {
                case 'Mã NV':
                  employee.code = value
                  break
                case 'Họ và Tên (*)':
                case 'Họ và Tên':
                  employee.fullName = value
                  break
                case 'Email (*)':
                case 'Email':
                  employee.personalEmail = value
                  employee.email = value
                  break
                case 'Số điện thoại (*)':
                case 'Số điện thoại':
                  employee.personalPhone = value
                  employee.phone = value
                  break
                case 'Phòng ban (*)':
                case 'Phòng ban':
                  employee.department = value
                  break
                case 'Vị trí (*)':
                case 'Vị trí':
                  employee.position = value
                  break
                case 'Trạng thái':
                  employee.status = value || 'Active'
                  break
                case 'Ngày vào làm (*)':
                case 'Ngày vào làm':
                  employee.startDate = value
                  employee.joinDate = value
                  break
                case 'Số CCCD':
                  employee.cccdNumber = value
                  break
                case 'Ngày sinh':
                  employee.birthDate = value
                  break
                case 'Nơi sinh':
                  employee.birthPlace = value
                  break
                case 'Giới tính':
                  employee.gender = value
                  break
                case 'Tình trạng hôn nhân':
                  employee.maritalStatus = value
                  break
                case 'Địa chỉ tạm trú':
                  employee.temporaryAddress = value
                  break
                case 'Địa chỉ thường trú':
                  employee.permanentAddress = value
                  break
                case 'Liên hệ khẩn cấp - Tên':
                  employee.emergencyContactName = value
                  break
                case 'Liên hệ khẩn cấp - Quan hệ':
                  employee.emergencyContactRelation = value
                  break
                case 'Liên hệ khẩn cấp - SĐT':
                  employee.emergencyContactPhone = value
                  break
                case 'Học vấn cao nhất':
                  employee.highestDegree = value
                  break
                case 'Trường tốt nghiệp':
                  employee.university = value
                  break
                case 'Chuyên ngành':
                  employee.major = value
                  break
                case 'Mã số thuế':
                  employee.taxCode = value
                  break
                case 'Mã BHXH':
                  employee.socialInsuranceCode = value
                  break
                case 'Loại hợp đồng (*)':
                case 'Loại hợp đồng':
                  employee.contractType = value
                  break
                case 'Thời gian hợp đồng (tháng)':
                  employee.contractDuration = value
                  break
                case 'Lương thử việc':
                  employee.trialSalary = value
                  break
                case 'Lương chính thức':
                  employee.officialSalary = value
                  break
              }
            })
            
            // Generate ID and code if not provided
            employee.id = employee.code || `EMP${Date.now()}_${i}`
            if (!employee.code) {
              employee.code = `EMP${String(i).padStart(3, '0')}`
            }
            
            employees.push(employee)
          }
          
          resolve(employees)
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

export const validateImportData = (employees) => {
  const errors = []
  const warnings = []
  
  employees.forEach((emp, index) => {
    const rowNum = index + 2 // +2 vì có header và index bắt đầu từ 0
    
    // Required field validation
    if (!emp.fullName?.trim()) {
      errors.push(`Dòng ${rowNum}: Thiếu họ và tên`)
    }
    if (!emp.email?.trim()) {
      errors.push(`Dòng ${rowNum}: Thiếu email`)
    }
    if (!emp.phone?.trim()) {
      errors.push(`Dòng ${rowNum}: Thiếu số điện thoại`)
    }
    if (!emp.department?.trim()) {
      errors.push(`Dòng ${rowNum}: Thiếu phòng ban`)
    }
    if (!emp.position?.trim()) {
      errors.push(`Dòng ${rowNum}: Thiếu vị trí`)
    }
    if (!emp.startDate?.trim()) {
      errors.push(`Dòng ${rowNum}: Thiếu ngày vào làm`)
    }
    
    // Format validation
    if (emp.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email)) {
      errors.push(`Dòng ${rowNum}: Email không hợp lệ`)
    }
    if (emp.phone && !/^[0-9]{10,11}$/.test(emp.phone.replace(/\s/g, ''))) {
      errors.push(`Dòng ${rowNum}: Số điện thoại không hợp lệ`)
    }
    if (emp.cccdNumber && !/^[0-9]{12}$/.test(emp.cccdNumber.replace(/\s/g, ''))) {
      warnings.push(`Dòng ${rowNum}: Số CCCD không đúng định dạng`)
    }
    if (emp.taxCode && !/^[0-9]{10}$/.test(emp.taxCode.replace(/\s/g, ''))) {
      warnings.push(`Dòng ${rowNum}: Mã số thuế không đúng định dạng`)
    }
  })
  
  return { errors, warnings, isValid: errors.length === 0 }
}

export const bulkImportEmployees = async (employees, onProgress) => {
  const results = {
    total: employees.length,
    success: 0,
    failed: 0,
    errors: []
  }
  
  // Import employees one by one with progress callback
  for (let i = 0; i < employees.length; i++) {
    try {
      const { upsertEmployee } = await import('./api')
      await upsertEmployee(employees[i])
      results.success++
      
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: employees.length,
          percent: Math.round(((i + 1) / employees.length) * 100)
        })
      }
    } catch (error) {
      results.failed++
      results.errors.push({
        employee: employees[i].fullName || employees[i].code,
        error: error.message
      })
    }
  }
  
  return results
}
