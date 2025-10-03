import { IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsOptional() @IsString() temporaryAddress?: string; // contact.temp_address
  @IsOptional() @IsString() permanentAddress?: string; // contact.permant_address
}

export class CreateEmergencyContactDto {
  @IsOptional() @IsString() phoneNumber?: string; // emergency_contact.phone_number
  @IsOptional() @IsString() email?: string; // emergency_contact.email
  @IsOptional() @IsString() nameEmergency?: string; // emergency_contact.name_emergency
  @IsOptional() @IsString() relationship?: string; // emergency_contact.relationship
  @IsOptional() @IsString() relaPhone?: string; // emergency_contact.rela_phone
}

