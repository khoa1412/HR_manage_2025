import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty() title!: string;
  @IsDateString() startDate!: string;
  @IsOptional() @IsDateString() endDate?: string;
}


