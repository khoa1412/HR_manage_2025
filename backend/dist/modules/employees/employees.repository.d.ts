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
            status: string;
            department: number;
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
        dateBirth: Date;
        placeBirth: string;
        gender: import("../../../generated/prisma").$Enums.gender_enum;
        maritalStatus: string;
        isActive: boolean;
        contact: {
            staff_code: string;
            id: number;
            temp_address: string | null;
            permant_address: string | null;
        };
        emergency_contact: {
            staff_code: string;
            id: number;
            phone_number: string | null;
            email: string | null;
            name_emergency: string | null;
            relationship: string | null;
            rela_phone: string | null;
        };
        citizen_id: {
            staff_code: string;
            id: number;
            cccd: string;
            date_issue: Date | null;
            place_issue: string | null;
            image_front_cccd: string | null;
            image_back_cccd: string | null;
        };
        tax_n_insurance: {
            staff_code: string;
            id: number;
            social_insuran: string | null;
            tax_code: string | null;
        };
        education: {
            major: string | null;
            staff_code: string;
            id: number;
            degree: string | null;
            institution: string | null;
            year: number | null;
            attachment_image: string | null;
        }[];
        certifications: {
            level: string | null;
            staff_code: string;
            id: number;
            attachment_image: string | null;
            language: string | null;
            score: Prisma.Decimal | null;
            issue_at: Date | null;
            expires_at: Date | null;
        }[];
        pos_info: {
            position: string | null;
            staff_code: string;
            id: number;
            department_id: number | null;
            effective_date: Date | null;
        }[];
        salary: {
            staff_code: string;
            id: number;
            effective_date: Date | null;
            base_salary: Prisma.Decimal;
            perform_bonus: Prisma.Decimal | null;
        }[];
        resign_info: {
            staff_code: string;
            id: number;
            leave_day: Date | null;
            items_employee: string | null;
            items_company: string | null;
            social_insuran_detach: string | null;
            terminate_decision: string | null;
            tax_withhold_paper: string | null;
        };
        contract: {
            staff_code: string;
            id: number;
            type: number | null;
            start_date: Date | null;
            end_date: Date | null;
        }[];
        insurances: {
            staff_code: string | null;
            id: number;
            month: Date;
            staff_bhxh: Prisma.Decimal | null;
            staff_bhyt: Prisma.Decimal | null;
            staff_bhtn: Prisma.Decimal | null;
            company_contribution: Prisma.Decimal | null;
            created_by: string | null;
        }[];
        tax: {
            staff_code: string;
            id: number;
            created_by: string | null;
            tax_type: string | null;
            period_type: import("../../../generated/prisma").$Enums.period_type_enum;
            amount: Prisma.Decimal | null;
            dependents: number;
            update_at: Date;
        }[];
        attendance: {
            staff_code: string;
            id: number;
            checkin: Date | null;
            checkout: Date | null;
            atten_type: import("../../../generated/prisma").$Enums.attendance_type_enum;
            leave_req_id: number | null;
        }[];
        leave_requests: {
            status: import("../../../generated/prisma").$Enums.leave_status_enum;
            staff_code: string;
            id: number;
            start_date: Date | null;
            end_date: Date | null;
            note: string | null;
            req_at: Date;
            absent_id: number | null;
        }[];
    }>;
    findBasicById(id: string): Promise<{
        id: string;
        employeeCode: string;
        fullName: string;
        status: string;
    }>;
    create(dto: CreateEmployeeDto): Promise<{
        id: string;
        employeeCode: string;
        fullName: string;
        dateBirth: Date;
        placeBirth: string;
        gender: import("../../../generated/prisma").$Enums.gender_enum;
        maritalStatus: string;
        isActive: boolean;
        contact: {
            staff_code: string;
            id: number;
            temp_address: string | null;
            permant_address: string | null;
        };
        emergency_contact: {
            staff_code: string;
            id: number;
            phone_number: string | null;
            email: string | null;
            name_emergency: string | null;
            relationship: string | null;
            rela_phone: string | null;
        };
        citizen_id: {
            staff_code: string;
            id: number;
            cccd: string;
            date_issue: Date | null;
            place_issue: string | null;
            image_front_cccd: string | null;
            image_back_cccd: string | null;
        };
        tax_n_insurance: {
            staff_code: string;
            id: number;
            social_insuran: string | null;
            tax_code: string | null;
        };
        education: {
            major: string | null;
            staff_code: string;
            id: number;
            degree: string | null;
            institution: string | null;
            year: number | null;
            attachment_image: string | null;
        }[];
        certifications: {
            level: string | null;
            staff_code: string;
            id: number;
            attachment_image: string | null;
            language: string | null;
            score: Prisma.Decimal | null;
            issue_at: Date | null;
            expires_at: Date | null;
        }[];
        pos_info: {
            position: string | null;
            staff_code: string;
            id: number;
            department_id: number | null;
            effective_date: Date | null;
        }[];
        salary: {
            staff_code: string;
            id: number;
            effective_date: Date | null;
            base_salary: Prisma.Decimal;
            perform_bonus: Prisma.Decimal | null;
        }[];
        resign_info: {
            staff_code: string;
            id: number;
            leave_day: Date | null;
            items_employee: string | null;
            items_company: string | null;
            social_insuran_detach: string | null;
            terminate_decision: string | null;
            tax_withhold_paper: string | null;
        };
        contract: {
            staff_code: string;
            id: number;
            type: number | null;
            start_date: Date | null;
            end_date: Date | null;
        }[];
        insurances: {
            staff_code: string | null;
            id: number;
            month: Date;
            staff_bhxh: Prisma.Decimal | null;
            staff_bhyt: Prisma.Decimal | null;
            staff_bhtn: Prisma.Decimal | null;
            company_contribution: Prisma.Decimal | null;
            created_by: string | null;
        }[];
        tax: {
            staff_code: string;
            id: number;
            created_by: string | null;
            tax_type: string | null;
            period_type: import("../../../generated/prisma").$Enums.period_type_enum;
            amount: Prisma.Decimal | null;
            dependents: number;
            update_at: Date;
        }[];
        attendance: {
            staff_code: string;
            id: number;
            checkin: Date | null;
            checkout: Date | null;
            atten_type: import("../../../generated/prisma").$Enums.attendance_type_enum;
            leave_req_id: number | null;
        }[];
        leave_requests: {
            status: import("../../../generated/prisma").$Enums.leave_status_enum;
            staff_code: string;
            id: number;
            start_date: Date | null;
            end_date: Date | null;
            note: string | null;
            req_at: Date;
            absent_id: number | null;
        }[];
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        id: string;
        employeeCode: string;
        fullName: string;
        dateBirth: Date;
        placeBirth: string;
        gender: import("../../../generated/prisma").$Enums.gender_enum;
        maritalStatus: string;
        isActive: boolean;
        contact: {
            staff_code: string;
            id: number;
            temp_address: string | null;
            permant_address: string | null;
        };
        emergency_contact: {
            staff_code: string;
            id: number;
            phone_number: string | null;
            email: string | null;
            name_emergency: string | null;
            relationship: string | null;
            rela_phone: string | null;
        };
        citizen_id: {
            staff_code: string;
            id: number;
            cccd: string;
            date_issue: Date | null;
            place_issue: string | null;
            image_front_cccd: string | null;
            image_back_cccd: string | null;
        };
        tax_n_insurance: {
            staff_code: string;
            id: number;
            social_insuran: string | null;
            tax_code: string | null;
        };
        education: {
            major: string | null;
            staff_code: string;
            id: number;
            degree: string | null;
            institution: string | null;
            year: number | null;
            attachment_image: string | null;
        }[];
        certifications: {
            level: string | null;
            staff_code: string;
            id: number;
            attachment_image: string | null;
            language: string | null;
            score: Prisma.Decimal | null;
            issue_at: Date | null;
            expires_at: Date | null;
        }[];
        pos_info: {
            position: string | null;
            staff_code: string;
            id: number;
            department_id: number | null;
            effective_date: Date | null;
        }[];
        salary: {
            staff_code: string;
            id: number;
            effective_date: Date | null;
            base_salary: Prisma.Decimal;
            perform_bonus: Prisma.Decimal | null;
        }[];
        resign_info: {
            staff_code: string;
            id: number;
            leave_day: Date | null;
            items_employee: string | null;
            items_company: string | null;
            social_insuran_detach: string | null;
            terminate_decision: string | null;
            tax_withhold_paper: string | null;
        };
        contract: {
            staff_code: string;
            id: number;
            type: number | null;
            start_date: Date | null;
            end_date: Date | null;
        }[];
        insurances: {
            staff_code: string | null;
            id: number;
            month: Date;
            staff_bhxh: Prisma.Decimal | null;
            staff_bhyt: Prisma.Decimal | null;
            staff_bhtn: Prisma.Decimal | null;
            company_contribution: Prisma.Decimal | null;
            created_by: string | null;
        }[];
        tax: {
            staff_code: string;
            id: number;
            created_by: string | null;
            tax_type: string | null;
            period_type: import("../../../generated/prisma").$Enums.period_type_enum;
            amount: Prisma.Decimal | null;
            dependents: number;
            update_at: Date;
        }[];
        attendance: {
            staff_code: string;
            id: number;
            checkin: Date | null;
            checkout: Date | null;
            atten_type: import("../../../generated/prisma").$Enums.attendance_type_enum;
            leave_req_id: number | null;
        }[];
        leave_requests: {
            status: import("../../../generated/prisma").$Enums.leave_status_enum;
            staff_code: string;
            id: number;
            start_date: Date | null;
            end_date: Date | null;
            note: string | null;
            req_at: Date;
            absent_id: number | null;
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
        staff_code: string;
        id: number;
        effective_date: Date | null;
        base_salary: Prisma.Decimal;
        perform_bonus: Prisma.Decimal | null;
    }[]>;
    addSalary(employeeId: string, dto: CreateSalaryDto): Promise<any>;
    updateSalary(id: string, salaryId: string, dto: CreateSalaryDto): Promise<{
        success: boolean;
    }>;
    deleteSalary(id: string, salaryId: string): Promise<{
        success: boolean;
    }>;
    getCurrentSalary(id: string): Promise<{
        staff_code: string;
        id: number;
        effective_date: Date | null;
        base_salary: Prisma.Decimal;
        perform_bonus: Prisma.Decimal | null;
    }>;
    listBenefits(id: string): Promise<any[]>;
    addBenefit(employeeId: string, dto: CreateBenefitDto): Promise<any>;
    updateBenefit(id: string, benefitId: string, dto: CreateBenefitDto): Promise<any>;
    deleteBenefit(id: string, benefitId: string): Promise<any>;
    listContacts(id: string): Promise<any[]>;
    addContact(id: string, dto: any): Promise<any>;
    deleteContact(id: string, contactId: string): Promise<{
        success: boolean;
    }>;
    listDocuments(id: string): Promise<any[]>;
    addDocument(id: string, dto: any): Promise<any>;
    deleteDocument(id: string, docId: string): Promise<any>;
    getDepartments(): Promise<{
        id: string;
        name: string;
    }[]>;
    getBenefitTypes(): Promise<any[]>;
}
