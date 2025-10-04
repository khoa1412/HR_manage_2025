import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateResignInfoDto {
  @IsOptional() @IsDateString() leaveDay?: string; // resign_info.leave_day
  @IsOptional() @IsString() itemsEmployee?: string; // resign_info.items_employee
  @IsOptional() @IsString() itemsCompany?: string; // resign_info.items_company
  @IsOptional() @IsString() socialInsuranceDetach?: string; // resign_info.social_insuran_detach (URL)
  @IsOptional() @IsString() terminateDecision?: string; // resign_info.terminate_decision (URL)
  @IsOptional() @IsString() taxWithholdPaper?: string; // resign_info.tax_withhold_paper (URL)
}
