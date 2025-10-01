import { DataSource } from 'typeorm';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { CreateBenefitDto } from './dto/create-benefit.dto';
export declare class EmployeesRepository {
    private readonly ds;
    constructor(ds: DataSource);
    private applySort;
    list(query: QueryEmployeeDto): Promise<{
        data: any[];
        page: any;
        pageSize: any;
        total: number;
    }>;
    findDetailById(id: string): Promise<any>;
    create(dto: CreateEmployeeDto): Promise<any>;
    findBasicById(id: string): Promise<any>;
    update(id: string, dto: UpdateEmployeeDto): Promise<any>;
    remove(id: string, hard: boolean): Promise<any>;
    terminate(id: string, body: {
        date: string;
    }): Promise<any>;
    listPositions(id: string, activeOnly: boolean): Promise<any>;
    addPosition(id: string, dto: CreatePositionDto): Promise<any>;
    updatePosition(id: string, positionId: string, dto: CreatePositionDto): Promise<any>;
    deletePosition(id: string, positionId: string): Promise<{
        success: boolean;
    }>;
    listSalaries(id: string): Promise<any>;
    addSalary(id: string, dto: CreateSalaryDto): Promise<any>;
    updateSalary(id: string, salaryId: string, dto: CreateSalaryDto): Promise<any>;
    deleteSalary(id: string, salaryId: string): Promise<{
        success: boolean;
    }>;
    getCurrentSalary(id: string): Promise<any>;
    listBenefits(id: string): Promise<any>;
    addBenefit(id: string, dto: CreateBenefitDto): Promise<any>;
    listContacts(id: string): Promise<any>;
    addContact(id: string, dto: {
        contactName: string;
        relationship?: string;
        phone?: string;
    }): Promise<any>;
    deleteContact(id: string, contactId: string): Promise<{
        success: boolean;
    }>;
    listDocuments(id: string): Promise<any>;
    addDocument(id: string, dto: {
        docType: string;
        filePath?: string;
        issueDate?: string;
        expiryDate?: string;
    }): Promise<any>;
    deleteDocument(id: string, docId: string): Promise<{
        success: boolean;
    }>;
    updateBenefit(id: string, benefitId: string, dto: CreateBenefitDto): Promise<any>;
    deleteBenefit(id: string, benefitId: string): Promise<{
        success: boolean;
    }>;
}
