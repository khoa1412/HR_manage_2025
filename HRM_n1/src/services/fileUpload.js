// File Upload Service
// Sử dụng localStorage để simulate file storage (production sẽ dùng real backend)

export const uploadFile = async (file, category = 'general', employeeId = null) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'))
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('File type not supported. Please upload images (JPG, PNG, GIF) or documents (PDF, DOC, DOCX)'))
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      reject(new Error('File size too large. Maximum size is 5MB'))
      return
    }

    const reader = new FileReader()
    
    reader.onload = function(e) {
      try {
        const fileData = {
          id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          category: category, // 'cccd_front', 'cccd_back', 'contract', 'degree', 'general'
          employeeId: employeeId,
          uploadDate: new Date().toISOString(),
          data: e.target.result // Base64 data
        }

        // Save to localStorage
        let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
        uploadedFiles.push(fileData)
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles))

        resolve(fileData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = function() {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

export const getEmployeeFiles = (employeeId) => {
  try {
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
    return uploadedFiles.filter(file => file.employeeId === employeeId)
  } catch (error) {
    console.error('Error getting employee files:', error)
    return []
  }
}

export const deleteFile = (fileId) => {
  try {
    let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
    uploadedFiles = uploadedFiles.filter(file => file.id !== fileId)
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles))
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

export const downloadFile = (fileId) => {
  try {
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
    const file = uploadedFiles.find(f => f.id === fileId)
    
    if (!file) {
      throw new Error('File not found')
    }

    // Create download link
    const link = document.createElement('a')
    link.href = file.data
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return true
  } catch (error) {
    console.error('Error downloading file:', error)
    return false
  }
}

export const getFileCategories = () => {
  return [
    { id: 'cccd_front', name: 'CCCD mặt trước', icon: 'CreditCard' },
    { id: 'cccd_back', name: 'CCCD mặt sau', icon: 'CreditCard' },
    { id: 'contract', name: 'Hợp đồng lao động', icon: 'FileText' },
    { id: 'degree', name: 'Bằng cấp', icon: 'GraduationCap' },
    { id: 'certificate', name: 'Chứng chỉ', icon: 'Award' },
    { id: 'health', name: 'Giấy khám sức khỏe', icon: 'Heart' },
    { id: 'insurance', name: 'Bảo hiểm', icon: 'Shield' },
    { id: 'other', name: 'Tài liệu khác', icon: 'FileText' }
  ]
}

