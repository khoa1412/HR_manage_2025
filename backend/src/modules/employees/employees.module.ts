import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './employees.repository';
import { PrismaService } from '../../database/prisma.service';
import { HrRoleGuard } from '../../auth/guards/hr-role.guard';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository, PrismaService, HrRoleGuard],
  exports: [EmployeesService],
})
export class EmployeesModule {}


