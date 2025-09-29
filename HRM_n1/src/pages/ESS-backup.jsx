import { useState, useEffect } from 'react'
import { 
  User,
  Calendar,
  Clock,
  FileText,
  Bell,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  FolderOpen,
  CalendarCheck,
  Download,
  Eye,
  Upload
} from 'lucide-react'
import { listLeave, upsertLeave, deleteLeave, listOvertime, upsertOvertime, deleteOvertime } from '../services/ess'
import { getCurrentUserId, getEmployee } from '../services/api'

export default function ESS() {
  const [activeTab, setActiveTab] = useState('profile')
  const [employee, setEmployee] = useState(null)
  const [leaveRequests, setLeaveRequests] = useState([])
  const [overtimeRequests, setOvertimeRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLeaveForm, setShowLeaveForm] = useState(false)
  const [showOvertimeForm, setShowOvertimeForm] = useState(false)
  const [leaveErrors, setLeaveErrors] = useState({})
  const [overtimeErrors, setOvertimeErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [quickStats, setQuickStats] = useState({
    remainingLeave: 15,
    usedLeave: 5,
    pendingRequests: 0,
    totalOvertime: 0
  })

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: User },
    { id: 'leave', name: 'Nghỉ phép', icon: Calendar },
    { id: 'overtime', name: 'Tăng ca', icon: Clock },
    { id: 'attendance', name: 'Chấm công của tôi', icon: CalendarCheck },
    { id: 'payslip', name: 'Phiếu lương', icon: FileText },
    { id: 'documents', name: 'Tài liệu cá nhân', icon: FolderOpen },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const currentUserId = getCurrentUserId()
      if (currentUserId) {
        const [employeeData, leavesData, overtimesData] = await Promise.all([
          getEmployee(currentUserId),
          listLeave(),
          listOvertime()
        ])
        setEmployee(employeeData)
        setLeaveRequests(leavesData)
        setOvertimeRequests(overtimesData)
      }
    } catch (error) {
      console.error('Error loading ESS data:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateLeaveForm = (formData) => {
    const errors = {}
    const startDate = formData.get('startDate')
    const endDate = formData.get('endDate')
    const today = new Date().toISOString().split('T')[0]
    
    if (!formData.get('type')) {
      errors.type = 'Vui lòng chọn loại nghỉ'
    }
    
    if (!startDate) {
      errors.startDate = 'Vui lòng chọn ngày bắt đầu'
    } else if (startDate < today) {
      errors.startDate = 'Ngày bắt đầu không được là ngày trong quá khứ'
    }
    
    if (!endDate) {
      errors.endDate = 'Vui lòng chọn ngày kết thúc'
    } else if (endDate < startDate) {
      errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
    }
    
    return errors
  }

  const handleLeaveSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    // Validate form
    const errors = validateLeaveForm(formData)
    setLeaveErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return
    }
    
    setSubmitting(true)
    try {
      const leaveData = {
        type: formData.get('type'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        reason: formData.get('reason') || ''
      }

      await upsertLeave(leaveData)
      setShowLeaveForm(false)
      setLeaveErrors({})
      loadData()
    } catch (error) {
      console.error('Error submitting leave:', error)
      alert('Có lỗi xảy ra khi gửi đơn nghỉ phép')
    } finally {
      setSubmitting(false)
    }
  }

  const validateOvertimeForm = (formData) => {
    const errors = {}
    const date = formData.get('date')
    const hours = parseFloat(formData.get('hours'))
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const maxDate = yesterday.toISOString().split('T')[0]
    
    if (!date) {
      errors.date = 'Vui lòng chọn ngày tăng ca'
    } else if (date > maxDate) {
      errors.date = 'Chỉ có thể đăng ký tăng ca cho ngày hôm qua trở về trước'
    }
    
    if (!formData.get('hours') || isNaN(hours)) {
      errors.hours = 'Vui lòng nhập số giờ tăng ca'
    } else if (hours < 0.5) {
      errors.hours = 'Số giờ tăng ca tối thiểu là 0.5 giờ'
    } else if (hours > 8) {
      errors.hours = 'Số giờ tăng ca tối đa là 8 giờ'
    }
    
    return errors
  }

  const handleOvertimeSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    // Validate form
    const errors = validateOvertimeForm(formData)
    setOvertimeErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return
    }
    
    setSubmitting(true)
    try {
      const overtimeData = {
        date: formData.get('date'),
        hours: parseFloat(formData.get('hours')),
        note: formData.get('note') || ''
      }

      await upsertOvertime(overtimeData)
      setShowOvertimeForm(false)
      setOvertimeErrors({})
      loadData()
    } catch (error) {
      console.error('Error submitting overtime:', error)
      alert('Có lỗi xảy ra khi gửi đơn tăng ca')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteLeave = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn nghỉ phép này?')) {
      try {
        await deleteLeave(id)
        loadData()
      } catch (error) {
        console.error('Error deleting leave:', error)
        alert('Có lỗi xảy ra khi xóa đơn nghỉ phép')
      }
    }
  }

  const handleDeleteOvertime = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn tăng ca này?')) {
      try {
        await deleteOvertime(id)
        loadData()
      } catch (error) {
        console.error('Error deleting overtime:', error)
        alert('Có lỗi xảy ra khi xóa đơn tăng ca')
      }
    }
  }

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cổng Nhân viên</h1>
          <p className="mt-1 text-sm text-gray-500">
            Xin chào {employee?.fullName || 'Nhân viên'}, chào mừng đến với cổng thông tin cá nhân
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hôm nay</p>
          <p className="text-lg font-medium text-gray-900">
            {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Calendar className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-blue-100">Nghỉ phép còn lại</p>
              <p className="text-2xl font-bold">{quickStats.remainingLeave} ngày</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-green-100">Đã sử dụng</p>
              <p className="text-2xl font-bold">{quickStats.usedLeave} ngày</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Clock className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-yellow-100">Yêu cầu chờ duyệt</p>
              <p className="text-2xl font-bold">{quickStats.pendingRequests}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Clock className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-purple-100">Tăng ca tháng này</p>
              <p className="text-2xl font-bold">{quickStats.totalOvertime}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
                <button className="btn-outline flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                  <dd className="text-sm text-gray-900">{employee?.fullName || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{employee?.email || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                  <dd className="text-sm text-gray-900">{employee?.phone || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mã nhân viên</dt>
                  <dd className="text-sm text-gray-900">{employee?.code || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin công việc</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Chức vụ</dt>
                  <dd className="text-sm text-gray-900">{employee?.position || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phòng ban</dt>
                  <dd className="text-sm text-gray-900">{employee?.department || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ngày vào làm</dt>
                  <dd className="text-sm text-gray-900">
                    {employee?.joinDate ? new Date(employee.joinDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                  <dd className="text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee?.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : employee?.status === 'Probation'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee?.status === 'Active' ? 'Đang làm việc' : 
                       employee?.status === 'Probation' ? 'Thử việc' : 'Đã nghỉ việc'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Đăng ký nghỉ phép</h3>
                <button 
                  onClick={() => setShowLeaveForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tạo yêu cầu mới</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Tổng ngày phép</div>
                  <div className="text-2xl font-bold text-blue-600">12</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-900">Đã sử dụng</div>
                  <div className="text-2xl font-bold text-green-600">
                    {leaveRequests.filter(req => req.status === 'approved').reduce((sum, req) => 
                      sum + calculateLeaveDays(req.startDate, req.endDate), 0)}
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-yellow-900">Còn lại</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {12 - leaveRequests.filter(req => req.status === 'approved').reduce((sum, req) => 
                      sum + calculateLeaveDays(req.startDate, req.endDate), 0)}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại nghỉ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Từ ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đến ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.type === 'annual' ? 'Nghỉ phép' :
                           request.type === 'sick' ? 'Nghỉ ốm' :
                           request.type === 'unpaid' ? 'Nghỉ không lương' : 'Khác'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.startDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.endDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {calculateLeaveDays(request.startDate, request.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {request.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {request.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {request.status === 'approved' ? 'Đã duyệt' :
                             request.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleDeleteLeave(request.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {leaveRequests.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          Chưa có đơn nghỉ phép nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overtime' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Đăng ký tăng ca</h3>
              <button 
                onClick={() => setShowOvertimeForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo yêu cầu mới</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số giờ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overtimeRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.note || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'approved' ? 'Đã duyệt' :
                           request.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteOvertime(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {overtimeRequests.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Chưa có đơn tăng ca nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payslip' && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Phiếu lương</h3>
            <p className="text-gray-500">Tính năng đang được phát triển...</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Thông báo mới nhất</h3>
                <button className="text-primary-600 hover:text-primary-800 text-sm">
                  Đánh dấu tất cả đã đọc
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "Yêu cầu nghỉ phép đã được phê duyệt",
                    message: "Yêu cầu nghỉ phép ngày 15/12/2024 - 16/12/2024 đã được phê duyệt bởi quản lý trực tiếp.",
                    time: "2 giờ trước",
                    type: "success",
                    read: false
                  },
                  {
                    id: 2,
                    title: "Cập nhật phiếu lương tháng 12",
                    message: "Phiếu lương tháng 12/2024 đã được cập nhật. Vui lòng kiểm tra trong mục Phiếu lương.",
                    time: "1 ngày trước",
                    type: "info",
                    read: true
                  },
                  {
                    id: 3,
                    title: "Nhắc nhở chấm công",
                    message: "Bạn chưa chấm công ra ngày hôm qua. Vui lòng liên hệ HR để cập nhật.",
                    time: "2 ngày trước",
                    type: "warning",
                    read: false
                  }
                ].map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {notification.type === 'success' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {notification.type === 'info' && (
                          <Bell className="h-5 w-5 text-blue-500" />
                        )}
                        {notification.type === 'warning' && (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                        {!notification.read && (
                          <div className="mt-2">
                            <button className="text-xs text-primary-600 hover:text-primary-800">
                              Đánh dấu đã đọc
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leave Request Form Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Đăng ký nghỉ phép</h3>
            
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="label">
                  Loại nghỉ <span className="text-red-500">*</span>
                </label>
                <select 
                  name="type" 
                  className={`input ${leaveErrors.type ? 'border-red-500' : ''}`}
                  onChange={() => {
                    if (leaveErrors.type) {
                      setLeaveErrors(prev => ({ ...prev, type: '' }))
                    }
                  }}
                >
                  <option value="">Chọn loại nghỉ</option>
                  <option value="annual">Nghỉ phép</option>
                  <option value="sick">Nghỉ ốm</option>
                  <option value="unpaid">Nghỉ không lương</option>
                  <option value="other">Khác</option>
                </select>
                {leaveErrors.type && (
                  <p className="mt-1 text-sm text-red-600">{leaveErrors.type}</p>
                )}
              </div>
              
              <div>
                <label className="label">
                  Từ ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  className={`input ${leaveErrors.startDate ? 'border-red-500' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={() => {
                    if (leaveErrors.startDate) {
                      setLeaveErrors(prev => ({ ...prev, startDate: '' }))
                    }
                  }}
                />
                {leaveErrors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{leaveErrors.startDate}</p>
                )}
              </div>
              
              <div>
                <label className="label">
                  Đến ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  className={`input ${leaveErrors.endDate ? 'border-red-500' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={() => {
                    if (leaveErrors.endDate) {
                      setLeaveErrors(prev => ({ ...prev, endDate: '' }))
                    }
                  }}
                />
                {leaveErrors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{leaveErrors.endDate}</p>
                )}
              </div>
              
              <div>
                <label className="label">Lý do</label>
                <textarea
                  name="reason"
                  className="input"
                  rows="3"
                  placeholder="Nhập lý do nghỉ phép..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowLeaveForm(false)
                    setLeaveErrors({})
                  }}
                  className="btn-outline"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overtime Request Form Modal */}
      {showOvertimeForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Đăng ký tăng ca</h3>
            
            <form onSubmit={handleOvertimeSubmit} className="space-y-4">
              <div>
                <label className="label">
                  Ngày tăng ca <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className={`input ${overtimeErrors.date ? 'border-red-500' : ''}`}
                  max={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]}
                  onChange={() => {
                    if (overtimeErrors.date) {
                      setOvertimeErrors(prev => ({ ...prev, date: '' }))
                    }
                  }}
                />
                {overtimeErrors.date && (
                  <p className="mt-1 text-sm text-red-600">{overtimeErrors.date}</p>
                )}
              </div>
              
              <div>
                <label className="label">
                  Số giờ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="hours"
                  min="0.5"
                  step="0.5"
                  max="8"
                  className={`input ${overtimeErrors.hours ? 'border-red-500' : ''}`}
                  placeholder="Ví dụ: 2.5"
                  onChange={() => {
                    if (overtimeErrors.hours) {
                      setOvertimeErrors(prev => ({ ...prev, hours: '' }))
                    }
                  }}
                />
                {overtimeErrors.hours && (
                  <p className="mt-1 text-sm text-red-600">{overtimeErrors.hours}</p>
                )}
              </div>
              
              <div>
                <label className="label">Ghi chú</label>
                <textarea
                  name="note"
                  className="input"
                  rows="3"
                  placeholder="Mô tả công việc cần làm thêm..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOvertimeForm(false)
                    setOvertimeErrors({})
                  }}
                  className="btn-outline"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
