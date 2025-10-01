import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBenefitDto {
  @IsString() typeId!: string; // bigint as string
  @IsOptional() @IsString() amount?: string; // numeric as string
  @IsDateString() startDate!: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() notes?: string;
}


