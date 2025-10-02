"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeFactory = void 0;
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randChoice(arr) { return arr[randInt(0, arr.length - 1)]; }
function randString(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let s = '';
    for (let i = 0; i < len; i++)
        s += chars[randInt(0, chars.length - 1)];
    return s;
}
function randPhone() { return '09' + randInt(10000000, 99999999).toString(); }
function randEmail() { return `user${randInt(1000, 9999)}@example.com`; }
function randName() { const f = ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Do']; const g = ['An', 'Binh', 'Cuong', 'Dung', 'Em', 'Phuong', 'Giang', 'Hoa']; return randChoice(f) + ' ' + randChoice(g); }
function randPastYear(years) { const d = new Date(); d.setFullYear(d.getFullYear() - randInt(0, years)); d.setMonth(randInt(0, 11)); d.setDate(randInt(1, 28)); return d; }
function randFutureYear(years) { const d = new Date(); d.setFullYear(d.getFullYear() + randInt(0, years)); d.setMonth(randInt(0, 11)); d.setDate(randInt(1, 28)); return d; }
function randBetween(from, to) { const t = randInt(from.getTime(), to.getTime()); return new Date(t); }
class EmployeeFactory {
    static createEmployee(overrides = {}) {
        const gender = randChoice(['Male', 'Female']);
        const hireDate = randPastYear(5);
        const joinDate = randBetween(hireDate, new Date());
        return {
            employee_code: randString(8),
            full_name: randName(),
            email: randEmail(),
            phone: randPhone(),
            dob: randPastYear(40),
            gender,
            hire_date: hireDate,
            join_date: joinDate,
            status: randChoice(['Active', 'Inactive', 'Probation', 'Terminated']),
            department_id: randInt(1, 8),
            official_salary: randInt(10000000, 50000000),
            ...overrides
        };
    }
    static createDepartment(overrides = {}) {
        return { name: `Dept ${randString(4)}`, budget: randInt(100000, 1000000), ...overrides };
    }
    static createBenefitType(overrides = {}) {
        const types = ['allowance', 'bonus', 'insurance', 'benefit', 'reimbursement'];
        const categories = ['transportation', 'food', 'communication', 'housing', 'health', 'education'];
        const units = ['VND', 'USD', 'service', 'percentage'];
        return { name: `Benefit ${randString(5)}`, type: randChoice(types), category: randChoice(categories), unit: randChoice(units), description: 'seeded', is_custom: Math.random() < 0.3, ...overrides };
    }
    static createEmployeePosition(employeeId, overrides = {}) {
        const startDate = randPastYear(3);
        const endDate = Math.random() < 0.5 ? randBetween(startDate, new Date()) : null;
        return {
            employee_id: employeeId,
            title: randChoice(['Engineer', 'Senior Engineer', 'Team Lead', 'Manager', 'Analyst', 'Specialist']),
            start_date: startDate,
            end_date: endDate,
            ...overrides
        };
    }
    static createEmployeeSalary(employeeId, overrides = {}) {
        const effectiveDate = randPastYear(2);
        const endDate = Math.random() < 0.5 ? randBetween(effectiveDate, new Date()) : null;
        return {
            employee_id: employeeId,
            base_salary: randInt(8000000, 40000000),
            effective_date: effectiveDate,
            end_date: endDate,
            notes: 'seeded note',
            ...overrides
        };
    }
    static createEmployeeBenefit(employeeId, typeId, overrides = {}) {
        const startDate = randPastYear(1);
        const endDate = Math.random() < 0.5 ? randBetween(startDate, new Date()) : null;
        return {
            employee_id: employeeId,
            type_id: typeId,
            amount: randInt(100000, 5000000),
            start_date: startDate,
            end_date: endDate,
            is_active: Math.random() < 0.7,
            notes: 'seeded note',
            ...overrides
        };
    }
    static createEmployeeContact(employeeId, overrides = {}) {
        const relationships = ['Spouse', 'Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter'];
        return {
            employee_id: employeeId,
            contact_name: randName(),
            relationship: randChoice(relationships),
            phone: randPhone(),
            ...overrides
        };
    }
    static createEmployeeDocument(employeeId, overrides = {}) {
        const docTypes = ['contract', 'appointment', 'certificate', 'other'];
        const issueDate = randPastYear(2);
        const expiryDate = randFutureYear(3);
        return {
            employee_id: employeeId,
            doc_type: randChoice(docTypes),
            file_path: `/documents/EMP${employeeId}/file_${randString(6)}.pdf`,
            issue_date: issueDate,
            expiry_date: expiryDate,
            ...overrides
        };
    }
    static createAuthUser(employeeId, overrides = {}) {
        const roles = ['admin', 'hr', 'employee'];
        const username = `user_${randString(6)}`;
        const email = randEmail();
        return {
            employee_id: employeeId,
            username,
            email,
            password_hash: '$2b$10$example_hash_' + randString(10),
            role: randChoice(roles),
            last_login: new Date(),
            ...overrides
        };
    }
    static createEmployees(count, overrides = {}) {
        return Array.from({ length: count }, () => this.createEmployee(overrides));
    }
    static createDepartments(count, overrides = {}) {
        return Array.from({ length: count }, () => this.createDepartment(overrides));
    }
    static createBenefitTypes(count, overrides = {}) {
        return Array.from({ length: count }, () => this.createBenefitType(overrides));
    }
}
exports.EmployeeFactory = EmployeeFactory;
//# sourceMappingURL=EmployeeFactory.js.map