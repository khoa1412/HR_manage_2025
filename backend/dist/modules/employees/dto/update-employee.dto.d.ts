export declare class UpdateEmployeeDto {
    employeeCode?: string;
    fullName?: string;
    dob?: string;
    birthPlace?: string;
    gender?: 'male' | 'female' | 'other';
    cccdNumber?: string;
    cccdIssueDate?: string;
    cccdIssuePlace?: string;
    maritalStatus?: string;
    status?: 'Active' | 'Inactive' | 'Probation' | 'Terminated';
}
