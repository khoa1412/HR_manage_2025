-- =============================================
-- HR Management System Database Schema
-- Generated from Prisma schema.prisma
-- =============================================

-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE hrm_database;
-- \c hrm_database;

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS absent CASCADE;
DROP TABLE IF EXISTS tax CASCADE;
DROP TABLE IF EXISTS insurances CASCADE;
DROP TABLE IF EXISTS contract CASCADE;
DROP TABLE IF EXISTS contract_types CASCADE;
DROP TABLE IF EXISTS resign_info CASCADE;
DROP TABLE IF EXISTS salary CASCADE;
DROP TABLE IF EXISTS pos_info CASCADE;
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS tax_n_insurance CASCADE;
DROP TABLE IF EXISTS emergency_contact CASCADE;
DROP TABLE IF EXISTS contact CASCADE;
DROP TABLE IF EXISTS citizen_id CASCADE;
DROP TABLE IF EXISTS staff_acc CASCADE;
DROP TABLE IF EXISTS staff_info CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS gender_enum CASCADE;
DROP TYPE IF EXISTS period_type_enum CASCADE;
DROP TYPE IF EXISTS attendance_type_enum CASCADE;
DROP TYPE IF EXISTS leave_status_enum CASCADE;
DROP TYPE IF EXISTS absent_name_enum CASCADE;
DROP TYPE IF EXISTS staff_role_enum CASCADE;

-- =============================================
-- Create ENUMs
-- =============================================

CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE period_type_enum AS ENUM ('monthly', 'yearly');
CREATE TYPE attendance_type_enum AS ENUM ('present', 'absent', 'late');
CREATE TYPE leave_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE absent_name_enum AS ENUM ('paid_leave', 'persona_leave');
CREATE TYPE staff_role_enum AS ENUM ('staff', 'chief', 'hr_staff', 'hr_manager');

-- =============================================
-- Create Tables
-- =============================================

-- Core staff information table
CREATE TABLE staff_info (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_birth DATE,
    place_birth VARCHAR(100),
    gender gender_enum,
    marital_status VARCHAR(20),
    is_active BOOLEAN DEFAULT true
);

-- Staff account table (1-1 with staff_info)
CREATE TABLE staff_acc (
    id SERIAL PRIMARY KEY,
    staff_name VARCHAR(50),
    role staff_role_enum NOT NULL,
    acc_name VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    staff_code VARCHAR(20) UNIQUE NOT NULL,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Citizen ID table (1-1 with staff_info)
CREATE TABLE citizen_id (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) UNIQUE NOT NULL,
    cccd VARCHAR(20) UNIQUE NOT NULL,
    date_issue DATE,
    place_issue VARCHAR(100),
    image_front_cccd TEXT,
    image_back_cccd TEXT,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Contact information table (1-1 with staff_info)
CREATE TABLE contact (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) UNIQUE NOT NULL,
    temp_address TEXT,
    permant_address TEXT,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Emergency contact table (1-1 with staff_info)
CREATE TABLE emergency_contact (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(100),
    name_emergency VARCHAR(100),
    relationship VARCHAR(50),
    rela_phone VARCHAR(15),
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Tax and insurance table (1-1 with staff_info)
CREATE TABLE tax_n_insurance (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) UNIQUE NOT NULL,
    social_insuran VARCHAR(20),
    tax_code VARCHAR(20) UNIQUE,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Education table (1-n with staff_info)
CREATE TABLE education (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL,
    degree VARCHAR(100),
    institution VARCHAR(100),
    major VARCHAR(100),
    year INTEGER CHECK (year >= 1900),
    attachment_image TEXT,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Certifications table (1-n with staff_info)
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL,
    language VARCHAR(50),
    level VARCHAR(50),
    score DECIMAL(5,2),
    attachment_image TEXT,
    issue_at DATE,
    expires_at DATE,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Department table
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    day_create DATE DEFAULT CURRENT_DATE
);

-- Position information table (1-n with staff_info, n-1 with department)
CREATE TABLE pos_info (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL,
    department_id INTEGER,
    position VARCHAR(100),
    effective_date DATE,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE SET NULL
);

-- Salary table (1-n with staff_info)
CREATE TABLE salary (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL,
    base_salary DECIMAL(12,2) NOT NULL,
    perform_bonus DECIMAL(12,2),
    effective_date DATE,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Resign information table (1-1 optional with staff_info)
CREATE TABLE resign_info (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) UNIQUE NOT NULL,
    leave_day DATE,
    items_employee TEXT,
    items_company TEXT,
    social_insuran_detach TEXT,
    terminate_decision TEXT,
    tax_withhold_paper TEXT,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Contract types master table
CREATE TABLE contract_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Contract table (1-n with staff_info, n-1 with contract_types)
CREATE TABLE contract (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL,
    type INTEGER,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE,
    FOREIGN KEY (type) REFERENCES contract_types(id) ON DELETE SET NULL
);

-- Insurances table (1-n with staff_info)
CREATE TABLE insurances (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20),
    month DATE NOT NULL,
    staff_bhxh DECIMAL(12,2),
    staff_bhyt DECIMAL(12,2),
    staff_bhtn DECIMAL(12,2),
    company_contribution DECIMAL(12,2),
    created_by VARCHAR(20),
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE SET NULL
);

-- Tax table (1-n with staff_info)
CREATE TABLE tax (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL,
    tax_type VARCHAR(50),
    period_type period_type_enum NOT NULL,
    amount DECIMAL(12,2),
    dependents INTEGER DEFAULT 0,
    update_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20),
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE
);

-- Absent types table
CREATE TABLE absent (
    id SERIAL PRIMARY KEY,
    name absent_name_enum NOT NULL,
    description TEXT
);

-- Leave requests table (1-n with staff_info, 1-n with absent)
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL,
    start_date DATE,
    end_date DATE,
    note TEXT,
    status leave_status_enum NOT NULL,
    req_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    absent_id INTEGER,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE,
    FOREIGN KEY (absent_id) REFERENCES absent(id) ON DELETE SET NULL
);

-- Attendance table (1-n with staff_info, n-1 optional with leave_requests)
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL,
    checkin TIMESTAMP,
    checkout TIMESTAMP,
    atten_type attendance_type_enum NOT NULL,
    leave_req_id INTEGER,
    FOREIGN KEY (staff_code) REFERENCES staff_info(staff_code) ON DELETE CASCADE,
    FOREIGN KEY (leave_req_id) REFERENCES leave_requests(id) ON DELETE SET NULL
);

-- =============================================
-- Create Indexes
-- =============================================

-- Staff account indexes
CREATE INDEX idx_staff_acc_staff_code ON staff_acc(staff_code);

-- Citizen ID indexes
CREATE INDEX idx_citizen_id_staff_code ON citizen_id(staff_code);

-- Education indexes
CREATE INDEX idx_education_staff_code ON education(staff_code);

-- Certifications indexes
CREATE INDEX idx_certifications_staff_code ON certifications(staff_code);

-- Position info indexes
CREATE INDEX idx_pos_info_staff_code ON pos_info(staff_code);
CREATE INDEX idx_pos_info_department_id ON pos_info(department_id);

-- Salary indexes
CREATE INDEX idx_salary_staff_code ON salary(staff_code);

-- Contract indexes
CREATE INDEX idx_contract_staff_code ON contract(staff_code);
CREATE INDEX idx_contract_type ON contract(type);

-- Insurances indexes
CREATE INDEX idx_insurances_staff_code ON insurances(staff_code);

-- Tax indexes
CREATE INDEX idx_tax_staff_code ON tax(staff_code);

-- Leave requests indexes
CREATE INDEX idx_leave_requests_staff_code ON leave_requests(staff_code);
CREATE INDEX idx_leave_requests_absent_id ON leave_requests(absent_id);

-- Attendance indexes
CREATE INDEX idx_attendance_staff_code ON attendance(staff_code);
CREATE INDEX idx_attendance_leave_req_id ON attendance(leave_req_id);

-- =============================================
-- Insert Sample Data
-- =============================================

-- Insert sample contract types
INSERT INTO contract_types (name, description) VALUES
('Full-time', 'Full-time employment contract'),
('Part-time', 'Part-time employment contract'),
('Internship', 'Internship contract'),
('Contractor', 'Contractor agreement');

-- Insert sample absent types
INSERT INTO absent (name, description) VALUES
('paid_leave', 'Annual paid leave (12 days per year)'),
('persona_leave', 'Personal leave beyond annual quota');

-- Insert sample departments
INSERT INTO department (department_name, description) VALUES
('Human Resources', 'HR Department'),
('Information Technology', 'IT Department'),
('Finance', 'Finance Department'),
('Marketing', 'Marketing Department'),
('Operations', 'Operations Department');

-- =============================================
-- Comments
-- =============================================

COMMENT ON TABLE staff_info IS 'Core staff information table - main entity';
COMMENT ON TABLE staff_acc IS 'Staff account credentials (1-1 with staff_info)';
COMMENT ON TABLE citizen_id IS 'Citizen ID information (1-1 with staff_info)';
COMMENT ON TABLE contact IS 'Contact information (1-1 with staff_info)';
COMMENT ON TABLE emergency_contact IS 'Emergency contact details (1-1 with staff_info)';
COMMENT ON TABLE tax_n_insurance IS 'Tax and insurance information (1-1 with staff_info)';
COMMENT ON TABLE education IS 'Education history (1-n with staff_info)';
COMMENT ON TABLE certifications IS 'Certifications and qualifications (1-n with staff_info)';
COMMENT ON TABLE pos_info IS 'Position history (1-n with staff_info, n-1 with department)';
COMMENT ON TABLE salary IS 'Salary history (1-n with staff_info)';
COMMENT ON TABLE resign_info IS 'Resignation information (1-1 optional with staff_info)';
COMMENT ON TABLE contract_types IS 'Master table for contract types';
COMMENT ON TABLE contract IS 'Contract history (1-n with staff_info, n-1 with contract_types)';
COMMENT ON TABLE insurances IS 'Insurance contributions by month (1-n with staff_info)';
COMMENT ON TABLE tax IS 'Tax information (1-n with staff_info)';
COMMENT ON TABLE absent IS 'Absent types master table';
COMMENT ON TABLE leave_requests IS 'Leave requests (1-n with staff_info, 1-n with absent)';
COMMENT ON TABLE attendance IS 'Attendance records (1-n with staff_info, n-1 optional with leave_requests)';

-- =============================================
-- End of Schema
-- =============================================
