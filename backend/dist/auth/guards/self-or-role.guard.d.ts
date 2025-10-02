import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SelfOrRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
