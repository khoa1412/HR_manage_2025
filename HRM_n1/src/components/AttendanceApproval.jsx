import { useState, useEffect } from 'react'
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  MessageSquare,
  Eye,
  Edit
} from 'lucide-react'
import { listLeave, listOvertime, updateLeave, updateOvertime } from '../services/ess'
import { getCurrentUserId } from '../services/api'

export default function AttendanceApproval() {
  const [activeTab, setActiveTab] = useState('leave')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // pending, approved, rejected, all
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalComment, setApprovalComment] = useState('')

  useEffect(() => {
    loadRequests()
  }, [activeTab])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = activeTab === 'leave' ? await listLeave() : await listOvertime()
      
      // Add employee info and sort by creation date
      const enrichedData = data.map(request => ({
        ...request,
        // Mock employee data - in real app, fetch from employee service
        employee: {
          id: request.employeeId,
          name: `Nhân viên ${request.employeeId}`,
          code: `EMP${request.employeeId.padStart(3, '0')}`,
          department: 'Phòng IT'
        }
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      setRequests(enrichedData)
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (request, status, comment = '') => {
    try {
      const updatedRequest = {
        ...request,
        status,
        approvedBy: getCurrentUserId(),
        approvedAt: new Date().toISOString(),
        approvalComment: comment,
        // Add to timesheet processing queue if approved
        processForTimesheet: status === 'approved'
      }

      if (activeTab === 'leave') {
        await updateLeave(updatedRequest)
      } else {
        await updateOvertime(updatedRequest)
      }

      // Reload requests
      await loadRequests()
      
      // Close modal
      setShowApprovalModal(false)
      setSelectedRequest(null)
      setApprovalComment('')
      
      alert(`${activeTab === 'leave' ? 'Đơn nghỉ phép' : 'Đơn tăng ca'} đã được ${status === 'approved' ? 'phê duyệt' : 'từ chối'}`)
    } catch (error) {
      console.error('Error updating request:', error)
      alert('Có lỗi xảy ra khi xử lý đơn')
    }
  }

  const openApprovalModal = (request) => {
    setSelectedRequest(request)
    setShowApprovalModal(true)
    setApprovalComment('')
  }

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Chờ duyệt
        </span>
      case 'approved':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã duyệt
        </span>
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Từ chối
        </span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
  }

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Phê duyệt chấm công</h3>
          <p className="text-sm text-gray-500">Xử lý yêu cầu nghỉ phép và tăng ca</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input"
          >
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('leave')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'leave'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Nghỉ phép ({requests.filter(r => r.status === 'pending' && activeTab === 'leave').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('overtime')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'overtime'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Tăng ca ({requests.filter(r => r.status === 'pending' && activeTab === 'overtime').length})</span>
          </button>
        </nav>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredRequests.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-yellow-700">Chờ duyệt</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredRequests.filter(r => r.status === 'approved').length}
          </div>
          <div className="text-green-700">Đã duyệt</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredRequests.filter(r => r.status === 'rejected').length}
          </div>
          <div className="text-red-700">Từ chối</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{filteredRequests.length}</div>
          <div className="text-blue-700">Tổng cộng</div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'leave' ? 'Thời gian nghỉ' : 'Ngày tăng ca'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'leave' ? 'Số ngày' : 'Số giờ'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lý do
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{request.employee.name}</div>
                        <div className="text-sm text-gray-500">{request.employee.code} • {request.employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activeTab === 'leave' ? (
                      <div>
                        <div>{new Date(request.startDate).toLocaleDateString('vi-VN')}</div>
                        <div className="text-gray-500">đến {new Date(request.endDate).toLocaleDateString('vi-VN')}</div>
                      </div>
                    ) : (
                      new Date(request.date).toLocaleDateString('vi-VN')
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activeTab === 'leave' ? 
                      `${calculateLeaveDays(request.startDate, request.endDate)} ngày` : 
                      `${request.hours}h`
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {request.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openApprovalModal(request)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Xem chi tiết và phê duyệt"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproval(request, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Phê duyệt"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApproval(request, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Từ chối"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {filter === 'pending' ? 'Không có yêu cầu nào cần phê duyệt' : 'Không có dữ liệu'}
            </div>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'leave' ? 'Phê duyệt nghỉ phép' : 'Phê duyệt tăng ca'}
              </h3>
              <button 
                onClick={() => setShowApprovalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Request Details */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm">
                <div><strong>Nhân viên:</strong> {selectedRequest.employee.name}</div>
                <div><strong>Phòng ban:</strong> {selectedRequest.employee.department}</div>
                {activeTab === 'leave' ? (
                  <>
                    <div><strong>Thời gian:</strong> {new Date(selectedRequest.startDate).toLocaleDateString('vi-VN')} - {new Date(selectedRequest.endDate).toLocaleDateString('vi-VN')}</div>
                    <div><strong>Số ngày:</strong> {calculateLeaveDays(selectedRequest.startDate, selectedRequest.endDate)} ngày</div>
                    <div><strong>Loại nghỉ:</strong> {selectedRequest.type === 'annual' ? 'Nghỉ phép' : selectedRequest.type === 'sick' ? 'Nghỉ ốm' : 'Nghỉ cá nhân'}</div>
                  </>
                ) : (
                  <>
                    <div><strong>Ngày:</strong> {new Date(selectedRequest.date).toLocaleDateString('vi-VN')}</div>
                    <div><strong>Số giờ:</strong> {selectedRequest.hours}h</div>
                  </>
                )}
                <div><strong>Lý do:</strong> {selectedRequest.reason}</div>
              </div>
            </div>

            {/* Approval Comment */}
            <div className="mb-4">
              <label className="label">Ghi chú phê duyệt</label>
              <textarea
                rows={3}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="Nhập ghi chú (tuỳ chọn)..."
                className="input"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="btn-outline"
              >
                Hủy
              </button>
              <button
                onClick={() => handleApproval(selectedRequest, 'rejected', approvalComment)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Từ chối
              </button>
              <button
                onClick={() => handleApproval(selectedRequest, 'approved', approvalComment)}
                className="btn-primary"
              >
                Phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
