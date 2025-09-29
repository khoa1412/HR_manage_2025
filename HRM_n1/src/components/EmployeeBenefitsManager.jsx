import { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  Calendar,
  Tag,
  Award,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import {
  getBenefitTypes,
  createBenefitType,
  getEmployeeBenefits,
  addEmployeeBenefit,
  updateEmployeeBenefit,
  removeEmployeeBenefit,
  calculateEmployeeBenefits,
  BENEFIT_CATEGORIES,
  BENEFIT_TYPES
} from '../services/benefitsService'

export default function EmployeeBenefitsManager({ employee, onClose, onUpdate }) {
  const [benefitTypes, setBenefitTypes] = useState([])
  const [employeeBenefits, setEmployeeBenefits] = useState([])
  const [showCreateBenefitType, setShowCreateBenefitType] = useState(false)
  const [showAddBenefit, setShowAddBenefit] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState(null)
  const [loading, setLoading] = useState(false)

  // New benefit type form
  const [newBenefitType, setNewBenefitType] = useState({
    name: '',
    type: 'allowance',
    category: 'other',
    unit: 'VND/tháng',
    description: ''
  })

  // New benefit form
  const [newBenefit, setNewBenefit] = useState({
    typeId: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [employee.id])

  const loadData = () => {
    setBenefitTypes(getBenefitTypes())
    setEmployeeBenefits(getEmployeeBenefits(employee.id))
  }

  const handleCreateBenefitType = async () => {
    if (!newBenefitType.name.trim()) return

    setLoading(true)
    try {
      const created = createBenefitType(newBenefitType)
      setBenefitTypes(getBenefitTypes())
      setNewBenefitType({
        name: '',
        type: 'allowance',
        category: 'other',
        unit: 'VND/tháng',
        description: ''
      })
      setShowCreateBenefitType(false)
      alert('Tạo loại phúc lợi mới thành công!')
    } catch (error) {
      console.error('Error creating benefit type:', error)
      alert('Có lỗi xảy ra khi tạo loại phúc lợi')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBenefit = async () => {
    if (!newBenefit.typeId || !newBenefit.amount) return

    setLoading(true)
    try {
      const updatedBenefits = addEmployeeBenefit(employee.id, {
        ...newBenefit,
        amount: parseFloat(newBenefit.amount)
      })
      setEmployeeBenefits(updatedBenefits)
      setNewBenefit({
        typeId: '',
        amount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true,
        notes: ''
      })
      setShowAddBenefit(false)
      onUpdate && onUpdate()
      alert('Thêm phúc lợi cho nhân viên thành công!')
    } catch (error) {
      console.error('Error adding benefit:', error)
      alert('Có lỗi xảy ra khi thêm phúc lợi')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBenefit = async (benefitId, updates) => {
    setLoading(true)
    try {
      const updatedBenefits = updateEmployeeBenefit(employee.id, benefitId, updates)
      setEmployeeBenefits(updatedBenefits)
      setEditingBenefit(null)
      onUpdate && onUpdate()
      alert('Cập nhật phúc lợi thành công!')
    } catch (error) {
      console.error('Error updating benefit:', error)
      alert('Có lỗi xảy ra khi cập nhật phúc lợi')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBenefit = async (benefitId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phúc lợi này?')) return

    setLoading(true)
    try {
      const updatedBenefits = removeEmployeeBenefit(employee.id, benefitId)
      setEmployeeBenefits(updatedBenefits)
      onUpdate && onUpdate()
      alert('Xóa phúc lợi thành công!')
    } catch (error) {
      console.error('Error removing benefit:', error)
      alert('Có lỗi xảy ra khi xóa phúc lợi')
    } finally {
      setLoading(false)
    }
  }

  const getBenefitTypeName = (typeId) => {
    const benefitType = benefitTypes.find(type => type.id === typeId)
    return benefitType ? benefitType.name : 'Không xác định'
  }

  const getBenefitTypeInfo = (typeId) => {
    return benefitTypes.find(type => type.id === typeId)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const benefitSummary = calculateEmployeeBenefits(employee.id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Quản lý Phúc lợi & Thưởng
            </h2>
            <p className="text-sm text-gray-500">
              {employee.fullName} - {employee.employeeCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Benefits List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Tổng phúc lợi/tháng</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(benefitSummary.totalMonthly)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-4">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Số lượng phúc lợi</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {benefitSummary.benefitCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-4">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Phúc lợi năm</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(benefitSummary.totalYearly)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={() => setShowAddBenefit(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm phúc lợi</span>
                </button>
                <button
                  onClick={() => setShowCreateBenefitType(true)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Tạo loại phúc lợi mới</span>
                </button>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Danh sách phúc lợi hiện tại</h3>
                
                {employeeBenefits.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có phúc lợi nào được thiết lập</p>
                    <button
                      onClick={() => setShowAddBenefit(true)}
                      className="btn-primary mt-4"
                    >
                      Thêm phúc lợi đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employeeBenefits.map((benefit) => {
                      const benefitType = getBenefitTypeInfo(benefit.typeId)
                      const isEditing = editingBenefit === benefit.id

                      return (
                        <div key={benefit.id} className="card p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {isEditing ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="label">Số tiền</label>
                                    <input
                                      type="number"
                                      defaultValue={benefit.amount}
                                      className="input"
                                      id={`edit-amount-${benefit.id}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="label">Ngày bắt đầu</label>
                                    <input
                                      type="date"
                                      defaultValue={benefit.startDate}
                                      className="input"
                                      id={`edit-start-${benefit.id}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="label">Ngày kết thúc</label>
                                    <input
                                      type="date"
                                      defaultValue={benefit.endDate}
                                      className="input"
                                      id={`edit-end-${benefit.id}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="label">Ghi chú</label>
                                    <input
                                      type="text"
                                      defaultValue={benefit.notes}
                                      className="input"
                                      id={`edit-notes-${benefit.id}`}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${
                                      benefit.isActive ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                      {benefit.isActive ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-gray-600" />
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        {getBenefitTypeName(benefit.typeId)}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        {formatCurrency(benefit.amount)} {benefitType?.unit}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 grid grid-cols-2 text-sm text-gray-600">
                                    <div>
                                      <span className="font-medium">Từ:</span> {benefit.startDate}
                                    </div>
                                    <div>
                                      <span className="font-medium">Đến:</span> {benefit.endDate || 'Không giới hạn'}
                                    </div>
                                  </div>
                                  
                                  {benefit.notes && (
                                    <p className="mt-2 text-sm text-gray-600">
                                      <span className="font-medium">Ghi chú:</span> {benefit.notes}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => {
                                      const amount = document.getElementById(`edit-amount-${benefit.id}`).value
                                      const startDate = document.getElementById(`edit-start-${benefit.id}`).value
                                      const endDate = document.getElementById(`edit-end-${benefit.id}`).value
                                      const notes = document.getElementById(`edit-notes-${benefit.id}`).value
                                      
                                      handleUpdateBenefit(benefit.id, {
                                        amount: parseFloat(amount),
                                        startDate,
                                        endDate: endDate || null,
                                        notes
                                      })
                                    }}
                                    className="text-green-600 hover:text-green-800"
                                    disabled={loading}
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingBenefit(null)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingBenefit(benefit.id)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveBenefit(benefit.id)}
                                    className="text-red-600 hover:text-red-800"
                                    disabled={loading}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
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

          {/* Right Panel - Forms */}
          <div className="w-96 border-l border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Add Benefit Form */}
              {showAddBenefit && (
                <div className="card p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Thêm phúc lợi mới
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label">Loại phúc lợi</label>
                      <select
                        value={newBenefit.typeId}
                        onChange={(e) => setNewBenefit({ ...newBenefit, typeId: e.target.value })}
                        className="input"
                      >
                        <option value="">Chọn loại phúc lợi</option>
                        {benefitTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name} ({type.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Số tiền</label>
                      <input
                        type="number"
                        value={newBenefit.amount}
                        onChange={(e) => setNewBenefit({ ...newBenefit, amount: e.target.value })}
                        className="input"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="label">Ngày bắt đầu</label>
                      <input
                        type="date"
                        value={newBenefit.startDate}
                        onChange={(e) => setNewBenefit({ ...newBenefit, startDate: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Ngày kết thúc (tùy chọn)</label>
                      <input
                        type="date"
                        value={newBenefit.endDate}
                        onChange={(e) => setNewBenefit({ ...newBenefit, endDate: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Ghi chú</label>
                      <textarea
                        value={newBenefit.notes}
                        onChange={(e) => setNewBenefit({ ...newBenefit, notes: e.target.value })}
                        className="input"
                        rows="3"
                        placeholder="Ghi chú thêm..."
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddBenefit}
                        className="btn-primary flex-1"
                        disabled={loading || !newBenefit.typeId || !newBenefit.amount}
                      >
                        Thêm phúc lợi
                      </button>
                      <button
                        onClick={() => setShowAddBenefit(false)}
                        className="btn-outline"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Benefit Type Form */}
              {showCreateBenefitType && (
                <div className="card p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Tạo loại phúc lợi mới
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label">Tên phúc lợi</label>
                      <input
                        type="text"
                        value={newBenefitType.name}
                        onChange={(e) => setNewBenefitType({ ...newBenefitType, name: e.target.value })}
                        className="input"
                        placeholder="VD: Phụ cấp xăng xe"
                      />
                    </div>

                    <div>
                      <label className="label">Loại</label>
                      <select
                        value={newBenefitType.type}
                        onChange={(e) => setNewBenefitType({ ...newBenefitType, type: e.target.value })}
                        className="input"
                      >
                        {Object.entries(BENEFIT_TYPES).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Danh mục</label>
                      <select
                        value={newBenefitType.category}
                        onChange={(e) => setNewBenefitType({ ...newBenefitType, category: e.target.value })}
                        className="input"
                      >
                        {Object.entries(BENEFIT_CATEGORIES).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Đơn vị</label>
                      <select
                        value={newBenefitType.unit}
                        onChange={(e) => setNewBenefitType({ ...newBenefitType, unit: e.target.value })}
                        className="input"
                      >
                        <option value="VND/tháng">VND/tháng</option>
                        <option value="VND/năm">VND/năm</option>
                        <option value="%">%</option>
                        <option value="VND/lần">VND/lần</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Mô tả</label>
                      <textarea
                        value={newBenefitType.description}
                        onChange={(e) => setNewBenefitType({ ...newBenefitType, description: e.target.value })}
                        className="input"
                        rows="3"
                        placeholder="Mô tả chi tiết về phúc lợi này..."
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleCreateBenefitType}
                        className="btn-primary flex-1"
                        disabled={loading || !newBenefitType.name.trim()}
                      >
                        Tạo loại phúc lợi
                      </button>
                      <button
                        onClick={() => setShowCreateBenefitType(false)}
                        className="btn-outline"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefit Types List */}
              <div className="card p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Các loại phúc lợi có sẵn
                </h3>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {benefitTypes.map((type) => (
                    <div key={type.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-500">
                            {BENEFIT_TYPES[type.type]} • {BENEFIT_CATEGORIES[type.category]} • {type.unit}
                          </p>
                          {type.isCustom && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              Tùy chỉnh
                            </span>
                          )}
                        </div>
                        <Tag className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
