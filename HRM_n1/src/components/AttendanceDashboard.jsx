import { useState, useEffect } from 'react'
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Filter,
  Search
} from 'lucide-react'
import { listEmployees } from '../services/api'

export default function AttendanceDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [employees, setEmployees] = useState([])
  const [attendanceData, setAttendanceData] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  useEffect(() => {
    loadData()
  }, [currentMonth, currentYear])

  const loadData = async () => {
    setLoading(true)
    try {
      const employeesData = await listEmployees()
      setEmployees(employeesData)

      // Load attendance data for current month
      const attendanceMap = {}
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

      for (const employee of employeesData) {
        attendanceMap[employee.id] = {}
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayOfWeek = new Date(date).getDay()
          
          // Skip weekends for now
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            attendanceMap[employee.id][date] = { status: 'weekend' }
            continue
          }

          // Generate mock attendance data
          const hasAttendance = Math.random() > 0.1 // 90% attendance rate
          
          if (hasAttendance) {
            const checkIn = generateRandomTime(8, 0, 9, 30) // 8:00 - 9:30
            const checkOut = generateRandomTime(17, 0, 19, 0) // 17:00 - 19:00
            const isLate = checkIn > '08:30'
            const isEarly = checkOut < '17:30'
            
            attendanceMap[employee.id][date] = {
              status: 'present',
              checkIn,
              checkOut,
              isLate,
              isEarly,
              workHours: calculateWorkHours(checkIn, checkOut),
              overtime: checkOut > '18:00' ? calculateOvertime(checkOut) : 0
            }
          } else {
            attendanceMap[employee.id][date] = { status: 'absent' }
          }
        }
      }

      setAttendanceData(attendanceMap)
    } catch (error) {
      console.error('Error loading attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateRandomTime = (startHour, startMin, endHour, endMin) => {
    const start = startHour * 60 + startMin
    const end = endHour * 60 + endMin
    const randomMinutes = Math.floor(Math.random() * (end - start)) + start
    const hours = Math.floor(randomMinutes / 60)
    const minutes = randomMinutes % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    const [inH, inM] = checkIn.split(':').map(Number)
    const [outH, outM] = checkOut.split(':').map(Number)
    const inMinutes = inH * 60 + inM
    const outMinutes = outH * 60 + outM
    const workMinutes = outMinutes - inMinutes - 60 // Subtract 1 hour lunch break
    return Math.max(0, Math.round(workMinutes / 60 * 10) / 10) // Round to 1 decimal
  }

  const calculateOvertime = (checkOut) => {
    const [outH, outM] = checkOut.split(':').map(Number)
    const outMinutes = outH * 60 + outM
    const regularEnd = 18 * 60 // 18:00
    const overtimeMinutes = Math.max(0, outMinutes - regularEnd)
    return Math.round(overtimeMinutes / 60 * 10) / 10
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
    setSelectedDate(null)
    setSelectedEmployee(null)
  }

  const getDaysInMonth = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getDateString = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getDayAttendanceStats = (day) => {
    const dateStr = getDateString(day)
    let present = 0, absent = 0, late = 0

    filteredEmployees.forEach(emp => {
      const dayData = attendanceData[emp.id]?.[dateStr]
      if (dayData) {
        if (dayData.status === 'present') {
          present++
          if (dayData.isLate) late++
        } else if (dayData.status === 'absent') {
          absent++
        }
      }
    })

    return { present, absent, late }
  }

  const departments = [...new Set(employees.map(emp => emp.department))].filter(Boolean)

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const getEmployeeMonthStats = (employee) => {
    const empAttendance = attendanceData[employee.id] || {}
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    let present = 0, absent = 0, late = 0, totalHours = 0, totalOvertime = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = getDateString(day)
      const dayData = empAttendance[dateStr]
      
      if (dayData) {
        if (dayData.status === 'present') {
          present++
          if (dayData.isLate) late++
          totalHours += dayData.workHours || 0
          totalOvertime += dayData.overtime || 0
        } else if (dayData.status === 'absent') {
          absent++
        }
      }
    }

    const workingDays = daysInMonth - 8 // Approximate working days (excluding weekends)
    const attendanceRate = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0

    return { present, absent, late, totalHours, totalOvertime, attendanceRate }
  }

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Dashboard Chấm Công</h3>
          <p className="text-sm text-gray-500">
            Lịch chấm công và thống kê nhân viên tháng {currentMonth + 1}/{currentYear}
          </p>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium text-gray-900 min-w-[120px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Lịch Chấm Công</h4>
              {selectedDate && (
                <div className="text-sm text-gray-500">
                  Đã chọn: {selectedDate}
                </div>
              )}
            </div>

            {/* Calendar Grid */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50">
                {dayNames.map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {getDaysInMonth().map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-24 border-r border-b border-gray-200 last:border-r-0"></div>
                  }

                  const dateStr = getDateString(day)
                  const stats = getDayAttendanceStats(day)
                  const isSelected = selectedDate === dateStr
                  const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()
                  const dayOfWeek = new Date(currentYear, currentMonth, day).getDay()
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`h-24 border-r border-b border-gray-200 last:border-r-0 p-1 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-300' :
                        isToday ? 'bg-yellow-50' :
                        isWeekend ? 'bg-gray-50' :
                        'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        isToday ? 'text-yellow-600' :
                        isWeekend ? 'text-gray-400' :
                        'text-gray-900'
                      }`}>
                        {day}
                      </div>
                      
                      {!isWeekend && (
                        <div className="mt-1 space-y-1">
                          {stats.present > 0 && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-700">{stats.present}</span>
                            </div>
                          )}
                          {stats.late > 0 && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-yellow-700">{stats.late}</span>
                            </div>
                          )}
                          {stats.absent > 0 && (
                            <div className="flex items-center space-x-1">
                              <XCircle className="h-3 w-3 text-red-500" />
                              <span className="text-xs text-red-700">{stats.absent}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Có mặt</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Đi muộn</span>
              </div>
              <div className="flex items-center space-x-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Vắng mặt</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>Hôm nay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="card p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Bộ lọc</h4>
            
            {/* Search */}
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="input"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Employee Stats */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">Danh sách nhân viên</h4>
              <span className="text-sm text-gray-500">{filteredEmployees.length} nhân viên</span>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <div className="text-sm text-gray-500 mt-2">Đang tải...</div>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredEmployees.map(employee => {
                  const stats = getEmployeeMonthStats(employee)
                  const isSelected = selectedEmployee?.id === employee.id

                  return (
                    <div
                      key={employee.id}
                      onClick={() => setSelectedEmployee(isSelected ? null : employee)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{employee.fullName}</div>
                          <div className="text-sm text-gray-500">{employee.code} • {employee.department}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          stats.attendanceRate >= 95 ? 'bg-green-100 text-green-800' :
                          stats.attendanceRate >= 85 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {stats.attendanceRate}%
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-green-600">{stats.present}</div>
                          <div className="text-gray-500">Có mặt</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-yellow-600">{stats.late}</div>
                          <div className="text-gray-500">Đi muộn</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-red-600">{stats.absent}</div>
                          <div className="text-gray-500">Vắng</div>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Giờ làm: </span>
                          <span className="font-medium">{stats.totalHours.toFixed(1)}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Tăng ca: </span>
                          <span className="font-medium">{stats.totalOvertime.toFixed(1)}h</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="card p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Chi tiết chấm công ngày {selectedDate}
          </h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ vào</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ ra</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ làm việc</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tăng ca</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map(employee => {
                  const dayData = attendanceData[employee.id]?.[selectedDate]
                  
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{employee.fullName}</div>
                          <div className="text-gray-500">{employee.code}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {dayData?.status === 'present' ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            dayData.isLate ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {dayData.isLate ? 'Đi muộn' : 'Có mặt'}
                          </span>
                        ) : dayData?.status === 'absent' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Vắng mặt
                          </span>
                        ) : dayData?.status === 'weekend' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Cuối tuần
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dayData?.checkIn || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dayData?.checkOut || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dayData?.workHours ? `${dayData.workHours}h` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dayData?.overtime ? `${dayData.overtime}h` : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Employee Details */}
      {selectedEmployee && (
        <div className="card p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Chi tiết chấm công - {selectedEmployee.fullName}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {getEmployeeMonthStats(selectedEmployee).present}
              </div>
              <div className="text-sm text-green-700">Ngày có mặt</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {getEmployeeMonthStats(selectedEmployee).late}
              </div>
              <div className="text-sm text-yellow-700">Lần đi muộn</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {getEmployeeMonthStats(selectedEmployee).totalHours.toFixed(1)}h
              </div>
              <div className="text-sm text-blue-700">Tổng giờ làm</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {getEmployeeMonthStats(selectedEmployee).totalOvertime.toFixed(1)}h
              </div>
              <div className="text-sm text-purple-700">Tổng tăng ca</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ vào</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ ra</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ làm việc</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tăng ca</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getDaysInMonth().filter(day => day).map(day => {
                  const dateStr = getDateString(day)
                  const dayData = attendanceData[selectedEmployee.id]?.[dateStr]
                  const dayOfWeek = new Date(currentYear, currentMonth, day).getDay()
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                  
                  return (
                    <tr key={day} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {day}/{currentMonth + 1}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isWeekend ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Cuối tuần
                          </span>
                        ) : dayData?.status === 'present' ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            dayData.isLate ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {dayData.isLate ? 'Đi muộn' : 'Có mặt'}
                          </span>
                        ) : dayData?.status === 'absent' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Vắng mặt
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dayData?.checkIn || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dayData?.checkOut || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dayData?.workHours ? `${dayData.workHours}h` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dayData?.overtime ? `${dayData.overtime}h` : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
