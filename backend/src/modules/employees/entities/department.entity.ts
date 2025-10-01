import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeeEntity } from './employee.entity';

@Entity({ name: 'departments' })
export class Department {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'department_id' })
  departmentId!: string;

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name!: string;

  @Column({ name: 'manager_id', type: 'bigint', nullable: true })
  managerId?: string;

  @Column({ name: 'parent_id', type: 'bigint', nullable: true })
  parentId?: string;

  @Column({ name: 'budget', type: 'numeric', precision: 15, scale: 2, nullable: true })
  budget?: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => EmployeeEntity, (e) => e.department)
  employees?: EmployeeEntity[];
}


