import { CheckCircle, Clock, XCircle, AlertTriangle, Pause } from 'lucide-react'

export const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return {
        label: 'Đang làm việc',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: CheckCircle
      }
    case 'inactive':
      return {
        label: 'Tạm nghỉ',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: Pause
      }
    case 'probation':
      return {
        label: 'Thử việc',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        icon: Clock
      }
    case 'terminated':
      return {
        label: 'Đã nghỉ việc',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: XCircle
      }
    case 'pending':
      return {
        label: 'Chờ duyệt',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: AlertTriangle
      }
    default:
      return {
        label: status || 'Không xác định',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: AlertTriangle
      }
  }
}

export default function StatusBadge({ status, showIcon = true }) {
  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </span>
  )
}

export function StatusDropdown({ currentStatus, onStatusChange, disabled = false }) {
  const statusOptions = [
    { value: 'active', label: 'Đang làm việc' },
    { value: 'probation', label: 'Thử việc' },
    { value: 'inactive', label: 'Tạm nghỉ' },
    { value: 'terminated', label: 'Đã nghỉ việc' },
    { value: 'pending', label: 'Chờ duyệt' }
  ]

  return (
    <select
      value={currentStatus || 'active'}
      onChange={(e) => onStatusChange(e.target.value)}
      disabled={disabled}
      className="input"
    >
      {statusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
