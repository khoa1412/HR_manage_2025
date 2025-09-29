import { useState } from 'react'
import {
  Calculator,
  Download,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Printer
} from 'lucide-react'
import { formatNumber } from '../../services/payrollService'

export default function CalculatePayrollTab({
  loading,
  years,
  months,
  departments,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedDepartment,
  setSelectedDepartment,
  calculatePayroll,
  currentPayroll,
  savePayroll,
  exportToExcel,
  exportToPDF,
  generatePayslip
}) {
  const [expandedRows, setExpandedRows] = useState(new Set())

  const toggleRowExpansion = (employeeId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId)
    } else {
      newExpanded.add(employeeId)
    }
    setExpandedRows(newExpanded)
  }

  return (
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
  )
}
