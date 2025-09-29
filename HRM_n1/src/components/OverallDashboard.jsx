import { useState, useEffect } from 'react'
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  Target,
  Award,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react'
import { listEmployees, listDepartments } from '../services/api'
import { generateMonthlyPayroll } from '../services/payrollService'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line
} from 'recharts'

export default function OverallDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    summary: {},
    departmentStats: [],
    monthlyTrends: [],
    performanceData: []
  })
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']

  useEffect(() => {
    loadDashboardData()
  }, [selectedPeriod])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [employees, departments] = await Promise.all([
        listEmployees(),
        listDepartments()
      ])

      // Generate current month payroll for analysis
      const currentDate = new Date()
      const currentPayroll = await generateMonthlyPayroll(
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      )

      // Calculate summary metrics
      const summary = {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(emp => emp.status === 'Active').length,
        totalDepartments: departments.length,
        totalSalaryCost: currentPayroll.summary.totalNetSalary,
        avgSalary: currentPayroll.summary.avgNetSalary,
        totalOvertimeHours: currentPayroll.summary.totalOvertimePay / 50000, // Estimate hours
        attendanceRate: 92, // Mock data
        performanceScore: 4.2 // Mock data
      }

      // Department statistics
      const deptStats = departments.map(dept => {
        const deptEmployees = employees.filter(emp => emp.department === dept.name)
        const deptPayroll = currentPayroll.employees.filter(emp => emp.employee.department === dept.name)
        
        return {
          department: dept.name,
          employeeCount: deptEmployees.length,
          totalSalary: deptPayroll.reduce((sum, emp) => sum + emp.netSalary, 0),
          avgSalary: deptPayroll.length > 0 ? 
            Math.round(deptPayroll.reduce((sum, emp) => sum + emp.netSalary, 0) / deptPayroll.length) : 0,
          attendanceRate: Math.floor(Math.random() * 10) + 88, // 88-97%
          overtimeHours: deptPayroll.reduce((sum, emp) => sum + emp.attendance.overtimeHours, 0),
          performanceScore: (Math.random() * 1.5 + 3.5).toFixed(1) // 3.5-5.0
        }
      })

      // Monthly trends (last 6 months)
      const monthlyTrends = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' })
        
        monthlyTrends.push({
          month,
          employees: employees.length + Math.floor(Math.random() * 10) - 5,
          salary: summary.totalSalaryCost + (Math.random() * 100000000 - 50000000),
          attendance: Math.floor(Math.random() * 8) + 88,
          performance: (Math.random() * 1 + 3.8).toFixed(1)
        })
      }

      // Performance distribution
      const performanceData = [
        { name: 'Xuất sắc (4.5-5.0)', value: 15, color: '#10B981' },
        { name: 'Tốt (3.5-4.4)', value: 45, color: '#3B82F6' },
        { name: 'Trung bình (2.5-3.4)', value: 35, color: '#F59E0B' },
        { name: 'Cần cải thiện (<2.5)', value: 5, color: '#EF4444' }
      ]

      setDashboardData({
        summary,
        departmentStats: deptStats,
        monthlyTrends,
        performanceData
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number)
  }

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
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
      {/* Period Selection */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard Tổng quan</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="input w-48"
        >
          <option value="current-month">Tháng hiện tại</option>
          <option value="last-month">Tháng trước</option>
          <option value="current-quarter">Quý hiện tại</option>
          <option value="last-quarter">Quý trước</option>
          <option value="current-year">Năm hiện tại</option>
        </select>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.totalEmployees}</p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.summary.activeEmployees} đang làm việc
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(dashboardData.summary.totalEmployees, dashboardData.summary.totalEmployees - 2)}
            <span className="text-sm text-gray-600 ml-1">vs tháng trước</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chi phí lương</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(Math.round(dashboardData.summary.totalSalaryCost / 1000000))}M
              </p>
              <p className="text-xs text-gray-500 mt-1">
                TB: {formatNumber(Math.round(dashboardData.summary.avgSalary / 1000000))}M/người
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(dashboardData.summary.totalSalaryCost, dashboardData.summary.totalSalaryCost * 0.95)}
            <span className="text-sm text-gray-600 ml-1">+3.2% vs tháng trước</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ chấm công</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.attendanceRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.summary.totalOvertimeHours?.toFixed(0) || 0}h tăng ca
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(92, 89)}
            <span className="text-sm text-gray-600 ml-1">+3% vs tháng trước</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hiệu suất TB</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.performanceScore}/5.0</p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.summary.totalDepartments} phòng ban
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(4.2, 4.1)}
            <span className="text-sm text-gray-600 ml-1">+0.1 vs tháng trước</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Hiệu suất theo phòng ban
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.departmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="department" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'avgSalary' ? formatCurrency(value) : value,
                  name === 'avgSalary' ? 'Lương TB' : 
                  name === 'attendanceRate' ? 'Chấm công (%)' : 
                  name === 'performanceScore' ? 'Hiệu suất' : name
                ]}
              />
              <Legend />
              <Bar dataKey="attendanceRate" fill="#3B82F6" name="Chấm công (%)" />
              <Bar dataKey="performanceScore" fill="#10B981" name="Hiệu suất" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Phân bổ hiệu suất nhân viên
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <RechartsPieChart
                data={dashboardData.performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dashboardData.performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RechartsPieChart>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Xu hướng 6 tháng gần đây
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboardData.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'salary' ? `${(value / 1000000).toFixed(0)}M` : value,
                name === 'salary' ? 'Chi phí lương' :
                name === 'employees' ? 'Số nhân viên' :
                name === 'attendance' ? 'Chấm công (%)' :
                name === 'performance' ? 'Hiệu suất' : name
              ]}
            />
            <Legend />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="employees" 
              stroke="#3B82F6" 
              name="Số nhân viên"
              strokeWidth={2}
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="attendance" 
              stroke="#10B981" 
              name="Chấm công (%)"
              strokeWidth={2}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="performance" 
              stroke="#F59E0B" 
              name="Hiệu suất"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
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
                  Lương TB
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chấm công
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tăng ca
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hiệu suất
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.departmentStats.map((dept) => (
                <tr key={dept.department} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {dept.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {dept.employeeCount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatNumber(Math.round(dept.avgSalary / 1000000))}M
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
                      dept.performanceScore >= 4.5 ? 'bg-green-100 text-green-800' :
                      dept.performanceScore >= 3.5 ? 'bg-blue-100 text-blue-800' :
                      dept.performanceScore >= 2.5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.performanceScore}/5.0
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
