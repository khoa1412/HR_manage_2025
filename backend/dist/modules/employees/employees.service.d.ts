import { EmployeesRepository } from './employees.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { CreateBenefitDto } from './dto/create-benefit.dto';
export declare class EmployeesService {
    private readonly repo;
    constructor(repo: EmployeesRepository);
    list(query: QueryEmployeeDto): Promise<{
        items: {
            id: string;
            employeeCode: string;
            fullName: string;
            email: string;
            phone: string;
            joinDate: Date;
            status: import("generated/prisma").$Enums.employment_status_enum;
            department: string;
            position: string;
        }[];
        total: number;
        page: any;
        pageSize: any;
        totalPages: number;
    }>;
    getById(id: string): Promise<{
        id: string;
        employeeCode: string;
        fullName: string;
        email: string;
        phone: string;
        dob: Date;
        birthPlace: string;
        gender: string;
        cccdNumber: string;
        cccdIssueDate: Date;
        cccdIssuePlace: string;
        maritalStatus: string;
        personalPhone: string;
        personalEmail: string;
        temporaryAddress: string;
        permanentAddress: string;
        emergencyContactName: string;
        emergencyContactRelation: string;
        emergencyContactPhone: string;
        highestDegree: string;
        university: string;
        major: string;
        otherCertificates: string;
        languages: string;
        languageLevel: string;
        socialInsuranceCode: string;
        taxCode: string;
        department: string;
        position: string;
        level: string;
        title: string;
        contractType: string;
        startDate: Date;
        contractDuration: string;
        endDate: Date;
        probationSalary: import("generated/prisma/runtime/library").Decimal;
        officialSalary: import("generated/prisma/runtime/library").Decimal;
        fuelAllowance: import("generated/prisma/runtime/library").Decimal;
        mealAllowance: import("generated/prisma/runtime/library").Decimal;
        transportAllowance: import("generated/prisma/runtime/library").Decimal;
        uniformAllowance: import("generated/prisma/runtime/library").Decimal;
        performanceBonus: import("generated/prisma/runtime/library").Decimal;
        hireDate: Date;
        joinDate: Date;
        status: import("generated/prisma").$Enums.employment_status_enum;
        departmentId: string;
        benefits: {
            id: string;
            type: string;
            amount: import("generated/prisma/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            notes: string;
        }[];
        contacts: {
            id: string;
            contactName: string;
            relationship: string;
            phone: string;
        }[];
        documents: {
            id: string;
            docType: string;
            filePath: string;
            issueDate: Date;
            expiryDate: Date;
        }[];
    }>;
    create(dto: CreateEmployeeDto): Promise<{
        id: string;
        employeeCode: string;
        fullName: string;
        email: string;
        phone: string;
        dob: Date;
        birthPlace: string;
        gender: string;
        cccdNumber: string;
        cccdIssueDate: Date;
        cccdIssuePlace: string;
        maritalStatus: string;
        personalPhone: string;
        personalEmail: string;
        temporaryAddress: string;
        permanentAddress: string;
        emergencyContactName: string;
        emergencyContactRelation: string;
        emergencyContactPhone: string;
        highestDegree: string;
        university: string;
        major: string;
        otherCertificates: string;
        languages: string;
        languageLevel: string;
        socialInsuranceCode: string;
        taxCode: string;
        department: string;
        position: string;
        level: string;
        title: string;
        contractType: string;
        startDate: Date;
        contractDuration: string;
        endDate: Date;
        probationSalary: import("generated/prisma/runtime/library").Decimal;
        officialSalary: import("generated/prisma/runtime/library").Decimal;
        fuelAllowance: import("generated/prisma/runtime/library").Decimal;
        mealAllowance: import("generated/prisma/runtime/library").Decimal;
        transportAllowance: import("generated/prisma/runtime/library").Decimal;
        uniformAllowance: import("generated/prisma/runtime/library").Decimal;
        performanceBonus: import("generated/prisma/runtime/library").Decimal;
        hireDate: Date;
        joinDate: Date;
        status: import("generated/prisma").$Enums.employment_status_enum;
        departmentId: string;
        benefits: {
            id: string;
            type: string;
            amount: import("generated/prisma/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            notes: string;
        }[];
        contacts: {
            id: string;
            contactName: string;
            relationship: string;
            phone: string;
        }[];
        documents: {
            id: string;
            docType: string;
            filePath: string;
            issueDate: Date;
            expiryDate: Date;
        }[];
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        id: string;
        employeeCode: string;
        fullName: string;
        email: string;
        phone: string;
        dob: Date;
        birthPlace: string;
        gender: string;
        cccdNumber: string;
        cccdIssueDate: Date;
        cccdIssuePlace: string;
        maritalStatus: string;
        personalPhone: string;
        personalEmail: string;
        temporaryAddress: string;
        permanentAddress: string;
        emergencyContactName: string;
        emergencyContactRelation: string;
        emergencyContactPhone: string;
        highestDegree: string;
        university: string;
        major: string;
        otherCertificates: string;
        languages: string;
        languageLevel: string;
        socialInsuranceCode: string;
        taxCode: string;
        department: string;
        position: string;
        level: string;
        title: string;
        contractType: string;
        startDate: Date;
        contractDuration: string;
        endDate: Date;
        probationSalary: import("generated/prisma/runtime/library").Decimal;
        officialSalary: import("generated/prisma/runtime/library").Decimal;
        fuelAllowance: import("generated/prisma/runtime/library").Decimal;
        mealAllowance: import("generated/prisma/runtime/library").Decimal;
        transportAllowance: import("generated/prisma/runtime/library").Decimal;
        uniformAllowance: import("generated/prisma/runtime/library").Decimal;
        performanceBonus: import("generated/prisma/runtime/library").Decimal;
        hireDate: Date;
        joinDate: Date;
        status: import("generated/prisma").$Enums.employment_status_enum;
        departmentId: string;
        benefits: {
            id: string;
            type: string;
            amount: import("generated/prisma/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            notes: string;
        }[];
        contacts: {
            id: string;
            contactName: string;
            relationship: string;
            phone: string;
        }[];
        documents: {
            id: string;
            docType: string;
            filePath: string;
            issueDate: Date;
            expiryDate: Date;
        }[];
    }>;
    remove(id: string, hard: boolean): Promise<{
        success: boolean;
    }>;
    private validateDates;
    terminate(id: string, body: {
        date: string;
        reason?: string;
    }): Promise<{
        success: boolean;
    }>;
    listPositions(id: string, activeOnly: boolean): Promise<any[]>;
    addPosition(id: string, dto: CreatePositionDto): Promise<{
        success: boolean;
    }>;
    updatePosition(id: string, positionId: string, dto: CreatePositionDto): Promise<{
        success: boolean;
    }>;
    deletePosition(id: string, positionId: string): Promise<{
        success: boolean;
    }>;
    listSalaries(id: string): Promise<{
        id: string;
        baseSalary: import("generated/prisma/runtime/library").Decimal;
        fuelAllowance: import("generated/prisma/runtime/library").Decimal;
        mealAllowance: import("generated/prisma/runtime/library").Decimal;
        transportAllowance: import("generated/prisma/runtime/library").Decimal;
        uniformAllowance: import("generated/prisma/runtime/library").Decimal;
        performanceBonus: import("generated/prisma/runtime/library").Decimal;
        effectiveDate: Date;
        isActive: boolean;
    }[]>;
    addSalary(id: string, dto: CreateSalaryDto): Promise<{
        success: boolean;
    }>;
    updateSalary(id: string, salaryId: string, dto: CreateSalaryDto): Promise<{
        success: boolean;
    }>;
    deleteSalary(id: string, salaryId: string): Promise<{
        success: boolean;
    }>;
    getCurrentSalary(id: string): Promise<{
        id: string;
        baseSalary: import("generated/prisma/runtime/library").Decimal;
        fuelAllowance: import("generated/prisma/runtime/library").Decimal;
        mealAllowance: import("generated/prisma/runtime/library").Decimal;
        transportAllowance: import("generated/prisma/runtime/library").Decimal;
        uniformAllowance: import("generated/prisma/runtime/library").Decimal;
        performanceBonus: import("generated/prisma/runtime/library").Decimal;
        effectiveDate: Date;
        isActive: boolean;
    }>;
    listBenefits(id: string): Promise<{
        id: string;
        type: string;
        amount: import("generated/prisma/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        notes: string;
    }[]>;
    addBenefit(id: string, dto: CreateBenefitDto): Promise<{
        id: string;
        amount: import("generated/prisma/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        notes: string;
    }>;
    updateBenefit(id: string, benefitId: string, dto: CreateBenefitDto): Promise<{
        id: string;
        amount: import("generated/prisma/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        notes: string;
    }>;
    deleteBenefit(id: string, benefitId: string): Promise<{
        success: boolean;
    }>;
    listContacts(id: string): Promise<{
        id: string;
        contactName: string;
        relationship: string;
        phone: string;
    }[]>;
    addContact(id: string, dto: {
        contactName: string;
        relationship?: string;
        phone?: string;
    }): Promise<{
        id: string;
        contactName: string;
        relationship: string;
        phone: string;
    }>;
    deleteContact(id: string, contactId: string): Promise<{
        success: boolean;
    }>;
    listDocuments(id: string): Promise<{
        id: string;
        docType: string;
        filePath: string;
        issueDate: Date;
        expiryDate: Date;
    }[]>;
    addDocument(id: string, dto: {
        docType: string;
        filePath?: string;
        issueDate?: string;
        expiryDate?: string;
    }): Promise<{
        id: string;
        docType: string;
        filePath: string;
        issueDate: Date;
        expiryDate: Date;
    }>;
    deleteDocument(id: string, docId: string): Promise<{
        success: boolean;
    }>;
}
