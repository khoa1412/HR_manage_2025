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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const employees_service_1 = require("./employees.service");
const hr_role_guard_1 = require("../../auth/guards/hr-role.guard");
const create_employee_dto_1 = require("./dto/create_dto/create-employee.dto");
const update_employee_dto_1 = require("./dto/update-employee.dto");
const query_employee_dto_1 = require("./dto/query-employee.dto");
const create_position_dto_1 = require("./dto/create_dto/create-position.dto");
const create_salary_dto_1 = require("./dto/create_dto/create-salary.dto");
const create_contact_dto_1 = require("./dto/create_dto/create-contact.dto");
const create_citizen_dto_1 = require("./dto/create_dto/create-citizen.dto");
const create_education_dto_1 = require("./dto/create_dto/create-education.dto");
const create_staff_acc_dto_1 = require("./dto/create_dto/create-staff-acc.dto");
const create_tax_insurance_dto_1 = require("./dto/create_dto/create-tax-insurance.dto");
const create_resign_info_dto_1 = require("./dto/create_dto/create-resign-info.dto");
let EmployeesController = class EmployeesController {
    constructor(service) {
        this.service = service;
    }
    async list(query) {
        return this.service.list(query);
    }
    async me(req) {
        return {
            id: '1',
            employeeCode: 'EMP001',
            fullName: 'Nguyen Van An',
            email: 'an.nguyen@company.com',
            phone: '0901234567',
            department: 'Human Resources',
            position: 'HR Manager',
            joinDate: '2020-01-15',
            status: 'Active',
            officialSalary: 15000000
        };
    }
    async get(id) {
        return this.service.getById(id);
    }
    async create(dto) {
        return this.service.create(dto);
    }
    async update(id, dto) {
        return this.service.update(id, dto);
    }
    async remove(id) {
        return this.service.remove(id, true);
    }
    async terminate(id, body) {
        return this.service.terminate(id, body);
    }
    async listPositions(id, activeOnly) {
        return this.service.listPositions(id, activeOnly === 'true');
    }
    async addPosition(id, dto) {
        return this.service.addPosition(id, dto);
    }
    async updatePosition(id, positionId, dto) {
        return this.service.updatePosition(id, positionId, dto);
    }
    async deletePosition(id, positionId) {
        return this.service.deletePosition(id, positionId);
    }
    async listSalaries(id) {
        return this.service.listSalaries(id);
    }
    async currentSalary(id) {
        return this.service.getCurrentSalary(id);
    }
    async addSalary(id, dto) {
        return this.service.addSalary(id, dto);
    }
    async updateSalary(id, salaryId, dto) {
        return this.service.updateSalary(id, salaryId, dto);
    }
    async deleteSalary(id, salaryId) {
        return this.service.deleteSalary(id, salaryId);
    }
    async listContacts(id) {
        return this.service.listContacts(id);
    }
    async addContact(id, body) {
        return this.service.addContact(id, body);
    }
    async deleteContact(id, contactId) {
        return this.service.deleteContact(id, contactId);
    }
    async listDocuments(id) {
        return this.service.listDocuments(id);
    }
    async addDocument(id, body) {
        return this.service.addDocument(id, body);
    }
    async deleteDocument(id, docId) {
        return this.service.deleteDocument(id, docId);
    }
    async createStaffAccount(id, dto) {
        return this.service.createStaffAccount(id, dto);
    }
    async createContact(id, dto) {
        return this.service.createContact(id, dto);
    }
    async createCitizenId(id, dto) {
        return this.service.createCitizenId(id, dto);
    }
    async createEducation(id, dto) {
        return this.service.createEducation(id, dto);
    }
    async createTaxInsurance(id, dto) {
        return this.service.createTaxInsurance(id, dto);
    }
    async createResignInfo(id, dto) {
        return this.service.createResignInfo(id, dto);
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_employee_dto_1.QueryEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "me", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/terminate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "terminate", null);
__decorate([
    (0, common_1.Get)(':id/positions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "listPositions", null);
__decorate([
    (0, common_1.Post)(':id/positions'),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_position_dto_1.CreatePositionDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "addPosition", null);
__decorate([
    (0, common_1.Patch)(':id/positions/:positionId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('positionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_position_dto_1.CreatePositionDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "updatePosition", null);
__decorate([
    (0, common_1.Delete)(':id/positions/:positionId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('positionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deletePosition", null);
__decorate([
    (0, common_1.Get)(':id/salaries'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "listSalaries", null);
__decorate([
    (0, common_1.Get)(':id/salaries/current'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "currentSalary", null);
__decorate([
    (0, common_1.Post)(':id/salaries'),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_salary_dto_1.CreateSalaryDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "addSalary", null);
__decorate([
    (0, common_1.Patch)(':id/salaries/:salaryId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('salaryId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_salary_dto_1.CreateSalaryDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "updateSalary", null);
__decorate([
    (0, common_1.Delete)(':id/salaries/:salaryId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('salaryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deleteSalary", null);
__decorate([
    (0, common_1.Get)(':id/contacts'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "listContacts", null);
__decorate([
    (0, common_1.Post)(':id/contacts'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "addContact", null);
__decorate([
    (0, common_1.Delete)(':id/contacts/:contactId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('contactId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deleteContact", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "listDocuments", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Delete)(':id/documents/:docId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('docId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deleteDocument", null);
__decorate([
    (0, common_1.Post)(':id/staff-account'),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_staff_acc_dto_1.CreateStaffAccDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "createStaffAccount", null);
__decorate([
    (0, common_1.Post)(':id/contact'),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_contact_dto_1.CreateContactDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "createContact", null);
__decorate([
    (0, common_1.Post)(':id/citizen-id'),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_citizen_dto_1.CreateCitizenIdDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "createCitizenId", null);
__decorate([
    (0, common_1.Post)(':id/education'),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_education_dto_1.CreateEducationDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "createEducation", null);
__decorate([
    (0, common_1.Post)(':id/tax-insurance'),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_tax_insurance_dto_1.CreateTaxInsuranceDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "createTaxInsurance", null);
__decorate([
    (0, common_1.Post)(':id/resign-info'),
    (0, common_1.UseGuards)(hr_role_guard_1.HrRoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_resign_info_dto_1.CreateResignInfoDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "createResignInfo", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map