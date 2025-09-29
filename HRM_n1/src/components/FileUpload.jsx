import { useState } from 'react'
import { Upload, File, X, Download, Eye, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { uploadFile, deleteFile, downloadFile } from '../services/fileUpload'

export default function FileUpload({ 
  category, 
  employeeId, 
  existingFiles = [], 
  onFilesChange,
  multiple = false,
  accept = "image/*,.pdf,.doc,.docx",
  maxFiles = 5 
}) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const fileArray = Array.from(files)
      
      // Check file limits
      if (!multiple && fileArray.length > 1) {
        throw new Error('Chỉ được chọn 1 file')
      }
      
      if (existingFiles.length + fileArray.length > maxFiles) {
        throw new Error(`Tối đa ${maxFiles} file`)
      }

      const uploadPromises = fileArray.map(file => 
        uploadFile(file, category, employeeId)
      )

      const results = await Promise.all(uploadPromises)
      
      // Update parent component
      if (onFilesChange) {
        onFilesChange([...existingFiles, ...results])
      }

      setSuccess(`Upload thành công ${results.length} file`)
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (error) {
      setError(error.message)
      setTimeout(() => setError(''), 5000)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDelete = async (fileId) => {
    if (!confirm('Bạn có chắc muốn xóa file này?')) return
    
    const success = deleteFile(fileId)
    if (success && onFilesChange) {
      const updatedFiles = existingFiles.filter(f => f.id !== fileId)
      onFilesChange(updatedFiles)
    }
  }

  const handleDownload = (fileId) => {
    downloadFile(fileId)
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Eye className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <Upload className={`mx-auto h-12 w-12 ${uploading ? 'text-gray-400' : 'text-gray-500'}`} />
          
          {uploading ? (
            <p className="text-gray-500">Đang upload...</p>
          ) : (
            <>
              <p className="text-gray-700 font-medium">
                Kéo thả file hoặc click để chọn
              </p>
              <p className="text-xs text-gray-500">
                Hỗ trợ: JPG, PNG, GIF, PDF, DOC, DOCX (tối đa 5MB)
              </p>
              {multiple && (
                <p className="text-xs text-gray-500">
                  Tối đa {maxFiles} file
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-700">{success}</span>
        </div>
      )}

      {/* File List */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900">File đã upload:</h5>
          <div className="space-y-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(file.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Tải xuống"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

