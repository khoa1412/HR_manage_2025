export declare class CreateEmployeeDto {
    employeeCode?: string;
    fullName: string;
    dob?: string;
    birthPlace?: string;
    gender?: 'male' | 'female' | 'other';
    cccdNumber?: string;
    cccdIssueDate?: string;
    cccdIssuePlace?: string;
    maritalStatus?: string;
    temporaryAddress?: string;
    permanentAddress?: string;
    status?: 'Active' | 'Inactive' | 'Probation' | 'Terminated';
}
