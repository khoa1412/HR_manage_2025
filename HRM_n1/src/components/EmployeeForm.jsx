import { useState, useEffect } from 'react'
import { 
  X, Save, User, Mail, Phone, Building2, Briefcase, Calendar, 
  FileText, Users, CreditCard, GraduationCap, Shield, DollarSign, Gift 
} from 'lucide-react'
import { listDepartments, listEmployees } from '../services/api'
import { getEmployeeFiles } from '../services/fileUpload'
import { initializeDefaultBenefits } from '../services/benefitsService'
import EmployeeBenefitsManager from './EmployeeBenefitsManager'
import { useAuth } from '../contexts/AuthContext'
import FileUpload from './FileUpload'

export default function EmployeeForm({ employee, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    // Thông tin cơ bản
    fullName: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    cccdNumber: '',
    cccdIssueDate: '',
    cccdIssuePlace: '',
    maritalStatus: '',
    
    // Thông tin liên hệ
    personalPhone: '',
    personalEmail: '',
    temporaryAddress: '',
    permanentAddress: '',
    
    // Thông tin liên hệ khẩn cấp
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    
    // Thông tin học vấn
    highestDegree: '',
    university: '',
    major: '',
    otherCertificates: '',
    languages: '',
    languageLevel: '',
    
    // Thông tin Thuế - BHXH
    socialInsuranceCode: '',
    taxCode: '',
    
    // Thông tin công việc
    department: '',
    position: '',
    level: '',
    title: '',
    contractType: '',
    startDate: '',
    contractDuration: '',
    endDate: '',
    probationSalary: '',
    officialSalary: '',
    
    // Phúc lợi
    fuelAllowance: '',
    mealAllowance: '',
    transportAllowance: '',
    uniformAllowance: '',
    performanceBonus: '',
    
    // Thông tin hệ thống
    status: 'Probation',
    employeeCode: ''
  })
  const [departments, setDepartments] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [employeeFiles, setEmployeeFiles] = useState({
    cccd_front: [],
    cccd_back: [],
    contract: [],
    degree: [],
    certificate: [],
    health: [],
    insurance: [],
    other: []
  })
  const { user } = useAuth()
  const [showBenefitsManager, setShowBenefitsManager] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(employee || null)
  const [notice, setNotice] = useState('')

  const tabs = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: User },
    { id: 'contact', name: 'Liên hệ', icon: Phone },
    { id: 'emergency', name: 'Liên hệ khẩn cấp', icon: Users },
    { id: 'education', name: 'Học vấn', icon: GraduationCap },
    { id: 'tax', name: 'Thuế & BHXH', icon: Shield },
    { id: 'work', name: 'Công việc', icon: Briefcase },
    { id: 'benefits', name: 'Phúc lợi', icon: DollarSign },
    { id: 'documents', name: 'Tài liệu', icon: FileText }
  ]

  useEffect(() => {
    loadDepartments()
    if (employee) {
      // Load existing files
      const files = getEmployeeFiles(employee.id)
      const filesByCategory = {
        cccd_front: files.filter(f => f.category === 'cccd_front'),
        cccd_back: files.filter(f => f.category === 'cccd_back'),
        contract: files.filter(f => f.category === 'contract'),
        degree: files.filter(f => f.category === 'degree'),
        certificate: files.filter(f => f.category === 'certificate'),
        health: files.filter(f => f.category === 'health'),
        insurance: files.filter(f => f.category === 'insurance'),
        other: files.filter(f => f.category === 'other')
      }
      setEmployeeFiles(filesByCategory)
      setFormData({
        // Thông tin cơ bản
        fullName: employee.fullName || '',
        birthDate: employee.birthDate || '',
        birthPlace: employee.birthPlace || '',
        gender: employee.gender || '',
        cccdNumber: employee.cccdNumber || '',
        cccdIssueDate: employee.cccdIssueDate || '',
        cccdIssuePlace: employee.cccdIssuePlace || '',
        maritalStatus: employee.maritalStatus || '',
        
        // Thông tin liên hệ
        personalPhone: employee.personalPhone || employee.phone || '',
        personalEmail: employee.personalEmail || employee.email || '',
        temporaryAddress: employee.temporaryAddress || '',
        permanentAddress: employee.permanentAddress || '',
        
        // Thông tin liên hệ khẩn cấp
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactRelation: employee.emergencyContactRelation || '',
        emergencyContactPhone: employee.emergencyContactPhone || '',
        
        // Thông tin học vấn
        highestDegree: employee.highestDegree || '',
        university: employee.university || '',
        major: employee.major || '',
        otherCertificates: employee.otherCertificates || '',
        languages: employee.languages || '',
        languageLevel: employee.languageLevel || '',
        
        // Thông tin Thuế - BHXH
        socialInsuranceCode: employee.socialInsuranceCode || '',
        taxCode: employee.taxCode || '',
        
        // Thông tin công việc
        department: employee.department || '',
        position: employee.position || '',
        level: employee.level || '',
        title: employee.title || '',
        contractType: employee.contractType || '',
        startDate: employee.startDate || employee.joinDate || '',
        contractDuration: employee.contractDuration || '',
        endDate: employee.endDate || '',
        probationSalary: employee.probationSalary || '',
        officialSalary: employee.officialSalary || '',
        
        // Phúc lợi
        fuelAllowance: employee.fuelAllowance || '',
        mealAllowance: employee.mealAllowance || '',
        transportAllowance: employee.transportAllowance || '',
        uniformAllowance: employee.uniformAllowance || '',
        performanceBonus: employee.performanceBonus || '',
        
        // Thông tin hệ thống
        status: employee.status || 'Probation',
        employeeCode: employee.code || employee.employeeCode || ''
      })
    }
    // keep local current employee in sync with prop
    setCurrentEmployee(employee || null)
  }, [employee])

  const loadDepartments = async () => {
    try {
      const depts = await listDepartments()
      setDepartments(depts)
    } catch (error) {
      console.error('Error loading departments:', error)
    }
  }

  const validateForm = async () => {
    const newErrors = {}

    // Lấy danh sách nhân viên để check unique
    const existingEmployees = await listEmployees()
    const otherEmployees = existingEmployees.filter(emp => emp.id !== employee?.id)

    // Thông tin cơ bản - bắt buộc
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Ngày sinh là bắt buộc'
    }

    if (!formData.gender) {
      newErrors.gender = 'Giới tính là bắt buộc'
    }

    if (!formData.cccdNumber.trim()) {
      newErrors.cccdNumber = 'Số CCCD là bắt buộc'
    } else if (!/^[0-9]{12}$/.test(formData.cccdNumber.replace(/\s/g, ''))) {
      newErrors.cccdNumber = 'Số CCCD phải có 12 chữ số'
    } else {
      // Check unique CCCD
      const duplicateCCCD = otherEmployees.find(emp => emp.cccdNumber === formData.cccdNumber)
      if (duplicateCCCD) {
        newErrors.cccdNumber = `Số CCCD đã tồn tại cho nhân viên ${duplicateCCCD.fullName}`
      }
    }

    if (!formData.cccdIssueDate) {
      newErrors.cccdIssueDate = 'Ngày cấp CCCD là bắt buộc'
    }

    if (!formData.cccdIssuePlace.trim()) {
      newErrors.cccdIssuePlace = 'Nơi cấp CCCD là bắt buộc'
    }

    // Thông tin liên hệ - bắt buộc
    if (!formData.personalPhone.trim()) {
      newErrors.personalPhone = 'Số điện thoại cá nhân là bắt buộc'
    } else if (!/^[0-9]{10,11}$/.test(formData.personalPhone.replace(/\s/g, ''))) {
      newErrors.personalPhone = 'Số điện thoại không hợp lệ'
    }

    if (!formData.personalEmail.trim()) {
      newErrors.personalEmail = 'Email cá nhân là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Email không hợp lệ'
    }

    if (!formData.temporaryAddress.trim()) {
      newErrors.temporaryAddress = 'Địa chỉ tạm trú là bắt buộc'
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'Địa chỉ thường trú là bắt buộc'
    }

    // Thông tin liên hệ khẩn cấp - bắt buộc
    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = 'Họ tên người liên hệ khẩn cấp là bắt buộc'
    }

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = 'SĐT người liên hệ khẩn cấp là bắt buộc'
    } else if (!/^[0-9]{10,11}$/.test(formData.emergencyContactPhone.replace(/\s/g, ''))) {
      newErrors.emergencyContactPhone = 'Số điện thoại không hợp lệ'
    }

    // Thông tin công việc - bắt buộc
    if (!formData.department.trim()) {
      newErrors.department = 'Phòng ban là bắt buộc'
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Vị trí công việc là bắt buộc'
    }

    if (!formData.contractType) {
      newErrors.contractType = 'Loại hợp đồng là bắt buộc'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc'
    }

    if (!formData.contractDuration) {
      newErrors.contractDuration = 'Thời gian hợp đồng là bắt buộc'
    }

    // Validation cho mã số thuế (nếu có)
    if (formData.taxCode && !/^[0-9]{10}$/.test(formData.taxCode.replace(/\s/g, ''))) {
      newErrors.taxCode = 'Mã số thuế phải có 10 chữ số'
    } else if (formData.taxCode) {
      // Check unique Tax Code
      const duplicateTaxCode = otherEmployees.find(emp => emp.taxCode === formData.taxCode)
      if (duplicateTaxCode) {
        newErrors.taxCode = `Mã số thuế đã tồn tại cho nhân viên ${duplicateTaxCode.fullName}`
      }
    }

    // Validation cho mã BHXH (nếu có)
    if (formData.socialInsuranceCode && !/^[A-Z]{2}[0-9]{8}$/.test(formData.socialInsuranceCode.replace(/\s/g, ''))) {
      newErrors.socialInsuranceCode = 'Mã BHXH không đúng định dạng'
    } else if (formData.socialInsuranceCode) {
      // Check unique Social Insurance Code
      const duplicateSocialInsurance = otherEmployees.find(emp => emp.socialInsuranceCode === formData.socialInsuranceCode)
      if (duplicateSocialInsurance) {
        newErrors.socialInsuranceCode = `Mã BHXH đã tồn tại cho nhân viên ${duplicateSocialInsurance.fullName}`
      }
    }

    setErrors(newErrors)
    const ok = Object.keys(newErrors).length === 0
    return { ok, newErrors }
  }

  // Map each field to its owning tab to support error navigation
  const getTabForField = (field) => {
    const map = {
      // personal
      fullName: 'personal', birthDate: 'personal', birthPlace: 'personal', gender: 'personal',
      cccdNumber: 'personal', cccdIssueDate: 'personal', cccdIssuePlace: 'personal', maritalStatus: 'personal',
      // contact
      personalPhone: 'contact', personalEmail: 'contact', temporaryAddress: 'contact', permanentAddress: 'contact',
      // emergency
      emergencyContactName: 'emergency', emergencyContactRelation: 'emergency', emergencyContactPhone: 'emergency',
      // education
      highestDegree: 'education', university: 'education', major: 'education', otherCertificates: 'education', languages: 'education', languageLevel: 'education',
      // tax
      socialInsuranceCode: 'tax', taxCode: 'tax',
      // work
      department: 'work', position: 'work', contractType: 'work', startDate: 'work', contractDuration: 'work', endDate: 'work', level: 'work', title: 'work',
      // benefits
      fuelAllowance: 'benefits', mealAllowance: 'benefits', transportAllowance: 'benefits', uniformAllowance: 'benefits', performanceBonus: 'benefits'
    }
    return map[field] || 'personal'
  }

  // Validate only the current tab fields for partial save
  const validateCurrentTab = async () => {
    const tab = activeTab
    const tabErrors = {}
    const addErr = (field, msg) => { tabErrors[field] = msg }

    if (tab === 'personal') {
      if (!formData.fullName.trim()) addErr('fullName', 'Họ và tên là bắt buộc')
      if (!formData.birthDate) addErr('birthDate', 'Ngày sinh là bắt buộc')
      if (!formData.gender) addErr('gender', 'Giới tính là bắt buộc')
      if (!formData.cccdNumber.trim()) {
        addErr('cccdNumber', 'Số CCCD là bắt buộc')
      } else if (!/^[0-9]{12}$/.test(formData.cccdNumber.replace(/\s/g, ''))) {
        addErr('cccdNumber', 'Số CCCD phải có 12 chữ số')
      }
      if (!formData.cccdIssueDate) addErr('cccdIssueDate', 'Ngày cấp CCCD là bắt buộc')
      if (!formData.cccdIssuePlace.trim()) addErr('cccdIssuePlace', 'Nơi cấp CCCD là bắt buộc')
    } else if (tab === 'contact') {
      if (!formData.personalPhone.trim()) {
        addErr('personalPhone', 'Số điện thoại cá nhân là bắt buộc')
      } else if (!/^[0-9]{10,11}$/.test(formData.personalPhone.replace(/\s/g, ''))) {
        addErr('personalPhone', 'Số điện thoại không hợp lệ')
      }
      if (!formData.personalEmail.trim()) {
        addErr('personalEmail', 'Email cá nhân là bắt buộc')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
        addErr('personalEmail', 'Email không hợp lệ')
      }
      if (!formData.temporaryAddress.trim()) addErr('temporaryAddress', 'Địa chỉ tạm trú là bắt buộc')
      if (!formData.permanentAddress.trim()) addErr('permanentAddress', 'Địa chỉ thường trú là bắt buộc')
    } else if (tab === 'emergency') {
      if (!formData.emergencyContactName.trim()) addErr('emergencyContactName', 'Họ tên người liên hệ khẩn cấp là bắt buộc')
      if (!formData.emergencyContactPhone.trim()) {
        addErr('emergencyContactPhone', 'SĐT người liên hệ khẩn cấp là bắt buộc')
      } else if (!/^[0-9]{10,11}$/.test(formData.emergencyContactPhone.replace(/\s/g, ''))) {
        addErr('emergencyContactPhone', 'Số điện thoại không hợp lệ')
      }
    } else if (tab === 'work') {
      if (!formData.department.trim()) addErr('department', 'Phòng ban là bắt buộc')
      if (!formData.position.trim()) addErr('position', 'Vị trí công việc là bắt buộc')
      if (!formData.contractType) addErr('contractType', 'Loại hợp đồng là bắt buộc')
      if (!formData.startDate) addErr('startDate', 'Ngày bắt đầu là bắt buộc')
      if (!formData.contractDuration) addErr('contractDuration', 'Thời gian hợp đồng là bắt buộc')
    }

    setErrors(prev => ({ ...prev, ...tabErrors }))
    return Object.keys(tabErrors).length === 0
  }

  const handleSaveAndNext = async () => {
    const ok = await validateCurrentTab()
    if (!ok) return
    setLoading(true)
    try {
      const saved = await onSave(formData)
      if (saved) {
        setCurrentEmployee(saved)
        const current = tabs.find(t => t.id === activeTab)
        setNotice(`Đã lưu "${current?.name || ''}" thành công`)
        setTimeout(() => setNotice(''), 2500)
        // Keep current tab as requested
      }
    } catch (e) {
      console.error('Error partial-saving employee:', e)
      alert('Có lỗi xảy ra khi lưu thông tin mục hiện tại')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { ok, newErrors } = await validateForm()
    if (!ok) {
      // Jump to the first tab that contains an error so user can see and fix it
      const firstErrorField = Object.keys(newErrors)[0]
      const targetTab = firstErrorField ? getTabForField(firstErrorField) : activeTab
      setActiveTab(targetTab)
      setNotice('Vui lòng hoàn thiện các trường bắt buộc trong tab này')
      setTimeout(() => setNotice(''), 2500)
      return
    }

    setLoading(true)
    try {
      const savedEmployee = await onSave(formData)
      
      // Initialize default benefits for new employees only
      if (!employee && savedEmployee && savedEmployee.id) {
        try {
          await initializeDefaultBenefits(savedEmployee.id, formData.position || '')
          console.log('Default benefits initialized for new employee')
        } catch (benefitsError) {
          console.error('Error initializing default benefits:', benefitsError)
          // Don't block the main flow, just log the error
        }
      }

      // Show success and go back to Employee Management (close modal)
      const isUpdate = !!(employee?.id || savedEmployee?.id)
      alert(isUpdate ? 'Cập nhật thành công' : 'Thêm mới thành công')
      onCancel && onCancel()
    } catch (error) {
      console.error('Error saving employee:', error)
      alert('Có lỗi xảy ra khi lưu thông tin nhân viên')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {employee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
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

        {/* Success Notice */}
        {notice && (
          <div className="mx-6 mt-4 mb-0 p-3 rounded bg-green-50 text-green-800 border border-green-200 text-sm">
            {notice}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Tab Content */}
            {activeTab === 'personal' && <PersonalInfoTab formData={formData} errors={errors} onChange={handleChange} />}
            {activeTab === 'contact' && <ContactInfoTab formData={formData} errors={errors} onChange={handleChange} />}
            {activeTab === 'emergency' && <EmergencyContactTab formData={formData} errors={errors} onChange={handleChange} />}
            {activeTab === 'education' && <EducationTab formData={formData} errors={errors} onChange={handleChange} />}
            {activeTab === 'tax' && <TaxInfoTab formData={formData} errors={errors} onChange={handleChange} />}
            {activeTab === 'work' && <WorkInfoTab formData={formData} errors={errors} onChange={handleChange} departments={departments} />}
            {activeTab === 'benefits' && (
              <BenefitsTab 
                formData={formData} 
                errors={errors} 
                onChange={handleChange} 
                isHR={user?.role === 'admin'}
                onOpenBenefits={() => setShowBenefitsManager(true)}
                hasEmployee={!!currentEmployee}
              />
            )}
            {activeTab === 'documents' && <DocumentsTab employeeFiles={employeeFiles} setEmployeeFiles={setEmployeeFiles} employeeId={currentEmployee?.id} />}
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
            <div className="text-xs text-gray-500">Tab hiện tại: {tabs.find(t => t.id === activeTab)?.name}</div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="btn-outline"
                disabled={loading}
                title="Hủy và đóng"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="btn-outline"
                disabled={loading}
                title="Lưu mục hiện tại và giữ nguyên tab"
              >
                {loading ? 'Đang lưu...' : 'Lưu & Tiếp tục'}
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={loading}
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Đang lưu...' : (employee ? 'Cập nhật' : 'Thêm mới')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
      {showBenefitsManager && currentEmployee && (
        <EmployeeBenefitsManager
          employee={currentEmployee}
          onClose={() => setShowBenefitsManager(false)}
          onUpdate={() => {
            // Optionally refresh any derived benefit fields here
            setShowBenefitsManager(false)
          }}
        />
      )}
    </div>
  )
}

// Tab Components
function PersonalInfoTab({ formData, errors, onChange }) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin cá nhân</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            Họ và tên (IN HOA) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`input ${errors.fullName ? 'border-red-500' : ''}`}
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value.toUpperCase())}
            placeholder="NGUYỄN VĂN A"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="label">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className={`input ${errors.birthDate ? 'border-red-500' : ''}`}
            value={formData.birthDate}
            onChange={(e) => onChange('birthDate', e.target.value)}
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
          )}
        </div>

        <div>
          <label className="label">Nơi sinh</label>
          <input
            type="text"
            className="input"
            value={formData.birthPlace}
            onChange={(e) => onChange('birthPlace', e.target.value)}
            placeholder="Hà Nội"
          />
        </div>

        <div>
          <label className="label">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <select
            className={`input ${errors.gender ? 'border-red-500' : ''}`}
            value={formData.gender}
            onChange={(e) => onChange('gender', e.target.value)}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>

        <div>
          <label className="label">
            Số CCCD <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`input ${errors.cccdNumber ? 'border-red-500' : ''}`}
            value={formData.cccdNumber}
            onChange={(e) => onChange('cccdNumber', e.target.value)}
            placeholder="001234567890"
          />
          {errors.cccdNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cccdNumber}</p>
          )}
        </div>

        <div>
          <label className="label">
            Ngày cấp CCCD <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className={`input ${errors.cccdIssueDate ? 'border-red-500' : ''}`}
            value={formData.cccdIssueDate}
            onChange={(e) => onChange('cccdIssueDate', e.target.value)}
          />
          {errors.cccdIssueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.cccdIssueDate}</p>
          )}
        </div>

        <div>
          <label className="label">
            Nơi cấp CCCD <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`input ${errors.cccdIssuePlace ? 'border-red-500' : ''}`}
            value={formData.cccdIssuePlace}
            onChange={(e) => onChange('cccdIssuePlace', e.target.value)}
            placeholder="Cục Cảnh sát QLHC về TTXH"
          />
          {errors.cccdIssuePlace && (
            <p className="mt-1 text-sm text-red-600">{errors.cccdIssuePlace}</p>
          )}
        </div>

        <div>
          <label className="label">Tình trạng hôn nhân</label>
          <select
            className="input"
            value={formData.maritalStatus}
            onChange={(e) => onChange('maritalStatus', e.target.value)}
          >
            <option value="">Chọn tình trạng</option>
            <option value="Độc thân">Độc thân</option>
            <option value="Đã kết hôn">Đã kết hôn</option>
            <option value="Ly hôn">Ly hôn</option>
            <option value="Góa">Góa</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-4">Upload ảnh CCCD (2 mặt)</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label mb-2">Mặt trước CCCD</label>
            <FileUpload
              category="cccd_front"
              employeeId={formData.employeeCode || 'temp_' + Date.now()}
              existingFiles={[]} // Will be loaded from props later
              onFilesChange={(files) => {
                // Handle file change
                console.log('CCCD front files:', files)
              }}
              multiple={false}
              accept="image/*"
              maxFiles={1}
            />
          </div>
          <div>
            <label className="label mb-2">Mặt sau CCCD</label>
            <FileUpload
              category="cccd_back"
              employeeId={formData.employeeCode || 'temp_' + Date.now()}
              existingFiles={[]} // Will be loaded from props later
              onFilesChange={(files) => {
                // Handle file change
                console.log('CCCD back files:', files)
              }}
              multiple={false}
              accept="image/*"
              maxFiles={1}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactInfoTab({ formData, errors, onChange }) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            Số điện thoại cá nhân <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className={`input ${errors.personalPhone ? 'border-red-500' : ''}`}
            value={formData.personalPhone}
            onChange={(e) => onChange('personalPhone', e.target.value)}
            placeholder="0901234567"
          />
          {errors.personalPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.personalPhone}</p>
          )}
        </div>

        <div>
          <label className="label">
            Email cá nhân <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={`input ${errors.personalEmail ? 'border-red-500' : ''}`}
            value={formData.personalEmail}
            onChange={(e) => onChange('personalEmail', e.target.value)}
            placeholder="nguyenvana@gmail.com"
          />
          {errors.personalEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.personalEmail}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="label">
            Địa chỉ tạm trú <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`input ${errors.temporaryAddress ? 'border-red-500' : ''}`}
            value={formData.temporaryAddress}
            onChange={(e) => onChange('temporaryAddress', e.target.value)}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            rows={3}
          />
          {errors.temporaryAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.temporaryAddress}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="label">
            Địa chỉ thường trú <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`input ${errors.permanentAddress ? 'border-red-500' : ''}`}
            value={formData.permanentAddress}
            onChange={(e) => onChange('permanentAddress', e.target.value)}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            rows={3}
          />
          {errors.permanentAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.permanentAddress}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function EmergencyContactTab({ formData, errors, onChange }) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ khẩn cấp</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            Họ tên người liên hệ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`input ${errors.emergencyContactName ? 'border-red-500' : ''}`}
            value={formData.emergencyContactName}
            onChange={(e) => onChange('emergencyContactName', e.target.value)}
            placeholder="Nguyễn Văn B"
          />
          {errors.emergencyContactName && (
            <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName}</p>
          )}
        </div>

        <div>
          <label className="label">Quan hệ</label>
          <select
            className="input"
            value={formData.emergencyContactRelation}
            onChange={(e) => onChange('emergencyContactRelation', e.target.value)}
          >
            <option value="">Chọn quan hệ</option>
            <option value="Cha">Cha</option>
            <option value="Mẹ">Mẹ</option>
            <option value="Vợ/Chồng">Vợ/Chồng</option>
            <option value="Anh/Em">Anh/Em</option>
            <option value="Con">Con</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div>
          <label className="label">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className={`input ${errors.emergencyContactPhone ? 'border-red-500' : ''}`}
            value={formData.emergencyContactPhone}
            onChange={(e) => onChange('emergencyContactPhone', e.target.value)}
            placeholder="0901234568"
          />
          {errors.emergencyContactPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function EducationTab({ formData, errors, onChange }) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin học vấn</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Bằng cấp cao nhất</label>
          <select
            className="input"
            value={formData.highestDegree}
            onChange={(e) => onChange('highestDegree', e.target.value)}
          >
            <option value="">Chọn bằng cấp</option>
            <option value="THPT">Trung học phổ thông</option>
            <option value="Cao đẳng">Cao đẳng</option>
            <option value="Đại học">Đại học</option>
            <option value="Thạc sĩ">Thạc sĩ</option>
            <option value="Tiến sĩ">Tiến sĩ</option>
          </select>
        </div>

        <div>
          <label className="label">Tên trường cấp bằng</label>
          <input
            type="text"
            className="input"
            value={formData.university}
            onChange={(e) => onChange('university', e.target.value)}
            placeholder="Đại học Bách Khoa Hà Nội"
          />
        </div>

        <div>
          <label className="label">Chuyên ngành</label>
          <input
            type="text"
            className="input"
            value={formData.major}
            onChange={(e) => onChange('major', e.target.value)}
            placeholder="Công nghệ thông tin"
          />
        </div>

        <div>
          <label className="label">Chứng chỉ khác</label>
          <textarea
            className="input"
            value={formData.otherCertificates}
            onChange={(e) => onChange('otherCertificates', e.target.value)}
            placeholder="AWS, Google Cloud, TOEIC..."
            rows={3}
          />
        </div>

        <div>
          <label className="label">Ngôn ngữ</label>
          <input
            type="text"
            className="input"
            value={formData.languages}
            onChange={(e) => onChange('languages', e.target.value)}
            placeholder="Tiếng Anh, Tiếng Nhật"
          />
        </div>

        <div>
          <label className="label">Trình độ ngôn ngữ</label>
          <input
            type="text"
            className="input"
            value={formData.languageLevel}
            onChange={(e) => onChange('languageLevel', e.target.value)}
            placeholder="TOEIC 650, N3"
          />
        </div>
      </div>
    </div>
  )
}

function TaxInfoTab({ formData, errors, onChange }) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin Thuế & BHXH</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Mã BHXH (nếu có)</label>
          <input
            type="text"
            className={`input ${errors.socialInsuranceCode ? 'border-red-500' : ''}`}
            value={formData.socialInsuranceCode}
            onChange={(e) => onChange('socialInsuranceCode', e.target.value)}
            placeholder="HN12345678"
          />
          {errors.socialInsuranceCode && (
            <p className="mt-1 text-sm text-red-600">{errors.socialInsuranceCode}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Định dạng: 2 chữ cái + 8 chữ số</p>
        </div>

        <div>
          <label className="label">Mã số thuế (nếu có)</label>
          <input
            type="text"
            className={`input ${errors.taxCode ? 'border-red-500' : ''}`}
            value={formData.taxCode}
            onChange={(e) => onChange('taxCode', e.target.value)}
            placeholder="1234567890"
          />
          {errors.taxCode && (
            <p className="mt-1 text-sm text-red-600">{errors.taxCode}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">10 chữ số</p>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h5 className="font-medium text-yellow-900 mb-2">Lưu ý</h5>
        <p className="text-sm text-yellow-700">
          Mã BHXH và mã số thuế là tùy chọn khi tạo hồ sơ mới. Có thể cập nhật sau khi nhân viên cung cấp.
        </p>
      </div>
    </div>
  )
}

function WorkInfoTab({ formData, errors, onChange, departments }) {
  // Auto calculate end date when start date and duration change
  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration) return ''
    
    const start = new Date(startDate)
    const months = parseInt(duration)
    if (isNaN(months)) return ''
    
    const end = new Date(start)
    end.setMonth(end.getMonth() + months)
    return end.toISOString().split('T')[0]
  }

  const handleStartDateChange = (value) => {
    onChange('startDate', value)
    if (formData.contractDuration) {
      const endDate = calculateEndDate(value, formData.contractDuration)
      onChange('endDate', endDate)
    }
  }

  const handleDurationChange = (value) => {
    onChange('contractDuration', value)
    if (formData.startDate) {
      const endDate = calculateEndDate(formData.startDate, value)
      onChange('endDate', endDate)
    }
  }

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin công việc</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            Phòng ban <span className="text-red-500">*</span>
          </label>
          <select
            className={`input ${errors.department ? 'border-red-500' : ''}`}
            value={formData.department}
            onChange={(e) => onChange('department', e.target.value)}
          >
            <option value="">Chọn phòng ban</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="label">
            Vị trí <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`input ${errors.position ? 'border-red-500' : ''}`}
            value={formData.position}
            onChange={(e) => onChange('position', e.target.value)}
            placeholder="Senior Developer"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position}</p>
          )}
        </div>

        <div>
          <label className="label">Cấp bậc</label>
          <select
            className="input"
            value={formData.level}
            onChange={(e) => onChange('level', e.target.value)}
          >
            <option value="">Chọn cấp bậc</option>
            <option value="Nhân viên">Nhân viên</option>
            <option value="Chuyên viên">Chuyên viên</option>
            <option value="Chuyên viên chính">Chuyên viên chính</option>
            <option value="Trưởng nhóm">Trưởng nhóm</option>
            <option value="Phó phòng">Phó phòng</option>
            <option value="Trưởng phòng">Trưởng phòng</option>
            <option value="Giám đốc">Giám đốc</option>
          </select>
        </div>

        <div>
          <label className="label">Chức danh</label>
          <input
            type="text"
            className="input"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Kỹ sư phần mềm cấp cao"
          />
        </div>

        <div>
          <label className="label">
            Loại hợp đồng <span className="text-red-500">*</span>
          </label>
          <select
            className={`input ${errors.contractType ? 'border-red-500' : ''}`}
            value={formData.contractType}
            onChange={(e) => onChange('contractType', e.target.value)}
          >
            <option value="">Chọn loại hợp đồng</option>
            <option value="Thử việc">Hợp đồng thử việc</option>
            <option value="Có thời hạn">Hợp đồng có thời hạn</option>
            <option value="Không thời hạn">Hợp đồng không thời hạn</option>
            <option value="Theo dự án">Hợp đồng theo dự án</option>
          </select>
          {errors.contractType && (
            <p className="mt-1 text-sm text-red-600">{errors.contractType}</p>
          )}
        </div>

        <div>
          <label className="label">
            Ngày bắt đầu <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className={`input ${errors.startDate ? 'border-red-500' : ''}`}
            value={formData.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="label">
            Thời gian (tháng) <span className="text-red-500">*</span>
          </label>
          <select
            className={`input ${errors.contractDuration ? 'border-red-500' : ''}`}
            value={formData.contractDuration}
            onChange={(e) => handleDurationChange(e.target.value)}
          >
            <option value="">Chọn thời gian</option>
            <option value="2">2 tháng (thử việc)</option>
            <option value="6">6 tháng</option>
            <option value="12">12 tháng</option>
            <option value="24">24 tháng</option>
            <option value="36">36 tháng</option>
            <option value="60">60 tháng</option>
            <option value="999">Không thời hạn</option>
          </select>
          {errors.contractDuration && (
            <p className="mt-1 text-sm text-red-600">{errors.contractDuration}</p>
          )}
        </div>

        <div>
          <label className="label">Ngày kết thúc (tự động)</label>
          <input
            type="date"
            className="input bg-gray-50"
            value={formData.endDate}
            readOnly
          />
        </div>

        <div>
          <label className="label">Lương thử việc (VNĐ)</label>
          <input
            type="number"
            className="input"
            value={formData.probationSalary}
            onChange={(e) => onChange('probationSalary', e.target.value)}
            placeholder="8000000"
          />
        </div>

        <div>
          <label className="label">Lương chính thức (VNĐ)</label>
          <input
            type="number"
            className="input"
            value={formData.officialSalary}
            onChange={(e) => onChange('officialSalary', e.target.value)}
            placeholder="12000000"
          />
        </div>
      </div>
    </div>
  )
}

function BenefitsTab({ formData, errors, onChange, isHR = false, onOpenBenefits, hasEmployee }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900">Phúc lợi & Thưởng</h4>
        {isHR && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className={`btn-outline flex items-center space-x-2 ${!hasEmployee ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (!hasEmployee) return
                onOpenBenefits && onOpenBenefits()
              }}
              title={hasEmployee ? 'Tạo phúc lợi riêng cho nhân viên' : 'Vui lòng lưu nhân viên trước để tạo phúc lợi'}
            >
              <Gift className="h-4 w-4" />
              <span>Tạo phúc lợi riêng</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Phụ cấp xăng xe (VNĐ/tháng)</label>
          <input
            type="number"
            className="input"
            value={formData.fuelAllowance}
            onChange={(e) => onChange('fuelAllowance', e.target.value)}
            placeholder="500000"
          />
        </div>

        <div>
          <label className="label">Phụ cấp ăn uống (VNĐ/tháng)</label>
          <input
            type="number"
            className="input"
            value={formData.mealAllowance}
            onChange={(e) => onChange('mealAllowance', e.target.value)}
            placeholder="800000"
          />
        </div>

        <div>
          <label className="label">Phụ cấp đi lại (VNĐ/tháng)</label>
          <input
            type="number"
            className="input"
            value={formData.transportAllowance}
            onChange={(e) => onChange('transportAllowance', e.target.value)}
            placeholder="300000"
          />
        </div>

        <div>
          <label className="label">Phụ cấp đồng phục (VNĐ/năm)</label>
          <input
            type="number"
            className="input"
            value={formData.uniformAllowance}
            onChange={(e) => onChange('uniformAllowance', e.target.value)}
            placeholder="1000000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Thưởng hiệu quả công việc (%)</label>
          <input
            type="number"
            className="input"
            value={formData.performanceBonus}
            onChange={(e) => onChange('performanceBonus', e.target.value)}
            placeholder="10"
            min="0"
            max="100"
          />
          <p className="mt-1 text-xs text-gray-500">Tỷ lệ % trên lương cơ bản</p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h5 className="font-medium text-green-900 mb-2">Tổng phúc lợi dự kiến/tháng</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-green-700">Xăng xe:</span>
            <p className="font-medium">{(formData.fuelAllowance || 0).toLocaleString()} VNĐ</p>
          </div>
          <div>
            <span className="text-green-700">Ăn uống:</span>
            <p className="font-medium">{(formData.mealAllowance || 0).toLocaleString()} VNĐ</p>
          </div>
          <div>
            <span className="text-green-700">Đi lại:</span>
            <p className="font-medium">{(formData.transportAllowance || 0).toLocaleString()} VNĐ</p>
          </div>
          <div>
            <span className="text-green-700">Tổng:</span>
            <p className="font-bold">
              {((parseInt(formData.fuelAllowance) || 0) + 
                (parseInt(formData.mealAllowance) || 0) + 
                (parseInt(formData.transportAllowance) || 0)).toLocaleString()} VNĐ
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentsTab({ employeeFiles, setEmployeeFiles, employeeId }) {
  const handleFilesChange = (category, files) => {
    setEmployeeFiles(prev => ({
      ...prev,
      [category]: files
    }))
  }

  const documentCategories = [
    { id: 'contract', name: 'Hợp đồng lao động', accept: '.pdf,.doc,.docx' },
    { id: 'degree', name: 'Bằng cấp', accept: 'image/*,.pdf' },
    { id: 'certificate', name: 'Chứng chỉ', accept: 'image/*,.pdf' },
    { id: 'health', name: 'Giấy khám sức khỏe', accept: 'image/*,.pdf' },
    { id: 'insurance', name: 'Bảo hiểm', accept: 'image/*,.pdf' },
    { id: 'other', name: 'Tài liệu khác', accept: 'image/*,.pdf,.doc,.docx' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">Quản lý tài liệu nhân viên</h4>
        <p className="text-sm text-gray-600 mb-6">
          Upload và quản lý các tài liệu liên quan đến nhân viên. Hỗ trợ định dạng: JPG, PNG, PDF, DOC, DOCX.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {documentCategories.map((category) => (
          <div key={category.id} className="space-y-4">
            <h5 className="font-medium text-gray-900 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              {category.name}
            </h5>
            
            <FileUpload
              category={category.id}
              employeeId={employeeId || 'temp_' + Date.now()}
              existingFiles={employeeFiles[category.id] || []}
              onFilesChange={(files) => handleFilesChange(category.id, files)}
              multiple={true}
              accept={category.accept}
              maxFiles={5}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-3">Lưu ý quan trọng</h5>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Kích thước file tối đa: 5MB</li>
          <li>• Định dạng được hỗ trợ: JPG, PNG, GIF, PDF, DOC, DOCX</li>
          <li>• Mỗi loại tài liệu có thể upload tối đa 5 file</li>
          <li>• Tài liệu được mã hóa và lưu trữ an toàn</li>
          <li>• Chỉ người có quyền mới có thể xem và tải xuống</li>
        </ul>
      </div>
    </div>
  )
}
