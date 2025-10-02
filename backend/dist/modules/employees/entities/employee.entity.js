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
exports.EmployeeEntity = void 0;
const typeorm_1 = require("typeorm");
const department_entity_1 = require("./department.entity");
let EmployeeEntity = class EmployeeEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint', name: 'employee_id' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "employeeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hire_date', type: 'date' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "hireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'join_date', type: 'date', nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "joinDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Active', 'Inactive', 'Probation', 'Terminated'], enumName: 'employment_status_enum', default: 'Active' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'department_id', type: 'bigint', nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'official_salary', type: 'numeric', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "officialSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, (d) => d.employees, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'department_id' }),
    __metadata("design:type", department_entity_1.Department)
], EmployeeEntity.prototype, "department", void 0);
EmployeeEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'employees' })
], EmployeeEntity);
exports.EmployeeEntity = EmployeeEntity;
//# sourceMappingURL=employee.entity.js.map