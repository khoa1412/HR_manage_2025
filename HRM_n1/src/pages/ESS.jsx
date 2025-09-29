import { useState, useEffect } from 'react'
import { 
  User,
  Calendar,
  Clock,
  FileText,
  Bell,
  FolderOpen,
  CalendarCheck,
  CheckCircle
} from 'lucide-react'
import { listMyLeave, upsertLeave, listMyOvertime, upsertOvertime } from '../services/ess'
import { getCurrentUserId, getEmployee } from '../services/api'
import { getEmployeeFiles } from '../services/fileUpload'
import ProfileTab from '../components/ess/ProfileTab'
import LeaveTab from '../components/ess/LeaveTab'
import OvertimeTab from '../components/ess/OvertimeTab'
import PayslipTab from '../components/ess/PayslipTab'
import DocumentsTab from '../components/ess/DocumentsTab'
import AttendanceTab from '../components/ess/AttendanceTab'
import NotificationsTab from '../components/ess/NotificationsTab'

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
          listMyLeave(),
          listMyOvertime(),
          getEmployeeFiles(currentUserId)
        ])
        setEmployee(employeeData)
        setLeaveRequests(leavesData)
        setOvertimeRequests(overtimesData)
        setEmployeeFiles(filesData || [])
        
        // Calculate stats
        const pendingLeaves = leavesData.filter(leave => leave.status === 'pending').length
        const pendingOvertimes = overtimesData.filter(ot => ot.status === 'pending').length
        
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
        {activeTab === 'profile' && <ProfileTab employee={employee} />}
        {activeTab === 'leave' && <LeaveTab leaveRequests={leaveRequests} quickStats={quickStats} onShowForm={() => setShowLeaveForm(true)} />}
        {activeTab === 'overtime' && <OvertimeTab overtimeRequests={overtimeRequests} quickStats={quickStats} onShowForm={() => setShowOvertimeForm(true)} />}
        {activeTab === 'attendance' && <AttendanceTab quickStats={quickStats} />}
        {activeTab === 'payslip' && <PayslipTab />}
        {activeTab === 'documents' && <DocumentsTab employeeFiles={employeeFiles} />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>

      {/* Forms and modals remain the same */}
    </div>
  )
}
