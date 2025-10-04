import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty() @IsString() departmentName!: string; // department.department_name
  @IsOptional() @IsString() description?: string; // department.description
}
