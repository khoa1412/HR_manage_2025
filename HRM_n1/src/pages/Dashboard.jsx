import { useState, useEffect } from 'react'
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  Award,
  Building2,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { listEmployees, listDepartments } from '../services/api'
import OverallDashboard from '../components/OverallDashboard'
import AttendanceAnalytics from '../components/AttendanceAnalytics'
import SalaryAnalytics from '../components/SalaryAnalytics'
import PerformanceReports from '../components/PerformanceReports'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { 
      id: 'overview', 
      label: 'Tổng quan', 
      icon: BarChart3,
      description: 'Dashboard metrics tổng hợp',
      color: 'blue'
    },
    { 
      id: 'attendance', 
      label: 'Phân tích chấm công', 
      icon: Clock,
      description: 'Thời gian làm việc theo tháng/quý/phòng ban',
      color: 'green'
    },
    { 
      id: 'salary', 
      label: 'Phân tích lương', 
      icon: DollarSign,
      description: 'Chi phí lương và benefits theo kỳ',
      color: 'purple'
    },
    { 
      id: 'performance', 
      label: 'Đánh giá hiệu suất', 
      icon: Target,
      description: 'Performance review và KPIs',
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard & Báo cáo</h1>
          <p className="text-sm text-gray-500">
            Tổng hợp analytics, báo cáo và đánh giá hiệu suất toàn diện
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-outline flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="grid grid-cols-1 md:grid-cols-4 gap-4 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative p-4 border-2 rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? `border-${tab.color}-500 bg-${tab.color}-50 border-b-transparent`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <tab.icon className={`h-6 w-6 ${
                  activeTab === tab.id ? `text-${tab.color}-600` : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <div className="text-left">
                  <div className={`font-medium ${
                    activeTab === tab.id ? `text-${tab.color}-900` : 'text-gray-900'
                  }`}>
                    {tab.label}
                  </div>
                  <div className={`text-xs ${
                    activeTab === tab.id ? `text-${tab.color}-700` : 'text-gray-500'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && <OverallDashboard />}
        {activeTab === 'attendance' && <AttendanceAnalytics />}
        {activeTab === 'salary' && <SalaryAnalytics />}
        {activeTab === 'performance' && <PerformanceReports />}
      </div>
    </div>
  )
}