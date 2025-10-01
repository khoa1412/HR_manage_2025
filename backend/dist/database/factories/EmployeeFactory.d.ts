export interface EmployeeFactoryData {
    employee_code: string;
    full_name: string;
    email: string;
    phone: string;
    dob: Date;
    gender: string;
    hire_date: Date;
    join_date: Date;
    status: 'Active' | 'Inactive' | 'Probation' | 'Terminated';
    department_id: number;
    official_salary: number;
}
export interface DepartmentFactoryData {
    name: string;
    budget: number;
}
export interface BenefitTypeFactoryData {
    name: string;
    type: 'allowance' | 'bonus' | 'insurance' | 'benefit' | 'reimbursement';
    category: string;
    unit: string;
    description: string;
    is_custom: boolean;
}
export declare class EmployeeFactory {
    static createEmployee(overrides?: Partial<EmployeeFactoryData>): EmployeeFactoryData;
    static createDepartment(overrides?: Partial<DepartmentFactoryData>): DepartmentFactoryData;
    static createBenefitType(overrides?: Partial<BenefitTypeFactoryData>): BenefitTypeFactoryData;
    static createEmployeePosition(employeeId: number, overrides?: any): any;
    static createEmployeeSalary(employeeId: number, overrides?: any): any;
    static createEmployeeBenefit(employeeId: number, typeId: number, overrides?: any): any;
    static createEmployeeContact(employeeId: number, overrides?: any): any;
    static createEmployeeDocument(employeeId: number, overrides?: any): any;
    static createAuthUser(employeeId: number, overrides?: any): any;
    static createEmployees(count: number, overrides?: Partial<EmployeeFactoryData>): EmployeeFactoryData[];
    static createDepartments(count: number, overrides?: Partial<DepartmentFactoryData>): DepartmentFactoryData[];
    static createBenefitTypes(count: number, overrides?: Partial<BenefitTypeFactoryData>): BenefitTypeFactoryData[];
}
