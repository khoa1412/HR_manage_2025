-- ============================================================
-- Employee Database Seed Data
-- HR Management System - Initial Data
-- ============================================================

-- ============================================================
-- 1) Departments
-- ============================================================
INSERT INTO departments (department_id, name, budget, created_at, updated_at) VALUES
(1, 'Human Resources', 500000.00, NOW(), NOW()),
(2, 'Information Technology', 800000.00, NOW(), NOW()),
(3, 'Finance & Accounting', 300000.00, NOW(), NOW()),
(4, 'Marketing', 400000.00, NOW(), NOW()),
(5, 'Operations', 600000.00, NOW(), NOW()),
(6, 'Sales', 700000.00, NOW(), NOW()),
(7, 'Customer Service', 200000.00, NOW(), NOW()),
(8, 'Research & Development', 900000.00, NOW(), NOW())
ON CONFLICT (department_id) DO UPDATE SET
  name = EXCLUDED.name,
  budget = EXCLUDED.budget,
  updated_at = NOW();

-- ============================================================
-- 2) Benefit Types
-- ============================================================
INSERT INTO benefit_types (name, type, category, unit, description, is_custom, created_at) VALUES
-- Allowances
('Transportation Allowance', 'allowance', 'transportation', 'VND', 'Monthly transportation allowance', false, NOW()),
('Meal Allowance', 'allowance', 'food', 'VND', 'Daily meal allowance', false, NOW()),
('Phone Allowance', 'allowance', 'communication', 'VND', 'Monthly phone allowance', false, NOW()),
('Housing Allowance', 'allowance', 'housing', 'VND', 'Monthly housing allowance', false, NOW()),

-- Bonuses
('Performance Bonus', 'bonus', 'performance', 'VND', 'Quarterly performance bonus', false, NOW()),
('Year-end Bonus', 'bonus', 'annual', 'VND', 'Annual year-end bonus', false, NOW()),
('Project Bonus', 'bonus', 'project', 'VND', 'Project completion bonus', false, NOW()),

-- Insurance
('Social Insurance', 'insurance', 'social', 'VND', 'Social insurance contribution', false, NOW()),
('Health Insurance', 'insurance', 'health', 'VND', 'Health insurance contribution', false, NOW()),
('Unemployment Insurance', 'insurance', 'unemployment', 'VND', 'Unemployment insurance contribution', false, NOW()),

-- Benefits
('Health Check', 'benefit', 'health', 'service', 'Annual health check', false, NOW()),
('Training', 'benefit', 'development', 'service', 'Professional training', false, NOW()),
('Gym Membership', 'benefit', 'wellness', 'service', 'Gym membership benefit', false, NOW()),

-- Reimbursements
('Travel Reimbursement', 'reimbursement', 'travel', 'VND', 'Business travel expenses', false, NOW()),
('Training Reimbursement', 'reimbursement', 'education', 'VND', 'Training course expenses', false, NOW());

-- ============================================================
-- 3) Sample Employees
-- ============================================================
INSERT INTO employees (employee_code, full_name, email, phone, dob, gender, hire_date, join_date, status, department_id, official_salary, created_at, updated_at) VALUES
('EMP001', 'Nguyen Van An', 'an.nguyen@company.com', '0901234567', '1985-03-15', 'Male', '2020-01-15', '2020-01-15', 'Active', 1, 15000000, NOW(), NOW()),
('EMP002', 'Tran Thi Binh', 'binh.tran@company.com', '0901234568', '1990-07-22', 'Female', '2020-02-01', '2020-02-01', 'Active', 2, 18000000, NOW(), NOW()),
('EMP003', 'Le Van Cuong', 'cuong.le@company.com', '0901234569', '1988-11-10', 'Male', '2020-03-01', '2020-03-01', 'Active', 2, 20000000, NOW(), NOW()),
('EMP004', 'Pham Thi Dung', 'dung.pham@company.com', '0901234570', '1992-05-18', 'Female', '2020-04-01', '2020-04-01', 'Active', 3, 12000000, NOW(), NOW()),
('EMP005', 'Hoang Van Em', 'em.hoang@company.com', '0901234571', '1987-09-25', 'Male', '2020-05-01', '2020-05-01', 'Active', 4, 16000000, NOW(), NOW()),
('EMP006', 'Vu Thi Phuong', 'phuong.vu@company.com', '0901234572', '1991-12-03', 'Female', '2020-06-01', '2020-06-01', 'Active', 5, 14000000, NOW(), NOW()),
('EMP007', 'Dang Van Giang', 'giang.dang@company.com', '0901234573', '1986-08-14', 'Male', '2020-07-01', '2020-07-01', 'Active', 6, 17000000, NOW(), NOW()),
('EMP008', 'Bui Thi Hoa', 'hoa.bui@company.com', '0901234574', '1993-01-20', 'Female', '2020-08-01', '2020-08-01', 'Active', 7, 11000000, NOW(), NOW()),
('EMP009', 'Ngo Van Inh', 'inh.ngo@company.com', '0901234575', '1989-06-12', 'Male', '2020-09-01', '2020-09-01', 'Active', 8, 22000000, NOW(), NOW()),
('EMP010', 'Do Thi Kim', 'kim.do@company.com', '0901234576', '1994-04-08', 'Female', '2020-10-01', '2020-10-01', 'Probation', 1, 10000000, NOW(), NOW());

-- ============================================================
-- 4) Update Department Managers (sau khi employees đã được tạo)
-- ============================================================
-- Tạm thời disable constraint để update
ALTER TABLE departments DROP CONSTRAINT IF EXISTS departments_manager_id_fkey;

UPDATE departments SET manager_id = 1 WHERE department_id = 1; -- HR Manager
UPDATE departments SET manager_id = 2 WHERE department_id = 2; -- IT Manager
UPDATE departments SET manager_id = 4 WHERE department_id = 3; -- Finance Manager
UPDATE departments SET manager_id = 5 WHERE department_id = 4; -- Marketing Manager
UPDATE departments SET manager_id = 6 WHERE department_id = 5; -- Operations Manager
UPDATE departments SET manager_id = 7 WHERE department_id = 6; -- Sales Manager
UPDATE departments SET manager_id = 8 WHERE department_id = 7; -- Customer Service Manager
UPDATE departments SET manager_id = 9 WHERE department_id = 8; -- R&D Manager

-- Thêm lại constraint
ALTER TABLE departments
  ADD CONSTRAINT departments_manager_id_fkey
  FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
  ON UPDATE CASCADE ON DELETE SET NULL;

-- ============================================================
-- 5) Employee Positions
-- ============================================================
INSERT INTO employee_positions (employee_id, title, start_date, end_date, created_at) VALUES
-- HR Department
(1, 'HR Manager', '2020-01-15', NULL, NOW()),
(10, 'HR Assistant', '2020-10-01', NULL, NOW()),

-- IT Department
(2, 'IT Manager', '2020-02-01', NULL, NOW()),
(3, 'Senior Developer', '2020-03-01', NULL, NOW()),

-- Finance Department
(4, 'Finance Manager', '2020-04-01', NULL, NOW()),

-- Marketing Department
(5, 'Marketing Manager', '2020-05-01', NULL, NOW()),

-- Operations Department
(6, 'Operations Manager', '2020-06-01', NULL, NOW()),

-- Sales Department
(7, 'Sales Manager', '2020-07-01', NULL, NOW()),

-- Customer Service Department
(8, 'Customer Service Manager', '2020-08-01', NULL, NOW()),

-- R&D Department
(9, 'R&D Manager', '2020-09-01', NULL, NOW());

-- ============================================================
-- 6) Employee Salaries
-- ============================================================
INSERT INTO employee_salaries (employee_id, base_salary, effective_date, end_date, notes, created_at) VALUES
(1, 15000000, '2020-01-15', NULL, 'Initial salary', NOW()),
(2, 18000000, '2020-02-01', NULL, 'Initial salary', NOW()),
(3, 20000000, '2020-03-01', NULL, 'Initial salary', NOW()),
(4, 12000000, '2020-04-01', NULL, 'Initial salary', NOW()),
(5, 16000000, '2020-05-01', NULL, 'Initial salary', NOW()),
(6, 14000000, '2020-06-01', NULL, 'Initial salary', NOW()),
(7, 17000000, '2020-07-01', NULL, 'Initial salary', NOW()),
(8, 11000000, '2020-08-01', NULL, 'Initial salary', NOW()),
(9, 22000000, '2020-09-01', NULL, 'Initial salary', NOW()),
(10, 10000000, '2020-10-01', NULL, 'Probation salary', NOW());

-- ============================================================
-- 7) Employee Benefits
-- ============================================================
INSERT INTO employee_benefits (employee_id, type_id, amount, start_date, end_date, is_active, notes, created_at) VALUES
-- Transportation allowance for all employees
(1, 1, 2000000, '2020-01-15', NULL, true, 'Monthly transportation allowance', NOW()),
(2, 1, 2000000, '2020-02-01', NULL, true, 'Monthly transportation allowance', NOW()),
(3, 1, 2000000, '2020-03-01', NULL, true, 'Monthly transportation allowance', NOW()),
(4, 1, 2000000, '2020-04-01', NULL, true, 'Monthly transportation allowance', NOW()),
(5, 1, 2000000, '2020-05-01', NULL, true, 'Monthly transportation allowance', NOW()),
(6, 1, 2000000, '2020-06-01', NULL, true, 'Monthly transportation allowance', NOW()),
(7, 1, 2000000, '2020-07-01', NULL, true, 'Monthly transportation allowance', NOW()),
(8, 1, 2000000, '2020-08-01', NULL, true, 'Monthly transportation allowance', NOW()),
(9, 1, 2000000, '2020-09-01', NULL, true, 'Monthly transportation allowance', NOW()),
(10, 1, 2000000, '2020-10-01', NULL, true, 'Monthly transportation allowance', NOW()),

-- Meal allowance for all employees
(1, 2, 1000000, '2020-01-15', NULL, true, 'Monthly meal allowance', NOW()),
(2, 2, 1000000, '2020-02-01', NULL, true, 'Monthly meal allowance', NOW()),
(3, 2, 1000000, '2020-03-01', NULL, true, 'Monthly meal allowance', NOW()),
(4, 2, 1000000, '2020-04-01', NULL, true, 'Monthly meal allowance', NOW()),
(5, 2, 1000000, '2020-05-01', NULL, true, 'Monthly meal allowance', NOW()),
(6, 2, 1000000, '2020-06-01', NULL, true, 'Monthly meal allowance', NOW()),
(7, 2, 1000000, '2020-07-01', NULL, true, 'Monthly meal allowance', NOW()),
(8, 2, 1000000, '2020-08-01', NULL, true, 'Monthly meal allowance', NOW()),
(9, 2, 1000000, '2020-09-01', NULL, true, 'Monthly meal allowance', NOW()),
(10, 2, 1000000, '2020-10-01', NULL, true, 'Monthly meal allowance', NOW()),

-- Phone allowance for managers
(1, 3, 500000, '2020-01-15', NULL, true, 'Monthly phone allowance', NOW()),
(2, 3, 500000, '2020-02-01', NULL, true, 'Monthly phone allowance', NOW()),
(4, 3, 500000, '2020-04-01', NULL, true, 'Monthly phone allowance', NOW()),
(5, 3, 500000, '2020-05-01', NULL, true, 'Monthly phone allowance', NOW()),
(6, 3, 500000, '2020-06-01', NULL, true, 'Monthly phone allowance', NOW()),
(7, 3, 500000, '2020-07-01', NULL, true, 'Monthly phone allowance', NOW()),
(8, 3, 500000, '2020-08-01', NULL, true, 'Monthly phone allowance', NOW()),
(9, 3, 500000, '2020-09-01', NULL, true, 'Monthly phone allowance', NOW());

-- ============================================================
-- 8) Employee Contacts
-- ============================================================
INSERT INTO employee_contacts (employee_id, contact_name, relationship, phone, created_at) VALUES
(1, 'Nguyen Thi Lan', 'Spouse', '0901234580', NOW()),
(2, 'Tran Van Minh', 'Father', '0901234581', NOW()),
(3, 'Le Thi Hoa', 'Mother', '0901234582', NOW()),
(4, 'Pham Van Duc', 'Brother', '0901234583', NOW()),
(5, 'Hoang Thi Mai', 'Sister', '0901234584', NOW()),
(6, 'Vu Van Nam', 'Father', '0901234585', NOW()),
(7, 'Dang Thi Linh', 'Spouse', '0901234586', NOW()),
(8, 'Bui Van Tuan', 'Brother', '0901234587', NOW()),
(9, 'Ngo Thi Nga', 'Mother', '0901234588', NOW()),
(10, 'Do Van Hung', 'Father', '0901234589', NOW());

-- ============================================================
-- 9) Employee Documents
-- ============================================================
INSERT INTO employee_documents (employee_id, doc_type, file_path, issue_date, expiry_date, created_at) VALUES
(1, 'contract', '/documents/EMP001/contract_2020.pdf', '2020-01-15', '2023-01-15', NOW()),
(2, 'contract', '/documents/EMP002/contract_2020.pdf', '2020-02-01', '2023-02-01', NOW()),
(3, 'contract', '/documents/EMP003/contract_2020.pdf', '2020-03-01', '2023-03-01', NOW()),
(4, 'contract', '/documents/EMP004/contract_2020.pdf', '2020-04-01', '2023-04-01', NOW()),
(5, 'contract', '/documents/EMP005/contract_2020.pdf', '2020-05-01', '2023-05-01', NOW()),
(6, 'contract', '/documents/EMP006/contract_2020.pdf', '2020-06-01', '2023-06-01', NOW()),
(7, 'contract', '/documents/EMP007/contract_2020.pdf', '2020-07-01', '2023-07-01', NOW()),
(8, 'contract', '/documents/EMP008/contract_2020.pdf', '2020-08-01', '2023-08-01', NOW()),
(9, 'contract', '/documents/EMP009/contract_2020.pdf', '2020-09-01', '2023-09-01', NOW()),
(10, 'contract', '/documents/EMP010/contract_2020.pdf', '2020-10-01', '2021-10-01', NOW());

-- ============================================================
-- 10) Auth Users
-- ============================================================
INSERT INTO auth_users (employee_id, username, email, password_hash, role, created_at, updated_at) VALUES
(1, 'an.nguyen', 'an.nguyen@company.com', '$2b$10$example_hash_1', 'admin', NOW(), NOW()),
(2, 'binh.tran', 'binh.tran@company.com', '$2b$10$example_hash_2', 'hr', NOW(), NOW()),
(3, 'cuong.le', 'cuong.le@company.com', '$2b$10$example_hash_3', 'employee', NOW(), NOW()),
(4, 'dung.pham', 'dung.pham@company.com', '$2b$10$example_hash_4', 'hr', NOW(), NOW()),
(5, 'em.hoang', 'em.hoang@company.com', '$2b$10$example_hash_5', 'employee', NOW(), NOW()),
(6, 'phuong.vu', 'phuong.vu@company.com', '$2b$10$example_hash_6', 'employee', NOW(), NOW()),
(7, 'giang.dang', 'giang.dang@company.com', '$2b$10$example_hash_7', 'employee', NOW(), NOW()),
(8, 'hoa.bui', 'hoa.bui@company.com', '$2b$10$example_hash_8', 'employee', NOW(), NOW()),
(9, 'inh.ngo', 'inh.ngo@company.com', '$2b$10$example_hash_9', 'employee', NOW(), NOW()),
(10, 'kim.do', 'kim.do@company.com', '$2b$10$example_hash_10', 'employee', NOW(), NOW());
