import { IsOptional, IsString } from 'class-validator';

export class CreateTaxInsuranceDto {
  @IsOptional() @IsString() socialInsurance?: string; // tax_n_insurance.social_insuran
  @IsOptional() @IsString() taxCode?: string; // tax_n_insurance.tax_code (unique)
}
