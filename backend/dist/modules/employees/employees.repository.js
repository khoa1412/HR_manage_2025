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
const typeorm_1 = require("typeorm");
let EmployeesRepository = class EmployeesRepository {
    constructor(ds) {
        this.ds = ds;
    }
    applySort(qb, sort, allowed = []) {
        if (!sort)
            return;
        const parts = sort.split(',');
        for (const p of parts) {
            const [field, dir] = p.split(':');
            if (!allowed.includes(field))
                continue;
            qb.addOrderBy(`v."${field}"`, dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
        }
    }
    async list(query) {
        const { q, status, departmentId, joinDateFrom, joinDateTo, hasPosition, hasActiveBenefits, page = 1, pageSize = 20, sort } = query;
        const qb = this.ds.createQueryBuilder().select('*').from('v_employees_api', 'v');
        if (q) {
            qb.andWhere('(v."employeeCode" ILIKE :q OR v."fullName" ILIKE :q OR v.email ILIKE :q OR v.phone ILIKE :q)', { q: `%${q}%` });
        }
        if (status?.length) {
            qb.andWhere('v."status" = ANY(:status)', { status });
        }
        if (departmentId) {
            qb.andWhere('v."department" = (SELECT name FROM departments WHERE department_id = :depId)', { depId: departmentId });
        }
        if (joinDateFrom || joinDateTo) {
            qb.innerJoin('employees', 'e', 'e.employee_id::text = v."id"');
            if (joinDateFrom)
                qb.andWhere('e.join_date >= :from', { from: joinDateFrom });
            if (joinDateTo)
                qb.andWhere('e.join_date <= :to', { to: joinDateTo });
        }
        if (hasPosition === true) {
            qb.andWhere(`EXISTS (SELECT 1 FROM employee_positions ep WHERE ep.employee_id::text = v."id" AND (ep.end_date IS NULL OR ep.end_date >= CURRENT_DATE))`);
        }
        if (hasActiveBenefits === true) {
            qb.andWhere(`EXISTS (SELECT 1 FROM employee_benefits eb WHERE eb.employee_id::text = v."id" AND (eb.end_date IS NULL OR eb.end_date >= CURRENT_DATE) AND eb.is_active = true)`);
        }
        this.applySort(qb, sort, ['fullName', 'joinDate', 'status', 'employeeCode']);
        qb.offset((page - 1) * pageSize).limit(pageSize);
        const [rows, totalRow] = await Promise.all([
            qb.getRawMany(),
            this.ds
                .createQueryBuilder()
                .select('COUNT(1)', 'count')
                .from('(' + qb.clone().offset(undefined).limit(undefined).orderBy(undefined).getQuery() + ')', 't')
                .setParameters(qb.getParameters())
                .getRawOne(),
        ]);
        return { data: rows, page, pageSize, total: Number(totalRow?.count ?? 0) };
    }
    async findDetailById(id) {
        const detail = await this.ds.query(`
      with current_salary as (
        select distinct on (employee_id)
          employee_id, base_salary, effective_date, end_date
        from employee_salaries
        where employee_id = $1::bigint
        order by employee_id, coalesce(end_date, date '9999-12-31') desc, effective_date desc
      ), active_benefits as (
        select eb.*, bt.name as type_name
        from employee_benefits eb
        join benefit_types bt on bt.type_id = eb.type_id
        where eb.employee_id = $1::bigint and eb.is_active = true and coalesce(eb.end_date, date '9999-12-31') >= current_date
      )
      select
        e.employee_id::text as id,
        e.employee_code as "employeeCode",
        e.full_name as "fullName",
        e.email, e.phone, e.dob, e.gender,
        e.birth_place as "birthPlace",
        e.cccd_number as "cccdNumber",
        e.cccd_issue_date as "cccdIssueDate",
        e.cccd_issue_place as "cccdIssuePlace",
        e.marital_status as "maritalStatus",
        e.personal_phone as "personalPhone",
        e.personal_email as "personalEmail",
        e.temporary_address as "temporaryAddress",
        e.permanent_address as "permanentAddress",
        e.emergency_contact_name as "emergencyContactName",
        e.emergency_contact_relation as "emergencyContactRelation",
        e.emergency_contact_phone as "emergencyContactPhone",
        e.highest_degree as "highestDegree",
        e.university, e.major,
        e.other_certificates as "otherCertificates",
        e.languages, e.language_level as "languageLevel",
        e.social_insurance_code as "socialInsuranceCode",
        e.tax_code as "taxCode",
        e.department, e.position, e.level, e.title,
        e.contract_type as "contractType",
        e.start_date as "startDate",
        e.contract_duration as "contractDuration",
        e.end_date as "endDate",
        e.probation_salary as "probationSalary",
        e.official_salary as "officialSalary",
        e.fuel_allowance as "fuelAllowance",
        e.meal_allowance as "mealAllowance",
        e.transport_allowance as "transportAllowance",
        e.uniform_allowance as "uniformAllowance",
        e.performance_bonus as "performanceBonus",
        e.hire_date as "hireDate", e.join_date as "joinDate",
        e.status::text as status,
        jsonb_build_object('id', d.department_id::text, 'name', d.name) as department,
        jsonb_build_object('title', cp.position, 'startDate', cp.start_date, 'endDate', cp.end_date) as position,
        (select jsonb_build_object('baseSalary', cs.base_salary::text, 'effectiveDate', cs.effective_date) from current_salary cs) as "currentSalary",
        (select coalesce(jsonb_agg(jsonb_build_object('typeId', ab.type_id::text, 'name', ab.type_name, 'amount', ab.amount::text, 'startDate', ab.start_date, 'endDate', ab.end_date)), '[]'::jsonb) from active_benefits ab) as "activeBenefits"
      from employees e
      left join departments d on d.department_id = e.department_id
      left join v_current_positions cp on cp.employee_id = e.employee_id
      where e.employee_id = $1::bigint
      `, [id]);
        return detail?.[0];
    }
    async create(dto) {
        const r = await this.ds.query(`insert into employees (
        employee_code, full_name, email, phone, dob, birth_place, gender, 
        cccd_number, cccd_issue_date, cccd_issue_place, marital_status,
        personal_phone, personal_email, temporary_address, permanent_address,
        emergency_contact_name, emergency_contact_relation, emergency_contact_phone,
        highest_degree, university, major, other_certificates, languages, language_level,
        social_insurance_code, tax_code,
        department, position, level, title, contract_type, start_date, contract_duration, end_date,
        probation_salary, official_salary,
        fuel_allowance, meal_allowance, transport_allowance, uniform_allowance, performance_bonus,
        hire_date, join_date, status, department_id
      )
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44)
       returning employee_id::text as id`, [
            dto.employeeCode,
            dto.fullName,
            dto.email,
            dto.phone ?? null,
            dto.dob ?? null,
            dto.birthPlace ?? null,
            dto.gender ?? null,
            dto.cccdNumber ?? null,
            dto.cccdIssueDate ?? null,
            dto.cccdIssuePlace ?? null,
            dto.maritalStatus ?? null,
            dto.personalPhone ?? null,
            dto.personalEmail ?? null,
            dto.temporaryAddress ?? null,
            dto.permanentAddress ?? null,
            dto.emergencyContactName ?? null,
            dto.emergencyContactRelation ?? null,
            dto.emergencyContactPhone ?? null,
            dto.highestDegree ?? null,
            dto.university ?? null,
            dto.major ?? null,
            dto.otherCertificates ?? null,
            dto.languages ?? null,
            dto.languageLevel ?? null,
            dto.socialInsuranceCode ?? null,
            dto.taxCode ?? null,
            dto.department ?? null,
            dto.position ?? null,
            dto.level ?? null,
            dto.title ?? null,
            dto.contractType ?? null,
            dto.startDate ?? null,
            dto.contractDuration ?? null,
            dto.endDate ?? null,
            dto.probationSalary ?? null,
            dto.officialSalary ?? null,
            dto.fuelAllowance ?? null,
            dto.mealAllowance ?? null,
            dto.transportAllowance ?? null,
            dto.uniformAllowance ?? null,
            dto.performanceBonus ?? null,
            dto.hireDate,
            dto.joinDate ?? null,
            dto.status ?? 'Probation',
            dto.departmentId ?? null,
        ]);
        return this.findDetailById(r[0].id);
    }
    async findBasicById(id) {
        const r = await this.ds.query('select employee_id::text as "employeeId", hire_date as "hireDate", join_date as "joinDate", dob as "dob" from employees where employee_id = $1::bigint', [id]);
        return r?.[0];
    }
    async update(id, dto) {
        const fields = [];
        const params = [];
        let idx = 1;
        const set = (col, val) => {
            fields.push(`${col} = $${idx++}`);
            params.push(val);
        };
        if (dto.employeeCode !== undefined)
            set('employee_code', dto.employeeCode);
        if (dto.fullName !== undefined)
            set('full_name', dto.fullName);
        if (dto.email !== undefined)
            set('email', dto.email);
        if (dto.phone !== undefined)
            set('phone', dto.phone);
        if (dto.dob !== undefined)
            set('dob', dto.dob);
        if (dto.birthPlace !== undefined)
            set('birth_place', dto.birthPlace);
        if (dto.gender !== undefined)
            set('gender', dto.gender);
        if (dto.cccdNumber !== undefined)
            set('cccd_number', dto.cccdNumber);
        if (dto.cccdIssueDate !== undefined)
            set('cccd_issue_date', dto.cccdIssueDate);
        if (dto.cccdIssuePlace !== undefined)
            set('cccd_issue_place', dto.cccdIssuePlace);
        if (dto.maritalStatus !== undefined)
            set('marital_status', dto.maritalStatus);
        if (dto.personalPhone !== undefined)
            set('personal_phone', dto.personalPhone);
        if (dto.personalEmail !== undefined)
            set('personal_email', dto.personalEmail);
        if (dto.temporaryAddress !== undefined)
            set('temporary_address', dto.temporaryAddress);
        if (dto.permanentAddress !== undefined)
            set('permanent_address', dto.permanentAddress);
        if (dto.emergencyContactName !== undefined)
            set('emergency_contact_name', dto.emergencyContactName);
        if (dto.emergencyContactRelation !== undefined)
            set('emergency_contact_relation', dto.emergencyContactRelation);
        if (dto.emergencyContactPhone !== undefined)
            set('emergency_contact_phone', dto.emergencyContactPhone);
        if (dto.highestDegree !== undefined)
            set('highest_degree', dto.highestDegree);
        if (dto.university !== undefined)
            set('university', dto.university);
        if (dto.major !== undefined)
            set('major', dto.major);
        if (dto.otherCertificates !== undefined)
            set('other_certificates', dto.otherCertificates);
        if (dto.languages !== undefined)
            set('languages', dto.languages);
        if (dto.languageLevel !== undefined)
            set('language_level', dto.languageLevel);
        if (dto.socialInsuranceCode !== undefined)
            set('social_insurance_code', dto.socialInsuranceCode);
        if (dto.taxCode !== undefined)
            set('tax_code', dto.taxCode);
        if (dto.department !== undefined)
            set('department', dto.department);
        if (dto.position !== undefined)
            set('position', dto.position);
        if (dto.level !== undefined)
            set('level', dto.level);
        if (dto.title !== undefined)
            set('title', dto.title);
        if (dto.contractType !== undefined)
            set('contract_type', dto.contractType);
        if (dto.startDate !== undefined)
            set('start_date', dto.startDate);
        if (dto.contractDuration !== undefined)
            set('contract_duration', dto.contractDuration);
        if (dto.endDate !== undefined)
            set('end_date', dto.endDate);
        if (dto.probationSalary !== undefined)
            set('probation_salary', dto.probationSalary);
        if (dto.officialSalary !== undefined)
            set('official_salary', dto.officialSalary);
        if (dto.fuelAllowance !== undefined)
            set('fuel_allowance', dto.fuelAllowance);
        if (dto.mealAllowance !== undefined)
            set('meal_allowance', dto.mealAllowance);
        if (dto.transportAllowance !== undefined)
            set('transport_allowance', dto.transportAllowance);
        if (dto.uniformAllowance !== undefined)
            set('uniform_allowance', dto.uniformAllowance);
        if (dto.performanceBonus !== undefined)
            set('performance_bonus', dto.performanceBonus);
        if (dto.hireDate !== undefined)
            set('hire_date', dto.hireDate);
        if (dto.joinDate !== undefined)
            set('join_date', dto.joinDate);
        if (dto.status !== undefined)
            set('status', dto.status);
        if (dto.departmentId !== undefined)
            set('department_id', dto.departmentId);
        if (!fields.length)
            return this.findDetailById(id);
        params.push(id);
        await this.ds.query(`update employees set ${fields.join(', ')} where employee_id = $${idx}::bigint`, params);
        return this.findDetailById(id);
    }
    async remove(id, hard) {
        if (hard) {
            await this.ds.query('delete from employees where employee_id = $1::bigint', [id]);
            return { success: true };
        }
        await this.ds.query("update employees set status = 'Terminated' where employee_id = $1::bigint", [id]);
        return this.findDetailById(id);
    }
    async terminate(id, body) {
        await this.ds.transaction(async (em) => {
            await em.query("update employees set status = 'Terminated' where employee_id = $1::bigint", [id]);
            await em.query('update employee_positions set end_date = $2 where employee_id = $1::bigint and end_date is null', [id, body.date]);
            await em.query('update employee_salaries set end_date = $2 where employee_id = $1::bigint and end_date is null', [id, body.date]);
            await em.query('update employee_benefits set end_date = $2 where employee_id = $1::bigint and end_date is null', [id, body.date]);
        });
        return this.findDetailById(id);
    }
    async listPositions(id, activeOnly) {
        const where = activeOnly ? 'and (end_date is null or end_date >= current_date)' : '';
        return this.ds.query(`select * from employee_positions where employee_id = $1::bigint ${where} order by coalesce(end_date, date '9999-12-31') desc, start_date desc`, [id]);
    }
    async addPosition(id, dto) {
        return this.ds.query(`insert into employee_positions (employee_id, title, start_date, end_date) values ($1::bigint,$2,$3,$4) returning *`, [id, dto.title, dto.startDate, dto.endDate ?? null]);
    }
    async updatePosition(id, positionId, dto) {
        return this.ds.query(`update employee_positions set title=$3, start_date=$4, end_date=$5 where employee_id=$1::bigint and position_id=$2::bigint returning *`, [id, positionId, dto.title, dto.startDate, dto.endDate ?? null]);
    }
    async deletePosition(id, positionId) {
        await this.ds.query('delete from employee_positions where employee_id=$1::bigint and position_id=$2::bigint', [id, positionId]);
        return { success: true };
    }
    async listSalaries(id) {
        return this.ds.query(`select * from employee_salaries where employee_id = $1::bigint order by coalesce(end_date, date '9999-12-31') desc, effective_date desc`, [id]);
    }
    async addSalary(id, dto) {
        return this.ds.query(`insert into employee_salaries (employee_id, base_salary, effective_date, end_date, notes) values ($1::bigint,$2,$3,$4,$5) returning *`, [id, dto.baseSalary, dto.effectiveDate, dto.endDate ?? null, dto.notes ?? null]);
    }
    async updateSalary(id, salaryId, dto) {
        return this.ds.query(`update employee_salaries set base_salary=$3, effective_date=$4, end_date=$5, notes=$6 where employee_id=$1::bigint and salary_id=$2::bigint returning *`, [id, salaryId, dto.baseSalary, dto.effectiveDate, dto.endDate ?? null, dto.notes ?? null]);
    }
    async deleteSalary(id, salaryId) {
        await this.ds.query('delete from employee_salaries where employee_id=$1::bigint and salary_id=$2::bigint', [id, salaryId]);
        return { success: true };
    }
    async getCurrentSalary(id) {
        const r = await this.ds.query(`select distinct on (employee_id) employee_id, base_salary, effective_date, end_date from employee_salaries where employee_id=$1::bigint order by employee_id, coalesce(end_date, date '9999-12-31') desc, effective_date desc`, [id]);
        return r?.[0] ?? null;
    }
    async listBenefits(id) {
        return this.ds.query(`select eb.*, bt.name as type_name from employee_benefits eb join benefit_types bt on bt.type_id = eb.type_id where eb.employee_id=$1::bigint order by eb.start_date desc`, [id]);
    }
    async addBenefit(id, dto) {
        return this.ds.query(`insert into employee_benefits (employee_id, type_id, amount, start_date, end_date, is_active, notes) values ($1::bigint,$2::bigint,$3,$4,$5,$6,$7) returning *`, [id, dto.typeId, dto.amount ?? null, dto.startDate, dto.endDate ?? null, dto.isActive ?? true, dto.notes ?? null]);
    }
    async listContacts(id) {
        return this.ds.query('select * from employee_contacts where employee_id=$1::bigint order by contact_id desc', [id]);
    }
    async addContact(id, dto) {
        return this.ds.query('insert into employee_contacts (employee_id, contact_name, relationship, phone) values ($1::bigint,$2,$3,$4) returning *', [id, dto.contactName, dto.relationship ?? null, dto.phone ?? null]);
    }
    async deleteContact(id, contactId) {
        await this.ds.query('delete from employee_contacts where employee_id=$1::bigint and contact_id=$2::bigint', [id, contactId]);
        return { success: true };
    }
    async listDocuments(id) {
        return this.ds.query('select * from employee_documents where employee_id=$1::bigint order by doc_id desc', [id]);
    }
    async addDocument(id, dto) {
        return this.ds.query('insert into employee_documents (employee_id, doc_type, file_path, issue_date, expiry_date) values ($1::bigint,$2,$3,$4,$5) returning *', [id, dto.docType, dto.filePath ?? null, dto.issueDate ?? null, dto.expiryDate ?? null]);
    }
    async deleteDocument(id, docId) {
        await this.ds.query('delete from employee_documents where employee_id=$1::bigint and doc_id=$2::bigint', [id, docId]);
        return { success: true };
    }
    async updateBenefit(id, benefitId, dto) {
        return this.ds.query(`update employee_benefits set type_id=$3::bigint, amount=$4, start_date=$5, end_date=$6, is_active=$7, notes=$8 where employee_id=$1::bigint and benefit_id=$2::bigint returning *`, [id, benefitId, dto.typeId, dto.amount ?? null, dto.startDate, dto.endDate ?? null, dto.isActive ?? true, dto.notes ?? null]);
    }
    async deleteBenefit(id, benefitId) {
        await this.ds.query('delete from employee_benefits where employee_id=$1::bigint and benefit_id=$2::bigint', [id, benefitId]);
        return { success: true };
    }
};
EmployeesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EmployeesRepository);
exports.EmployeesRepository = EmployeesRepository;
//# sourceMappingURL=employees.repository.js.map