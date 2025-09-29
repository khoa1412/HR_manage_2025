import { useState, useEffect } from 'react'
import { 
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  Search
} from 'lucide-react'
import { listDepartments, upsertDepartment, deleteDepartment, listEmployees } from '../services/api'
import DepartmentForm from '../components/DepartmentForm'

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [departmentsData, employeesData] = await Promise.all([
        listDepartments(),
        listEmployees()
      ])
      setDepartments(departmentsData)
      setEmployees(employeesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (formData) => {
    setSaving(true)
    try {
      const departmentData = { ...formData }
      if (editingDepartment) {
        departmentData.id = editingDepartment.id
      }
      await upsertDepartment(departmentData)
      setShowForm(false)
      setEditingDepartment(null)
      loadData()
    } catch (error) {
      console.error('Error saving department:', error)
      alert('Có lỗi xảy ra khi lưu phòng ban')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
      try {
        await deleteDepartment(id)
        loadData()
      } catch (error) {
        console.error('Error deleting department:', error)
        alert('Có lỗi xảy ra khi xóa phòng ban')
      }
    }
  }

  const getDepartmentEmployeeCount = (departmentName) => {
    return employees.filter(emp => emp.department === departmentName).length
  }

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng ban</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý cơ cấu tổ chức và phòng ban
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingDepartment(null)
            setShowForm(true)
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm phòng ban</span>
        </button>
      </div>

      {/* Search */}
      <div className="card p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng ban..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-500">{department.code}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(department)}
                  className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(department.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {department.description && (
              <p className="mt-3 text-sm text-gray-600">{department.description}</p>
            )}
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{getDepartmentEmployeeCount(department.name)} nhân viên</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Tạo: {new Date(department.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy phòng ban</h3>
          <p className="mt-1 text-sm text-gray-500">Thử thay đổi điều kiện tìm kiếm.</p>
        </div>
      )}

      <DepartmentForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingDepartment(null)
        }}
        onSubmit={handleFormSubmit}
        editingDepartment={editingDepartment}
        employees={employees}
        saving={saving}
        departments={departments}
      />
    </div>
  )
}
