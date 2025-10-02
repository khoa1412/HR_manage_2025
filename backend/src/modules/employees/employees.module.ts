import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './employees.repository';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository, PrismaService],
  exports: [EmployeesService],
})
export class EmployeesModule {}


