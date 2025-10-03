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
    temporaryAddress?: string;
    permanentAddress?: string;
    emergencyContactName?: string;
    emergencyContactRelation?: string;
    emergencyContactPhone?: string;
    highestDegree?: string;
    university?: string;
    major?: string;
    otherCertificates?: string;
    languages?: string;
    languageLevel?: string;
    socialInsuranceCode?: string;
    taxCode?: string;
    status?: 'Active' | 'Inactive' | 'Probation' | 'Terminated';
}
