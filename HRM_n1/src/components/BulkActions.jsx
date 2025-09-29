import { useState, useRef } from 'react'
import { 
  Download, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Loader
} from 'lucide-react'
import { 
  exportEmployeesToExcel, 
  generateEmployeeTemplate, 
  parseCSVFile, 
  validateImportData, 
  bulkImportEmployees 
} from '../services/bulkActions'

export default function BulkActions({ employees, onImportComplete }) {
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importData, setImportData] = useState([])
  const [validation, setValidation] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(null)
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleExport = async () => {
    try {
      await exportEmployeesToExcel(employees)
      alert('Xuất file Excel thành công!')
    } catch (error) {
      alert('Lỗi: ' + error.message)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      await generateEmployeeTemplate()
      alert('Tải file mẫu thành công!')
    } catch (error) {
      alert('Lỗi: ' + error.message)
    }
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      alert('Vui lòng chọn file CSV')
      return
    }

    setImportFile(file)
    setImportData([])
    setValidation(null)
    setImportResult(null)

    try {
      const data = await parseCSVFile(file)
      setImportData(data)
      
      const validationResult = validateImportData(data)
      setValidation(validationResult)
    } catch (error) {
      alert('Lỗi đọc file: ' + error.message)
      setImportFile(null)
    }
  }

  const handleImport = async () => {
    if (!importData.length || !validation?.isValid) return

    setImporting(true)
    setImportProgress({ current: 0, total: importData.length, percent: 0 })

    try {
      const result = await bulkImportEmployees(importData, setImportProgress)
      setImportResult(result)
      
      if (onImportComplete) {
        onImportComplete(result)
      }
    } catch (error) {
      alert('Lỗi import: ' + error.message)
    } finally {
      setImporting(false)
    }
  }

  const resetImport = () => {
    setShowImportModal(false)
    setImportFile(null)
    setImportData([])
    setValidation(null)
    setImporting(false)
    setImportProgress(null)
    setImportResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      {/* Export/Import Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={handleExport}
          className="btn-outline flex items-center space-x-2"
          title="Xuất danh sách ra Excel"
        >
          <Download className="h-4 w-4" />
          <span>Xuất Excel</span>
        </button>
        
        <button
          onClick={() => setShowImportModal(true)}
          className="btn-outline flex items-center space-x-2"
          title="Nhập danh sách từ Excel"
        >
          <Upload className="h-4 w-4" />
          <span>Nhập Excel</span>
        </button>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Nhập danh sách nhân viên</h3>
              <button 
                onClick={resetImport}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!importResult && (
              <>
                {/* Step 1: Download Template */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Bước 1: Tải file mẫu</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    Tải file mẫu CSV để biết định dạng dữ liệu đúng
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Tải file mẫu</span>
                  </button>
                </div>

                {/* Step 2: Upload File */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Bước 2: Chọn file CSV</h4>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="input"
                  />
                  {importFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Đã chọn: {importFile.name} ({importData.length} nhân viên)
                    </p>
                  )}
                </div>

                {/* Step 3: Validation Results */}
                {validation && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Bước 3: Kiểm tra dữ liệu</h4>
                    
                    {validation.errors.length > 0 && (
                      <div className="mb-4 p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          <h5 className="font-medium text-red-900">Lỗi cần sửa ({validation.errors.length})</h5>
                        </div>
                        <ul className="text-red-700 text-sm space-y-1">
                          {validation.errors.slice(0, 10).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {validation.errors.length > 10 && (
                            <li>... và {validation.errors.length - 10} lỗi khác</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {validation.warnings.length > 0 && (
                      <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                          <h5 className="font-medium text-yellow-900">Cảnh báo ({validation.warnings.length})</h5>
                        </div>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          {validation.warnings.slice(0, 5).map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                          {validation.warnings.length > 5 && (
                            <li>... và {validation.warnings.length - 5} cảnh báo khác</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {validation.isValid && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="font-medium text-green-900">
                            Dữ liệu hợp lệ! Sẵn sàng import {importData.length} nhân viên.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Import Progress */}
                {importing && importProgress && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Đang import...</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${importProgress.percent}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {importProgress.current}/{importProgress.total} - {importProgress.percent}%
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={resetImport}
                    className="btn-outline"
                    disabled={importing}
                  >
                    Hủy
                  </button>
                  
                  {validation?.isValid && !importing && (
                    <button
                      onClick={handleImport}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Import {importData.length} nhân viên</span>
                    </button>
                  )}
                  
                  {importing && (
                    <button className="btn-primary flex items-center space-x-2" disabled>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Đang import...</span>
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Import Results */}
            {importResult && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Kết quả import</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
                    <div className="text-blue-700">Tổng số</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                    <div className="text-green-700">Thành công</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                    <div className="text-red-700">Thất bại</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">Lỗi import</h5>
                    <ul className="text-red-700 text-sm space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error.employee}: {error.error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={resetImport}
                    className="btn-primary"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
