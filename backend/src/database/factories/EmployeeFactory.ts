// Employee Data Factory for Testing
// This file provides factory functions to generate test data

// Lightweight local generators to avoid external deps in backend build
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randChoice<T>(arr: T[]): T { return arr[randInt(0, arr.length - 1)]; }
function randString(len: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[randInt(0, chars.length - 1)];
  return s;
}
function randPhone() { return '09' + randInt(10000000, 99999999).toString(); }
function randEmail() { return `user${randInt(1000, 9999)}@example.com`; }
function randName() { const f = ['Nguyen','Tran','Le','Pham','Hoang','Do']; const g = ['An','Binh','Cuong','Dung','Em','Phuong','Giang','Hoa']; return randChoice(f) + ' ' + randChoice(g); }
function randPastYear(years: number) { const d = new Date(); d.setFullYear(d.getFullYear() - randInt(0, years)); d.setMonth(randInt(0,11)); d.setDate(randInt(1,28)); return d; }
function randFutureYear(years: number) { const d = new Date(); d.setFullYear(d.getFullYear() + randInt(0, years)); d.setMonth(randInt(0,11)); d.setDate(randInt(1,28)); return d; }
function randBetween(from: Date, to: Date) { const t = randInt(from.getTime(), to.getTime()); return new Date(t); }

export interface EmployeeFactoryData {
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  dob: Date;
  gender: string;
  hire_date: Date;
  join_date: Date;
  status: 'Active' | 'Inactive' | 'Probation' | 'Terminated';
  department_id: number;
  official_salary: number;
}

export interface DepartmentFactoryData {
  name: string;
  budget: number;
}

export interface BenefitTypeFactoryData {
  name: string;
  type: 'allowance' | 'bonus' | 'insurance' | 'benefit' | 'reimbursement';
  category: string;
  unit: string;
  description: string;
  is_custom: boolean;
}

export class EmployeeFactory {
  static createEmployee(overrides: Partial<EmployeeFactoryData> = {}): EmployeeFactoryData {
    const gender = randChoice(['Male','Female']);
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
      status: randChoice(['Active','Inactive','Probation','Terminated']),
      department_id: randInt(1,8),
      official_salary: randInt(10000000, 50000000),
      ...overrides
    };
  }

  static createDepartment(overrides: Partial<DepartmentFactoryData> = {}): DepartmentFactoryData {
    return { name: `Dept ${randString(4)}`, budget: randInt(100000, 1000000), ...overrides };
  }

  static createBenefitType(overrides: Partial<BenefitTypeFactoryData> = {}): BenefitTypeFactoryData {
    const types = ['allowance','bonus','insurance','benefit','reimbursement'];
    const categories = ['transportation','food','communication','housing','health','education'];
    const units = ['VND','USD','service','percentage'];
    return { name: `Benefit ${randString(5)}`, type: randChoice(types) as any, category: randChoice(categories), unit: randChoice(units), description: 'seeded', is_custom: Math.random() < 0.3, ...overrides };
  }

  static createEmployeePosition(employeeId: number, overrides: any = {}) {
    const startDate = randPastYear(3);
    const endDate = Math.random() < 0.5 ? randBetween(startDate, new Date()) : null;

    return {
      employee_id: employeeId,
      title: randChoice(['Engineer','Senior Engineer','Team Lead','Manager','Analyst','Specialist']),
      start_date: startDate,
      end_date: endDate,
      ...overrides
    };
  }

  static createEmployeeSalary(employeeId: number, overrides: any = {}) {
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

  static createEmployeeBenefit(employeeId: number, typeId: number, overrides: any = {}) {
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

  static createEmployeeContact(employeeId: number, overrides: any = {}) {
    const relationships = ['Spouse', 'Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter'];

    return {
      employee_id: employeeId,
      contact_name: randName(),
      relationship: randChoice(relationships),
      phone: randPhone(),
      ...overrides
    };
  }

  static createEmployeeDocument(employeeId: number, overrides: any = {}) {
    const docTypes = ['contract','appointment','certificate','other'];
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

  static createAuthUser(employeeId: number, overrides: any = {}) {
    const roles = ['admin','hr','employee'];
    const username = `user_${randString(6)}`;
    const email = randEmail();

    return {
      employee_id: employeeId,
      username,
      email,
      password_hash: '$2b$10$example_hash_' + randString(10),
      role: randChoice(roles) as any,
      last_login: new Date(),
      ...overrides
    };
  }

  // Bulk creation methods
  static createEmployees(count: number, overrides: Partial<EmployeeFactoryData> = {}): EmployeeFactoryData[] {
    return Array.from({ length: count }, () => this.createEmployee(overrides));
  }

  static createDepartments(count: number, overrides: Partial<DepartmentFactoryData> = {}): DepartmentFactoryData[] {
    return Array.from({ length: count }, () => this.createDepartment(overrides));
  }

  static createBenefitTypes(count: number, overrides: Partial<BenefitTypeFactoryData> = {}): BenefitTypeFactoryData[] {
    return Array.from({ length: count }, () => this.createBenefitType(overrides));
  }
}
