import { useState, useRef } from 'react'
import { 
  Upload, 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Loader,
  Clock,
  Users,
  Database
} from 'lucide-react'
import { 
  importAttendanceFromCSV, 
  validateAttendanceData, 
  processAttendanceRecords,
  generateAttendanceTemplate,
  performanceMonitor
} from '../services/attendanceData'

export default function AttendanceImport({ onImportComplete }) {
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importData, setImportData] = useState([])
  const [validation, setValidation] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(null)
  const [importResult, setImportResult] = useState(null)
  const [performanceStats, setPerformanceStats] = useState(null)
  const fileInputRef = useRef(null)

  const handleDownloadTemplate = async () => {
    try {
      await generateAttendanceTemplate()
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
    setPerformanceStats(null)

    const monitor = performanceMonitor.start('CSV Parsing')

    try {
      const data = await importAttendanceFromCSV(file)
      const parseTime = monitor.end()
      
      setImportData(data)
      
      const validationMonitor = performanceMonitor.start('Data Validation')
      const validationResult = validateAttendanceData(data)
      const validationTime = validationMonitor.end()
      
      setValidation(validationResult)
      setPerformanceStats({
        parseTime: parseTime,
        validationTime: validationTime,
        recordsPerSecond: Math.round(data.length / (parseTime / 1000)),
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      })
    } catch (error) {
      alert('Lỗi đọc file: ' + error.message)
      setImportFile(null)
    }
  }

  const handleImport = async () => {
    if (!importData.length || !validation?.isValid) return

    setImporting(true)
    setImportProgress({ current: 0, total: importData.length, percent: 0 })

    const monitor = performanceMonitor.start('Data Processing')

    try {
      const result = await processAttendanceRecords(importData, setImportProgress)
      const processingTime = monitor.end()
      
      setImportResult({
        ...result,
        processingTime: processingTime,
        recordsPerSecond: Math.round(result.processed / (processingTime / 1000))
      })
      
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
    setPerformanceStats(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getPerformanceStatus = () => {
    if (!performanceStats) return null
    
    const { recordsPerSecond } = performanceStats
    
    if (recordsPerSecond > 500) {
      return { color: 'green', text: 'Excellent', icon: CheckCircle }
    } else if (recordsPerSecond > 200) {
      return { color: 'blue', text: 'Good', icon: Clock }
    } else if (recordsPerSecond > 100) {
      return { color: 'yellow', text: 'Fair', icon: AlertTriangle }
    } else {
      return { color: 'red', text: 'Slow', icon: AlertTriangle }
    }
  }

  return (
    <>
      {/* Import Button */}
      <button
        onClick={() => setShowImportModal(true)}
        className="btn-primary flex items-center space-x-2"
        title="Import dữ liệu chấm công từ file CSV"
      >
        <Upload className="h-4 w-4" />
        <span>Import dữ liệu</span>
      </button>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Import dữ liệu chấm công</h3>
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
                    Tải file mẫu CSV để biết định dạng dữ liệu đúng cho hệ thống chấm công
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Tải file mẫu chấm công</span>
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
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        📁 {importFile.name} ({(importFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      {importData.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          📊 {importData.length} bản ghi chấm công từ {validation?.uniqueEmployees} nhân viên
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Performance Stats */}
                {performanceStats && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Hiệu suất xử lý</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <Database className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{performanceStats.fileSize}</div>
                        <div className="text-xs text-gray-500">Kích thước file</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{performanceStats.parseTime.toFixed(0)}ms</div>
                        <div className="text-xs text-gray-500">Thời gian đọc</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{performanceStats.recordsPerSecond}</div>
                        <div className="text-xs text-gray-500">Bản ghi/giây</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        {(() => {
                          const status = getPerformanceStatus()
                          if (!status) return null
                          const Icon = status.icon
                          return (
                            <>
                              <Icon className={`h-6 w-6 text-${status.color}-600 mx-auto mb-1`} />
                              <div className={`text-lg font-bold text-${status.color}-600`}>{status.text}</div>
                              <div className="text-xs text-gray-500">Đánh giá</div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Validation Results */}
                {validation && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Bước 3: Kiểm tra dữ liệu</h4>
                    
                    {/* Validation Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{validation.totalRecords}</div>
                        <div className="text-blue-700">Tổng bản ghi</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{validation.uniqueEmployees}</div>
                        <div className="text-green-700">Nhân viên</div>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${
                        validation.isValid ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <div className={`text-2xl font-bold ${
                          validation.isValid ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {validation.errors.length}
                        </div>
                        <div className={validation.isValid ? 'text-green-700' : 'text-red-700'}>
                          Lỗi
                        </div>
                      </div>
                    </div>
                    
                    {validation.errors.length > 0 && (
                      <div className="mb-4 p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          <h5 className="font-medium text-red-900">Lỗi cần sửa ({validation.errors.length})</h5>
                        </div>
                        <ul className="text-red-700 text-sm space-y-1 max-h-32 overflow-y-auto">
                          {validation.errors.slice(0, 20).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {validation.errors.length > 20 && (
                            <li>... và {validation.errors.length - 20} lỗi khác</li>
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
                        <ul className="text-yellow-700 text-sm space-y-1 max-h-32 overflow-y-auto">
                          {validation.warnings.slice(0, 10).map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                          {validation.warnings.length > 10 && (
                            <li>... và {validation.warnings.length - 10} cảnh báo khác</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {validation.isValid && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="font-medium text-green-900">
                            Dữ liệu hợp lệ! Sẵn sàng import {importData.length} bản ghi chấm công.
                          </span>
                        </div>
                        {validation.warnings.length === 0 && (
                          <p className="text-green-700 text-sm mt-1">
                            🚀 Hiệu suất: {performanceStats?.recordsPerSecond} bản ghi/giây 
                            {importData.length >= 10000 && ' (Đạt yêu cầu xử lý 10k+ bản ghi)'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Import Progress */}
                {importing && importProgress && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Đang import...</h4>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${importProgress.percent}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
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
                      <span>Import {importData.length} bản ghi</span>
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
                
                {/* Results Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
                    <div className="text-blue-700">Tổng số</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{importResult.processed}</div>
                    <div className="text-green-700">Thành công</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{importResult.duplicates}</div>
                    <div className="text-yellow-700">Trùng lặp</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                    <div className="text-red-700">Thất bại</div>
                  </div>
                </div>

                {/* Performance Results */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Hiệu suất import</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Thời gian xử lý:</span>
                      <span className="ml-2 font-medium">{importResult.processingTime.toFixed(0)}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tốc độ xử lý:</span>
                      <span className="ml-2 font-medium">{importResult.recordsPerSecond} bản ghi/giây</span>
                    </div>
                  </div>
                  {importResult.processed >= 10000 && importResult.processingTime < 60000 && (
                    <div className="mt-2 p-2 bg-green-100 rounded text-green-800 text-sm">
                      ✅ Đạt yêu cầu hiệu năng MVP: ≥10k bản ghi trong &lt;60s
                    </div>
                  )}
                </div>

                {importResult.errors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">Lỗi import</h5>
                    <ul className="text-red-700 text-sm space-y-1 max-h-40 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error.record}: {error.error}</li>
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
