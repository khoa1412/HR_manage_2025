// ESS (Employee Self Service) API functions

import { getCurrentUserId } from './api'

// Leave Management
export async function listLeave() {
  try {
    let leaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]')
    if (leaves.length === 0) {
      leaves = [
        { id: '1', employeeId: '2', type: 'annual', startDate: '2024-12-20', endDate: '2024-12-22', reason: 'Nghỉ lễ', status: 'approved', createdAt: new Date().toISOString() },
        { id: '2', employeeId: '2', type: 'sick', startDate: '2024-11-15', endDate: '2024-11-15', reason: 'Ốm', status: 'approved', createdAt: new Date().toISOString() },
      ]
      localStorage.setItem('leaveRequests', JSON.stringify(leaves))
    }
    return leaves.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error listing leaves:', error)
    return []
  }
}

export async function listMyLeave() {
  try {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) throw new Error('Not logged in')
    
    const leaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]')
    return leaves.filter(leave => leave.employeeId === currentUserId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error listing my leaves:', error)
    return []
  }
}

export async function upsertLeave(input) {
  try {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) throw new Error('Not logged in')
    
    const leaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]')
    
    if (input.id) {
      // Update existing
      const index = leaves.findIndex(leave => leave.id === input.id && leave.employeeId === currentUserId)
      if (index !== -1) {
        leaves[index] = { ...leaves[index], ...input }
        localStorage.setItem('leaveRequests', JSON.stringify(leaves))
        return leaves[index]
      }
    }
    
    // Create new
    const newLeave = {
      id: Date.now().toString(),
      employeeId: currentUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...input
    }
    leaves.push(newLeave)
    localStorage.setItem('leaveRequests', JSON.stringify(leaves))
    return newLeave
  } catch (error) {
    console.error('Error upserting leave:', error)
    throw error
  }
}

export async function updateLeave(leaveData) {
  try {
    const leaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]')
    const index = leaves.findIndex(leave => leave.id === leaveData.id)
    
    if (index !== -1) {
      leaves[index] = { ...leaves[index], ...leaveData }
      localStorage.setItem('leaveRequests', JSON.stringify(leaves))
      return leaves[index]
    }
    throw new Error('Leave request not found')
  } catch (error) {
    console.error('Error updating leave:', error)
    throw error
  }
}

export async function deleteLeave(id) {
  try {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) throw new Error('Not logged in')
    
    const leaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]')
    const filtered = leaves.filter(leave => !(leave.id === id && leave.employeeId === currentUserId))
    localStorage.setItem('leaveRequests', JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting leave:', error)
    throw error
  }
}

// Overtime Management
export async function listOvertime() {
  try {
    let overtimes = JSON.parse(localStorage.getItem('overtimeRequests') || '[]')
    if (overtimes.length === 0) {
      overtimes = [
        { id: '1', employeeId: '2', date: '2024-12-15', hours: 2, reason: 'Hoàn thành dự án', status: 'approved', createdAt: new Date().toISOString() },
        { id: '2', employeeId: '2', date: '2024-12-18', hours: 3, reason: 'Fix bug production', status: 'pending', createdAt: new Date().toISOString() },
      ]
      localStorage.setItem('overtimeRequests', JSON.stringify(overtimes))
    }
    return overtimes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error listing overtimes:', error)
    return []
  }
}

export async function listMyOvertime() {
  try {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) throw new Error('Not logged in')
    
    const overtimes = JSON.parse(localStorage.getItem('overtimeRequests') || '[]')
    return overtimes.filter(overtime => overtime.employeeId === currentUserId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error listing my overtimes:', error)
    return []
  }
}

export async function upsertOvertime(input) {
  try {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) throw new Error('Not logged in')
    
    const overtimes = JSON.parse(localStorage.getItem('overtimeRequests') || '[]')
    
    if (input.id) {
      // Update existing
      const index = overtimes.findIndex(overtime => overtime.id === input.id && overtime.employeeId === currentUserId)
      if (index !== -1) {
        overtimes[index] = { ...overtimes[index], ...input }
        localStorage.setItem('overtimeRequests', JSON.stringify(overtimes))
        return overtimes[index]
      }
    }
    
    // Create new
    const newOvertime = {
      id: Date.now().toString(),
      employeeId: currentUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...input
    }
    overtimes.push(newOvertime)
    localStorage.setItem('overtimeRequests', JSON.stringify(overtimes))
    return newOvertime
  } catch (error) {
    console.error('Error upserting overtime:', error)
    throw error
  }
}

export async function updateOvertime(overtimeData) {
  try {
    const overtimes = JSON.parse(localStorage.getItem('overtimeRequests') || '[]')
    const index = overtimes.findIndex(overtime => overtime.id === overtimeData.id)
    
    if (index !== -1) {
      overtimes[index] = { ...overtimes[index], ...overtimeData }
      localStorage.setItem('overtimeRequests', JSON.stringify(overtimes))
      return overtimes[index]
    }
    throw new Error('Overtime request not found')
  } catch (error) {
    console.error('Error updating overtime:', error)
    throw error
  }
}

export async function deleteOvertime(id) {
  try {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) throw new Error('Not logged in')
    
    const overtimes = JSON.parse(localStorage.getItem('overtimeRequests') || '[]')
    const filtered = overtimes.filter(overtime => !(overtime.id === id && overtime.employeeId === currentUserId))
    localStorage.setItem('overtimeRequests', JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting overtime:', error)
    throw error
  }
}

// Profile Management
export async function getProfileDraft() {
  try {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) throw new Error('Not logged in')
    
    const draft = JSON.parse(localStorage.getItem(`profileDraft_${currentUserId}`) || '{}')
    return draft
  } catch (error) {
    console.error('Error getting profile draft:', error)
    return {}
  }
}

export async function saveProfileDraft(draft) {
  try {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) throw new Error('Not logged in')
    
    localStorage.setItem(`profileDraft_${currentUserId}`, JSON.stringify(draft))
    return draft
  } catch (error) {
    console.error('Error saving profile draft:', error)
    throw error
  }
}
