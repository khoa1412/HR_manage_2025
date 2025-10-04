import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCitizenIdDto {
  @IsString() cccd!: string; // citizen_id.cccd
  @IsOptional() @IsDateString() dateIssue?: string; // citizen_id.date_issue
  @IsOptional() @IsString() placeIssue?: string; // citizen_id.place_issue
  @IsOptional() @IsString() imageFront?: string; // citizen_id.image_front_cccd (URL)
  @IsOptional() @IsString() imageBack?: string; // citizen_id.image_back_cccd (URL)
}

