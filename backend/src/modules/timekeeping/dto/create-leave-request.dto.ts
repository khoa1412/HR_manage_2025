import { IsDateString, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsOptional() @IsDateString() startDate?: string; // leave_requests.start_date
  @IsOptional() @IsDateString() endDate?: string; // leave_requests.end_date
  @IsOptional() @IsString() note?: string; // leave_requests.note
  @IsOptional() @IsIn(['pending','approved','rejected']) status?: 'pending'|'approved'|'rejected'; // leave_requests.status
  @IsOptional() @IsInt() absentId?: number; // leave_requests.absent_id (FK to absent)
}
