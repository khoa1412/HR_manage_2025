"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let DbExceptionFilter = class DbExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            return res.status(status).json({ message: exception.message });
        }
        if (exception?.constraint === 'ex_positions_no_overlap') {
            return res.status(409).json({ message: 'Position period overlaps existing records' });
        }
        if (exception?.constraint === 'ex_salaries_no_overlap') {
            return res.status(409).json({ message: 'Salary period overlaps existing records' });
        }
        if (exception?.constraint === 'ex_benefits_no_overlap') {
            return res.status(409).json({ message: 'Benefit period overlaps existing records' });
        }
        if (exception?.code === '23505') {
            const detail = String(exception?.detail ?? '');
            if (detail.includes('employee_code'))
                return res.status(409).json({ message: 'employeeCode already exists' });
            if (detail.includes('email'))
                return res.status(409).json({ message: 'email already exists' });
        }
        if (exception instanceof typeorm_1.QueryFailedError) {
            const err = exception;
            const code = err?.code;
            const c = err?.constraint;
            if (code === '23P01') {
                if (c === 'ex_positions_no_overlap')
                    return res.status(409).json({ message: 'Position period overlaps existing records' });
                if (c === 'ex_salaries_no_overlap')
                    return res.status(409).json({ message: 'Salary period overlaps existing records' });
                if (c === 'ex_benefits_no_overlap')
                    return res.status(409).json({ message: 'Benefit period overlaps existing records' });
                return res.status(409).json({ message: 'date range overlaps existing records' });
            }
            if (code === '23514')
                return res.status(422).json({ message: 'check constraint violation' });
            if (code === '23503')
                return res.status(409).json({ message: 'foreign key violation' });
            if (code === '23505')
                return res.status(409).json({ message: 'unique constraint violation' });
            return res.status(400).json({ message: 'database error' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
DbExceptionFilter = __decorate([
    (0, common_1.Catch)()
], DbExceptionFilter);
exports.DbExceptionFilter = DbExceptionFilter;
//# sourceMappingURL=db-exception.filter.js.map