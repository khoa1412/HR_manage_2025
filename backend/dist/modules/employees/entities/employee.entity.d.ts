import { Department } from './department.entity';
export declare class EmployeeEntity {
    employeeId: string;
    employeeCode: string;
    fullName: string;
    email: string;
    phone?: string;
    dob?: string;
    gender?: string;
    hireDate: string;
    joinDate?: string;
    status: 'Active' | 'Inactive' | 'Probation' | 'Terminated';
    departmentId?: string;
    officialSalary?: string;
    createdAt: Date;
    updatedAt: Date;
    department?: Department;
}
