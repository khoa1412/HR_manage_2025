import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity({ name: 'employees' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'employee_id' })
  employeeId!: string;

  @Column({ name: 'employee_code', type: 'varchar', length: 50, unique: true })
  employeeCode!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 200 })
  fullName!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'date', nullable: true })
  dob?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender?: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate!: string;

  @Column({ name: 'join_date', type: 'date', nullable: true })
  joinDate?: string;

  @Column({ type: 'enum', enum: ['Active','Inactive','Probation','Terminated'], enumName: 'employment_status_enum', default: 'Active' })
  status!: 'Active'|'Inactive'|'Probation'|'Terminated';

  @Column({ name: 'department_id', type: 'bigint', nullable: true })
  departmentId?: string;

  @Column({ name: 'official_salary', type: 'numeric', precision: 12, scale: 2, nullable: true })
  officialSalary?: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => Department, (d) => d.employees, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;
}


