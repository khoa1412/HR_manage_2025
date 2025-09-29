// Payroll Settings API functions

export function getDefaultSettings() {
  return {
    id: "me",
    baseSalary: 15000000, // VND per month
    otRate: 1.5, // overtime rate
    currency: "VND",
    bhxhRate: 0.08, // social insurance rate
    bhytRate: 0.015, // health insurance rate  
    bhtnRate: 0.01, // unemployment insurance rate
    pitRate: 0.05, // personal income tax rate - simplified
    personalAllowance: 11000000 // VND default
  }
}

export async function readSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('payrollSettings') || '{}')
    
    // If no settings exist, return defaults
    if (Object.keys(settings).length === 0) {
      const defaultSettings = getDefaultSettings()
      localStorage.setItem('payrollSettings', JSON.stringify(defaultSettings))
      return defaultSettings
    }
    
    return { ...getDefaultSettings(), ...settings }
  } catch (error) {
    console.error('Error reading payroll settings:', error)
    return getDefaultSettings()
  }
}

export async function saveSettings(partialSettings) {
  try {
    const currentSettings = await readSettings()
    const updatedSettings = { ...currentSettings, ...partialSettings }
    
    localStorage.setItem('payrollSettings', JSON.stringify(updatedSettings))
    return updatedSettings
  } catch (error) {
    console.error('Error saving payroll settings:', error)
    throw error
  }
}

export function calculateNetSalary(settings, workingDays = 22, overtimeHours = 0) {
  const {
    baseSalary,
    otRate,
    bhxhRate,
    bhytRate,
    bhtnRate,
    pitRate,
    personalAllowance
  } = settings

  // Calculate gross salary
  const dailySalary = baseSalary / 22 // Assuming 22 working days per month
  const grossSalary = baseSalary + (overtimeHours * (dailySalary / 8) * otRate)

  // Calculate insurance deductions
  const bhxhDeduction = grossSalary * bhxhRate
  const bhytDeduction = grossSalary * bhytRate
  const bhtnDeduction = grossSalary * bhtnRate
  const totalInsurance = bhxhDeduction + bhytDeduction + bhtnDeduction

  // Calculate taxable income
  const taxableIncome = Math.max(0, grossSalary - totalInsurance - personalAllowance)
  
  // Calculate tax (simplified progressive tax)
  let tax = 0
  if (taxableIncome > 0) {
    if (taxableIncome <= 5000000) {
      tax = taxableIncome * 0.05
    } else if (taxableIncome <= 10000000) {
      tax = 5000000 * 0.05 + (taxableIncome - 5000000) * 0.10
    } else if (taxableIncome <= 18000000) {
      tax = 5000000 * 0.05 + 5000000 * 0.10 + (taxableIncome - 10000000) * 0.15
    } else {
      tax = 5000000 * 0.05 + 5000000 * 0.10 + 8000000 * 0.15 + (taxableIncome - 18000000) * 0.20
    }
  }

  // Calculate net salary
  const netSalary = grossSalary - totalInsurance - tax

  return {
    grossSalary,
    bhxhDeduction,
    bhytDeduction,
    bhtnDeduction,
    totalInsurance,
    taxableIncome,
    tax,
    netSalary,
    workingDays,
    overtimeHours
  }
}

