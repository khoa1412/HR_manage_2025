import { useState, useEffect } from 'react'
import {
  Calculator,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Download,
  Eye,
  Settings,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Printer
} from 'lucide-react'
import EmployeeSalaryList from './payroll/EmployeeSalaryList'
import SalarySettingsModal from './payroll/SalarySettingsModal'
import { 
  generateMonthlyPayroll, 
  savePayrollRecord, 
  getPayrollRecords,
  getEmployeeSalaryHistory,
  formatCurrency,
  formatNumber
} from '../services/payrollService'
import { 
  generatePayslipPDF, 
  generateBulkPayslipsPDF,
  generatePayrollSummaryPDF,
  downloadPDF,
  printPDF 
} from '../services/pdfService'
import { 
  generatePayrollExcel,
  downloadExcel 
} from '../services/excelService'
import { listEmployees, listDepartments, upsertEmployee } from '../services/api'

export default function PayrollManagement() {
  const [activeTab, setActiveTab] = useState('calculate')
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  
  // Payroll calculation state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [currentPayroll, setCurrentPayroll] = useState(null)
  const [payrollHistory, setPayrollHistory] = useState([])
  
  // Employee salary history & settings
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false)
  const [employeeSalaryHistory, setEmployeeSalaryHistory] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const openSalaryModal = (employee) => {
    setSelectedEmployee(employee);
    setIsSalaryModalOpen(true);
  };

  const closeSalaryModal = () => {
    setSelectedEmployee(null);
    setIsSalaryModalOpen(false);
  };

  const handleSaveSalarySettings = async (updatedEmployeeData) => {
    try {
      await upsertEmployee(updatedEmployeeData);
      setEmployees(employees.map(emp => 
        emp.id === updatedEmployeeData.id ? updatedEmployeeData : emp
      ));
      alert('Cập nhật cài đặt lương thành công!');
      closeSalaryModal();
    } catch (error) {
      console.error('Error saving salary settings:', error);
      alert('Có lỗi xảy ra khi lưu cài đặt lương.');
    }
  };

  const tabs = [
    { id: 'calculate', label: 'Tính lương', icon: Calculator },
    { id: 'history', label: 'Lịch sử bảng lương', icon: FileText },
    { id: 'employees', label: 'Lương nhân viên', icon: Users },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
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
    if (activeTab === 'history') {
      loadPayrollHistory()
    }
  }, [activeTab])

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

  const loadPayrollHistory = async () => {
    try {
      const history = getPayrollRecords()
      setPayrollHistory(history)
    } catch (error) {
      console.error('Error loading payroll history:', error)
    }
  }

  const calculatePayroll = async () => {
    setLoading(true)
    try {
      const payroll = await generateMonthlyPayroll(
        selectedMonth, 
        selectedYear, 
        selectedDepartment || null
      )
      setCurrentPayroll(payroll)
    } catch (error) {
      console.error('Error calculating payroll:', error)
      alert('Có lỗi xảy ra khi tính lương: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const savePayroll = async () => {
    if (!currentPayroll) return
    
    try {
      const recordId = savePayrollRecord(currentPayroll)
      alert('Đã lưu bảng lương thành công!')
      loadPayrollHistory()
    } catch (error) {
      console.error('Error saving payroll:', error)
      alert('Có lỗi xảy ra khi lưu bảng lương: ' + error.message)
    }
  }

  const exportToExcel = async () => {
    if (!currentPayroll) return
    
    try {
      setLoading(true)
      const workbook = generatePayrollExcel(currentPayroll)
      const filename = `bang-luong-${currentPayroll.year}-${String(currentPayroll.month).padStart(2, '0')}.xlsx`
      downloadExcel(workbook, filename)
      alert('Xuất Excel thành công!')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Có lỗi xảy ra khi xuất Excel: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = async (type = 'summary') => {
    if (!currentPayroll) return
    
    try {
      setLoading(true)
      let doc
      let filename
      
      if (type === 'summary') {
        doc = generatePayrollSummaryPDF(currentPayroll)
        filename = `bang-luong-tong-hop-${currentPayroll.year}-${String(currentPayroll.month).padStart(2, '0')}.pdf`
      } else if (type === 'bulk') {
        doc = generateBulkPayslipsPDF(currentPayroll)
        filename = `phieu-luong-tap-hop-${currentPayroll.year}-${String(currentPayroll.month).padStart(2, '0')}.pdf`
      }
      
      if (doc) {
        downloadPDF(doc, filename)
        alert('Xuất PDF thành công!')
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      alert('Có lỗi xảy ra khi xuất PDF: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const viewEmployeeSalaryHistory = async (employee) => {
    setSelectedEmployee(employee)
    try {
      const history = await getEmployeeSalaryHistory(employee.id)
      setEmployeeSalaryHistory(history)
    } catch (error) {
      console.error('Error loading employee salary history:', error)
    }
  }

  const generatePayslip = async (salaryData, action = 'download') => {
    try {
      setLoading(true)
      const doc = generatePayslipPDF(salaryData)
      const filename = `phieu-luong-${salaryData.employee.code}-${salaryData.year}-${String(salaryData.month).padStart(2, '0')}.pdf`
      
      if (action === 'download') {
        downloadPDF(doc, filename)
        alert('Tải phiếu lương thành công!')
      } else if (action === 'print') {
        printPDF(doc)
      }
    } catch (error) {
      console.error('Error generating payslip:', error)
      alert('Có lỗi xảy ra khi tạo phiếu lương: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleRowExpansion = (employeeId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId)
    } else {
      newExpanded.add(employeeId)
    }
    setExpandedRows(newExpanded)
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const filteredPayrollHistory = payrollHistory.filter(record => {
    if (statusFilter === 'all') return true
    // Add status filtering logic here
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Quản lý Bảng lương</h3>
          <p className="text-sm text-gray-500">
            Tính lương, quản lý lịch sử và xuất phiếu lương nhân viên
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Calculate Payroll Tab */}
      {activeTab === 'calculate' && (
        <div className="space-y-6">
          {/* Calculation Controls */}
          <div className="card p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Tính lương tháng</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              <div>
                <label className="label">Phòng ban (tùy chọn)</label>
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="input"
                >
                  <option value="">Tất cả phòng ban</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={calculatePayroll}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Đang tính...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4" />
                      <span>Tính lương</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Payroll Results */}
          {currentPayroll && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Tổng quan bảng lương {currentPayroll.period}
                  </h4>
                  <div className="flex space-x-3">
                    <button
                      onClick={savePayroll}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Lưu bảng lương</span>
                    </button>
                    <div className="relative group">
                      <button className="btn-outline flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Xuất file</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="py-1">
                          <button
                            onClick={exportToExcel}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            📊 Xuất Excel (Chi tiết)
                          </button>
                          <button
                            onClick={() => exportToPDF('summary')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            📄 PDF Tổng hợp
                          </button>
                          <button
                            onClick={() => exportToPDF('bulk')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            📑 PDF Phiếu lương
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentPayroll.summary.totalEmployees}
                    </div>
                    <div className="text-sm text-blue-700">Nhân viên</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {formatNumber(currentPayroll.summary.totalGrossSalary)}
                    </div>
                    <div className="text-sm text-green-700">Tổng thu nhập</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {formatNumber(currentPayroll.summary.totalDeductions)}
                    </div>
                    <div className="text-sm text-red-700">Tổng khấu trừ</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {formatNumber(currentPayroll.summary.totalNetSalary)}
                    </div>
                    <div className="text-sm text-purple-700">Thực nhận</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">
                      {formatNumber(currentPayroll.summary.totalOvertimePay)}
                    </div>
                    <div className="text-sm text-yellow-700">Tiền tăng ca</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-lg font-bold text-indigo-600">
                      {formatNumber(currentPayroll.summary.avgNetSalary)}
                    </div>
                    <div className="text-sm text-indigo-700">Lương TB</div>
                  </div>
                </div>
              </div>

              {/* Employee Salaries Table */}
              <div className="card p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Chi tiết lương nhân viên ({currentPayroll.employees.length} người)
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày công</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tăng ca</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thu nhập</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khấu trừ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thực nhận</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPayroll.employees.map((emp) => (
                        <tr key={emp.employeeId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            <div>
                              <div className="font-medium text-gray-900">{emp.employee.fullName}</div>
                              <div className="text-gray-500">{emp.employee.code} • {emp.employee.department}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {emp.attendance.actualWorkDays}/{emp.attendance.workingDays}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {emp.attendance.overtimeHours}h
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatNumber(emp.grossSalary)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatNumber(emp.deductions.total)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">
                            {formatNumber(emp.netSalary)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleRowExpansion(emp.employeeId)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Xem chi tiết"
                              >
                                {expandedRows.has(emp.employeeId) ? 
                                  <ChevronDown className="h-4 w-4" /> : 
                                  <ChevronRight className="h-4 w-4" />
                                }
                              </button>
                              <button
                                onClick={() => generatePayslip(emp, 'download')}
                                className="text-green-600 hover:text-green-800"
                                title="Tải PDF phiếu lương"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => generatePayslip(emp, 'print')}
                                className="text-purple-600 hover:text-purple-800"
                                title="In phiếu lương"
                              >
                                <Printer className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payroll History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Lịch sử bảng lương</h4>
              <button
                onClick={loadPayrollHistory}
                className="btn-outline flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Làm mới</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kỳ lương</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số nhân viên</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng chi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayrollHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {record.period}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.summary.totalEmployees}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatNumber(record.summary.totalNetSalary)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(record.savedAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setCurrentPayroll(record)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => exportToExcel(record)}
                            className="text-green-600 hover:text-green-800"
                            title="Xuất Excel"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Employee Salaries Tab */}
      {activeTab === 'employees' && (
        <EmployeeSalaryList 
          employees={employees} 
          departments={departments}
          onOpenModal={openSalaryModal}
        />
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Cài đặt bảng lương</h4>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Thông số cơ bản</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="label">Số ngày làm việc chuẩn/tháng</label>
                      <input type="number" defaultValue="22" className="input" />
                    </div>
                    <div>
                      <label className="label">Hệ số tăng ca</label>
                      <input type="number" step="0.1" defaultValue="1.5" className="input" />
                    </div>
                    <div>
                      <label className="label">Giảm trừ gia cảnh (VND)</label>
                      <input type="number" defaultValue="11000000" className="input" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Tỷ lệ bảo hiểm</h5>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="label">BHXH (%)</label>
                        <input type="number" step="0.1" defaultValue="8" className="input" />
                      </div>
                      <div>
                        <label className="label">BHYT (%)</label>
                        <input type="number" step="0.1" defaultValue="1.5" className="input" />
                      </div>
                      <div>
                        <label className="label">BHTN (%)</label>
                        <input type="number" step="0.1" defaultValue="1" className="input" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Phụ cấp cố định</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phụ cấp đi lại (VND)</label>
                    <input type="number" defaultValue="500000" className="input" />
                  </div>
                  <div>
                    <label className="label">Phụ cấp ăn trưa/ngày (VND)</label>
                    <input type="number" defaultValue="50000" className="input" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button className="btn-outline">Hủy</button>
                <button className="btn-primary">Lưu cài đặt</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Salary History Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Lịch sử lương - {selectedEmployee.fullName}
              </h3>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kỳ lương</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày công</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tăng ca</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thu nhập</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khấu trừ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thực nhận</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeSalaryHistory.map((salary) => (
                    <tr key={`${salary.year}-${salary.month}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {salary.period}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {salary.attendance.actualWorkDays}/{salary.attendance.workingDays}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {salary.attendance.overtimeHours}h
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatNumber(salary.grossSalary)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatNumber(salary.deductions.total)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {formatNumber(salary.netSalary)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => generatePayslip(salary)}
                          className="text-green-600 hover:text-green-800"
                          title="In phiếu lương"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isSalaryModalOpen && (
        <SalarySettingsModal
          employee={selectedEmployee}
          onClose={closeSalaryModal}
          onSave={handleSaveSalarySettings}
        />
      )}
    </div>
  )
}
