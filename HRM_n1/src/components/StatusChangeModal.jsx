import { useState } from 'react'
import { X, AlertTriangle, CheckCircle } from 'lucide-react'
import StatusBadge, { StatusDropdown } from './StatusBadge'
import { logChange } from '../services/changeHistory'

export default function StatusChangeModal({ employee, onClose, onStatusChange }) {
  const [newStatus, setNewStatus] = useState(employee.status || 'active')
  const [reason, setReason] = useState('')
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!newStatus) {
      newErrors.status = 'Vui lòng chọn trạng thái'
    }
    
    if (!effectiveDate) {
      newErrors.effectiveDate = 'Vui lòng chọn ngày hiệu lực'
    }
    
    if (!reason.trim()) {
      newErrors.reason = 'Vui lòng nhập lý do thay đổi'
    }
    
    // Special validation for terminated status
    if (newStatus === 'terminated' && reason.trim().length < 10) {
      newErrors.reason = 'Lý do nghỉ việc phải có ít nhất 10 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSaving(true)
    try {
      // Log status change
      await logChange(
        employee.id,
        'status',
        employee.status,
        newStatus,
        'HR System',
        reason
      )

      // Update employee status
      const updatedEmployee = {
        ...employee,
        status: newStatus,
        statusHistory: [
          ...(employee.statusHistory || []),
          {
            id: Date.now().toString(),
            fromStatus: employee.status,
            toStatus: newStatus,
            reason: reason,
            effectiveDate: effectiveDate,
            changedBy: 'HR System',
            changedAt: new Date().toISOString()
          }
        ]
      }

      await onStatusChange(updatedEmployee)
      onClose()
    } catch (error) {
      console.error('Error changing status:', error)
      alert('Có lỗi xảy ra khi thay đổi trạng thái')
    } finally {
      setSaving(false)
    }
  }

  const getStatusChangeWarning = () => {
    if (newStatus === 'terminated') {
      return {
        type: 'warning',
        message: 'Lưu ý: Nhân viên sẽ được chuyển sang trạng thái "Đã nghỉ việc" và không thể truy cập hệ thống.'
      }
    }
    if (newStatus === 'inactive') {
      return {
        type: 'info',
        message: 'Nhân viên sẽ được chuyển sang trạng thái "Tạm nghỉ" và quyền truy cập sẽ bị tạm dừng.'
      }
    }
    return null
  }

  const warning = getStatusChangeWarning()

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Thay đổi trạng thái nhân viên</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Employee Info */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{employee.fullName}</h4>
              <p className="text-sm text-gray-500">{employee.code} • {employee.department}</p>
            </div>
            <StatusBadge status={employee.status} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Status */}
          <div>
            <label className="label">
              Trạng thái mới <span className="text-red-500">*</span>
            </label>
            <StatusDropdown
              currentStatus={newStatus}
              onStatusChange={setNewStatus}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          {/* Effective Date */}
          <div>
            <label className="label">
              Ngày hiệu lực <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className={`input ${errors.effectiveDate ? 'border-red-500' : ''}`}
            />
            {errors.effectiveDate && (
              <p className="text-red-500 text-sm mt-1">{errors.effectiveDate}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="label">
              Lý do thay đổi <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do thay đổi trạng thái..."
              className={`input ${errors.reason ? 'border-red-500' : ''}`}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Warning */}
          {warning && (
            <div className={`p-3 rounded-lg flex items-start space-x-2 ${
              warning.type === 'warning' ? 'bg-red-50' : 'bg-blue-50'
            }`}>
              <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                warning.type === 'warning' ? 'text-red-500' : 'text-blue-500'
              }`} />
              <p className={`text-sm ${
                warning.type === 'warning' ? 'text-red-700' : 'text-blue-700'
              }`}>
                {warning.message}
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700">
                Từ <StatusBadge status={employee.status} showIcon={false} /> → <StatusBadge status={newStatus} showIcon={false} />
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Xác nhận thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
