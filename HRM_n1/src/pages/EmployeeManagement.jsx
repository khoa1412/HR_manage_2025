import { useState, useEffect } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  Columns,
  List,
  Download,
  Upload,
  SortAsc,
  SortDesc,
  DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { deleteEmployee as delEmp } from '../services/employees.api'
import { listEmployees as beListEmployees, createEmployee as beCreateEmployee, updateEmployee as beUpdateEmployee } from '../services/employees.api'
import { listDepartments } from '../services/api'
import EmployeeForm from '../components/EmployeeForm'
import BulkActions from '../components/BulkActions'
import StatusBadge from '../components/StatusBadge'
import StatusChangeModal from '../components/StatusChangeModal'
import PayslipModal from '../components/PayslipModal'
// EmployeeBenefitsManager đã được xóa khỏi hệ thống

export default function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPosition, setFilterPosition] = useState('')
  const [searchBy, setSearchBy] = useState('all') // 'all', 'name', 'code', 'email', 'phone'
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusChangingEmployee, setStatusChangingEmployee] = useState(null)
  const [showPayslipModal, setShowPayslipModal] = useState(false)
  const [payslipEmployee, setPayslipEmployee] = useState(null)
  // Benefits management đã được xóa khỏi hệ thống

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [employeesData, departmentsData] = await Promise.all([
        beListEmployees({ page: 1, pageSize: 100 }),
        listDepartments()
      ])
      
      // Seed sample employees if none exist
      const rows = employeesData?.data || employeesData || []
      if (rows.length === 0) {
        const sampleEmployees = [
          {
            id: '1',
            code: 'EMP001',
            fullName: 'Nguyễn Văn An',
            email: 'nguyen.van.an@company.com',
            phone: '0901234567',
            department: 'Phòng IT',
            position: 'Senior Developer',
            status: 'Active',
            joinDate: '2023-01-15'
          },
          {
            id: '2',
            code: 'EMP002',
            fullName: 'Trần Thị Bình',
            email: 'tran.thi.binh@company.com',
            phone: '0902345678',
            department: 'Phòng Nhân sự',
            position: 'HR Manager',
            status: 'Active',
            joinDate: '2022-05-20'
          }
        ]
        localStorage.setItem('employees', JSON.stringify(sampleEmployees))
        setEmployees(sampleEmployees)
      } else {
        setEmployees(rows)
      }
      
      setDepartments(departmentsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await delEmp(id)
        setEmployees(employees.filter(emp => emp.id !== id)) // Update state directly
      } catch (error) {
        console.error('Error deleting employee:', error)
        alert('Có lỗi xảy ra khi xóa nhân viên')
      }
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingEmployee(null)
    setShowForm(true)
  }

  const handleSave = async (formData) => {
    try {
      // Map frontend form data to backend DTO format
      const mappedData = {
        // Thông tin cơ bản
        employeeCode: formData.employeeCode || `EMP${Date.now()}`,
        fullName: formData.fullName,
        email: formData.personalEmail || formData.email,
        phone: formData.personalPhone || formData.phone,
        dob: formData.birthDate,
        birthPlace: formData.birthPlace,
        gender: formData.gender,
        cccdNumber: formData.cccdNumber,
        cccdIssueDate: formData.cccdIssueDate,
        cccdIssuePlace: formData.cccdIssuePlace,
        maritalStatus: formData.maritalStatus,
        
        // Thông tin liên hệ
        personalPhone: formData.personalPhone,
        personalEmail: formData.personalEmail,
        temporaryAddress: formData.temporaryAddress,
        permanentAddress: formData.permanentAddress,
        
        // Thông tin liên hệ khẩn cấp
        emergencyContactName: formData.emergencyContactName,
        emergencyContactRelation: formData.emergencyContactRelation,
        emergencyContactPhone: formData.emergencyContactPhone,
        
        // Thông tin học vấn
        highestDegree: formData.highestDegree,
        university: formData.university,
        major: formData.major,
        otherCertificates: formData.otherCertificates,
        languages: formData.languages,
        languageLevel: formData.languageLevel,
        
        // Thông tin Thuế - BHXH
        socialInsuranceCode: formData.socialInsuranceCode,
        taxCode: formData.taxCode,
        
        // Thông tin công việc
        department: formData.department,
        position: formData.position,
        level: formData.level,
        title: formData.title,
        contractType: formData.contractType,
        startDate: formData.startDate,
        contractDuration: formData.contractDuration,
        endDate: formData.endDate,
        probationSalary: formData.probationSalary,
        officialSalary: formData.officialSalary,
        
        // Phúc lợi
        fuelAllowance: formData.fuelAllowance,
        mealAllowance: formData.mealAllowance,
        transportAllowance: formData.transportAllowance,
        uniformAllowance: formData.uniformAllowance,
        performanceBonus: formData.performanceBonus,
        
        // Thông tin hệ thống
        status: formData.status || 'Probation',
        hireDate: formData.startDate,
        joinDate: formData.startDate
      }

      const savedEmployee = editingEmployee
        ? await beUpdateEmployee(editingEmployee.id, mappedData)
        : await beCreateEmployee(mappedData)
        
      if (editingEmployee) {
        // Update existing employee in the list
        setEmployees(employees.map(emp => emp.id === savedEmployee.id ? savedEmployee : emp))
      } else {
        // Add new employee to the list
        setEmployees([...employees, savedEmployee])
      }
      return savedEmployee
    } catch (error) {
      console.error('Error saving employee:', error)
      throw error // Re-throw to let form handle the error
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEmployee(null)
  }

  const handleImportComplete = (result) => {
    if (result.success > 0) {
      loadData() // Full reload is appropriate here after a bulk import
      alert(`Import thành công ${result.success}/${result.total} nhân viên!`)
    }
  }

  const handleStatusChange = (employee) => {
    setStatusChangingEmployee(employee)
    setShowStatusModal(true)
  }

  const handleViewPayslip = (employee) => {
    setPayslipEmployee(employee)
    setShowPayslipModal(true)
  }

  // handleManageBenefits đã được xóa khỏi hệ thống

  const handleStatusUpdate = async (updatedEmployee) => {
    try {
      const savedEmployee = await upsertEmployee(updatedEmployee)
      setEmployees(employees.map(emp => emp.id === savedEmployee.id ? savedEmployee : emp))
      setShowStatusModal(false)
      setStatusChangingEmployee(null)
    } catch (error) {
      console.error('Error updating employee status:', error)
      throw error
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedEmployees = employees
    .filter(employee => {
      // Advanced search logic
      let matchesSearch = true
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        
        switch (searchBy) {
          case 'name':
            matchesSearch = employee.fullName.toLowerCase().includes(searchLower)
            break
          case 'code':
            matchesSearch = (employee.code || '').toLowerCase().includes(searchLower)
            break
          case 'email':
            matchesSearch = (employee.email || '').toLowerCase().includes(searchLower) ||
                           (employee.personalEmail || '').toLowerCase().includes(searchLower)
            break
          case 'phone':
            matchesSearch = (employee.phone || '').includes(searchTerm) ||
                           (employee.personalPhone || '').includes(searchTerm)
            break
          case 'all':
          default:
            matchesSearch = 
              employee.fullName.toLowerCase().includes(searchLower) ||
              (employee.code || '').toLowerCase().includes(searchLower) ||
              (employee.email || '').toLowerCase().includes(searchLower) ||
              (employee.personalEmail || '').toLowerCase().includes(searchLower) ||
              (employee.phone || '').includes(searchTerm) ||
              (employee.personalPhone || '').includes(searchTerm) ||
              (employee.position || '').toLowerCase().includes(searchLower) ||
              (employee.department || '').toLowerCase().includes(searchLower)
            break
        }
      }
      
      return (
        matchesSearch &&
        (filterDepartment === '' || employee.department === filterDepartment) &&
        (filterStatus === '' || employee.status === filterStatus) &&
        (filterPosition === '' || (employee.position || '').toLowerCase().includes(filterPosition.toLowerCase()))
      )
    })
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.fullName.toLowerCase()
          bValue = b.fullName.toLowerCase()
          break
        case 'department':
          aValue = a.department.toLowerCase()
          bValue = b.department.toLowerCase()
          break
        case 'position':
          aValue = a.position.toLowerCase()
          bValue = b.position.toLowerCase()
          break
        case 'joinDate':
          aValue = new Date(a.joinDate)
          bValue = new Date(b.joinDate)
          break
        default:
          aValue = a.fullName.toLowerCase()
          bValue = b.fullName.toLowerCase()
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhân sự</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin và hồ sơ nhân viên ({filteredAndSortedEmployees.length} nhân viên)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <BulkActions 
            employees={filteredAndSortedEmployees} 
            onImportComplete={handleImportComplete}
          />
          <button 
            onClick={handleAdd}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm nhân viên</span>
          </button>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="card p-6">
        {/* Basic Search Row */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center mb-4">
          {/* Advanced Search */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className={`btn-outline px-3 ${showAdvancedSearch ? 'bg-primary-50 border-primary-200' : ''}`}
                title="Tìm kiếm nâng cao"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            
            {/* Search Type */}
            <select
              className="input text-xs"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="all">Tìm tất cả</option>
              <option value="name">Chỉ tên</option>
              <option value="code">Chỉ mã NV</option>
              <option value="email">Chỉ email</option>
              <option value="phone">Chỉ SĐT</option>
            </select>
          </div>
          
          {/* Department Filter */}
          <select
            className="input"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">Tất cả phòng ban</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          
          {/* Status Filter */}
          <select
            className="input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Đang làm việc</option>
            <option value="Probation">Thử việc</option>
            <option value="Inactive">Đã nghỉ việc</option>
          </select>
          
          {/* Sort Options */}
          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="department">Sắp xếp theo phòng ban</option>
            <option value="position">Sắp xếp theo chức vụ</option>
            <option value="joinDate">Sắp xếp theo ngày vào</option>
          </select>
          
          {/* Sort Order & View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
              title={sortOrder === 'asc' ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
            
            <div className="flex rounded-md border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="Xem dạng lưới"
              >
                <Columns className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                title="Xem dạng danh sách"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Count */}
          <div className="text-sm text-gray-600 flex items-center justify-center lg:justify-start">
            <Users className="h-4 w-4 mr-2" />
            {filteredAndSortedEmployees.length} nhân viên
          </div>
        </div>

        {/* Advanced Search Panel */}
        {showAdvancedSearch && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Tìm kiếm nâng cao</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Position Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Vị trí công việc
                </label>
                <input
                  type="text"
                  placeholder="VD: Developer, Manager..."
                  className="input"
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterDepartment('')
                    setFilterStatus('')
                    setFilterPosition('')
                    setSearchBy('all')
                  }}
                  className="btn-outline w-full"
                >
                  Xóa bộ lọc
                </button>
              </div>

              {/* Search Statistics */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Thống kê tìm kiếm</h5>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Tổng: {employees.length} nhân viên</div>
                  <div>Kết quả: {filteredAndSortedEmployees.length} nhân viên</div>
                  <div>Lọc: {filteredAndSortedEmployees.length < employees.length ? 'Có' : 'Không'}</div>
                </div>
              </div>
            </div>

            {/* Quick Search Buttons */}
            <div className="mt-4">
              <h5 className="text-xs font-medium text-gray-700 mb-2">Tìm kiếm nhanh</h5>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Đang làm việc', action: () => setFilterStatus('Active') },
                  { label: 'Thử việc', action: () => setFilterStatus('Probation') },
                  { label: 'Developer', action: () => setFilterPosition('Developer') },
                  { label: 'Manager', action: () => setFilterPosition('Manager') },
                  { label: 'Tất cả IT', action: () => setFilterDepartment('Phòng IT') },
                  { label: 'Tất cả HR', action: () => setFilterDepartment('Phòng Nhân sự') }
                ].map((quickFilter) => (
                  <button
                    key={quickFilter.label}
                    onClick={quickFilter.action}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    {quickFilter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEmployees.map((employee) => (
          <div key={employee.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {employee.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{employee.fullName}</h3>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                  <p className="text-xs text-gray-400">{employee.code}</p>
                </div>
              </div>
              
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{employee.department}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <StatusBadge status={employee.status} />
              
              <div className="flex space-x-2">
                <Link
                  to={`/employees/${employee.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button 
                  onClick={() => handleEdit(employee)}
                  className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleStatusChange(employee)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Thay đổi trạng thái"
                >
                  <Users className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleViewPayslip(employee)}
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  title="Xem phiếu lương"
                >
                  <DollarSign className="h-4 w-4" />
                </button>
                {/* Benefits management button đã được xóa */}
                <button 
                  onClick={() => handleDelete(employee.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Ngày vào: {employee.joinDate}</span>
                <span>{employee.managerId ? 'Có quản lý' : 'Không có quản lý'}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      ) : (
        /* List View */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tên nhân viên</span>
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Phòng ban</span>
                      {sortBy === 'department' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('position')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Chức vụ</span>
                      {sortBy === 'position' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('joinDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Ngày vào</span>
                      {sortBy === 'joinDate' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {employee.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                          <div className="text-sm text-gray-500">{employee.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {employee.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {employee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={employee.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(employee.joinDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/employees/${employee.id}`}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleEdit(employee)}
                          className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(employee)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Thay đổi trạng thái"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleViewPayslip(employee)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Xem phiếu lương"
                        >
                          <DollarSign className="h-4 w-4" />
                        </button>
                        {/* Benefits management button đã được xóa */}
                        <button 
                          onClick={() => handleDelete(employee.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy nhân viên</h3>
          <p className="mt-1 text-sm text-gray-500">Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc.</p>
        </div>
      )}

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Status Change Modal */}
      {showStatusModal && statusChangingEmployee && (
        <StatusChangeModal
          employee={statusChangingEmployee}
          onClose={() => {
            setShowStatusModal(false)
            setStatusChangingEmployee(null)
          }}
          onStatusChange={handleStatusUpdate}
        />
      )}

      {/* Payslip Modal */}
      {showPayslipModal && payslipEmployee && (
        <PayslipModal
          employee={payslipEmployee}
          onClose={() => {
            setShowPayslipModal(false)
            setPayslipEmployee(null)
          }}
        />
      )}

      {/* EmployeeBenefitsManager modal đã được xóa khỏi hệ thống */}
    </div>
  )
}
