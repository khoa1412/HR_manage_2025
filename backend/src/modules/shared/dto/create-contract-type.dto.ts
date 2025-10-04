import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContractTypeDto {
  @IsNotEmpty() @IsString() name!: string; // contract_types.name (unique)
  @IsOptional() @IsString() description?: string; // contract_types.description
}
