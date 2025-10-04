import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAbsentDto {
  @IsNotEmpty() @IsIn(['paid_leave','persona_leave']) name!: 'paid_leave'|'persona_leave'; // absent.name
  @IsOptional() @IsString() description?: string; // absent.description
}
