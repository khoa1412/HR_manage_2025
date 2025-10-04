import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { SelfOrRoleGuard } from '../../auth/guards/self-or-role.guard';
import { HrRoleGuard } from '../../auth/guards/hr-role.guard';
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

@Controller('employees')
// @UseGuards(SelfOrRoleGuard)
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Get()
  async list(@Query() query: QueryEmployeeDto) {
    return this.service.list(query);
  }

  @Get('me')
  async me(@Req() req: any) {
    // Tạm thời return mock data cho admin
    return {
      id: '1',
      employeeCode: 'EMP001',
      fullName: 'Nguyen Van An',
      email: 'an.nguyen@company.com',
      phone: '0901234567',
      department: 'Human Resources',
      position: 'HR Manager',
      joinDate: '2020-01-15',
      status: 'Active',
      officialSalary: 15000000
    };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @UseGuards(HrRoleGuard)
  async create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id, true);
  }

  @Post(':id/terminate')
  async terminate(@Param('id') id: string, @Body() body: { date: string; reason?: string }) {
    return this.service.terminate(id, body);
  }

  // Positions
  @Get(':id/positions')
  async listPositions(@Param('id') id: string, @Query('activeOnly') activeOnly?: string) {
    return this.service.listPositions(id, activeOnly === 'true');
  }

  @Post(':id/positions')
  @UseGuards(HrRoleGuard)
  async addPosition(@Param('id') id: string, @Body() dto: CreatePositionDto) {
    return this.service.addPosition(id, dto);
  }

  @Patch(':id/positions/:positionId')
  async updatePosition(
    @Param('id') id: string,
    @Param('positionId') positionId: string,
    @Body() dto: CreatePositionDto,
  ) {
    return this.service.updatePosition(id, positionId, dto);
  }

  @Delete(':id/positions/:positionId')
  async deletePosition(@Param('id') id: string, @Param('positionId') positionId: string) {
    return this.service.deletePosition(id, positionId);
  }

  // Salaries
  @Get(':id/salaries')
  async listSalaries(@Param('id') id: string) {
    return this.service.listSalaries(id);
  }

  @Get(':id/salaries/current')
  async currentSalary(@Param('id') id: string) {
    return this.service.getCurrentSalary(id);
  }

  @Post(':id/salaries')
  @UseGuards(HrRoleGuard)
  async addSalary(@Param('id') id: string, @Body() dto: CreateSalaryDto) {
    return this.service.addSalary(id, dto);
  }

  @Patch(':id/salaries/:salaryId')
  async updateSalary(
    @Param('id') id: string,
    @Param('salaryId') salaryId: string,
    @Body() dto: CreateSalaryDto,
  ) {
    return this.service.updateSalary(id, salaryId, dto);
  }

  @Delete(':id/salaries/:salaryId')
  async deleteSalary(@Param('id') id: string, @Param('salaryId') salaryId: string) {
    return this.service.deleteSalary(id, salaryId);
  }

  // Benefits APIs đã được xóa khỏi hệ thống

  // Contacts
  @Get(':id/contacts')
  async listContacts(@Param('id') id: string) {
    return this.service.listContacts(id);
  }

  @Post(':id/contacts')
  async addContact(
    @Param('id') id: string,
    @Body() body: { contactName: string; relationship?: string; phone?: string },
  ) {
    return this.service.addContact(id, body);
  }

  @Delete(':id/contacts/:contactId')
  async deleteContact(@Param('id') id: string, @Param('contactId') contactId: string) {
    return this.service.deleteContact(id, contactId);
  }

  // Documents
  @Get(':id/documents')
  async listDocuments(@Param('id') id: string) {
    return this.service.listDocuments(id);
  }

  @Post(':id/documents')
  async addDocument(
    @Param('id') id: string,
    @Body() body: { docType: string; filePath?: string; issueDate?: string; expiryDate?: string },
  ) {
    return this.service.addDocument(id, body);
  }

  @Delete(':id/documents/:docId')
  async deleteDocument(@Param('id') id: string, @Param('docId') docId: string) {
    return this.service.deleteDocument(id, docId);
  }

  // Staff Account Management (HR only)
  @Post(':id/staff-account')
  @UseGuards(HrRoleGuard)
  async createStaffAccount(@Param('id') id: string, @Body() dto: CreateStaffAccDto) {
    return this.service.createStaffAccount(id, dto);
  }

  // Contact Information (HR only)
  @Post(':id/contact')
  @UseGuards(HrRoleGuard)
  async createContact(@Param('id') id: string, @Body() dto: CreateContactDto) {
    return this.service.createContact(id, dto);
  }

  // Citizen ID Information (HR only)
  @Post(':id/citizen-id')
  @UseGuards(HrRoleGuard)
  async createCitizenId(@Param('id') id: string, @Body() dto: CreateCitizenIdDto) {
    return this.service.createCitizenId(id, dto);
  }

  // Education Records (HR only)
  @Post(':id/education')
  @UseGuards(HrRoleGuard)
  async createEducation(@Param('id') id: string, @Body() dto: CreateEducationDto) {
    return this.service.createEducation(id, dto);
  }

  // Tax & Insurance (HR only)
  @Post(':id/tax-insurance')
  @UseGuards(HrRoleGuard)
  async createTaxInsurance(@Param('id') id: string, @Body() dto: CreateTaxInsuranceDto) {
    return this.service.createTaxInsurance(id, dto);
  }

  // Resignation Information (HR only)
  @Post(':id/resign-info')
  @UseGuards(HrRoleGuard)
  async createResignInfo(@Param('id') id: string, @Body() dto: CreateResignInfoDto) {
    return this.service.createResignInfo(id, dto);
  }
}


