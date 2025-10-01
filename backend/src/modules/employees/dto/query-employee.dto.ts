import { IsArray, IsIn, IsInt, IsOptional, Matches, Max, Min, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryEmployeeDto {
  @IsOptional() q?: string;
  @IsOptional() @IsArray() @IsIn(['Active','Inactive','Probation','Terminated'], { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : undefined))
  status?: string[];
  @IsOptional() departmentId?: string;
  @IsOptional() @IsDateString() joinDateFrom?: string;
  @IsOptional() @IsDateString() joinDateTo?: string;
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') hasPosition?: boolean;
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') hasActiveBenefits?: boolean;
  @IsOptional() @IsInt() @Min(1) page: number = 1;
  @IsOptional() @IsInt() @Min(1) @Max(100) pageSize: number = 20;
  @IsOptional() @Matches(/^([\w.]+:(asc|desc))(,([\w.]+:(asc|desc)))*$/)
  sort?: string;
}


