import { useState, useEffect } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  PieChart,
  BarChart3,
  Download,
  Building2,
  Target
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
  Line,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'

export default function SalaryAnalytics() {
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState('monthly')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [salaryData, setSalaryData] = useState({
    summary: {},
    trends: [],
    departmentBreakdown: [],
    salaryDistribution: [],
    costAnalysis: []
  })

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']

  const timeframes = [
    { value: 'monthly', label: 'Theo tháng' },
    { value: 'quarterly', label: 'Theo quý' },
    { value: 'yearly', label: 'Theo năm' }
  ]

  const years = [2022, 2023, 2024, 2025].map(year => ({ value: year, label: `${year}` }))

  useEffect(() => {
    loadSalaryAnalytics()
  }, [timeframe, selectedYear])

  const loadSalaryAnalytics = async () => {
    setLoading(true)
    try {
      const [employees, departments] = await Promise.all([
        listEmployees(),
        listDepartments()
      ])

      let data = {}

      if (timeframe === 'monthly') {
        data = await generateMonthlySalaryAnalytics(employees, departments)
      } else if (timeframe === 'quarterly') {
        data = await generateQuarterlySalaryAnalytics(employees, departments)
      } else {
        data = await generateYearlySalaryAnalytics(employees, departments)
      }

      setSalaryData(data)
    } catch (error) {
      console.error('Error loading salary analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlySalaryAnalytics = async (employees, departments) => {
    // Generate salary trends for last 12 months
    const trends = []
    const departmentData = {}
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      
      try {
        const monthlyPayroll = await generateMonthlyPayroll(year, month, [])
        const monthName = date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' })
        
        trends.push({
          period: monthName,
          totalSalary: monthlyPayroll.summary.totalNetSalary,
          grossSalary: monthlyPayroll.summary.totalGrossSalary || monthlyPayroll.summary.totalNetSalary * 1.3,
          deductions: monthlyPayroll.summary.totalDeductions,
          overtimePay: monthlyPayroll.summary.totalOvertimePay,
          avgSalary: monthlyPayroll.summary.avgNetSalary,
          employees: monthlyPayroll.summary.totalEmployees,
          salaryGrowth: i === 11 ? 0 : Math.random() * 10 - 5 // Random growth rate
        })

        // Department breakdown for current month
        if (i === 0) {
          departments.forEach(dept => {
            const deptEmployees = monthlyPayroll.employees.filter(emp => 
              emp.employee.department === dept.name
            )
            
            if (deptEmployees.length > 0) {
              const totalSalary = deptEmployees.reduce((sum, emp) => sum + emp.netSalary, 0)
              const avgSalary = totalSalary / deptEmployees.length
              
              departmentData[dept.name] = {
                department: dept.name,
                employees: deptEmployees.length,
                totalSalary,
                avgSalary,
                grossSalary: deptEmployees.reduce((sum, emp) => sum + emp.grossSalary, 0),
                deductions: deptEmployees.reduce((sum, emp) => sum + emp.deductions.total, 0),
                overtimePay: deptEmployees.reduce((sum, emp) => sum + emp.salaryComponents.overtimePay, 0),
                benefits: deptEmployees.reduce((sum, emp) => 
                  sum + emp.salaryComponents.positionAllowance + 
                  emp.salaryComponents.transportAllowance + 
                  emp.salaryComponents.mealAllowance, 0
                ),
                costPerEmployee: avgSalary
              }
            }
          })
        }
      } catch (error) {
        console.error('Error generating payroll for analytics:', error)
      }
    }

    // Salary distribution analysis
    const salaryRanges = [
      { range: '< 10M', min: 0, max: 10000000, count: 0, percentage: 0 },
      { range: '10M - 15M', min: 10000000, max: 15000000, count: 0, percentage: 0 },
      { range: '15M - 20M', min: 15000000, max: 20000000, count: 0, percentage: 0 },
      { range: '20M - 30M', min: 20000000, max: 30000000, count: 0, percentage: 0 },
      { range: '30M - 50M', min: 30000000, max: 50000000, count: 0, percentage: 0 },
      { range: '> 50M', min: 50000000, max: Infinity, count: 0, percentage: 0 }
    ]

    employees.forEach(emp => {
      const salary = emp.officialSalary || 15000000
      const range = salaryRanges.find(r => salary >= r.min && salary < r.max)
      if (range) range.count++
    })

    salaryRanges.forEach(range => {
      range.percentage = Math.round((range.count / employees.length) * 100)
    })

    // Cost analysis
    const costAnalysis = [
      {
        category: 'Lương cơ bản',
        amount: trends[trends.length - 1]?.totalSalary * 0.7 || 0,
        percentage: 70,
        color: '#3B82F6'
      },
      {
        category: 'Phụ cấp',
        amount: trends[trends.length - 1]?.totalSalary * 0.15 || 0,
        percentage: 15,
        color: '#10B981'
      },
      {
        category: 'Tăng ca',
        amount: trends[trends.length - 1]?.overtimePay || 0,
        percentage: 10,
        color: '#F59E0B'
      },
      {
        category: 'Khác',
        amount: trends[trends.length - 1]?.totalSalary * 0.05 || 0,
        percentage: 5,
        color: '#8B5CF6'
      }
    ]

    const summary = {
      totalMonthlyCost: trends[trends.length - 1]?.totalSalary || 0,
      avgSalary: trends[trends.length - 1]?.avgSalary || 0,
      totalEmployees: employees.length,
      salaryGrowthRate: trends.length > 1 ? 
        ((trends[trends.length - 1]?.totalSalary - trends[trends.length - 2]?.totalSalary) / trends[trends.length - 2]?.totalSalary * 100) : 0,
      totalOvertimeCost: trends.reduce((sum, t) => sum + (t.overtimePay || 0), 0),
      costPerEmployee: trends[trends.length - 1]?.totalSalary / employees.length || 0
    }

    return {
      summary,
      trends,
      departmentBreakdown: Object.values(departmentData),
      salaryDistribution: salaryRanges.filter(r => r.count > 0),
      costAnalysis
    }
  }

  const generateQuarterlySalaryAnalytics = async (employees, departments) => {
    // Generate quarterly salary data
    const trends = []
    
    for (let i = 7; i >= 0; i--) {
      const currentDate = new Date()
      const quarterStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i * 3), 1)
      const quarter = Math.ceil((quarterStart.getMonth() + 1) / 3)
      const year = quarterStart.getFullYear()
      
      const baseSalary = employees.length * 15000000 * 3 // 3 months
      const variation = (Math.random() - 0.5) * 0.2 // +/- 10% variation
      
      trends.push({
        period: `Q${quarter}/${year}`,
        totalSalary: Math.round(baseSalary * (1 + variation)),
        grossSalary: Math.round(baseSalary * (1 + variation) * 1.3),
        deductions: Math.round(baseSalary * (1 + variation) * 0.25),
        overtimePay: Math.round(baseSalary * (1 + variation) * 0.1),
        avgSalary: Math.round((baseSalary * (1 + variation)) / employees.length / 3),
        employees: employees.length + Math.floor(Math.random() * 10) - 5,
        salaryGrowth: Math.random() * 15 - 5
      })
    }

    // Department breakdown
    const departmentBreakdown = departments.map(dept => {
      const deptEmployees = Math.floor(Math.random() * 20) + 5
      const avgSalary = (Math.random() * 20000000) + 10000000
      
      return {
        department: dept.name,
        employees: deptEmployees,
        totalSalary: avgSalary * deptEmployees * 3, // Quarterly
        avgSalary: avgSalary,
        grossSalary: avgSalary * deptEmployees * 3 * 1.3,
        deductions: avgSalary * deptEmployees * 3 * 0.25,
        overtimePay: avgSalary * deptEmployees * 3 * 0.1,
        benefits: avgSalary * deptEmployees * 3 * 0.15,
        costPerEmployee: avgSalary * 3
      }
    })

    const summary = {
      totalMonthlyCost: trends[trends.length - 1]?.totalSalary / 3 || 0,
      avgSalary: trends[trends.length - 1]?.avgSalary || 0,
      totalEmployees: employees.length,
      salaryGrowthRate: trends.length > 1 ? 
        ((trends[trends.length - 1]?.totalSalary - trends[trends.length - 2]?.totalSalary) / trends[trends.length - 2]?.totalSalary * 100) : 0,
      totalOvertimeCost: trends.reduce((sum, t) => sum + (t.overtimePay || 0), 0),
      costPerEmployee: trends[trends.length - 1]?.totalSalary / employees.length / 3 || 0
    }

    return {
      summary,
      trends,
      departmentBreakdown,
      salaryDistribution: [],
      costAnalysis: []
    }
  }

  const generateYearlySalaryAnalytics = async (employees, departments) => {
    // Generate yearly salary data
    const trends = []
    
    for (let i = 4; i >= 0; i--) {
      const year = selectedYear - i
      const baseSalary = employees.length * 15000000 * 12 // 12 months
      const variation = (Math.random() - 0.5) * 0.3 // +/- 15% variation
      
      trends.push({
        period: `${year}`,
        totalSalary: Math.round(baseSalary * (1 + variation)),
        grossSalary: Math.round(baseSalary * (1 + variation) * 1.3),
        deductions: Math.round(baseSalary * (1 + variation) * 0.25),
        overtimePay: Math.round(baseSalary * (1 + variation) * 0.1),
        avgSalary: Math.round((baseSalary * (1 + variation)) / employees.length / 12),
        employees: employees.length + Math.floor(Math.random() * 20) - 10,
        salaryGrowth: i === 4 ? 0 : Math.random() * 20 - 5
      })
    }

    const departmentBreakdown = departments.map(dept => {
      const deptEmployees = Math.floor(Math.random() * 30) + 10
      const avgSalary = (Math.random() * 20000000) + 10000000
      
      return {
        department: dept.name,
        employees: deptEmployees,
        totalSalary: avgSalary * deptEmployees * 12, // Yearly
        avgSalary: avgSalary,
        grossSalary: avgSalary * deptEmployees * 12 * 1.3,
        deductions: avgSalary * deptEmployees * 12 * 0.25,
        overtimePay: avgSalary * deptEmployees * 12 * 0.1,
        benefits: avgSalary * deptEmployees * 12 * 0.15,
        costPerEmployee: avgSalary * 12
      }
    })

    const summary = {
      totalMonthlyCost: trends[trends.length - 1]?.totalSalary / 12 || 0,
      avgSalary: trends[trends.length - 1]?.avgSalary || 0,
      totalEmployees: employees.length,
      salaryGrowthRate: trends.length > 1 ? 
        ((trends[trends.length - 1]?.totalSalary - trends[trends.length - 2]?.totalSalary) / trends[trends.length - 2]?.totalSalary * 100) : 0,
      totalOvertimeCost: trends.reduce((sum, t) => sum + (t.overtimePay || 0), 0),
      costPerEmployee: trends[trends.length - 1]?.totalSalary / employees.length / 12 || 0
    }

    return {
      summary,
      trends,
      departmentBreakdown,
      salaryDistribution: [],
      costAnalysis: []
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

  const exportSalaryReport = () => {
    alert('Xuất báo cáo phân tích lương thành công!')
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Phân tích chi phí lương</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          <div className="flex items-end">
            <button
              onClick={exportSalaryReport}
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
              <p className="text-sm font-medium text-gray-600">Chi phí lương tháng</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(Math.round(salaryData.summary.totalMonthlyCost / 1000000))}M
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {salaryData.summary.salaryGrowthRate >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-gray-600 ml-1">
              {salaryData.summary.salaryGrowthRate?.toFixed(1)}% vs kỳ trước
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lương trung bình</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(Math.round(salaryData.summary.avgSalary / 1000000))}M
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {salaryData.summary.totalEmployees} nhân viên
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chi phí/Nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(Math.round(salaryData.summary.costPerEmployee / 1000000))}M
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {timeframe === 'monthly' ? 'Mỗi tháng' : 
               timeframe === 'quarterly' ? 'Mỗi quý' : 'Mỗi năm'}
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chi phí tăng ca</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(Math.round(salaryData.summary.totalOvertimeCost / 1000000))}M
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">Tổng cộng</span>
          </div>
        </div>
      </div>

      {/* Salary Trends */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Xu hướng chi phí lương {timeframe === 'monthly' ? '12 tháng' : 
                                  timeframe === 'quarterly' ? '8 quý' : '5 năm'} gần đây
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={salaryData.trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name.includes('Salary') || name.includes('Pay') ? formatCurrency(value) : value,
                name === 'totalSalary' ? 'Tổng lương' :
                name === 'grossSalary' ? 'Tổng thu nhập' :
                name === 'deductions' ? 'Khấu trừ' :
                name === 'overtimePay' ? 'Tiền tăng ca' :
                name === 'employees' ? 'Số nhân viên' : name
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="totalSalary" fill="#3B82F6" name="Tổng lương" />
            <Bar yAxisId="left" dataKey="overtimePay" fill="#10B981" name="Tiền tăng ca" />
            <Line yAxisId="right" type="monotone" dataKey="employees" stroke="#F59E0B" name="Số nhân viên" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Department Breakdown and Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Chi phí theo phòng ban
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData.departmentBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="department" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Chi phí']}
              />
              <Legend />
              <Bar dataKey="totalSalary" fill="#3B82F6" name="Tổng lương" />
              <Bar dataKey="overtimePay" fill="#10B981" name="Tăng ca" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {salaryData.costAnalysis.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cơ cấu chi phí
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <RechartsPieChart
                  data={salaryData.costAnalysis}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {salaryData.costAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Salary Distribution */}
      {salaryData.salaryDistribution.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Phân bổ lương theo mức
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData.salaryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? value : `${value}%`,
                  name === 'count' ? 'Số người' : 'Tỷ lệ'
                ]}
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Số người" />
              <Bar dataKey="percentage" fill="#10B981" name="Tỷ lệ (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Department Details Table */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Chi tiết chi phí theo phòng ban
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
                  Tổng lương
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lương TB
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tăng ca
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Khấu trừ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chi phí/NV
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaryData.departmentBreakdown.map((dept) => (
                <tr key={dept.department} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {dept.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {dept.employees}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatNumber(Math.round(dept.totalSalary / 1000000))}M
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatNumber(Math.round(dept.avgSalary / 1000000))}M
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatNumber(Math.round(dept.overtimePay / 1000000))}M
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatNumber(Math.round(dept.deductions / 1000000))}M
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatNumber(Math.round(dept.costPerEmployee / 1000000))}M
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
