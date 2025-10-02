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
const create_employee_dto_1 = require("./dto/create-employee.dto");
const update_employee_dto_1 = require("./dto/update-employee.dto");
const query_employee_dto_1 = require("./dto/query-employee.dto");
const create_position_dto_1 = require("./dto/create-position.dto");
const create_salary_dto_1 = require("./dto/create-salary.dto");
const create_benefit_dto_1 = require("./dto/create-benefit.dto");
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
    async listBenefits(id) {
        return this.service.listBenefits(id);
    }
    async addBenefit(id, dto) {
        return this.service.addBenefit(id, dto);
    }
    async updateBenefit(id, benefitId, dto) {
        return this.service.updateBenefit(id, benefitId, dto);
    }
    async deleteBenefit(id, benefitId) {
        return this.service.deleteBenefit(id, benefitId);
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
    (0, common_1.Get)(':id/benefits'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "listBenefits", null);
__decorate([
    (0, common_1.Post)(':id/benefits'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_benefit_dto_1.CreateBenefitDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "addBenefit", null);
__decorate([
    (0, common_1.Patch)(':id/benefits/:benefitId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('benefitId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_benefit_dto_1.CreateBenefitDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "updateBenefit", null);
__decorate([
    (0, common_1.Delete)(':id/benefits/:benefitId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('benefitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deleteBenefit", null);
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
exports.EmployeesController = EmployeesController = __decorate([
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map