// Benefits Management Service
// Quản lý các phúc lợi custom cho nhân viên

// Default benefit types
const DEFAULT_BENEFIT_TYPES = [
  { id: 'transport', name: 'Phụ cấp xăng xe', type: 'allowance', category: 'transport', unit: 'VND/tháng' },
  { id: 'meal', name: 'Phụ cấp ăn uống', type: 'allowance', category: 'meal', unit: 'VND/tháng' },
  { id: 'phone', name: 'Phụ cấp điện thoại', type: 'allowance', category: 'communication', unit: 'VND/tháng' },
  { id: 'internet', name: 'Phụ cấp internet', type: 'allowance', category: 'communication', unit: 'VND/tháng' },
  { id: 'uniform', name: 'Phúc lợi đồng phục', type: 'benefit', category: 'equipment', unit: 'VND/năm' },
  { id: 'health_insurance', name: 'Bảo hiểm y tế bổ sung', type: 'insurance', category: 'health', unit: 'VND/năm' },
  { id: 'annual_bonus', name: 'Thưởng cuối năm', type: 'bonus', category: 'performance', unit: '%' },
  { id: 'travel_allowance', name: 'Phụ cấp di lại', type: 'allowance', category: 'travel', unit: 'VND/tháng' }
]

// Get all benefit types (default + custom)
export const getBenefitTypes = () => {
  const customTypes = JSON.parse(localStorage.getItem('custom_benefit_types') || '[]')
  return [...DEFAULT_BENEFIT_TYPES, ...customTypes]
}

// Create new custom benefit type
export const createBenefitType = (benefitType) => {
  const customTypes = JSON.parse(localStorage.getItem('custom_benefit_types') || '[]')
  
  const newBenefitType = {
    id: `custom_${Date.now()}`,
    name: benefitType.name,
    type: benefitType.type || 'allowance',
    category: benefitType.category || 'other',
    unit: benefitType.unit || 'VND/tháng',
    description: benefitType.description || '',
    isCustom: true,
    createdAt: new Date().toISOString(),
    createdBy: 'current_user' // In real app, get from auth context
  }
  
  customTypes.push(newBenefitType)
  localStorage.setItem('custom_benefit_types', JSON.stringify(customTypes))
  
  return newBenefitType
}

// Update benefit type
export const updateBenefitType = (id, updates) => {
  const customTypes = JSON.parse(localStorage.getItem('custom_benefit_types') || '[]')
  const index = customTypes.findIndex(type => type.id === id)
  
  if (index !== -1) {
    customTypes[index] = { ...customTypes[index], ...updates, updatedAt: new Date().toISOString() }
    localStorage.setItem('custom_benefit_types', JSON.stringify(customTypes))
    return customTypes[index]
  }
  
  return null
}

// Delete custom benefit type
export const deleteBenefitType = (id) => {
  const customTypes = JSON.parse(localStorage.getItem('custom_benefit_types') || '[]')
  const filteredTypes = customTypes.filter(type => type.id !== id)
  localStorage.setItem('custom_benefit_types', JSON.stringify(filteredTypes))
  return true
}

// Get employee benefits
export const getEmployeeBenefits = (employeeId) => {
  const employeeBenefits = JSON.parse(localStorage.getItem('employee_benefits') || '{}')
  return employeeBenefits[employeeId] || []
}

// Set employee benefits
export const setEmployeeBenefits = (employeeId, benefits) => {
  const employeeBenefits = JSON.parse(localStorage.getItem('employee_benefits') || '{}')
  employeeBenefits[employeeId] = benefits.map(benefit => ({
    ...benefit,
    updatedAt: new Date().toISOString()
  }))
  localStorage.setItem('employee_benefits', JSON.stringify(employeeBenefits))
  return employeeBenefits[employeeId]
}

// Add benefit to employee
export const addEmployeeBenefit = (employeeId, benefit) => {
  const currentBenefits = getEmployeeBenefits(employeeId)
  
  const newBenefit = {
    id: `benefit_${Date.now()}`,
    typeId: benefit.typeId,
    amount: benefit.amount || 0,
    startDate: benefit.startDate || new Date().toISOString().split('T')[0],
    endDate: benefit.endDate || null,
    isActive: benefit.isActive !== false,
    notes: benefit.notes || '',
    createdAt: new Date().toISOString(),
    createdBy: 'current_user'
  }
  
  const updatedBenefits = [...currentBenefits, newBenefit]
  return setEmployeeBenefits(employeeId, updatedBenefits)
}

// Update employee benefit
export const updateEmployeeBenefit = (employeeId, benefitId, updates) => {
  const currentBenefits = getEmployeeBenefits(employeeId)
  const index = currentBenefits.findIndex(b => b.id === benefitId)
  
  if (index !== -1) {
    currentBenefits[index] = { ...currentBenefits[index], ...updates, updatedAt: new Date().toISOString() }
    return setEmployeeBenefits(employeeId, currentBenefits)
  }
  
  return currentBenefits
}

// Remove employee benefit
export const removeEmployeeBenefit = (employeeId, benefitId) => {
  const currentBenefits = getEmployeeBenefits(employeeId)
  const filteredBenefits = currentBenefits.filter(b => b.id !== benefitId)
  return setEmployeeBenefits(employeeId, filteredBenefits)
}

// Calculate total benefits for employee (for payroll)
export const calculateEmployeeBenefits = (employeeId) => {
  const benefits = getEmployeeBenefits(employeeId)
  const benefitTypes = getBenefitTypes()
  
  let totalMonthly = 0
  let totalYearly = 0
  let benefitDetails = []
  
  benefits.forEach(benefit => {
    if (!benefit.isActive) return
    
    const benefitType = benefitTypes.find(type => type.id === benefit.typeId)
    if (!benefitType) return
    
    const amount = parseFloat(benefit.amount) || 0
    
    if (benefitType.unit.includes('tháng')) {
      totalMonthly += amount
    } else if (benefitType.unit.includes('năm')) {
      totalYearly += amount
      totalMonthly += amount / 12 // Convert to monthly equivalent
    }
    
    benefitDetails.push({
      id: benefit.id,
      name: benefitType.name,
      type: benefitType.type,
      category: benefitType.category,
      amount: amount,
      unit: benefitType.unit,
      monthlyEquivalent: benefitType.unit.includes('tháng') ? amount : amount / 12
    })
  })
  
  return {
    totalMonthly,
    totalYearly,
    benefitDetails,
    benefitCount: benefits.filter(b => b.isActive).length
  }
}

// Get benefits summary for payroll integration
export const getBenefitsSummary = (employeeIds = []) => {
  const summary = {}
  
  employeeIds.forEach(employeeId => {
    summary[employeeId] = calculateEmployeeBenefits(employeeId)
  })
  
  return summary
}

// Initialize default benefits for new employee
export const initializeDefaultBenefits = (employeeId, employeePosition = '') => {
  const defaultBenefits = []
  
  // Basic benefits for all employees
  defaultBenefits.push({
    typeId: 'transport',
    amount: 500000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    isActive: true,
    notes: 'Phụ cấp xăng xe mặc định'
  })
  
  defaultBenefits.push({
    typeId: 'meal',
    amount: 800000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    isActive: true,
    notes: 'Phụ cấp ăn uống mặc định'
  })
  
  // Position-based benefits
  if (employeePosition.toLowerCase().includes('manager') || 
      employeePosition.toLowerCase().includes('giám đốc') ||
      employeePosition.toLowerCase().includes('trưởng phòng')) {
    defaultBenefits.push({
      typeId: 'phone',
      amount: 300000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      isActive: true,
      notes: 'Phụ cấp điện thoại cho cấp quản lý'
    })
    
    defaultBenefits.push({
      typeId: 'annual_bonus',
      amount: 10, // 10%
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      isActive: true,
      notes: 'Thưởng cuối năm cho cấp quản lý'
    })
  }
  
  // Add all default benefits
  defaultBenefits.forEach(benefit => {
    addEmployeeBenefit(employeeId, benefit)
  })
  
  return getEmployeeBenefits(employeeId)
}

// Benefit categories for organization
export const BENEFIT_CATEGORIES = {
  transport: 'Đi lại',
  meal: 'Ăn uống',
  communication: 'Liên lạc',
  equipment: 'Trang thiết bị',
  health: 'Sức khỏe',
  performance: 'Hiệu suất',
  travel: 'Công tác',
  training: 'Đào tạo',
  family: 'Gia đình',
  other: 'Khác'
}

// Benefit types for classification
export const BENEFIT_TYPES = {
  allowance: 'Phụ cấp',
  bonus: 'Thưởng',
  insurance: 'Bảo hiểm',
  benefit: 'Phúc lợi',
  reimbursement: 'Hoàn tiền'
}
