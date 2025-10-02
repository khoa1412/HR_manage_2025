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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const employees_repository_1 = require("./employees.repository");
let EmployeesService = class EmployeesService {
    constructor(repo) {
        this.repo = repo;
    }
    async list(query) {
        return this.repo.list(query);
    }
    async getById(id) {
        const detail = await this.repo.findDetailById(id);
        if (!detail)
            throw new common_1.NotFoundException('Employee not found');
        return detail;
    }
    async create(dto) {
        this.validateDates(dto);
        try {
            return await this.repo.create(dto);
        }
        catch (e) {
            if (e?.code === '23505') {
                if (String(e?.detail ?? '').includes('employee_code'))
                    throw new common_1.ConflictException('employeeCode already exists');
                if (String(e?.detail ?? '').includes('email'))
                    throw new common_1.ConflictException('email already exists');
            }
            throw e;
        }
    }
    async update(id, dto) {
        const current = await this.repo.findBasicById(id);
        if (!current)
            throw new common_1.NotFoundException('Employee not found');
        this.validateDates(dto, current);
        return this.repo.update(id, dto);
    }
    async remove(id, hard) {
        return this.repo.remove(id, hard);
    }
    validateDates(dto, current) {
        const hire = dto.hireDate ?? current?.hireDate;
        const join = dto.joinDate ?? current?.joinDate;
        const dob = dto.dob ?? current?.dob;
        if (hire && join && hire > join)
            throw new common_1.UnprocessableEntityException('joinDate must be >= hireDate');
        if (dob && hire && dob > hire)
            throw new common_1.UnprocessableEntityException('dob must be <= hireDate');
    }
    async terminate(id, body) {
        return this.repo.terminate(id, body);
    }
    async listPositions(id, activeOnly) {
        return this.repo.listPositions(id, activeOnly);
    }
    async addPosition(id, dto) {
        try {
            return await this.repo.addPosition(id, dto);
        }
        catch (e) {
            if (e?.constraint === 'ex_positions_no_overlap') {
                throw new common_1.ConflictException('Position period overlaps existing records');
            }
            throw e;
        }
    }
    async updatePosition(id, positionId, dto) {
        try {
            return await this.repo.updatePosition(id, positionId, dto);
        }
        catch (e) {
            if (e?.constraint === 'ex_positions_no_overlap') {
                throw new common_1.ConflictException('Position period overlaps existing records');
            }
            throw e;
        }
    }
    async deletePosition(id, positionId) {
        return this.repo.deletePosition(id, positionId);
    }
    async listSalaries(id) {
        return this.repo.listSalaries(id);
    }
    async addSalary(id, dto) {
        try {
            return await this.repo.addSalary(id, dto);
        }
        catch (e) {
            if (e?.constraint === 'ex_salaries_no_overlap') {
                throw new common_1.ConflictException('Salary period overlaps existing records');
            }
            throw e;
        }
    }
    async updateSalary(id, salaryId, dto) {
        try {
            return await this.repo.updateSalary(id, salaryId, dto);
        }
        catch (e) {
            if (e?.constraint === 'ex_salaries_no_overlap') {
                throw new common_1.ConflictException('Salary period overlaps existing records');
            }
            throw e;
        }
    }
    async deleteSalary(id, salaryId) {
        return this.repo.deleteSalary(id, salaryId);
    }
    async getCurrentSalary(id) {
        return this.repo.getCurrentSalary(id);
    }
    async listBenefits(id) {
        return this.repo.listBenefits(id);
    }
    async addBenefit(id, dto) {
        try {
            return await this.repo.addBenefit(id, dto);
        }
        catch (e) {
            if (e?.constraint === 'ex_benefits_no_overlap') {
                throw new common_1.ConflictException('Benefit period overlaps existing records');
            }
            throw e;
        }
    }
    async updateBenefit(id, benefitId, dto) {
        try {
            return await this.repo.updateBenefit(id, benefitId, dto);
        }
        catch (e) {
            if (e?.constraint === 'ex_benefits_no_overlap') {
                throw new common_1.ConflictException('Benefit period overlaps existing records');
            }
            throw e;
        }
    }
    async deleteBenefit(id, benefitId) {
        return this.repo.deleteBenefit(id, benefitId);
    }
    async listContacts(id) {
        return this.repo.listContacts(id);
    }
    async addContact(id, dto) {
        return this.repo.addContact(id, dto);
    }
    async deleteContact(id, contactId) {
        return this.repo.deleteContact(id, contactId);
    }
    async listDocuments(id) {
        return this.repo.listDocuments(id);
    }
    async addDocument(id, dto) {
        return this.repo.addDocument(id, dto);
    }
    async deleteDocument(id, docId) {
        return this.repo.deleteDocument(id, docId);
    }
};
EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employees_repository_1.EmployeesRepository])
], EmployeesService);
exports.EmployeesService = EmployeesService;
//# sourceMappingURL=employees.service.js.map