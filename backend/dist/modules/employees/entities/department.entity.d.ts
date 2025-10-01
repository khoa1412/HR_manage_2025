import { EmployeeEntity } from './employee.entity';
export declare class Department {
    departmentId: string;
    name: string;
    managerId?: string;
    parentId?: string;
    budget?: string;
    createdAt: Date;
    updatedAt: Date;
    employees?: EmployeeEntity[];
}
