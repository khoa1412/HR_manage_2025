import { useState, useEffect } from 'react'
import {
  Target,
  TrendingUp,
  Award,
  Users,
  Star,
  BarChart3,
  Download,
  Calendar,
  Filter,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { listEmployees, listDepartments } from '../services/api'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  ScatterChart,
  Scatter
} from 'recharts'

export default function PerformanceReports() {
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('2024')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [performanceData, setPerformanceData] = useState({
    overview: {},
    evaluations: [],
    trends: [],
    departmentStats: [],
    goalTracking: [],
    topPerformers: []
  })

  const views = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'evaluations', label: 'Đánh giá', icon: Target },
    { id: 'goals', label: 'Mục tiêu KPI', icon: Award },
    { id: 'development', label: 'Phát triển', icon: TrendingUp }
  ]

  const periods = [
    { value: '2024', label: 'Năm 2024' },
    { value: 'Q4-2024', label: 'Quý 4/2024' },
    { value: 'Q3-2024', label: 'Quý 3/2024' },
    { value: 'Q2-2024', label: 'Quý 2/2024' },
    { value: 'Q1-2024', label: 'Quý 1/2024' }
  ]

  useEffect(() => {
    loadPerformanceData()
  }, [selectedPeriod, selectedDepartment])

  const loadPerformanceData = async () => {
    setLoading(true)
    try {
      const [employees, departments] = await Promise.all([
        listEmployees(),
        listDepartments()
      ])

      const data = await generatePerformanceData(employees, departments)
      setPerformanceData(data)
    } catch (error) {
      console.error('Error loading performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePerformanceData = async (employees, departments) => {
    // Generate mock performance evaluations
    const evaluations = employees.map(emp => {
      const overallScore = (Math.random() * 2 + 3).toFixed(1) // 3.0 - 5.0
      const goals = Math.floor(Math.random() * 8) + 5 // 5-12 goals
      const completedGoals = Math.floor(Math.random() * goals)
      
      return {
        employee: emp,
        period: selectedPeriod,
        overallScore: parseFloat(overallScore),
        ratings: {
          quality: (Math.random() * 2 + 3).toFixed(1),
          productivity: (Math.random() * 2 + 3).toFixed(1),
          teamwork: (Math.random() * 2 + 3).toFixed(1),
          communication: (Math.random() * 2 + 3).toFixed(1),
          initiative: (Math.random() * 2 + 3).toFixed(1),
          leadership: (Math.random() * 2 + 3).toFixed(1)
        },
        goals: {
          total: goals,
          completed: completedGoals,
          progress: Math.round((completedGoals / goals) * 100)
        },
        lastReviewDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextReviewDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: overallScore >= 4.5 ? 'excellent' : 
                overallScore >= 3.5 ? 'good' : 
                overallScore >= 2.5 ? 'average' : 'needs-improvement',
        improvementAreas: ['Quản lý thời gian', 'Kỹ năng thuyết trình', 'Làm việc nhóm'][Math.floor(Math.random() * 3)],
        strengths: ['Sáng tạo', 'Chủ động', 'Kỹ thuật tốt', 'Giao tiếp hiệu quả'][Math.floor(Math.random() * 4)]
      }
    })

    // Department performance stats
    const departmentStats = departments.map(dept => {
              const deptEvaluations = evaluations.filter(evaluation => evaluation.employee.department === dept.name)
        const avgScore = deptEvaluations.length > 0 ? 
          deptEvaluations.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / deptEvaluations.length : 0
        
        const goalCompletion = deptEvaluations.length > 0 ?
          deptEvaluations.reduce((sum, evaluation) => sum + evaluation.goals.progress, 0) / deptEvaluations.length : 0

      return {
        department: dept.name,
        employees: deptEvaluations.length,
        avgScore: parseFloat(avgScore.toFixed(1)),
        goalCompletion: Math.round(goalCompletion),
        topPerformers: deptEvaluations.filter(evaluation => evaluation.overallScore >= 4.5).length,
        needsImprovement: deptEvaluations.filter(evaluation => evaluation.overallScore < 3.0).length,
        reviewsCompleted: deptEvaluations.filter(evaluation => 
          new Date(evaluation.lastReviewDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        ).length,
        reviewsPending: deptEvaluations.length - deptEvaluations.filter(evaluation => 
          new Date(evaluation.lastReviewDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        ).length
      }
    })

    // Performance trends (last 6 periods)
    const trends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i * 3) // Quarterly
      const period = `Q${Math.ceil((date.getMonth() + 1) / 3)}/${date.getFullYear()}`
      
      trends.push({
        period,
        avgScore: (Math.random() * 1.5 + 3.5).toFixed(1),
        goalCompletion: Math.floor(Math.random() * 30) + 70,
        reviewsCompleted: Math.floor(Math.random() * 20) + 80,
        promotions: Math.floor(Math.random() * 5) + 2,
        trainingHours: Math.floor(Math.random() * 50) + 100
      })
    }

    // Top performers
    const topPerformers = evaluations
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 10)
      .map((evaluation, index) => ({
        rank: index + 1,
        employee: evaluation.employee,
        score: evaluation.overallScore,
        improvement: (Math.random() * 0.5).toFixed(1),
        goalCompletion: evaluation.goals.progress,
        department: evaluation.employee.department
      }))

    // Goal tracking
    const goalTracking = [
      {
        category: 'Revenue',
        target: 100,
        achieved: Math.floor(Math.random() * 40) + 60,
        unit: '%',
        status: 'on-track'
      },
      {
        category: 'Customer Satisfaction',
        target: 4.5,
        achieved: (Math.random() * 1 + 4).toFixed(1),
        unit: '/5.0',
        status: 'ahead'
      },
      {
        category: 'Employee Retention',
        target: 90,
        achieved: Math.floor(Math.random() * 15) + 85,
        unit: '%',
        status: 'at-risk'
      },
      {
        category: 'Training Completion',
        target: 100,
        achieved: Math.floor(Math.random() * 20) + 80,
        unit: '%',
        status: 'on-track'
      }
    ]

    const overview = {
      totalEmployees: employees.length,
      avgPerformanceScore: parseFloat((evaluations.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / evaluations.length).toFixed(1)),
      topPerformersCount: evaluations.filter(evaluation => evaluation.overallScore >= 4.5).length,
      needsImprovementCount: evaluations.filter(evaluation => evaluation.overallScore < 3.0).length,
      goalCompletionRate: Math.round(evaluations.reduce((sum, evaluation) => sum + evaluation.goals.progress, 0) / evaluations.length),
      reviewsCompleted: evaluations.filter(evaluation => 
        new Date(evaluation.lastReviewDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      ).length,
      reviewsPending: evaluations.length - evaluations.filter(evaluation => 
        new Date(evaluation.lastReviewDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      ).length,
      promotionRate: Math.floor(Math.random() * 10) + 5,
      trainingCompletionRate: Math.floor(Math.random() * 20) + 80
    }

    return {
      overview,
      evaluations,
      trends,
      departmentStats,
      goalTracking,
      topPerformers
    }
  }

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600'
    if (score >= 3.5) return 'text-blue-600'
    if (score >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score) => {
    if (score >= 4.5) return 'bg-green-100 text-green-800'
    if (score >= 3.5) return 'bg-blue-100 text-blue-800'
    if (score >= 2.5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <Award className="h-4 w-4 text-yellow-500" />
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'average': return <Clock className="h-4 w-4 text-blue-500" />
      case 'needs-improvement': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const exportPerformanceReport = () => {
    alert('Xuất báo cáo đánh giá hiệu suất thành công!')
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
      {/* Header & Filters */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Đánh giá hiệu suất nhân viên</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Kỳ đánh giá</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">Phòng ban</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input"
            >
              <option value="">Tất cả phòng ban</option>
              <option value="Phòng IT">Phòng IT</option>
              <option value="Phòng Marketing">Phòng Marketing</option>
              <option value="Phòng Nhân sự">Phòng Nhân sự</option>
            </select>
          </div>
          
          <div>
            <label className="label">Chế độ xem</label>
            <select
              value={activeView}
              onChange={(e) => setActiveView(e.target.value)}
              className="input"
            >
              {views.map(view => (
                <option key={view.id} value={view.id}>{view.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={exportPerformanceReport}
              className="btn-primary flex items-center space-x-2 w-full"
            >
              <Download className="h-4 w-4" />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Điểm TB hiệu suất</p>
                  <p className={`text-2xl font-bold ${getScoreColor(performanceData.overview.avgPerformanceScore)}`}>
                    {performanceData.overview.avgPerformanceScore}/5.0
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600">
                  {performanceData.overview.totalEmployees} nhân viên
                </span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoàn thành mục tiêu</p>
                  <p className="text-2xl font-bold text-green-600">
                    {performanceData.overview.goalCompletionRate}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600">Trung bình</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nhân viên xuất sắc</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {performanceData.overview.topPerformersCount}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600">≥ 4.5 điểm</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đánh giá hoàn thành</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {performanceData.overview.reviewsCompleted}/{performanceData.overview.totalEmployees}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600">
                  {performanceData.overview.reviewsPending} chờ đánh giá
                </span>
              </div>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xu hướng hiệu suất 6 quý gần đây
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avgScore" stroke="#3B82F6" name="Điểm TB" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="goalCompletion" stroke="#10B981" name="Hoàn thành mục tiêu (%)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="reviewsCompleted" stroke="#F59E0B" name="Đánh giá hoàn thành (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Hiệu suất theo phòng ban
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData.departmentStats}>
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
                  <Bar dataKey="avgScore" fill="#3B82F6" name="Điểm TB" />
                  <Bar dataKey="goalCompletion" fill="#10B981" name="Hoàn thành mục tiêu (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Top 10 nhân viên xuất sắc
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {performanceData.topPerformers.map((performer) => (
                  <div key={performer.employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-sm font-bold text-blue-600">#{performer.rank}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{performer.employee.fullName}</div>
                        <div className="text-sm text-gray-500">{performer.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getScoreColor(performer.score)}`}>
                        {performer.score}/5.0
                      </div>
                      <div className="text-sm text-gray-500">{performer.goalCompletion}% mục tiêu</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluations Tab */}
      {activeView === 'evaluations' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách đánh giá nhân viên
              </h3>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Tạo đánh giá mới</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nhân viên
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Điểm tổng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mục tiêu
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Đánh giá cuối
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performanceData.evaluations.slice(0, 15).map((evaluation) => (
                    <tr key={evaluation.employee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{evaluation.employee.fullName}</div>
                          <div className="text-gray-500">{evaluation.employee.department}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBadge(evaluation.overallScore)}`}>
                          {evaluation.overallScore}/5.0
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${evaluation.goals.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{evaluation.goals.progress}%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {evaluation.goals.completed}/{evaluation.goals.total} hoàn thành
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(evaluation.status)}
                          <span className="capitalize text-gray-700">
                            {evaluation.status.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(evaluation.lastReviewDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800" title="Xem chi tiết">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800" title="Chỉnh sửa">
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

      {/* Goals Tab */}
      {activeView === 'goals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.goalTracking.map((goal, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{goal.category}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    goal.status === 'ahead' ? 'bg-green-100 text-green-800' :
                    goal.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tiến độ</span>
                    <span>{goal.achieved}{goal.unit} / {goal.target}{goal.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        goal.status === 'ahead' ? 'bg-green-500' :
                        goal.status === 'on-track' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((goal.achieved / goal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    goal.status === 'ahead' ? 'text-green-600' :
                    goal.status === 'on-track' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {Math.round((goal.achieved / goal.target) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Phân tích mục tiêu theo phòng ban
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
                      Hoàn thành mục tiêu
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Điểm TB
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Xuất sắc
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cần cải thiện
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performanceData.departmentStats.map((dept) => (
                    <tr key={dept.department} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {dept.department}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dept.employees}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${dept.goalCompletion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{dept.goalCompletion}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-medium ${getScoreColor(dept.avgScore)}`}>
                          {dept.avgScore}/5.0
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dept.topPerformers}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {dept.needsImprovement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Development Tab */}
      {activeView === 'development' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Kế hoạch phát triển
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">Đào tạo kỹ năng mềm</h4>
                  <p className="text-sm text-gray-600">
                    Chương trình đào tạo kỹ năng giao tiếp và làm việc nhóm
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      25 nhân viên
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      80% hoàn thành
                    </span>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900">Chứng chỉ chuyên môn</h4>
                  <p className="text-sm text-gray-600">
                    Hỗ trợ nhân viên lấy chứng chỉ chuyên ngành
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      15 nhân viên
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      60% hoàn thành
                    </span>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-900">Mentoring Program</h4>
                  <p className="text-sm text-gray-600">
                    Ghép đôi nhân viên junior với senior mentor
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      20 cặp
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      90% tích cực
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xu hướng phát triển
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="trainingHours" 
                    stroke="#8B5CF6" 
                    name="Giờ đào tạo"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="promotions" 
                    stroke="#F59E0B" 
                    name="Thăng chức"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Đề xuất phát triển cá nhân
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nhân viên
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Điểm mạnh
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cần cải thiện
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Đề xuất đào tạo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ưu tiên
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performanceData.evaluations.slice(0, 10).map((evaluation) => (
                    <tr key={evaluation.employee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{evaluation.employee.fullName}</div>
                          <div className="text-gray-500">{evaluation.employee.department}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {evaluation.strengths}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {evaluation.improvementAreas}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Khóa học kỹ năng chuyên môn
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          evaluation.overallScore < 3.0 ? 'bg-red-100 text-red-800' :
                          evaluation.overallScore < 4.0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {evaluation.overallScore < 3.0 ? 'Cao' :
                           evaluation.overallScore < 4.0 ? 'Trung bình' : 'Thấp'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
