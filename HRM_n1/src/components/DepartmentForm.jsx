import { useState, useEffect } from 'react';

export default function DepartmentForm({
  isOpen,
  onClose,
  onSubmit,
  editingDepartment,
  employees = [],
  saving,
  departments = []
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    leaderId: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editingDepartment) {
        setFormData({
          name: editingDepartment.name || '',
          code: editingDepartment.code || '',
          description: editingDepartment.description || '',
          leaderId: editingDepartment.leaderId || ''
        });
      } else {
        setFormData({ name: '', code: '', description: '', leaderId: '' });
      }
      setFormErrors({});
    }
  }, [isOpen, editingDepartment]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Tên phòng ban là bắt buộc';
    }
    
    if (!formData.code.trim()) {
      errors.code = 'Mã phòng ban là bắt buộc';
    } else if (!/^[A-Z0-9]+$/.test(formData.code.trim())) {
      errors.code = 'Mã phòng ban chỉ được chứa chữ hoa và số';
    }
    
    const existingDept = departments.find(dept => 
      dept.code === formData.code.trim() && 
      (!editingDepartment || dept.id !== editingDepartment.id)
    );
    if (existingDept) {
      errors.code = 'Mã phòng ban đã tồn tại';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'code') {
      processedValue = value.toUpperCase();
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingDepartment ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              Tên phòng ban <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${formErrors.name ? 'border-red-500' : ''}`}
              placeholder="VD: Phòng Nhân sự"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label className="label">
              Mã phòng ban <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`input ${formErrors.code ? 'border-red-500' : ''}`}
              placeholder="VD: HR, IT, SALES"
            />
            {formErrors.code && (
              <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
            )}
          </div>
          
          <div>
            <label className="label">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="3"
            />
          </div>
          
          <div>
            <label className="label">Trưởng phòng</label>
            <select 
              name="leaderId" 
              className="input" 
              value={formData.leaderId}
              onChange={handleChange}
            >
              <option value="">Chọn trưởng phòng</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </div>
          
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
              {saving ? 'Đang lưu...' : (editingDepartment ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
