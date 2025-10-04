import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { staff_role_enum } from '../../../generated/prisma';

@Injectable()
export class HrRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy thông tin user từ request (giả định có middleware set user)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Kiểm tra role có phải HR không
    const allowedRoles = [staff_role_enum.hr_staff, staff_role_enum.hr_manager];
    
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Only HR staff and HR managers can perform this action');
    }

    return true;
  }
}
