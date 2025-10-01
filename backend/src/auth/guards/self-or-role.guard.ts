import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SelfOrRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { role?: string; employeeId?: string } | undefined;
    if (!user) return false;
    if (user.role && ['admin', 'hr'].includes(user.role)) return true;
    const paramId = req.params?.['id'];
    if (user.role === 'employee' && paramId && user.employeeId === paramId) return true;
    return false;
  }
}


