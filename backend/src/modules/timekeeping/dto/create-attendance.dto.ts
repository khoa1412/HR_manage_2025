import { IsDateString, IsIn, IsInt, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsOptional() @IsDateString() checkin?: string; // attendance.checkin (TIMESTAMP)
  @IsOptional() @IsDateString() checkout?: string; // attendance.checkout (TIMESTAMP)
  @IsOptional() @IsIn(['present','absent','late']) attenType?: 'present'|'absent'|'late'; // attendance.atten_type
  @IsOptional() @IsInt() leaveReqId?: number; // attendance.leave_req_id (FK to leave_requests)
}
