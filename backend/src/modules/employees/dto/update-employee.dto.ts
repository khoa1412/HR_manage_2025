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
  
  // Thông tin liên hệ (bảng contact riêng) → không nằm trong DTO này
  
  // Thông tin liên hệ khẩn cấp (bảng emergency_contact riêng) → không nằm trong DTO này
  
  // Thông tin học vấn/chứng chỉ (bảng education/certifications riêng) → không nằm trong DTO này
  
  // Thuế/BHXH (bảng tax_n_insurance riêng) → không nằm trong DTO này
  
  // Thông tin công việc
  // Các trường công việc/phúc lợi tách bảng riêng trong schema mới → bỏ khỏi DTO update staff_info
  
  // Phúc lợi
  
  // Thông tin hệ thống
  @IsOptional() @IsIn(['Active','Inactive','Probation','Terminated']) status?: 'Active'|'Inactive'|'Probation'|'Terminated';
}


