// Change History Service
// Track all changes to employee data for audit trail

export const logChange = (employeeId, field, oldValue, newValue, changedBy = 'system', reason = '') => {
  try {
    const change = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      employeeId: employeeId,
      field: field,
      oldValue: oldValue,
      newValue: newValue,
      changedBy: changedBy,
      reason: reason,
      timestamp: new Date().toISOString(),
      category: getFieldCategory(field)
    }

    let changeHistory = JSON.parse(localStorage.getItem('changeHistory') || '[]')
    changeHistory.unshift(change) // Add to beginning for chronological order
    
    // Keep only last 1000 changes to prevent localStorage bloat
    if (changeHistory.length > 1000) {
      changeHistory = changeHistory.slice(0, 1000)
    }
    
    localStorage.setItem('changeHistory', JSON.stringify(changeHistory))
    
    console.log('Change logged:', change)
    return change
  } catch (error) {
    console.error('Error logging change:', error)
    return null
  }
}

export const getEmployeeChangeHistory = (employeeId, limit = 50) => {
  try {
    const changeHistory = JSON.parse(localStorage.getItem('changeHistory') || '[]')
    return changeHistory
      .filter(change => change.employeeId === employeeId)
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting change history:', error)
    return []
  }
}

export const getAllChangeHistory = (limit = 100) => {
  try {
    const changeHistory = JSON.parse(localStorage.getItem('changeHistory') || '[]')
    return changeHistory.slice(0, limit)
  } catch (error) {
    console.error('Error getting all change history:', error)
    return []
  }
}

export const getFieldCategory = (field) => {
  const categoryMap = {
    // Thông tin cá nhân
    'fullName': 'personal',
    'birthDate': 'personal',
    'birthPlace': 'personal',
    'gender': 'personal',
    'cccdNumber': 'personal',
    'cccdIssueDate': 'personal',
    'cccdIssuePlace': 'personal',
    'maritalStatus': 'personal',
    
    // Liên hệ
    'personalPhone': 'contact',
    'personalEmail': 'contact',
    'temporaryAddress': 'contact',
    'permanentAddress': 'contact',
    
    // Liên hệ khẩn cấp
    'emergencyContactName': 'emergency',
    'emergencyContactRelation': 'emergency',
    'emergencyContactPhone': 'emergency',
    
    // Học vấn
    'highestDegree': 'education',
    'university': 'education',
    'major': 'education',
    'otherCertificates': 'education',
    'languages': 'education',
    'languageLevel': 'education',
    
    // Thuế & BHXH
    'socialInsuranceCode': 'tax',
    'taxCode': 'tax',
    
    // Công việc
    'department': 'work',
    'position': 'work',
    'level': 'work',
    'title': 'work',
    'contractType': 'work',
    'startDate': 'work',
    'contractDuration': 'work',
    'endDate': 'work',
    'probationSalary': 'salary',
    'officialSalary': 'salary',
    'status': 'work',
    
    // Phúc lợi
    'fuelAllowance': 'benefits',
    'mealAllowance': 'benefits',
    'transportAllowance': 'benefits',
    'uniformAllowance': 'benefits',
    'performanceBonus': 'benefits'
  }
  
  return categoryMap[field] || 'other'
}

export const getFieldDisplayName = (field) => {
  const displayNames = {
    'fullName': 'Họ và tên',
    'birthDate': 'Ngày sinh',
    'birthPlace': 'Nơi sinh',
    'gender': 'Giới tính',
    'cccdNumber': 'Số CCCD',
    'cccdIssueDate': 'Ngày cấp CCCD',
    'cccdIssuePlace': 'Nơi cấp CCCD',
    'maritalStatus': 'Tình trạng hôn nhân',
    'personalPhone': 'Điện thoại cá nhân',
    'personalEmail': 'Email cá nhân',
    'temporaryAddress': 'Địa chỉ tạm trú',
    'permanentAddress': 'Địa chỉ thường trú',
    'emergencyContactName': 'Tên người liên hệ khẩn cấp',
    'emergencyContactRelation': 'Quan hệ',
    'emergencyContactPhone': 'SĐT liên hệ khẩn cấp',
    'highestDegree': 'Bằng cấp cao nhất',
    'university': 'Trường đại học',
    'major': 'Chuyên ngành',
    'otherCertificates': 'Chứng chỉ khác',
    'languages': 'Ngôn ngữ',
    'languageLevel': 'Trình độ ngôn ngữ',
    'socialInsuranceCode': 'Mã BHXH',
    'taxCode': 'Mã số thuế',
    'department': 'Phòng ban',
    'position': 'Vị trí',
    'level': 'Cấp bậc',
    'title': 'Chức danh',
    'contractType': 'Loại hợp đồng',
    'startDate': 'Ngày bắt đầu',
    'contractDuration': 'Thời gian hợp đồng',
    'endDate': 'Ngày kết thúc',
    'probationSalary': 'Lương thử việc',
    'officialSalary': 'Lương chính thức',
    'status': 'Trạng thái',
    'fuelAllowance': 'Phụ cấp xăng xe',
    'mealAllowance': 'Phụ cấp ăn uống',
    'transportAllowance': 'Phụ cấp đi lại',
    'uniformAllowance': 'Phụ cấp đồng phục',
    'performanceBonus': 'Thưởng hiệu quả'
  }
  
  return displayNames[field] || field
}

export const getCategoryDisplayName = (category) => {
  const categoryNames = {
    'personal': 'Thông tin cá nhân',
    'contact': 'Thông tin liên hệ',
    'emergency': 'Liên hệ khẩn cấp',
    'education': 'Học vấn',
    'tax': 'Thuế & BHXH',
    'work': 'Công việc',
    'salary': 'Lương',
    'benefits': 'Phúc lợi',
    'other': 'Khác'
  }
  
  return categoryNames[category] || category
}

export const compareObjects = (oldObj, newObj, excludeFields = ['id', 'code', 'employeeCode']) => {
  const changes = []
  
  // Get all unique keys from both objects
  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})])
  
  for (const key of allKeys) {
    if (excludeFields.includes(key)) continue
    
    const oldValue = oldObj?.[key]
    const newValue = newObj?.[key]
    
    // Skip if values are the same
    if (oldValue === newValue) continue
    
    // Skip if both are empty/null/undefined
    if (!oldValue && !newValue) continue
    
    changes.push({
      field: key,
      oldValue: oldValue || '',
      newValue: newValue || ''
    })
  }
  
  return changes
}

export const logMultipleChanges = (employeeId, changes, changedBy = 'system', reason = '') => {
  return changes.map(change => 
    logChange(employeeId, change.field, change.oldValue, change.newValue, changedBy, reason)
  ).filter(Boolean)
}

