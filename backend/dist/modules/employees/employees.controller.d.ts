import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { CreateBenefitDto } from './dto/create-benefit.dto';
export declare class EmployeesController {
    private readonly service;
    constructor(service: EmployeesService);
    list(query: QueryEmployeeDto): Promise<{
        data: any[];
        page: any;
        pageSize: any;
        total: number;
    }>;
    me(req: any): Promise<{
        id: string;
        employeeCode: string;
        fullName: string;
        email: string;
        phone: string;
        department: string;
        position: string;
        joinDate: string;
        status: string;
        officialSalary: number;
    }>;
    get(id: string): Promise<any>;
    create(dto: CreateEmployeeDto): Promise<any>;
    update(id: string, dto: UpdateEmployeeDto): Promise<any>;
    remove(id: string): Promise<any>;
    terminate(id: string, body: {
        date: string;
        reason?: string;
    }): Promise<any>;
    listPositions(id: string, activeOnly?: string): Promise<any>;
    addPosition(id: string, dto: CreatePositionDto): Promise<any>;
    updatePosition(id: string, positionId: string, dto: CreatePositionDto): Promise<any>;
    deletePosition(id: string, positionId: string): Promise<{
        success: boolean;
    }>;
    listSalaries(id: string): Promise<any>;
    currentSalary(id: string): Promise<any>;
    addSalary(id: string, dto: CreateSalaryDto): Promise<any>;
    updateSalary(id: string, salaryId: string, dto: CreateSalaryDto): Promise<any>;
    deleteSalary(id: string, salaryId: string): Promise<{
        success: boolean;
    }>;
    listBenefits(id: string): Promise<any>;
    addBenefit(id: string, dto: CreateBenefitDto): Promise<any>;
    updateBenefit(id: string, benefitId: string, dto: CreateBenefitDto): Promise<any>;
    deleteBenefit(id: string, benefitId: string): Promise<{
        success: boolean;
    }>;
    listContacts(id: string): Promise<any>;
    addContact(id: string, body: {
        contactName: string;
        relationship?: string;
        phone?: string;
    }): Promise<any>;
    deleteContact(id: string, contactId: string): Promise<{
        success: boolean;
    }>;
    listDocuments(id: string): Promise<any>;
    addDocument(id: string, body: {
        docType: string;
        filePath?: string;
        issueDate?: string;
        expiryDate?: string;
    }): Promise<any>;
    deleteDocument(id: string, docId: string): Promise<{
        success: boolean;
    }>;
}
