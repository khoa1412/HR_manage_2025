import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateEducationDto {
  @IsOptional() @IsString() degree?: string; // education.degree
  @IsOptional() @IsString() institution?: string; // education.institution
  @IsOptional() @IsString() major?: string; // education.major
  @IsOptional() @IsInt() @Min(1900) @Max(3000) year?: number; // education.year
  @IsOptional() @IsString() attachmentImage?: string; // education.attachment_image (URL)
}

export class CreateCertificationDto {
  @IsOptional() @IsString() language?: string; // certifications.language
  @IsOptional() @IsString() level?: string; // certifications.level
  @IsOptional() @IsString() score?: string; // certifications.score (numeric as string)
  @IsOptional() @IsString() attachmentImage?: string; // certifications.attachment_image (URL)
  @IsOptional() @IsString() issueAt?: string; // DATE string
  @IsOptional() @IsString() expiresAt?: string; // DATE string
}

