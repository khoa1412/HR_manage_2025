import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateContractDto {
  @IsOptional() @IsInt() type?: number; // contract.type (FK to contract_types.id)
  @IsOptional() @IsDateString() startDate?: string; // contract.start_date
  @IsOptional() @IsDateString() endDate?: string; // contract.end_date
}
