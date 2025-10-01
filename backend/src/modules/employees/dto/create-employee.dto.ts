import { IsDateString, IsEmail, IsIn, IsOptional, IsString, IsNumberString } from 'class-validator';

export class CreateEmployeeDto {
  // Thông tin cơ bản
  @IsOptional() @IsString() employeeCode?: string;
  @IsString() fullName!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsDateString() dob?: string;
  @IsOptional() @IsString() birthPlace?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() cccdNumber?: string;
  @IsOptional() @IsDateString() cccdIssueDate?: string;
  @IsOptional() @IsString() cccdIssuePlace?: string;
  @IsOptional() @IsString() maritalStatus?: string;
  
  // Thông tin liên hệ
  @IsOptional() @IsString() personalPhone?: string;
  @IsOptional() @IsEmail() personalEmail?: string;
  @IsOptional() @IsString() temporaryAddress?: string;
  @IsOptional() @IsString() permanentAddress?: string;
  
  // Thông tin liên hệ khẩn cấp
  @IsOptional() @IsString() emergencyContactName?: string;
  @IsOptional() @IsString() emergencyContactRelation?: string;
  @IsOptional() @IsString() emergencyContactPhone?: string;
  
  // Thông tin học vấn
  @IsOptional() @IsString() highestDegree?: string;
  @IsOptional() @IsString() university?: string;
  @IsOptional() @IsString() major?: string;
  @IsOptional() @IsString() otherCertificates?: string;
  @IsOptional() @IsString() languages?: string;
  @IsOptional() @IsString() languageLevel?: string;
  
  // Thông tin Thuế - BHXH
  @IsOptional() @IsString() socialInsuranceCode?: string;
  @IsOptional() @IsString() taxCode?: string;
  
  // Thông tin công việc
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() position?: string;
  @IsOptional() @IsString() level?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() contractType?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsString() contractDuration?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsNumberString() probationSalary?: string;
  @IsOptional() @IsNumberString() officialSalary?: string;
  
  // Phúc lợi
  @IsOptional() @IsNumberString() fuelAllowance?: string;
  @IsOptional() @IsNumberString() mealAllowance?: string;
  @IsOptional() @IsNumberString() transportAllowance?: string;
  @IsOptional() @IsNumberString() uniformAllowance?: string;
  @IsOptional() @IsNumberString() performanceBonus?: string;
  
  // Thông tin hệ thống
  @IsOptional() @IsIn(['Active','Inactive','Probation','Terminated']) status?: 'Active'|'Inactive'|'Probation'|'Terminated';
  @IsOptional() @IsDateString() hireDate?: string;
  @IsOptional() @IsDateString() joinDate?: string;
  @IsOptional() @IsString() departmentId?: string;
}


