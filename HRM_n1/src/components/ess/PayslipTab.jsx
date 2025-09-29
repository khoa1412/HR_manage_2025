import { Download } from 'lucide-react'

export default function PayslipTab() {
  const payslips = [
    { month: 'Tháng 12/2024', status: 'Đã phát', amount: '15000000' },
    { month: 'Tháng 11/2024', status: 'Đã phát', amount: '15000000' },
    { month: 'Tháng 10/2024', status: 'Đã phát', amount: '14500000' }
  ];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Phiếu lương</h3>
        <div className="space-y-4">
          {payslips.map((payslip, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{payslip.month}</h4>
                <p className="text-sm text-gray-500">Lương: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payslip.amount)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {payslip.status}
                </span>
                <button className="btn-outline flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Tải xuống</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
