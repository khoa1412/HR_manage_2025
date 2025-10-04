import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStaffAccDto {
  @IsOptional() @IsString() staffName?: string; // staff_acc.staff_name
  @IsNotEmpty() @IsIn(['staff','chief','hr_staff','hr_manager']) role!: 'staff'|'chief'|'hr_staff'|'hr_manager'; // staff_acc.role
  @IsNotEmpty() @IsString() accName!: string; // staff_acc.acc_name (unique)
  @IsNotEmpty() @IsString() passwordHash!: string; // staff_acc.password_hash
  @IsNotEmpty() @IsString() staffCode!: string; // staff_acc.staff_code (FK to staff_info)
}
