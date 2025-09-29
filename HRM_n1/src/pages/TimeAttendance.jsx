import { useState, useEffect } from 'react'
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  FileText,
  Settings,
  Target,
  TrendingUp,
  Plus,
  LayoutGrid
} from 'lucide-react'
import { listEmployees } from '../services/api'
import AttendanceImport from '../components/AttendanceImport'
import AttendanceApproval from '../components/AttendanceApproval'
import AttendanceReportManager from '../components/AttendanceReportManager'
import AttendanceDashboard from '../components/AttendanceDashboard'

export default function TimeAttendance() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [employees, setEmployees] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [showShiftTemplateModal, setShowShiftTemplateModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [shifts, setShifts] = useState([])
  const [shiftTemplates, setShiftTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const employeeData = await listEmployees()
      setEmployees(employeeData)
      loadShiftData(employeeData)
    } catch (error) {
      console.error('Error loading employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadShiftData = (employeesData) => {
    // Load shift templates
    const templates = [
      {
        id: 'shift_template_1',
        name: 'Ca hành chính',
        startTime: '08:00',
        endTime: '17:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        roundingRules: {
          checkIn: 15, // minutes
          checkOut: 15,
          breakTime: 5
        },
        isActive: true,
        workDays: [1, 2, 3, 4, 5], // Monday to Friday
        createdAt: '2024-01-01'
      },
      {
        id: 'shift_template_2',
        name: 'Ca sáng',
        startTime: '06:00',
        endTime: '14:00',
        breakStart: '10:00',
        breakEnd: '10:15',
        roundingRules: {
          checkIn: 10,
          checkOut: 10,
          breakTime: 5
        },
        isActive: true,
        workDays: [1, 2, 3, 4, 5, 6],
        createdAt: '2024-01-01'
      },
      {
        id: 'shift_template_3',
        name: 'Ca chiều',
        startTime: '14:00',
        endTime: '22:00',
        breakStart: '18:00',
        breakEnd: '18:30',
        roundingRules: {
          checkIn: 10,
          checkOut: 10,
          breakTime: 5
        },
        isActive: true,
        workDays: [1, 2, 3, 4, 5, 6],
        createdAt: '2024-01-01'
      }
    ]
    setShiftTemplates(templates)

    // Load employee shift assignments
    const assignments = employeesData.map(emp => ({
      id: `assignment_${emp.id}`,
      employeeId: emp.id,
      shiftTemplateId: 'shift_template_1', // Default to office hours
      effectiveDate: '2024-01-01',
      endDate: null,
      isActive: true
    }))
    setShifts(assignments)
  }

  const handleImportComplete = (result) => {
    if (result.processed > 0) {
      alert(`Import thành công ${result.processed}/${result.total} bản ghi chấm công!`)
      // Refresh attendance data here
    }
  }

  // Generate mock attendance data
  const generateAttendanceData = (employee) => {
    const statuses = ['present', 'late', 'absent', 'half-day']
    const weights = [0.85, 0.1, 0.03, 0.02] // 85% present, 10% late, 3% absent, 2% half-day
    
    let cumulative = 0
    const random = Math.random()
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) {
        const baseTime = 8 * 60 // 8:00 AM in minutes
        const variance = Math.random() * 60 - 30 // ±30 minutes
        const checkInTime = baseTime + variance
        const workHours = 8 + (Math.random() * 2 - 1) // 7-9 hours
        
        return {
          status: statuses[i],
          checkIn: checkInTime > 0 ? `${Math.floor(checkInTime / 60).toString().padStart(2, '0')}:${(checkInTime % 60).toString().padStart(2, '0')}` : null,
          checkOut: checkInTime > 0 ? `${Math.floor((checkInTime + workHours * 60) / 60).toString().padStart(2, '0')}:${((checkInTime + workHours * 60) % 60).toString().padStart(2, '0')}` : null,
          workHours: statuses[i] === 'present' ? workHours.toFixed(1) : statuses[i] === 'half-day' ? (workHours / 2).toFixed(1) : 0,
          overtime: Math.random() > 0.8 ? (Math.random() * 2).toFixed(1) : 0,
          lateMinutes: statuses[i] === 'late' ? Math.floor(Math.random() * 30 + 5) : 0
        }
      }
    }
  }

  const getAttendanceData = () => {
    return employees.map(emp => ({
      ...emp,
      attendance: generateAttendanceData(emp)
    }))
  }

  const filteredData = getAttendanceData().filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.code?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Có mặt
        </span>
      case 'late':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Đi muộn
        </span>
      case 'absent':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Vắng mặt
        </span>
      case 'half-day':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="h-3 w-3 mr-1" />
          Nửa ngày
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Chưa xác định
        </span>
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'daily', label: 'Chấm công ngày', icon: Calendar },
    { id: 'approval', label: 'Phê duyệt', icon: CheckCircle },
    { id: 'reports', label: 'Báo cáo', icon: FileText },
    { id: 'shifts', label: 'Ca làm việc', icon: Clock }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chấm công</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý chấm công và ca làm việc</p>
        </div>
        <div className="flex space-x-3">
          <AttendanceImport onImportComplete={handleImportComplete} />
          <button className="btn-outline flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'dashboard' && (
        <AttendanceDashboard />
      )}

      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="card p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Chọn ngày</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Tìm kiếm</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tên hoặc mã nhân viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="label">Phòng ban</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="input"
                >
                  <option value="">Tất cả phòng ban</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button className="btn-primary w-full flex items-center justify-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Lọc</span>
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tổng số</p>
                  <p className="text-2xl font-semibold text-gray-900">{filteredData.length}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Có mặt</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredData.filter(emp => ['present', 'late'].includes(emp.attendance.status)).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Đi muộn</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredData.filter(emp => emp.attendance.status === 'late').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Vắng mặt</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredData.filter(emp => emp.attendance.status === 'absent').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Chấm công ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng ban
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giờ vào
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giờ ra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giờ làm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tăng ca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {employee.fullName?.charAt(0) || 'N'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(employee.attendance.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.attendance.checkIn || '-'}
                        {employee.attendance.lateMinutes > 0 && (
                          <span className="text-red-500 text-xs ml-1">
                            (+{employee.attendance.lateMinutes}p)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.attendance.checkOut || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.attendance.workHours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.attendance.overtime > 0 ? `${employee.attendance.overtime}h` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.attendance.status === 'late' ? 'Đi muộn' : 
                         employee.attendance.status === 'absent' ? 'Vắng mặt không phép' : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit className="h-4 w-4" />
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

      {activeTab === 'reports' && (
        <AttendanceReportManager />
      )}

      {activeTab === 'approval' && (
        <AttendanceApproval />
      )}

      {activeTab === 'shifts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Quản lý ca làm việc</h3>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowShiftTemplateModal(true)}
                className="btn-outline flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Quản lý mẫu ca</span>
              </button>
              <button 
                onClick={() => setShowShiftModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Gán ca làm việc</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Ca sáng', time: '08:00 - 17:00', employees: 45, color: 'blue' },
              { name: 'Ca chiều', time: '13:00 - 22:00', employees: 23, color: 'green' },
              { name: 'Ca đêm', time: '22:00 - 06:00', employees: 12, color: 'purple' }
            ].map((shift, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{shift.name}</h4>
                  <div className={`h-3 w-3 rounded-full bg-${shift.color}-500`}></div>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{shift.time}</p>
                <p className="text-sm text-gray-500 mt-2">{shift.employees} nhân viên</p>
                <div className="flex space-x-2 mt-4">
                  <button className="btn-outline flex-1">Sửa</button>
                  <button className="btn-outline flex-1">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

