import { IsDateString, IsEmail, IsIn, IsOptional, IsString, IsNumberString } from 'class-validator';

export class UpdateEmployeeDto {
  // Thông tin cơ bản
  @IsOptional() @IsString() employeeCode?: string;
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsDateString() dob?: string;
  @IsOptional() @IsString() birthPlace?: string;
  @IsOptional() @IsIn(['male','female','other']) gender?: 'male'|'female'|'other';
  @IsOptional() @IsString() cccdNumber?: string;
  @IsOptional() @IsDateString() cccdIssueDate?: string;
  @IsOptional() @IsString() cccdIssuePlace?: string;
  @IsOptional() @IsString() maritalStatus?: string;
  
  // Thông tin liên hệ
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
  // Các trường công việc/phúc lợi tách bảng riêng trong schema mới → bỏ khỏi DTO update staff_info
  
  // Phúc lợi
  
  // Thông tin hệ thống
  @IsOptional() @IsIn(['Active','Inactive','Probation','Terminated']) status?: 'Active'|'Inactive'|'Probation'|'Terminated';
}


