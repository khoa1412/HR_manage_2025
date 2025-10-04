import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsOptional() departmentId?: number; // pos_info.department_id (optional)
  @IsNotEmpty() @IsString() position!: string; // pos_info.position
  @IsOptional() @IsDateString() effectiveDate?: string; // pos_info.effective_date
}


