import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  User,
  FileText,
  Clock,
  DollarSign,
  Award,
  Users,
  History
} from 'lucide-react'
import { getEmployee } from '../services/api'
import { getEmployeeBenefits, calculateEmployeeBenefits, getBenefitTypes } from '../services/benefitsService'
import ChangeHistory from '../components/ChangeHistory'

export default function EmployeeProfile() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  const [employeeBenefits, setEmployeeBenefits] = useState([])
  const [benefitTypes, setBenefitTypes] = useState([])
  const [benefitsSummary, setBenefitsSummary] = useState({})

  const tabs = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: User },
    { id: 'work', name: 'Thông tin công việc', icon: Briefcase },
    { id: 'documents', name: 'Tài liệu', icon: FileText },
    { id: 'attendance', name: 'Chấm công', icon: Clock },
    { id: 'salary', name: 'Lương & Phúc lợi', icon: DollarSign },
    { id: 'performance', name: 'Hiệu suất', icon: Award },
    { id: 'history', name: 'Lịch sử thay đổi', icon: History }
  ]

  useEffect(() => {
    loadEmployee()
  }, [id])

  const loadEmployee = async () => {
    try {
      setLoading(true)
      const [employeeData, benefits, types] = await Promise.all([
        getEmployee(id),
        getEmployeeBenefits(id),
        getBenefitTypes()
      ])
      
      setEmployee(employeeData)
      setEmployeeBenefits(benefits)
      setBenefitTypes(types)
      setBenefitsSummary(calculateEmployeeBenefits(id))
    } catch (error) {
      console.error('Error loading employee:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy nhân viên</h3>
        <p className="mt-1 text-sm text-gray-500">
          Nhân viên với ID {id} không tồn tại trong hệ thống.
        </p>
        <Link to="/employees" className="mt-4 btn-primary inline-flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/employees"
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ Nhân viên</h1>
            <p className="mt-1 text-sm text-gray-500">
              Chi tiết thông tin của {employee.fullName}
            </p>
          </div>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Edit className="h-4 w-4" />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      {/* Employee Summary Card */}
      <div className="card p-6">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-bold text-2xl">
              {employee.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          
          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{employee.fullName}</h2>
                <p className="text-gray-600">{employee.position}</p>
                <p className="text-sm text-gray-500">Mã NV: {employee.code}</p>
              </div>
              
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                employee.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : employee.status === 'Probation'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.status === 'Active' ? 'Đang làm việc' : 
                 employee.status === 'Probation' ? 'Thử việc' : 'Đã nghỉ việc'}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="h-4 w-4 mr-2" />
                {employee.department}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {employee.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {employee.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Vào: {new Date(employee.joinDate).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'personal' && <PersonalInfoTab employee={employee} />}
        {activeTab === 'work' && <WorkInfoTab employee={employee} />}
        {activeTab === 'documents' && <DocumentsTab employee={employee} />}
        {activeTab === 'attendance' && <AttendanceTab employee={employee} />}
        {activeTab === 'salary' && (
          <SalaryTab 
            employee={employee} 
            employeeBenefits={employeeBenefits}
            benefitTypes={benefitTypes}
            benefitsSummary={benefitsSummary}
          />
        )}
        {activeTab === 'performance' && <PerformanceTab employee={employee} />}
        {activeTab === 'history' && (
          <div className="card p-6">
            <ChangeHistory employeeId={employee.id} />
          </div>
        )}
      </div>
    </div>
  )
}

// Tab Components
function PersonalInfoTab({ employee }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Họ và tên</label>
              <p className="mt-1 text-sm text-gray-900">{employee.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Mã nhân viên</label>
              <p className="mt-1 text-sm text-gray-900">{employee.code}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{employee.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <p className="mt-1 text-sm text-gray-900">{employee.phone}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Ngày vào làm</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(employee.joinDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ khẩn cấp</h3>
        <div className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-8 w-8 mb-2" />
            <p>Chưa có thông tin liên hệ khẩn cấp</p>
            <button className="mt-2 text-primary-600 hover:text-primary-500 text-sm">
              Thêm thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkInfoTab({ employee }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin công việc</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Phòng ban</label>
              <p className="mt-1 text-sm text-gray-900">{employee.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Chức vụ</label>
              <p className="mt-1 text-sm text-gray-900">{employee.position}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                employee.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : employee.status === 'Probation'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.status === 'Active' ? 'Đang làm việc' : 
                 employee.status === 'Probation' ? 'Thử việc' : 'Đã nghỉ việc'}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Quản lý trực tiếp</label>
              <p className="mt-1 text-sm text-gray-900">
                {employee.managerId ? 'Có' : 'Không có quản lý'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lịch sử công việc</h3>
        <div className="space-y-4">
          <div className="border-l-2 border-primary-200 pl-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{employee.position}</h4>
              <span className="text-sm text-gray-500">
                {new Date(employee.joinDate).toLocaleDateString('vi-VN')} - Hiện tại
              </span>
            </div>
            <p className="text-sm text-gray-600">{employee.department}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentsTab({ employee }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Tài liệu & Hồ sơ</h3>
        <button className="btn-primary flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Thêm tài liệu</span>
        </button>
      </div>
      
      <div className="text-center py-12 text-gray-500">
        <FileText className="mx-auto h-12 w-12 mb-4" />
        <h4 className="font-medium text-gray-900">Chưa có tài liệu</h4>
        <p className="text-sm">Hãy thêm các tài liệu liên quan đến nhân viên này</p>
      </div>
    </div>
  )
}

function AttendanceTab({ employee }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <h3 className="font-medium text-gray-900">Tháng này</h3>
          <p className="text-2xl font-bold text-blue-600">22</p>
          <p className="text-sm text-gray-500">ngày làm việc</p>
        </div>
        
        <div className="card p-6 text-center">
          <Calendar className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <h3 className="font-medium text-gray-900">Nghỉ phép</h3>
          <p className="text-2xl font-bold text-green-600">2</p>
          <p className="text-sm text-gray-500">ngày đã nghỉ</p>
        </div>
        
        <div className="card p-6 text-center">
          <Award className="h-8 w-8 mx-auto text-orange-600 mb-2" />
          <h3 className="font-medium text-gray-900">Tăng ca</h3>
          <p className="text-2xl font-bold text-orange-600">15</p>
          <p className="text-sm text-gray-500">giờ tăng ca</p>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lịch sử chấm công</h3>
        <div className="text-center py-8 text-gray-500">
          <Clock className="mx-auto h-8 w-8 mb-2" />
          <p>Chưa có dữ liệu chấm công</p>
        </div>
      </div>
    </div>
  )
}

function SalaryTab({ employee, employeeBenefits, benefitTypes, benefitsSummary }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getBenefitTypeName = (typeId) => {
    const benefitType = benefitTypes.find(type => type.id === typeId)
    return benefitType ? benefitType.name : 'Không xác định'
  }

  const getBenefitTypeInfo = (typeId) => {
    return benefitTypes.find(type => type.id === typeId)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <DollarSign className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <h3 className="font-medium text-gray-900">Lương cơ bản</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(employee.officialSalary || 15000000)}
          </p>
          <p className="text-sm text-gray-500">VND/tháng</p>
        </div>
        
        <div className="card p-6 text-center">
          <Award className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <h3 className="font-medium text-gray-900">Tổng phúc lợi</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(benefitsSummary.totalMonthly || 0)}
          </p>
          <p className="text-sm text-gray-500">VND/tháng</p>
        </div>
        
        <div className="card p-6 text-center">
          <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
          <h3 className="font-medium text-gray-900">Số phúc lợi</h3>
          <p className="text-2xl font-bold text-purple-600">
            {benefitsSummary.benefitCount || 0}
          </p>
          <p className="text-sm text-gray-500">loại phúc lợi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Information */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin lương</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Lương cơ bản</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(employee.officialSalary || 15000000)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Phụ cấp chức vụ</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(calculatePositionAllowance(employee.position))}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Phụ cấp đi lại</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(500000)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Phụ cấp ăn uống</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(800000)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 pt-3">
              <span className="text-base font-bold text-gray-900">Tổng phúc lợi custom</span>
              <span className="text-base font-bold text-green-600">
                {formatCurrency(benefitsSummary.totalMonthly || 0)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Benefits Details */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết phúc lợi</h3>
          
          {employeeBenefits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="mx-auto h-8 w-8 mb-2" />
              <p>Chưa có phúc lợi custom nào</p>
              <p className="text-sm">Liên hệ HR để thiết lập phúc lợi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {employeeBenefits.map((benefit) => {
                const benefitType = getBenefitTypeInfo(benefit.typeId)
                return (
                  <div key={benefit.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {getBenefitTypeName(benefit.typeId)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(benefit.amount)} {benefitType?.unit}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {benefit.startDate} 
                            {benefit.endDate ? ` - ${benefit.endDate}` : ' - Không giới hạn'}
                          </span>
                        </div>
                        {benefit.notes && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            {benefit.notes}
                          </p>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          benefit.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {benefit.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Standard Benefits */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bảo hiểm & Quyền lợi cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-900">Bảo hiểm xã hội</span>
            </div>
            <span className="text-sm font-bold text-green-600">8%</span>
          </div>
          <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-900">Bảo hiểm y tế</span>
            </div>
            <span className="text-sm font-bold text-blue-600">1.5%</span>
          </div>
          <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-900">Bảo hiểm thất nghiệp</span>
            </div>
            <span className="text-sm font-bold text-yellow-600">1%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function for position allowance calculation
function calculatePositionAllowance(position) {
  if (!position) return 0
  
  const pos = position.toLowerCase()
  if (pos.includes('giám đốc') || pos.includes('director')) return 3000000
  if (pos.includes('trưởng phòng') || pos.includes('manager')) return 2000000
  if (pos.includes('phó') || pos.includes('deputy')) return 1500000
  if (pos.includes('trưởng nhóm') || pos.includes('team lead')) return 1000000
  
  return 500000 // Default allowance
}

function PerformanceTab({ employee }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Đánh giá hiệu suất</h3>
          <div className="text-center py-8 text-gray-500">
            <Award className="mx-auto h-8 w-8 mb-2" />
            <p>Chưa có đánh giá hiệu suất</p>
            <button className="mt-2 text-primary-600 hover:text-primary-500 text-sm">
              Tạo đánh giá mới
            </button>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mục tiêu</h3>
          <div className="text-center py-8 text-gray-500">
            <Award className="mx-auto h-8 w-8 mb-2" />
            <p>Chưa có mục tiêu được thiết lập</p>
            <button className="mt-2 text-primary-600 hover:text-primary-500 text-sm">
              Thiết lập mục tiêu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}