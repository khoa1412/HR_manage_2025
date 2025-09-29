import { useState, useEffect } from 'react'
import { 
  History, 
  User, 
  Calendar, 
  ArrowRight, 
  Filter,
  RefreshCw,
  FileText,
  Shield,
  Briefcase,
  DollarSign,
  Users,
  Phone,
  GraduationCap
} from 'lucide-react'
import { 
  getEmployeeChangeHistory, 
  getFieldDisplayName, 
  getCategoryDisplayName 
} from '../services/changeHistory'

export default function ChangeHistory({ employeeId, maxHeight = '400px' }) {
  const [changes, setChanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, personal, work, salary, benefits
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    loadChangeHistory()
  }, [employeeId, limit])

  const loadChangeHistory = async () => {
    try {
      setLoading(true)
      const history = getEmployeeChangeHistory(employeeId, limit)
      setChanges(history)
    } catch (error) {
      console.error('Error loading change history:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChanges = changes.filter(change => {
    if (filter === 'all') return true
    return change.category === filter
  })

  const getCategoryIcon = (category) => {
    const iconMap = {
      'personal': User,
      'contact': Phone,
      'emergency': Users,
      'education': GraduationCap,
      'tax': Shield,
      'work': Briefcase,
      'salary': DollarSign,
      'benefits': DollarSign,
      'other': FileText
    }
    return iconMap[category] || FileText
  }

  const formatValue = (value, field) => {
    if (!value) return 'Không có'
    
    // Format dates
    if (field.includes('Date') && value.includes('-')) {
      try {
        return new Date(value).toLocaleDateString('vi-VN')
      } catch {
        return value
      }
    }
    
    // Format salary fields
    if (field.includes('Salary') || field.includes('Allowance')) {
      const num = parseInt(value)
      if (!isNaN(num)) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
      }
    }
    
    return value
  }

  const getChangeTypeColor = (category) => {
    const colorMap = {
      'personal': 'blue',
      'contact': 'green',
      'emergency': 'yellow',
      'education': 'purple',
      'tax': 'red',
      'work': 'indigo',
      'salary': 'emerald',
      'benefits': 'pink',
      'other': 'gray'
    }
    return colorMap[category] || 'gray'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Đang tải lịch sử...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Lịch sử thay đổi</h3>
          <span className="text-sm text-gray-500">({filteredChanges.length})</span>
        </div>
        
        <button
          onClick={loadChangeHistory}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Làm mới"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Tất cả' },
          { value: 'personal', label: 'Cá nhân' },
          { value: 'work', label: 'Công việc' },
          { value: 'salary', label: 'Lương' },
          { value: 'benefits', label: 'Phúc lợi' }
        ].map((filterOption) => (
          <button
            key={filterOption.value}
            onClick={() => setFilter(filterOption.value)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              filter === filterOption.value
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Changes List */}
      <div 
        className="space-y-3 overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredChanges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>Chưa có thay đổi nào được ghi nhận</p>
          </div>
        ) : (
          filteredChanges.map((change) => {
            const Icon = getCategoryIcon(change.category)
            const color = getChangeTypeColor(change.category)
            
            return (
              <div
                key={change.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 text-${color}-600`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {getFieldDisplayName(change.field)}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(change.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="px-2 py-1 bg-red-50 text-red-700 rounded border">
                        {formatValue(change.oldValue, change.field)}
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded border">
                        {formatValue(change.newValue, change.field)}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>Thay đổi bởi: {change.changedBy}</span>
                      </div>
                      <span className={`px-2 py-1 bg-${color}-50 text-${color}-700 rounded-full`}>
                        {getCategoryDisplayName(change.category)}
                      </span>
                    </div>
                    
                    {change.reason && (
                      <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                        <strong>Lý do:</strong> {change.reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Load More */}
      {changes.length >= limit && (
        <div className="text-center">
          <button
            onClick={() => setLimit(prev => prev + 20)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Xem thêm lịch sử
          </button>
        </div>
      )}
    </div>
  )
}

