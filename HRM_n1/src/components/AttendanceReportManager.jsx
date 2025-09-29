import { useState, useEffect } from 'react'
import { 
  Calendar,
  FileText,
  Download,
  Filter,
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  X
} from 'lucide-react'
import { listEmployees, listDepartments } from '../services/api'
import { 
  generateMonthlyReport, 
  generateViolationReport, 
  generateOvertimeReport,
  exportToCSV 
} from '../services/attendanceReports'

export default function AttendanceReportManager() {
  const [activeReportType, setActiveReportType] = useState('monthly')
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedStartDate, setSelectedStartDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState('')
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [showEmployeeSelector, setShowEmployeeSelector] = useState(false)
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('')

  const reportTypes = [
    { 
      id: 'monthly', 
      name: 'Báo cáo tháng', 
      icon: Calendar,
      description: 'Thống kê chấm công theo tháng',
      color: 'blue'
    },
    { 
      id: 'violations', 
      name: 'Vi phạm chấm công', 
      icon: AlertTriangle,
      description: 'Đi muộn, về sớm, vắng mặt',
      color: 'red'
    },
    { 
      id: 'overtime', 
      name: 'Báo cáo tăng ca', 
      icon: Clock,
      description: 'Thống kê giờ tăng ca và chi phí',
      color: 'green'
    }
  ]

  const months = [
    { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' }, { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' }, { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' }
  ]

  const years = [2022, 2023, 2024, 2025].map(year => ({ value: year, label: `Năm ${year}` }))

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Set default date range for violations report
    if (activeReportType === 'violations') {
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      setSelectedStartDate(firstDayOfMonth.toISOString().split('T')[0])
      setSelectedEndDate(today.toISOString().split('T')[0])
    }
  }, [activeReportType])

  const loadData = async () => {
    try {
      const [employeesData, departmentsData] = await Promise.all([
        listEmployees(),
        listDepartments()
      ])
      setEmployees(employeesData)
      setDepartments(departmentsData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const generateReport = async () => {
    if (!validateFilters()) return

    setLoading(true)
    try {
      let data = null
      
      switch (activeReportType) {
        case 'monthly':
          data = await generateMonthlyReport(
            selectedYear, 
            selectedMonth, 
            selectedDepartments
          )
          // Filter by selected employees if any
          if (selectedEmployees.length > 0) {
            data.employees = data.employees.filter(emp => 
              selectedEmployees.includes(emp.employee.id)
            )
            // Recalculate summary for filtered data
            data.summary = recalculateSummary(data.employees)
          }
          data.type = 'monthly'
          break
          
        case 'violations':
          data = await generateViolationReport(
            selectedStartDate,
            selectedEndDate,
            selectedDepartments
          )
          // Filter by selected employees if any
          if (selectedEmployees.length > 0) {
            data.violations = data.violations.filter(violation => 
              selectedEmployees.includes(violation.employeeId)
            )
          }
          data.type = 'violations'
          break
          
        case 'overtime':
          data = await generateOvertimeReport(
            selectedYear,
            selectedMonth,
            selectedDepartments
          )
          // Filter by selected employees if any
          if (selectedEmployees.length > 0) {
            data.overtimeData = data.overtimeData.filter(ot => 
              selectedEmployees.includes(ot.employee.id)
            )
            // Recalculate statistics
            data.statistics = recalculateOvertimeStats(data.overtimeData)
          }
          data.type = 'overtime'
          break
      }
      
      setReportData(data)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Có lỗi xảy ra khi tạo báo cáo: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const validateFilters = () => {
    if (activeReportType === 'violations') {
      if (!selectedStartDate || !selectedEndDate) {
        alert('Vui lòng chọn khoảng thời gian cho báo cáo vi phạm')
        return false
      }
      if (new Date(selectedStartDate) > new Date(selectedEndDate)) {
        alert('Ngày bắt đầu phải trước ngày kết thúc')
        return false
      }
    }
    return true
  }

  const recalculateSummary = (filteredEmployees) => {
    return {
      totalEmployees: filteredEmployees.length,
      totalWorkingDays: filteredEmployees.reduce((sum, emp) => sum + emp.workingDays, 0),
      totalPresentDays: filteredEmployees.reduce((sum, emp) => sum + emp.presentDays, 0),
      totalAbsentDays: filteredEmployees.reduce((sum, emp) => sum + emp.absentDays, 0),
      totalLateDays: filteredEmployees.reduce((sum, emp) => sum + emp.lateDays, 0),
      totalEarlyDays: filteredEmployees.reduce((sum, emp) => sum + emp.earlyDays, 0),
      totalOvertimeHours: filteredEmployees.reduce((sum, emp) => sum + emp.overtimeHours, 0),
      avgAttendanceRate: filteredEmployees.length > 0 ? 
        Math.round(filteredEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / filteredEmployees.length) : 0
    }
  }

  const recalculateOvertimeStats = (filteredData) => {
    const totalHours = filteredData.reduce((sum, ot) => sum + ot.overtimeHours, 0)
    const totalCost = filteredData.reduce((sum, ot) => sum + ot.overtimeCost, 0)
    
    return {
      totalEmployees: filteredData.length,
      totalOvertimeHours: Math.round(totalHours * 100) / 100,
      totalOvertimeCost: totalCost,
      avgOvertimePerEmployee: filteredData.length > 0 ? 
        Math.round((totalHours / filteredData.length) * 100) / 100 : 0,
      topOvertimeEmployees: filteredData.sort((a, b) => b.overtimeHours - a.overtimeHours).slice(0, 10)
    }
  }

  const exportReport = async () => {
    if (!reportData) {
      alert('Vui lòng tạo báo cáo trước khi xuất')
      return
    }

    try {
      let filename = ''
      
      switch (activeReportType) {
        case 'monthly':
          filename = `bao-cao-thang-${selectedMonth}-${selectedYear}.csv`
          break
        case 'violations':
          filename = `bao-cao-vi-pham-${selectedStartDate}-${selectedEndDate}.csv`
          break
        case 'overtime':
          filename = `bao-cao-tang-ca-${selectedMonth}-${selectedYear}.csv`
          break
      }
      
      await exportToCSV(reportData, filename)
      alert('Xuất báo cáo thành công!')
    } catch (error) {
      console.error('Error exporting report:', error)
      alert('Có lỗi xảy ra khi xuất báo cáo: ' + error.message)
    }
  }

  const toggleDepartment = (deptId) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    )
  }

  const toggleEmployee = (empId) => {
    setSelectedEmployees(prev => 
      prev.includes(empId) 
        ? prev.filter(id => id !== empId)
        : [...prev, empId]
    )
  }

  const clearFilters = () => {
    setSelectedDepartments([])
    setSelectedEmployees([])
    setEmployeeSearchTerm('')
  }

  const filteredEmployeesForSelector = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.code.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  )

  const getFilterSummary = () => {
    let parts = []
    
    if (selectedDepartments.length > 0) {
      parts.push(`${selectedDepartments.length} phòng ban`)
    }
    
    if (selectedEmployees.length > 0) {
      parts.push(`${selectedEmployees.length} nhân viên`)
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Tất cả'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Báo cáo chấm công</h3>
          <p className="text-sm text-gray-500">Tạo và xuất báo cáo theo tháng, phòng ban, nhân viên</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={clearFilters}
            className="btn-outline flex items-center space-x-2"
            disabled={selectedDepartments.length === 0 && selectedEmployees.length === 0}
          >
            <X className="h-4 w-4" />
            <span>Xóa bộ lọc</span>
          </button>
          <button
            onClick={exportReport}
            disabled={!reportData}
            className="btn-outline flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveReportType(type.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              activeReportType === type.id
                ? `border-${type.color}-500 bg-${type.color}-50`
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <type.icon className={`h-6 w-6 ${
                activeReportType === type.id ? `text-${type.color}-600` : 'text-gray-400'
              }`} />
              <div>
                <h4 className={`font-medium ${
                  activeReportType === type.id ? `text-${type.color}-900` : 'text-gray-900'
                }`}>
                  {type.name}
                </h4>
                <p className={`text-sm ${
                  activeReportType === type.id ? `text-${type.color}-700` : 'text-gray-500'
                }`}>
                  {type.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Bộ lọc báo cáo</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Time Period */}
          {activeReportType !== 'violations' ? (
            <>
              <div>
                <label className="label">Năm</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="input"
                >
                  {years.map(year => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Tháng</label>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="input"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="label">Từ ngày</label>
                <input
                  type="date"
                  value={selectedStartDate}
                  onChange={(e) => setSelectedStartDate(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Đến ngày</label>
                <input
                  type="date"
                  value={selectedEndDate}
                  onChange={(e) => setSelectedEndDate(e.target.value)}
                  className="input"
                />
              </div>
            </>
          )}
          
          {/* Filter Summary */}
          <div className="lg:col-span-2">
            <label className="label">Phạm vi</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
                {getFilterSummary()}
              </div>
              <button
                onClick={() => setShowEmployeeSelector(true)}
                className="btn-outline flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Chọn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generate Report Button */}
        <div className="flex justify-center">
          <button
            onClick={generateReport}
            disabled={loading}
            className="btn-primary flex items-center space-x-2 px-8"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang tạo báo cáo...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Tạo báo cáo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">Kết quả báo cáo</h4>
            <span className="text-sm text-gray-500">
              Tạo lúc: {new Date(reportData.generatedAt).toLocaleString('vi-VN')}
            </span>
          </div>

          {/* Summary Statistics */}
          {reportData.type === 'monthly' && (
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-3">Thống kê tổng quan</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{reportData.summary.totalEmployees}</div>
                  <div className="text-xs text-blue-700">Nhân viên</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{reportData.summary.totalPresentDays}</div>
                  <div className="text-xs text-green-700">Ngày có mặt</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-600">{reportData.summary.totalAbsentDays}</div>
                  <div className="text-xs text-red-700">Ngày vắng</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-xl font-bold text-yellow-600">{reportData.summary.totalLateDays}</div>
                  <div className="text-xs text-yellow-700">Lần đi muộn</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">{reportData.summary.totalEarlyDays}</div>
                  <div className="text-xs text-orange-700">Lần về sớm</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">{reportData.summary.totalOvertimeHours}h</div>
                  <div className="text-xs text-purple-700">Tăng ca</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-xl font-bold text-indigo-600">{reportData.summary.avgAttendanceRate}%</div>
                  <div className="text-xs text-indigo-700">Tỷ lệ TB</div>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {reportData.type === 'monthly' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày làm việc</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Có mặt</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vắng</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đi muộn</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tăng ca</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỷ lệ (%)</th>
                    </>
                  )}
                  {reportData.type === 'violations' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vi phạm</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mức độ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chi tiết</th>
                    </>
                  )}
                  {reportData.type === 'overtime' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ thường</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ tăng ca</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chi phí</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số ngày</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.type === 'monthly' && reportData.employees.slice(0, 50).map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{emp.employee.fullName}</div>
                        <div className="text-gray-500">{emp.employee.code}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.employee.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.workingDays}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.presentDays}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.absentDays}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.lateDays}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.overtimeHours}h</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        emp.attendanceRate >= 95 ? 'bg-green-100 text-green-800' :
                        emp.attendanceRate >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {emp.attendanceRate}%
                      </span>
                    </td>
                  </tr>
                ))}

                {reportData.type === 'violations' && reportData.violations.slice(0, 50).map((violation, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{violation.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{violation.employee.fullName}</div>
                        <div className="text-gray-500">{violation.employee.code}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{violation.employee.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{violation.type}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        violation.severity === 'high' ? 'bg-red-100 text-red-800' :
                        violation.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {violation.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{violation.value || '-'}</td>
                  </tr>
                ))}

                {reportData.type === 'overtime' && reportData.overtimeData.slice(0, 50).map((ot, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{ot.employee.fullName}</div>
                        <div className="text-gray-500">{ot.employee.code}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ot.employee.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ot.regularHours}h</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ot.overtimeHours}h</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ot.overtimeCost)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ot.dailyOvertimes.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show more indicator */}
          {((reportData.type === 'monthly' && reportData.employees.length > 50) ||
            (reportData.type === 'violations' && reportData.violations.length > 50) ||
            (reportData.type === 'overtime' && reportData.overtimeData.length > 50)) && (
            <div className="text-center py-4 text-sm text-gray-500">
              Hiển thị 50 bản ghi đầu tiên. Xuất Excel để xem toàn bộ dữ liệu.
            </div>
          )}
        </div>
      )}

      {/* Employee/Department Selector Modal */}
      {showEmployeeSelector && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Chọn phạm vi báo cáo</h3>
              <button 
                onClick={() => setShowEmployeeSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Departments */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Phòng ban</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {departments.map(dept => (
                    <label key={dept.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept.name)}
                        onChange={() => toggleDepartment(dept.name)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-900">{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Employees */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Nhân viên</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={employeeSearchTerm}
                    onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredEmployeesForSelector.map(emp => (
                    <label key={emp.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleEmployee(emp.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-900">
                        {emp.fullName} ({emp.code}) - {emp.department}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Đã chọn: {selectedDepartments.length} phòng ban, {selectedEmployees.length} nhân viên
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedDepartments([])
                    setSelectedEmployees([])
                  }}
                  className="btn-outline"
                >
                  Xóa tất cả
                </button>
                <button
                  onClick={() => setShowEmployeeSelector(false)}
                  className="btn-primary"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
