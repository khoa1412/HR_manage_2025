import { useState } from 'react';
import { Settings } from 'lucide-react';
import { formatNumber } from '../../services/payrollService';

export default function EmployeeSalaryList({ employees, departments, onOpenModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (emp.code && emp.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-900">Danh sách lương nhân viên</h4>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-64"
          />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="input"
          >
            <option value="">Tất cả phòng ban</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chức vụ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lương cơ bản (VND)</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map(employee => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">{employee.fullName}</div>
                  <div className="text-gray-500">{employee.code}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{employee.department}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{employee.position}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatNumber(employee.officialSalary || 0)}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  <button
                    onClick={() => onOpenModal(employee)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Cài đặt lương"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
