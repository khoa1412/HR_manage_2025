import { Download, CalendarCheck, Clock, AlertTriangle } from 'lucide-react'

export default function AttendanceTab({ quickStats }) {
  // Mock data for demonstration
  const attendanceData = Array.from({ length: 20 }, (_, i) => {
    const date = new Date(2024, 11, i + 1)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const isToday = date.toDateString() === new Date().toDateString()
    const isFuture = date > new Date()
    
    if (isFuture) return null
    
    const statuses = ['Đúng giờ', 'Đi muộn', 'Về sớm', 'Nghỉ có phép']
    const status = isWeekend ? 'Cuối tuần' : statuses[Math.floor(Math.random() * statuses.length)]
    
    return {
      date,
      isToday,
      status,
      checkIn: !isWeekend && status !== 'Nghỉ có phép' ? (status === 'Đi muộn' ? '08:15' : '08:00') : '-',
      checkOut: !isWeekend && status !== 'Nghỉ có phép' ? (status === 'Về sớm' ? '16:45' : '17:00') : '-',
      workHours: !isWeekend && status !== 'Nghỉ có phép' ? '8.0h' : '-',
      overtime: !isWeekend && Math.random() > 0.8 ? '2.0h' : '-'
    }
  }).filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Chấm công của tôi</h3>
        <div className="flex space-x-3">
          <select className="input">
            <option>Tháng này</option>
            <option>Tháng trước</option>
            <option>3 tháng gần đây</option>
          </select>
          <button className="btn-outline flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <CalendarCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{quickStats.currentMonthAttendance}</div>
          <div className="text-sm text-gray-500">Ngày công tháng này</div>
        </div>
        <div className="card p-6 text-center">
          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{quickStats.attendanceRate}%</div>
          <div className="text-sm text-gray-500">Tỷ lệ chấm công</div>
        </div>
        <div className="card p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">2</div>
          <div className="text-sm text-gray-500">Lần đi muộn</div>
        </div>
        <div className="card p-6 text-center">
          <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{quickStats.totalOvertime}h</div>
          <div className="text-sm text-gray-500">Tổng tăng ca</div>
        </div>
      </div>

      {/* Attendance Calendar/Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Chi tiết chấm công tháng 12/2024</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ vào</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ ra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số giờ làm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tăng ca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((item, i) => (
                <tr key={i} className={item.isToday ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {item.date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                      </div>
                      {item.isToday && <div className="text-xs text-blue-600">Hôm nay</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={item.status === 'Đi muộn' ? 'text-red-600' : ''}>{item.checkIn}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={item.status === 'Về sớm' ? 'text-red-600' : ''}>{item.checkOut}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.workHours}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.overtime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Đúng giờ' ? 'bg-green-100 text-green-800' :
                      item.status === 'Đi muộn' || item.status === 'Về sớm' ? 'bg-red-100 text-red-800' :
                      item.status === 'Nghỉ có phép' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
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
