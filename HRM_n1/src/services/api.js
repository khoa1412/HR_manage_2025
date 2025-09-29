// API Service Layer Functions để tương tác với backend
import { compareObjects, logMultipleChanges } from './changeHistory'

// Authentication
export function getCurrentUserId() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('currentUserId')
}

export function setCurrentUserId(id) {
  if (typeof window === 'undefined') return
  localStorage.setItem('currentUserId', id)
}

export function getIsHR() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isHR') === 'true'
}

export function setIsHR(v) {
  if (typeof window === 'undefined') return
  localStorage.setItem('isHR', v.toString())
}

// Employee Management
export async function listEmployees(filter = {}) {
  try {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]')
    
    // Apply filters
    let filtered = employees
    if (filter.q) {
      filtered = filtered.filter(emp => 
        emp.fullName.toLowerCase().includes(filter.q.toLowerCase()) ||
        emp.email.toLowerCase().includes(filter.q.toLowerCase()) ||
        emp.code.toLowerCase().includes(filter.q.toLowerCase())
      )
    }
    if (filter.department) {
      filtered = filtered.filter(emp => emp.department === filter.department)
    }
    if (filter.status) {
      filtered = filtered.filter(emp => emp.status === filter.status)
    }
    
    return filtered
  } catch (error) {
    console.error('Error listing employees:', error)
    return []
  }
}

export async function upsertEmployee(input) {
  try {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]')
    const currentUserId = getCurrentUserId()
    
    if (input.id) {
      // Update existing - track changes
      const index = employees.findIndex(emp => emp.id === input.id)
      if (index !== -1) {
        const oldEmployee = { ...employees[index] }
        const newEmployee = { ...employees[index], ...input }
        
        // Compare and log changes
        const changes = compareObjects(oldEmployee, newEmployee)
        if (changes.length > 0) {
          logMultipleChanges(
            input.id, 
            changes, 
            currentUserId || 'system',
            'Cập nhật thông tin nhân viên'
          )
        }
        
        employees[index] = newEmployee
        localStorage.setItem('employees', JSON.stringify(employees))
        return employees[index]
      }
    }
    
    // Create new
    const newEmployee = {
      id: Date.now().toString(),
      code: `EMP${Date.now()}`,
      ...input
    }
    employees.push(newEmployee)
    localStorage.setItem('employees', JSON.stringify(employees))
    
    // Log creation
    logMultipleChanges(
      newEmployee.id,
      [{ field: 'created', oldValue: '', newValue: 'Tạo hồ sơ nhân viên mới' }],
      currentUserId || 'system',
      'Tạo nhân viên mới'
    )
    
    return newEmployee
  } catch (error) {
    console.error('Error upserting employee:', error)
    throw error
  }
}

export async function deleteEmployee(id) {
  try {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]')
    const filtered = employees.filter(emp => emp.id !== id)
    localStorage.setItem('employees', JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting employee:', error)
    throw error
  }
}

export async function getEmployee(id) {
  try {
    let employees = JSON.parse(localStorage.getItem('employees') || '[]')
    
    // Seed sample employees if none exist
    if (employees.length === 0) {
      const sampleEmployees = [
        {
          id: '1',
          code: 'EMP001',
          fullName: 'Nguyễn Văn Admin',
          email: 'admin@company.com',
          phone: '0901234567',
          department: 'Phòng Nhân sự',
          position: 'HR Manager',
          status: 'Active',
          joinDate: '2022-01-01',
          managerId: null
        },
        {
          id: '2',
          code: 'EMP002',
          fullName: 'Trần Thị User',
          email: 'user@company.com',
          phone: '0902345678',
          department: 'Phòng IT',
          position: 'Developer',
          status: 'Active',
          joinDate: '2023-01-15',
          managerId: '1'
        }
      ]
      localStorage.setItem('employees', JSON.stringify(sampleEmployees))
      employees = sampleEmployees
    }
    
    return employees.find(emp => emp.id === id)
  } catch (error) {
    console.error('Error getting employee:', error)
    return undefined
  }
}

export async function updateEmployeeSalary(employeeId, newSalary) {
  try {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]')
    const currentUserId = getCurrentUserId()
    const index = employees.findIndex(emp => emp.id === employeeId)

    if (index !== -1) {
      const oldSalary = employees[index].officialSalary
      employees[index].officialSalary = newSalary
      localStorage.setItem('employees', JSON.stringify(employees))

      logMultipleChanges(
        employeeId,
        [{ field: 'officialSalary', oldValue: oldSalary, newValue: newSalary }],
        currentUserId || 'system',
        'Cập nhật lương cơ bản'
      )
      return employees[index]
    }
    throw new Error('Employee not found')
  } catch (error) {
    console.error('Error updating employee salary:', error)
    throw error
  }
}

// Department Management
export async function listDepartments() {
  try {
    const departments = JSON.parse(localStorage.getItem('departments') || '[]')
    
    // Seed default departments if empty
    if (departments.length === 0) {
      const defaultDepartments = [
        {
          id: '1',
          code: 'HR',
          name: 'Phòng Nhân sự',
          description: 'Quản lý nhân sự và tuyển dụng',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          code: 'IT',
          name: 'Phòng IT',
          description: 'Phát triển và bảo trì hệ thống',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          code: 'ACCT',
          name: 'Phòng Kế toán',
          description: 'Quản lý tài chính và kế toán',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('departments', JSON.stringify(defaultDepartments))
      return defaultDepartments
    }
    
    return departments.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error listing departments:', error)
    return []
  }
}

export async function upsertDepartment(input) {
  try {
    const departments = JSON.parse(localStorage.getItem('departments') || '[]')
    const currentUserId = getCurrentUserId()

    if (input.id) {
      // Update existing
      const index = departments.findIndex(dept => dept.id === input.id)
      if (index !== -1) {
        const oldDepartment = { ...departments[index] }
        const newDepartment = {
          ...oldDepartment,
          ...input,
          updatedAt: new Date().toISOString()
        }

        const changes = compareObjects(oldDepartment, newDepartment)
        if (changes.length > 0) {
          logMultipleChanges(
            `department-${input.id}`,
            changes,
            currentUserId || 'system',
            'Cập nhật phòng ban'
          )
        }

        departments[index] = newDepartment
        localStorage.setItem('departments', JSON.stringify(departments))
        return newDepartment
      }
    }

    // Create new
    const newDepartment = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input
    }
    departments.push(newDepartment)
    localStorage.setItem('departments', JSON.stringify(departments))

    logMultipleChanges(
      `department-${newDepartment.id}`,
      [{ field: 'created', oldValue: '', newValue: 'Tạo phòng ban mới' }],
      currentUserId || 'system',
      'Tạo phòng ban mới'
    )

    return newDepartment
  } catch (error) {
    console.error('Error upserting department:', error)
    throw error
  }
}

export async function deleteDepartment(id) {
  try {
    const departments = JSON.parse(localStorage.getItem('departments') || '[]')
    const filtered = departments.filter(dept => dept.id !== id)
    localStorage.setItem('departments', JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting department:', error)
    return false
  }
}

// Announcements
export function listAnnouncements() {
  try {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]')
    
    // Seed default announcement if empty
    if (announcements.length === 0) {
      const defaultAnnouncement = {
        id: '1',
        title: 'Chào mừng đến với HRM System',
        content: 'Hệ thống quản lý nhân sự hiện đại và toàn diện cho doanh nghiệp.',
        createdAt: new Date().toISOString(),
        author: 'Admin'
      }
      announcements.push(defaultAnnouncement)
      localStorage.setItem('announcements', JSON.stringify(announcements))
    }
    
    return announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error listing announcements:', error)
    return []
  }
}

export function upsertAnnouncement(input) {
  try {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]')
    
    if (input.id) {
      // Update existing
      const index = announcements.findIndex(ann => ann.id === input.id)
      if (index !== -1) {
        announcements[index] = { ...announcements[index], ...input }
        localStorage.setItem('announcements', JSON.stringify(announcements))
        return announcements[index]
      }
    }
    
    // Create new
    const newAnnouncement = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      author: 'Admin',
      ...input
    }
    announcements.push(newAnnouncement)
    localStorage.setItem('announcements', JSON.stringify(announcements))
    return newAnnouncement
  } catch (error) {
    console.error('Error upserting announcement:', error)
    throw error
  }
}

export function deleteAnnouncement(id) {
  try {
    let announcements = JSON.parse(localStorage.getItem('announcements') || '[]')
    announcements = announcements.filter(ann => ann.id !== id)
    localStorage.setItem('announcements', JSON.stringify(announcements))
    return true
  } catch (error) {
    console.error('Error deleting announcement:', error)
    throw error
  }
}
