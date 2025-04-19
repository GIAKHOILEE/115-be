import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string

  @Column({ type: 'varchar', length: 255 })
  email: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  birth?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  gender?: 'Male' | 'Female'

  @Column({ type: 'varchar', length: 100, nullable: true })
  role: 'Admin' | 'Doctor' | 'Patient'

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date
}
