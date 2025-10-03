--
-- PostgreSQL database dump
--

\restrict l0IPqR0dfFLcbeotaQLHmWdEWyvi6I3w7SMqPEsumLGQRfSQXPQbFOyVMqZcWed

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-10-03 10:55:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 20853)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 875 (class 1247 OID 20869)
-- Name: employment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.employment_status_enum AS ENUM (
    'Active',
    'Inactive',
    'Probation',
    'Terminated'
);


SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 20854)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 20878)
-- Name: auth_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_users (
    user_id bigint NOT NULL,
    employee_id bigint,
    username character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    last_login timestamp(6) without time zone,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 20877)
-- Name: auth_users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 220
-- Name: auth_users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_users_user_id_seq OWNED BY public.auth_users.user_id;


--
-- TOC entry 223 (class 1259 OID 20896)
-- Name: benefit_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.benefit_types (
    type_id bigint NOT NULL,
    name character varying(150) NOT NULL,
    type character varying(50) NOT NULL,
    category character varying(100),
    unit character varying(50),
    description text,
    is_custom boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 20895)
-- Name: benefit_types_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.benefit_types_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 222
-- Name: benefit_types_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.benefit_types_type_id_seq OWNED BY public.benefit_types.type_id;


--
-- TOC entry 225 (class 1259 OID 20912)
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    department_id bigint NOT NULL,
    name character varying(150) NOT NULL,
    manager_id bigint,
    parent_id bigint,
    budget numeric(15,2),
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 20911)
-- Name: departments_department_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_department_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 224
-- Name: departments_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_department_id_seq OWNED BY public.departments.department_id;


--
-- TOC entry 227 (class 1259 OID 20925)
-- Name: employee_benefits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_benefits (
    benefit_id bigint NOT NULL,
    employee_id bigint NOT NULL,
    type_id bigint NOT NULL,
    amount numeric(12,2),
    start_date date NOT NULL,
    end_date date,
    is_active boolean DEFAULT true NOT NULL,
    notes text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 20924)
-- Name: employee_benefits_benefit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_benefits_benefit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 226
-- Name: employee_benefits_benefit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_benefits_benefit_id_seq OWNED BY public.employee_benefits.benefit_id;


--
-- TOC entry 229 (class 1259 OID 20942)
-- Name: employee_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_contacts (
    contact_id bigint NOT NULL,
    employee_id bigint NOT NULL,
    contact_name character varying(150),
    relationship character varying(50),
    phone character varying(50),
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 20941)
-- Name: employee_contacts_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_contacts_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 228
-- Name: employee_contacts_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_contacts_contact_id_seq OWNED BY public.employee_contacts.contact_id;


--
-- TOC entry 231 (class 1259 OID 20953)
-- Name: employee_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_documents (
    doc_id bigint NOT NULL,
    employee_id bigint NOT NULL,
    doc_type character varying(50) NOT NULL,
    file_path character varying(255),
    issue_date date,
    expiry_date date,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 20952)
-- Name: employee_documents_doc_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_documents_doc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 230
-- Name: employee_documents_doc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_documents_doc_id_seq OWNED BY public.employee_documents.doc_id;


--
-- TOC entry 233 (class 1259 OID 20965)
-- Name: employee_payroll_components; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_payroll_components (
    component_id bigint NOT NULL,
    employee_id bigint NOT NULL,
    salary_id bigint,
    component_type character varying(50) NOT NULL,
    amount numeric(12,2) NOT NULL,
    description text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 20964)
-- Name: employee_payroll_components_component_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_payroll_components_component_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 232
-- Name: employee_payroll_components_component_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_payroll_components_component_id_seq OWNED BY public.employee_payroll_components.component_id;


--
-- TOC entry 235 (class 1259 OID 20980)
-- Name: employee_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_positions (
    position_id bigint NOT NULL,
    employee_id bigint NOT NULL,
    title character varying(150) NOT NULL,
    start_date date NOT NULL,
    end_date date,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 20979)
-- Name: employee_positions_position_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_positions_position_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 234
-- Name: employee_positions_position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_positions_position_id_seq OWNED BY public.employee_positions.position_id;


--
-- TOC entry 237 (class 1259 OID 20993)
-- Name: employee_salaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_salaries (
    salary_id bigint NOT NULL,
    employee_id bigint NOT NULL,
    base_salary numeric(12,2) NOT NULL,
    effective_date date NOT NULL,
    end_date date,
    notes text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 20992)
-- Name: employee_salaries_salary_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_salaries_salary_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 236
-- Name: employee_salaries_salary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_salaries_salary_id_seq OWNED BY public.employee_salaries.salary_id;


--
-- TOC entry 239 (class 1259 OID 21008)
-- Name: employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees (
    employee_id bigint NOT NULL,
    employee_code character varying(50) NOT NULL,
    full_name character varying(200) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(50),
    dob date,
    birth_place character varying(200),
    gender character varying(10),
    cccd_number character varying(20),
    cccd_issue_date date,
    cccd_issue_place character varying(200),
    marital_status character varying(50),
    personal_phone character varying(50),
    personal_email character varying(150),
    temporary_address text,
    permanent_address text,
    emergency_contact_name character varying(200),
    emergency_contact_relation character varying(50),
    emergency_contact_phone character varying(50),
    highest_degree character varying(100),
    university character varying(200),
    major character varying(200),
    other_certificates text,
    languages character varying(200),
    language_level character varying(200),
    social_insurance_code character varying(20),
    tax_code character varying(20),
    department character varying(200),
    "position" character varying(200),
    level character varying(100),
    title character varying(200),
    contract_type character varying(100),
    start_date date,
    contract_duration character varying(50),
    end_date date,
    probation_salary numeric(12,2),
    official_salary numeric(12,2),
    fuel_allowance numeric(12,2),
    meal_allowance numeric(12,2),
    transport_allowance numeric(12,2),
    uniform_allowance numeric(12,2),
    performance_bonus numeric(5,2),
    hire_date date NOT NULL,
    join_date date,
    status public.employment_status_enum DEFAULT 'Active'::public.employment_status_enum NOT NULL,
    department_id bigint,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 21007)
-- Name: employees_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employees_employee_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 238
-- Name: employees_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employees_employee_id_seq OWNED BY public.employees.employee_id;


--
-- TOC entry 4809 (class 2604 OID 20881)
-- Name: auth_users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_users ALTER COLUMN user_id SET DEFAULT nextval('public.auth_users_user_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 20899)
-- Name: benefit_types type_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.benefit_types ALTER COLUMN type_id SET DEFAULT nextval('public.benefit_types_type_id_seq'::regclass);


--
-- TOC entry 4815 (class 2604 OID 20915)
-- Name: departments department_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN department_id SET DEFAULT nextval('public.departments_department_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 20928)
-- Name: employee_benefits benefit_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_benefits ALTER COLUMN benefit_id SET DEFAULT nextval('public.employee_benefits_benefit_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 20945)
-- Name: employee_contacts contact_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_contacts ALTER COLUMN contact_id SET DEFAULT nextval('public.employee_contacts_contact_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 20956)
-- Name: employee_documents doc_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_documents ALTER COLUMN doc_id SET DEFAULT nextval('public.employee_documents_doc_id_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 20968)
-- Name: employee_payroll_components component_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_payroll_components ALTER COLUMN component_id SET DEFAULT nextval('public.employee_payroll_components_component_id_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 20983)
-- Name: employee_positions position_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_positions ALTER COLUMN position_id SET DEFAULT nextval('public.employee_positions_position_id_seq'::regclass);


--
-- TOC entry 4829 (class 2604 OID 20996)
-- Name: employee_salaries salary_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_salaries ALTER COLUMN salary_id SET DEFAULT nextval('public.employee_salaries_salary_id_seq'::regclass);


--
-- TOC entry 4831 (class 2604 OID 21011)
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_employee_id_seq'::regclass);


--
-- TOC entry 4836 (class 2606 OID 20867)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4839 (class 2606 OID 20894)
-- Name: auth_users auth_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4843 (class 2606 OID 20910)
-- Name: benefit_types benefit_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.benefit_types
    ADD CONSTRAINT benefit_types_pkey PRIMARY KEY (type_id);


--
-- TOC entry 4846 (class 2606 OID 20923)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- TOC entry 4849 (class 2606 OID 20940)
-- Name: employee_benefits employee_benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_benefits
    ADD CONSTRAINT employee_benefits_pkey PRIMARY KEY (benefit_id);


--
-- TOC entry 4853 (class 2606 OID 20951)
-- Name: employee_contacts employee_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_contacts
    ADD CONSTRAINT employee_contacts_pkey PRIMARY KEY (contact_id);


--
-- TOC entry 4856 (class 2606 OID 20963)
-- Name: employee_documents employee_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_documents
    ADD CONSTRAINT employee_documents_pkey PRIMARY KEY (doc_id);


--
-- TOC entry 4859 (class 2606 OID 20978)
-- Name: employee_payroll_components employee_payroll_components_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_payroll_components
    ADD CONSTRAINT employee_payroll_components_pkey PRIMARY KEY (component_id);


--
-- TOC entry 4861 (class 2606 OID 20991)
-- Name: employee_positions employee_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_positions
    ADD CONSTRAINT employee_positions_pkey PRIMARY KEY (position_id);


--
-- TOC entry 4863 (class 2606 OID 21006)
-- Name: employee_salaries employee_salaries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_salaries
    ADD CONSTRAINT employee_salaries_pkey PRIMARY KEY (salary_id);


--
-- TOC entry 4867 (class 2606 OID 21026)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- TOC entry 4837 (class 1259 OID 21028)
-- Name: auth_users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX auth_users_email_key ON public.auth_users USING btree (email);


--
-- TOC entry 4840 (class 1259 OID 21027)
-- Name: auth_users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX auth_users_username_key ON public.auth_users USING btree (username);


--
-- TOC entry 4864 (class 1259 OID 21037)
-- Name: employees_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email);


--
-- TOC entry 4865 (class 1259 OID 21036)
-- Name: employees_employee_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX employees_employee_code_key ON public.employees USING btree (employee_code);


--
-- TOC entry 4841 (class 1259 OID 21029)
-- Name: idx_auth_employee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_employee ON public.auth_users USING btree (employee_id);


--
-- TOC entry 4850 (class 1259 OID 21032)
-- Name: idx_benefits_emp_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_benefits_emp_type ON public.employee_benefits USING btree (employee_id, type_id, start_date);


--
-- TOC entry 4851 (class 1259 OID 21033)
-- Name: idx_benefits_employee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_benefits_employee ON public.employee_benefits USING btree (employee_id);


--
-- TOC entry 4854 (class 1259 OID 21034)
-- Name: idx_contacts_employee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contacts_employee ON public.employee_contacts USING btree (employee_id);


--
-- TOC entry 4857 (class 1259 OID 21035)
-- Name: idx_docs_employee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_docs_employee ON public.employee_documents USING btree (employee_id);


--
-- TOC entry 4868 (class 1259 OID 21038)
-- Name: idx_employees_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employees_code ON public.employees USING btree (employee_code);


--
-- TOC entry 4869 (class 1259 OID 21039)
-- Name: idx_employees_dept; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employees_dept ON public.employees USING btree (department_id);


--
-- TOC entry 4870 (class 1259 OID 21040)
-- Name: idx_employees_join_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employees_join_date ON public.employees USING btree (join_date);


--
-- TOC entry 4871 (class 1259 OID 21041)
-- Name: idx_employees_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_employees_status ON public.employees USING btree (status);


--
-- TOC entry 4844 (class 1259 OID 21030)
-- Name: uq_benefit_types_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_benefit_types_name ON public.benefit_types USING btree (name, type);


--
-- TOC entry 4847 (class 1259 OID 21031)
-- Name: uq_departments_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_departments_name ON public.departments USING btree (name);


--
-- TOC entry 4872 (class 2606 OID 21042)
-- Name: auth_users auth_users_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4873 (class 2606 OID 21047)
-- Name: departments departments_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4874 (class 2606 OID 21052)
-- Name: departments departments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.departments(department_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4875 (class 2606 OID 21057)
-- Name: employee_benefits employee_benefits_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_benefits
    ADD CONSTRAINT employee_benefits_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4876 (class 2606 OID 21062)
-- Name: employee_benefits employee_benefits_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_benefits
    ADD CONSTRAINT employee_benefits_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.benefit_types(type_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4877 (class 2606 OID 21067)
-- Name: employee_contacts employee_contacts_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_contacts
    ADD CONSTRAINT employee_contacts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4878 (class 2606 OID 21072)
-- Name: employee_documents employee_documents_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_documents
    ADD CONSTRAINT employee_documents_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4879 (class 2606 OID 21077)
-- Name: employee_payroll_components employee_payroll_components_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_payroll_components
    ADD CONSTRAINT employee_payroll_components_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4880 (class 2606 OID 21082)
-- Name: employee_payroll_components employee_payroll_components_salary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_payroll_components
    ADD CONSTRAINT employee_payroll_components_salary_id_fkey FOREIGN KEY (salary_id) REFERENCES public.employee_salaries(salary_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4881 (class 2606 OID 21087)
-- Name: employee_positions employee_positions_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_positions
    ADD CONSTRAINT employee_positions_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4882 (class 2606 OID 21092)
-- Name: employee_salaries employee_salaries_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_salaries
    ADD CONSTRAINT employee_salaries_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4883 (class 2606 OID 21097)
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-10-03 10:55:43

--
-- PostgreSQL database dump complete
--

\unrestrict l0IPqR0dfFLcbeotaQLHmWdEWyvi6I3w7SMqPEsumLGQRfSQXPQbFOyVMqZcWed

