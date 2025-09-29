import { useState, useEffect } from 'react'
import { 
  X, 
  Download, 
  FileText, 
  Calendar, 
  User,
  DollarSign,
  Printer,
  Loader2
} from 'lucide-react'
import { 
  calculateSalary, 
  getEmployeeSalaryHistory,
  formatCurrency,
  formatNumber 
} from '../services/payrollService'
import { 
  generatePayslipPDF,
  downloadPDF,
  printPDF 
} from '../services/pdfService'

export default function PayslipModal({ employee, onClose }) {
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [salaryData, setSalaryData] = useState(null)
  const [salaryHistory, setSalaryHistory] = useState([])
  const [activeTab, setActiveTab] = useState('current')

  const months = [
    { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' }, { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' }, { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' }
  ]

  const years = [2022, 2023, 2024, 2025].map(year => ({ value: year, label: `${year}` }))

  useEffect(() => {
    if (employee) {
      loadSalaryHistory()
      if (activeTab === 'current') {
        calculateCurrentSalary()
      }
    }
  }, [employee, selectedMonth, selectedYear, activeTab])

  const loadSalaryHistory = async () => {
    try {
      const history = await getEmployeeSalaryHistory(employee.id)
      setSalaryHistory(history)
    } catch (error) {
      console.error('Error loading salary history:', error)
    }
  }

  const calculateCurrentSalary = async () => {
    setLoading(true)
    try {
      const salary = calculateSalary(employee, selectedMonth, selectedYear)
      setSalaryData(salary)
    } catch (error) {
      console.error('Error calculating salary:', error)
      alert('Có lỗi xảy ra khi tính lương: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const generateAndDownloadPayslip = async (action = 'download') => {
    if (!salaryData) return
    
    try {
      setLoading(true)
      
      if (action === 'html') {
        generateHTMLPayslip(salaryData)
      } else {
        const doc = generatePayslipPDF(salaryData)
        const filename = `phieu-luong-${salaryData.employee.code}-${salaryData.year}-${String(salaryData.month).padStart(2, '0')}.pdf`
        
        if (action === 'download') {
          downloadPDF(doc, filename)
          alert('Tải phiếu lương thành công!')
        } else if (action === 'print') {
          printPDF(doc)
        }
      }
      
    } catch (error) {
      console.error('Error generating payslip:', error)
      alert('Có lỗi xảy ra khi tạo phiếu lương: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const generateHTMLPayslip = (salary) => {
    const printWindow = window.open('', '_blank')
    const payslipHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Phiếu Lương ${salary.period} - ${salary.employee.fullName}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .title { font-size: 20px; font-weight: bold; color: #2563eb; }
          .employee-info { margin: 20px 0; }
          .info-row { display: flex; margin: 5px 0; }
          .info-label { width: 150px; font-weight: bold; }
          .salary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .salary-table th, .salary-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .salary-table th { background-color: #f8f9fa; font-weight: bold; }
          .total-row { background-color: #e3f2fd; font-weight: bold; }
          .net-salary { background-color: #c8e6c9; font-weight: bold; font-size: 18px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          .signature { margin-top: 40px; display: flex; justify-content: space-between; }
          .sign-box { text-align: center; width: 200px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">CÔNG TY CỔ PHẦN ABC</div>
          <div class="title">PHIẾU LƯƠNG THÁNG ${salary.period}</div>
        </div>

        <div class="employee-info">
          <div class="info-row">
            <span class="info-label">Họ và tên:</span>
            <span>${salary.employee.fullName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Mã nhân viên:</span>
            <span>${salary.employee.code}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phòng ban:</span>
            <span>${salary.employee.department}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Chức vụ:</span>
            <span>${salary.employee.position}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Lương cơ bản:</span>
            <span>${formatCurrency(salary.employee.basicSalary)}</span>
          </div>
        </div>

        <table class="salary-table">
          <thead>
            <tr>
              <th>Khoản mục</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ngày công thực tế</td>
              <td>${salary.attendance.actualWorkDays}/${salary.attendance.workingDays}</td>
              <td>${formatNumber(salary.salaryComponents.dailyRate)}</td>
              <td>${formatCurrency(salary.salaryComponents.basePay)}</td>
            </tr>
            <tr>
              <td>Giờ tăng ca</td>
              <td>${salary.attendance.overtimeHours}h</td>
              <td>${formatNumber(salary.salaryComponents.overtimeRate)}</td>
              <td>${formatCurrency(salary.salaryComponents.overtimePay)}</td>
            </tr>
            <tr>
              <td>Phụ cấp chức vụ</td>
              <td>1</td>
              <td>${formatCurrency(salary.salaryComponents.positionAllowance)}</td>
              <td>${formatCurrency(salary.salaryComponents.positionAllowance)}</td>
            </tr>
            <tr>
              <td>Phụ cấp đi lại</td>
              <td>1</td>
              <td>${formatCurrency(salary.salaryComponents.transportAllowance)}</td>
              <td>${formatCurrency(salary.salaryComponents.transportAllowance)}</td>
            </tr>
            <tr>
              <td>Phụ cấp ăn trưa</td>
              <td>${salary.attendance.actualWorkDays} ngày</td>
              <td>50,000</td>
              <td>${formatCurrency(salary.salaryComponents.mealAllowance)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>TỔNG THU NHẬP</strong></td>
              <td><strong>${formatCurrency(salary.grossSalary)}</strong></td>
            </tr>
            <tr>
              <td>BHXH (8.0%)</td>
              <td colspan="2">Khấu trừ</td>
              <td>${formatCurrency(salary.deductions.socialInsurance)}</td>
            </tr>
            <tr>
              <td>BHYT (1.5%)</td>
              <td colspan="2">Khấu trừ</td>
              <td>${formatCurrency(salary.deductions.healthInsurance)}</td>
            </tr>
            <tr>
              <td>BHTN (1.0%)</td>
              <td colspan="2">Khấu trừ</td>
              <td>${formatCurrency(salary.deductions.unemploymentInsurance)}</td>
            </tr>
            <tr>
              <td>Thuế TNCN</td>
              <td colspan="2">Khấu trừ</td>
              <td>${formatCurrency(salary.deductions.personalIncomeTax)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>TỔNG KHẤU TRỪ</strong></td>
              <td><strong>${formatCurrency(salary.deductions.total)}</strong></td>
            </tr>
            <tr class="net-salary">
              <td colspan="3"><strong>LƯƠNG THỰC NHẬN</strong></td>
              <td><strong>${formatCurrency(salary.netSalary)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="signature">
          <div class="sign-box">
            <div>Người lập</div>
            <br><br><br>
            <div>(Ký, họ tên)</div>
          </div>
          <div class="sign-box">
            <div>Phòng Nhân sự</div>
            <br><br><br>
            <div>(Ký, họ tên)</div>
          </div>
          <div class="sign-box">
            <div>Người nhận</div>
            <br><br><br>
            <div>(Ký, họ tên)</div>
          </div>
        </div>

        <div class="footer">
          <p>Phiếu lương được tạo tự động vào ${new Date().toLocaleDateString('vi-VN')}</p>
          <p>Hotline: 1900-xxx-xxx | Email: hr@company.com</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `
    
    printWindow.document.write(payslipHTML)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Phiếu lương - {employee?.fullName}
            </h3>
            <p className="text-sm text-gray-500">{employee?.code} • {employee?.department}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tính lương hiện tại
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Lịch sử lương ({salaryHistory.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Current Payslip Tab */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              {/* Period Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="flex items-end">
                  <button
                    onClick={calculateCurrentSalary}
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <DollarSign className="h-4 w-4" />
                    )}
                    <span>Tính lương</span>
                  </button>
                </div>
              </div>

              {/* Salary Details */}
              {salaryData && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {salaryData.attendance.actualWorkDays}/{salaryData.attendance.workingDays}
                      </div>
                      <div className="text-sm text-blue-700">Ngày công</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {salaryData.attendance.overtimeHours}h
                      </div>
                      <div className="text-sm text-yellow-700">Tăng ca</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {formatNumber(salaryData.grossSalary)}
                      </div>
                      <div className="text-sm text-green-700">Thu nhập</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {formatNumber(salaryData.netSalary)}
                      </div>
                      <div className="text-sm text-purple-700">Thực nhận</div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Income */}
                    <div className="card p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Thu nhập</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Lương cơ bản</span>
                          <span>{formatCurrency(salaryData.salaryComponents.basePay)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tăng ca</span>
                          <span>{formatCurrency(salaryData.salaryComponents.overtimePay)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phụ cấp chức vụ</span>
                          <span>{formatCurrency(salaryData.salaryComponents.positionAllowance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phụ cấp đi lại</span>
                          <span>{formatCurrency(salaryData.salaryComponents.transportAllowance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phụ cấp ăn trưa</span>
                          <span>{formatCurrency(salaryData.salaryComponents.mealAllowance)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Tổng thu nhập</span>
                          <span>{formatCurrency(salaryData.grossSalary)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="card p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Khấu trừ</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>BHXH (8.0%)</span>
                          <span className="text-red-600">-{formatCurrency(salaryData.deductions.socialInsurance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>BHYT (1.5%)</span>
                          <span className="text-red-600">-{formatCurrency(salaryData.deductions.healthInsurance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>BHTN (1.0%)</span>
                          <span className="text-red-600">-{formatCurrency(salaryData.deductions.unemploymentInsurance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Thuế TNCN</span>
                          <span className="text-red-600">-{formatCurrency(salaryData.deductions.personalIncomeTax)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Tổng khấu trừ</span>
                          <span className="text-red-600">-{formatCurrency(salaryData.deductions.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Salary */}
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <div className="text-lg font-medium text-green-900">Lương thực nhận</div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(salaryData.netSalary)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => generateAndDownloadPayslip('html')}
                      disabled={loading}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <Printer className="h-4 w-4" />
                      <span>In HTML</span>
                    </button>
                    <button
                      onClick={() => generateAndDownloadPayslip('print')}
                      disabled={loading}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <Printer className="h-4 w-4" />
                      <span>In PDF</span>
                    </button>
                    <button
                      onClick={() => generateAndDownloadPayslip('download')}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Tải PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Lịch sử lương</h4>
              
              {salaryHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có dữ liệu lương
                </div>
              ) : (
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
                      {salaryHistory.map((salary) => (
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
                            <div className="flex space-x-2">
                              <button
                                onClick={() => generateHTMLPayslip(salary)}
                                className="text-blue-600 hover:text-blue-800"
                                title="In HTML"
                              >
                                <Printer className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const doc = generatePayslipPDF(salary)
                                  const filename = `phieu-luong-${salary.employee.code}-${salary.year}-${String(salary.month).padStart(2, '0')}.pdf`
                                  downloadPDF(doc, filename)
                                }}
                                className="text-green-600 hover:text-green-800"
                                title="Tải PDF"
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
