import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateSalaryDto {
  @IsString() baseSalary!: string; // numeric as string
  @IsDateString() effectiveDate!: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsString() notes?: string;
}


