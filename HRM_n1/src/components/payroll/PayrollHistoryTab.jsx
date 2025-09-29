import { RefreshCw, Eye, Download } from 'lucide-react'
import { formatNumber } from '../../services/payrollService'

export default function PayrollHistoryTab({
  payrollHistory,
  loadPayrollHistory,
  setCurrentPayroll,
  exportToExcel
}) {
  return (
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
              {payrollHistory.map((record) => (
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
  )
}
