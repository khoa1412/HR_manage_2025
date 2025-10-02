"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let EmployeesRepository = class EmployeesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const { q, status, departmentId, joinDateFrom, joinDateTo, hasPosition, hasActiveBenefits, page = 1, pageSize = 20, sort } = query;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const where = {};
        if (q) {
            where.OR = [
                { employee_code: { contains: q, mode: 'insensitive' } },
                { full_name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (status?.length) {
            where.status = { in: status };
        }
        if (departmentId) {
            where.department_id = BigInt(departmentId);
        }
        if (joinDateFrom || joinDateTo) {
            where.join_date = {};
            if (joinDateFrom)
                where.join_date.gte = new Date(joinDateFrom);
            if (joinDateTo)
                where.join_date.lte = new Date(joinDateTo);
        }
        const orderBy = [];
        if (sort) {
            const parts = sort.split(',');
            for (const part of parts) {
                const [field, direction] = part.split(':');
                const dir = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc';
                switch (field) {
                    case 'employeeCode':
                        orderBy.push({ employee_code: dir });
                        break;
                    case 'fullName':
                        orderBy.push({ full_name: dir });
                        break;
                    case 'email':
                        orderBy.push({ email: dir });
                        break;
                    case 'joinDate':
                        orderBy.push({ join_date: dir });
                        break;
                    case 'status':
                        orderBy.push({ status: dir });
                        break;
                }
            }
        }
        if (orderBy.length === 0) {
            orderBy.push({ employee_id: 'desc' });
        }
        const [employees, total] = await Promise.all([
            this.prisma.employees.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    departments_employees_department_idTodepartments: true
                }
            }),
            this.prisma.employees.count({ where })
        ]);
        const items = employees.map(emp => ({
            id: emp.employee_id.toString(),
            employeeCode: emp.employee_code,
            fullName: emp.full_name,
            email: emp.email,
            phone: emp.phone,
            joinDate: emp.join_date,
            status: emp.status,
            department: emp.departments_employees_department_idTodepartments?.name || emp.department || null,
            position: emp.position || null,
        }));
        return {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }
    async findDetailById(id) {
        const employee = await this.prisma.employees.findUnique({
            where: { employee_id: BigInt(id) },
            include: {
                departments_employees_department_idTodepartments: true,
                employee_benefits: {
                    include: {
                        benefit_types: true
                    },
                    orderBy: { start_date: 'desc' }
                },
                employee_contacts: true,
                employee_documents: true
            }
        });
        if (!employee)
            return null;
        return {
            id: employee.employee_id.toString(),
            employeeCode: employee.employee_code,
            fullName: employee.full_name,
            email: employee.email,
            phone: employee.phone,
            dob: employee.dob,
            birthPlace: employee.birth_place,
            gender: employee.gender,
            cccdNumber: employee.cccd_number,
            cccdIssueDate: employee.cccd_issue_date,
            cccdIssuePlace: employee.cccd_issue_place,
            maritalStatus: employee.marital_status,
            personalPhone: employee.personal_phone,
            personalEmail: employee.personal_email,
            temporaryAddress: employee.temporary_address,
            permanentAddress: employee.permanent_address,
            emergencyContactName: employee.emergency_contact_name,
            emergencyContactRelation: employee.emergency_contact_relation,
            emergencyContactPhone: employee.emergency_contact_phone,
            highestDegree: employee.highest_degree,
            university: employee.university,
            major: employee.major,
            otherCertificates: employee.other_certificates,
            languages: employee.languages,
            languageLevel: employee.language_level,
            socialInsuranceCode: employee.social_insurance_code,
            taxCode: employee.tax_code,
            department: employee.department,
            position: employee.position,
            level: employee.level,
            title: employee.title,
            contractType: employee.contract_type,
            startDate: employee.start_date,
            contractDuration: employee.contract_duration,
            endDate: employee.end_date,
            probationSalary: employee.probation_salary,
            officialSalary: employee.official_salary,
            fuelAllowance: employee.fuel_allowance,
            mealAllowance: employee.meal_allowance,
            transportAllowance: employee.transport_allowance,
            uniformAllowance: employee.uniform_allowance,
            performanceBonus: employee.performance_bonus,
            hireDate: employee.hire_date,
            joinDate: employee.join_date,
            status: employee.status,
            departmentId: employee.department_id?.toString(),
            benefits: employee.employee_benefits.map(ben => ({
                id: ben.benefit_id.toString(),
                type: ben.benefit_types?.name,
                amount: ben.amount,
                startDate: ben.start_date,
                endDate: ben.end_date,
                isActive: ben.is_active,
                notes: ben.notes
            })),
            contacts: employee.employee_contacts.map(contact => ({
                id: contact.contact_id.toString(),
                contactName: contact.contact_name,
                relationship: contact.relationship,
                phone: contact.phone
            })),
            documents: employee.employee_documents.map(doc => ({
                id: doc.doc_id.toString(),
                docType: doc.doc_type,
                filePath: doc.file_path,
                issueDate: doc.issue_date,
                expiryDate: doc.expiry_date
            }))
        };
    }
    async findBasicById(id) {
        const employee = await this.prisma.employees.findUnique({
            where: { employee_id: BigInt(id) },
            select: {
                employee_id: true,
                employee_code: true,
                full_name: true,
                email: true,
                status: true
            }
        });
        if (!employee)
            return null;
        return {
            id: employee.employee_id.toString(),
            employeeCode: employee.employee_code,
            fullName: employee.full_name,
            email: employee.email,
            status: employee.status
        };
    }
    async create(dto) {
        const employee = await this.prisma.employees.create({
            data: {
                employee_code: dto.employeeCode || `EMP${Date.now()}`,
                full_name: dto.fullName,
                email: dto.email,
                phone: dto.phone,
                dob: dto.dob ? new Date(dto.dob) : null,
                birth_place: dto.birthPlace,
                gender: dto.gender,
                cccd_number: dto.cccdNumber,
                cccd_issue_date: dto.cccdIssueDate ? new Date(dto.cccdIssueDate) : null,
                cccd_issue_place: dto.cccdIssuePlace,
                marital_status: dto.maritalStatus,
                personal_phone: dto.personalPhone,
                personal_email: dto.personalEmail,
                temporary_address: dto.temporaryAddress,
                permanent_address: dto.permanentAddress,
                emergency_contact_name: dto.emergencyContactName,
                emergency_contact_relation: dto.emergencyContactRelation,
                emergency_contact_phone: dto.emergencyContactPhone,
                highest_degree: dto.highestDegree,
                university: dto.university,
                major: dto.major,
                other_certificates: dto.otherCertificates,
                languages: dto.languages,
                language_level: dto.languageLevel,
                social_insurance_code: dto.socialInsuranceCode,
                tax_code: dto.taxCode,
                department: dto.department,
                position: dto.position,
                level: dto.level,
                title: dto.title,
                contract_type: dto.contractType,
                start_date: dto.startDate ? new Date(dto.startDate) : null,
                contract_duration: dto.contractDuration,
                end_date: dto.endDate ? new Date(dto.endDate) : null,
                probation_salary: dto.probationSalary ? parseFloat(dto.probationSalary) : null,
                official_salary: dto.officialSalary ? parseFloat(dto.officialSalary) : null,
                fuel_allowance: dto.fuelAllowance ? parseFloat(dto.fuelAllowance) : null,
                meal_allowance: dto.mealAllowance ? parseFloat(dto.mealAllowance) : null,
                transport_allowance: dto.transportAllowance ? parseFloat(dto.transportAllowance) : null,
                uniform_allowance: dto.uniformAllowance ? parseFloat(dto.uniformAllowance) : null,
                performance_bonus: dto.performanceBonus ? parseFloat(dto.performanceBonus) : null,
                hire_date: dto.hireDate ? new Date(dto.hireDate) : new Date(),
                join_date: dto.joinDate ? new Date(dto.joinDate) : null,
                status: dto.status || 'Active',
                department_id: dto.departmentId ? BigInt(dto.departmentId) : null
            }
        });
        return this.findDetailById(employee.employee_id.toString());
    }
    async update(id, dto) {
        const updateData = {};
        if (dto.employeeCode !== undefined)
            updateData.employee_code = dto.employeeCode;
        if (dto.fullName !== undefined)
            updateData.full_name = dto.fullName;
        if (dto.email !== undefined)
            updateData.email = dto.email;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (dto.dob !== undefined)
            updateData.dob = dto.dob ? new Date(dto.dob) : null;
        if (dto.birthPlace !== undefined)
            updateData.birth_place = dto.birthPlace;
        if (dto.gender !== undefined)
            updateData.gender = dto.gender;
        if (dto.cccdNumber !== undefined)
            updateData.cccd_number = dto.cccdNumber;
        if (dto.cccdIssueDate !== undefined)
            updateData.cccd_issue_date = dto.cccdIssueDate ? new Date(dto.cccdIssueDate) : null;
        if (dto.cccdIssuePlace !== undefined)
            updateData.cccd_issue_place = dto.cccdIssuePlace;
        if (dto.maritalStatus !== undefined)
            updateData.marital_status = dto.maritalStatus;
        if (dto.personalPhone !== undefined)
            updateData.personal_phone = dto.personalPhone;
        if (dto.personalEmail !== undefined)
            updateData.personal_email = dto.personalEmail;
        if (dto.temporaryAddress !== undefined)
            updateData.temporary_address = dto.temporaryAddress;
        if (dto.permanentAddress !== undefined)
            updateData.permanent_address = dto.permanentAddress;
        if (dto.emergencyContactName !== undefined)
            updateData.emergency_contact_name = dto.emergencyContactName;
        if (dto.emergencyContactRelation !== undefined)
            updateData.emergency_contact_relation = dto.emergencyContactRelation;
        if (dto.emergencyContactPhone !== undefined)
            updateData.emergency_contact_phone = dto.emergencyContactPhone;
        if (dto.highestDegree !== undefined)
            updateData.highest_degree = dto.highestDegree;
        if (dto.university !== undefined)
            updateData.university = dto.university;
        if (dto.major !== undefined)
            updateData.major = dto.major;
        if (dto.otherCertificates !== undefined)
            updateData.other_certificates = dto.otherCertificates;
        if (dto.languages !== undefined)
            updateData.languages = dto.languages;
        if (dto.languageLevel !== undefined)
            updateData.language_level = dto.languageLevel;
        if (dto.socialInsuranceCode !== undefined)
            updateData.social_insurance_code = dto.socialInsuranceCode;
        if (dto.taxCode !== undefined)
            updateData.tax_code = dto.taxCode;
        if (dto.department !== undefined)
            updateData.department = dto.department;
        if (dto.position !== undefined)
            updateData.position = dto.position;
        if (dto.level !== undefined)
            updateData.level = dto.level;
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.contractType !== undefined)
            updateData.contract_type = dto.contractType;
        if (dto.startDate !== undefined)
            updateData.start_date = dto.startDate ? new Date(dto.startDate) : null;
        if (dto.contractDuration !== undefined)
            updateData.contract_duration = dto.contractDuration;
        if (dto.endDate !== undefined)
            updateData.end_date = dto.endDate ? new Date(dto.endDate) : null;
        if (dto.probationSalary !== undefined)
            updateData.probation_salary = dto.probationSalary ? parseFloat(dto.probationSalary) : null;
        if (dto.officialSalary !== undefined)
            updateData.official_salary = dto.officialSalary ? parseFloat(dto.officialSalary) : null;
        if (dto.fuelAllowance !== undefined)
            updateData.fuel_allowance = dto.fuelAllowance ? parseFloat(dto.fuelAllowance) : null;
        if (dto.mealAllowance !== undefined)
            updateData.meal_allowance = dto.mealAllowance ? parseFloat(dto.mealAllowance) : null;
        if (dto.transportAllowance !== undefined)
            updateData.transport_allowance = dto.transportAllowance ? parseFloat(dto.transportAllowance) : null;
        if (dto.uniformAllowance !== undefined)
            updateData.uniform_allowance = dto.uniformAllowance ? parseFloat(dto.uniformAllowance) : null;
        if (dto.performanceBonus !== undefined)
            updateData.performance_bonus = dto.performanceBonus ? parseFloat(dto.performanceBonus) : null;
        if (dto.hireDate !== undefined)
            updateData.hire_date = dto.hireDate ? new Date(dto.hireDate) : null;
        if (dto.joinDate !== undefined)
            updateData.join_date = dto.joinDate ? new Date(dto.joinDate) : null;
        if (dto.status !== undefined)
            updateData.status = dto.status;
        if (dto.departmentId !== undefined)
            updateData.department_id = dto.departmentId ? BigInt(dto.departmentId) : null;
        const employee = await this.prisma.employees.update({
            where: { employee_id: BigInt(id) },
            data: updateData
        });
        return this.findDetailById(employee.employee_id.toString());
    }
    async delete(id) {
        await this.prisma.employees.delete({
            where: { employee_id: BigInt(id) }
        });
        return { success: true };
    }
    async remove(id, hard = false) {
        if (hard) {
            return this.delete(id);
        }
        else {
            await this.prisma.employees.update({
                where: { employee_id: BigInt(id) },
                data: { status: 'Terminated' }
            });
            return { success: true };
        }
    }
    async terminate(id, body) {
        await this.prisma.employees.update({
            where: { employee_id: BigInt(id) },
            data: {
                status: 'Terminated',
                end_date: body.terminationDate ? new Date(body.terminationDate) : new Date()
            }
        });
        return { success: true };
    }
    async listPositions(id, activeOnly = false) {
        return [];
    }
    async addPosition(employeeId, dto) {
        return { success: true };
    }
    async updatePosition(employeeId, positionId, dto) {
        return { success: true };
    }
    async deletePosition(id, positionId) {
        return { success: true };
    }
    async listSalaries(id) {
        const employee = await this.prisma.employees.findUnique({
            where: { employee_id: BigInt(id) },
            select: {
                probation_salary: true,
                official_salary: true,
                fuel_allowance: true,
                meal_allowance: true,
                transport_allowance: true,
                uniform_allowance: true,
                performance_bonus: true
            }
        });
        if (!employee)
            return [];
        return [{
                id: '1',
                baseSalary: employee.official_salary || employee.probation_salary,
                fuelAllowance: employee.fuel_allowance,
                mealAllowance: employee.meal_allowance,
                transportAllowance: employee.transport_allowance,
                uniformAllowance: employee.uniform_allowance,
                performanceBonus: employee.performance_bonus,
                effectiveDate: new Date(),
                isActive: true
            }];
    }
    async addSalary(employeeId, dto) {
        await this.prisma.employees.update({
            where: { employee_id: BigInt(employeeId) },
            data: {
                official_salary: parseFloat(dto.baseSalary)
            }
        });
        return { success: true };
    }
    async updateSalary(id, salaryId, dto) {
        await this.prisma.employees.update({
            where: { employee_id: BigInt(id) },
            data: {
                official_salary: parseFloat(dto.baseSalary)
            }
        });
        return { success: true };
    }
    async deleteSalary(id, salaryId) {
        return { success: true };
    }
    async getCurrentSalary(id) {
        const salaries = await this.listSalaries(id);
        return salaries[0] || null;
    }
    async listBenefits(id) {
        const benefits = await this.prisma.employee_benefits.findMany({
            where: { employee_id: BigInt(id) },
            include: { benefit_types: true },
            orderBy: { start_date: 'desc' }
        });
        return benefits.map(ben => ({
            id: ben.benefit_id.toString(),
            type: ben.benefit_types?.name,
            amount: ben.amount,
            startDate: ben.start_date,
            endDate: ben.end_date,
            isActive: ben.is_active,
            notes: ben.notes
        }));
    }
    async addBenefit(employeeId, dto) {
        const benefit = await this.prisma.employee_benefits.create({
            data: {
                employee_id: BigInt(employeeId),
                type_id: BigInt(dto.typeId),
                amount: dto.amount ? parseFloat(dto.amount) : null,
                start_date: new Date(dto.startDate),
                end_date: dto.endDate ? new Date(dto.endDate) : null,
                is_active: dto.isActive ?? true,
                notes: dto.notes
            }
        });
        return {
            id: benefit.benefit_id.toString(),
            amount: benefit.amount,
            startDate: benefit.start_date,
            endDate: benefit.end_date,
            isActive: benefit.is_active,
            notes: benefit.notes
        };
    }
    async updateBenefit(id, benefitId, dto) {
        const benefit = await this.prisma.employee_benefits.update({
            where: {
                benefit_id: BigInt(benefitId),
                employee_id: BigInt(id)
            },
            data: {
                type_id: dto.typeId ? BigInt(dto.typeId) : undefined,
                amount: dto.amount ? parseFloat(dto.amount) : undefined,
                start_date: dto.startDate ? new Date(dto.startDate) : undefined,
                end_date: dto.endDate ? new Date(dto.endDate) : undefined,
                is_active: dto.isActive,
                notes: dto.notes
            }
        });
        return {
            id: benefit.benefit_id.toString(),
            amount: benefit.amount,
            startDate: benefit.start_date,
            endDate: benefit.end_date,
            isActive: benefit.is_active,
            notes: benefit.notes
        };
    }
    async deleteBenefit(id, benefitId) {
        await this.prisma.employee_benefits.delete({
            where: {
                benefit_id: BigInt(benefitId),
                employee_id: BigInt(id)
            }
        });
        return { success: true };
    }
    async listContacts(id) {
        const contacts = await this.prisma.employee_contacts.findMany({
            where: { employee_id: BigInt(id) }
        });
        return contacts.map(contact => ({
            id: contact.contact_id.toString(),
            contactName: contact.contact_name,
            relationship: contact.relationship,
            phone: contact.phone
        }));
    }
    async addContact(id, dto) {
        const contact = await this.prisma.employee_contacts.create({
            data: {
                employee_id: BigInt(id),
                contact_name: dto.contactName,
                relationship: dto.relationship,
                phone: dto.phone
            }
        });
        return {
            id: contact.contact_id.toString(),
            contactName: contact.contact_name,
            relationship: contact.relationship,
            phone: contact.phone
        };
    }
    async deleteContact(id, contactId) {
        await this.prisma.employee_contacts.delete({
            where: {
                contact_id: BigInt(contactId),
                employee_id: BigInt(id)
            }
        });
        return { success: true };
    }
    async listDocuments(id) {
        const documents = await this.prisma.employee_documents.findMany({
            where: { employee_id: BigInt(id) }
        });
        return documents.map(doc => ({
            id: doc.doc_id.toString(),
            docType: doc.doc_type,
            filePath: doc.file_path,
            issueDate: doc.issue_date,
            expiryDate: doc.expiry_date
        }));
    }
    async addDocument(id, dto) {
        const document = await this.prisma.employee_documents.create({
            data: {
                employee_id: BigInt(id),
                doc_type: dto.docType,
                file_path: dto.filePath,
                issue_date: dto.issueDate ? new Date(dto.issueDate) : null,
                expiry_date: dto.expiryDate ? new Date(dto.expiryDate) : null
            }
        });
        return {
            id: document.doc_id.toString(),
            docType: document.doc_type,
            filePath: document.file_path,
            issueDate: document.issue_date,
            expiryDate: document.expiry_date
        };
    }
    async deleteDocument(id, docId) {
        await this.prisma.employee_documents.delete({
            where: {
                doc_id: BigInt(docId),
                employee_id: BigInt(id)
            }
        });
        return { success: true };
    }
    async getDepartments() {
        const departments = await this.prisma.departments.findMany({
            orderBy: { name: 'asc' }
        });
        return departments.map(dept => ({
            id: dept.department_id.toString(),
            name: dept.name,
            managerId: dept.manager_id?.toString(),
            parentId: dept.parent_id?.toString(),
            budget: dept.budget
        }));
    }
    async getBenefitTypes() {
        const types = await this.prisma.benefit_types.findMany({
            orderBy: { name: 'asc' }
        });
        return types.map(type => ({
            id: type.type_id.toString(),
            name: type.name,
            type: type.type,
            category: type.category,
            unit: type.unit,
            description: type.description
        }));
    }
};
exports.EmployeesRepository = EmployeesRepository;
exports.EmployeesRepository = EmployeesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesRepository);
//# sourceMappingURL=employees.repository.js.map