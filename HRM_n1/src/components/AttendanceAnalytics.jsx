import { useState, useEffect } from 'react'
import {
  Clock,
  Calendar,
  TrendingUp,
  Users,
  AlertTriangle,
  Download,
  Filter,
  ChevronDown,
  BarChart3
} from 'lucide-react'
import { listEmployees, listDepartments } from '../services/api'
import { generateMonthlyReport, generateViolationReport } from '../services/attendanceReports'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

export default function AttendanceAnalytics() {
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState('monthly')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedQuarter, setSelectedQuarter] = useState(Math.ceil((new Date().getMonth() + 1) / 3))
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [analyticsData, setAnalyticsData] = useState({
    summary: {},
    trends: [],
    departmentComparison: [],
    violations: [],
    productivity: []
  })

  const timeframes = [
    { value: 'monthly', label: 'Theo tháng' },
    { value: 'quarterly', label: 'Theo quý' },
    { value: 'yearly', label: 'Theo năm' }
  ]

  const quarters = [
    { value: 1, label: 'Quý 1 (T1-T3)' },
    { value: 2, label: 'Quý 2 (T4-T6)' },
    { value: 3, label: 'Quý 3 (T7-T9)' },
    { value: 4, label: 'Quý 4 (T10-T12)' }
  ]

  const years = [2022, 2023, 2024, 2025].map(year => ({ value: year, label: `${year}` }))

  useEffect(() => {
    loadAnalyticsData()
  }, [timeframe, selectedYear, selectedQuarter, selectedDepartment])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      const [employees, departments] = await Promise.all([
        listEmployees(),
        listDepartments()
      ])

      let data = {}

      if (timeframe === 'monthly') {
        data = await generateMonthlyAnalytics(employees, departments)
      } else if (timeframe === 'quarterly') {
        data = await generateQuarterlyAnalytics(employees, departments)
      } else {
        data = await generateYearlyAnalytics(employees, departments)
      }

      setAnalyticsData(data)
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyAnalytics = async (employees, departments) => {
    // Generate data for last 12 months
    const trends = []
    const departmentData = {}
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      
      try {
        const monthlyReport = await generateMonthlyReport(year, month, [])
        const monthName = date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' })
        
        trends.push({
          period: monthName,
          totalEmployees: monthlyReport.summary.totalEmployees,
          presentDays: monthlyReport.summary.totalPresentDays,
          absentDays: monthlyReport.summary.totalAbsentDays,
          lateDays: monthlyReport.summary.totalLateDays,
          overtimeHours: monthlyReport.summary.totalOvertimeHours,
          attendanceRate: monthlyReport.summary.avgAttendanceRate,
          productivity: Math.floor(Math.random() * 20) + 75 // Mock productivity score
        })

        // Department breakdown for current month
        if (i === 0) {
          departments.forEach(dept => {
            const deptEmployees = monthlyReport.employees.filter(emp => 
              emp.employee.department === dept.name
            )
            
            if (deptEmployees.length > 0) {
              departmentData[dept.name] = {
                department: dept.name,
                employees: deptEmployees.length,
                presentDays: deptEmployees.reduce((sum, emp) => sum + emp.presentDays, 0),
                absentDays: deptEmployees.reduce((sum, emp) => sum + emp.absentDays, 0),
                lateDays: deptEmployees.reduce((sum, emp) => sum + emp.lateDays, 0),
                overtimeHours: deptEmployees.reduce((sum, emp) => sum + emp.overtimeHours, 0),
                attendanceRate: Math.round(
                  deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / deptEmployees.length
                ),
                productivity: Math.floor(Math.random() * 20) + 75
              }
            }
          })
        }
      } catch (error) {
        console.error('Error generating monthly report:', error)
      }
    }

    // Generate violations data
    const violationsData = await generateViolationReport(
      `${selectedYear}-01-01`,
      `${selectedYear}-12-31`,
      selectedDepartment ? [selectedDepartment] : []
    )

    const summary = {
      totalWorkingDays: trends[trends.length - 1]?.presentDays + trends[trends.length - 1]?.absentDays || 0,
      avgAttendanceRate: Math.round(trends.reduce((sum, t) => sum + t.attendanceRate, 0) / trends.length),
      totalOvertimeHours: trends.reduce((sum, t) => sum + t.overtimeHours, 0),
      totalViolations: violationsData.violations.length,
      trendDirection: trends.length > 1 ? 
        (trends[trends.length - 1].attendanceRate > trends[trends.length - 2].attendanceRate ? 'up' : 'down') : 'stable'
    }

    return {
      summary,
      trends,
      departmentComparison: Object.values(departmentData),
      violations: violationsData.violations.slice(0, 50),
      productivity: trends.map(t => ({
        period: t.period,
        productivity: t.productivity,
        efficiency: Math.floor(Math.random() * 15) + 80
      }))
    }
  }

  const generateQuarterlyAnalytics = async (employees, departments) => {
    // Generate quarterly data for last 8 quarters
    const trends = []
    
    for (let i = 7; i >= 0; i--) {
      const currentDate = new Date()
      const quarterStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i * 3), 1)
      const quarter = Math.ceil((quarterStart.getMonth() + 1) / 3)
      const year = quarterStart.getFullYear()
      
      const quarterData = {
        period: `Q${quarter}/${year}`,
        totalEmployees: employees.length + Math.floor(Math.random() * 10) - 5,
        presentDays: Math.floor(Math.random() * 200) + 1800,
        absentDays: Math.floor(Math.random() * 50) + 50,
        lateDays: Math.floor(Math.random() * 100) + 100,
        overtimeHours: Math.floor(Math.random() * 500) + 500,
        attendanceRate: Math.floor(Math.random() * 10) + 88,
        productivity: Math.floor(Math.random() * 20) + 75
      }
      
      trends.push(quarterData)
    }

    // Department comparison for selected quarter
    const departmentComparison = departments.map(dept => ({
      department: dept.name,
      employees: Math.floor(Math.random() * 15) + 5,
      attendanceRate: Math.floor(Math.random() * 10) + 88,
      overtimeHours: Math.floor(Math.random() * 100) + 50,
      productivity: Math.floor(Math.random() * 20) + 75,
      violations: Math.floor(Math.random() * 20) + 5
    }))

    const summary = {
      totalWorkingDays: trends[trends.length - 1]?.presentDays + trends[trends.length - 1]?.absentDays || 0,
      avgAttendanceRate: Math.round(trends.reduce((sum, t) => sum + t.attendanceRate, 0) / trends.length),
      totalOvertimeHours: trends.reduce((sum, t) => sum + t.overtimeHours, 0),
      totalViolations: departmentComparison.reduce((sum, d) => sum + d.violations, 0),
      trendDirection: trends.length > 1 ? 
        (trends[trends.length - 1].attendanceRate > trends[trends.length - 2].attendanceRate ? 'up' : 'down') : 'stable'
    }

    return {
      summary,
      trends,
      departmentComparison,
      violations: [],
      productivity: trends.map(t => ({
        period: t.period,
        productivity: t.productivity,
        efficiency: Math.floor(Math.random() * 15) + 80
      }))
    }
  }

  const generateYearlyAnalytics = async (employees, departments) => {
    // Generate yearly data for last 5 years
    const trends = []
    
    for (let i = 4; i >= 0; i--) {
      const year = selectedYear - i
      
      const yearData = {
        period: `${year}`,
        totalEmployees: employees.length + Math.floor(Math.random() * 20) - 10,
        presentDays: Math.floor(Math.random() * 1000) + 8000,
        absentDays: Math.floor(Math.random() * 300) + 200,
        lateDays: Math.floor(Math.random() * 500) + 300,
        overtimeHours: Math.floor(Math.random() * 2000) + 2000,
        attendanceRate: Math.floor(Math.random() * 8) + 89,
        productivity: Math.floor(Math.random() * 15) + 78
      }
      
      trends.push(yearData)
    }

    const departmentComparison = departments.map(dept => ({
      department: dept.name,
      employees: Math.floor(Math.random() * 20) + 10,
      attendanceRate: Math.floor(Math.random() * 8) + 89,
      overtimeHours: Math.floor(Math.random() * 500) + 200,
      productivity: Math.floor(Math.random() * 15) + 78,
      violations: Math.floor(Math.random() * 100) + 50
    }))

    const summary = {
      totalWorkingDays: trends[trends.length - 1]?.presentDays + trends[trends.length - 1]?.absentDays || 0,
      avgAttendanceRate: Math.round(trends.reduce((sum, t) => sum + t.attendanceRate, 0) / trends.length),
      totalOvertimeHours: trends.reduce((sum, t) => sum + t.overtimeHours, 0),
      totalViolations: departmentComparison.reduce((sum, d) => sum + d.violations, 0),
      trendDirection: trends.length > 1 ? 
        (trends[trends.length - 1].attendanceRate > trends[trends.length - 2].attendanceRate ? 'up' : 'down') : 'stable'
    }

    return {
      summary,
      trends,
      departmentComparison,
      violations: [],
      productivity: trends.map(t => ({
        period: t.period,
        productivity: t.productivity,
        efficiency: Math.floor(Math.random() * 10) + 83
      }))
    }
  }

  const exportAnalytics = () => {
    // In real app, this would export to Excel/PDF
    alert('Xuất báo cáo phân tích chấm công thành công!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Phân tích thời gian làm việc</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Khung thời gian</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="input"
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>
          
          {timeframe === 'yearly' && (
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
          )}
          
          {timeframe === 'quarterly' && (
            <>
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
                <label className="label">Quý</label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(parseInt(e.target.value))}
                  className="input"
                >
                  {quarters.map(quarter => (
                    <option key={quarter.value} value={quarter.value}>{quarter.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          <div className="flex items-end">
            <button
              onClick={exportAnalytics}
              className="btn-primary flex items-center space-x-2 w-full"
            >
              <Download className="h-4 w-4" />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ chấm công TB</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.avgAttendanceRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {analyticsData.summary.trendDirection === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
            )}
            <span className="text-sm text-gray-600 ml-1">
              {analyticsData.summary.trendDirection === 'up' ? 'Tăng' : 'Giảm'} so với kỳ trước
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng giờ tăng ca</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.summary.totalOvertimeHours?.toLocaleString() || 0}h
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              TB: {Math.round((analyticsData.summary.totalOvertimeHours || 0) / (analyticsData.trends.length || 1))}h/kỳ
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vi phạm chấm công</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.totalViolations}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {timeframe === 'monthly' ? 'Tháng này' : 
               timeframe === 'quarterly' ? 'Quý này' : 'Năm này'}
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ngày làm việc</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.summary.totalWorkingDays?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">Tổng cộng</span>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Xu hướng chấm công {timeframe === 'monthly' ? '12 tháng' : 
                               timeframe === 'quarterly' ? '8 quý' : '5 năm'} gần đây
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analyticsData.trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'attendanceRate' ? `${value}%` : value,
                name === 'attendanceRate' ? 'Tỷ lệ chấm công' :
                name === 'overtimeHours' ? 'Giờ tăng ca' :
                name === 'lateDays' ? 'Lần đi muộn' : name
              ]}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="attendanceRate" 
              stackId="1"
              stroke="#3B82F6" 
              fill="#3B82F6"
              fillOpacity={0.6}
              name="Tỷ lệ chấm công (%)"
            />
            <Area 
              type="monotone" 
              dataKey="overtimeHours" 
              stackId="2"
              stroke="#10B981" 
              fill="#10B981"
              fillOpacity={0.6}
              name="Giờ tăng ca"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Department Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            So sánh phòng ban - Chấm công
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.departmentComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="department" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendanceRate" fill="#3B82F6" name="Tỷ lệ chấm công (%)" />
              <Bar dataKey="overtimeHours" fill="#10B981" name="Giờ tăng ca" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Hiệu suất làm việc
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.productivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}%`,
                  name === 'productivity' ? 'Năng suất' : 'Hiệu quả'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="productivity" 
                stroke="#F59E0B" 
                name="Năng suất (%)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#8B5CF6" 
                name="Hiệu quả (%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Details Table */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Chi tiết theo phòng ban
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phòng ban
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nhân viên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tỷ lệ chấm công
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Giờ tăng ca
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Năng suất
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vi phạm
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.departmentComparison.map((dept) => (
                <tr key={dept.department} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {dept.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {dept.employees}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      dept.attendanceRate >= 95 ? 'bg-green-100 text-green-800' :
                      dept.attendanceRate >= 90 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.attendanceRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {dept.overtimeHours}h
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      dept.productivity >= 90 ? 'bg-green-100 text-green-800' :
                      dept.productivity >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.productivity}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {dept.violations || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Violations */}
      {analyticsData.violations.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vi phạm chấm công gần đây
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nhân viên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phòng ban
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Loại vi phạm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mức độ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.violations.slice(0, 10).map((violation, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {violation.date}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {violation.employee?.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {violation.employee?.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {violation.type}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        violation.severity === 'high' ? 'bg-red-100 text-red-800' :
                        violation.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {violation.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
