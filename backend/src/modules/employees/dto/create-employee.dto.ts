import { IsDateString, IsEmail, IsIn, IsOptional, IsString, IsNumberString } from 'class-validator';

export class CreateEmployeeDto {
  // Thông tin cơ bản
  @IsOptional() @IsString() employeeCode?: string;
  @IsString() fullName!: string;
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
  
  // Thông tin liên hệ khẩn cấp (bảng riêng emergency_contact) → không nằm trong DTO này
  
  // Thông tin học vấn/chứng chỉ (bảng education/certifications) → không nằm trong DTO này
  
  // Thuế/BHXH (bảng tax_n_insurance) → không nằm trong DTO này
  
  // Thông tin công việc
  // Các trường công việc chi tiết tách bảng riêng trong schema mới → bỏ khỏi DTO tạo staff_info
  
  // Phúc lợi
  // Phúc lợi di chuyển sang bảng khác → không nằm trong DTO tạo staff_info
  
  // Thông tin hệ thống
  @IsOptional() @IsIn(['Active','Inactive','Probation','Terminated']) status?: 'Active'|'Inactive'|'Probation'|'Terminated';
}


