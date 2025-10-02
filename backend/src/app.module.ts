import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './modules/employees/employees.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EmployeesModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
