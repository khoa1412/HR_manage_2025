export declare class QueryEmployeeDto {
    q?: string;
    status?: string[];
    departmentId?: string;
    joinDateFrom?: string;
    joinDateTo?: string;
    hasPosition?: boolean;
    hasActiveBenefits?: boolean;
    page: number;
    pageSize: number;
    sort?: string;
}
