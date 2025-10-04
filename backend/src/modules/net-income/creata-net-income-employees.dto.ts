import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateInsuranceDto {
  @IsOptional() @IsDateString() month?: string; // insurances.month
  @IsOptional() @IsString() staffBhxh?: string; // insurances.staff_bhxh (numeric as string)
  @IsOptional() @IsString() staffBhyt?: string; // insurances.staff_bhyt (numeric as string)
  @IsOptional() @IsString() staffBhtn?: string; // insurances.staff_bhtn (numeric as string)
  @IsOptional() @IsString() companyContribution?: string; // insurances.company_contribution (numeric as string)
  @IsOptional() @IsString() createdBy?: string; // insurances.created_by
}
