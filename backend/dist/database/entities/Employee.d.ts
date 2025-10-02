export interface Department {
    department_id: number;
    name: string;
    manager_id?: number;
    parent_id?: number;
    budget?: number;
    created_at: Date;
    updated_at: Date;
}
export interface Employee {
    employee_id: number;
    employee_code: string;
    full_name: string;
    email: string;
    phone?: string;
    dob?: Date;
    birth_place?: string;
    gender?: string;
    cccd_number?: string;
    cccd_issue_date?: Date;
    cccd_issue_place?: string;
    marital_status?: string;
    personal_phone?: string;
    personal_email?: string;
    temporary_address?: string;
    permanent_address?: string;
    emergency_contact_name?: string;
    emergency_contact_relation?: string;
    emergency_contact_phone?: string;
    highest_degree?: string;
    university?: string;
    major?: string;
    other_certificates?: string;
    languages?: string;
    language_level?: string;
    social_insurance_code?: string;
    tax_code?: string;
    department?: string;
    position?: string;
    level?: string;
    title?: string;
    contract_type?: string;
    start_date?: Date;
    contract_duration?: string;
    end_date?: Date;
    probation_salary?: number;
    official_salary?: number;
    fuel_allowance?: number;
    meal_allowance?: number;
    transport_allowance?: number;
    uniform_allowance?: number;
    performance_bonus?: number;
    hire_date: Date;
    join_date?: Date;
    status: 'Active' | 'Inactive' | 'Probation' | 'Terminated';
    department_id?: number;
    created_at: Date;
    updated_at: Date;
}
export interface EmployeePosition {
    position_id: number;
    employee_id: number;
    title: string;
    start_date: Date;
    end_date?: Date;
    created_at: Date;
}
export interface EmployeeSalary {
    salary_id: number;
    employee_id: number;
    base_salary: number;
    effective_date: Date;
    end_date?: Date;
    notes?: string;
    created_at: Date;
}
export interface EmployeePayrollComponent {
    component_id: number;
    employee_id: number;
    salary_id?: number;
    component_type: 'allowance' | 'bonus' | 'insurance' | 'tax' | 'deduction' | 'other';
    amount: number;
    description?: string;
    created_at: Date;
}
export interface BenefitType {
    type_id: number;
    name: string;
    type: 'allowance' | 'bonus' | 'insurance' | 'benefit' | 'reimbursement';
    category?: string;
    unit?: string;
    description?: string;
    is_custom: boolean;
    created_at: Date;
}
export interface EmployeeBenefit {
    benefit_id: number;
    employee_id: number;
    type_id: number;
    amount?: number;
    start_date: Date;
    end_date?: Date;
    is_active: boolean;
    notes?: string;
    created_at: Date;
}
export interface EmployeeContact {
    contact_id: number;
    employee_id: number;
    contact_name?: string;
    relationship?: string;
    phone?: string;
    created_at: Date;
}
export interface EmployeeDocument {
    doc_id: number;
    employee_id: number;
    doc_type: 'contract' | 'appointment' | 'certificate' | 'other';
    file_path?: string;
    issue_date?: Date;
    expiry_date?: Date;
    created_at: Date;
}
export interface AuthUser {
    user_id: number;
    employee_id?: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'hr' | 'employee';
    last_login?: Date;
    created_at: Date;
    updated_at: Date;
}
export interface EmployeeApiResponse {
    id: string;
    employeeCode: string;
    fullName: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
    joinDate?: Date;
    status: string;
    officialSalary?: number;
}
export interface CurrentPosition {
    employee_id: number;
    position: string;
    start_date: Date;
    end_date?: Date;
}
