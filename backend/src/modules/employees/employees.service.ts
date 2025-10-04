import { Injectable, ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EmployeesRepository } from './employees.repository';
import { CreateEmployeeDto } from './dto/create_dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { CreatePositionDto } from './dto/create_dto/create-position.dto';
import { CreateSalaryDto } from './dto/create_dto/create-salary.dto';
import { CreateContactDto } from './dto/create_dto/create-contact.dto';
import { CreateCitizenIdDto } from './dto/create_dto/create-citizen.dto';
import { CreateEducationDto } from './dto/create_dto/create-education.dto';
import { CreateStaffAccDto } from './dto/create_dto/create-staff-acc.dto';
import { CreateTaxInsuranceDto } from './dto/create_dto/create-tax-insurance.dto';
import { CreateResignInfoDto } from './dto/create_dto/create-resign-info.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly repo: EmployeesRepository) {}

  async list(query: QueryEmployeeDto) {
    return this.repo.list(query);
  }

  async getById(id: string) {
    const detail = await this.repo.findDetailById(id);
    if (!detail) throw new NotFoundException('Employee not found');
    return detail;
  }

  async create(dto: CreateEmployeeDto) {
    this.validateDates(dto);
    try {
      return await this.repo.create(dto);
    } catch (e: any) {
      if (e?.code === '23505') {
        if (String(e?.detail ?? '').includes('employee_code')) throw new ConflictException('employeeCode already exists');
        if (String(e?.detail ?? '').includes('email')) throw new ConflictException('email already exists');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const current = await this.repo.findBasicById(id);
    if (!current) throw new NotFoundException('Employee not found');
    this.validateDates(dto, current);
    return this.repo.update(id, dto);
  }

  async remove(id: string, hard: boolean) {
    return this.repo.remove(id, hard);
  }

  private validateDates(dto: CreateEmployeeDto | UpdateEmployeeDto, current?: any) {
    const dob = (dto as any).dob ?? current?.dob;
    // staff_info không còn hire/join date ở schema mới → chỉ kiểm tra dob hợp lệ nếu cần
    if (dob && isNaN(Date.parse(dob))) throw new UnprocessableEntityException('dob is invalid');
  }

  async terminate(id: string, body: { date: string; reason?: string }) {
    return this.repo.terminate(id, body);
  }

  // Positions
  async listPositions(id: string, activeOnly: boolean) {
    return this.repo.listPositions(id, activeOnly);
  }
  async addPosition(id: string, dto: CreatePositionDto) {
    try {
      return await this.repo.addPosition(id, dto);
    } catch (e: any) {
      if (e?.constraint === 'ex_positions_no_overlap') {
        throw new ConflictException('Position period overlaps existing records');
      }
      throw e;
    }
  }
  async updatePosition(id: string, positionId: string, dto: CreatePositionDto) {
    try {
      return await this.repo.updatePosition(id, positionId, dto);
    } catch (e: any) {
      if (e?.constraint === 'ex_positions_no_overlap') {
        throw new ConflictException('Position period overlaps existing records');
      }
      throw e;
    }
  }
  async deletePosition(id: string, positionId: string) {
    return this.repo.deletePosition(id, positionId);
  }

  // Salaries
  async listSalaries(id: string) {
    return this.repo.listSalaries(id);
  }
  async addSalary(id: string, dto: CreateSalaryDto) {
    try {
      return await this.repo.addSalary(id, dto);
    } catch (e: any) {
      if (e?.constraint === 'ex_salaries_no_overlap') {
        throw new ConflictException('Salary period overlaps existing records');
      }
      throw e;
    }
  }
  async updateSalary(id: string, salaryId: string, dto: CreateSalaryDto) {
    try {
      return await this.repo.updateSalary(id, salaryId, dto);
    } catch (e: any) {
      if (e?.constraint === 'ex_salaries_no_overlap') {
        throw new ConflictException('Salary period overlaps existing records');
      }
      throw e;
    }
  }
  async deleteSalary(id: string, salaryId: string) {
    return this.repo.deleteSalary(id, salaryId);
  }
  async getCurrentSalary(id: string) {
    return this.repo.getCurrentSalary(id);
  }

  // Benefits APIs đã được xóa khỏi hệ thống

  // Contacts
  async listContacts(id: string) {
    return this.repo.listContacts(id);
  }
  async addContact(id: string, dto: { contactName: string; relationship?: string; phone?: string }) {
    return this.repo.addContact(id, dto);
  }
  async deleteContact(id: string, contactId: string) {
    return this.repo.deleteContact(id, contactId);
  }

  // Documents
  async listDocuments(id: string) {
    return this.repo.listDocuments(id);
  }
  async addDocument(id: string, dto: { docType: string; filePath?: string; issueDate?: string; expiryDate?: string }) {
    return this.repo.addDocument(id, dto);
  }
  async deleteDocument(id: string, docId: string) {
    return this.repo.deleteDocument(id, docId);
  }

  // Staff Account Management (HR only)
  async createStaffAccount(id: string, dto: CreateStaffAccDto) {
    const employee = await this.repo.findBasicById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.repo.createStaffAccount(id, dto);
  }

  // Contact Information (HR only)
  async createContact(id: string, dto: CreateContactDto) {
    const employee = await this.repo.findBasicById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.repo.createContact(id, dto);
  }

  // Citizen ID Information (HR only)
  async createCitizenId(id: string, dto: CreateCitizenIdDto) {
    const employee = await this.repo.findBasicById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.repo.createCitizenId(id, dto);
  }

  // Education Records (HR only)
  async createEducation(id: string, dto: CreateEducationDto) {
    const employee = await this.repo.findBasicById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.repo.createEducation(id, dto);
  }

  // Tax & Insurance (HR only)
  async createTaxInsurance(id: string, dto: CreateTaxInsuranceDto) {
    const employee = await this.repo.findBasicById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.repo.createTaxInsurance(id, dto);
  }

  // Resignation Information (HR only)
  async createResignInfo(id: string, dto: CreateResignInfoDto) {
    const employee = await this.repo.findBasicById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.repo.createResignInfo(id, dto);
  }
}


