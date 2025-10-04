import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { CreateEmployeeDto } from './dto/create_dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatePositionDto } from './dto/create_dto/create-position.dto';
import { CreateSalaryDto } from './dto/create_dto/create-salary.dto';
import { CreateContactDto } from './dto/create_dto/create-contact.dto';
import { CreateCitizenIdDto } from './dto/create_dto/create-citizen.dto';
import { CreateEducationDto } from './dto/create_dto/create-education.dto';
import { CreateStaffAccDto } from './dto/create_dto/create-staff-acc.dto';
import { CreateTaxInsuranceDto } from './dto/create_dto/create-tax-insurance.dto';
import { CreateResignInfoDto } from './dto/create_dto/create-resign-info.dto';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: QueryEmployeeDto) {
    const { 
      q, 
      status, 
      departmentId, 
      joinDateFrom, 
      joinDateTo, 
      hasPosition, 
      hasActiveBenefits, 
      page = 1, 
      pageSize = 20, 
      sort 
    } = query as any;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Build where conditions (schema mới: staff_info)
    const where: Prisma.staff_infoWhereInput = {};

    if (q) {
      where.OR = [
        { staff_code: { contains: q, mode: 'insensitive' } },
        { full_name: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (status?.length) {
      // map status danh nghĩa sang is_active boolean (Active => true, khác => false)
      where.is_active = status.includes('Active') ? true : undefined;
    }

    if (departmentId) {
      where.pos_info = { some: { department_id: Number(departmentId) } };
    }

    // staff_info không có join_date; bỏ lọc này ở schema mới

    // Build orderBy
    const orderBy: Prisma.staff_infoOrderByWithRelationInput[] = [];
    if (sort) {
      const parts = sort.split(',');
      for (const part of parts) {
        const [field, direction] = part.split(':');
        const dir = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        
        switch (field) {
          case 'employeeCode':
            orderBy.push({ staff_code: dir });
            break;
          case 'fullName':
            orderBy.push({ full_name: dir });
            break;
          case 'status':
            orderBy.push({ is_active: dir });
            break;
        }
      }
    }

    if (orderBy.length === 0) {
      orderBy.push({ id: 'desc' });
    }

    const [employees, total] = await Promise.all([
      this.prisma.staff_info.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          pos_info: true,
        }
      }),
      this.prisma.staff_info.count({ where })
    ]);

    // Transform to match expected format
    const items = employees.map(emp => ({
      id: String(emp.id),
      employeeCode: emp.staff_code,
      fullName: emp.full_name,
      status: emp.is_active ? 'Active' : 'Inactive',
      department: emp.pos_info?.[0]?.department_id ?? null,
      position: emp.pos_info?.[0]?.position ?? null,
    }));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async findDetailById(id: string) {
    const employee = await this.prisma.staff_info.findUnique({
      where: { id: Number(id) },
      include: {
        staff_acc: true,
        citizen_id: true,
        contact: true,
        emergency_contact: true,
        tax_n_insurance: true,
        education: true,
        certifications: true,
        pos_info: true,
        salary: true,
        resign_info: true,
        contract: true,
        insurances: true,
        tax: true,
        attendance: true,
        leave_requests: true,
      }
    });

    if (!employee) return null;

    return {
      id: String(employee.id),
      employeeCode: employee.staff_code,
      fullName: employee.full_name,
      dateBirth: employee.date_birth,
      placeBirth: employee.place_birth,
      gender: employee.gender,
      maritalStatus: employee.marital_status,
      isActive: employee.is_active,
      contact: employee.contact ?? null,
      emergency_contact: employee.emergency_contact ?? null,
      citizen_id: employee.citizen_id ?? null,
      tax_n_insurance: employee.tax_n_insurance ?? null,
      education: employee.education,
      certifications: employee.certifications,
      pos_info: employee.pos_info,
      salary: employee.salary,
      resign_info: employee.resign_info ?? null,
      contract: employee.contract,
      insurances: employee.insurances,
      tax: employee.tax,
      attendance: employee.attendance,
      leave_requests: employee.leave_requests,
    };
  }

  async findBasicById(id: string) {
    const employee = await this.prisma.staff_info.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        staff_code: true,
        full_name: true,
        is_active: true,
      }
    });

    if (!employee) return null;

    return {
      id: String(employee.id),
      employeeCode: employee.staff_code,
      fullName: employee.full_name,
      status: employee.is_active ? 'Active' : 'Inactive'
    };
  }

  async create(dto: CreateEmployeeDto) {
    const employee = await this.prisma.staff_info.create({
      data: {
        staff_code: dto.employeeCode || `EMP${Date.now()}`,
        full_name: dto.fullName,
        date_birth: dto.dob ? new Date(dto.dob) : null,
        place_birth: dto.birthPlace,
        gender: (dto.gender as any) ?? null,
        marital_status: dto.maritalStatus,
        is_active: dto.status ? dto.status === 'Active' : true,
      }
    });

    return this.findDetailById(String(employee.id));
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const updateData: Prisma.staff_infoUpdateInput = {};
    if (dto.employeeCode !== undefined) updateData.staff_code = dto.employeeCode;
    if (dto.fullName !== undefined) updateData.full_name = dto.fullName;
    if (dto.dob !== undefined) updateData.date_birth = dto.dob ? new Date(dto.dob) : null;
    if (dto.birthPlace !== undefined) updateData.place_birth = dto.birthPlace;
    if (dto.gender !== undefined) updateData.gender = dto.gender as any;
    if (dto.maritalStatus !== undefined) updateData.marital_status = dto.maritalStatus;
    if (dto.status !== undefined) updateData.is_active = dto.status === 'Active';

    const employee = await this.prisma.staff_info.update({
      where: { id: Number(id) },
      data: updateData
    });

    return this.findDetailById(String(employee.id));
  }

  async delete(id: string) {
    await this.prisma.staff_info.delete({
      where: { id: Number(id) }
    });
    return { success: true };
  }

  async remove(id: string, hard: boolean = false) {
    if (hard) {
      return this.delete(id);
    } else {
      // Soft delete by updating status
      await this.prisma.staff_info.update({
        where: { id: Number(id) },
        data: { is_active: false }
      });
      return { success: true };
    }
  }

  async terminate(id: string, body: any) {
    await this.prisma.staff_info.update({
      where: { id: Number(id) },
      data: { is_active: false }
    });
    return { success: true };
  }

  // Stub methods for missing functionality - these would need to be implemented based on requirements
  async listPositions(id: string, activeOnly: boolean = false) {
    // This would require a separate positions table or use the position field
    return [];
  }

  async addPosition(employeeId: string, dto: CreatePositionDto) {
    // This would require a separate positions table
    return { success: true };
  }

  async updatePosition(employeeId: string, positionId: string, dto: Partial<CreatePositionDto>) {
    // This would require a separate positions table
    return { success: true };
  }

  async deletePosition(id: string, positionId: string) {
    // This would require a separate positions table
    return { success: true };
  }

  async listSalaries(id: string) {
    const items = await this.prisma.salary.findMany({
      where: { staff_code: { equals: (await this.prisma.staff_info.findUnique({ where: { id: Number(id) }, select: { staff_code: true } }))?.staff_code ?? '' } },
      orderBy: { effective_date: 'desc' }
    });
    return items;
  }

  async addSalary(employeeId: string, dto: CreateSalaryDto) {
    const staff = await this.prisma.staff_info.findUnique({ where: { id: Number(employeeId) }, select: { staff_code: true } });
    if (!staff?.staff_code) return { success: false } as any;
    await this.prisma.salary.create({
      data: {
        staff_code: staff.staff_code,
        base_salary: parseFloat(dto.baseSalary),
        perform_bonus: dto.notes ? undefined : undefined,
        effective_date: dto.effectiveDate ? new Date(dto.effectiveDate) : null,
      }
    });
    return { success: true };
  }

  async updateSalary(id: string, salaryId: string, dto: CreateSalaryDto) {
    await this.prisma.salary.update({
      where: { id: Number(salaryId) },
      data: {
        base_salary: parseFloat(dto.baseSalary),
        effective_date: dto.effectiveDate ? new Date(dto.effectiveDate) : null,
      }
    });
    return { success: true };
  }

  async deleteSalary(id: string, salaryId: string) {
    return { success: true };
  }

  async getCurrentSalary(id: string) {
    const salaries = await this.listSalaries(id);
    return salaries[0] || null;
  }

  // Benefits APIs đã được xóa khỏi hệ thống

  async listContacts(id: string) {
    const staff = await this.prisma.staff_info.findUnique({ where: { id: Number(id) }, include: { contact: true, emergency_contact: true } });
    if (!staff) return [];
    const items: any[] = [];
    if (staff.contact) items.push({ id: String(staff.contact.id), type: 'contact', tempAddress: staff.contact.temp_address, permAddress: staff.contact.permant_address });
    if (staff.emergency_contact) items.push({ id: String(staff.emergency_contact.id), type: 'emergency', name: staff.emergency_contact.name_emergency, relationship: staff.emergency_contact.relationship, phone: staff.emergency_contact.rela_phone });
    return items;
  }

  async addContact(id: string, dto: any) {
    const staff = await this.prisma.staff_info.findUnique({ where: { id: Number(id) }, select: { staff_code: true } });
    if (!staff?.staff_code) return { success: false } as any;
    const created = await this.prisma.contact.create({
      data: {
        staff_code: staff.staff_code,
        temp_address: dto.temporaryAddress ?? null,
        permant_address: dto.permanentAddress ?? null,
      }
    });
    return { id: String(created.id) } as any;
  }

  async deleteContact(id: string, contactId: string) {
    await this.prisma.contact.delete({ where: { id: Number(contactId) } });
    return { success: true };
  }

  async listDocuments(id: string) {
    const staff = await this.prisma.staff_info.findUnique({ where: { id: Number(id) }, include: { certifications: true, education: true } });
    if (!staff) return [];
    const items: any[] = [];
    items.push(...staff.certifications.map(c => ({ id: String(c.id), docType: 'cert', attachment: c.attachment_image, issueDate: c.issue_at, expiryDate: c.expires_at })));
    items.push(...staff.education.map(e => ({ id: String(e.id), docType: 'education', attachment: e.attachment_image, year: e.year })));
    return items;
  }

  async addDocument(id: string, dto: any) {
    const staff = await this.prisma.staff_info.findUnique({ where: { id: Number(id) }, select: { staff_code: true } });
    if (!staff?.staff_code) return { success: false } as any;
    if (dto.docType === 'cert') {
      const c = await this.prisma.certifications.create({ data: { staff_code: staff.staff_code, attachment_image: dto.filePath ?? null, issue_at: dto.issueDate ? new Date(dto.issueDate) : null, expires_at: dto.expiryDate ? new Date(dto.expiryDate) : null } });
      return { id: String(c.id) } as any;
    }
    if (dto.docType === 'education') {
      const e = await this.prisma.education.create({ data: { staff_code: staff.staff_code, attachment_image: dto.filePath ?? null, year: dto.year ? Number(dto.year) : null } });
      return { id: String(e.id) } as any;
    }
    return { success: false } as any;
  }

  async deleteDocument(id: string, docId: string) {
    try {
      await this.prisma.certifications.delete({ where: { id: Number(docId) } });
      return { success: true };
    } catch {}
    try {
      await this.prisma.education.delete({ where: { id: Number(docId) } });
      return { success: true };
    } catch {}
    return { success: false } as any;
  }

  // Helper methods
  async getDepartments() {
    const departments = await this.prisma.department.findMany({
      orderBy: { department_name: 'asc' }
    });

    return departments.map(dept => ({
      id: dept.department_id.toString(),
      name: dept.department_name,
    }));
  }

  async getBenefitTypes() {
    return [];
  }

  // Staff Account Management (HR only)
  async createStaffAccount(employeeId: string, dto: CreateStaffAccDto) {
    const employee = await this.prisma.staff_info.findUnique({
      where: { id: Number(employeeId) }
    });
    if (!employee) throw new Error('Employee not found');

    return this.prisma.staff_acc.create({
      data: {
        staff_name: dto.staffName,
        role: dto.role,
        acc_name: dto.accName,
        password_hash: dto.passwordHash,
        staff_code: employee.staff_code
      }
    });
  }

  // Contact Information (HR only)
  async createContact(employeeId: string, dto: CreateContactDto) {
    const employee = await this.prisma.staff_info.findUnique({
      where: { id: Number(employeeId) }
    });
    if (!employee) throw new Error('Employee not found');

    return this.prisma.contact.create({
      data: {
        staff_code: employee.staff_code,
        temp_address: dto.temporaryAddress,
        permant_address: dto.permanentAddress
      }
    });
  }

  // Citizen ID Information (HR only)
  async createCitizenId(employeeId: string, dto: CreateCitizenIdDto) {
    const employee = await this.prisma.staff_info.findUnique({
      where: { id: Number(employeeId) }
    });
    if (!employee) throw new Error('Employee not found');

    return this.prisma.citizen_id.create({
      data: {
        staff_code: employee.staff_code,
        cccd: dto.cccd,
        date_issue: dto.dateIssue ? new Date(dto.dateIssue) : null,
        place_issue: dto.placeIssue,
        image_front_cccd: dto.imageFront,
        image_back_cccd: dto.imageBack
      }
    });
  }

  // Education Records (HR only)
  async createEducation(employeeId: string, dto: CreateEducationDto) {
    const employee = await this.prisma.staff_info.findUnique({
      where: { id: Number(employeeId) }
    });
    if (!employee) throw new Error('Employee not found');

    return this.prisma.education.create({
      data: {
        staff_code: employee.staff_code,
        degree: dto.degree,
        institution: dto.institution,
        major: dto.major,
        year: dto.year,
        attachment_image: dto.attachmentImage
      }
    });
  }

  // Tax & Insurance (HR only)
  async createTaxInsurance(employeeId: string, dto: CreateTaxInsuranceDto) {
    const employee = await this.prisma.staff_info.findUnique({
      where: { id: Number(employeeId) }
    });
    if (!employee) throw new Error('Employee not found');

    return this.prisma.tax_n_insurance.create({
      data: {
        staff_code: employee.staff_code,
        social_insuran: dto.socialInsurance,
        tax_code: dto.taxCode
      }
    });
  }

  // Resignation Information (HR only)
  async createResignInfo(employeeId: string, dto: CreateResignInfoDto) {
    const employee = await this.prisma.staff_info.findUnique({
      where: { id: Number(employeeId) }
    });
    if (!employee) throw new Error('Employee not found');

    return this.prisma.resign_info.create({
      data: {
        staff_code: employee.staff_code,
        leave_day: dto.leaveDay ? new Date(dto.leaveDay) : null,
        items_employee: dto.itemsEmployee,
        items_company: dto.itemsCompany,
        social_insuran_detach: dto.socialInsuranceDetach,
        terminate_decision: dto.terminateDecision,
        tax_withhold_paper: dto.taxWithholdPaper
      }
    });
  }
}