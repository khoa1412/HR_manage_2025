-- ============================================================
-- Employee Database Structure
-- HR Management System - Employee Module
-- ============================================================

-- ============================================================
-- 0) Extensions
-- ============================================================
-- Cần cho EXCLUDE USING gist trên daterange
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- 1) Enum types / Domains
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employment_status_enum') THEN
    CREATE TYPE employment_status_enum AS ENUM ('Active','Inactive','Probation','Terminated');
  END IF;
END$$;

-- ============================================================
-- 2) Core master data - Tạo departments trước (không có FK đến employees)
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  department_id   BIGSERIAL PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  manager_id      BIGINT, -- sẽ thêm FK sau khi employees tạo
  parent_id       BIGINT REFERENCES departments(department_id) ON UPDATE CASCADE ON DELETE SET NULL,
  budget          NUMERIC(15,2),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_departments_name UNIQUE (name)
);

-- Tạo bảng employees
CREATE TABLE IF NOT EXISTS employees (
  employee_id     BIGSERIAL PRIMARY KEY,
  employee_code   VARCHAR(50)  NOT NULL UNIQUE,
  full_name       VARCHAR(200) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  phone           VARCHAR(50),
  dob             DATE,
  birth_place     VARCHAR(200),
  gender          VARCHAR(10),
  cccd_number     VARCHAR(20),
  cccd_issue_date DATE,
  cccd_issue_place VARCHAR(200),
  marital_status  VARCHAR(50),
  
  -- Thông tin liên hệ
  personal_phone  VARCHAR(50),
  personal_email  VARCHAR(150),
  temporary_address TEXT,
  permanent_address TEXT,
  
  -- Thông tin liên hệ khẩn cấp
  emergency_contact_name VARCHAR(200),
  emergency_contact_relation VARCHAR(50),
  emergency_contact_phone VARCHAR(50),
  
  -- Thông tin học vấn
  highest_degree  VARCHAR(100),
  university      VARCHAR(200),
  major           VARCHAR(200),
  other_certificates TEXT,
  languages       VARCHAR(200),
  language_level  VARCHAR(200),
  
  -- Thông tin Thuế - BHXH
  social_insurance_code VARCHAR(20),
  tax_code        VARCHAR(20),
  
  -- Thông tin công việc
  department      VARCHAR(200),
  position        VARCHAR(200),
  level           VARCHAR(100),
  title           VARCHAR(200),
  contract_type   VARCHAR(100),
  start_date      DATE,
  contract_duration VARCHAR(50),
  end_date        DATE,
  probation_salary NUMERIC(12,2),
  official_salary NUMERIC(12,2),
  
  -- Phúc lợi
  fuel_allowance  NUMERIC(12,2),
  meal_allowance  NUMERIC(12,2),
  transport_allowance NUMERIC(12,2),
  uniform_allowance NUMERIC(12,2),
  performance_bonus NUMERIC(5,2), -- percentage
  
  hire_date       DATE NOT NULL,
  join_date       DATE, -- dùng cho API
  status          employment_status_enum NOT NULL DEFAULT 'Active',
  department_id   BIGINT REFERENCES departments(department_id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Bổ sung lại FK manager_id sau khi employees đã tồn tại
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'departments_manager_id_fkey'
  ) THEN
    ALTER TABLE departments
      ADD CONSTRAINT departments_manager_id_fkey
      FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
      ON UPDATE CASCADE ON DELETE SET NULL;
  END IF;
END$$;

-- ============================================================
-- 3) Employment history (positions & salaries)
-- ============================================================
CREATE TABLE IF NOT EXISTS employee_positions (
  position_id     BIGSERIAL PRIMARY KEY,
  employee_id     BIGINT NOT NULL REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  title           VARCHAR(150) NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_pos_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- chống chồng lấn giai đoạn position cho 1 employee
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'ex_positions_no_overlap'
  ) THEN
    ALTER TABLE employee_positions
      ADD CONSTRAINT ex_positions_no_overlap
      EXCLUDE USING gist (
        employee_id WITH =,
        daterange(start_date, COALESCE(end_date, DATE '9999-12-31'), '[]') WITH &&
      );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS employee_salaries (
  salary_id       BIGSERIAL PRIMARY KEY,
  employee_id     BIGINT NOT NULL REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  base_salary     NUMERIC(12,2) NOT NULL,
  effective_date  DATE NOT NULL,
  end_date        DATE,
  notes           TEXT,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_salary_dates CHECK (end_date IS NULL OR end_date >= effective_date)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'ex_salaries_no_overlap'
  ) THEN
    ALTER TABLE employee_salaries
      ADD CONSTRAINT ex_salaries_no_overlap
      EXCLUDE USING gist (
        employee_id WITH =,
        daterange(effective_date, COALESCE(end_date, DATE '9999-12-31'), '[]') WITH &&
      );
  END IF;
END$$;

-- thành phần lương (allowance/bonus/insurance/tax/deduction/other)
CREATE TABLE IF NOT EXISTS employee_payroll_components (
  component_id    BIGSERIAL PRIMARY KEY,
  employee_id     BIGINT NOT NULL REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  salary_id       BIGINT REFERENCES employee_salaries(salary_id) ON UPDATE CASCADE ON DELETE SET NULL,
  component_type  VARCHAR(50) NOT NULL CHECK (component_type IN ('allowance','bonus','insurance','tax','deduction','other')),
  amount          NUMERIC(12,2) NOT NULL,
  description     TEXT,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4) Benefits
-- ============================================================
CREATE TABLE IF NOT EXISTS benefit_types (
  type_id         BIGSERIAL PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  type            VARCHAR(50)  NOT NULL CHECK (type IN ('allowance','bonus','insurance','benefit','reimbursement')),
  category        VARCHAR(100),
  unit            VARCHAR(50),
  description     TEXT,
  is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_benefit_types_name UNIQUE (name, type)
);

CREATE TABLE IF NOT EXISTS employee_benefits (
  benefit_id      BIGSERIAL PRIMARY KEY,
  employee_id     BIGINT NOT NULL REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  type_id         BIGINT NOT NULL REFERENCES benefit_types(type_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  amount          NUMERIC(12,2),
  start_date      DATE NOT NULL,
  end_date        DATE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  notes           TEXT,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_benefit_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'ex_benefits_no_overlap'
  ) THEN
    ALTER TABLE employee_benefits
      ADD CONSTRAINT ex_benefits_no_overlap
      EXCLUDE USING gist (
        employee_id WITH =,
        type_id     WITH =,
        daterange(start_date, COALESCE(end_date, DATE '9999-12-31'), '[]') WITH &&
      );
  END IF;
END$$;

-- ============================================================
-- 5) Contacts & Documents
-- ============================================================
CREATE TABLE IF NOT EXISTS employee_contacts (
  contact_id      BIGSERIAL PRIMARY KEY,
  employee_id     BIGINT NOT NULL REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  contact_name    VARCHAR(150),
  relationship    VARCHAR(50),
  phone           VARCHAR(50),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_documents (
  doc_id          BIGSERIAL PRIMARY KEY,
  employee_id     BIGINT NOT NULL REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  doc_type        VARCHAR(50) NOT NULL CHECK (doc_type IN ('contract','appointment','certificate','other')),
  file_path       VARCHAR(255),
  issue_date      DATE,
  expiry_date     DATE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_doc_dates CHECK (expiry_date IS NULL OR issue_date IS NULL OR expiry_date >= issue_date)
);

-- ============================================================
-- 6) Auth & Users
-- ============================================================
CREATE TABLE IF NOT EXISTS auth_users (
  user_id         BIGSERIAL PRIMARY KEY,
  employee_id     BIGINT REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE SET NULL,
  username        VARCHAR(100) NOT NULL UNIQUE,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(20)  NOT NULL CHECK (role IN ('admin','hr','employee')),
  last_login      TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7) Updated_at triggers (generic)
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- áp dụng cho các bảng có updated_at
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT unnest(ARRAY['employees','departments','auth_users']) AS tbl
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I;', r.tbl, r.tbl);
    EXECUTE format($f$
      CREATE TRIGGER trg_%1$s_updated_at
      BEFORE UPDATE ON %1$I
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    $f$, r.tbl);
  END LOOP;
END$$;

-- ============================================================
-- 8) API-aligned views
-- ============================================================
-- Vị trí hiện tại: chọn record mới nhất theo end_date (NULL là lớn nhất)
CREATE OR REPLACE VIEW v_current_positions AS
SELECT DISTINCT ON (ep.employee_id)
  ep.employee_id,
  ep.title AS position,
  ep.start_date,
  ep.end_date
FROM employee_positions ep
ORDER BY ep.employee_id,
         COALESCE(ep.end_date, DATE '9999-12-31') DESC,
         ep.start_date DESC;

-- View trả về đúng shape Employee cho API
CREATE OR REPLACE VIEW v_employees_api AS
SELECT
  e.employee_id::text            AS "id",
  e.employee_code                AS "employeeCode",
  e.full_name                    AS "fullName",
  e.email,
  e.phone,
  d.name                         AS "department",
  cp.position                    AS "position",
  e.join_date                    AS "joinDate",
  CASE e.status
    WHEN 'Terminated' THEN 'Inactive'::text
    ELSE e.status::text
  END                            AS "status",
  e.official_salary              AS "officialSalary"
FROM employees e
LEFT JOIN departments d ON d.department_id = e.department_id
LEFT JOIN v_current_positions cp ON cp.employee_id = e.employee_id;

-- ============================================================
-- 9) Indexing cho hiệu năng UI/API
-- ============================================================
-- employees
CREATE INDEX IF NOT EXISTS idx_employees_dept      ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_status    ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_join_date ON employees(join_date);
CREATE INDEX IF NOT EXISTS idx_employees_code      ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_active    ON employees(employee_id) WHERE status = 'Active';

-- positions / salaries theo thời gian
CREATE INDEX IF NOT EXISTS idx_positions_emp_dates
  ON employee_positions(employee_id, COALESCE(end_date, DATE '9999-12-31') DESC, start_date DESC);

CREATE INDEX IF NOT EXISTS idx_salaries_emp_eff
  ON employee_salaries(employee_id, COALESCE(end_date, DATE '9999-12-31') DESC, effective_date DESC);

-- benefits
CREATE INDEX IF NOT EXISTS idx_benefits_employee   ON employee_benefits(employee_id);
CREATE INDEX IF NOT EXISTS idx_benefits_emp_type   ON employee_benefits(employee_id, type_id, start_date);

-- contacts, docs, auth
CREATE INDEX IF NOT EXISTS idx_contacts_employee   ON employee_contacts(employee_id);
CREATE INDEX IF NOT EXISTS idx_docs_employee       ON employee_documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_auth_employee       ON auth_users(employee_id);
