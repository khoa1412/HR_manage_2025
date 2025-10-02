import { PrismaService } from '../../database/prisma.service';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { Prisma } from '../../../generated/prisma';
export declare class EmployeesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: QueryEmployeeDto): Promise<{
        items: {
            id: string;
            employeeCode: string;
            fullName: string;
            email: string;
            phone: string;
            joinDate: Date;
            status: import("../../../generated/prisma").$Enums.employment_status_enum;
            department: string;
            position: string;
        }[];
        total: number;
        page: any;
        pageSize: any;
        totalPages: number;
    }>;
    findDetailById(id: string): Promise<{
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
        probationSalary: Prisma.Decimal;
        officialSalary: Prisma.Decimal;
        fuelAllowance: Prisma.Decimal;
        mealAllowance: Prisma.Decimal;
        transportAllowance: Prisma.Decimal;
        uniformAllowance: Prisma.Decimal;
        performanceBonus: Prisma.Decimal;
        hireDate: Date;
        joinDate: Date;
        status: import("../../../generated/prisma").$Enums.employment_status_enum;
        departmentId: string;
        benefits: {
            id: string;
            type: string;
            amount: Prisma.Decimal;
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
    findBasicById(id: string): Promise<{
        id: string;
        employeeCode: string;
        fullName: string;
        email: string;
        status: import("../../../generated/prisma").$Enums.employment_status_enum;
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
        probationSalary: Prisma.Decimal;
        officialSalary: Prisma.Decimal;
        fuelAllowance: Prisma.Decimal;
        mealAllowance: Prisma.Decimal;
        transportAllowance: Prisma.Decimal;
        uniformAllowance: Prisma.Decimal;
        performanceBonus: Prisma.Decimal;
        hireDate: Date;
        joinDate: Date;
        status: import("../../../generated/prisma").$Enums.employment_status_enum;
        departmentId: string;
        benefits: {
            id: string;
            type: string;
            amount: Prisma.Decimal;
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
        probationSalary: Prisma.Decimal;
        officialSalary: Prisma.Decimal;
        fuelAllowance: Prisma.Decimal;
        mealAllowance: Prisma.Decimal;
        transportAllowance: Prisma.Decimal;
        uniformAllowance: Prisma.Decimal;
        performanceBonus: Prisma.Decimal;
        hireDate: Date;
        joinDate: Date;
        status: import("../../../generated/prisma").$Enums.employment_status_enum;
        departmentId: string;
        benefits: {
            id: string;
            type: string;
            amount: Prisma.Decimal;
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
    delete(id: string): Promise<{
        success: boolean;
    }>;
    remove(id: string, hard?: boolean): Promise<{
        success: boolean;
    }>;
    terminate(id: string, body: any): Promise<{
        success: boolean;
    }>;
    listPositions(id: string, activeOnly?: boolean): Promise<any[]>;
    addPosition(employeeId: string, dto: CreatePositionDto): Promise<{
        success: boolean;
    }>;
    updatePosition(employeeId: string, positionId: string, dto: Partial<CreatePositionDto>): Promise<{
        success: boolean;
    }>;
    deletePosition(id: string, positionId: string): Promise<{
        success: boolean;
    }>;
    listSalaries(id: string): Promise<{
        id: string;
        baseSalary: Prisma.Decimal;
        fuelAllowance: Prisma.Decimal;
        mealAllowance: Prisma.Decimal;
        transportAllowance: Prisma.Decimal;
        uniformAllowance: Prisma.Decimal;
        performanceBonus: Prisma.Decimal;
        effectiveDate: Date;
        isActive: boolean;
    }[]>;
    addSalary(employeeId: string, dto: CreateSalaryDto): Promise<{
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
        baseSalary: Prisma.Decimal;
        fuelAllowance: Prisma.Decimal;
        mealAllowance: Prisma.Decimal;
        transportAllowance: Prisma.Decimal;
        uniformAllowance: Prisma.Decimal;
        performanceBonus: Prisma.Decimal;
        effectiveDate: Date;
        isActive: boolean;
    }>;
    listBenefits(id: string): Promise<{
        id: string;
        type: string;
        amount: Prisma.Decimal;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        notes: string;
    }[]>;
    addBenefit(employeeId: string, dto: CreateBenefitDto): Promise<{
        id: string;
        amount: Prisma.Decimal;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        notes: string;
    }>;
    updateBenefit(id: string, benefitId: string, dto: CreateBenefitDto): Promise<{
        id: string;
        amount: Prisma.Decimal;
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
    addContact(id: string, dto: any): Promise<{
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
    addDocument(id: string, dto: any): Promise<{
        id: string;
        docType: string;
        filePath: string;
        issueDate: Date;
        expiryDate: Date;
    }>;
    deleteDocument(id: string, docId: string): Promise<{
        success: boolean;
    }>;
    getDepartments(): Promise<{
        id: string;
        name: string;
        managerId: string;
        parentId: string;
        budget: Prisma.Decimal;
    }[]>;
    getBenefitTypes(): Promise<{
        id: string;
        name: string;
        type: string;
        category: string;
        unit: string;
        description: string;
    }[]>;
}
