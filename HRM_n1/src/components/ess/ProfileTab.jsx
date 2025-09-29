import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  CreditCard,
  DollarSign
} from 'lucide-react'
import StatusBadge from '../StatusBadge'

export default function ProfileTab({ employee }) {
  if (!employee) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500">Không thể tải thông tin nhân viên.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Personal Info Overview */}
      <div className="card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {employee.fullName?.charAt(0) || 'N'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{employee.fullName || 'N/A'}</h2>
            <p className="text-gray-600">{employee.position || 'N/A'} • {employee.department || 'N/A'}</p>
            <p className="text-sm text-gray-500">Mã NV: {employee.code || 'N/A'}</p>
          </div>
          <div className="ml-auto">
            <StatusBadge status={employee.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
            <button className="btn-outline flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </button>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
              <dd className="text-sm text-gray-900 font-medium">{employee.fullName || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ngày sinh</dt>
              <dd className="text-sm text-gray-900">
                {employee.birthDate ? new Date(employee.birthDate).toLocaleDateString('vi-VN') : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
              <dd className="text-sm text-gray-900">{employee.gender || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Số CCCD</dt>
              <dd className="text-sm text-gray-900 font-mono">{employee.cccdNumber || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tình trạng hôn nhân</dt>
              <dd className="text-sm text-gray-900">{employee.maritalStatus || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Contact Information */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h3>
          <dl className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{employee.personalEmail || employee.email || 'N/A'}</dd>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Điện thoại</dt>
                <dd className="text-sm text-gray-900">{employee.personalPhone || employee.phone || 'N/A'}</dd>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Địa chỉ tạm trú</dt>
                <dd className="text-sm text-gray-900">{employee.temporaryAddress || 'N/A'}</dd>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Địa chỉ thường trú</dt>
                <dd className="text-sm text-gray-900">{employee.permanentAddress || 'N/A'}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Liên hệ khẩn cấp</h4>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">Tên</dt>
                <dd className="text-sm text-gray-900">{employee.emergencyContactName || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Quan hệ</dt>
                <dd className="text-sm text-gray-900">{employee.emergencyContactRelation || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Số điện thoại</dt>
                <dd className="text-sm text-gray-900">{employee.emergencyContactPhone || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Work Information */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin công việc</h3>
          <dl className="space-y-4">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Mã nhân viên</dt>
                <dd className="text-sm text-gray-900 font-mono">{employee.code || 'N/A'}</dd>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Building2 className="h-4 w-4 text-gray-400" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Phòng ban</dt>
                <dd className="text-sm text-gray-900">{employee.department || 'N/A'}</dd>
              </div>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Vị trí</dt>
              <dd className="text-sm text-gray-900">{employee.position || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Chức danh</dt>
              <dd className="text-sm text-gray-900">{employee.title || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ngày vào làm</dt>
              <dd className="text-sm text-gray-900">
                {employee.startDate || employee.joinDate ? 
                  new Date(employee.startDate || employee.joinDate).toLocaleDateString('vi-VN') : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Loại hợp đồng</dt>
              <dd className="text-sm text-gray-900">{employee.contractType || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Education & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Học vấn & Kỹ năng</h3>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Bằng cấp cao nhất</dt>
              <dd className="text-sm text-gray-900">{employee.highestDegree || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Trường đào tạo</dt>
              <dd className="text-sm text-gray-900">{employee.university || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Chuyên ngành</dt>
              <dd className="text-sm text-gray-900">{employee.major || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Chứng chỉ khác</dt>
              <dd className="text-sm text-gray-900">{employee.otherCertificates || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ngôn ngữ</dt>
              <dd className="text-sm text-gray-900">
                {employee.languages || 'N/A'} 
                {employee.languageLevel && ` (${employee.languageLevel})`}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Thông tin thuế & BHXH</h3>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Mã số thuế</dt>
              <dd className="text-sm text-gray-900 font-mono">{employee.taxCode || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Mã BHXH</dt>
              <dd className="text-sm text-gray-900 font-mono">{employee.socialInsuranceCode || 'N/A'}</dd>
            </div>
          </dl>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Thông tin lương</h4>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">Lương thử việc</dt>
                <dd className="text-sm text-gray-900">
                  {employee.trialSalary ? 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(employee.trialSalary) : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Lương chính thức</dt>
                <dd className="text-sm text-gray-900">
                  {employee.officialSalary ? 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(employee.officialSalary) : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
