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
  AlertTriangle,
  Plus,
  Trash2,
  FolderOpen,
  CalendarCheck,
  Download,
  Eye,
  Upload,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  CreditCard,
  DollarSign
} from 'lucide-react'
import { listLeave, upsertLeave, deleteLeave, listOvertime, upsertOvertime, deleteOvertime } from '../services/ess'
import { getCurrentUserId, getEmployee } from '../services/api'
import { getEmployeeFiles } from '../services/fileUpload'
import StatusBadge from '../components/StatusBadge'

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
  const [employeeFiles, setEmployeeFiles] = useState([])
  const [quickStats, setQuickStats] = useState({
    remainingLeave: 15,
    usedLeave: 5,
    pendingRequests: 0,
    totalOvertime: 0,
    attendanceRate: 95.6,
    currentMonthAttendance: 22
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
        const [employeeData, leavesData, overtimesData, filesData] = await Promise.all([
          getEmployee(currentUserId),
          listLeave(),
          listOvertime(),
          getEmployeeFiles(currentUserId)
        ])
        setEmployee(employeeData)
        setLeaveRequests(leavesData.filter(leave => leave.employeeId === currentUserId))
        setOvertimeRequests(overtimesData.filter(ot => ot.employeeId === currentUserId))
        setEmployeeFiles(filesData || [])
        
        // Calculate stats
        const pendingLeaves = leavesData.filter(leave => 
          leave.employeeId === currentUserId && leave.status === 'pending'
        ).length
        const pendingOvertimes = overtimesData.filter(ot => 
          ot.employeeId === currentUserId && ot.status === 'pending'
        ).length
        
        setQuickStats(prev => ({
          ...prev,
          pendingRequests: pendingLeaves + pendingOvertimes
        }))
      }
    } catch (error) {
      console.error('Error loading ESS data:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateLeaveForm = (form) => {
    const errors = {}
    const data = new FormData(form)
    
    if (!data.get('type')) errors.type = 'Vui lòng chọn loại nghỉ'
    if (!data.get('startDate')) errors.startDate = 'Vui lòng chọn ngày bắt đầu'
    if (!data.get('endDate')) errors.endDate = 'Vui lòng chọn ngày kết thúc'
    if (!data.get('reason')?.trim()) errors.reason = 'Vui lòng nhập lý do'
    
    const startDate = new Date(data.get('startDate'))
    const endDate = new Date(data.get('endDate'))
    
    if (startDate < new Date().setHours(0,0,0,0)) {
      errors.startDate = 'Ngày bắt đầu không thể trong quá khứ'
    }
    
    if (endDate < startDate) {
      errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
    }
    
    const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    if (dayDiff > quickStats.remainingLeave) {
      errors.endDate = `Không đủ ngày phép (còn ${quickStats.remainingLeave} ngày)`
    }
    
    return errors
  }

  const handleLeaveSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateLeaveForm(e.target)
    setLeaveErrors(errors)
    
    if (Object.keys(errors).length > 0) return
    
    setSubmitting(true)
    try {
      const formData = new FormData(e.target)
      await upsertLeave({
        id: Date.now().toString(),
        employeeId: getCurrentUserId(),
        type: formData.get('type'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        reason: formData.get('reason'),
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      
      setShowLeaveForm(false)
      e.target.reset()
      setLeaveErrors({})
      loadData()
      alert('Đã gửi yêu cầu nghỉ phép thành công!')
    } catch (error) {
      console.error('Error submitting leave:', error)
      alert('Có lỗi xảy ra khi gửi yêu cầu')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOvertimeSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const date = formData.get('date')
    const hours = parseFloat(formData.get('hours'))
    const reason = formData.get('reason')?.trim()
    
    const errors = {}
    if (!date) errors.date = 'Vui lòng chọn ngày'
    if (!hours || hours <= 0 || hours > 12) errors.hours = 'Số giờ phải từ 0.5 đến 12'
    if (!reason) errors.reason = 'Vui lòng nhập lý do'
    
    setOvertimeErrors(errors)
    if (Object.keys(errors).length > 0) return
    
    setSubmitting(true)
    try {
      await upsertOvertime({
        id: Date.now().toString(),
        employeeId: getCurrentUserId(),
        date: date,
        hours: hours,
        reason: reason,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      
      setShowOvertimeForm(false)
      e.target.reset()
      setOvertimeErrors({})
      loadData()
      alert('Đã gửi yêu cầu tăng ca thành công!')
    } catch (error) {
      console.error('Error submitting overtime:', error)
      alert('Có lỗi xảy ra khi gửi yêu cầu')
    } finally {
      setSubmitting(false)
    }
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
              <p className="text-yellow-100">Chờ duyệt</p>
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
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <CalendarCheck className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-indigo-100">Chấm công tháng</p>
              <p className="text-2xl font-bold">{quickStats.currentMonthAttendance}</p>
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
          <div className="space-y-6">
            {/* Personal Info Overview */}
            <div className="card p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {employee?.fullName?.charAt(0) || 'N'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{employee?.fullName || 'N/A'}</h2>
                  <p className="text-gray-600">{employee?.position || 'N/A'} • {employee?.department || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Mã NV: {employee?.code || 'N/A'}</p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={employee?.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
                  <button className="btn-outline flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                </div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                    <dd className="text-sm text-gray-900 font-medium">{employee?.fullName || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngày sinh</dt>
                    <dd className="text-sm text-gray-900">
                      {employee?.birthDate ? new Date(employee.birthDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
                    <dd className="text-sm text-gray-900">{employee?.gender || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Số CCCD</dt>
                    <dd className="text-sm text-gray-900 font-mono">{employee?.cccdNumber || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tình trạng hôn nhân</dt>
                    <dd className="text-sm text-gray-900">{employee?.maritalStatus || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              {/* Contact Information */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h3>
                <dl className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{employee?.personalEmail || employee?.email || 'N/A'}</dd>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Điện thoại</dt>
                      <dd className="text-sm text-gray-900">{employee?.personalPhone || employee?.phone || 'N/A'}</dd>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Địa chỉ tạm trú</dt>
                      <dd className="text-sm text-gray-900">{employee?.temporaryAddress || 'N/A'}</dd>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Địa chỉ thường trú</dt>
                      <dd className="text-sm text-gray-900">{employee?.permanentAddress || 'N/A'}</dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Liên hệ khẩn cấp</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Tên</dt>
                      <dd className="text-sm text-gray-900">{employee?.emergencyContactName || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Quan hệ</dt>
                      <dd className="text-sm text-gray-900">{employee?.emergencyContactRelation || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Số điện thoại</dt>
                      <dd className="text-sm text-gray-900">{employee?.emergencyContactPhone || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Work Information */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin công việc</h3>
                <dl className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Mã nhân viên</dt>
                      <dd className="text-sm text-gray-900 font-mono">{employee?.code || 'N/A'}</dd>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phòng ban</dt>
                      <dd className="text-sm text-gray-900">{employee?.department || 'N/A'}</dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Vị trí</dt>
                    <dd className="text-sm text-gray-900">{employee?.position || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Chức danh</dt>
                    <dd className="text-sm text-gray-900">{employee?.title || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngày vào làm</dt>
                    <dd className="text-sm text-gray-900">
                      {employee?.startDate || employee?.joinDate ? 
                        new Date(employee.startDate || employee.joinDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Loại hợp đồng</dt>
                    <dd className="text-sm text-gray-900">{employee?.contractType || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Education & Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">Học vấn & Kỹ năng</h3>
                </div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Bằng cấp cao nhất</dt>
                    <dd className="text-sm text-gray-900">{employee?.highestDegree || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Trường đào tạo</dt>
                    <dd className="text-sm text-gray-900">{employee?.university || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Chuyên ngành</dt>
                    <dd className="text-sm text-gray-900">{employee?.major || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Chứng chỉ khác</dt>
                    <dd className="text-sm text-gray-900">{employee?.otherCertificates || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngôn ngữ</dt>
                    <dd className="text-sm text-gray-900">
                      {employee?.languages || 'N/A'} 
                      {employee?.languageLevel && ` (${employee.languageLevel})`}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">Thông tin thuế & BHXH</h3>
                </div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mã số thuế</dt>
                    <dd className="text-sm text-gray-900 font-mono">{employee?.taxCode || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mã BHXH</dt>
                    <dd className="text-sm text-gray-900 font-mono">{employee?.socialInsuranceCode || 'N/A'}</dd>
                  </div>
                </dl>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <h4 className="text-sm font-medium text-gray-900">Thông tin lương</h4>
                  </div>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Lương thử việc</dt>
                      <dd className="text-sm text-gray-900">
                        {employee?.trialSalary ? 
                          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(employee.trialSalary) : 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Lương chính thức</dt>
                      <dd className="text-sm text-gray-900">
                        {employee?.officialSalary ? 
                          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(employee.officialSalary) : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue with other tabs... */}
        {activeTab === 'leave' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Quản lý nghỉ phép</h3>
              <button 
                onClick={() => setShowLeaveForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Đăng ký nghỉ phép</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{quickStats.remainingLeave}</div>
                <div className="text-sm text-gray-500">Ngày phép còn lại</div>
              </div>
              <div className="card p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{quickStats.usedLeave}</div>
                <div className="text-sm text-gray-500">Ngày đã sử dụng</div>
              </div>
              <div className="card p-6 text-center">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {leaveRequests.filter(req => req.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500">Đang chờ duyệt</div>
              </div>
            </div>

            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900">Lịch sử nghỉ phép</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại nghỉ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lý do
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.type === 'annual' ? 'Nghỉ phép' :
                           request.type === 'sick' ? 'Nghỉ ốm' :
                           request.type === 'personal' ? 'Nghỉ cá nhân' : request.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(request.startDate).toLocaleDateString('vi-VN')} - {new Date(request.endDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {request.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status === 'approved' ? 'Đã duyệt' :
                             request.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payslip' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Phiếu lương</h3>
              <div className="space-y-4">
                {[
                  { month: 'Tháng 12/2024', status: 'Đã phát', amount: '15,000,000' },
                  { month: 'Tháng 11/2024', status: 'Đã phát', amount: '15,000,000' },
                  { month: 'Tháng 10/2024', status: 'Đã phát', amount: '14,500,000' }
                ].map((payslip, index) => (
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
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Tài liệu cá nhân</h3>
              <button className="btn-primary flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Tải lên tài liệu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'CCCD mặt trước', type: 'image', size: '2.1 MB', date: '15/12/2024' },
                { name: 'CCCD mặt sau', type: 'image', size: '1.9 MB', date: '15/12/2024' },
                { name: 'Bằng tốt nghiệp', type: 'pdf', size: '3.2 MB', date: '10/12/2024' },
                { name: 'Hợp đồng lao động', type: 'pdf', size: '1.5 MB', date: '01/11/2024' }
              ].map((doc, index) => (
                <div key={index} className="card p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-500">{doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="btn-outline flex-1 flex items-center justify-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Xem</span>
                    </button>
                    <button className="btn-outline flex-1 flex items-center justify-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Tải</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keep existing tabs content for other sections */}
      </div>

      {/* Forms and modals remain the same */}
    </div>
  )
}
