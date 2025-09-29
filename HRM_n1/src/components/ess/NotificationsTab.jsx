import { Bell, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react'

export default function NotificationsTab() {
  const notifications = [
    {
      id: 1,
      title: 'Đơn nghỉ phép đã được duyệt',
      message: 'Đơn nghỉ phép ngày 20-22/12/2024 của bạn đã được phòng Nhân sự phê duyệt.',
      type: 'success',
      isRead: false,
      isImportant: false,
      createdAt: '2024-12-15T10:30:00Z',
      sender: 'Phòng Nhân sự'
    },
    {
      id: 2,
      title: 'Thông báo cập nhật phiếu lương tháng 12',
      message: 'Phiếu lương tháng 12/2024 đã được cập nhật. Vui lòng kiểm tra và tải về.',
      type: 'info',
      isRead: false,
      isImportant: true,
      createdAt: '2024-12-15T09:15:00Z',
      sender: 'Phòng Kế toán'
    },
    {
      id: 3,
      title: 'Nhắc nhở chấm công',
      message: 'Bạn chưa chấm công ngày hôm qua (14/12). Vui lòng liên hệ phòng Nhân sự.',
      type: 'warning',
      isRead: false,
      isImportant: true,
      createdAt: '2024-12-15T08:00:00Z',
      sender: 'Hệ thống'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Thông báo</h3>
        <div className="flex space-x-3">
          <select className="input">
            <option>Tất cả thông báo</option>
            <option>Chưa đọc</option>
            <option>Đã đọc</option>
            <option>Quan trọng</option>
          </select>
          <button className="btn-outline">
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Danh sách thông báo</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  notification.type === 'success' ? 'bg-green-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : notification.type === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <Bell className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        {notification.isImportant && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Quan trọng
                          </span>
                        )}
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className={`mt-1 text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>Từ: {notification.sender}</span>
                        <span>•</span>
                        <span>
                          {new Date(notification.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button className="text-blue-600 hover:text-blue-700 text-xs">
                          Đánh dấu đã đọc
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
