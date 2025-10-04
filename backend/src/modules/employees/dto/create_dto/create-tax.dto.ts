import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTaxDto {
  @IsOptional() @IsString() taxType?: string; // tax.tax_type
  @IsOptional() @IsIn(['monthly','yearly']) periodType?: 'monthly'|'yearly'; // tax.period_type
  @IsOptional() @IsString() amount?: string; // tax.amount (numeric as string)
  @IsOptional() @IsInt() dependents?: number; // tax.dependents
  @IsOptional() @IsString() createdBy?: string; // tax.created_by
}
