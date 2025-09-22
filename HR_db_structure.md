#Table staff_acc:
id | staff_name | role | acc_name | password_hash

-- SCHEMA:
    id SERIAL PRIMARY KEY,
    staff_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('staff','SysAdmin','manager','hr_staff','hr_manager')) NOT NULL,
    acc_name VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code) 
--

#Table staff_info:
id | full_name | date_birth | place_birth | gender | marital_status | staff_code | is_active

-- SCHEMA:
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) UNIQUE NOT NULL, -- Business key (immutable)
    full_name VARCHAR(100) NOT NULL,
    date_birth DATE,
    place_birth VARCHAR(100),
    gender VARCHAR(10) CHECK (gender IN ('male','female','other')),
    marital_status VARCHAR(20),
    is_active BOOLEAN DEFAULT true 
--

#Table citizen_id:
id | staff_code | cccd | date_issue | place_issue | image_front_cccd | image_back_cccd 

-- SCHEMA:
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    cccd VARCHAR(20) UNIQUE NOT NULL,
    date_issue DATE,
    place_issue VARCHAR(100),
    image_front_cccd BYTEA,
    image_back_cccd BYTEA
--

#Table contact:
id | staff_code | temp_address | permant_address

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    temp_address TEXT,
    permant_address TEXT
--

#Table emergency_contact:
id | staff_code | phone_number | email | name_emergency | relationship | rela_phone

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    phone_number VARCHAR(15),
    email VARCHAR(100),
    name_emergency VARCHAR(100),
    relationship VARCHAR(50),
    rela_phone VARCHAR(15)
--

#Table tax_n_insurance:
id | staff_code | social_insuran | tax_code

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    social_insuran VARCHAR(20),
    tax_code VARCHAR(20) UNIQUE
--

#Table education:
id| staff_code | degree | institution | major | year | attachment_image

-- SCHEMA    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    degree VARCHAR(100),
    institution VARCHAR(100),
    major VARCHAR(100),
    year INT CHECK (year >= 1900),
    attachment_image TEXT
--

#Table certifications:
id | staff_code | language | level | score | attachment_image | issue_at | expires_at

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    language VARCHAR(50),
    level VARCHAR(50),
    score NUMERIC(5,2),
    attachment_image TEXT,
    issue_at DATE,
    expires_at DATE
--

#Table pos_info:
id | staff_code | department_id | position | effective_date

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    department_id INT REFERENCES department(department_id),
    position VARCHAR(100),
    effective_date DATE
--

#Table salary:
id | staff_code | base_salary | perform_bonus | effective_date


-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    base_salary NUMERIC(12,2) NOT NULL,
    perform_bonus NUMERIC(12,2),
    effective_date DATE
--

#Table resign_info: 
id | staff_code | leave_day | items_employee | items_company | social_insuran_detach | terminate_decision | tax_withhold_paper

-- SCHEMA    
	id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    leave_day DATE,
    items_employee TEXT,
    items_company TEXT,
    social_insuran_detach TEXT,
    terminate_decision BYTEA,
    tax_withhold_paper BYTEA
--

** lưu ý  : social_insuran_detach TEXT là url đường dẫn chứ không phải text thông thường **
#Table contract:
id | staff_code | contract_type | start_date | end_date

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    contract_type VARCHAR(50),
    start_date DATE,
    end_date DATE
--

#Table insurances:
id | staff_code | month | staff_bhxh | staff_bhyt | staff_bhtn | company_contribution | created_by

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    month DATE NOT NULL,
    staff_bhxh NUMERIC(12,2),
    staff_bhyt NUMERIC(12,2),
    staff_bhtn NUMERIC(12,2),
    company_contribution NUMERIC(12,2),
    created_by VARCHAR(20)
--

#Table tax:
id | staff_code | tax_type | period_type | amount | dependents | update_at | created_by

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    tax_type VARCHAR(50),
    period_type ENUM ('monthly','yearly')),
    amount NUMERIC(12,2),
    dependents INT DEFAULT 0,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20)
--

#Table department:
department_id | department_name | description | day_create

-- SCHEMA
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    day_create DATE DEFAULT CURRENT_DATE
--

#Table attendance: (chấm công)
id | staff_code | checkin | checkout | atten_type | leave_req_id

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    checkin TIMESTAMP,
    checkout TIMESTAMP,
    atten_type ENUM ('present','absent','late')),
    leave_req_id INT REFERENCES leave_requests(id)
--

#Table leave_requests: (nghỉ phép)
id | staff_code | start_date | end_date | note | status | req_at | absent_id

-- SCHEMA
    id SERIAL PRIMARY KEY,
    staff_code VARCHAR(20) REFERENCES staff_info(staff_code),
    start_date DATE,
    end_date DATE,
    note TEXT,
    status VARCHAR(20) CHECK (status IN ('pending','approved','rejected')),
    req_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    absent_id INT REFERENCES absent(id)
--

#Table absent: (bảng định nghĩa nghỉ phép)
id | name | description 

-- SCHEMA
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) CHECK (name IN ('paid_leave','persona_leave')),
    description TEXT
--

- name ENUM ('paid_leave', 'persona_leave') - paid_leave: nghỉ phép được quy định (12 ngày 1 năm), persona_leave: nghỉ ngoài 12 ngày quy định
- description: mô tả cụ thể các ngày loại nghỉ  