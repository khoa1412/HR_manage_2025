import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { formatNumber } from '../../services/payrollService';

export default function SalarySettingsModal({ employee, onClose, onSave }) {
  const [salaryStructure, setSalaryStructure] = useState({
    basicSalary: 0,
    allowances: [],
    deductions: [],
  });

  useEffect(() => {
    if (employee && employee.salaryStructure) {
      setSalaryStructure(employee.salaryStructure);
    } else if (employee) {
      // Set a default structure if none exists
      setSalaryStructure({
        basicSalary: employee.officialSalary || 0,
        allowances: [],
        deductions: [],
      });
    }
  }, [employee]);

  if (!employee) return null;

  const handleBasicSalaryChange = (e) => {
    setSalaryStructure({ ...salaryStructure, basicSalary: parseFloat(e.target.value) || 0 });
  };

  const handleAllowanceChange = (index, field, value) => {
    const newAllowances = [...salaryStructure.allowances];
    newAllowances[index][field] = value;
    setSalaryStructure({ ...salaryStructure, allowances: newAllowances });
  };
  
  const addAllowance = () => {
    setSalaryStructure({
      ...salaryStructure,
      allowances: [...salaryStructure.allowances, { name: '', amount: 0 }],
    });
  };

  const removeAllowance = (index) => {
    const newAllowances = salaryStructure.allowances.filter((_, i) => i !== index);
    setSalaryStructure({ ...salaryStructure, allowances: newAllowances });
  };

  const handleSave = () => {
    // Consolidate the officialSalary with the basicSalary from the structure
    const updatedEmployeeData = {
      ...employee,
      officialSalary: salaryStructure.basicSalary,
      salaryStructure,
    };
    onSave(updatedEmployeeData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Cài đặt lương - {employee.fullName}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Salary */}
          <div>
            <label className="label font-semibold">Lương cơ bản (VND)</label>
            <input
              type="number"
              value={salaryStructure.basicSalary}
              onChange={handleBasicSalaryChange}
              className="input"
            />
          </div>

          {/* Allowances */}
          <div>
            <h4 className="font-semibold mb-2">Các khoản phụ cấp</h4>
            <div className="space-y-3">
              {salaryStructure.allowances.map((allowance, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Tên phụ cấp"
                    value={allowance.name}
                    onChange={(e) => handleAllowanceChange(index, 'name', e.target.value)}
                    className="input flex-grow"
                  />
                  <input
                    type="number"
                    placeholder="Số tiền"
                    value={allowance.amount}
                    onChange={(e) => handleAllowanceChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="input w-40"
                  />
                  <button onClick={() => removeAllowance(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addAllowance} className="btn-outline mt-3 flex items-center space-x-2 text-sm">
              <Plus size={16} />
              <span>Thêm phụ cấp</span>
            </button>
          </div>
          
          {/* Add Deductions similarly if needed */}

        </div>

        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
          <button onClick={onClose} className="btn-outline">Hủy</button>
          <button onClick={handleSave} className="btn-primary">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
}
